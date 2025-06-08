import { User, Calendar, MapPin } from 'lucide-react'
import { useState } from 'react'

const sidebarItems = [
  {
    icon: <User className="w-5 h-5 text-violet-600" />, label: 'Profile', active: true, bg: 'bg-violet-100',
  },
  {
    icon: <Calendar className="w-5 h-5 text-gray-400" />, label: 'Calendar', active: false, bg: '',
  },
  {
    icon: <MapPin className="w-5 h-5 text-gray-400" />, label: 'Location', active: false, bg: '',
  },
]

export function Sidebar() {
  const [expanded, setExpanded] = useState(false)
  return (
    <aside
      className={`group flex flex-col items-center bg-white border-r border-gray-200 shadow-lg py-6 h-screen transition-all duration-200 ${expanded ? 'w-56' : 'w-16'} z-20`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="flex flex-col space-y-6 mt-2 w-full items-center">
        {sidebarItems.map((item, idx) => (
          <button
            key={item.label}
            className={`flex items-center rounded-lg transition-colors ${item.bg} ${!item.active ? 'hover:bg-gray-100 cursor-pointer' : ''} ${expanded ? 'w-full px-4 justify-start' : 'w-8 justify-center'}`}
          >
            {item.icon}
            {expanded && (
              <span className="ml-3 text-base font-medium text-gray-800 transition-opacity duration-200 whitespace-nowrap">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </div>
    </aside>
  )
} 