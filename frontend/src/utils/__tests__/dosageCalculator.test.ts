import { describe, it, expect } from 'vitest'
import {
  getAgeCategory,
  isPediatric,
  calculateWeightBasedDose,
  calculateTotalDailyDose,
  validateMedicationForPatient,
  formatDosageCalculation,
  AGE_CATEGORIES
} from '../dosageCalculator'
import type { Patient, MedicationDatabase } from '../../types/patient'

// Mock patient data
const mockAdultPatient: Patient = {
  id: 1,
  name: 'John Doe',
  age: 35,
  gender: 'male',
  weight: 70,
  height: 175,
  caseNumber: 'TEST001',
  dateAdmitted: '2024-03-01',
  location: 'ICU',
  status: 'Active Admission',
  diagnosis: 'Test condition',
  dateOfBirth: '1989-01-01',
  civilStatus: 'single',
  nationality: 'American',
  religion: 'None',
  address: '123 Test St',
  philhealth: 'TEST123',
  primaryService: 'Internal Medicine',
  allergies: [
    {
      type: 'drug',
      allergen: 'Penicillin',
      reaction: 'Rash',
      severity: 'moderate'
    }
  ]
}

const mockPediatricPatient: Patient = {
  ...mockAdultPatient,
  id: 2,
  name: 'Jane Doe',
  age: 8,
  weight: 25,
  dateOfBirth: '2016-01-01'
}

const mockNeonatePatient: Patient = {
  ...mockAdultPatient,
  id: 3,
  name: 'Baby Doe',
  age: 0.02, // ~1 week old
  weight: 3.5,
  dateOfBirth: '2024-02-20'
}

// Mock medication data
const mockWeightBasedMedication: MedicationDatabase = {
  id: 'med-test-001',
  name: 'Amoxicillin',
  genericName: 'Amoxicillin',
  brandNames: ['Amoxil'],
  category: 'Antibiotic',
  commonDosages: [{ amount: 500, unit: 'mg' }],
  routes: ['oral'],
  isWeightBased: true,
  pediatricDosing: {
    minAge: 0,
    maxAge: 18,
    dosePerKg: 25,
    maxDose: 1000
  },
  adultDosing: {
    minDose: 250,
    maxDose: 1000,
    commonDose: 500
  },
  contraindications: ['Penicillin allergy', 'Amoxicillin allergy'],
  commonSideEffects: ['Nausea', 'Diarrhea']
}

const mockNonWeightBasedMedication: MedicationDatabase = {
  id: 'med-test-002',
  name: 'Lisinopril',
  genericName: 'Lisinopril',
  brandNames: ['Prinivil'],
  category: 'ACE Inhibitor',
  commonDosages: [{ amount: 10, unit: 'mg' }],
  routes: ['oral'],
  isWeightBased: false,
  adultDosing: {
    minDose: 5,
    maxDose: 40,
    commonDose: 10
  },
  contraindications: ['Pregnancy'],
  commonSideEffects: ['Dry cough']
}

