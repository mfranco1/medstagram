import { Clock, Save, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface MedicalEntryFormProps {
  formData: {
    chiefComplaint: string
    subjective: string
    objective: string
    assessment: string
    plan: string
  }
  setFormData: (data: any) => void
}

export function MedicalEntryForm({ formData, setFormData }: MedicalEntryFormProps) {
  const [collapsedSections, setCollapsedSections] = useState<{
    chiefComplaint: boolean
    subjective: boolean
    objective: boolean
    assessment: boolean
    plan: boolean
  }>({ 
    chiefComplaint: false,
    subjective: false,
    objective: false,
    assessment: false,
    plan: false
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const toggleCollapse = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-8">
          <button className="pb-2 text-sm font-medium border-b-2 border-violet-600 text-violet-600">
            New Entry
          </button>
          <button className="pb-2 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700">
            History
          </button>
        </div>
      </div>
      <div className="space-y-6">
        <div className="border rounded-lg p-4">
          <button 
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-2 focus:outline-none"
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
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-2 focus:outline-none"
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
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-2 focus:outline-none"
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
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-2 focus:outline-none"
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
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-2 focus:outline-none"
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
        <div className="flex justify-end items-center space-x-4 pt-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Last saved 2m ago</span>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors">
            <Save className="w-4 h-4" />
            <span>Save Note</span>
          </button>
        </div>
      </div>
    </div>
  )
} 