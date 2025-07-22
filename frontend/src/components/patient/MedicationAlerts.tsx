import { useState, useMemo } from 'react'
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react'
import type { Patient, Medication, PatientAllergy } from '../../types/patient'
import { mockMedicationDatabase } from '../../mocks/medications'

// Alert types and severity levels
export type AlertType = 'allergy' | 'interaction' | 'duplicate' | 'dosage' | 'age' | 'contraindication'
export type AlertSeverity = 'critical' | 'high' | 'moderate' | 'low' | 'info'

export interface MedicationAlert {
  id: string
  type: AlertType
  severity: AlertSeverity
  title: string
  message: string
  medicationId?: string
  medicationName?: string
  relatedMedicationId?: string
  relatedMedicationName?: string
  allergen?: string
  recommendation?: string
  requiresAcknowledgment: boolean
  acknowledged: boolean
  acknowledgedAt?: string
  acknowledgedBy?: string
}

interface MedicationAlertsProps {
  patient: Patient
  currentMedications: Medication[]
  newMedication?: Medication
  onAlertAcknowledge: (alertId: string) => void
  className?: string
  focusedMedicationOnly?: boolean // When true, only show alerts related to the new/focused medication
}

// Mock drug interaction data
const DRUG_INTERACTIONS = [
  {
    drug1: 'warfarin',
    drug2: 'aspirin',
    severity: 'high' as AlertSeverity,
    description: 'Increased risk of bleeding when used together'
  },
  {
    drug1: 'warfarin',
    drug2: 'ibuprofen',
    severity: 'high' as AlertSeverity,
    description: 'NSAIDs may increase anticoagulant effect'
  },
  {
    drug1: 'warfarin',
    drug2: 'naproxen',
    severity: 'high' as AlertSeverity,
    description: 'NSAIDs may increase anticoagulant effect'
  },
  {
    drug1: 'lisinopril',
    drug2: 'losartan',
    severity: 'moderate' as AlertSeverity,
    description: 'Dual ACE inhibitor/ARB therapy may cause hypotension'
  },
  {
    drug1: 'morphine',
    drug2: 'tramadol',
    severity: 'high' as AlertSeverity,
    description: 'Increased risk of respiratory depression and sedation'
  },
  {
    drug1: 'morphine',
    drug2: 'clonazepam',
    severity: 'critical' as AlertSeverity,
    description: 'Dangerous combination - increased risk of respiratory depression'
  },
  {
    drug1: 'tramadol',
    drug2: 'sertraline',
    severity: 'moderate' as AlertSeverity,
    description: 'Increased risk of serotonin syndrome'
  },
  {
    drug1: 'digoxin',
    drug2: 'furosemide',
    severity: 'moderate' as AlertSeverity,
    description: 'Diuretics may increase digoxin toxicity risk due to electrolyte changes'
  },
  {
    drug1: 'metformin',
    drug2: 'insulin',
    severity: 'low' as AlertSeverity,
    description: 'Monitor blood glucose closely when used together'
  },
  {
    drug1: 'prednisone',
    drug2: 'insulin',
    severity: 'moderate' as AlertSeverity,
    description: 'Corticosteroids may increase blood glucose levels'
  },
  {
    drug1: 'azithromycin',
    drug2: 'warfarin',
    severity: 'moderate' as AlertSeverity,
    description: 'Macrolide antibiotics may enhance anticoagulant effect'
  },
  {
    drug1: 'lisinopril',
    drug2: 'hydrochlorothiazide',
    severity: 'low' as AlertSeverity,
    description: 'Monitor for hypotension and electrolyte imbalances'
  },
  {
    drug1: 'atorvastatin',
    drug2: 'amlodipine',
    severity: 'low' as AlertSeverity,
    description: 'Calcium channel blockers may increase statin levels'
  },
  {
    drug1: 'levothyroxine',
    drug2: 'omeprazole',
    severity: 'moderate' as AlertSeverity,
    description: 'PPIs may reduce levothyroxine absorption'
  },
  {
    drug1: 'gabapentin',
    drug2: 'morphine',
    severity: 'moderate' as AlertSeverity,
    description: 'Increased risk of sedation and respiratory depression'
  }
]

