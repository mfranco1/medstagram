import { useState, useMemo, useCallback, useEffect } from 'react'
import type { Patient, Medication } from '../../../types/patient'
import { MedicationList } from '../MedicationList'
import { MedicationForm } from '../MedicationForm'
import { MedicationService, DISCONTINUATION_REASONS } from '../../../services/medicationService'
import { Toast, type ToastType } from '../../ui/Toast'
import { Plus, Search, Filter } from 'lucide-react'

interface TherapeuticsTabProps {
  patient: Patient
}

type MedicationFilter = 'all' | 'active' | 'inactive'

export function TherapeuticsTab({ patient }: TherapeuticsTabProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<MedicationFilter>('active')
  const [showAddMedicationModal, setShowAddMedicationModal] = useState(false)
  const [editingMedication, setEditingMedication] = useState<Medication | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [medications, setMedications] = useState<Medication[]>(patient.medications || [])
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  // Sync local state with patient data when patient changes
  useEffect(() => {
    setMedications(patient.medications || [])
  }, [patient.medications])

  // Force refresh medications from the patient data
  const refreshMedications = useCallback(() => {
    setMedications([...(patient.medications || [])])
  }, [patient.medications])

  // Filter and search medications
  const filteredMedications = useMemo(() => {
    let filtered = medications

    // Apply status filter
    switch (filter) {
      case 'active':
        filtered = filtered.filter(med => med.status === 'active' || med.status === 'on-hold')
        break
      case 'inactive':
        filtered = filtered.filter(med => med.status === 'discontinued' || med.status === 'completed')
        break
      case 'all':
        // Show all medications
        break
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(med => 
        med.name.toLowerCase().includes(searchLower) ||
        (med.genericName && med.genericName.toLowerCase().includes(searchLower)) ||
        (med.indication && med.indication.toLowerCase().includes(searchLower))
      )
    }

    return filtered
  }, [medications, filter, searchTerm])

  const handleViewDetails = useCallback((medication: Medication) => {
    console.log('View medication details:', medication)
    // TODO: Implement medication details modal
  }, [])

  const handleEdit = useCallback((medication: Medication) => {
    setEditingMedication(medication)
    setShowAddMedicationModal(true)
  }, [])

  const handleDiscontinue = useCallback(async (medicationId: string, reason: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      await MedicationService.discontinueMedication(patient.id, medicationId, reason)
      refreshMedications() // Force UI update
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to discontinue medication')
      console.error('Error discontinuing medication:', err)
    } finally {
      setIsLoading(false)
    }
  }, [patient.id, refreshMedications])

  const handleAddMedication = useCallback(() => {
    setEditingMedication(undefined)
    setShowAddMedicationModal(true)
  }, [])

  const handleSaveMedication = useCallback(async (medicationData: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true)
    setError(null)
    
    try {
      if (editingMedication) {
        // Update existing medication
        await MedicationService.updateMedication(
          patient.id, 
          editingMedication.id, 
          medicationData
        )
        setToast({
          message: `${medicationData.name} has been updated successfully`,
          type: 'success'
        })
      } else {
        // Create new medication
        await MedicationService.createMedication(patient.id, medicationData)
        setToast({
          message: `${medicationData.name} has been added successfully`,
          type: 'success'
        })
      }
      
      refreshMedications() // Force UI update
      setShowAddMedicationModal(false)
      setEditingMedication(undefined)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save medication'
      setError(errorMessage)
      setToast({
        message: editingMedication 
          ? `Failed to update ${medicationData.name}: ${errorMessage}`
          : `Failed to add ${medicationData.name}: ${errorMessage}`,
        type: 'error'
      })
      console.error('Error saving medication:', err)
    } finally {
      setIsLoading(false)
    }
  }, [patient.id, editingMedication, refreshMedications])

  const handleCancelMedication = useCallback(() => {
    setShowAddMedicationModal(false)
    setEditingMedication(undefined)
    setError(null)
  }, [])

  // Get medication counts for filter badges
  const activeMedicationsCount = medications.filter(med => med.status === 'active' || med.status === 'on-hold').length
  const inactiveMedicationsCount = medications.filter(med => med.status === 'discontinued' || med.status === 'completed').length
  const totalMedicationsCount = medications.length

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Medication Management</h2>
          <p className="text-sm text-gray-500">
            Manage {patient.name}'s current and historical medications
          </p>
        </div>
        <button 
          onClick={handleAddMedication}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Medication
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search medications by name, generic name, or indication..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 text-sm"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === 'active'
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Active
              {activeMedicationsCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                  {activeMedicationsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === 'inactive'
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Inactive
              {inactiveMedicationsCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {inactiveMedicationsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All
              {totalMedicationsCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {totalMedicationsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || filter !== 'active') && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span>Filters:</span>
            {filter !== 'active' && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-violet-100 text-violet-800">
                Status: {filter}
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800">
                Search: "{searchTerm}"
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('')
                setFilter('active')
              }}
              className="text-violet-600 hover:text-violet-800 font-medium"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results Summary */}
      {filteredMedications.length !== medications.length && (
        <div className="text-sm text-gray-600">
          Showing {filteredMedications.length} of {medications.length} medications
        </div>
      )}

      {/* Medications List or Empty States */}
      <div>
        {filteredMedications.length > 0 ? (
          <MedicationList 
            medications={filteredMedications}
            showHistory={filter === 'inactive' || filter === 'all'}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDiscontinue={handleDiscontinue}
            patient={{ name: patient.name }}
          />
        ) : medications.length === 0 ? (
          // Show MedicationList's empty state when patient has no medications at all
          <MedicationList 
            medications={[]}
            showHistory={filter === 'inactive' || filter === 'all'}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDiscontinue={handleDiscontinue}
            patient={{ name: patient.name }}
          />
        ) : (
          // Show custom empty state when search/filter returns no results
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <Search className="h-12 w-12" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">No medications found</h3>
            <p className="text-sm text-gray-500 mb-4">
              No medications match your current search and filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setFilter('active')
              }}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <svg className="animate-spin h-5 w-5 text-violet-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm font-medium text-gray-900">
              {editingMedication ? 'Updating medication...' : 'Saving medication...'}
            </span>
          </div>
        </div>
      )}

      {/* Medication Form Modal */}
      <MedicationForm
        isOpen={showAddMedicationModal}
        medication={editingMedication}
        patient={patient}
        onSave={handleSaveMedication}
        onCancel={handleCancelMedication}
      />

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
} 