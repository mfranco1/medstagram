import { useState, useEffect } from 'react'
import { Calculator, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'
import type { Patient, MedicationDatabase, DosageCalculation } from '../../types/patient'
import { 
  calculateWeightBasedDose, 
  calculateTotalDailyDose,
  validateMedicationForPatient,
  formatDosageCalculation,
  isPediatric
} from '../../utils/dosageCalculator'

interface DosageCalculatorProps {
  patient: Patient
  medication?: MedicationDatabase
  dosageAmount: number
  dosageUnit: string
  frequencyTimes: number
  frequencyPeriod: 'daily' | 'weekly' | 'monthly'
  onCalculationComplete?: (calculation: DosageCalculation) => void
  className?: string
}

export function DosageCalculator({
  patient,
  medication,
  dosageAmount,
  dosageUnit,
  frequencyTimes,
  frequencyPeriod,
  onCalculationComplete,
  className = ''
}: DosageCalculatorProps) {
  const [calculation, setCalculation] = useState<DosageCalculation | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)

  // Perform calculation when inputs change
  useEffect(() => {
    if (!medication || !patient || dosageAmount <= 0) {
      setCalculation(null)
      return
    }

    setIsCalculating(true)
    
    // Simulate calculation delay for better UX
    const timer = setTimeout(() => {
      try {
        const calc = calculateWeightBasedDose(patient, medication, dosageAmount)
        
        // Add medication-specific warnings
        const medicationWarnings = validateMedicationForPatient(patient, medication, dosageAmount)
        calc.warnings.push(...medicationWarnings)
        
        // Calculate total daily dose
        const totalDailyDose = calculateTotalDailyDose(dosageAmount, frequencyTimes, frequencyPeriod)
        if (totalDailyDose !== dosageAmount) {
          calc.warnings.push(`Total daily dose: ${totalDailyDose.toFixed(1)} ${dosageUnit}`)
        }
        
        setCalculation(calc)
        onCalculationComplete?.(calc)
      } catch (error) {
        console.error('Dosage calculation error:', error)
        setCalculation({
          patientWeight: patient.weight || 0,
          dosePerKg: 0,
          calculatedAmount: dosageAmount,
          recommendedDose: dosageAmount,
          formula: 'Calculation error occurred',
          warnings: ['Unable to calculate dosage - please verify manually'],
          isWithinNormalRange: false
        })
      } finally {
        setIsCalculating(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [patient, medication, dosageAmount, dosageUnit, frequencyTimes, frequencyPeriod, onCalculationComplete])

  if (!medication || !patient) {
    return null
  }

  const formatted = calculation ? formatDosageCalculation(calculation) : null
  const isPediatricPatient = isPediatric(patient.age)

  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="w-4 h-4 text-violet-600" />
        <h4 className="text-sm font-medium text-gray-900">Dosage Calculator</h4>
        {isCalculating && (
          <div className="w-4 h-4 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {/* Patient Information */}
      <div className="grid grid-cols-2 gap-4 mb-3 text-xs text-gray-600">
        <div>
          <span className="font-medium">Age:</span> {patient.age} years
          {isPediatricPatient && <span className="ml-1 text-blue-600">(Pediatric)</span>}
        </div>
        <div>
          <span className="font-medium">Weight:</span> {patient.weight ? `${patient.weight} kg` : 'Not recorded'}
        </div>
      </div>

      {/* Medication Information */}
      <div className="mb-3 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span className="font-medium">Medication:</span>
          <span>{medication.name}</span>
          {medication.isWeightBased && (
            <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs">Weight-based</span>
          )}
        </div>
      </div>

      {/* Calculation Results */}
      {calculation && formatted && (
        <div className="space-y-3">
          {/* Summary */}
          <div className={`p-3 rounded-md ${
            formatted.warningLevel === 'error' ? 'bg-red-50 border border-red-200' :
            formatted.warningLevel === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
            formatted.warningLevel === 'info' ? 'bg-blue-50 border border-blue-200' :
            'bg-green-50 border border-green-200'
          }`}>
            <div className="flex items-start gap-2">
              {formatted.warningLevel === 'error' && <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />}
              {formatted.warningLevel === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />}
              {formatted.warningLevel === 'info' && <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />}
              {formatted.warningLevel === 'none' && <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />}
              
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  formatted.warningLevel === 'error' ? 'text-red-800' :
                  formatted.warningLevel === 'warning' ? 'text-yellow-800' :
                  formatted.warningLevel === 'info' ? 'text-blue-800' :
                  'text-green-800'
                }`}>
                  {formatted.summary}
                </p>
                
                {calculation.warnings.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {calculation.warnings.slice(0, showDetails ? undefined : 2).map((warning, index) => (
                      <p key={index} className={`text-xs ${
                        warning.includes('ALLERGY') || warning.includes('CONTRAINDICATION') ? 'text-red-700 font-medium' :
                        formatted.warningLevel === 'error' ? 'text-red-700' :
                        formatted.warningLevel === 'warning' ? 'text-yellow-700' :
                        formatted.warningLevel === 'info' ? 'text-blue-700' :
                        'text-green-700'
                      }`}>
                        {warning}
                      </p>
                    ))}
                    
                    {calculation.warnings.length > 2 && !showDetails && (
                      <button
                        type="button"
                        onClick={() => setShowDetails(true)}
                        className="text-xs text-violet-600 hover:text-violet-700 underline"
                      >
                        Show {calculation.warnings.length - 2} more warning{calculation.warnings.length - 2 !== 1 ? 's' : ''}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Calculation Details */}
          {formatted.details.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-md p-3">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 w-full text-left"
              >
                <span>Calculation Details</span>
                <svg
                  className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showDetails && (
                <div className="mt-2 space-y-1">
                  {formatted.details.map((detail, index) => (
                    <p key={index} className="text-xs text-gray-600">
                      {detail}
                    </p>
                  ))}
                  
                  {/* Additional calculation info */}
                  <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                    <p>Frequency: {frequencyTimes} time{frequencyTimes !== 1 ? 's' : ''} {frequencyPeriod}</p>
                    <p>Total daily dose: {calculateTotalDailyDose(dosageAmount, frequencyTimes, frequencyPeriod).toFixed(1)} {dosageUnit}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          {calculation.recommendedDose !== dosageAmount && calculation.recommendedDose > 0 && (
            <div className="bg-violet-50 border border-violet-200 rounded-md p-3">
              <p className="text-sm text-violet-800 mb-2">
                Recommended dose differs from entered dose
              </p>
              <button
                type="button"
                onClick={() => {
                  // This would be handled by the parent component
                  const event = new CustomEvent('useRecommendedDose', {
                    detail: { recommendedDose: calculation.recommendedDose }
                  })
                  window.dispatchEvent(event)
                }}
                className="text-xs bg-violet-600 text-white px-2 py-1 rounded hover:bg-violet-700 transition-colors"
              >
                Use Recommended Dose ({calculation.recommendedDose} {dosageUnit})
              </button>
            </div>
          )}
        </div>
      )}

      {/* No Weight Warning */}
      {(!patient.weight || patient.weight <= 0) && medication.isWeightBased && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Patient Weight Required</p>
              <p className="text-xs text-yellow-700 mt-1">
                This medication requires weight-based dosing. Please update the patient's weight for accurate calculations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}