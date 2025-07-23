import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { TemplateComponentProps } from '../BaseChartEntryModal'
import type { ChartEntry } from '../../../types/patient'

export function ProgressNoteTemplate({
  initialData,
  patient,
  onSave,
  onCancel,
  isEditing = false,
  onDataChange
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

  // Track if form has unsaved changes
  useEffect(() => {
    const hasData = Object.values(formData).some(value => 
      typeof value === 'string' ? value.trim() : Boolean(value)
    )
    onDataChange?.(hasData)
  }, [formData, onDataChange])

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
    await onSave(formData)
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
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-y"
            rows={3}
            placeholder="Enter chief complaint..."
            value={formData.chiefComplaint}
            onChange={e => handleInputChange('chiefComplaint', e.target.value)}
          />
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-y"
              rows={4}
              placeholder="Enter subjective findings..."
              value={formData.subjective}
              onChange={e => handleInputChange('subjective', e.target.value)}
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-y"
              rows={4}
              placeholder="Enter objective findings..."
              value={formData.objective}
              onChange={e => handleInputChange('objective', e.target.value)}
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-y"
              rows={4}
              placeholder="Enter assessment..."
              value={formData.assessment}
              onChange={e => handleInputChange('assessment', e.target.value)}
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-y"
              rows={4}
              placeholder="Enter plan..."
              value={formData.plan}
              onChange={e => handleInputChange('plan', e.target.value)}
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
          className="px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isFormEmpty()}
        >
          Save Progress Note
        </button>
      </div>
    </div>
  )
}