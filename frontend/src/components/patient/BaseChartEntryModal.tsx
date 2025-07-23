import { X, Save, Loader2 } from 'lucide-react'
import { useState, useRef, useEffect, lazy, Suspense } from 'react'
import type { ReactNode, ComponentType } from 'react'
import type { ChartEntryType, Patient, ChartEntry } from '../../types/patient'
import { ValidationProvider, useValidation } from './contexts/ValidationContext'
import { ValidationSummary } from '../ui/ValidationDisplay'
import { getValidationRules, validateRequiredFieldsCompletion } from '../../config/validationRules'

// Template component interface
export interface TemplateComponentProps {
  initialData?: Partial<ChartEntry>
  patient: Patient
  onSave: (entry: Omit<ChartEntry, 'id' | 'timestamp' | 'createdBy' | 'metadata'>) => Promise<void>
  onCancel: () => void
  isEditing?: boolean
  readOnly?: boolean
  onDataChange?: (hasUnsavedData: boolean) => void
  onValidationChange?: (isValid: boolean, hasWarnings: boolean) => void
}

export interface BaseChartEntryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => Promise<void>
  title: string
  children?: ReactNode
  isSaveDisabled?: boolean
  saveButtonText?: string
  isEditing?: boolean
  // Template-specific props
  templateType?: ChartEntryType
  patient?: Patient
  initialData?: Partial<ChartEntry>
  onTemplateSave?: (entry: Omit<ChartEntry, 'id' | 'timestamp' | 'createdBy' | 'metadata'>) => Promise<void>
}

// Lazy load template components
const ProgressNoteTemplate = lazy(() => import('./templates/ProgressNoteTemplate').then(m => ({ default: m.ProgressNoteTemplate })))
const AdmissionNoteTemplate = lazy(() => import('./templates/AdmissionNoteTemplate').then(m => ({ default: m.AdmissionNoteTemplate })))
const ProcedureNoteTemplate = lazy(() => import('./templates/ProcedureNoteTemplate').then(m => ({ default: m.ProcedureNoteTemplate })))
const DischargeSummaryTemplate = lazy(() => import('./templates/DischargeSummaryTemplate').then(m => ({ default: m.DischargeSummaryTemplate })))
const ConsultationNoteTemplate = lazy(() => import('./templates/ConsultationNoteTemplate').then(m => ({ default: m.ConsultationNoteTemplate })))
const EmergencyNoteTemplate = lazy(() => import('./templates/EmergencyNoteTemplate').then(m => ({ default: m.EmergencyNoteTemplate })))

// Template component registry
const TEMPLATE_COMPONENTS: Record<ChartEntryType, ComponentType<TemplateComponentProps> | null> = {
  progress_note: ProgressNoteTemplate,
  admission_note: AdmissionNoteTemplate,
  procedure_note: ProcedureNoteTemplate,
  discharge_summary: DischargeSummaryTemplate,
  consultation_note: ConsultationNoteTemplate,
  emergency_note: EmergencyNoteTemplate,
  quick_note: null // Uses default children content
}

