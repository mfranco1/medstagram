import { useState, useEffect } from 'react'
import type { TemplateComponentProps } from '../BaseChartEntryModal'

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
    plan: initialData?.plan || ''
  })

  useEffect(() => {
    const hasData = Object.values(formData).some(value => typeof value === 'string' ? value.trim() : Boolean(value))
    onDataChange?.(hasData)
  }, [formData, onDataChange])

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    await onSave(formData)
  }

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Chief Complaint</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-y"
          rows={2}
          placeholder="Enter chief complaint..."
          value={formData.chiefComplaint}
          onChange={e => handleInputChange('chiefComplaint', e.target.value)}
        />
      </div>
      <div className="border rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Subjective</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-y"
          rows={3}
          placeholder="Enter subjective findings..."
          value={formData.subjective}
          onChange={e => handleInputChange('subjective', e.target.value)}
        />
      </div>
      <div className="border rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Objective</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-y"
          rows={3}
          placeholder="Enter objective findings..."
          value={formData.objective}
          onChange={e => handleInputChange('objective', e.target.value)}
        />
      </div>
      <div className="border rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Assessment</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-y"
          rows={3}
          placeholder="Enter assessment..."
          value={formData.assessment}
          onChange={e => handleInputChange('assessment', e.target.value)}
        />
      </div>
      <div className="border rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-y"
          rows={3}
          placeholder="Enter plan..."
          value={formData.plan}
          onChange={e => handleInputChange('plan', e.target.value)}
        />
      </div>
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
          Save Progress Note
        </button>
      </div>
    </div>
  )
}