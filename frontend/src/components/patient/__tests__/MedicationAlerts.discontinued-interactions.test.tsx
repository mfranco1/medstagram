import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MedicationAlerts } from '../MedicationAlerts'
import type { Patient, Medication } from '../../../types/patient'

const mockPatient: Patient = {
  id: 'patient-1',
  name: 'John Doe',
  age: 45,
  gender: 'male',
  dateOfBirth: '1979-01-01',
  medications: [],
  allergies: []
}

const activeWarfarin: Medication = {
  id: 'med-1',
  patientId: 'patient-1',
  name: 'Warfarin',
  dosage: { amount: 5, unit: 'mg' },
  frequency: { times: 1, period: 'daily' },
  route: 'oral',
  startDate: '2024-01-01',
  status: 'active',
  prescribedBy: { id: 'doc-1', name: 'Dr. Smith' },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

const activeAspirin: Medication = {
  id: 'med-2',
  patientId: 'patient-1',
  name: 'Aspirin',
  dosage: { amount: 81, unit: 'mg' },
  frequency: { times: 1, period: 'daily' },
  route: 'oral',
  startDate: '2024-01-01',
  status: 'active',
  prescribedBy: { id: 'doc-1', name: 'Dr. Smith' },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

const discontinuedAspirin: Medication = {
  ...activeAspirin,
  id: 'med-3',
  status: 'discontinued'
}

const activeDuplicateWarfarin: Medication = {
  id: 'med-4',
  patientId: 'patient-1',
  name: 'Warfarin', // Same as activeWarfarin - should trigger duplicate alert
  dosage: { amount: 2.5, unit: 'mg' },
  frequency: { times: 2, period: 'daily' },
  route: 'oral',
  startDate: '2024-01-02',
  status: 'active',
  prescribedBy: { id: 'doc-1', name: 'Dr. Smith' },
  createdAt: '2024-01-02T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z'
}

const discontinuedDuplicateWarfarin: Medication = {
  ...activeDuplicateWarfarin,
  id: 'med-5',
  status: 'discontinued'
}

const mockOnAlertAcknowledge = vi.fn()

describe('MedicationAlerts - Discontinued Medications Exclusion', () => {
  beforeEach(() => {
    mockOnAlertAcknowledge.mockClear()
  })

  it('should show drug interaction alert between two active medications', () => {
    render(
      <MedicationAlerts
        patient={mockPatient}
        currentMedications={[activeWarfarin, activeAspirin]}
        onAlertAcknowledge={mockOnAlertAcknowledge}
      />
    )

    // Should show interaction alert between warfarin and aspirin
    expect(screen.getByText('Drug Interaction')).toBeInTheDocument()
    expect(screen.getByText(/Warfarin may interact with Aspirin/)).toBeInTheDocument()
  })

  it('should NOT show drug interaction alert when one medication is discontinued', () => {
    const { container } = render(
      <MedicationAlerts
        patient={mockPatient}
        currentMedications={[activeWarfarin, discontinuedAspirin]}
        onAlertAcknowledge={mockOnAlertAcknowledge}
      />
    )

    // Should not show any interaction alerts
    expect(screen.queryByText('Drug Interaction')).not.toBeInTheDocument()
    expect(screen.queryByText(/may interact with/)).not.toBeInTheDocument()
  })

  it('should show duplicate medication alert between two active medications', () => {
    render(
      <MedicationAlerts
        patient={mockPatient}
        currentMedications={[activeWarfarin, activeDuplicateWarfarin]}
        onAlertAcknowledge={mockOnAlertAcknowledge}
      />
    )

    // Should show duplicate alert
    expect(screen.getByText('Duplicate Medication')).toBeInTheDocument()
    expect(screen.getByText(/Patient is prescribed both Warfarin and Warfarin/)).toBeInTheDocument()
  })

  it('should NOT show duplicate medication alert when one medication is discontinued', () => {
    const { container } = render(
      <MedicationAlerts
        patient={mockPatient}
        currentMedications={[activeWarfarin, discontinuedDuplicateWarfarin]}
        onAlertAcknowledge={mockOnAlertAcknowledge}
      />
    )

    // Should not show any duplicate alerts
    expect(screen.queryByText('Duplicate Medication')).not.toBeInTheDocument()
    expect(screen.queryByText(/Patient is prescribed both/)).not.toBeInTheDocument()
  })

  it('should show interaction alert only between active medications in mixed list', () => {
    // Mix of active and discontinued medications
    const medications = [
      activeWarfarin,           // Active
      discontinuedAspirin,      // Discontinued - should not interact
      activeAspirin,            // Active - should interact with warfarin
      discontinuedDuplicateWarfarin // Discontinued - should not duplicate
    ]

    render(
      <MedicationAlerts
        patient={mockPatient}
        currentMedications={medications}
        onAlertAcknowledge={mockOnAlertAcknowledge}
      />
    )

    // Should show interaction between active warfarin and active aspirin
    expect(screen.getByText('Drug Interaction')).toBeInTheDocument()
    expect(screen.getByText(/Warfarin may interact with Aspirin/)).toBeInTheDocument()
    
    // Should not show duplicate alert (discontinued warfarin excluded)
    expect(screen.queryByText('Duplicate Medication')).not.toBeInTheDocument()
  })

  it('should not show any alerts when all interacting medications are discontinued', () => {
    const discontinuedWarfarin: Medication = {
      ...activeWarfarin,
      id: 'med-6',
      status: 'discontinued'
    }

    const { container } = render(
      <MedicationAlerts
        patient={mockPatient}
        currentMedications={[discontinuedWarfarin, discontinuedAspirin]}
        onAlertAcknowledge={mockOnAlertAcknowledge}
      />
    )

    // Should not show any alerts
    expect(screen.queryByText('Drug Interaction')).not.toBeInTheDocument()
    expect(screen.queryByText('Duplicate Medication')).not.toBeInTheDocument()
  })
})