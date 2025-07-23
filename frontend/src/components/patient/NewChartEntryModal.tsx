import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { ChartEntry } from '../../types/patient'
import { BaseChartEntryModal } from './BaseChartEntryModal'

interface NewChartEntryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (entry: Omit<ChartEntry, 'id' | 'timestamp' | 'createdBy' | 'type' | 'templateVersion' | 'metadata'>) => Promise<void>
}

export function NewChartEntryModal({ isOpen, onClose, onSave }: NewChartEntryModalProps) {
  const [formData, setFormData] = useState({
    chiefComplaint: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  })

  const [collapsedSections, setCollapsedSections] = useState({
    chiefComplaint: false,
    subjective: false,
    objective: false,
    assessment: false,
    plan: false
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleCollapse = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const isFormEmpty = () => {
    return Object.values(formData).every(value => !value.trim())
  }

  const handleSave = async () => {
    await onSave(formData)
    // Reset form data after successful save
    setFormData({
      chiefComplaint: '',
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
    })
  }

  return (
    <BaseChartEntryModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      title="Chart Entry"
      isSaveDisabled={isFormEmpty()}
    >
      <div className="space-y-6">
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

        <div className="border rounded-lg p-4">
          <button 
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 rounded-md"
            onClick={() => toggleCollapse('subjective')}
          >
            <span>Subjective</span>
            {collapsedSections.subjective ? <ChevronRight className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
          </button>
          {!collapsedSections.subjective && (
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-y"
              rows={3}
              placeholder="Enter subjective findings..."
              value={formData.subjective}
              onChange={e => handleInputChange('subjective', e.target.value)}
            />
          )}
        </div>

        <div className="border rounded-lg p-4">
          <button 
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 rounded-md"
            onClick={() => toggleCollapse('objective')}
          >
            <span>Objective</span>
            {collapsedSections.objective ? <ChevronRight className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
          </button>
          {!collapsedSections.objective && (
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-y"
              rows={3}
              placeholder="Enter objective findings..."
              value={formData.objective}
              onChange={e => handleInputChange('objective', e.target.value)}
            />
          )}
        </div>

        <div className="border rounded-lg p-4">
          <button 
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 rounded-md"
            onClick={() => toggleCollapse('assessment')}
          >
            <span>Assessment</span>
            {collapsedSections.assessment ? <ChevronRight className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
          </button>
          {!collapsedSections.assessment && (
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-y"
              rows={3}
              placeholder="Enter assessment..."
              value={formData.assessment}
              onChange={e => handleInputChange('assessment', e.target.value)}
            />
          )}
        </div>

        <div className="border rounded-lg p-4">
          <button 
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 rounded-md"
            onClick={() => toggleCollapse('plan')}
          >
            <span>Plan</span>
            {collapsedSections.plan ? <ChevronRight className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
          </button>
          {!collapsedSections.plan && (
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-y"
              rows={3}
              placeholder="Enter plan..."
              value={formData.plan}
              onChange={e => handleInputChange('plan', e.target.value)}
            />
          )}
        </div>
      </div>
    </BaseChartEntryModal>
  )
} 