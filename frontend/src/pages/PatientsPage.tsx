import { useState } from 'react'
import { MainLayout } from '../components/layout/MainLayout'
import { Search, Plus } from 'lucide-react'
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Name, diagnosis, or CN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
            />
          </div>
          <div>
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