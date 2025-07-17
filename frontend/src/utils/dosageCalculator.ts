import type { Patient, MedicationDatabase, DosageCalculation } from '../types/patient'

/**
 * Rounds down a number to the specified number of decimal places
 */
function roundDown(value: number, decimals: number = 3): number {
  const multiplier = Math.pow(10, decimals)
  return Math.floor(value * multiplier) / multiplier
}

/**
 * Age categories for dosing calculations
 */
export const AGE_CATEGORIES = {
  NEONATE: { min: 0, max: 0.08 }, // 0-1 month (in years)
  INFANT: { min: 0.08, max: 2 },
  CHILD: { min: 2, max: 12 },
  ADOLESCENT: { min: 12, max: 18 },
  ADULT: { min: 18, max: 65 },
  ELDERLY: { min: 65, max: 120 }
} as const

/**
 * Dosage range multipliers for warnings
 */
export const DOSAGE_RANGES = {
  VERY_LOW: 0.5,
  LOW: 0.75,
  HIGH: 1.5,
  VERY_HIGH: 2.0
} as const

/**
 * Determines the age category for a patient
 */
export function getAgeCategory(age: number): keyof typeof AGE_CATEGORIES {
  if (age <= AGE_CATEGORIES.NEONATE.max) return 'NEONATE'
  if (age <= AGE_CATEGORIES.INFANT.max) return 'INFANT'
  if (age <= AGE_CATEGORIES.CHILD.max) return 'CHILD'
  if (age <= AGE_CATEGORIES.ADOLESCENT.max) return 'ADOLESCENT'
  if (age <= AGE_CATEGORIES.ADULT.max) return 'ADULT'
  return 'ELDERLY'
}

/**
 * Checks if a patient is pediatric (under 18 years)
 */
export function isPediatric(age: number): boolean {
  return age < 18
}

/**
 * Calculates weight-based dosage for a medication
 */
export function calculateWeightBasedDose(
  patient: Patient,
  medication: MedicationDatabase,
  requestedDose?: number
): DosageCalculation {
  const warnings: string[] = []
  const patientWeight = patient.weight || 0
  const patientAge = patient.age
  const ageCategory = getAgeCategory(patientAge)
  const isPatientPediatric = isPediatric(patientAge)

  // Check if patient weight is available
  if (!patientWeight || patientWeight <= 0) {
    warnings.push('Patient weight is required for accurate dosage calculation')
    return {
      patientWeight: 0,
      dosePerKg: 0,
      calculatedAmount: requestedDose || 0,
      recommendedDose: requestedDose || 0,
      formula: 'Unable to calculate - patient weight not available',
      warnings,
      isWithinNormalRange: false
    }
  }

  // Determine appropriate dosing information
  let dosePerKg = 0
  let minDose = 0
  let maxDose = 0
  let recommendedDose = 0
  let formula = ''

  if (isPatientPediatric && medication.pediatricDosing) {
    const pediatricDosing = medication.pediatricDosing
    
    // Check if patient age is within pediatric dosing range
    if (patientAge >= pediatricDosing.minAge && patientAge <= pediatricDosing.maxAge) {
      dosePerKg = pediatricDosing.dosePerKg
      maxDose = pediatricDosing.maxDose || Infinity
      recommendedDose = roundDown(Math.min(dosePerKg * patientWeight, maxDose))
      formula = `${dosePerKg} mg/kg × ${patientWeight} kg = ${roundDown(dosePerKg * patientWeight)} mg`
      
      if (pediatricDosing.maxDose && (dosePerKg * patientWeight) > pediatricDosing.maxDose) {
        formula += ` (capped at ${pediatricDosing.maxDose} mg maximum dose)`
        warnings.push(`Calculated dose exceeds maximum pediatric dose of ${pediatricDosing.maxDose} mg`)
      }
    } else {
      warnings.push(`Patient age (${patientAge} years) is outside pediatric dosing range (${pediatricDosing.minAge}-${pediatricDosing.maxAge} years)`)
    }
  }

  // Use adult dosing if no pediatric dosing applies or patient is adult
  if (!isPatientPediatric || !medication.pediatricDosing || recommendedDose === 0) {
    if (medication.adultDosing) {
      const adultDosing = medication.adultDosing
      minDose = adultDosing.minDose
      maxDose = adultDosing.maxDose
      recommendedDose = adultDosing.commonDose
      
      if (medication.isWeightBased && patientWeight > 0) {
        // For weight-based adult medications, use a standard calculation
        dosePerKg = adultDosing.commonDose / 70 // Assume 70kg standard adult
        recommendedDose = roundDown(Math.min(Math.max(dosePerKg * patientWeight, minDose), maxDose))
        formula = `${roundDown(dosePerKg)} mg/kg × ${patientWeight} kg = ${roundDown(dosePerKg * patientWeight)} mg (range: ${minDose}-${maxDose} mg)`
      } else {
        formula = `Standard adult dose: ${recommendedDose} mg (range: ${minDose}-${maxDose} mg)`
      }
      
      if (isPatientPediatric) {
        warnings.push('Using adult dosing for pediatric patient - verify appropriateness')
      }
    } else {
      warnings.push('No dosing information available for this medication')
      return {
        patientWeight,
        dosePerKg: 0,
        calculatedAmount: requestedDose || 0,
        recommendedDose: requestedDose || 0,
        formula: 'No dosing guidelines available',
        warnings,
        isWithinNormalRange: false
      }
    }
  }

  // Add age-specific warnings
  if (ageCategory === 'NEONATE') {
    warnings.push('Neonatal dosing requires special consideration - consult pediatric guidelines')
  } else if (ageCategory === 'ELDERLY') {
    warnings.push('Consider dose reduction for elderly patient - monitor for increased sensitivity')
  }

  // Calculate final dose (use requested dose if provided, otherwise use calculated)
  const finalDose = requestedDose || recommendedDose
  const calculatedAmount = dosePerKg > 0 ? dosePerKg * patientWeight : finalDose

  // Check if dose is within normal range
  const isWithinNormalRange = validateDosageRange(finalDose, recommendedDose, minDose, maxDose, warnings)

  return {
    patientWeight,
    dosePerKg,
    calculatedAmount,
    recommendedDose,
    formula,
    warnings,
    isWithinNormalRange
  }
}

