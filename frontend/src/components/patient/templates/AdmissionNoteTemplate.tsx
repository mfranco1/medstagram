import { useState, useEffect } from 'react'
import type { TemplateComponentProps } from '../BaseChartEntryModal'

export function AdmissionNoteTemplate({
  initialData,
  patient,
  onSave,
  onCancel,
  isEditing = false,
  onDataChange
}: TemplateComponentProps) {
  const [formData, setFormData] = useState({
    type: 'admission_note' as const,
    templateVersion: '1.0',
    chiefComplaint: initialData?.chiefComplaint || '',
    subjective: initialData?.subjective || '',
    objective: initialData?.objective || '',
    assessment: initialData?.assessment || '',
    plan: initialData?.plan || '',
    structuredData: {
      admissionNote: {
        historyOfPresentIllness: initialData?.structuredData?.admissionNote?.historyOfPresentIllness || '',
        pastMedicalHistory: initialData?.structuredData?.admissionNote?.pastMedicalHistory || '',
        socialHistory: initialData?.structuredData?.admissionNote?.socialHistory || '',
        familyHistory: initialData?.structuredData?.admissionNote?.familyHistory || '',
        reviewOfSystems: initialData?.structuredData?.admissionNote?.reviewOfSystems || {},
        physicalExamination: initialData?.structuredData?.admissionNote?.physicalExamination || {},
        admissionDiagnoses: initialData?.structuredData?.admissionNote?.admissionDiagnoses || [],
        initialOrders: initialData?.structuredData?.admissionNote?.initialOrders || []
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
    const entryData = {
      ...formData,
      metadata: {
        requiredFieldsCompleted: true, // TODO: Use validateRequiredFieldsCompletion(formData, 'admission_note') when implemented
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
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-emerald-800">Admission Note Template</h3>
            <p className="text-sm text-emerald-600">Comprehensive initial patient assessment</p>
          </div>
        </div>
      </div>

      {/* Placeholder content - will be implemented in task 6 */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Admission Note Template</h3>
        <p className="mt-1 text-sm text-gray-500">
          This template will be implemented in task 6. Currently showing placeholder.
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
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Save Admission Note
        </button>
      </div>
    </div>
  )
}