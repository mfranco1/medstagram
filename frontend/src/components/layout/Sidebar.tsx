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
      className="flex items-center px-2 py-2 text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group"
    >
      <Icon className="w-6 h-6" />
      {expanded && (
        <span className="ml-3 text-sm font-medium">{label}</span>
      )}
    </a>
  )
} 