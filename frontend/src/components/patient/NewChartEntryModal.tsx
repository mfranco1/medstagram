import { X, ChevronDown, ChevronRight, Save, Loader2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import type { ChartEntry } from '../../types/patient'

interface NewChartEntryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (entry: Omit<ChartEntry, 'id' | 'timestamp' | 'createdBy' | 'type' | 'templateVersion' | 'metadata'>) => Promise<void>
}

export function NewChartEntryModal({ isOpen, onClose, onSave }: NewChartEntryModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [isSaving, setIsSaving] = useState(false)
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleCollapse = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const isFormEmpty = () => {
    return Object.values(formData).every(value => !value.trim())
  }

  const handleSubmit = async () => {
    if (isFormEmpty()) return

    try {
      setIsSaving(true)
      await onSave(formData)
      onClose()
      setFormData({
        chiefComplaint: '',
        subjective: '',
        objective: '',
        assessment: '',
        plan: '',
      })
    } catch (error) {
      console.error('Failed to save chart entry:', error)
      // TODO: Show error toast/notification
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div ref={modalRef} className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">New Chart Entry</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
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
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving || isFormEmpty()}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Entry
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 