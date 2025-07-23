import type { ValidationRule, ChartEntryType } from '../types/patient'

// Common validation rules
const commonRules = {
  required: (field: string, message?: string): ValidationRule => ({
    field,
    type: 'required',
    message: message || `${field} is required`,
    severity: 'error'
  }),
  
  minLength: (field: string, length: number, message?: string): ValidationRule => ({
    field,
    type: 'minLength',
    value: length,
    message: message || `${field} must be at least ${length} characters`,
    severity: 'warning'
  }),
  
  maxLength: (field: string, length: number, message?: string): ValidationRule => ({
    field,
    type: 'maxLength',
    value: length,
    message: message || `${field} must not exceed ${length} characters`,
    severity: 'warning'
  }),
  
  pattern: (field: string, pattern: RegExp, message: string): ValidationRule => ({
    field,
    type: 'pattern',
    value: pattern,
    message,
    severity: 'error'
  }),
  
  custom: (field: string, validator: string | ((value: any) => boolean), message: string, severity: 'error' | 'warning' | 'info' = 'error'): ValidationRule => ({
    field,
    type: 'custom',
    value: validator,
    message,
    severity
  })
}

// Template-specific validation rules
export const TEMPLATE_VALIDATION_RULES: Record<ChartEntryType, ValidationRule[]> = {
  progress_note: [
    commonRules.required('subjective', 'Subjective findings are required for progress notes'),
    commonRules.required('objective', 'Objective findings are required for progress notes'),
    commonRules.required('assessment', 'Assessment is required for progress notes'),
    commonRules.required('plan', 'Plan is required for progress notes'),
    commonRules.minLength('subjective', 10, 'Subjective section should provide adequate detail'),
    commonRules.minLength('objective', 10, 'Objective section should provide adequate detail'),
    commonRules.minLength('assessment', 5, 'Assessment should provide clinical impression'),
    commonRules.minLength('plan', 10, 'Plan should provide clear next steps')
  ],

  admission_note: [
    commonRules.required('subjective', 'History of Present Illness is required'),
    commonRules.required('objective', 'Physical examination findings are required'),
    commonRules.required('assessment', 'Admission diagnoses are required'),
    commonRules.required('plan', 'Initial treatment plan is required'),
    commonRules.minLength('subjective', 20, 'History should be comprehensive for admission'),
    commonRules.minLength('objective', 20, 'Physical exam should be thorough for admission'),
    commonRules.minLength('assessment', 10, 'Admission diagnoses should be clearly stated'),
    commonRules.minLength('plan', 15, 'Initial orders and treatment plan should be detailed'),
    // Additional admission-specific validations
    commonRules.custom('structuredData', (value: any) => {
      if (!value?.admissionNote) return false
      const data = value.admissionNote
      return data.pastMedicalHistory && data.socialHistory && data.familyHistory
    }, 'Past Medical History, Social History, and Family History are required for admission notes', 'error')
  ],

  procedure_note: [
    commonRules.required('subjective', 'Indication for procedure is required'),
    commonRules.required('objective', 'Procedure description and findings are required'),
    commonRules.required('assessment', 'Procedure assessment is required'),
    commonRules.required('plan', 'Post-procedure plan is required'),
    commonRules.minLength('subjective', 10, 'Indication should be clearly documented'),
    commonRules.minLength('objective', 15, 'Procedure details should be comprehensive'),
    // Procedure-specific validations
    commonRules.custom('structuredData', (value: any) => {
      if (!value?.procedureNote) return false
      return value.procedureNote.informedConsent === true
    }, 'Informed consent must be documented', 'error'),
    commonRules.custom('structuredData', (value: any) => {
      if (!value?.procedureNote) return false
      const data = value.procedureNote
      return data.timeStarted && data.timeCompleted
    }, 'Procedure start and end times must be documented', 'error')
  ],

  discharge_summary: [
    commonRules.required('subjective', 'Hospital course summary is required'),
    commonRules.required('objective', 'Discharge condition is required'),
    commonRules.required('assessment', 'Discharge diagnoses are required'),
    commonRules.required('plan', 'Discharge instructions are required'),
    commonRules.minLength('subjective', 20, 'Hospital course should be comprehensive'),
    commonRules.minLength('plan', 20, 'Discharge instructions should be detailed'),
    // Discharge-specific validations
    commonRules.custom('structuredData', (value: any) => {
      if (!value?.dischargeNote) return false
      const data = value.dischargeNote
      return data.dischargeDiagnoses && data.dischargeDiagnoses.length > 0
    }, 'At least one discharge diagnosis is required', 'error'),
    commonRules.custom('structuredData', (value: any) => {
      if (!value?.dischargeNote) return false
      return value.dischargeNote.followUpInstructions
    }, 'Follow-up instructions are required', 'error')
  ],

  consultation_note: [
    commonRules.required('subjective', 'Reason for consultation is required'),
    commonRules.required('objective', 'Focused examination findings are required'),
    commonRules.required('assessment', 'Clinical impression is required'),
    commonRules.required('plan', 'Recommendations are required'),
    commonRules.minLength('subjective', 10, 'Consultation reason should be clear'),
    commonRules.minLength('plan', 15, 'Recommendations should be specific'),
    // Consultation-specific validations
    commonRules.custom('structuredData', (value: any) => {
      if (!value?.consultationNote) return false
      const data = value.consultationNote
      return data.referringPhysician && data.referringPhysician.name
    }, 'Referring physician information is required', 'error')
  ],

  emergency_note: [
    commonRules.required('subjective', 'Emergency presentation is required'),
    commonRules.required('objective', 'Emergency findings are required'),
    commonRules.required('assessment', 'Emergency assessment is required'),
    commonRules.required('plan', 'Emergency interventions are required'),
    commonRules.minLength('subjective', 5, 'Emergency presentation should be documented'),
    commonRules.minLength('objective', 5, 'Emergency findings should be documented'),
    // Emergency-specific validations
    commonRules.custom('structuredData', (value: any) => {
      if (!value?.emergencyNote) return false
      const data = value.emergencyNote
      return data.personnelInvolved && data.personnelInvolved.length > 0
    }, 'Personnel involved must be documented', 'warning'),
    commonRules.custom('structuredData', (value: any) => {
      if (!value?.emergencyNote) return false
      const data = value.emergencyNote
      return data.interventions && data.interventions.length > 0
    }, 'Interventions performed should be documented', 'warning')
  ],

  quick_note: [
    commonRules.required('subjective', 'Note content is required'),
    commonRules.minLength('subjective', 5, 'Note should provide meaningful content')
  ]
}

