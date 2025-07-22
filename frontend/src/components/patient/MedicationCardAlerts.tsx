import { useMemo } from 'react'
import { AlertTriangle, AlertCircle, Info } from 'lucide-react'
import type { Patient, Medication } from '../../types/patient'
import type { MedicationAlert, AlertSeverity } from './MedicationAlerts'
import { 
  isAllergyMatch, 
  findDrugInteraction, 
  isDuplicateMedication,
  checkDosageWarnings,
  checkAgeWarnings,
  checkContraindications
} from './MedicationAlerts'

interface MedicationCardAlertsProps {
  medication: Medication
  patient: Patient
  allMedications: Medication[]
  onAlertAcknowledge?: (alertId: string) => void
  acknowledgedAlerts?: Set<string>
}

export function MedicationCardAlerts({ 
  medication, 
  patient, 
  allMedications,
  onAlertAcknowledge,
  acknowledgedAlerts = new Set()
}: MedicationCardAlertsProps) {
  
  // Generate alerts specific to this medication
  const alerts = useMemo(() => {
    // Don't show alerts for discontinued medications
    if (medication.status === 'discontinued') {
      return []
    }
    
    const generatedAlerts: MedicationAlert[] = []

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
            message: `Patient is allergic to ${allergy.allergen}`,
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
          generatedAlerts.push({
            id: alertId,
            type: 'interaction',
            severity: interaction.severity,
            title: 'Drug Interaction',
            message: `May interact with ${otherMedication.name}`,
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
    })

    // 3. Duplicate medication alerts - check against active medications only (exclude discontinued)
    allMedications.forEach(otherMedication => {
      if (medication.id !== otherMedication.id && otherMedication.status !== 'discontinued' && isDuplicateMedication(medication, otherMedication)) {
        const alertId = `duplicate-${medication.id}-${otherMedication.id}`
        generatedAlerts.push({
          id: alertId,
          type: 'duplicate',
          severity: 'high',
          title: 'Duplicate Medication',
          message: `May be duplicate of ${otherMedication.name}`,
          medicationId: medication.id,
          medicationName: medication.name,
          relatedMedicationId: otherMedication.id,
          relatedMedicationName: otherMedication.name,
          recommendation: 'Review medications to avoid duplication and potential overdose.',
          requiresAcknowledgment: true,
          acknowledged: acknowledgedAlerts.has(alertId)
        })
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

    // Sort by severity and only show unacknowledged alerts
    return generatedAlerts
      .filter(alert => !alert.acknowledged)
      .sort((a, b) => {
        const severityOrder = { critical: 0, high: 1, moderate: 2, low: 3, info: 4 }
        return severityOrder[a.severity] - severityOrder[b.severity]
      })
  }, [medication, patient, allMedications, acknowledgedAlerts])

  if (alerts.length === 0) {
    return null
  }

  const getSeverityConfig = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-500',
          icon: AlertTriangle
        }
      case 'high':
        return {
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-800',
          iconColor: 'text-orange-500',
          icon: AlertCircle
        }
      case 'moderate':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-500',
          icon: AlertCircle
        }
      case 'low':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-500',
          icon: Info
        }
      case 'info':
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-500',
          icon: Info
        }
    }
  }

  return (
    <div className="mt-2 space-y-1">
      {alerts.slice(0, 2).map(alert => {
        const config = getSeverityConfig(alert.severity)
        const Icon = config.icon

        return (
          <div
            key={alert.id}
            className={`${config.bgColor} ${config.borderColor} border rounded-md p-2 text-xs`}
          >
            <div className="flex items-start space-x-2">
              <Icon className={`h-3 w-3 ${config.iconColor} mt-0.5 flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1 mb-1">
                  <span className={`font-medium ${config.textColor}`}>
                    {alert.title}
                  </span>
                  <span className={`px-1 py-0.5 rounded text-xs font-medium ${config.textColor} bg-white bg-opacity-50`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <p className={`${config.textColor} leading-tight`}>
                  {alert.message}
                </p>
                {alert.requiresAcknowledgment && onAlertAcknowledge && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onAlertAcknowledge(alert.id)
                    }}
                    className={`mt-1 px-2 py-1 text-xs font-medium rounded border transition-colors ${
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
      })}
      {alerts.length > 2 && (
        <div className="text-xs text-gray-500 text-center py-1">
          +{alerts.length - 2} more alert{alerts.length - 2 > 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}