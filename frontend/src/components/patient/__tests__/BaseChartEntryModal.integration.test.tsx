import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { BaseChartEntryModal } from '../BaseChartEntryModal'
import type { Patient } from '../../../types/patient'

const mockPatient: Patient = {
  id: 1,
  name: 'John Doe',
  age: 45,
  gender: 'Male',
  caseNumber: 'C001',
  dateAdmitted: '2024-01-15',
  location: 'Room 101',
  status: 'Admitted',
  diagnosis: 'Hypertension',
  dateOfBirth: '1979-01-15',
  civilStatus: 'Married',
  nationality: 'American',
  religion: 'Christian',
  address: '123 Main St',
  philhealth: 'PH123456789',
  primaryService: 'Internal Medicine'
}

describe('BaseChartEntryModal Integration Tests', () => {
  const mockOnClose = vi.fn()
  const mockOnSave = vi.fn()
  const mockOnTemplateSave = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should preserve unsaved data when switching between templates', async () => {
    const { rerender } = render(
      <BaseChartEntryModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        title="Chart Entry"
        templateType="progress_note"
        patient={mockPatient}
        onTemplateSave={mockOnTemplateSave}
      />
    )

    // Wait for progress note template to load
    await waitFor(() => {
      expect(screen.getByText('Progress Note Template')).toBeInTheDocument()
    })

    // Switch to admission note template
    rerender(
      <BaseChartEntryModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        title="Chart Entry"
        templateType="admission_note"
        patient={mockPatient}
        onTemplateSave={mockOnTemplateSave}
      />
    )

    // Wait for admission note template to load
    await waitFor(() => {
      expect(screen.getAllByText('Admission Note Template')).toHaveLength(2) // Header and placeholder
    })

    // Should not show progress note template anymore
    expect(screen.queryByText('Progress Note Template')).not.toBeInTheDocument()
  })

  it('should handle template loading errors gracefully', async () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <BaseChartEntryModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        title="Chart Entry"
        templateType="progress_note"
        patient={mockPatient}
        onTemplateSave={mockOnTemplateSave}
      />
    )

    // Template should still load successfully
    await waitFor(() => {
      expect(screen.getByText('Progress Note Template')).toBeInTheDocument()
    })

    consoleSpy.mockRestore()
  })

  it('should reset template errors when switching template types', () => {
    const { rerender } = render(
      <BaseChartEntryModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        title="Chart Entry"
        templateType="progress_note"
        patient={mockPatient}
        onTemplateSave={mockOnTemplateSave}
      />
    )

    // Switch template type
    rerender(
      <BaseChartEntryModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        title="Chart Entry"
        templateType="admission_note"
        patient={mockPatient}
        onTemplateSave={mockOnTemplateSave}
      />
    )

    // Should not show any error messages
    expect(screen.queryByText(/Failed to load/)).not.toBeInTheDocument()
  })

  it('should handle modal close and reset state properly', async () => {
    const { rerender } = render(
      <BaseChartEntryModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        title="Chart Entry"
        templateType="progress_note"
        patient={mockPatient}
        onTemplateSave={mockOnTemplateSave}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Progress Note Template')).toBeInTheDocument()
    })

    // Close modal
    rerender(
      <BaseChartEntryModal
        isOpen={false}
        onClose={mockOnClose}
        onSave={mockOnSave}
        title="Chart Entry"
        templateType="progress_note"
        patient={mockPatient}
        onTemplateSave={mockOnTemplateSave}
      />
    )

    // Modal should not be visible
    expect(screen.queryByText('Progress Note Template')).not.toBeInTheDocument()
  })
})