import { UserCog, Clock, Droplet, AlertTriangle, Scale, Activity, Wind, Heart, Thermometer, Brain } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Patient } from '../../../types/patient'
import { calculateBMI, formatBloodPressure, formatGCS } from '../../../utils/patient'

interface MedicalInfoTabProps {
  patient: Patient
}

export function MedicalInfoTab({ patient }: MedicalInfoTabProps) {
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      {/* Medical Information Section */}
      <div>
        <div className="grid grid-cols-3 gap-x-8 gap-y-6 text-sm">
          {/* Attending Physician */}
          <div className="flex items-start space-x-3 col-span-3">
            <UserCog className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
            <div className="min-w-0">
              <span className="text-gray-500">Attending Physician</span>
              {patient.attendingPhysician ? (
                <div>
                  <button
                    onClick={() => patient.attendingPhysician && navigate(`/profile/${patient.attendingPhysician.id}`)}
                    className="font-medium text-violet-600 hover:text-violet-900 focus:outline-none focus:underline"
                  >
                    {patient.attendingPhysician.name}
                  </button>
                  <p className="text-sm text-gray-500">
                    {patient.attendingPhysician.specialization} • {patient.attendingPhysician.contactNumber}
                  </p>
                </div>
              ) : (
                <p className="font-medium text-gray-900">Not assigned</p>
              )}
            </div>
          </div>

          {/* Date Admitted */}
          <div className="flex items-start space-x-3">
            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
            <div className="min-w-0">
              <span className="text-gray-500">Date Admitted</span>
              <p className="font-medium text-gray-900">{patient.dateAdmitted}</p>
            </div>
          </div>

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
  )
} 