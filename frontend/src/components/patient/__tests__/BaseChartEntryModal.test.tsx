import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { BaseChartEntryModal } from '../BaseChartEntryModal'

describe('BaseChartEntryModal', () => {
  const mockOnClose = vi.fn()
  const mockOnSave = vi.fn()

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    title: 'Test Entry',
    children: <div data-testid="modal-content">Test Content</div>
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders modal when isOpen is true', () => {
    render(<BaseChartEntryModal {...defaultProps} />)
    
    expect(screen.getByText('New Test Entry')).toBeInTheDocument()
    expect(screen.getByTestId('modal-content')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Save Entry')).toBeInTheDocument()
  })

  it('does not render modal when isOpen is false', () => {
    render(<BaseChartEntryModal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('New Test Entry')).not.toBeInTheDocument()
  })

  it('shows edit title when isEditing is true', () => {
    render(<BaseChartEntryModal {...defaultProps} isEditing={true} />)
    
    expect(screen.getByText('Edit Test Entry')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    render(<BaseChartEntryModal {...defaultProps} />)
    
    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when cancel button is clicked', () => {
    render(<BaseChartEntryModal {...defaultProps} />)
    
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onSave when save button is clicked', async () => {
    mockOnSave.mockResolvedValue(undefined)
    render(<BaseChartEntryModal {...defaultProps} />)
    
    const saveButton = screen.getByText('Save Entry')
    fireEvent.click(saveButton)
    
    expect(mockOnSave).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })

  it('disables save button when isSaveDisabled is true', () => {
    render(<BaseChartEntryModal {...defaultProps} isSaveDisabled={true} />)
    
    const saveButton = screen.getByText('Save Entry')
    expect(saveButton).toBeDisabled()
  })

  it('shows custom save button text', () => {
    render(<BaseChartEntryModal {...defaultProps} saveButtonText="Update Entry" />)
    
    expect(screen.getByText('Update Entry')).toBeInTheDocument()
  })

  it('shows loading state when saving', async () => {
    let resolvePromise: () => void
    const savePromise = new Promise<void>((resolve) => {
      resolvePromise = resolve
    })
    mockOnSave.mockReturnValue(savePromise)

    render(<BaseChartEntryModal {...defaultProps} />)
    
    const saveButton = screen.getByText('Save Entry')
    fireEvent.click(saveButton)
    
    expect(screen.getByText('Saving...')).toBeInTheDocument()
    expect(saveButton).toBeDisabled()
    
    resolvePromise!()
    await waitFor(() => {
      expect(screen.queryByText('Saving...')).not.toBeInTheDocument()
    })
  })

  it('handles save error gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockOnSave.mockRejectedValue(new Error('Save failed'))
    
    render(<BaseChartEntryModal {...defaultProps} />)
    
    const saveButton = screen.getByText('Save Entry')
    fireEvent.click(saveButton)
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to save chart entry:', expect.any(Error))
    })
    
    // Modal should not close on error
    expect(mockOnClose).not.toHaveBeenCalled()
    
    consoleErrorSpy.mockRestore()
  })

  it('closes modal when clicking outside', () => {
    render(<BaseChartEntryModal {...defaultProps} />)
    
    // Click on the backdrop (outside the modal)
    const backdrop = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50')
    fireEvent.mouseDown(backdrop!)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('closes modal when pressing escape key', () => {
    render(<BaseChartEntryModal {...defaultProps} />)
    
    fireEvent.keyDown(document, { key: 'Escape' })
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('does not close modal when clicking inside modal content', () => {
    render(<BaseChartEntryModal {...defaultProps} />)
    
    const modalContent = screen.getByTestId('modal-content')
    fireEvent.mouseDown(modalContent)
    
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('disables buttons when saving', async () => {
    let resolvePromise: () => void
    const savePromise = new Promise<void>((resolve) => {
      resolvePromise = resolve
    })
    mockOnSave.mockReturnValue(savePromise)

    render(<BaseChartEntryModal {...defaultProps} />)
    
    const saveButton = screen.getByText('Save Entry')
    const cancelButton = screen.getByText('Cancel')
    
    fireEvent.click(saveButton)
    
    expect(saveButton).toBeDisabled()
    expect(cancelButton).toBeDisabled()
    
    resolvePromise!()
    await waitFor(() => {
      expect(saveButton).not.toBeDisabled()
      expect(cancelButton).not.toBeDisabled()
    })
  })
})