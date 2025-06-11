import { ChevronDown, MoreVertical } from 'lucide-react'
import type { Patient } from '../../types/patient'
import { STATUS_COLORS } from '../../constants/patient'
import { calculateAge, formatAge } from '../../utils/patient'

interface PatientsTableProps {
  patients: Patient[]
  sortField: keyof Patient
  sortDirection: 'asc' | 'desc'
  onSort: (field: keyof Patient) => void
  onPatientClick: (patientId: number) => void
}

export function PatientsTable({
  patients,
  sortField,
  sortDirection,
  onSort,
  onPatientClick
}: PatientsTableProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto max-h-[calc(100vh-300px)] overflow-y-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200 rounded-lg">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                  onClick={() => onSort('name')}
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
                  onClick={() => onSort('age')}
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
                  onClick={() => onSort('gender')}
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
                  onClick={() => onSort('caseNumber')}
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
                  onClick={() => onSort('dateAdmitted')}
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
                  onClick={() => onSort('location')}
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
                  onClick={() => onSort('status')}
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
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                  onClick={() => onSort('primaryService')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Service</span>
                    {sortField === 'primaryService' && (
                      <ChevronDown className={`h-4 w-4 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => onSort('diagnosis')}
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
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onPatientClick(patient.id)}
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
                      onClick={() => onPatientClick(patient.id)}
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {patient.primaryService}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-[200px] truncate" title={patient.diagnosis}>
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
  )
} 