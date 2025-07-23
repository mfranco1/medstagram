import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { ProgressNoteTemplate } from '../templates/ProgressNoteTemplate'
import { ValidationProvider } from '../contexts/ValidationContext'
import type { Patient } from '../../../types/patient'

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

describe('ProgressNoteTemplate Validation', () => {
  const defaultProps = {
    patient: mockPatient,
    onSave: vi.fn(),
    onCancel: vi.fn(),
    onDataChange: vi.fn(),
    onValidationChange: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with validation context', () => {
    render(
      <ValidationProvider templateType="progress_note">
        <ProgressNoteTemplate {...defaultProps} />
      </ValidationProvider>
    )

    expect(screen.getByText('Progress Note Template')).toBeInTheDocument()
    expect(screen.getByText('Subjective')).toBeInTheDocument()
    expect(screen.getByText('Objective')).toBeInTheDocument()
    expect(screen.getByText('Assessment')).toBeInTheDocument()
    expect(screen.getByText('Plan')).toBeInTheDocument()
  })

  it('should show validation errors for required fields', async () => {
    render(
      <ValidationProvider templateType="progress_note">
        <ProgressNoteTemplate {...defaultProps} />
      </ValidationProvider>
    )

    // Fill in some data to trigger validation
    const subjectiveTextarea = screen.getByPlaceholderText('Enter subjective findings...')
    fireEvent.change(subjectiveTextarea, { target: { value: 'Test' } })

    // Clear the field to trigger required field validation
    fireEvent.change(subjectiveTextarea, { target: { value: '' } })

    // Wait for validation to appear
    await waitFor(() => {
      expect(screen.getByText('Subjective findings are required for progress notes')).toBeInTheDocument()
    })
  })

  it('should show validation warnings for short content', async () => {
    render(
      <ValidationProvider templateType="progress_note">
        <ProgressNoteTemplate {...defaultProps} />
      </ValidationProvider>
    )

    // Fill in short content to trigger warning
    const subjectiveTextarea = screen.getByPlaceholderText('Enter subjective findings...')
    fireEvent.change(subjectiveTextarea, { target: { value: 'Short' } })

    // Wait for validation warning to appear
    await waitFor(() => {
      expect(screen.getByText('Subjective section should provide adequate detail')).toBeInTheDocument()
    })
  })

  it('should update validation state when data changes', async () => {
    const mockOnValidationChange = vi.fn()
    
    render(
      <ValidationProvider templateType="progress_note">
        <ProgressNoteTemplate 
          {...defaultProps} 
          onValidationChange={mockOnValidationChange}
        />
      </ValidationProvider>
    )

    // Fill in required fields
    fireEvent.change(screen.getByPlaceholderText('Enter subjective findings...'), { 
      target: { value: 'Patient reports chest pain' } 
    })
    fireEvent.change(screen.getByPlaceholderText('Enter objective findings...'), { 
      target: { value: 'Vital signs stable, no acute distress' } 
    })
    fireEvent.change(screen.getByPlaceholderText('Enter assessment...'), { 
      target: { value: 'Chest pain, likely musculoskeletal' } 
    })
    fireEvent.change(screen.getByPlaceholderText('Enter plan...'), { 
      target: { value: 'NSAIDs, follow up in 1 week' } 
    })

    // Wait for validation to update
    await waitFor(() => {
      expect(mockOnValidationChange).toHaveBeenCalledWith(true, false)
    })
  })

  it('should disable save button when there are validation errors', async () => {
    render(
      <ValidationProvider templateType="progress_note">
        <ProgressNoteTemplate {...defaultProps} />
      </ValidationProvider>
    )

    // Initially save button should be disabled (form is empty)
    const saveButton = screen.getByRole('button', { name: /save progress note/i })
    expect(saveButton).toBeDisabled()

    // Fill in some fields but leave required ones empty
    fireEvent.change(screen.getByPlaceholderText('Enter chief complaint...'), { 
      target: { value: 'Chest pain' } 
    })

    // Save button should still be disabled due to missing required fields
    expect(saveButton).toBeDisabled()
  })

  it('should enable save button when all required fields are filled', async () => {
    render(
      <ValidationProvider templateType="progress_note">
        <ProgressNoteTemplate {...defaultProps} />
      </ValidationProvider>
    )

    const saveButton = screen.getByRole('button', { name: /save progress note/i })
    
    // Fill in all required fields
    fireEvent.change(screen.getByPlaceholderText('Enter subjective findings...'), { 
      target: { value: 'Patient reports chest pain that started this morning' } 
    })
    fireEvent.change(screen.getByPlaceholderText('Enter objective findings...'), { 
      target: { value: 'Vital signs: BP 120/80, HR 72, RR 16, O2 98%. No acute distress.' } 
    })
    fireEvent.change(screen.getByPlaceholderText('Enter assessment...'), { 
      target: { value: 'Chest pain, likely musculoskeletal in origin' } 
    })
    fireEvent.change(screen.getByPlaceholderText('Enter plan...'), { 
      target: { value: 'NSAIDs for pain relief, follow up in 1 week if symptoms persist' } 
    })

    // Wait for validation to update and save button to be enabled
    await waitFor(() => {
      expect(saveButton).not.toBeDisabled()
    })
  })

  it('should call onSave with proper metadata when saving', async () => {
    const mockOnSave = vi.fn()
    
    render(
      <ValidationProvider templateType="progress_note">
        <ProgressNoteTemplate 
          {...defaultProps} 
          onSave={mockOnSave}
        />
      </ValidationProvider>
    )

    // Fill in all required fields
    fireEvent.change(screen.getByPlaceholderText('Enter subjective findings...'), { 
      target: { value: 'Patient reports chest pain' } 
    })
    fireEvent.change(screen.getByPlaceholderText('Enter objective findings...'), { 
      target: { value: 'Vital signs stable' } 
    })
    fireEvent.change(screen.getByPlaceholderText('Enter assessment...'), { 
      target: { value: 'Chest pain' } 
    })
    fireEvent.change(screen.getByPlaceholderText('Enter plan...'), { 
      target: { value: 'NSAIDs' } 
    })

    // Click save
    const saveButton = screen.getByRole('button', { name: /save progress note/i })
    await waitFor(() => {
      expect(saveButton).not.toBeDisabled()
    })
    
    fireEvent.click(saveButton)

    // Verify onSave was called with proper structure
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'progress_note',
          templateVersion: '1.0',
          subjective: 'Patient reports chest pain',
          objective: 'Vital signs stable',
          assessment: 'Chest pain',
          plan: 'NSAIDs',
          metadata: expect.objectContaining({
            requiredFieldsCompleted: true,
            lastModified: expect.any(String),
            wordCount: expect.any(Number),
            estimatedReadTime: expect.any(Number)
          })
        })
      )
    })
  })
})