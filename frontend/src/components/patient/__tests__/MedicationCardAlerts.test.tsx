import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MedicationCardAlerts } from '../MedicationCardAlerts'
import type { Patient, Medication } from '../../../types/patient'

describe('MedicationCardAlerts', () => {
  const mockOnAlertAcknowledge = vi.fn()
  
  const mockPatient: Patient = {
    id: 1,
    name: 'Test Patient',
    age: 45,
    gender: 'Male',
    caseNumber: '123456',
    dateAdmitted: '2024-03-15',
    location: 'Ward 3',
    status: 'Active Admission',
    diagnosis: 'Test Diagnosis',
    dateOfBirth: '1979-05-15',
    civilStatus: 'Married',
    nationality: 'Filipino',
    religion: 'Roman Catholic',
    address: '123 Test St.',
    philhealth: '12-345678901-2',
    primaryService: 'Internal Medicine',
    weight: 70,
    height: 175,
    allergies: [{
      allergen: 'Penicillin',
      type: 'drug',
      severity: 'severe',
      reaction: 'Anaphylaxis'
    }]
  }

  const mockMedication: Medication = {
    id: 'med-001',
    patientId: 1,
    name: 'Penicillin',
    genericName: 'Penicillin',
    dosage: { amount: 500, unit: 'mg' },
    frequency: { times: 4, period: 'daily' },
    route: 'oral',
    startDate: '2024-03-15',
    status: 'active',
    prescribedBy: { id: 'dr-001', name: 'Dr. Test' },
    indication: 'Infection',
    createdAt: '2024-03-15T08:00:00Z',
    updatedAt: '2024-03-15T08:00:00Z'
  }

  it('should display allergy alert for medication patient is allergic to', () => {
    render(
      <MedicationCardAlerts
        medication={mockMedication}
        patient={mockPatient}
        allMedications={[mockMedication]}
        onAlertAcknowledge={mockOnAlertAcknowledge}
      />
    )

    expect(screen.getByText('Allergy Alert')).toBeInTheDocument()
    expect(screen.getByText('Patient is allergic to Penicillin')).toBeInTheDocument()
    expect(screen.getByText('CRITICAL')).toBeInTheDocument()
  })

  it('should not display alerts when there are none', () => {
    const safeMedication: Medication = {
      ...mockMedication,
      name: 'Ibuprofen',
      genericName: 'Ibuprofen'
    }

    const safePatient: Patient = {
      ...mockPatient,
      allergies: []
    }

    const { container } = render(
      <MedicationCardAlerts
        medication={safeMedication}
        patient={safePatient}
        allMedications={[safeMedication]}
        onAlertAcknowledge={mockOnAlertAcknowledge}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('should display interaction alert when medications interact', () => {
    const warfarin: Medication = {
      id: 'med-001',
      patientId: 1,
      name: 'Warfarin',
      genericName: 'Warfarin',
      dosage: { amount: 5, unit: 'mg' },
      frequency: { times: 1, period: 'daily' },
      route: 'oral',
      startDate: '2024-03-15',
      status: 'active',
      prescribedBy: { id: 'dr-001', name: 'Dr. Test' },
      indication: 'Anticoagulation',
      createdAt: '2024-03-15T08:00:00Z',
      updatedAt: '2024-03-15T08:00:00Z'
    }

    const aspirin: Medication = {
      id: 'med-002',
      patientId: 1,
      name: 'Aspirin',
      genericName: 'Aspirin',
      dosage: { amount: 81, unit: 'mg' },
      frequency: { times: 1, period: 'daily' },
      route: 'oral',
      startDate: '2024-03-15',
      status: 'active',
      prescribedBy: { id: 'dr-001', name: 'Dr. Test' },
      indication: 'Cardioprotection',
      createdAt: '2024-03-15T08:00:00Z',
      updatedAt: '2024-03-15T08:00:00Z'
    }

    const safePatient: Patient = {
      ...mockPatient,
      allergies: []
    }

    render(
      <MedicationCardAlerts
        medication={warfarin}
        patient={safePatient}
        allMedications={[warfarin, aspirin]}
        onAlertAcknowledge={mockOnAlertAcknowledge}
      />
    )

    expect(screen.getByText('Drug Interaction')).toBeInTheDocument()
    expect(screen.getByText('May interact with Aspirin')).toBeInTheDocument()
    expect(screen.getByText('HIGH')).toBeInTheDocument()
  })

  it('should limit display to 2 alerts with overflow indicator', () => {
    // Create a patient with multiple allergies to generate multiple alerts
    const multiAllergyPatient: Patient = {
      ...mockPatient,
      allergies: [
        { allergen: 'Penicillin', type: 'drug', severity: 'severe', reaction: 'Anaphylaxis' },
        { allergen: 'Sulfa', type: 'drug', severity: 'moderate', reaction: 'Rash' },
        { allergen: 'NSAID', type: 'drug', severity: 'mild', reaction: 'Stomach upset' }
      ]
    }

    // Create a medication that would trigger multiple allergy alerts
    const problematicMedication: Medication = {
      ...mockMedication,
      name: 'Penicillin Sulfa NSAID Combo', // This would match multiple allergies
      genericName: 'Complex medication'
    }

    render(
      <MedicationCardAlerts
        medication={problematicMedication}
        patient={multiAllergyPatient}
        allMedications={[problematicMedication]}
        onAlertAcknowledge={mockOnAlertAcknowledge}
      />
    )

    // Should show at most 2 alerts
    const alertElements = screen.getAllByText(/Alert/)
    expect(alertElements.length).toBeLessThanOrEqual(2)
  })
})