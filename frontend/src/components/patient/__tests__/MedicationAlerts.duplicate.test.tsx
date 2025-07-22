import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MedicationAlerts } from '../MedicationAlerts'
import type { Patient, Medication } from '../../../types/patient'

describe('MedicationAlerts - Duplicate Detection Edge Cases', () => {
  const mockOnAlertAcknowledge = vi.fn()
  
  const mockPatient: Patient = {
    id: 1,
    name: 'Carlos Martinez',
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
    allergies: []
  }

  it('should not show duplicate alerts for single albuterol medication', () => {
    // Single albuterol medication where name and generic name are the same
    const medications: Medication[] = [
      {
        id: 'med-001',
        patientId: 1,
        name: 'Albuterol',
        genericName: 'Albuterol',
        dosage: { amount: 90, unit: 'mcg' },
        frequency: { times: 4, period: 'daily' },
        route: 'inhalation',
        startDate: '2024-03-15',
        status: 'active',
        prescribedBy: { id: 'dr-001', name: 'Dr. Test' },
        indication: 'Asthma',
        createdAt: '2024-03-15T08:00:00Z',
        updatedAt: '2024-03-15T08:00:00Z'
      }
    ]

    const { container } = render(
      <MedicationAlerts
        patient={mockPatient}
        currentMedications={medications}
        onAlertAcknowledge={mockOnAlertAcknowledge}
      />
    )

    // Should not render any alerts for a single medication
    expect(container.firstChild).toBeNull()
  })

  it('should not show duplicate alerts for similar but different medications', () => {
    // Similar but different medications
    const medications: Medication[] = [
      {
        id: 'med-001',
        patientId: 1,
        name: 'Albuterol',
        genericName: 'Albuterol',
        dosage: { amount: 90, unit: 'mcg' },
        frequency: { times: 4, period: 'daily' },
        route: 'inhalation',
        startDate: '2024-03-15',
        status: 'active',
        prescribedBy: { id: 'dr-001', name: 'Dr. Test' },
        indication: 'Asthma',
        createdAt: '2024-03-15T08:00:00Z',
        updatedAt: '2024-03-15T08:00:00Z'
      },
      {
        id: 'med-002',
        patientId: 1,
        name: 'Albuterol Sulfate',
        genericName: 'Albuterol Sulfate',
        dosage: { amount: 2.5, unit: 'mg' },
        frequency: { times: 3, period: 'daily' },
        route: 'nebulization',
        startDate: '2024-03-15',
        status: 'active',
        prescribedBy: { id: 'dr-001', name: 'Dr. Test' },
        indication: 'Asthma',
        createdAt: '2024-03-15T08:00:00Z',
        updatedAt: '2024-03-15T08:00:00Z'
      }
    ]

    const { container } = render(
      <MedicationAlerts
        patient={mockPatient}
        currentMedications={medications}
        onAlertAcknowledge={mockOnAlertAcknowledge}
      />
    )

    // Should not show duplicate medication alerts
    expect(screen.queryByText('Duplicate Medication')).not.toBeInTheDocument()
  })

  it('should still detect actual duplicates', () => {
    // Actual duplicate medications
    const medications: Medication[] = [
      {
        id: 'med-001',
        patientId: 1,
        name: 'Lisinopril',
        genericName: 'Lisinopril',
        dosage: { amount: 10, unit: 'mg' },
        frequency: { times: 1, period: 'daily' },
        route: 'oral',
        startDate: '2024-03-15',
        status: 'active',
        prescribedBy: { id: 'dr-001', name: 'Dr. Test' },
        indication: 'Hypertension',
        createdAt: '2024-03-15T08:00:00Z',
        updatedAt: '2024-03-15T08:00:00Z'
      },
      {
        id: 'med-002',
        patientId: 1,
        name: 'Lisinopril',
        genericName: 'Lisinopril',
        dosage: { amount: 5, unit: 'mg' },
        frequency: { times: 1, period: 'daily' },
        route: 'oral',
        startDate: '2024-03-16',
        status: 'active',
        prescribedBy: { id: 'dr-002', name: 'Dr. Other' },
        indication: 'Hypertension',
        createdAt: '2024-03-16T08:00:00Z',
        updatedAt: '2024-03-16T08:00:00Z'
      }
    ]

    render(
      <MedicationAlerts
        patient={mockPatient}
        currentMedications={medications}
        onAlertAcknowledge={mockOnAlertAcknowledge}
      />
    )

    // Should detect actual duplicates
    expect(screen.getByText('Duplicate Medication')).toBeInTheDocument()
  })

  it('should detect brand name vs generic name duplicates correctly', () => {
    // Brand name vs generic name (should be detected as duplicate)
    const medications: Medication[] = [
      {
        id: 'med-001',
        patientId: 1,
        name: 'Advil',
        genericName: 'Ibuprofen',
        dosage: { amount: 200, unit: 'mg' },
        frequency: { times: 3, period: 'daily' },
        route: 'oral',
        startDate: '2024-03-15',
        status: 'active',
        prescribedBy: { id: 'dr-001', name: 'Dr. Test' },
        indication: 'Pain',
        createdAt: '2024-03-15T08:00:00Z',
        updatedAt: '2024-03-15T08:00:00Z'
      },
      {
        id: 'med-002',
        patientId: 1,
        name: 'Ibuprofen',
        genericName: 'Ibuprofen',
        dosage: { amount: 400, unit: 'mg' },
        frequency: { times: 2, period: 'daily' },
        route: 'oral',
        startDate: '2024-03-16',
        status: 'active',
        prescribedBy: { id: 'dr-002', name: 'Dr. Other' },
        indication: 'Inflammation',
        createdAt: '2024-03-16T08:00:00Z',
        updatedAt: '2024-03-16T08:00:00Z'
      }
    ]

    render(
      <MedicationAlerts
        patient={mockPatient}
        currentMedications={medications}
        onAlertAcknowledge={mockOnAlertAcknowledge}
      />
    )

    // Should detect brand vs generic as duplicate
    expect(screen.getByText('Duplicate Medication')).toBeInTheDocument()
  })

  it('should not show duplicate alerts when editing an existing medication', () => {
    // Existing medication
    const currentMedications: Medication[] = [
      {
        id: 'med-001',
        patientId: 1,
        name: 'Albuterol',
        genericName: 'Albuterol',
        dosage: { amount: 90, unit: 'mcg' },
        frequency: { times: 4, period: 'daily' },
        route: 'inhalation',
        startDate: '2024-03-15',
        status: 'active',
        prescribedBy: { id: 'dr-001', name: 'Dr. Test' },
        indication: 'Asthma',
        createdAt: '2024-03-15T08:00:00Z',
        updatedAt: '2024-03-15T08:00:00Z'
      }
    ]

    // Preview medication when editing (same medication with preview ID)
    const previewMedication: Medication = {
      id: 'preview-medication',
      patientId: 1,
      name: 'Albuterol',
      genericName: 'Albuterol',
      dosage: { amount: 180, unit: 'mcg' }, // Changed dosage
      frequency: { times: 4, period: 'daily' },
      route: 'inhalation',
      startDate: '2024-03-15',
      status: 'active',
      prescribedBy: { id: 'dr-001', name: 'Dr. Test' },
      indication: 'Asthma',
      createdAt: '2024-03-15T08:00:00Z',
      updatedAt: '2024-03-15T08:00:00Z'
    }

    const { container } = render(
      <MedicationAlerts
        patient={mockPatient}
        currentMedications={currentMedications}
        newMedication={previewMedication}
        onAlertAcknowledge={mockOnAlertAcknowledge}
      />
    )

    // Should not show duplicate medication alerts when editing
    expect(screen.queryByText('Duplicate Medication')).not.toBeInTheDocument()
  })
})