/**
 * Validates if a dosage is within acceptable range and adds warnings
 */
function validateDosageRange(
  dose: number,
  recommendedDose: number,
  minDose: number,
  maxDose: number,
  warnings: string[]
): boolean {
  if (dose <= 0) {
    warnings.push('Dose must be greater than zero')
    return false
  }

  if (minDose > 0 && dose < minDose) {
    warnings.push(`Dose (${dose} mg) is below minimum recommended dose (${minDose} mg)`)
    return false
  }

  if (maxDose > 0 && maxDose !== Infinity && dose > maxDose) {
    warnings.push(`Dose (${dose} mg) exceeds maximum recommended dose (${maxDose} mg)`)
    return false
  }

  // Check for unusual doses compared to recommended dose
  if (recommendedDose > 0) {
    const ratio = dose / recommendedDose
    
    if (ratio < DOSAGE_RANGES.VERY_LOW) {
      warnings.push(`Dose is significantly lower than typical dose (${recommendedDose} mg) - verify appropriateness`)
      return false
    } else if (ratio < DOSAGE_RANGES.LOW) {
      warnings.push(`Dose is lower than typical dose (${recommendedDose} mg) - consider if appropriate`)
    } else if (ratio > DOSAGE_RANGES.VERY_HIGH) {
      warnings.push(`Dose is significantly higher than typical dose (${recommendedDose} mg) - verify appropriateness`)
      return false
    } else if (ratio > DOSAGE_RANGES.HIGH) {
      warnings.push(`Dose is higher than typical dose (${recommendedDose} mg) - monitor closely`)
    }
  }

  return warnings.length === 0 || !warnings.some(w => w.includes('exceeds') || w.includes('below') || w.includes('significantly'))
}

/**
 * Calculates total daily dose based on frequency
 */
