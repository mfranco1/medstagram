import { describe, it, expect, beforeEach } from 'vitest'
import { MedicationService } from '../medicationService'
import { mockPatients } from '../../mocks/patients'
import type { Medication } from '../../types/patient'

describe('MedicationService', () => {
  beforeEach(() => {
    // Reset mock data before each test
    mockPatients.forEach(patient => {
      if (patient.medications) {
        patient.medications.length = 0
      }
    })
  })

  describe('createMedication', () => {
    it('should create a new medication for a patient', async () => {
      const patientId = 1
      const medicationData: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'> = {
        patientId,
        name: 'Test Medication',
        dosage: { amount: 10, unit: 'mg' },
        frequency: { times: 1, period: 'daily' },
        route: 'oral',
        startDate: '2024-03-20',
        status: 'active',
        prescribedBy: { id: 'test-doctor', name: 'Test Doctor' }
      }

      const result = await MedicationService.createMedication(patientId, medicationData)

      expect(result).toMatchObject(medicationData)
      expect(result.id).toBeDefined()
      expect(result.createdAt).toBeDefined()
      expect(result.updatedAt).toBeDefined()

      // Verify it was added to the patient
      const patient = mockPatients.find(p => p.id === patientId)
      expect(patient?.medications).toHaveLength(1)
      expect(patient?.medications?.[0]).toEqual(result)
    })

    it('should throw error for non-existent patient', async () => {
      const medicationData: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'> = {
        patientId: 999,
        name: 'Test Medication',
        dosage: { amount: 10, unit: 'mg' },
        frequency: { times: 1, period: 'daily' },
        route: 'oral',
        startDate: '2024-03-20',
        status: 'active',
        prescribedBy: { id: 'test-doctor', name: 'Test Doctor' }
      }

      await expect(MedicationService.createMedication(999, medicationData))
        .rejects.toThrow('Patient with ID 999 not found')
    })
  })

  describe('updateMedication', () => {
    it('should update a medication with minor changes', async () => {
      const patientId = 1
      
      // First create a medication
      const medicationData: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'> = {
        patientId,
        name: 'Test Medication',
        dosage: { amount: 10, unit: 'mg' },
        frequency: { times: 1, period: 'daily' },
        route: 'oral',
        startDate: '2024-03-20',
        status: 'active',
        prescribedBy: { id: 'test-doctor', name: 'Test Doctor' }
      }
      
      const created = await MedicationService.createMedication(patientId, medicationData)
      
      // Add small delay to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 1))
      
      // Update with minor changes (notes)
      const updates = { notes: 'Updated notes' }
      const result = await MedicationService.updateMedication(patientId, created.id, updates)
      
      expect(result.notes).toBe('Updated notes')
      expect(result.id).toBe(created.id) // Same medication ID
      expect(result.updatedAt).not.toBe(created.updatedAt) // Updated timestamp
    })

    it('should create new medication entry for significant changes', async () => {
      const patientId = 1
      
      // First create a medication
      const medicationData: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'> = {
        patientId,
        name: 'Test Medication',
        dosage: { amount: 10, unit: 'mg' },
        frequency: { times: 1, period: 'daily' },
        route: 'oral',
        startDate: '2024-03-20',
        status: 'active',
        prescribedBy: { id: 'test-doctor', name: 'Test Doctor' }
      }
      
      const created = await MedicationService.createMedication(patientId, medicationData)
      
      // Update with significant changes (dosage)
      const updates = { dosage: { amount: 20, unit: 'mg' } }
      const result = await MedicationService.updateMedication(patientId, created.id, updates)
      
      expect(result.dosage.amount).toBe(20)
      expect(result.id).not.toBe(created.id) // New medication ID
      
      // Verify old medication is discontinued
      const patient = mockPatients.find(p => p.id === patientId)
      const oldMedication = patient?.medications?.find(m => m.id === created.id)
      expect(oldMedication?.status).toBe('discontinued')
      expect(oldMedication?.discontinuationReason).toContain('Medication changed')
    })
  })

  describe('discontinueMedication', () => {
    it('should discontinue a medication', async () => {
      const patientId = 1
      
      // First create a medication
      const medicationData: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'> = {
        patientId,
        name: 'Test Medication',
        dosage: { amount: 10, unit: 'mg' },
        frequency: { times: 1, period: 'daily' },
        route: 'oral',
        startDate: '2024-03-20',
        status: 'active',
        prescribedBy: { id: 'test-doctor', name: 'Test Doctor' }
      }
      
      const created = await MedicationService.createMedication(patientId, medicationData)
      
      // Discontinue the medication
      const reason = 'Completed course'
      const result = await MedicationService.discontinueMedication(patientId, created.id, reason)
      
      expect(result.status).toBe('discontinued')
      expect(result.discontinuationReason).toBe(reason)
      expect(result.endDate).toBeDefined()
    })
  })

  describe('changeMedicationStatus', () => {
    it('should change medication status', async () => {
      const patientId = 1
      
      // First create a medication
      const medicationData: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'> = {
        patientId,
        name: 'Test Medication',
        dosage: { amount: 10, unit: 'mg' },
        frequency: { times: 1, period: 'daily' },
        route: 'oral',
        startDate: '2024-03-20',
        status: 'active',
        prescribedBy: { id: 'test-doctor', name: 'Test Doctor' }
      }
      
      const created = await MedicationService.createMedication(patientId, medicationData)
      
      // Add small delay to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 1))
      
      // Change status to on-hold
      const result = await MedicationService.changeMedicationStatus(patientId, created.id, 'on-hold')
      
      expect(result.status).toBe('on-hold')
      expect(result.updatedAt).not.toBe(created.updatedAt)
    })
  })

  describe('getPatientMedications', () => {
    it('should return all medications for a patient', async () => {
      const patientId = 1
      
      // Create multiple medications
      const med1Data: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'> = {
        patientId,
        name: 'Medication 1',
        dosage: { amount: 10, unit: 'mg' },
        frequency: { times: 1, period: 'daily' },
        route: 'oral',
        startDate: '2024-03-20',
        status: 'active',
        prescribedBy: { id: 'test-doctor', name: 'Test Doctor' }
      }
      
      const med2Data: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'> = {
        patientId,
        name: 'Medication 2',
        dosage: { amount: 20, unit: 'mg' },
        frequency: { times: 2, period: 'daily' },
        route: 'oral',
        startDate: '2024-03-21',
        status: 'discontinued',
        prescribedBy: { id: 'test-doctor', name: 'Test Doctor' }
      }
      
      await MedicationService.createMedication(patientId, med1Data)
      await MedicationService.createMedication(patientId, med2Data)
      
      const result = await MedicationService.getPatientMedications(patientId)
      
      expect(result).toHaveLength(2)
      expect(result.map(m => m.name)).toContain('Medication 1')
      expect(result.map(m => m.name)).toContain('Medication 2')
    })
  })

  describe('getActiveMedications', () => {
    it('should return only active and on-hold medications', async () => {
      const patientId = 1
      
      // Create medications with different statuses
      const activeMed: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'> = {
        patientId,
        name: 'Active Medication',
        dosage: { amount: 10, unit: 'mg' },
        frequency: { times: 1, period: 'daily' },
        route: 'oral',
        startDate: '2024-03-20',
        status: 'active',
        prescribedBy: { id: 'test-doctor', name: 'Test Doctor' }
      }
      
      const onHoldMed: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'> = {
        patientId,
        name: 'On Hold Medication',
        dosage: { amount: 20, unit: 'mg' },
        frequency: { times: 2, period: 'daily' },
        route: 'oral',
        startDate: '2024-03-21',
        status: 'on-hold',
        prescribedBy: { id: 'test-doctor', name: 'Test Doctor' }
      }
      
      const discontinuedMed: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'> = {
        patientId,
        name: 'Discontinued Medication',
        dosage: { amount: 30, unit: 'mg' },
        frequency: { times: 1, period: 'daily' },
        route: 'oral',
        startDate: '2024-03-22',
        status: 'discontinued',
        prescribedBy: { id: 'test-doctor', name: 'Test Doctor' }
      }
      
      await MedicationService.createMedication(patientId, activeMed)
      await MedicationService.createMedication(patientId, onHoldMed)
      await MedicationService.createMedication(patientId, discontinuedMed)
      
      const result = await MedicationService.getActiveMedications(patientId)
      
      expect(result).toHaveLength(2)
      expect(result.map(m => m.name)).toContain('Active Medication')
      expect(result.map(m => m.name)).toContain('On Hold Medication')
      expect(result.map(m => m.name)).not.toContain('Discontinued Medication')
    })
  })
})