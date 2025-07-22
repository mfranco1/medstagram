import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MedicationAlerts } from '../MedicationAlerts'
import type { Patient, Medication } from '../../../types/patient'

// Mock patient data for testing
const mockPatient: Patient = {
  id: 1,
  name: 'Test Patient',
  age: 45,
  gender: 'Male',
  caseNumber: '123456',
  dateAdmitted: '2024-03-15',
  location: 'Ward 3',
  status: 'Active Admission',
  diagnosis: 'Test Diagnosis',
  dateOfBirth: '1979-05-15',
  civilStatus: 'Married',
  nationality: 'Filipino',
  religion: 'Roman Catholic',
  address: '123 Test St.',
  philhealth: '12-345678901-2',
  primaryService: 'Internal Medicine',
  weight: 70,
  height: 175,
  allergies: [
    {
      type: 'drug',
      allergen: 'Penicillin',
      reaction: 'Rash and hives',
      severity: 'moderate'
    },
    {
      type: 'drug',
      allergen: 'Aspirin',
      reaction: 'Bronchospasm',
      severity: 'severe'
    }
  ]
}

const mockPediatricPatient: Patient = {
  ...mockPatient,
  id: 2,
  name: 'Pediatric Patient',
  age: 8,
  weight: 25,
  dateOfBirth: '2016-01-01'
}

const mockMedications: Medication[] = [
  {
    id: 'med-001',
    patientId: 1,
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    dosage: { amount: 875, unit: 'mg' },
    frequency: { times: 2, period: 'daily' },
    route: 'oral',
    startDate: '2024-03-15',
    status: 'active',
    prescribedBy: { id: 'dr-001', name: 'Dr. Test' },
    indication: 'Infection',
    createdAt: '2024-03-15T08:00:00Z',
    updatedAt: '2024-03-15T08:00:00Z'
  },
  {
    id: 'med-002',
    patientId: 1,
    name: 'Warfarin',
    genericName: 'Warfarin',
    dosage: { amount: 5, unit: 'mg' },
    frequency: { times: 1, period: 'daily' },
    route: 'oral',
    startDate: '2024-03-15',
    status: 'active',
    prescribedBy: { id: 'dr-001', name: 'Dr. Test' },
    indication: 'Anticoagulation',
    createdAt: '2024-03-15T08:00:00Z',
    updatedAt: '2024-03-15T08:00:00Z'
  }
]

