import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MedicationCardAlerts } from '../MedicationCardAlerts'
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

describe('MedicationCardAlerts - Discontinued Medications Exclusion', () => {
  beforeEach(() => {
    mockOnAlertAcknowledge.mockClear()
  })

  it('should show drug interaction alert for active medication when other medication is active', () => {
    render(
      <MedicationCardAlerts
        medication={activeWarfarin}
        patient={mockPatient}
        allMedications={[activeWarfarin, activeAspirin]}
        onAlertAcknowledge={mockOnAlertAcknowledge}
      />
    )

    // Should show interaction alert
    expect(screen.getByText('Drug Interaction')).toBeInTheDocument()
    expect(screen.getByText(/May interact with Aspirin/)).toBeInTheDocument()
  })

  it('should NOT show drug interaction alert for active medication when other medication is discontinued', () => {
    const { container } = render(
      <MedicationCardAlerts
        medication={activeWarfarin}
        patient={mockPatient}
        allMedications={[activeWarfarin, discontinuedAspirin]}
        onAlertAcknowledge={mockOnAlertAcknowledge}
      />
    )

    // Should not show any interaction alerts
    expect(screen.queryByText('Drug Interaction')).not.toBeInTheDocument()
    expect(screen.queryByText(/May interact with/)).not.toBeInTheDocument()
  })

  it('should show duplicate medication alert for active medication when other medication is active', () => {
    render(
      <MedicationCardAlerts
        medication={activeWarfarin}
        patient={mockPatient}
        allMedications={[activeWarfarin, activeDuplicateWarfarin]}
        onAlertAcknowledge={mockOnAlertAcknowledge}
      />
    )

    // Should show duplicate alert
    expect(screen.getByText('Duplicate Medication')).toBeInTheDocument()
    expect(screen.getByText(/May be duplicate of Warfarin/)).toBeInTheDocument()
  })

  it('should NOT show duplicate medication alert for active medication when other medication is discontinued', () => {
    const { container } = render(
      <MedicationCardAlerts
        medication={activeWarfarin}
        patient={mockPatient}
        allMedications={[activeWarfarin, discontinuedDuplicateWarfarin]}
        onAlertAcknowledge={mockOnAlertAcknowledge}
      />
    )

    // Should not show any duplicate alerts
    expect(screen.queryByText('Duplicate Medication')).not.toBeInTheDocument()
    expect(screen.queryByText(/May be duplicate of/)).not.toBeInTheDocument()
  })

  it('should show interaction alert only with active medications in mixed list', () => {
    // Mix of active and discontinued medications
    const medications = [
      activeWarfarin,           // Active - this is the medication we're checking
      discontinuedAspirin,      // Discontinued - should not interact
      activeAspirin,            // Active - should interact with warfarin
      discontinuedDuplicateWarfarin // Discontinued - should not duplicate
    ]

    render(
      <MedicationCardAlerts
        medication={activeWarfarin}
        patient={mockPatient}
        allMedications={medications}
        onAlertAcknowledge={mockOnAlertAcknowledge}
      />
    )

    // Should show interaction with active aspirin only
    expect(screen.getByText('Drug Interaction')).toBeInTheDocument()
    expect(screen.getByText(/May interact with Aspirin/)).toBeInTheDocument()
    
    // Should not show duplicate alert (discontinued warfarin excluded)
    expect(screen.queryByText('Duplicate Medication')).not.toBeInTheDocument()
  })

  it('should not show alerts for discontinued medication even when active medications exist', () => {
    const discontinuedWarfarin: Medication = {
      ...activeWarfarin,
      id: 'med-6',
      status: 'discontinued'
    }

    const { container } = render(
      <MedicationCardAlerts
        medication={discontinuedWarfarin}
        patient={mockPatient}
        allMedications={[discontinuedWarfarin, activeAspirin, activeDuplicateWarfarin]}
        onAlertAcknowledge={mockOnAlertAcknowledge}
      />
    )

    // Should not show any alerts for discontinued medication
    expect(container.firstChild).toBeNull()
  })
})