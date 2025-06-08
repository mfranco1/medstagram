import { useState } from 'react'
import { MainLayout } from '../components/layout/MainLayout'
import { PatientInfoCard } from '../components/patient/PatientInfoCard.tsx'
import { MedicalEntryForm } from '../components/patient/MedicalEntryForm.tsx'

export default function SoapPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'medical'>('general')
  const [formData, setFormData] = useState({
    chiefComplaint: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  })

  return (
    <MainLayout>
      <div className="flex-1 w-full h-full flex flex-col gap-6 px-6 py-8">
        <PatientInfoCard activeTab={activeTab} setActiveTab={setActiveTab} />
        <MedicalEntryForm formData={formData} setFormData={setFormData} />
      </div>
    </MainLayout>
  )
} 