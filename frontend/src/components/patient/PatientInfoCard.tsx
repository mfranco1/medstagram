import { Calendar, User, MapPin, Church, Home, Phone } from 'lucide-react'

interface PatientInfoCardProps {
  activeTab: 'general' | 'medical'
  setActiveTab: (tab: 'general' | 'medical') => void
}

export function PatientInfoCard({ activeTab, setActiveTab }: PatientInfoCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold text-violet-600">RA</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Restituto Arapipap</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Male • 45 years • CN: 123456</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                Active Admission
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex space-x-8 mb-6">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'general'
              ? 'border-violet-600 text-violet-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          General Data
        </button>
        <button
          onClick={() => setActiveTab('medical')}
          className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'medical'
              ? 'border-violet-600 text-violet-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Medical Info
        </button>
      </div>
      {/* Patient Info Grid */}
      <div className="grid grid-cols-3 gap-x-8 gap-y-4 text-sm">
        <div className="flex items-center space-x-3">
          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-gray-500">Date of Birth</span>
            <p className="font-medium text-gray-900">January 1, 1980</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-gray-500">Civil Status</span>
            <p className="font-medium text-gray-900">Married</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-gray-500">Nationality</span>
            <p className="font-medium text-gray-900">Filipino</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Church className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-gray-500">Religion</span>
            <p className="font-medium text-gray-900">Roman Catholic</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Home className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-gray-500">Address</span>
            <p className="font-medium text-gray-900">123 P Faura St., Manila City</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-gray-500">Philhealth</span>
            <p className="font-medium text-gray-900">12-345678901-2</p>
          </div>
        </div>
      </div>
    </div>
  )
} 