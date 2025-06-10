import { Calendar, User, MapPin, Church, Home, Phone, Heart, FileText, MoreVertical, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Patient } from '../../pages/PatientsPage'
import { ConfirmModal } from '../ui/ConfirmModal'

interface PatientInfoCardProps {
  activeTab: 'general' | 'medical'
  setActiveTab: (tab: 'general' | 'medical') => void
  patient: Patient
  onDelete?: (patientId: number) => void
}

export function PatientInfoCard({ activeTab, setActiveTab, patient, onDelete }: PatientInfoCardProps) {
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active Admission':
        return 'bg-green-100 text-green-800'
      case 'Discharged':
        return 'bg-gray-100 text-gray-800'
      case 'Transferred':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(patient.id)
      navigate('/patients')
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold text-violet-600">
              {getInitials(patient.name)}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{patient.name}</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {patient.gender} • {patient.age} years • CN: {patient.caseNumber}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(patient.status)}`}>
                {patient.status}
              </span>
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false)
                    setIsDeleteModalOpen(true)
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Patient
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Tabs */}
      <div className="flex space-x-8 mb-6">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'general'
              ? 'border-violet-600 text-violet-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          General Data
        </button>
        <button
          onClick={() => setActiveTab('medical')}
          className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'medical'
              ? 'border-violet-600 text-violet-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Medical Info
        </button>
      </div>
      {/* Patient Info Grid */}
      <div className="grid grid-cols-3 gap-x-8 gap-y-4 text-sm">
        <div className="flex items-center space-x-3">
          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-gray-500">Date of Birth</span>
            <p className="font-medium text-gray-900">{patient.dateOfBirth}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-gray-500">Civil Status</span>
            <p className="font-medium text-gray-900">{patient.civilStatus}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-gray-500">Nationality</span>
            <p className="font-medium text-gray-900">{patient.nationality}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Church className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-gray-500">Religion</span>
            <p className="font-medium text-gray-900">{patient.religion}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Home className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-gray-500">Address</span>
            <p className="font-medium text-gray-900">{patient.address}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-gray-500">Philhealth</span>
            <p className="font-medium text-gray-900">{patient.philhealth}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Heart className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-gray-500">Date Admitted</span>
            <p className="font-medium text-gray-900">{patient.dateAdmitted}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-gray-500">Location</span>
            <p className="font-medium text-gray-900">{patient.location}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-gray-500">Diagnosis</span>
            <p className="font-medium text-gray-900">{patient.diagnosis}</p>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Patient"
        message={`Are you sure you want to delete ${patient.name}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
} 