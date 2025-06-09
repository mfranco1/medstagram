import { useState } from 'react'
import {
  Home,
  Users,
  Calendar,
  BarChart,
  Settings
} from 'lucide-react'

interface SidebarProps {
  onExpandChange?: (expanded: boolean) => void
}

// Dummy user data - this will be replaced with real data later
const currentUser = {
  name: 'Dr. Marty Franco',
  role: 'Doctor',
  initials: 'MF'
}

function UserProfile({ expanded }: { expanded: boolean }) {
  return (
    <div className="flex items-center px-2 py-4 border-t border-gray-200">
      <a href="#" className="flex items-center px-2 py-2 text-gray-400 rounded-md group">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-600 text-white text-sm font-medium">
          {currentUser.initials}
        </div>
      </a>
      {expanded && (
        <div className="ml-3">
          <span className="text-sm font-medium text-gray-700">{currentUser.name}</span>
          <p className="text-xs text-gray-500">{currentUser.role}</p>
        </div>
      )}
    </div>
  )
}

export function Sidebar({ onExpandChange }: SidebarProps) {
  const [expanded, setExpanded] = useState(false)

  const handleMouseEnter = () => {
    setExpanded(true)
    onExpandChange?.(true)
  }

  const handleMouseLeave = () => {
    setExpanded(false)
    onExpandChange?.(false)
  }

  return (
    <aside 
      className="fixed top-16 left-0 bottom-0 bg-white border-r border-gray-200 transition-all duration-200 ease-in-out z-40"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`flex flex-col h-full ${expanded ? 'w-64' : 'w-16'}`}>
        <nav className="flex-1 px-2 py-4 space-y-1">
          <SidebarItem icon={Home} label="Dashboard" expanded={expanded} />
          <SidebarItem icon={Users} label="Patients" expanded={expanded} />
          <SidebarItem icon={Calendar} label="Schedule" expanded={expanded} />
          <SidebarItem icon={BarChart} label="Analytics" expanded={expanded} />
          <SidebarItem icon={Settings} label="Settings" expanded={expanded} />
        </nav>
        <UserProfile expanded={expanded} />
      </div>
    </aside>
  )
}

interface SidebarItemProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  expanded: boolean
}

function SidebarItem({ icon: Icon, label, expanded }: SidebarItemProps) {
  return (
    <a
      href="#"
      className="flex items-center px-2 py-2 text-gray-400 rounded-md hover:bg-gray-50 hover:text-gray-600 group"
    >
      <Icon className="w-6 h-6" />
      {expanded && (
        <span className="ml-3 text-sm font-medium">{label}</span>
      )}
    </a>
  )
} 