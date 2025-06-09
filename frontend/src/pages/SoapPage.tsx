import { useState } from 'react'
import { MainLayout } from '../components/layout/MainLayout'
import { PatientInfoCard } from '../components/patient/PatientInfoCard.tsx'
import { MedicalEntryForm } from '../components/patient/MedicalEntryForm.tsx'
import { useParams } from 'react-router-dom'

// Import mock data from PatientsPage
import { mockPatients } from './PatientsPage'

export default function SoapPage() {
  const { patientId } = useParams()
  const [activeTab, setActiveTab] = useState<'general' | 'medical'>('general')
  const [formData, setFormData] = useState({
    chiefComplaint: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  })

  // Find the patient from mock data
  const patient = mockPatients.find(p => p.id === Number(patientId))

  if (!patient) {
    return (
      <MainLayout>
        <div className="flex-1 w-full h-full flex flex-col gap-6 px-6 py-8">
          <div className="text-red-600">Patient not found</div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="flex-1 w-full h-full flex flex-col gap-6 px-6 py-8">
        <PatientInfoCard 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          patient={patient}
        />
        <MedicalEntryForm formData={formData} setFormData={setFormData} />
      </div>
    </MainLayout>
  )
} 