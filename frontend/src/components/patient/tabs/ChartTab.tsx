import { useState } from 'react'
import type { Patient } from '../../../types/patient'
import { MedicalEntryForm } from '../MedicalEntryForm'

interface ChartTabProps {
  patient: Patient
}

export function ChartTab({ patient }: ChartTabProps) {
  const [formData, setFormData] = useState({
    chiefComplaint: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  })

  return (
    <div className="space-y-6">
      <MedicalEntryForm formData={formData} setFormData={setFormData} />
    </div>
  )
} 