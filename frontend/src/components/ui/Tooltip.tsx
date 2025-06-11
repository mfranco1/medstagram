import type { ReactNode } from 'react'

interface TooltipProps {
  children: ReactNode
  content: ReactNode
  position?: 'top' | 'right' | 'bottom' | 'left'
  show?: boolean
}

export function Tooltip({ children, content, position = 'right', show = false }: TooltipProps) {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2'
  }

  const arrowPositionClasses = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45',
    right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 -rotate-45',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45',
    left: 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2 -rotate-45'
  }

  return (
    <div className="relative inline-block">
      {children}
      {show && (
        <div className={`absolute z-50 ${positionClasses[position]}`}>
          <div className="w-56 p-3 bg-white rounded-lg shadow-lg border border-gray-200">
            {content}
            <div className={`absolute w-2 h-2 bg-white border-r border-b border-gray-200 ${arrowPositionClasses[position]}`} />
          </div>
        </div>
      )}
    </div>
  )
} 