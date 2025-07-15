import type { Patient } from '../../../types/patient'
import { MedicationList } from '../MedicationList'
import { Plus } from 'lucide-react'

interface TherapeuticsTabProps {
  patient: Patient
}

export function TherapeuticsTab({ patient }: TherapeuticsTabProps) {
  const medications = patient.medications || []

  const handleViewDetails = (medication: any) => {
    console.log('View medication details:', medication)
    // TODO: Implement medication details modal
  }

  return (
    <div className="space-y-8">
      {/* Header with Add Medication button */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900">Current Medications</h3>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
            <Plus className="h-4 w-4 mr-2" />
            Add Medication
          </button>
        </div>
        {/* Current Medications List */}
        <MedicationList 
          medications={medications}
          showHistory={false}
          onViewDetails={handleViewDetails}
        />
      </div>

      {/* Medication History Section */}
      {medications.some(med => med.status === 'discontinued' || med.status === 'completed') && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Medication History</h3>
          </div>
          <MedicationList 
            medications={medications.filter(med => med.status === 'discontinued' || med.status === 'completed')}
            showHistory={true}
            onViewDetails={handleViewDetails}
          />
        </div>
      )}
    </div>
  )
} 