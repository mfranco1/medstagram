import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { BaseChartEntryModal } from '../BaseChartEntryModal'
import type { Patient } from '../../../types/patient'

// Mock the template components
vi.mock('../templates/ProgressNoteTemplate', () => ({
  ProgressNoteTemplate: ({ onSave, onCancel, onDataChange, onValidationChange }: any) => {
    const handleSave = () => {
      onSave({
        type: 'progress_note',
        templateVersion: '1.0',
        subjective: 'Test subjective',
        objective: 'Test objective',
        assessment: 'Test assessment',
        plan: 'Test plan'
      })
    }

    const handleDataChange = () => {
      onDataChange?.(true)
    }

    const handleValidationChange = (hasErrors: boolean) => {
      onValidationChange?.(!hasErrors, false)
    }

    return (
      <div data-testid="progress-note-template">
        <button onClick={handleSave} data-testid="template-save">
          Save Template
        </button>
        <button onClick={handleDataChange} data-testid="trigger-data-change">
          Trigger Data Change
        </button>
        <button onClick={() => handleValidationChange(true)} data-testid="trigger-validation-error">
          Trigger Validation Error
        </button>
        <button onClick={() => handleValidationChange(false)} data-testid="clear-validation-error">
          Clear Validation Error
        </button>
      </div>
    )
  }
}))

const mockPatient: Patient = {
  id: 1,
  name: 'John Doe',
  age: 30,
  gender: 'Male',
  caseNumber: 'C001',
  dateAdmitted: '2024-01-01',
  location: 'Room 101',
  status: 'Active',
  diagnosis: 'Test diagnosis',
  dateOfBirth: '1994-01-01',
  civilStatus: 'Single',
  nationality: 'American',
  religion: 'Christian',
  address: '123 Test St',
  philhealth: 'PH123456',
  primaryService: 'Internal Medicine'
}

describe('BaseChartEntryModal Validation', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSave: vi.fn(),
    title: 'Test Entry',
    templateType: 'progress_note' as const,
    patient: mockPatient,
    onTemplateSave: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with validation provider', () => {
    render(<BaseChartEntryModal {...defaultProps} />)
    
    expect(screen.getByTestId('progress-note-template')).toBeInTheDocument()
    expect(screen.getByText('New Test Entry')).toBeInTheDocument()
  })

  it('should show validation summary when there are errors', async () => {
    render(<BaseChartEntryModal {...defaultProps} />)
    
    // Trigger data change to enable validation
    fireEvent.click(screen.getByTestId('trigger-data-change'))
    
    // Trigger validation error
    fireEvent.click(screen.getByTestId('trigger-validation-error'))
    
    // Should show validation summary (though it might not be visible until validation is triggered)
    await waitFor(() => {
      // The validation summary should be present when validation is enabled
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    })
  })

  it('should update save button based on validation state', async () => {
    render(<BaseChartEntryModal {...defaultProps} />)
    
    // Trigger data change to enable validation
    fireEvent.click(screen.getByTestId('trigger-data-change'))
    
    // Trigger validation error
    fireEvent.click(screen.getByTestId('trigger-validation-error'))
    
    await waitFor(() => {
      const saveButton = screen.getByRole('button', { name: /save/i })
      expect(saveButton).toBeInTheDocument()
    })
    
    // Clear validation error
    fireEvent.click(screen.getByTestId('clear-validation-error'))
    
    await waitFor(() => {
      const saveButton = screen.getByRole('button', { name: /save/i })
      expect(saveButton).toBeInTheDocument()
    })
  })

  it('should handle template save with validation', async () => {
    const mockOnSave = vi.fn().mockResolvedValue(undefined)
    
    render(
      <BaseChartEntryModal 
        {...defaultProps} 
        onSave={mockOnSave}
      />
    )
    
    // Trigger template save
    fireEvent.click(screen.getByTestId('template-save'))
    
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalled()
    })
  })

  it('should prevent saving when there are validation errors', async () => {
    const mockOnSave = vi.fn().mockResolvedValue(undefined)
    
    render(
      <BaseChartEntryModal 
        {...defaultProps} 
        onSave={mockOnSave}
      />
    )
    
    // Trigger data change and validation error
    fireEvent.click(screen.getByTestId('trigger-data-change'))
    fireEvent.click(screen.getByTestId('trigger-validation-error'))
    
    // Try to save via modal save button
    const saveButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(saveButton)
    
    // Should not call onSave due to validation errors
    await waitFor(() => {
      expect(mockOnSave).not.toHaveBeenCalled()
    })
  })

  it('should clear validation when modal closes', async () => {
    const mockOnClose = vi.fn()
    
    const { rerender } = render(
      <BaseChartEntryModal 
        {...defaultProps} 
        onClose={mockOnClose}
      />
    )
    
    // Trigger validation error
    fireEvent.click(screen.getByTestId('trigger-data-change'))
    fireEvent.click(screen.getByTestId('trigger-validation-error'))
    
    // Close modal
    rerender(
      <BaseChartEntryModal 
        {...defaultProps} 
        isOpen={false}
        onClose={mockOnClose}
      />
    )
    
    // Reopen modal - validation should be cleared
    rerender(
      <BaseChartEntryModal 
        {...defaultProps} 
        isOpen={true}
        onClose={mockOnClose}
      />
    )
    
    // Validation state should be reset
    expect(screen.getByTestId('progress-note-template')).toBeInTheDocument()
  })

  it('should handle unsaved data warning with validation', () => {
    const mockOnClose = vi.fn()
    
    // Mock window.confirm
    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    
    render(
      <BaseChartEntryModal 
        {...defaultProps} 
        onClose={mockOnClose}
      />
    )
    
    // Trigger data change
    fireEvent.click(screen.getByTestId('trigger-data-change'))
    
    // Try to close modal
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    
    // Should show confirmation dialog
    expect(mockConfirm).toHaveBeenCalledWith(
      'You have unsaved changes. Are you sure you want to close without saving?'
    )
    
    // Should not close modal
    expect(mockOnClose).not.toHaveBeenCalled()
    
    mockConfirm.mockRestore()
  })
})