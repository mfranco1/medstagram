import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { TemplateComponentProps } from '../BaseChartEntryModal'
import { useValidation } from '../contexts/ValidationContext'
import { InlineValidation } from '../../ui/ValidationDisplay'
import { getValidationRules, validateRequiredFieldsCompletion } from '../../../config/validationRules'

export function ProgressNoteTemplate({
  initialData,
  patient,
  onSave,
  onCancel,
  isEditing = false,
  onDataChange,
  onValidationChange
}: TemplateComponentProps) {
  const [formData, setFormData] = useState({
    type: 'progress_note' as const,
    templateVersion: '1.0',
    chiefComplaint: initialData?.chiefComplaint || '',
    subjective: initialData?.subjective || '',
    objective: initialData?.objective || '',
    assessment: initialData?.assessment || '',
    plan: initialData?.plan || '',
    structuredData: initialData?.structuredData || undefined
  })

  const [collapsedSections, setCollapsedSections] = useState({
    chiefComplaint: false,
    subjective: false,
    objective: false,
    assessment: false,
    plan: false
  })

  // Use validation context
  const { validateForm, validationState, clearValidation } = useValidation()

  // Get validation rules for progress notes
  const validationRules = getValidationRules('progress_note')

  // Track if form has unsaved changes and validate
  useEffect(() => {
    const hasData = Object.values(formData).some(value => 
      typeof value === 'string' ? value.trim() : Boolean(value)
    )
    onDataChange?.(hasData)

    // Validate form if there's data
    if (hasData) {
      const validation = validateForm(formData, validationRules)
      onValidationChange?.(validation.isValid, validation.hasWarnings)
    } else {
      clearValidation()
      onValidationChange?.(true, false)
    }
  }, [formData, onDataChange, onValidationChange, validateForm, validationRules, clearValidation])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleCollapse = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const isFormEmpty = () => {
    return Object.values(formData).every(value => 
      typeof value === 'string' ? !value.trim() : !value
    )
  }

  const handleSave = async () => {
    // Update metadata with validation status
    const entryData = {
      ...formData,
      metadata: {
        requiredFieldsCompleted: validateRequiredFieldsCompletion(formData, 'progress_note'),
        lastModified: new Date().toISOString(),
        wordCount: Object.values(formData)
          .filter(value => typeof value === 'string')
          .join(' ')
          .split(/\s+/)
          .filter(word => word.length > 0).length,
        estimatedReadTime: Math.max(1, Math.ceil(
          Object.values(formData)
            .filter(value => typeof value === 'string')
            .join(' ')
            .split(/\s+/)
            .filter(word => word.length > 0).length / 200
        ))
      }
    }
    
    await onSave(entryData)
  }

  return (
    <div className="space-y-6">
      {/* Template Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Progress Note Template</h3>
            <p className="text-sm text-blue-600">Daily progress documentation with SOAP format</p>
          </div>
        </div>
      </div>

      {/* Chief Complaint Section */}
      <div className="border rounded-lg p-4">
        <button 
          className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 rounded-md"
          onClick={() => toggleCollapse('chiefComplaint')}
        >
          <span>Chief Complaint</span>
          {collapsedSections.chiefComplaint ? <ChevronRight className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
        </button>
        {!collapsedSections.chiefComplaint && (
          <div>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-y"
              rows={3}
              placeholder="Enter chief complaint..."
              value={formData.chiefComplaint}
              onChange={e => handleInputChange('chiefComplaint', e.target.value)}
            />
            <InlineValidation
              field="chiefComplaint"
              errors={validationState.errors}
              warnings={validationState.warnings}
              infos={validationState.infos}
            />
          </div>
        )}
      </div>

      {/* Subjective Section */}
      <div className="border rounded-lg p-4">
        <button 
          className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 rounded-md"
          onClick={() => toggleCollapse('subjective')}
        >
          <span>Subjective <span className="text-red-500">*</span></span>
          {collapsedSections.subjective ? <ChevronRight className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
        </button>
        {!collapsedSections.subjective && (
          <div>
            <p className="text-xs text-gray-500 mb-2">Patient's symptoms, concerns, and subjective experience</p>
            <textarea
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-y ${
                validationState.errors.some(e => e.field === 'subjective') 
                  ? 'border-red-300 bg-red-50' 
                  : validationState.warnings.some(w => w.field === 'subjective')
                  ? 'border-yellow-300 bg-yellow-50'
                  : 'border-gray-300'
              }`}
              rows={4}
              placeholder="Enter subjective findings..."
              value={formData.subjective}
              onChange={e => handleInputChange('subjective', e.target.value)}
            />
            <InlineValidation
              field="subjective"
              errors={validationState.errors}
              warnings={validationState.warnings}
              infos={validationState.infos}
            />
          </div>
        )}
      </div>

      {/* Objective Section */}
      <div className="border rounded-lg p-4">
        <button 
          className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 rounded-md"
          onClick={() => toggleCollapse('objective')}
        >
          <span>Objective <span className="text-red-500">*</span></span>
          {collapsedSections.objective ? <ChevronRight className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
        </button>
        {!collapsedSections.objective && (
          <div>
            <p className="text-xs text-gray-500 mb-2">Measurable findings, vital signs, physical exam, lab results</p>
            <textarea
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-y ${
                validationState.errors.some(e => e.field === 'objective') 
                  ? 'border-red-300 bg-red-50' 
                  : validationState.warnings.some(w => w.field === 'objective')
                  ? 'border-yellow-300 bg-yellow-50'
                  : 'border-gray-300'
              }`}
              rows={4}
              placeholder="Enter objective findings..."
              value={formData.objective}
              onChange={e => handleInputChange('objective', e.target.value)}
            />
            <InlineValidation
              field="objective"
              errors={validationState.errors}
              warnings={validationState.warnings}
              infos={validationState.infos}
            />
          </div>
        )}
      </div>

      {/* Assessment Section */}
      <div className="border rounded-lg p-4">
        <button 
          className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 rounded-md"
          onClick={() => toggleCollapse('assessment')}
        >
          <span>Assessment <span className="text-red-500">*</span></span>
          {collapsedSections.assessment ? <ChevronRight className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
        </button>
        {!collapsedSections.assessment && (
          <div>
            <p className="text-xs text-gray-500 mb-2">Clinical impression, diagnosis, and analysis</p>
            <textarea
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-y ${
                validationState.errors.some(e => e.field === 'assessment') 
                  ? 'border-red-300 bg-red-50' 
                  : validationState.warnings.some(w => w.field === 'assessment')
                  ? 'border-yellow-300 bg-yellow-50'
                  : 'border-gray-300'
              }`}
              rows={4}
              placeholder="Enter assessment..."
              value={formData.assessment}
              onChange={e => handleInputChange('assessment', e.target.value)}
            />
            <InlineValidation
              field="assessment"
              errors={validationState.errors}
              warnings={validationState.warnings}
              infos={validationState.infos}
            />
          </div>
        )}
      </div>

      {/* Plan Section */}
      <div className="border rounded-lg p-4">
        <button 
          className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 rounded-md"
          onClick={() => toggleCollapse('plan')}
        >
          <span>Plan <span className="text-red-500">*</span></span>
          {collapsedSections.plan ? <ChevronRight className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
        </button>
        {!collapsedSections.plan && (
          <div>
            <p className="text-xs text-gray-500 mb-2">Treatment plan, medications, procedures, follow-up</p>
            <textarea
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-y ${
                validationState.errors.some(e => e.field === 'plan') 
                  ? 'border-red-300 bg-red-50' 
                  : validationState.warnings.some(w => w.field === 'plan')
                  ? 'border-yellow-300 bg-yellow-50'
                  : 'border-gray-300'
              }`}
              rows={4}
              placeholder="Enter plan..."
              value={formData.plan}
              onChange={e => handleInputChange('plan', e.target.value)}
            />
            <InlineValidation
              field="plan"
              errors={validationState.errors}
              warnings={validationState.warnings}
              infos={validationState.infos}
            />
          </div>
        )}
      </div>

      {/* Save/Cancel Actions - handled by BaseChartEntryModal */}
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className={`px-4 py-2 text-sm font-medium border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            !validationState.isValid && validationState.errors.length > 0
              ? 'text-white bg-red-600 hover:bg-red-700'
              : validationState.hasWarnings
              ? 'text-white bg-yellow-600 hover:bg-yellow-700'
              : 'text-white bg-violet-600 hover:bg-violet-700'
          }`}
          disabled={isFormEmpty() || (!validationState.isValid && validationState.errors.length > 0)}
          title={
            !validationState.isValid && validationState.errors.length > 0
              ? 'Please fix validation errors before saving'
              : validationState.hasWarnings
              ? 'There are validation warnings - you can still save'
              : undefined
          }
        >
          {!validationState.isValid && validationState.errors.length > 0
            ? 'Fix Errors to Save'
            : validationState.hasWarnings
            ? 'Save with Warnings'
            : 'Save Progress Note'}
        </button>
      </div>
    </div>
  )
}