describe('MedicationAlerts', () => {
  const mockOnAlertAcknowledge = vi.fn()

  beforeEach(() => {
    mockOnAlertAcknowledge.mockClear()
  })

  describe('Allergy Detection', () => {
    it('should detect and display allergy alerts', () => {
      const medicationsWithAllergy: Medication[] = [
        {
          ...mockMedications[0],
          name: 'Penicillin',
          genericName: 'Penicillin'
        }
      ]

      render(
        <MedicationAlerts
          patient={mockPatient}
          currentMedications={medicationsWithAllergy}
          onAlertAcknowledge={mockOnAlertAcknowledge}
        />
      )

      expect(screen.getByText('Allergy Alert')).toBeInTheDocument()
      expect(screen.getByText(/Patient is allergic to Penicillin/)).toBeInTheDocument()
      expect(screen.getByText(/Rash and hives/)).toBeInTheDocument()
    })

    it('should show critical alert for severe allergies', () => {
      const medicationsWithSevereAllergy: Medication[] = [
        {
          ...mockMedications[0],
          name: 'Aspirin',
          genericName: 'Aspirin'
        }
      ]

      render(
        <MedicationAlerts
          patient={mockPatient}
          currentMedications={medicationsWithSevereAllergy}
          onAlertAcknowledge={mockOnAlertAcknowledge}
        />
      )

      expect(screen.getByText('CRITICAL')).toBeInTheDocument()
      expect(screen.getByText(/Patient is allergic to Aspirin/)).toBeInTheDocument()
      expect(screen.getByText(/Bronchospasm/)).toBeInTheDocument()
    })

    it('should detect drug class allergies', () => {
      const medicationsWithClassAllergy: Medication[] = [
        {
          ...mockMedications[0],
          name: 'Amoxicillin',
          genericName: 'Amoxicillin'
        }
      ]

      const patientWithPenicillinAllergy = {
        ...mockPatient,
        allergies: [
          {
            type: 'drug' as const,
            allergen: 'Penicillin',
            reaction: 'Rash',
            severity: 'moderate' as const
          }
        ]
      }

      render(
        <MedicationAlerts
          patient={patientWithPenicillinAllergy}
          currentMedications={medicationsWithClassAllergy}
          onAlertAcknowledge={mockOnAlertAcknowledge}
        />
      )

      expect(screen.getByText('Allergy Alert')).toBeInTheDocument()
    })
  })

  describe('Drug Interaction Detection', () => {
    it('should detect and display drug interactions', () => {
      const interactingMedications: Medication[] = [
        {
          ...mockMedications[1], // Warfarin
        },
        {
          id: 'med-003',
          patientId: 1,
          name: 'Aspirin',
          genericName: 'Aspirin',
          dosage: { amount: 81, unit: 'mg' },
          frequency: { times: 1, period: 'daily' },
          route: 'oral',
          startDate: '2024-03-15',
          status: 'active',
          prescribedBy: { id: 'dr-001', name: 'Dr. Test' },
          indication: 'Cardioprotection',
          createdAt: '2024-03-15T08:00:00Z',
          updatedAt: '2024-03-15T08:00:00Z'
        }
      ]

      render(
        <MedicationAlerts
          patient={mockPatient}
          currentMedications={interactingMedications}
          onAlertAcknowledge={mockOnAlertAcknowledge}
        />
      )

      expect(screen.getByText('Drug Interaction')).toBeInTheDocument()
      expect(screen.getByText(/may interact with/)).toBeInTheDocument()
      expect(screen.getByText(/bleeding/i)).toBeInTheDocument()
    })

    it('should show high severity for dangerous interactions', () => {
      const dangerousInteractions: Medication[] = [
        {
          ...mockMedications[1], // Warfarin
        },
        {
          id: 'med-004',
          patientId: 1,
          name: 'Ibuprofen',
          genericName: 'Ibuprofen',
          dosage: { amount: 400, unit: 'mg' },
          frequency: { times: 3, period: 'daily' },
          route: 'oral',
          startDate: '2024-03-15',
          status: 'active',
          prescribedBy: { id: 'dr-001', name: 'Dr. Test' },
          indication: 'Pain',
          createdAt: '2024-03-15T08:00:00Z',
          updatedAt: '2024-03-15T08:00:00Z'
        }
      ]

      render(
        <MedicationAlerts
          patient={mockPatient}
          currentMedications={dangerousInteractions}
          onAlertAcknowledge={mockOnAlertAcknowledge}
        />
      )

      expect(screen.getByText('HIGH')).toBeInTheDocument()
    })
  })

  describe('Duplicate Medication Detection', () => {
    it('should detect duplicate medications by generic name', () => {
      const duplicateMedications: Medication[] = [
        {
          id: 'med-005',
          patientId: 1,
          name: 'Lisinopril',
          genericName: 'Lisinopril',
          dosage: { amount: 10, unit: 'mg' },
          frequency: { times: 1, period: 'daily' },
          route: 'oral',
          startDate: '2024-03-15',
          status: 'active',
          prescribedBy: { id: 'dr-001', name: 'Dr. Test' },
          indication: 'Hypertension',
          createdAt: '2024-03-15T08:00:00Z',
          updatedAt: '2024-03-15T08:00:00Z'
        },
        {
          id: 'med-006',
          patientId: 1,
          name: 'Prinivil',
          genericName: 'Lisinopril',
          dosage: { amount: 5, unit: 'mg' },
          frequency: { times: 1, period: 'daily' },
          route: 'oral',
          startDate: '2024-03-16',
          status: 'active',
          prescribedBy: { id: 'dr-001', name: 'Dr. Test' },
          indication: 'Hypertension',
          createdAt: '2024-03-16T08:00:00Z',
          updatedAt: '2024-03-16T08:00:00Z'
        }
      ]

      render(
        <MedicationAlerts
          patient={mockPatient}
          currentMedications={duplicateMedications}
          onAlertAcknowledge={mockOnAlertAcknowledge}
        />
      )

      expect(screen.getByText('Duplicate Medication')).toBeInTheDocument()
      expect(screen.getByText(/same medication/)).toBeInTheDocument()
    })

    it('should detect duplicate medications by same name', () => {
      const sameMedications: Medication[] = [
        {
          id: 'med-007',
          patientId: 1,
          name: 'Metformin',
          genericName: 'Metformin',
          dosage: { amount: 500, unit: 'mg' },
          frequency: { times: 2, period: 'daily' },
          route: 'oral',
          startDate: '2024-03-15',
          status: 'active',
          prescribedBy: { id: 'dr-001', name: 'Dr. Test' },
          indication: 'Diabetes',
          createdAt: '2024-03-15T08:00:00Z',
          updatedAt: '2024-03-15T08:00:00Z'
        },
        {
          id: 'med-008',
          patientId: 1,
          name: 'Metformin',
          genericName: 'Metformin',
          dosage: { amount: 1000, unit: 'mg' },
          frequency: { times: 1, period: 'daily' },
          route: 'oral',
          startDate: '2024-03-16',
          status: 'active',
          prescribedBy: { id: 'dr-001', name: 'Dr. Test' },
          indication: 'Diabetes',
          createdAt: '2024-03-16T08:00:00Z',
          updatedAt: '2024-03-16T08:00:00Z'
        }
      ]

      render(
        <MedicationAlerts
          patient={mockPatient}
          currentMedications={sameMedications}
          onAlertAcknowledge={mockOnAlertAcknowledge}
        />
      )

      expect(screen.getByText('Duplicate Medication')).toBeInTheDocument()
    })
  })

  describe('Dosage Warnings', () => {
    it('should warn about high dosages', () => {
      const highDosageMedication: Medication[] = [
        {
          id: 'med-009',
          patientId: 1,
          name: 'Lisinopril',
          genericName: 'Lisinopril',
          dosage: { amount: 80, unit: 'mg' }, // Very high dose
          frequency: { times: 1, period: 'daily' },
          route: 'oral',
          startDate: '2024-03-15',
          status: 'active',
          prescribedBy: { id: 'dr-001', name: 'Dr. Test' },
          indication: 'Hypertension',
          createdAt: '2024-03-15T08:00:00Z',
          updatedAt: '2024-03-15T08:00:00Z'
        }
      ]

      render(
        <MedicationAlerts
          patient={mockPatient}
          currentMedications={highDosageMedication}
          onAlertAcknowledge={mockOnAlertAcknowledge}
        />
      )

      expect(screen.getByText('Dosage Warning')).toBeInTheDocument()
      expect(screen.getByText(/exceeds maximum/)).toBeInTheDocument()
    })

    it('should warn about pediatric dosage issues', () => {
      const pediatricMedication: Medication[] = [
        {
          id: 'med-010',
          patientId: 2,
          name: 'Amoxicillin',
          genericName: 'Amoxicillin',
          dosage: { amount: 1500, unit: 'mg' }, // Too high for pediatric
          frequency: { times: 2, period: 'daily' },
          route: 'oral',
          startDate: '2024-03-15',
          status: 'active',
          prescribedBy: { id: 'dr-001', name: 'Dr. Test' },
          indication: 'Infection',
          createdAt: '2024-03-15T08:00:00Z',
          updatedAt: '2024-03-15T08:00:00Z'
        }
      ]

      render(
        <MedicationAlerts
          patient={mockPediatricPatient}
          currentMedications={pediatricMedication}
          onAlertAcknowledge={mockOnAlertAcknowledge}
        />
      )

      expect(screen.getByText('Dosage Warning')).toBeInTheDocument()
      expect(screen.getByText(/pediatric/)).toBeInTheDocument()
    })
  })

  describe('Age-Related Warnings', () => {
    it('should warn about age-inappropriate medications', () => {
      const adultMedication: Medication[] = [
        {
          id: 'med-011',
          patientId: 2,
          name: 'Aspirin',
          genericName: 'Aspirin',
          dosage: { amount: 325, unit: 'mg' },
          frequency: { times: 1, period: 'daily' },
          route: 'oral',
          startDate: '2024-03-15',
          status: 'active',
          prescribedBy: { id: 'dr-001', name: 'Dr. Test' },
          indication: 'Pain',
          createdAt: '2024-03-15T08:00:00Z',
          updatedAt: '2024-03-15T08:00:00Z'
        }
      ]

      const veryYoungPatient = {
        ...mockPediatricPatient,
        age: 2,
        dateOfBirth: '2022-01-01'
      }

      render(
        <MedicationAlerts
          patient={veryYoungPatient}
          currentMedications={adultMedication}
          onAlertAcknowledge={mockOnAlertAcknowledge}
        />
      )

      // Should show age warning or contraindication
      expect(screen.getByText(/Warning|Contraindication/)).toBeInTheDocument()
    })
  })

  describe('Alert Acknowledgment', () => {
    beforeEach(() => {
      // Clear localStorage before each test to ensure clean state
      localStorage.clear()
    })

    it('should allow acknowledging alerts', () => {
      const medicationsWithAllergy: Medication[] = [
        {
          ...mockMedications[0],
          name: 'Penicillin',
          genericName: 'Penicillin'
        }
      ]

      render(
        <MedicationAlerts
          patient={mockPatient}
          currentMedications={medicationsWithAllergy}
          onAlertAcknowledge={mockOnAlertAcknowledge}
        />
      )

      const acknowledgeButton = screen.getByText('Acknowledge')
      fireEvent.click(acknowledgeButton)

      expect(mockOnAlertAcknowledge).toHaveBeenCalledTimes(1)
      expect(mockOnAlertAcknowledge).toHaveBeenCalledWith(expect.stringContaining('allergy-'))
    })

    it('should show acknowledged status', () => {
      const medicationsWithAllergy: Medication[] = [
        {
          ...mockMedications[0],
          name: 'Penicillin',
          genericName: 'Penicillin'
        }
      ]

      render(
        <MedicationAlerts
          patient={mockPatient}
          currentMedications={medicationsWithAllergy}
          onAlertAcknowledge={mockOnAlertAcknowledge}
        />
      )

      // Find and click the acknowledge button
      const acknowledgeButton = screen.getByText('Acknowledge')
      fireEvent.click(acknowledgeButton)

      // After clicking, the alert should show as acknowledged
      expect(screen.getByText('Acknowledged')).toBeInTheDocument()
      // The acknowledge button should no longer be present
      expect(screen.queryByText('Acknowledge')).not.toBeInTheDocument()
    })
  })

  describe('Critical Alerts Banner', () => {
    it('should show critical alerts banner when there are unacknowledged critical alerts', () => {
      const criticalMedications: Medication[] = [
        {
          ...mockMedications[0],
          name: 'Aspirin', // Severe allergy
          genericName: 'Aspirin'
        }
      ]

      render(
        <MedicationAlerts
          patient={mockPatient}
          currentMedications={criticalMedications}
          onAlertAcknowledge={mockOnAlertAcknowledge}
        />
      )

      expect(screen.getByText('Critical Safety Alerts Require Attention')).toBeInTheDocument()
      expect(screen.getByText(/critical alert.*must be acknowledged/)).toBeInTheDocument()
    })
  })

  describe('New Medication Alerts', () => {
    it('should show alerts for new medication being added', () => {
      const newMedication: Medication = {
        id: 'med-new',
        patientId: 1,
        name: 'Penicillin',
        genericName: 'Penicillin',
        dosage: { amount: 500, unit: 'mg' },
        frequency: { times: 3, period: 'daily' },
        route: 'oral',
        startDate: '2024-03-20',
        status: 'active',
        prescribedBy: { id: 'dr-001', name: 'Dr. Test' },
        indication: 'Infection',
        createdAt: '2024-03-20T08:00:00Z',
        updatedAt: '2024-03-20T08:00:00Z'
      }

      render(
        <MedicationAlerts
          patient={mockPatient}
          currentMedications={mockMedications}
          newMedication={newMedication}
          onAlertAcknowledge={mockOnAlertAcknowledge}
        />
      )

      // Should show multiple allergy alerts (for existing and new medication)
      expect(screen.getAllByText('Allergy Alert')).toHaveLength(2)
      expect(screen.getAllByText(/Patient is allergic to Penicillin/)).toHaveLength(2)
    })
  })

  describe('No Alerts State', () => {
    it('should not render anything when there are no alerts', () => {
      const safeMedications: Medication[] = [
        {
          id: 'med-safe',
          patientId: 1,
          name: 'Acetaminophen',
          genericName: 'Acetaminophen',
          dosage: { amount: 500, unit: 'mg' },
          frequency: { times: 3, period: 'daily' },
          route: 'oral',
          startDate: '2024-03-15',
          status: 'active',
          prescribedBy: { id: 'dr-001', name: 'Dr. Test' },
          indication: 'Pain',
          createdAt: '2024-03-15T08:00:00Z',
          updatedAt: '2024-03-15T08:00:00Z'
        }
      ]

      const patientWithoutAllergies = {
        ...mockPatient,
        allergies: []
      }

      const { container } = render(
        <MedicationAlerts
          patient={patientWithoutAllergies}
          currentMedications={safeMedications}
          onAlertAcknowledge={mockOnAlertAcknowledge}
        />
      )

      expect(container.firstChild).toBeNull()
    })
  })
})