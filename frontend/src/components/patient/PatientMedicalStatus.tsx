import { Stethoscope, UserCog, Building2, Clock } from 'lucide-react'
import type { Patient } from '../../types/patient'
import { Tooltip } from '../ui/Tooltip'
import { useState } from 'react'

interface PatientMedicalStatusProps {
  patient: Patient
}

export function PatientMedicalStatus({ patient }: PatientMedicalStatusProps) {
  const [hoveredDiagnosis, setHoveredDiagnosis] = useState<number | null>(null)

  return (
    <div className="p-4 border-gray-200">
      <div className="grid grid-cols-4 gap-4">
        <div className="flex space-x-3 p-3 rounded-lg">
          <Stethoscope className="w-5 h-5 text-violet-500 flex-shrink-0 mt-1" />
          <div className="min-w-0">
            <span className="text-sm text-gray-500 block mb-1">Primary Diagnosis</span>
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
        <div className="flex space-x-3 p-3 rounded-lg">
          <UserCog className="w-5 h-5 text-violet-500 flex-shrink-0 mt-1" />
          <div className="min-w-0">
            <span className="text-sm text-gray-500 block mb-1">Primary Service</span>
            <p className="font-medium text-gray-900">{patient.primaryService || 'None'}</p>
          </div>
        </div>
        <div className="flex space-x-3 p-3 rounded-lg">
          <Building2 className="w-5 h-5 text-violet-500 flex-shrink-0 mt-1" />
          <div className="min-w-0">
            <span className="text-sm text-gray-500 block mb-1">Location</span>
            <p className="font-medium text-gray-900">{patient.location || 'Not specified'}</p>
          </div>
        </div>
        <div className="flex space-x-3 p-3 rounded-lg">
          <Clock className="w-5 h-5 text-violet-500 flex-shrink-0 mt-1" />
          <div className="min-w-0">
            <span className="text-sm text-gray-500 block mb-1">Upcoming Procedure</span>
            {patient.upcomingProcedure ? (
              <div>
                <p className="font-medium text-gray-900 truncate">{patient.upcomingProcedure.name}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{patient.upcomingProcedure.date}</span>
                  <span>•</span>
                  <span>{patient.upcomingProcedure.time}</span>
                  <span>•</span>
                  <span className="truncate">{patient.upcomingProcedure.location}</span>
                </div>
                <span className={`mt-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  patient.upcomingProcedure.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  patient.upcomingProcedure.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                  patient.upcomingProcedure.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {patient.upcomingProcedure.status.charAt(0).toUpperCase() + patient.upcomingProcedure.status.slice(1)}
                </span>
              </div>
            ) : (
              <p className="font-medium text-gray-900">None scheduled</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 