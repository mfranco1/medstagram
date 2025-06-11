import { MoreVertical, Edit2, FileText, ClipboardList, Trash2 } from 'lucide-react'
import type { Patient } from '../../types/patient'
import { DropdownMenu } from '../ui/DropdownMenu'
import { getInitials, calculateAge, formatAge } from '../../utils/patient'
import { STATUS_COLORS } from '../../constants/patient'

interface PatientHeaderProps {
  patient: Patient
  onEdit: () => void
  onDelete: () => void
}

export function PatientHeader({ 
  patient, 
  onEdit, 
  onDelete
}: PatientHeaderProps) {
  const ageDisplay = formatAge(calculateAge(patient.dateOfBirth))

  const handleGenerateClinicalAbstract = () => {
    // TODO: Implement clinical abstract generation
    console.log('Generate clinical abstract for patient:', patient.id)
  }

  const handleGenerateDischargeSummary = () => {
    // TODO: Implement discharge summary generation
    console.log('Generate discharge summary for patient:', patient.id)
  }

  const dropdownItems = [
    {
      label: 'Edit Patient',
      icon: <Edit2 className="w-4 h-4" />,
      onClick: onEdit
    },
    {
      label: 'Generate Clinical Abstract',
      icon: <FileText className="w-4 h-4" />,
      onClick: handleGenerateClinicalAbstract
    },
    {
      label: 'Generate Discharge Summary',
      icon: <ClipboardList className="w-4 h-4" />,
      onClick: handleGenerateDischargeSummary
    },
    {
      label: 'Delete Patient',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: onDelete,
      className: 'text-red-600 hover:bg-red-50'
    }
  ]

  return (
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
        <DropdownMenu
          trigger={
            <button className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none">
              <MoreVertical className="w-5 h-5" />
            </button>
          }
          items={dropdownItems}
        />
      </div>
    </div>
  )
} 