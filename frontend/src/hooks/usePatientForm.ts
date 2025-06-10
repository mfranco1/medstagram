import { useState } from 'react'
import type { Patient } from '../pages/PatientsPage'
import { DEFAULT_PATIENT } from '../constants/patient'
import { calculateAge, validateDateOfBirth, validateCaseNumber } from '../utils/patient'

interface UsePatientFormProps {
  initialData?: Partial<Patient>
  existingCaseNumbers?: string[]
  onSubmit: (data: Omit<Patient, 'id'>) => void
}

export function usePatientForm({ initialData, existingCaseNumbers = [], onSubmit }: UsePatientFormProps) {
  const [formData, setFormData] = useState<Omit<Patient, 'id'>>({
    ...DEFAULT_PATIENT,
    ...initialData
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: keyof Omit<Patient, 'id'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }

    // Special handling for date of birth
    if (field === 'dateOfBirth') {
      const error = validateDateOfBirth(value)
      if (error) {
        setErrors(prev => ({ ...prev, dateOfBirth: error }))
      } else {
        const ageDetails = calculateAge(value)
        setFormData(prev => ({ ...prev, age: ageDetails.years }))
      }
    }

    // Special handling for case number
    if (field === 'caseNumber') {
      const error = validateCaseNumber(value, existingCaseNumbers)
      if (error) {
        setErrors(prev => ({ ...prev, caseNumber: error }))
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors: Record<string, string> = {}
    
    // Required fields
    const requiredFields: (keyof Omit<Patient, 'id'>)[] = [
      'name', 'gender', 'diagnosis', 'caseNumber', 'dateAdmitted',
      'location', 'status', 'dateOfBirth', 'civilStatus', 'nationality',
      'religion', 'address', 'philhealth'
    ]
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      }
    })

    // Validate date of birth
    const dateOfBirthError = validateDateOfBirth(formData.dateOfBirth)
    if (dateOfBirthError) {
      newErrors.dateOfBirth = dateOfBirthError
    }

    // Validate case number
    const caseNumberError = validateCaseNumber(formData.caseNumber, existingCaseNumbers)
    if (caseNumberError) {
      newErrors.caseNumber = caseNumberError
    }

    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Format case number before submitting
    const formattedData = {
      ...formData,
      caseNumber: formData.caseNumber.padStart(6, '0')
    }

    onSubmit(formattedData)
  }

  return {
    formData,
    errors,
    handleChange,
    handleSubmit
  }
} 