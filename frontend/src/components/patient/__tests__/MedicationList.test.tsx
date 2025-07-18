import { render, screen } from '@testing-library/react'
import { MedicationList } from '../MedicationList'
import type { Medication } from '../../../types/patient'
import { expect } from 'vitest'
import { vi } from 'vitest'
import { vi } from 'vitest'
import { vi } from 'vitest'
import { expect } from 'vitest'
import { expect } from 'vitest'
import { vi } from 'vitest'
import { vi } from 'vitest'
import { vi } from 'vitest'
import { expect } from 'vitest'
import { expect } from 'vitest'
import { expect } from 'vitest'
import { expect } from 'vitest'
import { vi } from 'vitest'
import { vi } from 'vitest'
import { vi } from 'vitest'
import { expect } from 'vitest'
import { expect } from 'vitest'
import { expect } from 'vitest'
import { expect } from 'vitest'
import { expect } from 'vitest'
import { expect } from 'vitest'
import { expect } from 'vitest'
import { vi } from 'vitest'
import { vi } from 'vitest'
import { vi } from 'vitest'

const mockMedications: Medication[] = [
  {
    id: '1',
    patientId: 1,
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    dosage: { amount: 10, unit: 'mg' },
    frequency: { times: 1, period: 'daily' },
    route: 'oral',
    startDate: '2024-01-15',
    status: 'active',
    indication: 'Hypertension',
    prescribedBy: {
      id: 'doc1',
      name: 'Dr. Smith',
      title: 'MD'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    patientId: 1,
    name: 'Metformin',
    genericName: 'Metformin',
    dosage: { amount: 500, unit: 'mg' },
    frequency: { times: 2, period: 'daily' },
    route: 'oral',
    startDate: '2024-01-10',
    status: 'active',
    indication: 'Type 2 Diabetes',
    prescribedBy: {
      id: 'doc1',
      name: 'Dr. Smith',
      title: 'MD'
    },
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  }
]

describe('MedicationList', () => {
  it('should render medications in card format', () => {
    render(
      <MedicationList
        medications={mockMedications}
        onEdit={vi.fn()}
        onDiscontinue={vi.fn()}
        onViewDetails={vi.fn()}
      />
    )

    // Check that medications are displayed
    expect(screen.getByText('Lisinopril')).toBeInTheDocument()
    expect(screen.getByText('Metformin')).toBeInTheDocument()
    
    // Check that dosage information is displayed (appears in both desktop and mobile layouts)
    expect(screen.getAllByText('10 mg')).toHaveLength(2) // Desktop and mobile layouts
    expect(screen.getAllByText('500 mg')).toHaveLength(2) // Desktop and mobile layouts
    
    // Check that frequency information is displayed (appears in both desktop and mobile layouts)
    expect(screen.getAllByText('Once daily')).toHaveLength(2) // Desktop and mobile layouts
    expect(screen.getAllByText('2x daily')).toHaveLength(2) // Desktop and mobile layouts
    
    // Check that status badges are displayed
    expect(screen.getAllByText('Active')).toHaveLength(2)
  })

  it('should show sorting controls on desktop', () => {
    render(
      <MedicationList
        medications={mockMedications}
        onEdit={vi.fn()}
        onDiscontinue={vi.fn()}
        onViewDetails={vi.fn()}
      />
    )

    // Check that sorting controls are present
    expect(screen.getByText('Sort by:')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Date')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('should show empty state when no medications', () => {
    render(
      <MedicationList
        medications={[]}
        onEdit={vi.fn()}
        onDiscontinue={vi.fn()}
        onViewDetails={vi.fn()}
      />
    )

    expect(screen.getByText('No current medications')).toBeInTheDocument()
    expect(screen.getByText('Click "Add Medication" to start managing medications')).toBeInTheDocument()
  })

  it('should show action buttons for active medications', () => {
    render(
      <MedicationList
        medications={mockMedications}
        onEdit={vi.fn()}
        onDiscontinue={vi.fn()}
        onViewDetails={vi.fn()}
      />
    )

    // Should have action menu buttons for active medications
    const actionButtons = screen.getAllByRole('button')
    const menuButtons = actionButtons.filter(button => 
      button.querySelector('svg') && 
      button.getAttribute('class')?.includes('text-gray-400')
    )
    expect(menuButtons).toHaveLength(2) // One for each active medication
  })
})