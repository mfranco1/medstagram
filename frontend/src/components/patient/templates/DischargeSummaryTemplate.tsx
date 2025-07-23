import { useState, useEffect } from 'react'
import type { TemplateComponentProps } from '../BaseChartEntryModal'

export function DischargeSummaryTemplate({
  initialData,
  patient,
  onSave,
  onCancel,
  isEditing = false,
  onDataChange
}: TemplateComponentProps) {
  const [formData, setFormData] = useState({
    type: 'discharge_summary' as const,
    templateVersion: '1.0',
    chiefComplaint: initialData?.chiefComplaint || '',
    subjective: initialData?.subjective || '',
    objective: initialData?.objective || '',
    assessment: initialData?.assessment || '',
    plan: initialData?.plan || '',
    structuredData: {
      dischargeNote: {
        hospitalCourse: initialData?.structuredData?.dischargeNote?.hospitalCourse || '',
        dischargeDiagnoses: initialData?.structuredData?.dischargeNote?.dischargeDiagnoses || [],
        dischargeMedications: initialData?.structuredData?.dischargeNote?.dischargeMedications || {
          continued: [],
          newlyStarted: [],
          discontinued: []
        },
        followUpInstructions: initialData?.structuredData?.dischargeNote?.followUpInstructions || '',
        patientEducation: initialData?.structuredData?.dischargeNote?.patientEducation || [],
        dischargeDisposition: initialData?.structuredData?.dischargeNote?.dischargeDisposition || '',
        functionalStatus: initialData?.structuredData?.dischargeNote?.functionalStatus || ''
      }
    }
  })

  // Track if form has unsaved changes
  useEffect(() => {
    const hasData = Object.values(formData).some(value => 
      typeof value === 'string' ? value.trim() : Boolean(value)
    )
    onDataChange?.(hasData)
  }, [formData, onDataChange])

  const handleSave = async () => {
    await onSave(formData)
  }

  return (
    <div className="space-y-6">
      {/* Template Header */}
      <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-violet-800">Discharge Summary Template</h3>
            <p className="text-sm text-violet-600">Comprehensive summary for patient discharge</p>
          </div>
        </div>
      </div>

      {/* Placeholder content - will be implemented in task 8 */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Discharge Summary Template</h3>
        <p className="mt-1 text-sm text-gray-500">
          This template will be implemented in task 8. Currently showing placeholder.
        </p>
      </div>

      {/* Save/Cancel Actions */}
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
          className="px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        >
          Save Discharge Summary
        </button>
      </div>
    </div>
  )
}