import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { BaseChartEntryModal } from '../BaseChartEntryModal'

describe('BaseChartEntryModal Reusability', () => {
  const mockOnClose = vi.fn()
  const mockOnSave = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('can be used for different entry types with custom content', () => {
    const CustomContent = () => (
      <div>
        <h3>Custom Template Content</h3>
        <input type="text" placeholder="Custom field" />
        <textarea placeholder="Custom textarea" />
      </div>
    )

    render(
      <BaseChartEntryModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        title="Custom Entry Type"
        saveButtonText="Save Custom Entry"
      >
        <CustomContent />
      </BaseChartEntryModal>
    )

    expect(screen.getByText('New Custom Entry Type')).toBeInTheDocument()
    expect(screen.getByText('Custom Template Content')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Custom field')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Custom textarea')).toBeInTheDocument()
    expect(screen.getByText('Save Custom Entry')).toBeInTheDocument()
  })

  it('can be used in editing mode', () => {
    render(
      <BaseChartEntryModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        title="Progress Note"
        isEditing={true}
        saveButtonText="Update Note"
      >
        <div>Editing content</div>
      </BaseChartEntryModal>
    )

    expect(screen.getByText('Edit Progress Note')).toBeInTheDocument()
    expect(screen.getByText('Update Note')).toBeInTheDocument()
  })

  it('can handle complex nested content', () => {
    const ComplexContent = () => (
      <div>
        <div className="section">
          <h4>Section 1</h4>
          <input type="text" placeholder="Field 1" />
        </div>
        <div className="section">
          <h4>Section 2</h4>
          <select>
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
        </div>
        <div className="section">
          <h4>Section 3</h4>
          <div>
            <label>
              <input type="checkbox" />
              Checkbox option
            </label>
          </div>
        </div>
      </div>
    )

    render(
      <BaseChartEntryModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        title="Complex Entry"
      >
        <ComplexContent />
      </BaseChartEntryModal>
    )

    expect(screen.getByText('Section 1')).toBeInTheDocument()
    expect(screen.getByText('Section 2')).toBeInTheDocument()
    expect(screen.getByText('Section 3')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Field 1')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('maintains modal functionality with any content', () => {
    render(
      <BaseChartEntryModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        title="Test Modal"
      >
        <div data-testid="custom-content">Any content works here</div>
      </BaseChartEntryModal>
    )

    // Test that modal functionality still works
    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)
    expect(mockOnClose).toHaveBeenCalled()

    // Test that content is rendered
    expect(screen.getByTestId('custom-content')).toBeInTheDocument()
  })
})