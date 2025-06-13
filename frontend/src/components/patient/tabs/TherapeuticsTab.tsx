import type { Patient } from '../../../types/patient'

interface TherapeuticsTabProps {
  patient: Patient
}

export function TherapeuticsTab({ patient }: TherapeuticsTabProps) {
  return (
    <div className="space-y-8">
      <p className="text-gray-500 text-sm">Therapeutic content will be added here.</p>
    </div>
  )
} 