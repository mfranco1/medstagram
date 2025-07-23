import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { ValidationProvider, useValidation } from '../contexts/ValidationContext'
import type { ValidationRule } from '../../../types/patient'

// Test component that uses validation
function TestComponent() {
  const { 
    validationState, 
    validateField, 
    validateForm, 
    clearValidation,
    addValidationError,
    getFieldErrors 
  } = useValidation()

  const testRules: ValidationRule[] = [
    {
      field: 'testField',
      type: 'required',
      message: 'Test field is required',
      severity: 'error'
    },
    {
      field: 'testField',
      type: 'minLength',
      value: 5,
      message: 'Test field must be at least 5 characters',
      severity: 'warning'
    }
  ]

  const handleValidateField = () => {
    const errors = validateField('testField', '', testRules)
    errors.forEach(error => addValidationError(error))
  }

  const handleValidateForm = () => {
    const result = validateForm({ testField: 'abc' }, testRules)
    result.errors.forEach(error => addValidationError(error))
    result.warnings.forEach(warning => addValidationError(warning))
  }

  const handleClearValidation = () => {
    clearValidation()
  }

  return (
    <div>
      <div data-testid="validation-state">
        {JSON.stringify({
          isValid: validationState.isValid,
          hasWarnings: validationState.hasWarnings,
          errorCount: validationState.errors.length,
          warningCount: validationState.warnings.length
        })}
      </div>
      <div data-testid="field-errors">
        {getFieldErrors('testField').map((error, index) => (
          <div key={index}>{error.message}</div>
        ))}
      </div>
      <button onClick={handleValidateField} data-testid="validate-field">
        Validate Field
      </button>
      <button onClick={handleValidateForm} data-testid="validate-form">
        Validate Form
      </button>
      <button onClick={handleClearValidation} data-testid="clear-validation">
        Clear Validation
      </button>
    </div>
  )
}

describe('ValidationContext', () => {
  it('should provide validation functionality', () => {
    render(
      <ValidationProvider>
        <TestComponent />
      </ValidationProvider>
    )

    // Initial state should be valid
    expect(screen.getByTestId('validation-state')).toHaveTextContent(
      JSON.stringify({
        isValid: true,
        hasWarnings: false,
        errorCount: 0,
        warningCount: 0
      })
    )
  })

  it('should validate required field', () => {
    render(
      <ValidationProvider>
        <TestComponent />
      </ValidationProvider>
    )

    // Validate empty required field
    fireEvent.click(screen.getByTestId('validate-field'))

    // Should show error - note that both required and minLength rules will trigger
    expect(screen.getByTestId('field-errors')).toHaveTextContent('Test field is required')
    expect(screen.getByTestId('validation-state')).toHaveTextContent(
      JSON.stringify({
        isValid: false,
        hasWarnings: true,
        errorCount: 1,
        warningCount: 1
      })
    )
  })

  it('should validate form with multiple rules', () => {
    render(
      <ValidationProvider>
        <TestComponent />
      </ValidationProvider>
    )

    // Validate form with short text (triggers warning)
    fireEvent.click(screen.getByTestId('validate-form'))

    // Should show warning for minLength
    expect(screen.getByTestId('validation-state')).toHaveTextContent(
      JSON.stringify({
        isValid: true,
        hasWarnings: true,
        errorCount: 0,
        warningCount: 1
      })
    )
  })

  it('should clear validation', () => {
    render(
      <ValidationProvider>
        <TestComponent />
      </ValidationProvider>
    )

    // Add validation error
    fireEvent.click(screen.getByTestId('validate-field'))
    expect(screen.getByTestId('field-errors')).toHaveTextContent('Test field is required')

    // Clear validation
    fireEvent.click(screen.getByTestId('clear-validation'))
    expect(screen.getByTestId('field-errors')).toBeEmptyDOMElement()
    expect(screen.getByTestId('validation-state')).toHaveTextContent(
      JSON.stringify({
        isValid: true,
        hasWarnings: false,
        errorCount: 0,
        warningCount: 0
      })
    )
  })

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useValidation must be used within a ValidationProvider')

    consoleSpy.mockRestore()
  })
})