export function MedicationAlerts({ 
  patient, 
  currentMedications, 
  newMedication, 
  onAlertAcknowledge,
  className = '',
  focusedMedicationOnly = false
}: MedicationAlertsProps) {
  // Load acknowledged alerts from localStorage on component mount
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(`medication-alerts-${patient.id}`)
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch {
      return new Set()
    }
  })

  // Generate all alerts based on current medications and new medication
  const alerts = useMemo(() => {
    const generatedAlerts: MedicationAlert[] = []
    
    // When editing, we need to exclude the original medication being edited
    // to avoid false duplicate alerts between the original and the preview
    let medicationsToCheck = currentMedications
    
    if (newMedication) {
      // If newMedication has a preview ID, we're editing - exclude the original
      if (newMedication.id === 'preview-medication') {
        // Find the medication being edited by matching name and other properties
        const editingIndex = currentMedications.findIndex(med => 
          med.name.toLowerCase() === newMedication.name.toLowerCase() &&
          med.route === newMedication.route &&
          med.patientId === newMedication.patientId
        )
        
        if (editingIndex !== -1) {
          // Exclude the original medication being edited
          medicationsToCheck = currentMedications.filter((_, index) => index !== editingIndex)
        }
      }
      
      // Add the new/preview medication
      medicationsToCheck = [...medicationsToCheck, newMedication]
    }
    
    const allMedications = medicationsToCheck

    // Check each medication for various types of alerts
    // When focusedMedicationOnly is true, we only generate alerts for the new medication
    // but we still need to check interactions/duplicates against all medications
    const medicationsToProcess = focusedMedicationOnly && newMedication ? [newMedication] : allMedications
    

    
    medicationsToProcess.forEach(medication => {
      // Skip all alerts for discontinued medications
      if (medication.status === 'discontinued') {
        return
      }
      
      // 1. Allergy alerts
      if (patient.allergies) {
        patient.allergies.forEach(allergy => {
          if (allergy.type === 'drug' && isAllergyMatch(medication, allergy)) {
            generatedAlerts.push({
              id: `allergy-${medication.id}-${allergy.allergen}`,
              type: 'allergy',
              severity: allergy.severity === 'severe' ? 'critical' : 
                       allergy.severity === 'moderate' ? 'high' : 'moderate',
              title: 'Allergy Alert',
              message: `Patient is allergic to ${allergy.allergen}. Reaction: ${allergy.reaction}`,
              medicationId: medication.id,
              medicationName: medication.name,
              allergen: allergy.allergen,
              recommendation: allergy.severity === 'severe' 
                ? 'Do not administer. Consider alternative medication.'
                : 'Use with caution. Monitor patient closely for allergic reactions.',
              requiresAcknowledgment: true,
              acknowledged: acknowledgedAlerts.has(`allergy-${medication.id}-${allergy.allergen}`)
            })
          }
        })
      }

      // 2. Drug interaction alerts - check against active medications only (exclude discontinued)
      allMedications.forEach(otherMedication => {
        if (medication.id !== otherMedication.id && otherMedication.status !== 'discontinued') {
          const interaction = findDrugInteraction(medication, otherMedication)
          if (interaction) {
            const alertId = `interaction-${medication.id}-${otherMedication.id}`
            // Avoid duplicate interaction alerts (A-B and B-A)
            const reverseAlertId = `interaction-${otherMedication.id}-${medication.id}`
            const alreadyExists = generatedAlerts.some(alert => 
              alert.id === alertId || alert.id === reverseAlertId
            )
            
            if (!alreadyExists) {
              generatedAlerts.push({
                id: alertId,
                type: 'interaction',
                severity: interaction.severity,
                title: 'Drug Interaction',
                message: `${medication.name} may interact with ${otherMedication.name}. ${interaction.description}`,
                medicationId: medication.id,
                medicationName: medication.name,
                relatedMedicationId: otherMedication.id,
                relatedMedicationName: otherMedication.name,
                recommendation: interaction.severity === 'high' 
                  ? 'Consider alternative medications or adjust dosing.'
                  : 'Monitor patient closely for adverse effects.',
                requiresAcknowledgment: interaction.severity === 'high' || interaction.severity === 'critical',
                acknowledged: acknowledgedAlerts.has(alertId)
              })
            }
          }
        }
      })

      // 3. Duplicate medication alerts - check against active medications only (exclude discontinued)
      allMedications.forEach(otherMedication => {
        if (medication.id !== otherMedication.id && otherMedication.status !== 'discontinued' && isDuplicateMedication(medication, otherMedication)) {
          const alertId = `duplicate-${medication.id}-${otherMedication.id}`
          const reverseAlertId = `duplicate-${otherMedication.id}-${medication.id}`
          const alreadyExists = generatedAlerts.some(alert => 
            alert.id === alertId || alert.id === reverseAlertId
          )
          
          if (!alreadyExists) {
            generatedAlerts.push({
              id: alertId,
              type: 'duplicate',
              severity: 'high',
              title: 'Duplicate Medication',
              message: `Patient is prescribed both ${medication.name} and ${otherMedication.name}, which may be the same medication.`,
              medicationId: medication.id,
              medicationName: medication.name,
              relatedMedicationId: otherMedication.id,
              relatedMedicationName: otherMedication.name,
              recommendation: 'Review medications to avoid duplication and potential overdose.',
              requiresAcknowledgment: true,
              acknowledged: acknowledgedAlerts.has(alertId)
            })
          }
        }
      })

      // 4. Dosage warnings
      const dosageAlert = checkDosageWarnings(medication, patient)
      if (dosageAlert) {
        generatedAlerts.push({
          ...dosageAlert,
          acknowledged: acknowledgedAlerts.has(dosageAlert.id)
        })
      }

      // 5. Age-related warnings
      const ageAlert = checkAgeWarnings(medication, patient)
      if (ageAlert) {
        generatedAlerts.push({
          ...ageAlert,
          acknowledged: acknowledgedAlerts.has(ageAlert.id)
        })
      }

      // 6. Contraindication alerts
      const contraindicationAlert = checkContraindications(medication, patient)
      if (contraindicationAlert) {
        generatedAlerts.push({
          ...contraindicationAlert,
          acknowledged: acknowledgedAlerts.has(contraindicationAlert.id)
        })
      }
    })

    // Sort alerts by severity (critical first)
    return generatedAlerts.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, moderate: 2, low: 3, info: 4 }
      return severityOrder[a.severity] - severityOrder[b.severity]
    })
  }, [currentMedications, newMedication, patient, acknowledgedAlerts, focusedMedicationOnly])

  // Handle alert acknowledgment
  const handleAcknowledge = (alertId: string) => {
    const newAcknowledged = new Set([...acknowledgedAlerts, alertId])
    setAcknowledgedAlerts(newAcknowledged)
    
    // Persist to localStorage with timestamp
    try {
      const acknowledgedData = {
        alerts: [...newAcknowledged],
        timestamps: {
          ...JSON.parse(localStorage.getItem(`medication-alerts-timestamps-${patient.id}`) || '{}'),
          [alertId]: new Date().toISOString()
        }
      }
      localStorage.setItem(`medication-alerts-${patient.id}`, JSON.stringify(acknowledgedData.alerts))
      localStorage.setItem(`medication-alerts-timestamps-${patient.id}`, JSON.stringify(acknowledgedData.timestamps))
    } catch (error) {
      console.warn('Failed to persist acknowledged alerts:', error)
    }
    
    onAlertAcknowledge(alertId)
  }

  // Get unacknowledged critical/high alerts
  const criticalAlerts = alerts.filter(alert => 
    (alert.severity === 'critical' || alert.severity === 'high') && 
    alert.requiresAcknowledgment && 
    !alert.acknowledged
  )

  if (alerts.length === 0) {
    return null
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Critical alerts banner */}
      {criticalAlerts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Critical Safety Alerts Require Attention
              </h3>
              <p className="text-sm text-red-700 mt-1">
                {criticalAlerts.length} critical alert{criticalAlerts.length > 1 ? 's' : ''} must be acknowledged before proceeding.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Individual alerts */}
      {alerts.map(alert => (
        <MedicationAlertCard
          key={alert.id}
          alert={alert}
          onAcknowledge={handleAcknowledge}
        />
      ))}
      
      {/* Clear acknowledged alerts button (for testing/admin purposes) */}
      {acknowledgedAlerts.size > 0 && (
        <div className="text-center pt-4">
          <button
            onClick={() => {
              setAcknowledgedAlerts(new Set())
              try {
                localStorage.removeItem(`medication-alerts-${patient.id}`)
                localStorage.removeItem(`medication-alerts-timestamps-${patient.id}`)
              } catch (error) {
                console.warn('Failed to clear acknowledged alerts:', error)
              }
            }}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear all acknowledged alerts
          </button>
        </div>
      )}
    </div>
  )
}

