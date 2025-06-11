import type { PatientTab } from '../../types/patient'

interface PatientTabNavigationProps {
  activeTab: PatientTab
  setActiveTab: (tab: PatientTab) => void
}

const TABS: { id: PatientTab; label: string }[] = [
  { id: 'general', label: 'General Data' },
  { id: 'medical', label: 'Medical Info' },
  { id: 'case-summary', label: 'Case Summary' },
  { id: 'chart', label: 'Chart' },
  { id: 'diagnostics', label: 'Diagnostics' },
  { id: 'therapeutics', label: 'Therapeutics' },
  { id: 'orders', label: 'Orders' }
]

export function PatientTabNavigation({ activeTab, setActiveTab }: PatientTabNavigationProps) {
  return (
    <div className="px-4 pt-4">
      <div className="flex space-x-8 border-b border-gray-200">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === id
                ? 'border-violet-600 text-violet-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
} 