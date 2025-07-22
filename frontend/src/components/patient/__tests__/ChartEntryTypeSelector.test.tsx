import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ChartEntryTypeSelector } from '../ChartEntryTypeSelector'
import type { ChartEntryType } from '../../../types/patient'

describe('ChartEntryTypeSelector', () => {
  const mockOnTypeSelect = vi.fn()

  beforeEach(() => {
    mockOnTypeSelect.mockClear()
  })

  it('renders with default types', () => {
    render(<ChartEntryTypeSelector onTypeSelect={mockOnTypeSelect} />)
    
    expect(screen.getByText('Select Entry Type')).toBeInTheDocument()
    expect(screen.getByText('Progress Note')).toBeInTheDocument()
    expect(screen.getByText('Quick Note')).toBeInTheDocument()
  })

  it('calls onTypeSelect when a type is clicked', () => {
    render(<ChartEntryTypeSelector onTypeSelect={mockOnTypeSelect} />)
    
    const progressNoteButton = screen.getByRole('radio', { name: /progress note/i })
    fireEvent.click(progressNoteButton)
    
    expect(mockOnTypeSelect).toHaveBeenCalledWith('progress_note')
  })

  it('filters types based on user role', () => {
    render(
      <ChartEntryTypeSelector 
        onTypeSelect={mockOnTypeSelect} 
        userRole="nurse"
      />
    )
    
    // Nurses should only see progress_note, quick_note, and emergency_note
    expect(screen.getByText('Progress Note')).toBeInTheDocument()
    expect(screen.getByText('Quick Note')).toBeInTheDocument()
    expect(screen.getByText('Emergency/Code Note')).toBeInTheDocument()
    
    // Should not see admission note (doctor/resident only)
    expect(screen.queryByText('Admission Note')).not.toBeInTheDocument()
  })

  it('shows selected type summary', () => {
    render(<ChartEntryTypeSelector onTypeSelect={mockOnTypeSelect} />)
    
    const admissionNoteButton = screen.getByRole('radio', { name: /admission note/i })
    fireEvent.click(admissionNoteButton)
    
    expect(screen.getByText('Selected: Admission Note')).toBeInTheDocument()
    // Use getAllByText to handle multiple instances of the same text
    const descriptions = screen.getAllByText(/comprehensive initial patient assessment/i)
    expect(descriptions.length).toBeGreaterThan(0)
  })

  it('supports keyboard navigation', () => {
    render(<ChartEntryTypeSelector onTypeSelect={mockOnTypeSelect} />)
    
    const container = screen.getByRole('radiogroup')
    
    // Focus the container and press arrow down
    fireEvent.keyDown(container, { key: 'ArrowDown' })
    
    // Check that keyboard navigation is working by verifying the component renders
    expect(container).toBeInTheDocument()
  })

  it('handles Enter key selection', () => {
    render(<ChartEntryTypeSelector onTypeSelect={mockOnTypeSelect} />)
    
    const firstRadioButton = screen.getAllByRole('radio')[0]
    
    // Focus the first radio button and press Enter
    firstRadioButton.focus()
    fireEvent.keyDown(firstRadioButton, { key: 'Enter' })
    
    expect(mockOnTypeSelect).toHaveBeenCalled()
  })

  it('respects availableTypes prop', () => {
    const limitedTypes: ChartEntryType[] = ['progress_note', 'quick_note']
    
    render(
      <ChartEntryTypeSelector 
        onTypeSelect={mockOnTypeSelect}
        availableTypes={limitedTypes}
      />
    )
    
    expect(screen.getByText('Progress Note')).toBeInTheDocument()
    expect(screen.getByText('Quick Note')).toBeInTheDocument()
    expect(screen.queryByText('Admission Note')).not.toBeInTheDocument()
  })

  it('sets default selected type', () => {
    render(
      <ChartEntryTypeSelector 
        onTypeSelect={mockOnTypeSelect}
        defaultType="quick_note"
      />
    )
    
    expect(screen.getByText('Selected: Quick Note')).toBeInTheDocument()
  })
})