import { useState, useEffect } from 'react'
import type { TemplateComponentProps } from '../BaseChartEntryModal'

export function EmergencyNoteTemplate({
  initialData,
  patient,
  onSave,
  onCancel,
  isEditing = false,
  onDataChange
}: TemplateComponentProps) {
  const [formData, setFormData] = useState({
    type: 'emergency_note' as const,
    templateVersion: '1.0',
    chiefComplaint: initialData?.chiefComplaint || '',
    subjective: initialData?.subjective || '',
    objective: initialData?.objective || '',
    assessment: initialData?.assessment || '',
    plan: initialData?.plan || '',
    structuredData: {
      emergencyNote: {
        eventType: initialData?.structuredData?.emergencyNote?.eventType || '',
        personnelInvolved: initialData?.structuredData?.emergencyNote?.personnelInvolved || [],
        interventions: initialData?.structuredData?.emergencyNote?.interventions || [],
        medications: initialData?.structuredData?.emergencyNote?.medications || [],
        outcome: initialData?.structuredData?.emergencyNote?.outcome || '',
        addendums: initialData?.structuredData?.emergencyNote?.addendums || []
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
        requiredFieldsCompleted: true, // TODO: Use validateRequiredFieldsCompletion(formData, 'emergency_note') when implemented
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
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Emergency/Code Note Template</h3>
            <p className="text-sm text-red-600">Rapid documentation for emergency situations</p>
          </div>
        </div>
      </div>

      {/* Placeholder content - will be implemented in task 10 */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Emergency/Code Note Template</h3>
        <p className="mt-1 text-sm text-gray-500">
          This template will be implemented in task 10. Currently showing placeholder.
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
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Save Emergency Note
        </button>
      </div>
    </div>
  )
}