// Individual alert card component
interface MedicationAlertCardProps {
  alert: MedicationAlert
  onAcknowledge: (alertId: string) => void
}

function MedicationAlertCard({ alert, onAcknowledge }: MedicationAlertCardProps) {

  const getSeverityConfig = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-500',
          icon: AlertTriangle,
          badgeColor: 'bg-red-100 text-red-800'
        }
      case 'high':
        return {
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-800',
          iconColor: 'text-orange-500',
          icon: AlertCircle,
          badgeColor: 'bg-orange-100 text-orange-800'
        }
      case 'moderate':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-500',
          icon: AlertCircle,
          badgeColor: 'bg-yellow-100 text-yellow-800'
        }
      case 'low':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-500',
          icon: Info,
          badgeColor: 'bg-blue-100 text-blue-800'
        }
      case 'info':
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-500',
          icon: Info,
          badgeColor: 'bg-gray-100 text-gray-800'
        }
    }
  }

  const config = getSeverityConfig(alert.severity)
  const Icon = config.icon

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <Icon className={`h-5 w-5 ${config.iconColor} mt-0.5 flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className={`text-sm font-medium ${config.textColor}`}>
                {alert.title}
              </h4>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.badgeColor}`}>
                {alert.severity.toUpperCase()}
              </span>
              {alert.acknowledged && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Acknowledged
                </span>
              )}
            </div>
            <p className={`text-sm ${config.textColor} mb-2`}>
              {alert.message}
            </p>
            {alert.recommendation && (
              <div className={`text-sm ${config.textColor} bg-white bg-opacity-50 rounded p-2 mb-2`}>
                <strong>Recommendation:</strong> {alert.recommendation}
              </div>
            )}
            {(alert.relatedMedicationName || alert.allergen) && (
              <div className="text-xs text-gray-600 space-y-1">
                {alert.medicationName && (
                  <div><strong>Medication:</strong> {alert.medicationName}</div>
                )}
                {alert.relatedMedicationName && (
                  <div><strong>Related Medication:</strong> {alert.relatedMedicationName}</div>
                )}
                {alert.allergen && (
                  <div><strong>Allergen:</strong> {alert.allergen}</div>
                )}
              </div>
            )}
            {alert.acknowledged && alert.acknowledgedAt && (
              <div className="text-xs text-gray-500 mt-2">
                Acknowledged on {new Date(alert.acknowledgedAt).toLocaleString()}
                {alert.acknowledgedBy && ` by ${alert.acknowledgedBy}`}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          {alert.requiresAcknowledgment && !alert.acknowledged && (
            <button
              onClick={() => onAcknowledge(alert.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md border transition-colors ${
                alert.severity === 'critical' || alert.severity === 'high'
                  ? 'bg-white border-red-300 text-red-700 hover:bg-red-50'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Acknowledge
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper functions for alert detection

export function isAllergyMatch(medication: Medication, allergy: PatientAllergy): boolean {
  const allergenLower = allergy.allergen.toLowerCase()
  const medicationNameLower = medication.name.toLowerCase()
  const genericNameLower = medication.genericName?.toLowerCase() || ''

  // Direct name matches
  if (medicationNameLower.includes(allergenLower) || 
      genericNameLower.includes(allergenLower) ||
      allergenLower.includes(medicationNameLower)) {
    return true
  }

  // Check for drug class matches
  const drugClassMatches: Record<string, string[]> = {
    'penicillin': ['amoxicillin', 'ampicillin', 'penicillin'],
    'sulfa': ['sulfamethoxazole', 'trimethoprim', 'furosemide'],
    'ace inhibitor': ['lisinopril', 'enalapril', 'captopril'],
    'ace inhibitors': ['lisinopril', 'enalapril', 'captopril'],
    'nsaid': ['ibuprofen', 'naproxen', 'aspirin', 'diclofenac'],
    'nsaids': ['ibuprofen', 'naproxen', 'aspirin', 'diclofenac'],
    'statin': ['atorvastatin', 'simvastatin', 'rosuvastatin'],
    'statins': ['atorvastatin', 'simvastatin', 'rosuvastatin']
  }

  const matchingDrugs = drugClassMatches[allergenLower]
  if (matchingDrugs) {
    return matchingDrugs.some((drug: string) => 
      medicationNameLower.includes(drug) || genericNameLower.includes(drug)
    )
  }

  return false
}

export function findDrugInteraction(med1: Medication, med2: Medication) {
  const name1 = med1.name.toLowerCase()
  const name2 = med2.name.toLowerCase()
  const generic1 = med1.genericName?.toLowerCase() || ''
  const generic2 = med2.genericName?.toLowerCase() || ''

  return DRUG_INTERACTIONS.find(interaction => {
    const drug1 = interaction.drug1.toLowerCase()
    const drug2 = interaction.drug2.toLowerCase()

    return (
      (name1.includes(drug1) || generic1.includes(drug1)) &&
      (name2.includes(drug2) || generic2.includes(drug2))
    ) || (
      (name1.includes(drug2) || generic1.includes(drug2)) &&
      (name2.includes(drug1) || generic2.includes(drug1))
    )
  })
}

export function isDuplicateMedication(med1: Medication, med2: Medication): boolean {
  const name1 = med1.name.toLowerCase()
  const name2 = med2.name.toLowerCase()
  const generic1 = med1.genericName?.toLowerCase() || ''
  const generic2 = med2.genericName?.toLowerCase() || ''

  // Same generic name - only if it's a meaningful generic name (not empty or same as brand name)
  if (generic1 && generic2 && generic1 === generic2 && generic1 !== name1 && generic2 !== name2) {
    return true
  }

  // Same medication name - exact match only
  if (name1 === name2) {
    return true
  }

  // Generic name matches brand name - must be a significant match, not just partial inclusion
  // This prevents false positives like "albuterol" matching "albuterol sulfate"
  if ((generic1 && generic1 !== name1 && (name2 === generic1 || name2.startsWith(generic1 + ' ') || name2.endsWith(' ' + generic1))) || 
      (generic2 && generic2 !== name2 && (name1 === generic2 || name1.startsWith(generic2 + ' ') || name1.endsWith(' ' + generic2)))) {
    return true
  }

  return false
}

export function checkDosageWarnings(medication: Medication, patient: Patient): MedicationAlert | null {
  const medData = mockMedicationDatabase.find(med => 
    med.name.toLowerCase() === medication.name.toLowerCase() ||
    med.genericName.toLowerCase() === (medication.genericName || '').toLowerCase()
  )

  if (!medData) return null

  const dosage = medication.dosage.amount
  let isUnusual = false
  let message = ''
  let severity: AlertSeverity = 'low'

  // Check pediatric dosing for patients under 18
  if (patient.age < 18 && medData.pediatricDosing) {
    const maxDose = medData.pediatricDosing.maxDose || Infinity
    if (dosage > maxDose) {
      isUnusual = true
      severity = 'high'
      message = `Dosage (${dosage}${medication.dosage.unit}) exceeds maximum pediatric dose (${maxDose}${medication.dosage.unit})`
    }
  }
  // Check adult dosing
  else if (medData.adultDosing) {
    const { minDose, maxDose } = medData.adultDosing
    if (dosage > maxDose) {
      isUnusual = true
      severity = dosage > maxDose * 1.5 ? 'high' : 'moderate'
      message = `Dosage (${dosage}${medication.dosage.unit}) exceeds maximum recommended dose (${maxDose}${medication.dosage.unit})`
    } else if (dosage < minDose) {
      isUnusual = true
      severity = 'low'
      message = `Dosage (${dosage}${medication.dosage.unit}) is below minimum recommended dose (${minDose}${medication.dosage.unit})`
    }
  }

  if (!isUnusual) return null

  return {
    id: `dosage-${medication.id}`,
    type: 'dosage',
    severity,
    title: 'Dosage Warning',
    message,
    medicationId: medication.id,
    medicationName: medication.name,
    recommendation: severity === 'high' 
      ? 'Review dosage calculation and consider dose reduction.'
      : 'Verify dosage is appropriate for patient condition.',
    requiresAcknowledgment: severity === 'high',
    acknowledged: false
  }
}

export function checkAgeWarnings(medication: Medication, patient: Patient): MedicationAlert | null {
  const medData = mockMedicationDatabase.find(med => 
    med.name.toLowerCase() === medication.name.toLowerCase() ||
    med.genericName.toLowerCase() === (medication.genericName || '').toLowerCase()
  )

  if (!medData) return null

  // Check pediatric age restrictions
  if (patient.age < 18 && medData.pediatricDosing) {
    const { minAge, maxAge } = medData.pediatricDosing
    if (patient.age < minAge) {
      return {
        id: `age-${medication.id}`,
        type: 'age',
        severity: 'high',
        title: 'Age Warning',
        message: `${medication.name} is not recommended for patients under ${minAge} years old. Patient is ${patient.age} years old.`,
        medicationId: medication.id,
        medicationName: medication.name,
        recommendation: 'Consider alternative medication appropriate for patient age.',
        requiresAcknowledgment: true,
        acknowledged: false
      }
    }
    if (maxAge && patient.age > maxAge) {
      return {
        id: `age-${medication.id}`,
        type: 'age',
        severity: 'moderate',
        title: 'Age Warning',
        message: `${medication.name} pediatric dosing is typically for patients up to ${maxAge} years old. Patient is ${patient.age} years old.`,
        medicationId: medication.id,
        medicationName: medication.name,
        recommendation: 'Consider adult dosing guidelines.',
        requiresAcknowledgment: false,
        acknowledged: false
      }
    }
  }

  // Check for medications that require special caution in elderly patients (65+)
  if (patient.age >= 65) {
    const elderlyRiskyMedications = [
      'morphine', 'tramadol', 'clonazepam', 'gabapentin', 'digoxin'
    ]
    
    const medicationNameLower = medication.name.toLowerCase()
    const genericNameLower = medication.genericName?.toLowerCase() || ''
    
    if (elderlyRiskyMedications.some(risky => 
      medicationNameLower.includes(risky) || genericNameLower.includes(risky)
    )) {
      return {
        id: `age-elderly-${medication.id}`,
        type: 'age',
        severity: 'moderate',
        title: 'Elderly Patient Warning',
        message: `${medication.name} requires special caution in elderly patients (age ${patient.age}). Increased risk of adverse effects.`,
        medicationId: medication.id,
        medicationName: medication.name,
        recommendation: 'Consider dose reduction and monitor closely for adverse effects. Evaluate risk-benefit ratio.',
        requiresAcknowledgment: false,
        acknowledged: false
      }
    }
  }

  // Check for very young patients (under 2 years) with adult medications
  if (patient.age < 2 && !medData.pediatricDosing) {
    return {
      id: `age-infant-${medication.id}`,
      type: 'age',
      severity: 'critical',
      title: 'Infant Safety Warning',
      message: `${medication.name} does not have established pediatric dosing for infants under 2 years old. Patient is ${patient.age} years old.`,
      medicationId: medication.id,
      medicationName: medication.name,
      recommendation: 'Consult pediatric specialist before administration. Consider alternative therapy.',
      requiresAcknowledgment: true,
      acknowledged: false
    }
  }

  return null
}

export function checkContraindications(medication: Medication, patient: Patient): MedicationAlert | null {
  const medData = mockMedicationDatabase.find(med => 
    med.name.toLowerCase() === medication.name.toLowerCase() ||
    med.genericName.toLowerCase() === (medication.genericName || '').toLowerCase()
  )

  if (!medData || !medData.contraindications.length) return null

  const applicableContraindications: string[] = []

  // Check each contraindication against patient characteristics
  medData.contraindications.forEach(contraindication => {
    const contraLower = contraindication.toLowerCase()
    
    // Age-related contraindications
    if (patient.age < 18 && (contraLower.includes('children') || contraLower.includes('pediatric'))) {
      applicableContraindications.push(contraindication)
    }
    
    // Elderly-specific contraindications (assuming 65+ is elderly)
    if (patient.age >= 65 && contraLower.includes('elderly')) {
      applicableContraindications.push(contraindication)
    }
    
    // Pregnancy contraindications (would need additional patient data)
    if (contraLower.includes('pregnancy') && patient.gender?.toLowerCase() === 'female' && patient.age >= 12 && patient.age <= 50) {
      applicableContraindications.push(`${contraindication} (verify pregnancy status)`)
    }
    
    // Allergy-related contraindications
    if (patient.allergies) {
      patient.allergies.forEach(allergy => {
        if (contraLower.includes(allergy.allergen.toLowerCase()) || 
            (allergy.allergen.toLowerCase().includes('sulfa') && contraLower.includes('sulfonamide'))) {
          applicableContraindications.push(`${contraindication} (patient has ${allergy.allergen} allergy)`)
        }
      })
    }
  })

  if (applicableContraindications.length === 0) return null

  // Determine severity based on contraindication type
  let severity: AlertSeverity = 'moderate'
  const criticalTerms = ['pregnancy', 'anaphylaxis', 'severe', 'life-threatening']
  const highTerms = ['children', 'pediatric', 'allergy']
  
  if (applicableContraindications.some(contra => 
    criticalTerms.some(term => contra.toLowerCase().includes(term))
  )) {
    severity = 'critical'
  } else if (applicableContraindications.some(contra => 
    highTerms.some(term => contra.toLowerCase().includes(term))
  )) {
    severity = 'high'
  }

  return {
    id: `contraindication-${medication.id}`,
    type: 'contraindication',
    severity,
    title: 'Contraindication Warning',
    message: `${medication.name} has contraindications that may apply to this patient: ${applicableContraindications.join(', ')}`,
    medicationId: medication.id,
    medicationName: medication.name,
    recommendation: severity === 'critical' 
      ? 'Do not administer. Consider alternative medication immediately.'
      : 'Review contraindications carefully and consider alternative medication if appropriate.',
    requiresAcknowledgment: severity === 'critical' || severity === 'high',
    acknowledged: false
  }
}