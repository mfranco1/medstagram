import { Clock, Save } from 'lucide-react'

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
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-8">
          <button className="pb-2 text-sm font-medium border-b-2 border-violet-600 text-violet-600">
            New Entry
          </button>
          <button className="pb-2 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700">
            History
          </button>
        </div>
        <div className="flex items-center space-x-4">
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
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chief Complaint
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none"
            rows={3}
            placeholder="Enter chief complaint..."
            value={formData.chiefComplaint}
            onChange={e => handleInputChange('chiefComplaint', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subjective
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none"
            rows={3}
            placeholder="Enter subjective findings..."
            value={formData.subjective}
            onChange={e => handleInputChange('subjective', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Objective
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none"
            rows={3}
            placeholder="Enter objective findings..."
            value={formData.objective}
            onChange={e => handleInputChange('objective', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assessment
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none"
            rows={3}
            placeholder="Enter assessment..."
            value={formData.assessment}
            onChange={e => handleInputChange('assessment', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plan
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none"
            rows={3}
            placeholder="Enter plan..."
            value={formData.plan}
            onChange={e => handleInputChange('plan', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
} 