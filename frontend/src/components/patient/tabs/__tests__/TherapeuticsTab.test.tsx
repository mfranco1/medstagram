import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

const mockPatient: Patient = {
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
  medications: []
}

describe('TherapeuticsTab - UI Updates', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset patient medications
    mockPatient.medications = []
  })

  it('should show newly added medication in the list immediately', async () => {
    const user = userEvent.setup()
    
    // Mock successful medication creation
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

    vi.mocked(MedicationService.createMedication).mockImplementation(async (patientId, medicationData) => {
      // Simulate adding medication to patient data
      mockPatient.medications = mockPatient.medications || []
      mockPatient.medications.push(newMedication)
      return newMedication
    })

    render(<TherapeuticsTab patient={mockPatient} />)

    // Initially should show empty state
    expect(screen.getByText('No current medications')).toBeInTheDocument()

    // Click Add Medication button
    const addButton = screen.getByRole('button', { name: /add medication/i })
    await user.click(addButton)

    // Wait for modal to appear
    await waitFor(() => {
      expect(screen.getByText('Add New Medication')).toBeInTheDocument()
    })

    // Fill out the form
    const nameInput = screen.getByLabelText(/medication name/i)
    await user.type(nameInput, 'Test Medication')

    const dosageInput = screen.getByLabelText(/dosage amount/i)
    await user.clear(dosageInput)
    await user.type(dosageInput, '10')

    const startDateInput = screen.getByLabelText(/start date/i)
    await user.clear(startDateInput)
    await user.type(startDateInput, '2024-03-20')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /add medication/i })
    await user.click(submitButton)

    // Wait for the modal to close and medication to appear in the list
    await waitFor(() => {
      expect(screen.queryByText('Add New Medication')).not.toBeInTheDocument()
    })

    // Verify the medication appears in the list
    await waitFor(() => {
      expect(screen.getByText('Test Medication')).toBeInTheDocument()
    })

    // Verify the empty state is no longer shown
    expect(screen.queryByText('No current medications')).not.toBeInTheDocument()

    // Verify the service was called
    expect(MedicationService.createMedication).toHaveBeenCalledWith(1, expect.objectContaining({
      name: 'Test Medication',
      dosage: { amount: 10, unit: 'mg' }
    }))
  })

  it('should update medication counts in filter badges after adding medication', async () => {
    const user = userEvent.setup()
    
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

    vi.mocked(MedicationService.createMedication).mockImplementation(async (patientId, medicationData) => {
      mockPatient.medications = mockPatient.medications || []
      mockPatient.medications.push(newMedication)
      return newMedication
    })

    render(<TherapeuticsTab patient={mockPatient} />)

    // Initially no count badges should be visible
    expect(screen.queryByText('1')).not.toBeInTheDocument()

    // Add a medication (simplified flow)
    const addButton = screen.getByRole('button', { name: /add medication/i })
    await user.click(addButton)

    await waitFor(() => {
      expect(screen.getByText('Add New Medication')).toBeInTheDocument()
    })

    // Fill minimal required fields and submit
    const nameInput = screen.getByLabelText(/medication name/i)
    await user.type(nameInput, 'Test Medication')

    const dosageInput = screen.getByLabelText(/dosage amount/i)
    await user.clear(dosageInput)
    await user.type(dosageInput, '10')

    const submitButton = screen.getByRole('button', { name: /add medication/i })
    await user.click(submitButton)

    // Wait for modal to close
    await waitFor(() => {
      expect(screen.queryByText('Add New Medication')).not.toBeInTheDocument()
    })

    // Check that the Active filter now shows count of 1
    await waitFor(() => {
      const activeButton = screen.getByRole('button', { name: /active/i })
      expect(activeButton).toHaveTextContent('1')
    })
  })

  it('should remove medication from list immediately after discontinuation', async () => {
    const user = userEvent.setup()
    
    // Start with a medication in the list
    const existingMedication = {
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

    mockPatient.medications = [existingMedication]

    vi.mocked(MedicationService.discontinueMedication).mockImplementation(async (patientId, medicationId, reason) => {
      // Simulate discontinuing the medication
      const medication = mockPatient.medications?.find(m => m.id === medicationId)
      if (medication) {
        medication.status = 'discontinued'
        medication.discontinuationReason = reason
        medication.endDate = '2024-03-20'
      }
      return medication!
    })

    render(<TherapeuticsTab patient={mockPatient} />)

    // Verify medication is initially shown
    expect(screen.getByText('Test Medication')).toBeInTheDocument()

    // Click the actions menu (three dots)
    const actionsButton = screen.getByRole('button', { name: /more/i })
    await user.click(actionsButton)

    // Click discontinue
    const discontinueButton = screen.getByRole('button', { name: /discontinue/i })
    await user.click(discontinueButton)

    // Wait for discontinuation modal
    await waitFor(() => {
      expect(screen.getByText('Discontinue Medication')).toBeInTheDocument()
    })

    // Select a reason and confirm
    const reasonSelect = screen.getByRole('combobox')
    await user.selectOptions(reasonSelect, 'Completed course')

    const confirmButton = screen.getByRole('button', { name: /discontinue/i })
    await user.click(confirmButton)

    // Wait for modal to close
    await waitFor(() => {
      expect(screen.queryByText('Discontinue Medication')).not.toBeInTheDocument()
    })

    // Verify medication is no longer shown in active list (default filter is 'active')
    await waitFor(() => {
      expect(screen.queryByText('Test Medication')).not.toBeInTheDocument()
    })

    // Verify empty state is shown
    expect(screen.getByText('No current medications')).toBeInTheDocument()
  })
})