import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { MedicationForm } from '../MedicationForm'
import type { Patient, Medication } from '../../../types/patient'

// Mock the TimePicker component
vi.mock('../../ui/time-picker/TimePicker', () => ({
  TimePicker: ({ value, onChange, disabled }: any) => (
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      data-testid="time-picker"
    />
  )
}))

// Mock the Toast component
vi.mock('../../ui/Toast', () => ({
  Toast: ({ message, type, onClose }: any) => (
    <div data-testid="toast" data-type={type}>
      {message}
      <button onClick={onClose}>Close</button>
    </div>
  )
}))

const mockPatient: Patient = {
  id: 1,
  name: 'John Doe',
  age: 45,
  gender: 'Male',
  caseNumber: 'C001',
  dateAdmitted: '2024-01-01',
  location: 'Room 101',
  status: 'stable',
  diagnosis: 'Hypertension',
  dateOfBirth: '1979-01-01',
  civilStatus: 'Married',
  nationality: 'American',
  religion: 'Christian',
  address: '123 Main St',
  philhealth: 'PH123456',
  primaryService: 'Internal Medicine',
  weight: 70,
  allergies: [
    {
      type: 'drug',
      allergen: 'Penicillin',
      reaction: 'Rash',
      severity: 'moderate'
    }
  ]
}

