import { useRef, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface DropdownMenuItem {
  label: string
  icon?: ReactNode
  onClick: () => void
  className?: string
}

interface DropdownMenuProps {
  trigger: ReactNode
  items: DropdownMenuItem[]
  align?: 'left' | 'right'
  width?: 'auto' | 'min-w-[240px]'
}

export function DropdownMenu({ trigger, items, align = 'right', width = 'min-w-[240px]' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div className={`absolute ${align}-0 mt-2 ${width} rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10`}>
          <div className="py-1 max-h-[250px] overflow-y-auto">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick()
                  setIsOpen(false)
                }}
                className={`flex items-center w-full px-4 py-2 text-sm whitespace-nowrap ${
                  item.className || 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.icon && <span className="w-4 h-4 mr-2 flex-shrink-0">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 