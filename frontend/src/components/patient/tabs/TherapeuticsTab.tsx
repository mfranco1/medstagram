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
    <div className="space-y-6">
      {/* Header with Add Medication button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Current Medications</h3>
          <p className="text-sm text-gray-500">
            {medications.filter(med => med.status === 'active' || med.status === 'on-hold').length} active medications
          </p>
        </div>
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

      {/* Medication History Section */}
      {medications.some(med => med.status === 'discontinued' || med.status === 'completed') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Medication History</h3>
            <p className="text-sm text-gray-500">
              {medications.filter(med => med.status === 'discontinued' || med.status === 'completed').length} past medications
            </p>
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