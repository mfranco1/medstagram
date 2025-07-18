import { useState, useEffect, useRef } from 'react'
import type { Medication } from '../../types/patient'
import { Pill, Edit, StopCircle, MoreVertical, ChevronDown, X } from 'lucide-react'
import { DISCONTINUATION_REASONS } from '../../services/medicationService'
import { Select } from '../ui/Select'

interface MedicationListProps {
  medications: Medication[]
  showHistory?: boolean
  onEdit?: (medication: Medication) => void
  onDiscontinue?: (medicationId: string, reason: string) => void
  onViewDetails?: (medication: Medication) => void
  patient?: { name: string }
}

export function MedicationList({
  medications,
  showHistory = false,
  onEdit,
  onDiscontinue,
  onViewDetails,
  patient
}: MedicationListProps) {
  const [showDiscontinueModal, setShowDiscontinueModal] = useState(false)
  const [medicationToDiscontinue, setMedicationToDiscontinue] = useState<Medication | null>(null)
  const [discontinuationReason, setDiscontinuationReason] = useState('')
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null)
  const [sortField, setSortField] = useState<keyof Medication | 'duration'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const actionsMenuRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

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

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleDiscontinueCancel()
      }
    }

    if (showDiscontinueModal) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDiscontinueModal])

  // Handle sorting
  const handleSort = (field: keyof Medication | 'duration') => {
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
    } else if (sortField === 'prescribedBy') {
      aValue = a.prescribedBy?.name || ''
      bValue = b.prescribedBy?.name || ''
    } else if (sortField === 'duration') {
      // Calculate duration in days from start date
      const aEndDate = a.endDate ? new Date(a.endDate) : new Date()
      const bEndDate = b.endDate ? new Date(b.endDate) : new Date()
      aValue = Math.ceil((aEndDate.getTime() - new Date(a.startDate).getTime()) / (1000 * 60 * 60 * 24))
      bValue = Math.ceil((bEndDate.getTime() - new Date(b.startDate).getTime()) / (1000 * 60 * 60 * 24))
    } else if (sortField === 'indication') {
      aValue = a.indication || ''
      bValue = b.indication || ''
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
      {/* Sorting Controls for Desktop */}
      <div className="hidden md:block bg-gray-50 px-4 py-2 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-gray-500 font-medium mr-1">Sort by:</span>
          <button
            onClick={() => handleSort('name')}
            className={`flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100 ${
              sortField === 'name' ? 'text-violet-600 bg-violet-50' : 'text-gray-600'
            }`}
          >
            <span>Name</span>
            {sortField === 'name' && (
              <ChevronDown className={`h-3 w-3 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
            )}
          </button>
          <button
            onClick={() => handleSort('startDate')}
            className={`flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100 ${
              sortField === 'startDate' ? 'text-violet-600 bg-violet-50' : 'text-gray-600'
            }`}
          >
            <span>Date</span>
            {sortField === 'startDate' && (
              <ChevronDown className={`h-3 w-3 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
            )}
          </button>
          <button
            onClick={() => handleSort('status')}
            className={`flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100 ${
              sortField === 'status' ? 'text-violet-600 bg-violet-50' : 'text-gray-600'
            }`}
          >
            <span>Status</span>
            {sortField === 'status' && (
              <ChevronDown className={`h-3 w-3 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
            )}
          </button>
          <button
            onClick={() => handleSort('dosage')}
            className={`flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100 ${
              sortField === 'dosage' ? 'text-violet-600 bg-violet-50' : 'text-gray-600'
            }`}
          >
            <span>Dosage</span>
            {sortField === 'dosage' && (
              <ChevronDown className={`h-3 w-3 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
            )}
          </button>
          <button
            onClick={() => handleSort('frequency')}
            className={`flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100 ${
              sortField === 'frequency' ? 'text-violet-600 bg-violet-50' : 'text-gray-600'
            }`}
          >
            <span>Frequency</span>
            {sortField === 'frequency' && (
              <ChevronDown className={`h-3 w-3 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
            )}
          </button>
          <button
            onClick={() => handleSort('route')}
            className={`flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100 ${
              sortField === 'route' ? 'text-violet-600 bg-violet-50' : 'text-gray-600'
            }`}
          >
            <span>Route</span>
            {sortField === 'route' && (
              <ChevronDown className={`h-3 w-3 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
            )}
          </button>
          <button
            onClick={() => handleSort('prescribedBy')}
            className={`flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100 ${
              sortField === 'prescribedBy' ? 'text-violet-600 bg-violet-50' : 'text-gray-600'
            }`}
          >
            <span>Prescriber</span>
            {sortField === 'prescribedBy' && (
              <ChevronDown className={`h-3 w-3 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
            )}
          </button>
          <button
            onClick={() => handleSort('duration')}
            className={`flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100 ${
              sortField === 'duration' ? 'text-violet-600 bg-violet-50' : 'text-gray-600'
            }`}
          >
            <span>Duration</span>
            {sortField === 'duration' && (
              <ChevronDown className={`h-3 w-3 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
            )}
          </button>
          <button
            onClick={() => handleSort('indication')}
            className={`flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100 ${
              sortField === 'indication' ? 'text-violet-600 bg-violet-50' : 'text-gray-600'
            }`}
          >
            <span>Indication</span>
            {sortField === 'indication' && (
              <ChevronDown className={`h-3 w-3 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
            )}
          </button>
        </div>
      </div>

      {/* Card View for All Screen Sizes */}
      <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
        {sortedMedications.map((medication) => (
          <div
            key={medication.id}
            className="p-3 md:p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => onViewDetails?.(medication)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm md:text-base font-medium text-gray-900 truncate">
                    {medication.name}
                  </h4>
                  <span className={`px-1.5 py-0.5 inline-flex text-xs font-medium rounded ${getStatusBadgeClass(medication.status)}`}>
                    {formatStatus(medication.status)}
                  </span>
                </div>
                {medication.genericName && medication.genericName !== medication.name && (
                  <p className="text-xs text-gray-500">
                    ({medication.genericName})
                  </p>
                )}
              </div>
              {(medication.status === 'active' || medication.status === 'on-hold') && (
                <div className="relative ml-2 flex-shrink-0" ref={showActionsMenu === medication.id ? actionsMenuRef : null}>
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

            {/* Desktop: Compact grid layout with more information */}
            <div className="hidden md:grid md:grid-cols-6 gap-3 text-xs text-gray-600 mb-2">
              <div>
                <span className="font-medium text-gray-700 block">Dosage</span>
                <span className="text-gray-900">{formatDosage(medication.dosage)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700 block">Route</span>
                <span className="text-gray-900">{formatRoute(medication.route)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700 block">Frequency</span>
                <span className="text-gray-900">{formatFrequency(medication.frequency)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700 block">Started</span>
                <span className="text-gray-900">{formatDate(medication.startDate)}</span>
              </div>
              {showHistory && medication.endDate ? (
                <div>
                  <span className="font-medium text-gray-700 block">Ended</span>
                  <span className="text-gray-900">{formatDate(medication.endDate)}</span>
                </div>
              ) : (
                <div>
                  <span className="font-medium text-gray-700 block">Duration</span>
                  <span className="text-gray-900">
                    {Math.ceil((new Date().getTime() - new Date(medication.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
              )}
              {medication.prescribedBy && (
                <div>
                  <span className="font-medium text-gray-700 block">Prescriber</span>
                  <span className="text-gray-900 truncate">{medication.prescribedBy.name}</span>
                </div>
              )}
            </div>

            {/* Mobile: Compact grid layout */}
            <div className="md:hidden grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
              <div>
                <span className="font-medium">Dosage:</span> <span className="text-gray-900">{formatDosage(medication.dosage)}</span>
              </div>
              <div>
                <span className="font-medium">Route:</span> <span className="text-gray-900">{formatRoute(medication.route)}</span>
              </div>
              <div>
                <span className="font-medium">Frequency:</span> <span className="text-gray-900">{formatFrequency(medication.frequency)}</span>
              </div>
              <div>
                <span className="font-medium">Started:</span> <span className="text-gray-900">{formatDate(medication.startDate)}</span>
              </div>
              {showHistory && medication.endDate && (
                <div className="col-span-2">
                  <span className="font-medium">Ended:</span> <span className="text-gray-900">{formatDate(medication.endDate)}</span>
                </div>
              )}
            </div>

            {medication.indication && (
              <div className="text-xs text-gray-600 bg-gray-50 rounded p-2">
                <span className="font-medium text-gray-700">Indication:</span>
                <span className="ml-1 text-gray-900">{medication.indication}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Discontinuation Modal */}
      {showDiscontinueModal && medicationToDiscontinue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div ref={modalRef} className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Discontinue Medication
              </h3>
              <button
                type="button"
                onClick={handleDiscontinueCancel}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                You are about to discontinue the following medication{patient ? ` for ${patient.name}` : ''}:
              </p>
              <div className="bg-gray-50 rounded-md p-3">
                <p className="font-medium text-gray-900">{medicationToDiscontinue.name}</p>
                <p className="text-sm text-gray-600">
                  {formatDosage(medicationToDiscontinue.dosage)} - {formatFrequency(medicationToDiscontinue.frequency)}
                </p>
                {patient && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">Patient:</span> {patient.name}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <Select
                label="Reason for discontinuation"
                value={discontinuationReason}
                onChange={setDiscontinuationReason}
                options={DISCONTINUATION_REASONS.map((reason) => ({
                  value: reason,
                  label: reason
                }))}
                placeholder="Select a reason..."
                required
              />
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