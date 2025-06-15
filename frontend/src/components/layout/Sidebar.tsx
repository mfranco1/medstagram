import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Home,
  Users,
  Calendar,
  BarChart,
  Settings,
  LogOut,
  MessageSquare
} from 'lucide-react'
import { mockDoctor } from '../../mocks/doctor'

interface SidebarProps {
  onExpandChange?: (expanded: boolean) => void
}

function UserProfile({ expanded }: { expanded: boolean }) {
  const navigate = useNavigate()
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`
  }

  return (
    <div className="flex items-center px-2 py-4 border-t border-gray-200">
      <button 
        onClick={() => navigate('/profile')}
        className="flex items-center px-2 py-2 text-gray-400 rounded-md group hover:text-gray-600 w-full"
      >
        <div className="flex-shrink-0 w-8 h-8">
          {mockDoctor.profileImage ? (
            <img 
              src={mockDoctor.profileImage} 
              alt={`${mockDoctor.firstName} ${mockDoctor.lastName}`}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-violet-600 text-white text-sm font-medium flex items-center justify-center">
              {getInitials(mockDoctor.firstName, mockDoctor.lastName)}
            </div>
          )}
        </div>
        <div 
          className={`ml-3 overflow-hidden transition-all duration-200 ease-in-out ${
            expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0'
          }`}
        >
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            {mockDoctor.title} {mockDoctor.firstName} {mockDoctor.lastName}
          </span>
          <p className="text-xs text-gray-500 whitespace-nowrap">{mockDoctor.specialization}</p>
        </div>
      </button>
    </div>
  )
}

interface SidebarItemProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  expanded: boolean
  onClick?: () => void
  to?: string
}

function SidebarItem({ icon: Icon, label, expanded, onClick, to }: SidebarItemProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = to ? location.pathname === to : false

  const handleClick = () => {
    if (to) {
      navigate(to)
    }
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center px-2 py-2 rounded-md group transition-colors ${
        isActive 
          ? 'bg-violet-50 text-violet-600' 
          : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
      }`}
    >
      <Icon className="w-6 h-6 flex-shrink-0" />
      {expanded && (
        <span className="ml-3 text-sm font-medium transition-opacity duration-200 ease-in-out">{label}</span>
      )}
    </button>
  )
}

export function Sidebar({ onExpandChange }: SidebarProps) {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()

  const handleMouseEnter = () => {
    setExpanded(true)
    onExpandChange?.(true)
  }

  const handleMouseLeave = () => {
    setExpanded(false)
    onExpandChange?.(false)
  }

  const handleLogout = async () => {
    try {
      // TODO: Implement actual logout logic (e.g., clear tokens, call logout API)
      console.log('Logging out...')
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      // Navigate to login page
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <aside 
      className="fixed top-16 left-0 bottom-0 bg-white border-r border-gray-200 transition-all duration-200 ease-in-out z-40"
      style={{ width: expanded ? '256px' : '64px', minWidth: expanded ? '256px' : '64px', maxWidth: expanded ? '256px' : '64px' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-2 py-4 space-y-1">
          <SidebarItem icon={Home} label="Dashboard" expanded={expanded} to="/dashboard" />
          <SidebarItem icon={Users} label="Patients" expanded={expanded} to="/patients" />
          <SidebarItem icon={Calendar} label="Schedule" expanded={expanded} to="/schedule" />
          <SidebarItem icon={MessageSquare} label="Messages" expanded={expanded} to="/messages" />
          <SidebarItem icon={BarChart} label="Analytics" expanded={expanded} to="/analytics" />
          <SidebarItem icon={Settings} label="Settings" expanded={expanded} to="/settings" />
          <SidebarItem 
            icon={LogOut} 
            label="Logout" 
            expanded={expanded} 
            onClick={handleLogout}
          />
        </nav>
        <div className="flex flex-col border-t border-gray-200">
          <UserProfile expanded={expanded} />
        </div>
      </div>
    </aside>
  )
} 