const mockMedication: Medication = {
  id: 'med-1',
  patientId: 1,
  name: 'Lisinopril',
  genericName: 'Lisinopril',
  dosage: { amount: 10, unit: 'mg' },
  frequency: { times: 1, period: 'daily' },
  route: 'oral',
  startDate: '2024-01-01',
  status: 'active',
  prescribedBy: { id: 'dr-1', name: 'Dr. Smith' },
  indication: 'Hypertension',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

describe('MedicationForm Validation and Error Handling', () => {
  const mockOnSave = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Required Field Validation', () => {
    it('should show error for empty medication name', async () => {
      const user = userEvent.setup()
      
      render(
        <MedicationForm
          isOpen={true}
          patient={mockPatient}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      const submitButton = screen.getByRole('button', { name: /add medication/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Medication name is required')).toBeInTheDocument()
      })
    })

    it('should show error for invalid dosage amount', async () => {
      const user = userEvent.setup()
      
      render(
        <MedicationForm
          isOpen={true}
          patient={mockPatient}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      const dosageInput = screen.getByLabelText(/dosage amount/i)
      await user.clear(dosageInput)
      await user.type(dosageInput, '0')

      await waitFor(() => {
        expect(screen.getByText('Dosage amount must be greater than 0')).toBeInTheDocument()
      })
    })

    it('should show error for invalid frequency times', async () => {
      const user = userEvent.setup()
      
      render(
        <MedicationForm
          isOpen={true}
          patient={mockPatient}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      const frequencyInput = screen.getByLabelText(/times per period/i)
      await user.clear(frequencyInput)
      await user.type(frequencyInput, '0')

      await waitFor(() => {
        expect(screen.getByText('Frequency must be at least 1 time')).toBeInTheDocument()
      })
    })
  })

  describe('Format Validation', () => {
    it('should show error for medication name with invalid characters', async () => {
      const user = userEvent.setup()
      
      render(
        <MedicationForm
          isOpen={true}
          patient={mockPatient}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      const nameInput = screen.getByLabelText(/medication name/i)
      await user.type(nameInput, 'Invalid@Name#')

      await waitFor(() => {
        expect(screen.getByText('Medication name contains invalid characters')).toBeInTheDocument()
      })
    })

    it('should show error for dosage amount with too many decimal places', async () => {
      const user = userEvent.setup()
      
      render(
        <MedicationForm
          isOpen={true}
          patient={mockPatient}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      const dosageInput = screen.getByLabelText(/dosage amount/i)
      await user.clear(dosageInput)
      await user.type(dosageInput, '10.1234')

      await waitFor(() => {
        expect(screen.getByText('Dosage amount can have at most 3 decimal places')).toBeInTheDocument()
      })
    })

    it('should show error for start date outside valid range', async () => {
      const user = userEvent.setup()
      
      render(
        <MedicationForm
          isOpen={true}
          patient={mockPatient}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      const startDateInput = screen.getByLabelText(/start date/i)
      await user.clear(startDateInput)
      await user.type(startDateInput, '2020-01-01')

      await waitFor(() => {
        expect(screen.getByText('Start date must be within one year of today')).toBeInTheDocument()
      })
    })
  })

  describe('Cross-field Validation', () => {
    it('should show error when duration amount is provided without unit', async () => {
      const user = userEvent.setup()
      
      render(
        <MedicationForm
          isOpen={true}
          patient={mockPatient}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Fill required fields
      await user.type(screen.getByLabelText(/medication name/i), 'Test Medication')
      await user.type(screen.getByLabelText(/dosage amount/i), '10')
      
      // Add duration amount without unit
      const durationAmountInput = screen.getByLabelText(/duration amount/i)
      await user.type(durationAmountInput, '30')

      const submitButton = screen.getByRole('button', { name: /add medication/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Both duration amount and unit must be provided together')).toBeInTheDocument()
      })
    })

    it('should show error for duplicate schedule times', async () => {
      const user = userEvent.setup()
      
      render(
        <MedicationForm
          isOpen={true}
          patient={mockPatient}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Fill required fields and set frequency to 2 times daily
      await user.type(screen.getByLabelText(/medication name/i), 'Test Medication')
      await user.type(screen.getByLabelText(/dosage amount/i), '10')
      
      const frequencyInput = screen.getByLabelText(/times per period/i)
      await user.clear(frequencyInput)
      await user.type(frequencyInput, '2')

      // Wait for schedule builder to appear
      await waitFor(() => {
        expect(screen.getByText(/specific times/i)).toBeInTheDocument()
      })

      // Add duplicate times
      const timeInputs = screen.getAllByTestId('time-picker')
      await user.type(timeInputs[0], '08:00')
      
      // Add another time slot
      const addTimeButton = screen.getByRole('button', { name: /add time/i })
      await user.click(addTimeButton)
      
      const newTimeInputs = screen.getAllByTestId('time-picker')
      await user.type(newTimeInputs[1], '08:00')

      const submitButton = screen.getByRole('button', { name: /add medication/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/duplicate schedule times are not allowed/i)).toBeInTheDocument()
      })
    })
  })

  describe('Real-time Validation Warnings', () => {
    it('should show allergy warning when medication matches patient allergy', async () => {
      const user = userEvent.setup()
      
      render(
        <MedicationForm
          isOpen={true}
          patient={mockPatient}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      const nameInput = screen.getByLabelText(/medication name/i)
      await user.type(nameInput, 'Penicillin')

      await waitFor(() => {
        expect(screen.getByText(/ALLERGY ALERT.*Penicillin/i)).toBeInTheDocument()
      })
    })

    it('should show high dosage warning', async () => {
      const user = userEvent.setup()
      
      render(
        <MedicationForm
          isOpen={true}
          patient={mockPatient}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      const dosageInput = screen.getByLabelText(/dosage amount/i)
      await user.clear(dosageInput)
      await user.type(dosageInput, '2000')

      await waitFor(() => {
        expect(screen.getByText(/high dosage detected/i)).toBeInTheDocument()
      })
    })

    it('should show high frequency warning', async () => {
      const user = userEvent.setup()
      
      render(
        <MedicationForm
          isOpen={true}
          patient={mockPatient}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      const frequencyInput = screen.getByLabelText(/times per period/i)
      await user.clear(frequencyInput)
      await user.type(frequencyInput, '8')

      await waitFor(() => {
        expect(screen.getByText(/high frequency dosing.*consider patient compliance/i)).toBeInTheDocument()
      })
    })

    it('should show long-term medication warning', async () => {
      const user = userEvent.setup()
      
      render(
        <MedicationForm
          isOpen={true}
          patient={mockPatient}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      const durationAmountInput = screen.getByLabelText(/duration amount/i)
      const durationUnitSelect = screen.getByLabelText(/duration unit/i)
      
      await user.type(durationAmountInput, '6')
      await user.selectOptions(durationUnitSelect, 'months')

      await waitFor(() => {
        expect(screen.getByText(/long-term medication.*consider monitoring/i)).toBeInTheDocument()
      })
    })
  })

  describe('Success and Error Feedback', () => {
    it('should show success toast when medication is saved successfully', async () => {
      const user = userEvent.setup()
      mockOnSave.mockResolvedValueOnce(undefined)
      
      render(
        <MedicationForm
          isOpen={true}
          patient={mockPatient}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Fill valid form data
      await user.type(screen.getByLabelText(/medication name/i), 'Test Medication')
      await user.type(screen.getByLabelText(/dosage amount/i), '10')

      const submitButton = screen.getByRole('button', { name: /add medication/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByTestId('toast')).toHaveAttribute('data-type', 'success')
        expect(screen.getByText(/medication added successfully/i)).toBeInTheDocument()
      })
    })

    it('should show error toast when save fails', async () => {
      const user = userEvent.setup()
      mockOnSave.mockRejectedValueOnce(new Error('Save failed'))
      
      render(
        <MedicationForm
          isOpen={true}
          patient={mockPatient}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Fill valid form data
      await user.type(screen.getByLabelText(/medication name/i), 'Test Medication')
      await user.type(screen.getByLabelText(/dosage amount/i), '10')

      const submitButton = screen.getByRole('button', { name: /add medication/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByTestId('toast')).toHaveAttribute('data-type', 'error')
        expect(screen.getByText(/failed to save medication/i)).toBeInTheDocument()
      })
    })

    it('should show confirmation dialog for critical warnings', async () => {
      const user = userEvent.setup()
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
      
      render(
        <MedicationForm
          isOpen={true}
          patient={mockPatient}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Fill form with allergy-triggering medication
      await user.type(screen.getByLabelText(/medication name/i), 'Penicillin')
      await user.type(screen.getByLabelText(/dosage amount/i), '10')

      const submitButton = screen.getByRole('button', { name: /add medication/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(confirmSpy).toHaveBeenCalledWith(
          expect.stringContaining('Critical warnings detected')
        )
      })

      expect(mockOnSave).not.toHaveBeenCalled()
      confirmSpy.mockRestore()
    })
  })

  describe('Edge Cases', () => {
    it('should handle invalid time format in schedule', async () => {
      const user = userEvent.setup()
      
      render(
        <MedicationForm
          isOpen={true}
          patient={mockPatient}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Fill required fields and set frequency to 2 times daily
      await user.type(screen.getByLabelText(/medication name/i), 'Test Medication')
      await user.type(screen.getByLabelText(/dosage amount/i), '10')
      
      const frequencyInput = screen.getByLabelText(/times per period/i)
      await user.clear(frequencyInput)
      await user.type(frequencyInput, '2')

      // Wait for schedule builder and add invalid time
      await waitFor(() => {
        expect(screen.getByText(/specific times/i)).toBeInTheDocument()
      })

      const timeInput = screen.getAllByTestId('time-picker')[0]
      await user.type(timeInput, '25:00') // Invalid time

      const submitButton = screen.getByRole('button', { name: /add medication/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/invalid time format detected/i)).toBeInTheDocument()
      })
    })

    it('should handle maximum character limits', async () => {
      const user = userEvent.setup()
      
      render(
        <MedicationForm
          isOpen={true}
          patient={mockPatient}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      const longString = 'a'.repeat(101)
      const nameInput = screen.getByLabelText(/medication name/i)
      await user.type(nameInput, longString)

      await waitFor(() => {
        expect(screen.getByText('Medication name must be less than 100 characters')).toBeInTheDocument()
      })
    })

    it('should handle extreme dosage values', async () => {
      const user = userEvent.setup()
      
      render(
        <MedicationForm
          isOpen={true}
          patient={mockPatient}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      const dosageInput = screen.getByLabelText(/dosage amount/i)
      await user.clear(dosageInput)
      await user.type(dosageInput, '15000')

      await waitFor(() => {
        expect(screen.getByText('Dosage amount seems unusually high')).toBeInTheDocument()
      })
    })

    it('should handle extreme frequency values', async () => {
      const user = userEvent.setup()
      
      render(
        <MedicationForm
          isOpen={true}
          patient={mockPatient}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      const frequencyInput = screen.getByLabelText(/times per period/i)
      await user.clear(frequencyInput)
      await user.type(frequencyInput, '30')

      await waitFor(() => {
        expect(screen.getByText('Frequency cannot exceed 24 times per day')).toBeInTheDocument()
      })
    })
  })

  describe('Form State Management', () => {
    it('should reset form when modal is closed and reopened', async () => {
      const { rerender } = render(
        <MedicationForm
          isOpen={true}
          patient={mockPatient}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      const nameInput = screen.getByLabelText(/medication name/i)
      await userEvent.type(nameInput, 'Test Medication')

      // Close modal
      rerender(
        <MedicationForm
          isOpen={false}
          patient={mockPatient}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Reopen modal
      rerender(
        <MedicationForm
          isOpen={true}
          patient={mockPatient}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      const newNameInput = screen.getByLabelText(/medication name/i)
      expect(newNameInput).toHaveValue('')
    })

    it('should populate form when editing existing medication', () => {
      render(
        <MedicationForm
          isOpen={true}
          medication={mockMedication}
          patient={mockPatient}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      expect(screen.getByDisplayValue('Lisinopril')).toBeInTheDocument()
      expect(screen.getByDisplayValue('10')).toBeInTheDocument()
      expect(screen.getByDisplayValue('mg')).toBeInTheDocument()
    })
  })
})