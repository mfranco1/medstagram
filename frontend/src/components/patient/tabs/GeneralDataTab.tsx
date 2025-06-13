import { Calendar, User, MapPin, Church, Home, Phone, PhoneCall } from 'lucide-react'
import type { Patient } from '../../../types/patient'

interface GeneralDataTabProps {
  patient: Patient
}

export function GeneralDataTab({ patient }: GeneralDataTabProps) {
  return (
    <div className="grid grid-cols-3 gap-x-8 gap-y-6 text-sm">
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
  )
} 