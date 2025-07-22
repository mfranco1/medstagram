import type { Medication, Patient } from '../types/patient'
import { mockPatients } from '../mocks/patients'

// In a real application, this would be replaced with API calls
// For now, we'll manipulate the mock data directly

export class MedicationService {
  // Generate a unique ID for new medications
  private static generateId(): string {
    return `med-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Get current timestamp in ISO format
  private static getCurrentTimestamp(): string {
    return new Date().toISOString()
  }

  // Find patient by ID
  private static findPatient(patientId: number): Patient | undefined {
    return mockPatients.find(p => p.id === patientId)
  }

  // Create a new medication
  static async createMedication(
    patientId: number, 
    medicationData: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Medication> {
    const patient = this.findPatient(patientId)
    if (!patient) {
      throw new Error(`Patient with ID ${patientId} not found`)
    }

    const newMedication: Medication = {
      ...medicationData,
      id: this.generateId(),
      createdAt: this.getCurrentTimestamp(),
      updatedAt: this.getCurrentTimestamp()
    }

    // Initialize medications array if it doesn't exist
    if (!patient.medications) {
      patient.medications = []
    }

    // Add the new medication to the patient's medication list
    patient.medications.push(newMedication)

    return newMedication
  }

  // Update an existing medication
  static async updateMedication(
    patientId: number,
    medicationId: string,
    updates: Partial<Omit<Medication, 'id' | 'patientId' | 'createdAt' | 'updatedAt'>>
  ): Promise<Medication> {
    const patient = this.findPatient(patientId)
    if (!patient || !patient.medications) {
      throw new Error(`Patient with ID ${patientId} not found or has no medications`)
    }

    const medicationIndex = patient.medications.findIndex(med => med.id === medicationId)
    if (medicationIndex === -1) {
      throw new Error(`Medication with ID ${medicationId} not found`)
    }

    const existingMedication = patient.medications[medicationIndex]

    // Check if this is a significant change that requires creating a new medication entry
    const significantChanges = ['dosage', 'frequency', 'route']
    const hasSignificantChange = significantChanges.some(field => 
      updates[field as keyof typeof updates] !== undefined &&
      JSON.stringify(updates[field as keyof typeof updates]) !== JSON.stringify(existingMedication[field as keyof Medication])
    )

    if (hasSignificantChange && existingMedication.status === 'active') {
      // Create a new medication entry and discontinue the old one
      const discontinuedMedication: Medication = {
        ...existingMedication,
        status: 'discontinued',
        endDate: new Date().toISOString().split('T')[0],
        discontinuationReason: 'Medication changed - dose/frequency/route modified',
        updatedAt: this.getCurrentTimestamp()
      }

      // Replace the old medication with the discontinued version
      patient.medications[medicationIndex] = discontinuedMedication

      // Create new medication with updated information
      const newMedication: Medication = {
        ...existingMedication,
        ...updates,
        id: this.generateId(),
        status: 'active',
        startDate: new Date().toISOString().split('T')[0],
        endDate: undefined,
        discontinuationReason: undefined,
        createdAt: this.getCurrentTimestamp(),
        updatedAt: this.getCurrentTimestamp()
      }

      // Add the new medication
      patient.medications.push(newMedication)

      return newMedication
    } else {
      // Minor change - update existing medication
      const updatedMedication: Medication = {
        ...existingMedication,
        ...updates,
        updatedAt: this.getCurrentTimestamp()
      }

      patient.medications[medicationIndex] = updatedMedication
      return updatedMedication
    }
  }

  // Discontinue a medication
  static async discontinueMedication(
    patientId: number,
    medicationId: string,
    reason: string
  ): Promise<Medication> {
    const patient = this.findPatient(patientId)
    if (!patient || !patient.medications) {
      throw new Error(`Patient with ID ${patientId} not found or has no medications`)
    }

    const medicationIndex = patient.medications.findIndex(med => med.id === medicationId)
    if (medicationIndex === -1) {
      throw new Error(`Medication with ID ${medicationId} not found`)
    }

    const medication = patient.medications[medicationIndex]
    
    // Update medication status to discontinued
    const discontinuedMedication: Medication = {
      ...medication,
      status: 'discontinued',
      endDate: new Date().toISOString().split('T')[0],
      discontinuationReason: reason,
      updatedAt: this.getCurrentTimestamp()
    }

    patient.medications[medicationIndex] = discontinuedMedication
    return discontinuedMedication
  }

  // Change medication status (active/on-hold/discontinued)
  static async changeMedicationStatus(
    patientId: number,
    medicationId: string,
    newStatus: Medication['status'],
    reason?: string
  ): Promise<Medication> {
    const patient = this.findPatient(patientId)
    if (!patient || !patient.medications) {
      throw new Error(`Patient with ID ${patientId} not found or has no medications`)
    }

    const medicationIndex = patient.medications.findIndex(med => med.id === medicationId)
    if (medicationIndex === -1) {
      throw new Error(`Medication with ID ${medicationId} not found`)
    }

    const medication = patient.medications[medicationIndex]
    
    const updatedMedication: Medication = {
      ...medication,
      status: newStatus,
      updatedAt: this.getCurrentTimestamp()
    }

    // Set end date and reason for discontinued/completed status
    if (newStatus === 'discontinued' || newStatus === 'completed') {
      updatedMedication.endDate = new Date().toISOString().split('T')[0]
      if (reason) {
        updatedMedication.discontinuationReason = reason
      }
    } else if (newStatus === 'active') {
      // Clear end date and discontinuation reason when reactivating
      updatedMedication.endDate = undefined
      updatedMedication.discontinuationReason = undefined
    }

    patient.medications[medicationIndex] = updatedMedication
    return updatedMedication
  }

  // Get all medications for a patient
  static async getPatientMedications(patientId: number): Promise<Medication[]> {
    const patient = this.findPatient(patientId)
    if (!patient) {
      throw new Error(`Patient with ID ${patientId} not found`)
    }

    return patient.medications || []
  }

  // Get a specific medication
  static async getMedication(patientId: number, medicationId: string): Promise<Medication | null> {
    const patient = this.findPatient(patientId)
    if (!patient || !patient.medications) {
      return null
    }

    return patient.medications.find(med => med.id === medicationId) || null
  }

  // Get medication history (all medications including discontinued)
  static async getMedicationHistory(patientId: number): Promise<Medication[]> {
    const medications = await this.getPatientMedications(patientId)
    
    // Sort by start date (most recent first)
    return medications.sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )
  }

  // Get active medications only
  static async getActiveMedications(patientId: number): Promise<Medication[]> {
    const medications = await this.getPatientMedications(patientId)
    
    return medications.filter(med => med.status === 'active' || med.status === 'on-hold')
  }
}

// Discontinuation reason options
export const DISCONTINUATION_REASONS = [
  'Completed course',
  'Adverse reaction',
  'Ineffective',
  'Patient request',
  'Drug interaction',
  'Contraindication developed',
  'Switched to alternative',
  'No longer indicated',
  'Duplicate',
  'Other'
] as const

export type DiscontinuationReason = typeof DISCONTINUATION_REASONS[number]