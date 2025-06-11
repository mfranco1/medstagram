import { useState, useRef, useEffect } from 'react'
import { MainLayout } from '../components/layout/MainLayout'
import { Search, Plus, X, Filter, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { NewPatientModal } from '../components/patient/NewPatientModal'
import { Toast, type ToastType } from '../components/ui/Toast'
import { Select } from '../components/ui/Select'
import { PATIENT_STATUSES, PRIMARY_SERVICES } from '../constants/patient'
import { PatientsTable } from '../components/patient/PatientsTable'
import type { Patient } from '../types/patient'
import { mockPatients } from '../mocks/patients'

// Get unique locations for the filter dropdown
const locations = Array.from(new Set(mockPatients.map(patient => patient.location))).sort()

export default function PatientsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [serviceFilter, setServiceFilter] = useState('')
  const [sortField, setSortField] = useState<keyof Patient>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false)
  const [patients, setPatients] = useState<Patient[]>(mockPatients)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const filtersRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close filters
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setIsFiltersOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSort = (field: keyof Patient) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handlePatientClick = (patientId: number) => {
    navigate(`/soap/${patientId}`)
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setLocationFilter('')
    setStatusFilter('')
    setServiceFilter('')
  }

  const activeFiltersCount = [locationFilter, statusFilter, serviceFilter].filter(Boolean).length

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.caseNumber.includes(searchQuery)
    const matchesLocation = !locationFilter || patient.location === locationFilter
    const matchesStatus = !statusFilter || patient.status === statusFilter
    const matchesService = !serviceFilter || patient.primaryService === serviceFilter
    return matchesSearch && matchesLocation && matchesStatus && matchesService
  })

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    const modifier = sortDirection === 'asc' ? 1 : -1

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * modifier
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return (aValue - bValue) * modifier
    }
    return 0
  })

  const handleAddPatient = async (newPatient: Omit<Patient, 'id'>): Promise<void> => {
    // Check if case number already exists
    const caseNumberExists = patients.some(
      patient => patient.caseNumber === newPatient.caseNumber.padStart(6, '0')
    )

    if (caseNumberExists) {
      setToast({
        message: `A patient with case number ${newPatient.caseNumber.padStart(6, '0')} already exists`,
        type: 'error'
      })
      return
    }

    const patient: Patient = {
      ...newPatient,
      id: Math.max(...patients.map(p => p.id)) + 1
    }
    
    // Update both the local state and mockPatients array
    mockPatients.push(patient)
    setPatients([...mockPatients])
    
    setToast({
      message: `Patient ${patient.name} has been added successfully`,
      type: 'success'
    })
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
          <button
            onClick={() => setIsNewPatientModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Patient
          </button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar and Filters */}
          <div className="flex items-center space-x-2">
            <div className="relative w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, diagnosis, or case number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Filters Button */}
            <div className="relative" ref={filtersRef}>
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown className={`h-4 w-4 ml-2 transform transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Filters Dropdown */}
              {isFiltersOpen && (
                <div className="absolute z-20 mt-2 w-96 bg-white rounded-md shadow-lg border border-gray-200 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-900">Filter Patients</h3>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={handleResetFilters}
                        className="inline-flex items-center px-2 py-1 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <Select
                        value={locationFilter}
                        onChange={setLocationFilter}
                        options={[
                          { value: '', label: 'All Locations' },
                          ...locations.map(location => ({
                            value: location,
                            label: location
                          }))
                        ]}
                        placeholder="Select location"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <Select
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={[
                          { value: '', label: 'All Statuses' },
                          ...PATIENT_STATUSES.map(status => ({
                            value: status,
                            label: status
                          }))
                        ]}
                        placeholder="Select status"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service
                      </label>
                      <Select
                        value={serviceFilter}
                        onChange={setServiceFilter}
                        options={[
                          { value: '', label: 'All Services' },
                          ...PRIMARY_SERVICES.map(service => ({
                            value: service,
                            label: service
                          }))
                        ]}
                        placeholder="Select service"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Patients Table */}
        <PatientsTable
          patients={sortedPatients}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onPatientClick={handlePatientClick}
        />
      </div>

      <NewPatientModal
        isOpen={isNewPatientModalOpen}
        onClose={() => setIsNewPatientModalOpen(false)}
        onSave={handleAddPatient}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </MainLayout>
  )
} 