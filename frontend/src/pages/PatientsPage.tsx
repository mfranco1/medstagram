import { useState } from 'react'
import { MainLayout } from '../components/layout/MainLayout'
import { Search, Plus, MoreVertical, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { NewPatientModal } from '../components/patient/NewPatientModal'
import { Toast, type ToastType } from '../components/ui/Toast'
import { Select } from '../components/ui/Select'
import { STATUS_COLORS, PATIENT_STATUSES } from '../constants/patient'
import { calculateAge, formatAge } from '../utils/patient'

export interface Patient {
  id: number
  name: string
  age: number
  gender: string
  caseNumber: string
  dateAdmitted: string
  location: string
  status: string
  diagnosis: string
  dateOfBirth: string
  civilStatus: string
  nationality: string
  religion: string
  address: string
  philhealth: string
}

// Mock data - will be replaced with API calls later
export const mockPatients: Patient[] = [
  {
    id: 1,
    name: 'Restituto Arapipap',
    age: 45,
    gender: 'Male',
    caseNumber: '123456',
    dateAdmitted: '2024-03-15',
    location: 'Ward 3',
    status: 'Active Admission',
    diagnosis: 'Acute Respiratory Failure, Type 1, secondary to Community Acquired Pneumonia, High Risk',
    dateOfBirth: '1979-05-15',
    civilStatus: 'Married',
    nationality: 'Filipino',
    religion: 'Roman Catholic',
    address: '123 P Faura St., Manila City',
    philhealth: '12-345678901-2'
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 32,
    gender: 'Female',
    caseNumber: '123457',
    dateAdmitted: '2024-03-10',
    location: 'Ward 3',
    status: 'Active Admission',
    diagnosis: 'Acute Respiratory Failure',
    dateOfBirth: '1992-08-23',
    civilStatus: 'Single',
    nationality: 'Filipino',
    religion: 'Protestant',
    address: '456 Taft Ave., Manila City',
    philhealth: '12-345678901-3'
  },
  {
    id: 3,
    name: 'Robert Johnson',
    age: 58,
    gender: 'Male',
    caseNumber: '123458',
    dateAdmitted: '2024-03-05',
    location: 'Ward 4',
    status: 'Discharged',
    diagnosis: 'Septic Shock, secondary to A. baumani bacteremia',
    dateOfBirth: '1966-03-10',
    civilStatus: 'Widowed',
    nationality: 'Filipino',
    religion: 'Roman Catholic',
    address: '789 Roxas Blvd., Manila City',
    philhealth: '12-345678901-4'
  },
  {
    id: 4,
    name: 'Emily Davis',
    age: 29,
    gender: 'Female',
    caseNumber: '123459',
    dateAdmitted: '2024-03-18',
    location: 'Ward 4',
    status: 'Active Admission',
    diagnosis: 'Systemic Lupus Erythematosus',
    dateOfBirth: '1995-11-30',
    civilStatus: 'Single',
    nationality: 'Filipino',
    religion: 'Roman Catholic',
    address: '321 Rizal Ave., Manila City',
    philhealth: '12-345678901-5'
  },
  {
    id: 5,
    name: 'Michael Wilson',
    age: 41,
    gender: 'Male',
    caseNumber: '123460',
    dateAdmitted: '2024-03-12',
    location: 'Ward 1',
    status: 'Active Admission',
    diagnosis: 'Acute CVD Infarct',
    dateOfBirth: '1983-07-15',
    civilStatus: 'Married',
    nationality: 'Filipino',
    religion: 'Roman Catholic',
    address: '654 España Blvd., Manila City',
    philhealth: '12-345678901-6'
  },
  {
    id: 6,
    name: 'Sarah Chen',
    age: 35,
    gender: 'Female',
    caseNumber: '123461',
    dateAdmitted: '2024-04-20',
    location: 'Ward 1',
    status: 'Active Admission',
    diagnosis: 'Acute Pancreatitis',
    dateOfBirth: '1989-04-12',
    civilStatus: 'Married',
    nationality: 'Filipino',
    religion: 'Buddhist',
    address: '987 Quezon Ave., Manila City',
    philhealth: '12-345678901-7'
  },
  {
    id: 7,
    name: 'James Rodriguez',
    age: 62,
    gender: 'Male',
    caseNumber: '123462',
    dateAdmitted: '2024-03-17',
    location: 'Ward 1',
    status: 'Active Admission',
    diagnosis: 'Congestive Heart Failure, HFrEF, NYHA III, not in acute decompensation',
    dateOfBirth: '1962-09-25',
    civilStatus: 'Married',
    nationality: 'Filipino',
    religion: 'Roman Catholic',
    address: '147 Quirino Ave., Manila City',
    philhealth: '12-345678901-8'
  },
  {
    id: 8,
    name: 'Maria Garcia',
    age: 28,
    gender: 'Female',
    caseNumber: '123463',
    dateAdmitted: '2024-03-14',
    location: 'Ward 2',
    status: 'Discharged',
    diagnosis: 'Acute Appendicitis',
    dateOfBirth: '1996-02-18',
    civilStatus: 'Single',
    nationality: 'Filipino',
    religion: 'Roman Catholic',
    address: '258 Sampaloc St., Manila City',
    philhealth: '12-345678901-9'
  },
  {
    id: 9,
    name: 'David Kim',
    age: 0,
    gender: 'Male',
    caseNumber: '123464',
    dateAdmitted: '2024-03-19',
    location: 'Ward 2',
    status: 'Active Admission',
    diagnosis: 'Acute Kidney Injury on top of Chronic Kidney Disease, stage V, from DMKD/HTKD, not in uremia',
    dateOfBirth: '2025-06-01',
    civilStatus: 'Married',
    nationality: 'Filipino',
    religion: 'Protestant',
    address: '369 Malate St., Manila City',
    philhealth: '12-345678901-0'
  },
  {
    id: 10,
    name: 'Lisa Patel',
    age: 39,
    gender: 'Female',
    caseNumber: '123465',
    dateAdmitted: '2024-03-16',
    location: 'Ward 2',
    status: 'Active Admission',
    diagnosis: 'Acute Cholecystitis secondary to Choledocholithiasis, not in cholangitis',
    dateOfBirth: '1985-06-20',
    civilStatus: 'Married',
    nationality: 'Filipino',
    religion: 'Hindu',
    address: '741 Ermita St., Manila City',
    philhealth: '12-345678901-1'
  },
  {
    id: 11,
    name: 'Thomas Anderson',
    age: 52,
    gender: 'Male',
    caseNumber: '123466',
    dateAdmitted: '2024-03-13',
    location: 'Ward 4',
    status: 'Discharged',
    diagnosis: 'Acute Coronary Syndrome',
    dateOfBirth: '1972-01-15',
    civilStatus: 'Married',
    nationality: 'Filipino',
    religion: 'Roman Catholic',
    address: '852 Paco St., Manila City',
    philhealth: '12-345678901-2'
  },
  {
    id: 12,
    name: 'Sophie Williams',
    age: 31,
    gender: 'Female',
    caseNumber: '123467',
    dateAdmitted: '2024-03-21',
    location: 'Ward 3',
    status: 'Active Admission',
    diagnosis: 'Acute Complicated Pyelonephritis',
    dateOfBirth: '1993-03-28',
    civilStatus: 'Single',
    nationality: 'Filipino',
    religion: 'Roman Catholic',
    address: '963 Pandacan St., Manila City',
    philhealth: '12-345678901-3'
  },
  {
    id: 13,
    name: 'Carlos Martinez',
    age: 44,
    gender: 'Male',
    caseNumber: '123468',
    dateAdmitted: '2024-03-22',
    location: 'Ward 4',
    status: 'Active Admission',
    diagnosis: 'COPD in acute exacerbation',
    dateOfBirth: '1980-08-10',
    civilStatus: 'Married',
    nationality: 'Filipino',
    religion: 'Roman Catholic',
    address: '159 Santa Ana St., Manila City',
    philhealth: '12-345678901-4'
  },
  {
    id: 14,
    name: 'Emma Thompson',
    age: 36,
    gender: 'Female',
    caseNumber: '123469',
    dateAdmitted: '2024-03-23',
    location: 'Ward 3',
    status: 'Active Admission',
    diagnosis: 'Colorectal Adenocarcinoma, stage IV',
    dateOfBirth: '1988-11-15',
    civilStatus: 'Married',
    nationality: 'Filipino',
    religion: 'Protestant',
    address: '357 San Andres St., Manila City',
    philhealth: '12-345678901-5'
  },
  {
    id: 15,
    name: 'Daniel Lee',
    age: 0,
    gender: 'Male',
    caseNumber: '123470',
    dateAdmitted: '2024-03-24',
    location: 'Ward 3',
    status: 'Active Admission',
    diagnosis: 'Chronic Liver Disease, Childs-Pugh C, from cons 1) Chronic Hepatitis B, 2) MAFLD, 3) Alcoholic Liver Disease, less likely',
    dateOfBirth: '2024-12-25',
    civilStatus: 'Married',
    nationality: 'Filipino',
    religion: 'Buddhist',
    address: '486 San Miguel St., Manila City',
    philhealth: '12-345678901-6'
  }
]

// Get unique locations for the filter dropdown
const locations = Array.from(new Set(mockPatients.map(patient => patient.location))).sort()

export default function PatientsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
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
    return matchesSearch && matchesLocation && matchesStatus
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

  const handleAddPatient = (newPatient: Omit<Patient, 'id'>) => {
    // Check if case number already exists
    const caseNumberExists = mockPatients.some(
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
      id: Math.max(...mockPatients.map(p => p.id)) + 1
    }
    
    // Add to both local state and mockPatients array
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search name, diagnosis, or case number..."
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
        </div>

        {/* Patients Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Name</span>
                        {sortField === 'name' && (
                          <ChevronDown className={`h-4 w-4 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                      onClick={() => handleSort('age')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Age</span>
                        {sortField === 'age' && (
                          <ChevronDown className={`h-4 w-4 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                      onClick={() => handleSort('gender')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Gender</span>
                        {sortField === 'gender' && (
                          <ChevronDown className={`h-4 w-4 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                      onClick={() => handleSort('caseNumber')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>CN</span>
                        {sortField === 'caseNumber' && (
                          <ChevronDown className={`h-4 w-4 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                      onClick={() => handleSort('dateAdmitted')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Date Admitted</span>
                        {sortField === 'dateAdmitted' && (
                          <ChevronDown className={`h-4 w-4 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                      onClick={() => handleSort('location')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Location</span>
                        {sortField === 'location' && (
                          <ChevronDown className={`h-4 w-4 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
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
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('diagnosis')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Diagnosis</span>
                        {sortField === 'diagnosis' && (
                          <ChevronDown className={`h-4 w-4 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="relative px-6 py-3 whitespace-nowrap">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handlePatientClick(patient.id)}
                          className="text-sm font-medium text-violet-600 hover:text-violet-900 focus:outline-none focus:underline"
                        >
                          {patient.name}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatAge(calculateAge(patient.dateOfBirth))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{patient.gender}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handlePatientClick(patient.id)}
                          className="text-sm font-medium text-violet-600 hover:text-violet-900 focus:outline-none focus:underline"
                        >
                          {patient.caseNumber}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{patient.dateAdmitted}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{patient.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[patient.status as keyof typeof STATUS_COLORS]}`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate" title={patient.diagnosis}>
                          {patient.diagnosis}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-gray-400 hover:text-gray-500">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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