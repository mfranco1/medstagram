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
  allergies: [
    {
      allergen: 'penicillin',
      type: 'drug',
      severity: 'moderate',
      reaction: 'rash'
    }
  ]
}

const activeMedication: Medication = {
  id: 'med-1',
  patientId: 'patient-1',
  name: 'Amoxicillin', // Will trigger allergy alert
  dosage: { amount: 500, unit: 'mg' },
  frequency: { times: 3, period: 'daily' },
  route: 'oral',
  startDate: '2024-01-01',
  status: 'active',
  prescribedBy: { id: 'doc-1', name: 'Dr. Smith' },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

const discontinuedMedication: Medication = {
  id: 'med-2',
  patientId: 'patient-1',
  name: 'Amoxicillin', // Would trigger allergy alert if active
  dosage: { amount: 500, unit: 'mg' },
  frequency: { times: 3, period: 'daily' },
  route: 'oral',
  startDate: '2024-01-01',
  status: 'discontinued', // This should prevent alerts from showing
  prescribedBy: { id: 'doc-1', name: 'Dr. Smith' },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

const mockOnAlertAcknowledge = vi.fn()

describe('MedicationCardAlerts - Discontinued Status', () => {
  it('should show alerts for active medications', () => {
    render(
      <MedicationCardAlerts
        medication={activeMedication}
        patient={mockPatient}
        allMedications={[activeMedication]}
        onAlertAcknowledge={mockOnAlertAcknowledge}
      />
    )

    // Should show allergy alert for active medication
    expect(screen.getByText('Allergy Alert')).toBeInTheDocument()
  })

  it('should NOT show alerts for discontinued medications', () => {
    const { container } = render(
      <MedicationCardAlerts
        medication={discontinuedMedication}
        patient={mockPatient}
        allMedications={[discontinuedMedication]}
        onAlertAcknowledge={mockOnAlertAcknowledge}
      />
    )

    // Should not render anything for discontinued medication
    expect(container.firstChild).toBeNull()
  })

  it('should not show alerts for discontinued medications even with high dosage', () => {
    const discontinuedHighDose: Medication = {
      ...discontinuedMedication,
      dosage: { amount: 5000, unit: 'mg' } // Very high dose that would normally trigger alert
    }

    const { container } = render(
      <MedicationCardAlerts
        medication={discontinuedHighDose}
        patient={mockPatient}
        allMedications={[discontinuedHighDose]}
        onAlertAcknowledge={mockOnAlertAcknowledge}
      />
    )

    // Should not render anything for discontinued medication, even with high dose
    expect(container.firstChild).toBeNull()
  })
})