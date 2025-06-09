import { useState } from 'react'
import { MainLayout } from '../components/layout/MainLayout'
import { 
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  Database,
  Shield,
  Save
} from 'lucide-react'

interface SettingSection {
  id: string
  title: string
  description: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const settingSections: SettingSection[] = [
  {
    id: 'profile',
    title: 'Profile Settings',
    description: 'Manage your personal information and preferences',
    icon: User
  },
  {
    id: 'notifications',
    title: 'Notification Preferences',
    description: 'Configure how and when you receive notifications',
    icon: Bell
  },
  {
    id: 'security',
    title: 'Security Settings',
    description: 'Manage your password and security preferences',
    icon: Lock
  },
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Customize the look and feel of the application',
    icon: Palette
  },
  {
    id: 'language',
    title: 'Language & Region',
    description: 'Set your preferred language and regional settings',
    icon: Globe
  },
  {
    id: 'data',
    title: 'Data Management',
    description: 'Manage your data and storage preferences',
    icon: Database
  },
  {
    id: 'privacy',
    title: 'Privacy Settings',
    description: 'Control your privacy and data sharing preferences',
    icon: Shield
  }
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<string>('profile')

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Settings Navigation */}
          <div className="col-span-3">
            <nav className="space-y-1">
              {settingSections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeSection === section.id
                        ? 'bg-violet-50 text-violet-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {section.title}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="col-span-9">
            <div className="bg-white shadow rounded-lg">
              <div className="p-6">
                {settingSections.map((section) => {
                  const Icon = section.icon
                  return (
                    <div
                      key={section.id}
                      className={activeSection === section.id ? 'block' : 'hidden'}
                    >
                      <div className="flex items-center mb-6">
                        <Icon className="w-6 h-6 text-violet-600 mr-3" />
                        <div>
                          <h2 className="text-lg font-medium text-gray-900">{section.title}</h2>
                          <p className="text-sm text-gray-500">{section.description}</p>
                        </div>
                      </div>

                      {/* Placeholder content for each section */}
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-gray-500">
                            This section is under development. The backend APIs for {section.title.toLowerCase()} are not yet available.
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 