describe('dosageCalculator', () => {
  describe('getAgeCategory', () => {
    it('should correctly categorize neonate', () => {
      expect(getAgeCategory(0.02)).toBe('NEONATE')
      expect(getAgeCategory(0.08)).toBe('NEONATE')
    })

    it('should correctly categorize infant', () => {
      expect(getAgeCategory(0.1)).toBe('INFANT')
      expect(getAgeCategory(1.5)).toBe('INFANT')
    })

    it('should correctly categorize child', () => {
      expect(getAgeCategory(3)).toBe('CHILD')
      expect(getAgeCategory(10)).toBe('CHILD')
    })

    it('should correctly categorize adolescent', () => {
      expect(getAgeCategory(13)).toBe('ADOLESCENT')
      expect(getAgeCategory(17)).toBe('ADOLESCENT')
    })

    it('should correctly categorize adult', () => {
      expect(getAgeCategory(25)).toBe('ADULT')
      expect(getAgeCategory(50)).toBe('ADULT')
    })

    it('should correctly categorize elderly', () => {
      expect(getAgeCategory(70)).toBe('ELDERLY')
      expect(getAgeCategory(85)).toBe('ELDERLY')
    })
  })

  describe('isPediatric', () => {
    it('should return true for patients under 18', () => {
      expect(isPediatric(0)).toBe(true)
      expect(isPediatric(8)).toBe(true)
      expect(isPediatric(17)).toBe(true)
    })

    it('should return false for patients 18 and over', () => {
      expect(isPediatric(18)).toBe(false)
      expect(isPediatric(25)).toBe(false)
      expect(isPediatric(65)).toBe(false)
    })
  })

  describe('calculateWeightBasedDose', () => {
    it('should calculate pediatric weight-based dose correctly', () => {
      const result = calculateWeightBasedDose(mockPediatricPatient, mockWeightBasedMedication)
      
      expect(result.patientWeight).toBe(25)
      expect(result.dosePerKg).toBe(25)
      expect(result.calculatedAmount).toBe(625) // 25 mg/kg * 25 kg
      expect(result.recommendedDose).toBe(625)
      expect(result.isWithinNormalRange).toBe(true)
      expect(result.formula).toContain('25 mg/kg × 25 kg = 625.0 mg')
    })

    it('should cap pediatric dose at maximum', () => {
      const heavyChild: Patient = { ...mockPediatricPatient, weight: 50 }
      const result = calculateWeightBasedDose(heavyChild, mockWeightBasedMedication)
      
      expect(result.calculatedAmount).toBe(1250) // 25 * 50
      expect(result.recommendedDose).toBe(1000) // Capped at max dose
      expect(result.warnings).toContain('Calculated dose exceeds maximum pediatric dose of 1000 mg')
    })

    it('should handle adult dosing for weight-based medications', () => {
      const result = calculateWeightBasedDose(mockAdultPatient, mockWeightBasedMedication)
      
      expect(result.patientWeight).toBe(70)
      expect(result.recommendedDose).toBeGreaterThan(0)
      expect(result.formula).toContain('mg/kg')
      // Adult patient should use adult dosing without pediatric warnings
      expect(result.warnings).not.toContain('Using adult dosing for pediatric patient - verify appropriateness')
    })

    it('should handle non-weight-based medications', () => {
      const result = calculateWeightBasedDose(mockAdultPatient, mockNonWeightBasedMedication)
      
      expect(result.recommendedDose).toBe(10) // Common adult dose
      expect(result.formula).toContain('Standard adult dose: 10 mg')
    })

    it('should warn when patient weight is missing', () => {
      const patientNoWeight: Patient = { ...mockPediatricPatient, weight: undefined }
      const result = calculateWeightBasedDose(patientNoWeight, mockWeightBasedMedication)
      
      expect(result.warnings).toContain('Patient weight is required for accurate dosage calculation')
      expect(result.isWithinNormalRange).toBe(false)
    })

    it('should add age-specific warnings', () => {
      const neonateResult = calculateWeightBasedDose(mockNeonatePatient, mockWeightBasedMedication)
      expect(neonateResult.warnings).toContain('Neonatal dosing requires special consideration - consult pediatric guidelines')

      const elderlyPatient: Patient = { ...mockAdultPatient, age: 75 }
      const elderlyResult = calculateWeightBasedDose(elderlyPatient, mockNonWeightBasedMedication)
      expect(elderlyResult.warnings).toContain('Consider dose reduction for elderly patient - monitor for increased sensitivity')
    })
  })

  describe('calculateTotalDailyDose', () => {
    it('should calculate daily dose correctly', () => {
      expect(calculateTotalDailyDose(10, 2, 'daily')).toBe(20)
      expect(calculateTotalDailyDose(5, 4, 'daily')).toBe(20)
    })

    it('should calculate weekly dose correctly', () => {
      expect(calculateTotalDailyDose(70, 1, 'weekly')).toBeCloseTo(10, 1) // 70/7
    })

    it('should calculate monthly dose correctly', () => {
      expect(calculateTotalDailyDose(300, 1, 'monthly')).toBe(10) // 300/30
    })
  })

  describe('validateMedicationForPatient', () => {
    it('should detect drug allergies', () => {
      // Test with direct medication name match
      const patientWithAmoxicillinAllergy: Patient = {
        ...mockAdultPatient,
        allergies: [
          {
            type: 'drug',
            allergen: 'Amoxicillin',
            reaction: 'Rash',
            severity: 'moderate'
          }
        ]
      }
      
      const warnings = validateMedicationForPatient(patientWithAmoxicillinAllergy, mockWeightBasedMedication, 500)
      
      expect(warnings).toContain('ALLERGY ALERT: Patient is allergic to Amoxicillin (moderate reaction: Rash)')
    })

    it('should check contraindications', () => {
      const femalePatient: Patient = { ...mockAdultPatient, gender: 'female' }
      const warnings = validateMedicationForPatient(femalePatient, mockNonWeightBasedMedication, 10)
      
      expect(warnings).toContain('CONTRAINDICATION: Pregnancy - verify pregnancy status')
    })

    it('should warn about pediatric use without pediatric dosing', () => {
      const warnings = validateMedicationForPatient(mockPediatricPatient, mockNonWeightBasedMedication, 10)
      
      expect(warnings).toContain('No pediatric dosing information available - use with caution')
    })
  })

  describe('formatDosageCalculation', () => {
    it('should format calculation with no warnings', () => {
      const calculation = {
        patientWeight: 70,
        dosePerKg: 10,
        calculatedAmount: 700,
        recommendedDose: 700,
        formula: '10 mg/kg × 70 kg = 700 mg',
        warnings: [],
        isWithinNormalRange: true
      }

      const formatted = formatDosageCalculation(calculation)
      
      expect(formatted.summary).toBe('Recommended dose: 700 mg')
      expect(formatted.warningLevel).toBe('none')
      expect(formatted.details).toContain('Formula: 10 mg/kg × 70 kg = 700 mg')
    })

    it('should format calculation with warnings', () => {
      const calculation = {
        patientWeight: 70,
        dosePerKg: 10,
        calculatedAmount: 700,
        recommendedDose: 500,
        formula: '10 mg/kg × 70 kg = 700 mg',
        warnings: ['Dose is higher than typical dose (500 mg) - monitor closely'],
        isWithinNormalRange: false
      }

      const formatted = formatDosageCalculation(calculation)
      
      expect(formatted.summary).toBe('Calculated dose: 700 mg (verify appropriateness)')
      expect(formatted.warningLevel).toBe('warning')
    })

    it('should format calculation with errors', () => {
      const calculation = {
        patientWeight: 70,
        dosePerKg: 10,
        calculatedAmount: 700,
        recommendedDose: 500,
        formula: '10 mg/kg × 70 kg = 700 mg',
        warnings: ['ALLERGY ALERT: Patient is allergic to medication'],
        isWithinNormalRange: false
      }

      const formatted = formatDosageCalculation(calculation)
      
      expect(formatted.warningLevel).toBe('error')
    })
  })
})