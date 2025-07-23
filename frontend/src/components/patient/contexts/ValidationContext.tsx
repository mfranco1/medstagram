import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { ValidationRule, ChartEntryType } from '../../../types/patient'

// Validation error interface
export interface ValidationError {
  field: string
  message: string
  severity: 'error' | 'warning' | 'info'
  type: string
}

// Validation state interface
export interface ValidationState {
  errors: ValidationError[]
  warnings: ValidationError[]
  infos: ValidationError[]
  isValid: boolean
  hasWarnings: boolean
  hasInfos: boolean
}

// Validation context interface
export interface ValidationContextType {
  validationState: ValidationState
  validateField: (field: string, value: any, rules: ValidationRule[]) => ValidationError[]
  validateForm: (data: Record<string, any>, rules: ValidationRule[]) => ValidationState
  clearValidation: (field?: string) => void
  addValidationError: (error: ValidationError) => void
  removeValidationError: (field: string) => void
  getFieldErrors: (field: string) => ValidationError[]
  getFieldWarnings: (field: string) => ValidationError[]
  getFieldInfos: (field: string) => ValidationError[]
}

// Create validation context
const ValidationContext = createContext<ValidationContextType | undefined>(undefined)

// Validation provider props
interface ValidationProviderProps {
  children: ReactNode
  templateType?: ChartEntryType
}

// Custom validation functions
const customValidators = {
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  phone: (value: string) => /^\+?[\d\s\-\(\)]+$/.test(value),
  date: (value: string) => !isNaN(Date.parse(value)),
  time: (value: string) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value),
  number: (value: string) => !isNaN(Number(value)),
  positiveNumber: (value: string) => !isNaN(Number(value)) && Number(value) > 0,
  percentage: (value: string) => !isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 100
}

// Validation provider component
export function ValidationProvider({ children, templateType }: ValidationProviderProps) {
  const [validationState, setValidationState] = useState<ValidationState>({
    errors: [],
    warnings: [],
    infos: [],
    isValid: true,
    hasWarnings: false,
    hasInfos: false
  })

  // Validate a single field
  const validateField = useCallback((field: string, value: any, rules: ValidationRule[]): ValidationError[] => {
    const fieldErrors: ValidationError[] = []

    for (const rule of rules) {
      if (rule.field !== field) continue

      let isValid = true
      let errorMessage = rule.message

      switch (rule.type) {
        case 'required':
          isValid = value !== null && value !== undefined && String(value).trim() !== ''
          break

        case 'minLength':
          isValid = String(value).length >= (rule.value || 0)
          break

        case 'maxLength':
          isValid = String(value).length <= (rule.value || Infinity)
          break

        case 'pattern':
          if (rule.value instanceof RegExp) {
            isValid = rule.value.test(String(value))
          } else if (typeof rule.value === 'string') {
            isValid = new RegExp(rule.value).test(String(value))
          }
          break

        case 'custom':
          if (typeof rule.value === 'function') {
            isValid = rule.value(value)
          } else if (typeof rule.value === 'string' && customValidators[rule.value as keyof typeof customValidators]) {
            isValid = customValidators[rule.value as keyof typeof customValidators](String(value))
          }
          break

        default:
          console.warn(`Unknown validation rule type: ${rule.type}`)
          continue
      }

      if (!isValid) {
        fieldErrors.push({
          field,
          message: errorMessage,
          severity: rule.severity,
          type: rule.type
        })
      }
    }

    return fieldErrors
  }, [])

  // Validate entire form
  const validateForm = useCallback((data: Record<string, any>, rules: ValidationRule[]): ValidationState => {
    const allErrors: ValidationError[] = []
    const allWarnings: ValidationError[] = []
    const allInfos: ValidationError[] = []

    // Get all unique fields from rules
    const fields = [...new Set(rules.map(rule => rule.field))]

    // Validate each field
    for (const field of fields) {
      const fieldRules = rules.filter(rule => rule.field === field)
      const fieldErrors = validateField(field, data[field], fieldRules)

      // Categorize errors by severity
      for (const error of fieldErrors) {
        switch (error.severity) {
          case 'error':
            allErrors.push(error)
            break
          case 'warning':
            allWarnings.push(error)
            break
          case 'info':
            allInfos.push(error)
            break
        }
      }
    }

    return {
      errors: allErrors,
      warnings: allWarnings,
      infos: allInfos,
      isValid: allErrors.length === 0,
      hasWarnings: allWarnings.length > 0,
      hasInfos: allInfos.length > 0
    }
  }, [validateField])

  // Clear validation for specific field or all fields
  const clearValidation = useCallback((field?: string) => {
    setValidationState(prev => {
      if (!field) {
        return {
          errors: [],
          warnings: [],
          infos: [],
          isValid: true,
          hasWarnings: false,
          hasInfos: false
        }
      }

      const errors = prev.errors.filter(error => error.field !== field)
      const warnings = prev.warnings.filter(warning => warning.field !== field)
      const infos = prev.infos.filter(info => info.field !== field)

      return {
        errors,
        warnings,
        infos,
        isValid: errors.length === 0,
        hasWarnings: warnings.length > 0,
        hasInfos: infos.length > 0
      }
    })
  }, [])

  // Add validation error
  const addValidationError = useCallback((error: ValidationError) => {
    setValidationState(prev => {
      // Remove existing error for the same field and type
      const filteredErrors = prev.errors.filter(e => !(e.field === error.field && e.type === error.type))
      const filteredWarnings = prev.warnings.filter(w => !(w.field === error.field && w.type === error.type))
      const filteredInfos = prev.infos.filter(i => !(i.field === error.field && i.type === error.type))

      let newErrors = filteredErrors
      let newWarnings = filteredWarnings
      let newInfos = filteredInfos

      // Add new error to appropriate category
      switch (error.severity) {
        case 'error':
          newErrors = [...filteredErrors, error]
          break
        case 'warning':
          newWarnings = [...filteredWarnings, error]
          break
        case 'info':
          newInfos = [...filteredInfos, error]
          break
      }

      return {
        errors: newErrors,
        warnings: newWarnings,
        infos: newInfos,
        isValid: newErrors.length === 0,
        hasWarnings: newWarnings.length > 0,
        hasInfos: newInfos.length > 0
      }
    })
  }, [])

  // Remove validation error for specific field
  const removeValidationError = useCallback((field: string) => {
    clearValidation(field)
  }, [clearValidation])

  // Get errors for specific field
  const getFieldErrors = useCallback((field: string): ValidationError[] => {
    return validationState.errors.filter(error => error.field === field)
  }, [validationState.errors])

  // Get warnings for specific field
  const getFieldWarnings = useCallback((field: string): ValidationError[] => {
    return validationState.warnings.filter(warning => warning.field === field)
  }, [validationState.warnings])

  // Get infos for specific field
  const getFieldInfos = useCallback((field: string): ValidationError[] => {
    return validationState.infos.filter(info => info.field === field)
  }, [validationState.infos])

  const contextValue: ValidationContextType = {
    validationState,
    validateField,
    validateForm,
    clearValidation,
    addValidationError,
    removeValidationError,
    getFieldErrors,
    getFieldWarnings,
    getFieldInfos
  }

  return (
    <ValidationContext.Provider value={contextValue}>
      {children}
    </ValidationContext.Provider>
  )
}

// Hook to use validation context
export function useValidation(): ValidationContextType {
  const context = useContext(ValidationContext)
  if (context === undefined) {
    throw new Error('useValidation must be used within a ValidationProvider')
  }
  return context
}