// Internal modal component with validation
function BaseChartEntryModalInternal({
  isOpen,
  onClose,
  onSave,
  title,
  children,
  isSaveDisabled = false,
  saveButtonText = 'Save Entry',
  isEditing = false,
  templateType,
  patient,
  initialData,
  onTemplateSave
}: BaseChartEntryModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedData, setHasUnsavedData] = useState(false)
  const [templateError, setTemplateError] = useState<string | null>(null)
  const [validationEnabled, setValidationEnabled] = useState(false)
  const [formIsValid, setFormIsValid] = useState(true)
  const [formHasWarnings, setFormHasWarnings] = useState(false)
  
  // Use validation context
  const { validationState, validateForm, clearValidation } = useValidation()

  // Handle modal close with unsaved data warning
  const handleClose = () => {
    if (hasUnsavedData) {
      const confirmClose = window.confirm(
        'You have unsaved changes. Are you sure you want to close without saving?'
      )
      if (!confirmClose) return
    }
    
    // Reset state on close
    setHasUnsavedData(false)
    setTemplateError(null)
    onClose()
  }

  // Handle click outside to close modal with unsaved data warning
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, hasUnsavedData, onClose])

  // Handle escape key to close modal with unsaved data warning
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen, hasUnsavedData, onClose])

  // Reset template error when template type changes
  useEffect(() => {
    setTemplateError(null)
  }, [templateType])

  // Handle data change from template components
  const handleDataChange = (hasData: boolean) => {
    setHasUnsavedData(hasData)
  }

  // Handle validation change from template components
  const handleValidationChange = (isValid: boolean, hasWarnings: boolean) => {
    setFormIsValid(isValid)
    setFormHasWarnings(hasWarnings)
  }

  // Enable validation when user starts interacting
  useEffect(() => {
    if (hasUnsavedData && !validationEnabled) {
      setValidationEnabled(true)
    }
  }, [hasUnsavedData, validationEnabled])

  // Clear validation when modal closes
  useEffect(() => {
    if (!isOpen) {
      clearValidation()
      setValidationEnabled(false)
      setFormIsValid(true)
      setFormHasWarnings(false)
    }
  }, [isOpen, clearValidation])

  const handleSubmit = async () => {
    if (isSaveDisabled || isSaving) return

    // Enable validation if not already enabled
    if (!validationEnabled) {
      setValidationEnabled(true)
    }

    // Check validation state - only block on errors, not warnings
    if (!formIsValid && validationState.errors.length > 0) {
      // Show validation errors but don't prevent saving if only warnings
      return
    }

    try {
      setIsSaving(true)
      await onSave()
      setHasUnsavedData(false)
      clearValidation()
      onClose()
    } catch (error) {
      console.error('Failed to save chart entry:', error)
      // TODO: Show error toast/notification
    } finally {
      setIsSaving(false)
    }
  }

  // Get the appropriate template component
  const getTemplateComponent = () => {
    if (!templateType || !patient || !onTemplateSave) {
      return children
    }

    const TemplateComponent = TEMPLATE_COMPONENTS[templateType]
    
    if (!TemplateComponent) {
      // Fallback to children for quick_note or unsupported types
      return children
    }

    return (
      <Suspense fallback={
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
          <span className="ml-2 text-gray-600">Loading template...</span>
        </div>
      }>
        <TemplateComponent
          initialData={initialData}
          patient={patient}
          onSave={onTemplateSave}
          onCancel={handleClose}
          isEditing={isEditing}
          onDataChange={handleDataChange}
          onValidationChange={handleValidationChange}
        />
      </Suspense>
    )
  }

  // Template error boundary fallback
  const renderTemplateWithErrorBoundary = () => {
    try {
      return getTemplateComponent()
    } catch (error) {
      console.error('Template loading error:', error)
      setTemplateError(`Failed to load ${templateType} template. Using basic template instead.`)
      return children
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef} 
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? `Edit ${title}` : `New ${title}`}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 rounded-md"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {templateError && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">{templateError}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Validation Summary */}
          {validationEnabled && (validationState.errors.length > 0 || validationState.warnings.length > 0) && (
            <div className="mb-4">
              <ValidationSummary
                errors={validationState.errors}
                warnings={validationState.warnings}
                infos={validationState.infos}
                showCounts={true}
              />
            </div>
          )}
          
          {renderTemplateWithErrorBoundary()}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className={`px-4 py-2 text-sm font-medium border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed ${
                validationEnabled && !formIsValid && validationState.errors.length > 0
                  ? 'text-white bg-red-600 hover:bg-red-700'
                  : formHasWarnings
                  ? 'text-white bg-yellow-600 hover:bg-yellow-700'
                  : 'text-white bg-violet-600 hover:bg-violet-700'
              }`}
              disabled={isSaving || isSaveDisabled}
              title={
                validationEnabled && !formIsValid && validationState.errors.length > 0
                  ? 'Please fix validation errors before saving'
                  : formHasWarnings
                  ? 'There are validation warnings - you can still save'
                  : undefined
              }
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {validationEnabled && !formIsValid && validationState.errors.length > 0
                    ? 'Fix Errors to Save'
                    : formHasWarnings
                    ? 'Save with Warnings'
                    : saveButtonText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main component with validation provider
export function BaseChartEntryModal(props: BaseChartEntryModalProps) {
  return (
    <ValidationProvider templateType={props.templateType}>
      <BaseChartEntryModalInternal {...props} />
    </ValidationProvider>
  )
}