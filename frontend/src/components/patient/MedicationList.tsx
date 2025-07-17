import { useState, useEffect, useRef } from 'react'
import type { Medication } from '../../types/patient'
import { Pill, Edit, StopCircle, MoreVertical, ChevronDown } from 'lucide-react'
import { DISCONTINUATION_REASONS } from '../../services/medicationService'

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
  const [showDiscontinueModal, setShowDiscontinueModal] = useState(false)
  const [medicationToDiscontinue, setMedicationToDiscontinue] = useState<Medication | null>(null)
  const [discontinuationReason, setDiscontinuationReason] = useState('')
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null)
  const [sortField, setSortField] = useState<keyof Medication>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const actionsMenuRef = useRef<HTMLDivElement>(null)

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
        setShowActionsMenu(null)
      }
    }

    if (showActionsMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showActionsMenu])

  // Handle sorting
  const handleSort = (field: keyof Medication) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Filter medications based on showHistory flag
  const filteredMedications = showHistory
    ? medications
    : medications.filter(med => med.status === 'active' || med.status === 'on-hold')

  // Sort medications
  const sortedMedications = [...filteredMedications].sort((a, b) => {
    let aValue: any = a[sortField]
    let bValue: any = b[sortField]
    const modifier = sortDirection === 'asc' ? 1 : -1

    // Handle nested objects for sorting
    if (sortField === 'dosage') {
      aValue = a.dosage.amount
      bValue = b.dosage.amount
    } else if (sortField === 'frequency') {
      aValue = a.frequency.times
      bValue = b.frequency.times
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * modifier
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return (aValue - bValue) * modifier
    }
    return 0
  })

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

  // Handle discontinue medication
  const handleDiscontinueClick = (medication: Medication, event: React.MouseEvent) => {
    event.stopPropagation()
    setMedicationToDiscontinue(medication)
    setShowDiscontinueModal(true)
    setShowActionsMenu(null)
  }

  // Handle edit medication
  const handleEditClick = (medication: Medication, event: React.MouseEvent) => {
    event.stopPropagation()
    onEdit?.(medication)
    setShowActionsMenu(null)
  }

  // Handle discontinue confirmation
  const handleDiscontinueConfirm = () => {
    if (medicationToDiscontinue && discontinuationReason && onDiscontinue) {
      onDiscontinue(medicationToDiscontinue.id, discontinuationReason)
      setShowDiscontinueModal(false)
      setMedicationToDiscontinue(null)
      setDiscontinuationReason('')
    }
  }

  // Handle discontinue cancel
  const handleDiscontinueCancel = () => {
    setShowDiscontinueModal(false)
    setMedicationToDiscontinue(null)
    setDiscontinuationReason('')
  }

  // Toggle actions menu
  const toggleActionsMenu = (medicationId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setShowActionsMenu(showActionsMenu === medicationId ? null : medicationId)
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
      <div className="hidden md:block overflow-x-auto overflow-y-auto max-h-[600px]">
        <table className="min-w-full divide-y divide-gray-200 h-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Medication</span>
                  {sortField === 'name' && (
                    <ChevronDown className={`h-4 w-4 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('dosage')}
              >
                <div className="flex items-center space-x-1">
                  <span>Dosage</span>
                  {sortField === 'dosage' && (
                    <ChevronDown className={`h-4 w-4 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('frequency')}
              >
                <div className="flex items-center space-x-1">
                  <span>Frequency</span>
                  {sortField === 'frequency' && (
                    <ChevronDown className={`h-4 w-4 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('route')}
              >
                <div className="flex items-center space-x-1">
                  <span>Route</span>
                  {sortField === 'route' && (
                    <ChevronDown className={`h-4 w-4 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {sortField === 'status' && (
                    <ChevronDown className={`h-4 w-4 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('startDate')}
              >
                <div className="flex items-center space-x-1">
                  <span>Start Date</span>
                  {sortField === 'startDate' && (
                    <ChevronDown className={`h-4 w-4 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </th>
              {showHistory && (
                <th 
                  scope="col" 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('endDate')}
                >
                  <div className="flex items-center space-x-1">
                    <span>End Date</span>
                    {sortField === 'endDate' && (
                      <ChevronDown className={`h-4 w-4 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
              )}
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('indication')}
              >
                <div className="flex items-center space-x-1">
                  <span>Indication</span>
                  {sortField === 'indication' && (
                    <ChevronDown className={`h-4 w-4 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </th>
              <th scope="col" className="relative px-6 py-4">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedMedications.map((medication) => (
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
                    <div className="text-xs text-gray-500 mt-1">
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
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(medication.status)}`}>
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
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {(medication.status === 'active' || medication.status === 'on-hold') && (
                    <div className="relative" ref={showActionsMenu === medication.id ? actionsMenuRef : null}>
                      <button
                        onClick={(e) => toggleActionsMenu(medication.id, e)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>

                      {showActionsMenu === medication.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                          <div className="py-1">
                            <button
                              onClick={(e) => handleEditClick(medication, e)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Medication
                            </button>
                            <button
                              onClick={(e) => handleDiscontinueClick(medication, e)}
                              className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                            >
                              <StopCircle className="h-4 w-4 mr-2" />
                              Discontinue
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200">
        {sortedMedications.map((medication) => (
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
              <div className="flex items-center space-x-2">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(medication.status)}`}>
                  {formatStatus(medication.status)}
                </span>
                {(medication.status === 'active' || medication.status === 'on-hold') && (
                  <div className="relative" ref={showActionsMenu === medication.id ? actionsMenuRef : null}>
                    <button
                      onClick={(e) => toggleActionsMenu(medication.id, e)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {showActionsMenu === medication.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                        <div className="py-1">
                          <button
                            onClick={(e) => handleEditClick(medication, e)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Medication
                          </button>
                          <button
                            onClick={(e) => handleDiscontinueClick(medication, e)}
                            className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                          >
                            <StopCircle className="h-4 w-4 mr-2" />
                            Discontinue
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
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

      {/* Discontinuation Modal */}
      {showDiscontinueModal && medicationToDiscontinue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Discontinue Medication
            </h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                You are about to discontinue:
              </p>
              <div className="bg-gray-50 rounded-md p-3">
                <p className="font-medium text-gray-900">{medicationToDiscontinue.name}</p>
                <p className="text-sm text-gray-600">
                  {formatDosage(medicationToDiscontinue.dosage)} - {formatFrequency(medicationToDiscontinue.frequency)}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for discontinuation <span className="text-red-500">*</span>
              </label>
              <select
                value={discontinuationReason}
                onChange={(e) => setDiscontinuationReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                required
              >
                <option value="">Select a reason...</option>
                {DISCONTINUATION_REASONS.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDiscontinueCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDiscontinueConfirm}
                disabled={!discontinuationReason}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Discontinue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}