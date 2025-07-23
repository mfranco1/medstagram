import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { NewChartEntryModal } from '../NewChartEntryModal'

describe('NewChartEntryModal Integration', () => {
  const mockOnClose = vi.fn()
  const mockOnSave = vi.fn()

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSave: mockOnSave
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with base modal structure', () => {
    render(<NewChartEntryModal {...defaultProps} />)
    
    expect(screen.getByText('New Chart Entry')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Save Entry')).toBeInTheDocument()
  })

  it('renders all SOAP sections', () => {
    render(<NewChartEntryModal {...defaultProps} />)
    
    expect(screen.getByText('Chief Complaint')).toBeInTheDocument()
    expect(screen.getByText('Subjective')).toBeInTheDocument()
    expect(screen.getByText('Objective')).toBeInTheDocument()
    expect(screen.getByText('Assessment')).toBeInTheDocument()
    expect(screen.getByText('Plan')).toBeInTheDocument()
  })

  it('disables save button when form is empty', () => {
    render(<NewChartEntryModal {...defaultProps} />)
    
    const saveButton = screen.getByText('Save Entry')
    expect(saveButton).toBeDisabled()
  })

  it('enables save button when form has content', () => {
    render(<NewChartEntryModal {...defaultProps} />)
    
    const subjectiveTextarea = screen.getByPlaceholderText('Enter subjective findings...')
    fireEvent.change(subjectiveTextarea, { target: { value: 'Patient reports feeling better' } })
    
    const saveButton = screen.getByText('Save Entry')
    expect(saveButton).not.toBeDisabled()
  })

  it('can collapse and expand sections', () => {
    render(<NewChartEntryModal {...defaultProps} />)
    
    const subjectiveButton = screen.getByRole('button', { name: /subjective/i })
    const subjectiveTextarea = screen.getByPlaceholderText('Enter subjective findings...')
    
    expect(subjectiveTextarea).toBeVisible()
    
    fireEvent.click(subjectiveButton)
    expect(subjectiveTextarea).not.toBeInTheDocument()
    
    fireEvent.click(subjectiveButton)
    expect(screen.getByPlaceholderText('Enter subjective findings...')).toBeVisible()
  })

  it('saves form data correctly', async () => {
    mockOnSave.mockResolvedValue(undefined)
    render(<NewChartEntryModal {...defaultProps} />)
    
    const formData = {
      chiefComplaint: 'Chest pain',
      subjective: 'Patient reports chest pain',
      objective: 'Vitals stable',
      assessment: 'Chest pain, rule out MI',
      plan: 'EKG, troponins'
    }
    
    fireEvent.change(screen.getByPlaceholderText('Enter chief complaint...'), {
      target: { value: formData.chiefComplaint }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter subjective findings...'), {
      target: { value: formData.subjective }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter objective findings...'), {
      target: { value: formData.objective }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter assessment...'), {
      target: { value: formData.assessment }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter plan...'), {
      target: { value: formData.plan }
    })
    
    const saveButton = screen.getByText('Save Entry')
    fireEvent.click(saveButton)
    
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(formData)
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  it('resets form after successful save', async () => {
    mockOnSave.mockResolvedValue(undefined)
    const { rerender } = render(<NewChartEntryModal {...defaultProps} />)
    
    const subjectiveTextarea = screen.getByPlaceholderText('Enter subjective findings...')
    fireEvent.change(subjectiveTextarea, { target: { value: 'Test content' } })
    
    const saveButton = screen.getByText('Save Entry')
    fireEvent.click(saveButton)
    
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalled()
    })
    
    // Re-render the same component to check if form is reset
    rerender(<NewChartEntryModal {...defaultProps} />)
    expect(screen.getByPlaceholderText('Enter subjective findings...')).toHaveValue('')
  })

  it('handles save errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockOnSave.mockRejectedValue(new Error('Save failed'))
    
    render(<NewChartEntryModal {...defaultProps} />)
    
    const subjectiveTextarea = screen.getByPlaceholderText('Enter subjective findings...')
    fireEvent.change(subjectiveTextarea, { target: { value: 'Test content' } })
    
    const saveButton = screen.getByText('Save Entry')
    fireEvent.click(saveButton)
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
    
    // Modal should not close on error
    expect(mockOnClose).not.toHaveBeenCalled()
    
    consoleErrorSpy.mockRestore()
  })

  it('closes modal when cancel is clicked', () => {
    render(<NewChartEntryModal {...defaultProps} />)
    
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)
    
    expect(mockOnClose).toHaveBeenCalled()
  })
})