// Get validation rules for a specific template type
export function getValidationRules(templateType: ChartEntryType): ValidationRule[] {
  return TEMPLATE_VALIDATION_RULES[templateType] || []
}

// Validate required fields completion for metadata
export function validateRequiredFieldsCompletion(
  data: Record<string, any>, 
  templateType: ChartEntryType
): boolean {
  const rules = getValidationRules(templateType)
  const requiredRules = rules.filter(rule => rule.type === 'required' && rule.severity === 'error')
  
  return requiredRules.every(rule => {
    const value = data[rule.field]
    return value !== null && value !== undefined && String(value).trim() !== ''
  })
}

// Get field-specific validation rules
export function getFieldValidationRules(field: string, templateType: ChartEntryType): ValidationRule[] {
  const allRules = getValidationRules(templateType)
  return allRules.filter(rule => rule.field === field)
}

// Check if field is required for template type
export function isFieldRequired(field: string, templateType: ChartEntryType): boolean {
  const fieldRules = getFieldValidationRules(field, templateType)
  return fieldRules.some(rule => rule.type === 'required' && rule.severity === 'error')
}

// Get validation summary for template type
export function getValidationSummary(templateType: ChartEntryType) {
  const rules = getValidationRules(templateType)
  const requiredFields = rules
    .filter(rule => rule.type === 'required' && rule.severity === 'error')
    .map(rule => rule.field)
  
  const warningFields = rules
    .filter(rule => rule.severity === 'warning')
    .map(rule => rule.field)
  
  return {
    requiredFields: [...new Set(requiredFields)],
    warningFields: [...new Set(warningFields)],
    totalRules: rules.length
  }
}