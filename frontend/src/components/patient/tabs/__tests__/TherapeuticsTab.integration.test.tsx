import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TherapeuticsTab } from '../TherapeuticsTab'
import { MedicationService } from '../../../../services/medicationService'
import type { Patient } from '../../../../types/patient'

// Mock the MedicationService
vi.mock('../../../../services/medicationService', () => ({
  MedicationService: {
    createMedication: vi.fn(),
    updateMedication: vi.fn(),
    discontinueMedication: vi.fn(),
  },
  DISCONTINUATION_REASONS: ['Completed course', 'Adverse reaction', 'Other']
}))

const createMockPatient = (medications: any[] = []): Patient => ({
  id: 1,
  name: 'Test Patient',
  age: 45,
  gender: 'Male',
  caseNumber: '123456',
  dateAdmitted: '2024-03-15',
  location: 'Ward 3',
  status: 'Active Admission',
  diagnosis: 'Test Diagnosis',
  dateOfBirth: '1979-05-15',
  civilStatus: 'Married',
  nationality: 'Filipino',
  religion: 'Roman Catholic',
  address: '123 Test St.',
  philhealth: '12-345678901-2',
  primaryService: 'Internal Medicine',
  medications: [...medications]
})

describe('TherapeuticsTab - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show medication immediately after successful creation', async () => {
    const user = userEvent.setup()
    const mockPatient = createMockPatient()
    
    const newMedication = {
      id: 'med-123',
      patientId: 1,
      name: 'Test Medication',
      dosage: { amount: 10, unit: 'mg' },
      frequency: { times: 1, period: 'daily' as const },
      route: 'oral' as const,
      startDate: '2024-03-20',
      status: 'active' as const,
      prescribedBy: { id: 'test-doctor', name: 'Test Doctor' },
      createdAt: '2024-03-20T10:00:00Z',
      updatedAt: '2024-03-20T10:00:00Z'
    }

    // Mock the service to simulate successful creation
    vi.mocked(MedicationService.createMedication).mockImplementation(async () => {
      // Simulate adding medication to patient data
      mockPatient.medications = mockPatient.medications || []
      mockPatient.medications.push(newMedication)
      return newMedication
    })

    const { rerender } = render(<TherapeuticsTab patient={mockPatient} />)

    // Initially should show empty state
    expect(screen.getByText('No current medications')).toBeInTheDocument()

    // Simulate successful medication creation by calling the service directly
    // and then re-rendering with updated patient data
    await MedicationService.createMedication(1, {
      patientId: 1,
      name: 'Test Medication',
      dosage: { amount: 10, unit: 'mg' },
      frequency: { times: 1, period: 'daily' },
      route: 'oral',
      startDate: '2024-03-20',
      status: 'active',
      prescribedBy: { id: 'test-doctor', name: 'Test Doctor' }
    })

    // Re-render with updated patient data
    rerender(<TherapeuticsTab patient={mockPatient} />)

    // Verify the medication appears in the list
    await waitFor(() => {
      expect(screen.getByText('Test Medication')).toBeInTheDocument()
    })

    // Verify the empty state is no longer shown
    expect(screen.queryByText('No current medications')).not.toBeInTheDocument()

    // Verify the count badge shows 1
    const activeButton = screen.getByRole('button', { name: /active/i })
    expect(activeButton).toHaveTextContent('1')
  })

  it('should update counts correctly when medication is added', async () => {
    const mockPatient = createMockPatient()
    
    const { rerender } = render(<TherapeuticsTab patient={mockPatient} />)

    // Initially no count badges should be visible
    const activeButton = screen.getByRole('button', { name: /active/i })
    expect(activeButton).not.toHaveTextContent('1')

    // Add a medication to the patient data
    const newMedication = {
      id: 'med-123',
      patientId: 1,
      name: 'Test Medication',
      dosage: { amount: 10, unit: 'mg' },
      frequency: { times: 1, period: 'daily' as const },
      route: 'oral' as const,
      startDate: '2024-03-20',
      status: 'active' as const,
      prescribedBy: { id: 'test-doctor', name: 'Test Doctor' },
      createdAt: '2024-03-20T10:00:00Z',
      updatedAt: '2024-03-20T10:00:00Z'
    }

    mockPatient.medications = [newMedication]

    // Re-render with updated patient data
    rerender(<TherapeuticsTab patient={mockPatient} />)

    // Check that the Active filter now shows count of 1
    await waitFor(() => {
      const updatedActiveButton = screen.getByRole('button', { name: /active/i })
      expect(updatedActiveButton).toHaveTextContent('1')
    })

    // Check that the All filter also shows count of 1
    const allButton = screen.getByRole('button', { name: /all/i })
    expect(allButton).toHaveTextContent('1')
  })

  it('should remove medication from active list when discontinued', async () => {
    // Start with an active medication
    const activeMedication = {
      id: 'med-123',
      patientId: 1,
      name: 'Test Medication',
      dosage: { amount: 10, unit: 'mg' },
      frequency: { times: 1, period: 'daily' as const },
      route: 'oral' as const,
      startDate: '2024-03-20',
      status: 'active' as const,
      prescribedBy: { id: 'test-doctor', name: 'Test Doctor' },
      createdAt: '2024-03-20T10:00:00Z',
      updatedAt: '2024-03-20T10:00:00Z'
    }

    const mockPatient = createMockPatient([activeMedication])
    
    const { rerender } = render(<TherapeuticsTab patient={mockPatient} />)

    // Verify medication is initially shown
    expect(screen.getAllByText('Test Medication')).toHaveLength(2) // Desktop and mobile views

    // Simulate discontinuation
    activeMedication.status = 'discontinued'
    activeMedication.discontinuationReason = 'Completed course'
    activeMedication.endDate = '2024-03-20'

    // Re-render with updated patient data
    rerender(<TherapeuticsTab patient={mockPatient} />)

    // Verify medication is no longer shown in active list (default filter is 'active')
    await waitFor(() => {
      expect(screen.queryByText('Test Medication')).not.toBeInTheDocument()
    })

    // Verify empty state is shown
    expect(screen.getByText('No current medications')).toBeInTheDocument()

    // Verify count badge is no longer shown
    const activeButton = screen.getByRole('button', { name: /active/i })
    expect(activeButton).not.toHaveTextContent('1')
  })

  it('should show discontinued medication when switching to inactive filter', async () => {
    const user = userEvent.setup()
    
    // Start with a discontinued medication
    const discontinuedMedication = {
      id: 'med-123',
      patientId: 1,
      name: 'Discontinued Medication',
      dosage: { amount: 10, unit: 'mg' },
      frequency: { times: 1, period: 'daily' as const },
      route: 'oral' as const,
      startDate: '2024-03-20',
      endDate: '2024-03-21',
      status: 'discontinued' as const,
      discontinuationReason: 'Completed course',
      prescribedBy: { id: 'test-doctor', name: 'Test Doctor' },
      createdAt: '2024-03-20T10:00:00Z',
      updatedAt: '2024-03-21T10:00:00Z'
    }

    const mockPatient = createMockPatient([discontinuedMedication])
    
    render(<TherapeuticsTab patient={mockPatient} />)

    // Initially should show empty state (active filter is default)
    expect(screen.getByText('No current medications')).toBeInTheDocument()

    // Click on Inactive filter
    const inactiveButton = screen.getByRole('button', { name: /inactive/i })
    await user.click(inactiveButton)

    // Verify discontinued medication is now shown
    await waitFor(() => {
      expect(screen.getByText('Discontinued Medication')).toBeInTheDocument()
    })

    // Verify empty state is no longer shown
    expect(screen.queryByText('No current medications')).not.toBeInTheDocument()
  })
})