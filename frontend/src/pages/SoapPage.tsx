import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MainLayout } from '../components/layout/MainLayout'
import { PatientInfoCard } from '../components/patient/PatientInfoCard'
import { MedicalEntryForm } from '../components/patient/MedicalEntryForm'
import { mockPatients } from '../mocks/patients'
import type { Patient } from '../types/patient'
import { Toast, type ToastType } from '../components/ui/Toast'

export default function SoapPage() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'general' | 'chart' | 'medical' | 'diagnostics'>('general')
  const [formData, setFormData] = useState({
    chiefComplaint: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  })
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const patient = mockPatients.find(p => p.id === Number(patientId))

  if (!patient) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Patient not found</h2>
            <p className="mt-2 text-gray-600">The patient you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/patients')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              Back to Patients
            </button>
          </div>
        </div>
      </MainLayout>
    )
  }

  const handleDeletePatient = (patientId: number) => {
    // In a real app, this would be an API call
    const index = mockPatients.findIndex(p => p.id === patientId)
    if (index !== -1) {
      mockPatients.splice(index, 1)
      setToast({
        message: 'Patient has been deleted successfully',
        type: 'success'
      })
    }
  }

  const handleEditPatient = async (updatedPatient: Patient): Promise<void> => {
    const index = mockPatients.findIndex(p => p.id === updatedPatient.id)
    if (index !== -1) {
      mockPatients[index] = updatedPatient
      setToast({
        message: 'Patient information has been updated successfully',
        type: 'success'
      })
    }
  }

  return (
    <MainLayout>
      <div className="p-6">
        <PatientInfoCard
          patient={patient}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onDelete={handleDeletePatient}
          onEdit={handleEditPatient}
        />
        <MedicalEntryForm formData={formData} setFormData={setFormData} />

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </MainLayout>
  )
} 