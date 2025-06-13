import type { Patient, PatientTab } from '../../types/patient'
import { ConfirmModal } from '../ui/ConfirmModal'
import { EditPatientModal } from './EditPatientModal'
import { PatientHeader } from './PatientHeader'
import { PatientMedicalStatus } from './PatientMedicalStatus'
import { PatientTabNavigation } from './PatientTabNavigation'
import { usePatientModals } from '../../hooks/usePatientModals'
import {
  GeneralDataTab,
  MedicalInfoTab,
  CaseSummaryTab,
  ChartTab,
  DiagnosticsTab,
  TherapeuticsTab,
  OrdersTab
} from './tabs'

interface PatientInfoCardProps {
  activeTab: PatientTab
  setActiveTab: (tab: PatientTab) => void
  patient: Patient
  onDelete?: (patientId: number) => void
  onEdit?: (patient: Patient) => Promise<void>
}

export function PatientInfoCard({ activeTab, setActiveTab, patient, onDelete, onEdit }: PatientInfoCardProps) {
  const {
    isDeleteModalOpen,
    isEditModalOpen,
    openDeleteModal,
    closeDeleteModal,
    openEditModal,
    closeEditModal,
    handleDelete
  } = usePatientModals({ patient, onDelete, onEdit })

  return (
    <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
      <PatientHeader
        patient={patient}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />

      <PatientMedicalStatus patient={patient} />

      <PatientTabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'general' && <GeneralDataTab patient={patient} />}
        {activeTab === 'medical' && <MedicalInfoTab patient={patient} />}
        {activeTab === 'case-summary' && <CaseSummaryTab patient={patient} />}
        {activeTab === 'chart' && <ChartTab patient={patient} />}
        {activeTab === 'diagnostics' && <DiagnosticsTab patient={patient} />}
        {activeTab === 'therapeutics' && <TherapeuticsTab patient={patient} />}
        {activeTab === 'orders' && <OrdersTab patient={patient} />}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Patient"
        message={`Are you sure you want to delete ${patient.name}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />

      <EditPatientModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSave={onEdit ?? (async () => {})}
        patient={patient}
      />
    </div>
  )
} 