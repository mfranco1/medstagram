import type { Medication } from '../../types/patient'
import { Pill } from 'lucide-react'

interface MedicationListProps {
  medications: Medication[]
  showHistory?: boolean
  onEdit?: (medication: Medication) => void
  onDiscontinue?: (medicationId: string, reason: string) => void
  onViewDetails?: (medication: Medication) => void
}

export function MedicationList({ 
  medications, 
  showHistory = false,
  onEdit,
  onDiscontinue,
  onViewDetails 
}: MedicationListProps) {
  // Filter medications based on showHistory flag
  const filteredMedications = showHistory 
    ? medications 
    : medications.filter(med => med.status === 'active' || med.status === 'on-hold')

  // Helper function to format frequency
  const formatFrequency = (frequency: Medication['frequency']) => {
    const { times, period } = frequency
    if (times === 1) {
      return `Once ${period}`
    }
    return `${times}x ${period}`
  }

  // Helper function to format dosage
  const formatDosage = (dosage: Medication['dosage']) => {
    return `${dosage.amount} ${dosage.unit}`
  }

  // Helper function to format route
  const formatRoute = (route: string) => {
    const routeMap: { [key: string]: string } = {
      'oral': 'PO',
      'IV': 'IV',
      'IM': 'IM',
      'topical': 'Topical',
      'inhalation': 'Inhaled',
      'sublingual': 'SL',
      'rectal': 'PR',
      'other': 'Other'
    }
    return routeMap[route] || route
  }

  // Helper function to get status badge styling
  const getStatusBadgeClass = (status: Medication['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'discontinued':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Helper function to format status text
  const formatStatus = (status: Medication['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (filteredMedications.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="text-center py-8">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <Pill className="h-12 w-12" />
          </div>
          <p className="text-sm text-gray-500 mb-2">
            {showHistory ? 'No medication history found' : 'No current medications'}
          </p>
          <p className="text-xs text-gray-400">
            {showHistory 
              ? 'This patient has no recorded medications' 
              : 'Click "Add Medication" to start managing medications'
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medication
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dosage
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Frequency
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Date
              </th>
              {showHistory && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
              )}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Indication
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMedications.map((medication) => (
              <tr 
                key={medication.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onViewDetails?.(medication)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {medication.name}
                  </div>
                  {medication.genericName && medication.genericName !== medication.name && (
                    <div className="text-xs text-gray-500">
                      ({medication.genericName})
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDosage(medication.dosage)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatFrequency(medication.frequency)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatRoute(medication.route)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(medication.status)}`}>
                    {formatStatus(medication.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(medication.startDate)}
                </td>
                {showHistory && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {medication.endDate ? formatDate(medication.endDate) : '-'}
                  </td>
                )}
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="max-w-xs truncate">
                    {medication.indication || '-'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200">
        {filteredMedications.map((medication) => (
          <div 
            key={medication.id}
            className="p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => onViewDetails?.(medication)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">
                  {medication.name}
                </h4>
                {medication.genericName && medication.genericName !== medication.name && (
                  <p className="text-xs text-gray-500">
                    ({medication.genericName})
                  </p>
                )}
              </div>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(medication.status)}`}>
                {formatStatus(medication.status)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
              <div>
                <span className="font-medium">Dosage:</span> {formatDosage(medication.dosage)}
              </div>
              <div>
                <span className="font-medium">Route:</span> {formatRoute(medication.route)}
              </div>
              <div>
                <span className="font-medium">Frequency:</span> {formatFrequency(medication.frequency)}
              </div>
              <div>
                <span className="font-medium">Started:</span> {formatDate(medication.startDate)}
              </div>
              {showHistory && medication.endDate && (
                <div className="col-span-2">
                  <span className="font-medium">Ended:</span> {formatDate(medication.endDate)}
                </div>
              )}
            </div>
            
            {medication.indication && (
              <div className="text-xs text-gray-600">
                <span className="font-medium">Indication:</span> {medication.indication}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}