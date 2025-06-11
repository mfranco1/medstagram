import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Patient } from '../types/patient'

interface UsePatientModalsProps {
  patient: Patient
  onDelete?: (patientId: number) => void
  onEdit?: (patient: Patient) => Promise<void>
}

interface UsePatientModalsReturn {
  isDeleteModalOpen: boolean
  isEditModalOpen: boolean
  openDeleteModal: () => void
  closeDeleteModal: () => void
  openEditModal: () => void
  closeEditModal: () => void
  handleDelete: () => void
}

export function usePatientModals({ patient, onDelete, onEdit }: UsePatientModalsProps): UsePatientModalsReturn {
  const navigate = useNavigate()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const openDeleteModal = () => setIsDeleteModalOpen(true)
  const closeDeleteModal = () => setIsDeleteModalOpen(false)
  const openEditModal = () => setIsEditModalOpen(true)
  const closeEditModal = () => setIsEditModalOpen(false)

  const handleDelete = () => {
    if (onDelete) {
      onDelete(patient.id)
      navigate('/patients')
    }
  }

  return {
    isDeleteModalOpen,
    isEditModalOpen,
    openDeleteModal,
    closeDeleteModal,
    openEditModal,
    closeEditModal,
    handleDelete
  }
} 