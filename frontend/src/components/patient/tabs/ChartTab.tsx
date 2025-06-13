import type { Patient } from '../../../types/patient'

interface ChartTabProps {
  patient: Patient
}

export function ChartTab({ patient }: ChartTabProps) {
  return (
    <div className="space-y-6">
      <p className="text-gray-500 text-sm">Medical chart content will be added here.</p>
    </div>
  )
} 