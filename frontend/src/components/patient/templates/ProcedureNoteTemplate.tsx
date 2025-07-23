import { useState, useEffect } from 'react'
import type { TemplateComponentProps } from '../BaseChartEntryModal'

export function ProcedureNoteTemplate({
  initialData,
  patient,
  onSave,
  onCancel,
  isEditing = false,
  onDataChange
}: TemplateComponentProps) {
  const [formData, setFormData] = useState({
    type: 'procedure_note' as const,
    templateVersion: '1.0',
    chiefComplaint: initialData?.chiefComplaint || '',
    subjective: initialData?.subjective || '',
    objective: initialData?.objective || '',
    assessment: initialData?.assessment || '',
    plan: initialData?.plan || '',
    structuredData: {
      procedureNote: {
        indication: initialData?.structuredData?.procedureNote?.indication || '',
        procedureName: initialData?.structuredData?.procedureNote?.procedureName || '',
        procedureDescription: initialData?.structuredData?.procedureNote?.procedureDescription || '',
        findings: initialData?.structuredData?.procedureNote?.findings || '',
        complications: initialData?.structuredData?.procedureNote?.complications || '',
        postProcedurePlan: initialData?.structuredData?.procedureNote?.postProcedurePlan || '',
        informedConsent: initialData?.structuredData?.procedureNote?.informedConsent || false,
        timeStarted: initialData?.structuredData?.procedureNote?.timeStarted || '',
        timeCompleted: initialData?.structuredData?.procedureNote?.timeCompleted || '',
        assistants: initialData?.structuredData?.procedureNote?.assistants || [],
        suggestedCptCodes: initialData?.structuredData?.procedureNote?.suggestedCptCodes || []
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
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">Procedure Note Template</h3>
            <p className="text-sm text-amber-600">Documentation for medical procedures and interventions</p>
          </div>
        </div>
      </div>

      {/* Placeholder content - will be implemented in task 7 */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Procedure Note Template</h3>
        <p className="mt-1 text-sm text-gray-500">
          This template will be implemented in task 7. Currently showing placeholder.
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
          className="px-4 py-2 text-sm font-medium text-white bg-amber-600 border border-transparent rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        >
          Save Procedure Note
        </button>
      </div>
    </div>
  )
}