export function calculateTotalDailyDose(
  singleDose: number,
  frequencyTimes: number,
  frequencyPeriod: 'daily' | 'weekly' | 'monthly'
): number {
  let result: number
  switch (frequencyPeriod) {
    case 'daily':
      result = singleDose * frequencyTimes
      break
    case 'weekly':
      result = (singleDose * frequencyTimes) / 7
      break
    case 'monthly':
      result = (singleDose * frequencyTimes) / 30
      break
    default:
      result = singleDose * frequencyTimes
  }
  return roundDown(result)
}

/**
 * Validates medication dosage for specific patient conditions
 */
export function validateMedicationForPatient(
  patient: Patient,
  medication: MedicationDatabase,
  dose: number
): string[] {
  const warnings: string[] = []
  const patientAge = patient.age
  const patientAllergies = patient.allergies || []

  // Check for allergies
  patientAllergies.forEach(allergy => {
    if (allergy.type === 'drug') {
      const allergenLower = allergy.allergen.toLowerCase()
      const medicationNameLower = medication.name.toLowerCase()
      const genericNameLower = medication.genericName.toLowerCase()
      
      // Check if medication name contains allergen or vice versa
      if (medicationNameLower.includes(allergenLower) || 
          allergenLower.includes(medicationNameLower) ||
          genericNameLower.includes(allergenLower) ||
          allergenLower.includes(genericNameLower) ||
          medication.brandNames.some(brand => 
            brand.toLowerCase().includes(allergenLower) || 
            allergenLower.includes(brand.toLowerCase())
          )) {
        warnings.push(`ALLERGY ALERT: Patient is allergic to ${allergy.allergen} (${allergy.severity} reaction: ${allergy.reaction})`)
      }
    }
  })

  // Check contraindications
  medication.contraindications.forEach(contraindication => {
    // This is a simplified check - in a real system, you'd have more sophisticated logic
    if (contraindication.toLowerCase().includes('pregnancy') && patient.gender?.toLowerCase() === 'female') {
      warnings.push(`CONTRAINDICATION: ${contraindication} - verify pregnancy status`)
    }
    if (contraindication.toLowerCase().includes('children') && patientAge < 18) {
      warnings.push(`CONTRAINDICATION: ${contraindication}`)
    }
    if (contraindication.toLowerCase().includes('elderly') && patientAge >= 65) {
      warnings.push(`CONTRAINDICATION: ${contraindication}`)
    }
  })

  // Age-specific warnings
  if (patientAge < 18 && !medication.pediatricDosing) {
    warnings.push('No pediatric dosing information available - use with caution')
  }

  return warnings
}

/**
 * Formats dosage calculation results for display
 */
export function formatDosageCalculation(calculation: DosageCalculation): {
  summary: string
  details: string[]
  warningLevel: 'none' | 'info' | 'warning' | 'error'
} {
  const details: string[] = []
  let warningLevel: 'none' | 'info' | 'warning' | 'error' = 'none'

  // Add calculation details
  if (calculation.formula) {
    details.push(`Formula: ${calculation.formula}`)
  }
  
  if (calculation.patientWeight > 0) {
    details.push(`Patient weight: ${calculation.patientWeight} kg`)
  }
  
  if (calculation.dosePerKg > 0) {
    details.push(`Dose per kg: ${calculation.dosePerKg} mg/kg`)
  }

  // Determine warning level
  if (calculation.warnings.length > 0) {
    const hasError = calculation.warnings.some(w => 
      w.includes('ALLERGY') || 
      w.includes('CONTRAINDICATION') || 
      w.includes('exceeds maximum') ||
      w.includes('significantly')
    )
    const hasWarning = calculation.warnings.some(w => 
      w.includes('verify') || 
      w.includes('monitor') || 
      w.includes('consider')
    )
    
    if (hasError) {
      warningLevel = 'error'
    } else if (hasWarning || !calculation.isWithinNormalRange) {
      warningLevel = 'warning'
    } else {
      warningLevel = 'info'
    }
  }

  const summary = calculation.isWithinNormalRange 
    ? `Recommended dose: ${calculation.recommendedDose} mg`
    : `Calculated dose: ${calculation.calculatedAmount} mg (verify appropriateness)`

  return {
    summary,
    details,
    warningLevel
  }
}