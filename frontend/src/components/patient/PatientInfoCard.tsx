import { Calendar, User, MapPin, Church, Home, Phone, MoreVertical, Trash2, Edit2, Stethoscope, Clock, Building2, UserCog, Droplet, AlertTriangle, Heart, Thermometer, Activity, Scale, PhoneCall, Brain, Wind } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Patient } from '../../types/patient'
import { ConfirmModal } from '../ui/ConfirmModal'
import { EditPatientModal } from './EditPatientModal'
import { calculateAge, formatAge } from '../../utils/patient'
import { STATUS_COLORS } from '../../constants/patient'
import { Tooltip } from '../ui/Tooltip'

interface PatientInfoCardProps {
  activeTab: 'general' | 'medical' | 'critical'
  setActiveTab: (tab: 'general' | 'medical' | 'critical') => void
  patient: Patient
  onDelete?: (patientId: number) => void
  onEdit?: (patient: Patient) => Promise<void>
}

export function PatientInfoCard({ activeTab, setActiveTab, patient, onDelete, onEdit }: PatientInfoCardProps) {
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [hoveredDiagnosis, setHoveredDiagnosis] = useState<number | null>(null)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(patient.id)
      navigate('/patients')
    }
  }

  const ageDisplay = formatAge(calculateAge(patient.dateOfBirth))

  const calculateBMI = () => {
    if (!patient.height || !patient.weight) return null
    const heightInMeters = patient.height / 100
    return (patient.weight / (heightInMeters * heightInMeters)).toFixed(1)
  }

  const formatVitalSign = (value: number | undefined, unit: string) => {
    if (value === undefined) return 'Not recorded'
    return `${value} ${unit}`
  }

  const formatBloodPressure = (bp?: { systolic: number; diastolic: number }) => {
    if (!bp) return 'Not recorded'
    return `${bp.systolic}/${bp.diastolic} mmHg`
  }

  const formatGCS = (gcs?: { eye: number; verbal: number | string; motor: number; total: number }) => {
    if (!gcs) return 'Not recorded'
    return `${gcs.total} (E${gcs.eye}V${gcs.verbal}M${gcs.motor})`
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
      {/* Critical Information Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-violet-100 rounded-full flex items-center justify-center">
              <span className="text-xl font-semibold text-violet-600">
                {getInitials(patient.name)}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{patient.name}</h2>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm font-semibold text-gray-600">
                  CN: {patient.caseNumber}
                </span>
                <span className="text-sm text-gray-600">
                  {ageDisplay}
                </span>
                <span className="text-sm text-gray-600">
                  {patient.gender}
                </span>
                <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${STATUS_COLORS[patient.status]}`}>
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
                      setIsEditModalOpen(true)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Patient
                  </button>
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
      </div>

      {/* Medical Status Section */}
      <div className="p-4 border-gray-200">
        <div className="grid grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg">
            <Stethoscope className="w-5 h-5 text-violet-500 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-sm text-gray-500">Primary Diagnosis</span>
              <Tooltip
                show={hoveredDiagnosis === patient.id}
                position="right"
                delay={750}
                maxWidth={400}
                content={
                  <div className="text-sm text-gray-600">
                    {patient.diagnosis || 'Not specified'}
                  </div>
                }
              >
                <p 
                  className="font-medium text-gray-900 truncate max-w-[200px]"
                  onMouseEnter={() => setHoveredDiagnosis(patient.id)}
                  onMouseLeave={() => setHoveredDiagnosis(null)}
                >
                  {patient.diagnosis || 'Not specified'}
                </p>
              </Tooltip>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg">
            <UserCog className="w-5 h-5 text-violet-500 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-sm text-gray-500">Primary Service</span>
              <p className="font-medium text-gray-900">{patient.primaryService || 'None'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg">
            <Clock className="w-5 h-5 text-violet-500 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-sm text-gray-500">Date Admitted</span>
              <p className="font-medium text-gray-900">{patient.dateAdmitted}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg">
            <Building2 className="w-5 h-5 text-violet-500 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-sm text-gray-500">Location</span>
              <p className="font-medium text-gray-900">{patient.location || 'Not specified'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4">
        <div className="flex space-x-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'general'
                ? 'border-violet-600 text-violet-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            General Data
          </button>
          <button
            onClick={() => setActiveTab('critical')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'critical'
                ? 'border-violet-600 text-violet-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Critical Info
          </button>
          <button
            onClick={() => setActiveTab('medical')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'medical'
                ? 'border-violet-600 text-violet-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Medical Info
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'general' && (
          <div className="grid grid-cols-3 gap-x-8 gap-y-6 text-sm">
            <div className="flex items-start space-x-3">
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
              <div className="min-w-0">
                <span className="text-gray-500">Date of Birth</span>
                <p className="font-medium text-gray-900">{patient.dateOfBirth}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <User className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
              <div className="min-w-0">
                <span className="text-gray-500">Civil Status</span>
                <p className="font-medium text-gray-900">{patient.civilStatus}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
              <div className="min-w-0">
                <span className="text-gray-500">Nationality</span>
                <p className="font-medium text-gray-900">{patient.nationality}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Church className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
              <div className="min-w-0">
                <span className="text-gray-500">Religion</span>
                <p className="font-medium text-gray-900">{patient.religion}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Home className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
              <div className="min-w-0">
                <span className="text-gray-500">Address</span>
                <p className="font-medium text-gray-900">{patient.address}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
              <div className="min-w-0">
                <span className="text-gray-500">Philhealth</span>
                <p className="font-medium text-gray-900">{patient.philhealth || 'Not specified'}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'medical' && (
          <div className="space-y-6">
            {/* Add medical history content here */}
            <p className="text-gray-500">Medical history content will be added here.</p>
          </div>
        )}

        {activeTab === 'critical' && (
          <div className="space-y-8">
            {/* Critical Information Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Critical Information</h3>
              <div className="grid grid-cols-3 gap-x-8 gap-y-6 text-sm">
                {/* Blood Type */}
                <div className="flex items-start space-x-3">
                  <Droplet className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                  <div className="min-w-0">
                    <span className="text-gray-500">Blood Type</span>
                    <p className="font-medium text-gray-900">{patient.bloodType || 'Unknown'}</p>
                  </div>
                </div>

                {/* Allergies */}
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                  <div className="min-w-0">
                    <span className="text-gray-500">Allergies</span>
                    <p className="font-medium text-gray-900">
                      {patient.allergies?.length ? patient.allergies.join(', ') : 'Unknown'}
                    </p>
                  </div>
                </div>

                {/* Height & Weight */}
                <div className="flex items-start space-x-3">
                  <Scale className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                  <div className="min-w-0">
                    <span className="text-gray-500">Height & Weight</span>
                    <div className="font-medium text-gray-900">
                      {patient.height && patient.weight ? (
                        <>
                          <p>{patient.height} cm / {patient.weight} kg</p>
                          <p className="text-sm text-gray-500">BMI: {calculateBMI()}</p>
                        </>
                      ) : (
                        <p>Not recorded</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="flex items-start space-x-3 col-span-3">
                  <PhoneCall className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                  <div className="min-w-0">
                    <span className="text-gray-500">Emergency Contact</span>
                    {patient.emergencyContact ? (
                      <div>
                        <p className="font-medium text-gray-900">{patient.emergencyContact.name}</p>
                        <p className="text-sm text-gray-500">
                          {patient.emergencyContact.relationship} • {patient.emergencyContact.phone}
                        </p>
                      </div>
                    ) : (
                      <p className="font-medium text-gray-900">Not recorded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Vital Signs Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Latest Vital Signs</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <Activity className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="min-w-0">
                    <span className="text-sm text-gray-500">Heart Rate</span>
                    <p className="font-medium text-sm text-gray-900">
                      {patient.lastVitals?.heartRate ? `${patient.lastVitals.heartRate} bpm` : 'Not recorded'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Wind className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="min-w-0">
                    <span className="text-sm text-gray-500">Respiratory Rate</span>
                    <p className="font-medium text-sm text-gray-900">
                      {patient.lastVitals?.respiratoryRate ? `${patient.lastVitals.respiratoryRate} /min` : 'Not recorded'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Heart className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="min-w-0">
                    <span className="text-sm text-gray-500">Blood Pressure</span>
                    <p className="font-medium text-sm text-gray-900">{formatBloodPressure(patient.lastVitals?.bloodPressure)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Thermometer className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="min-w-0">
                    <span className="text-sm text-gray-500">Temperature</span>
                    <p className="font-medium text-sm text-gray-900">
                      {patient.lastVitals?.temperature ? `${patient.lastVitals.temperature}°C` : 'Not recorded'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Droplet className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="min-w-0">
                    <span className="text-sm text-gray-500">O₂ Saturation</span>
                    <p className="font-medium text-sm text-gray-900">
                      {patient.lastVitals?.oxygenSaturation ? `${patient.lastVitals.oxygenSaturation}%` : 'Not recorded'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Brain className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="min-w-0">
                    <span className="text-sm text-gray-500">GCS</span>
                    <p className="font-medium text-sm text-gray-900">{formatGCS(patient.lastVitals?.gcs)}</p>
                  </div>
                </div>
              </div>
              {patient.lastVitals?.timestamp && (
                <p className="text-xs text-gray-500">
                  Last recorded: {new Date(patient.lastVitals.timestamp).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}
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

      <EditPatientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={onEdit ?? (async () => {})}
        patient={patient}
      />
    </div>
  )
} 