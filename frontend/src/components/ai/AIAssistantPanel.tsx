import { ChevronLeft, ChevronRight, Plus, Send, Bot } from 'lucide-react'
import { useState } from 'react'

interface MIRAPanelProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

export function MIRAPanel({ collapsed, setCollapsed }: MIRAPanelProps) {
  const [miraInput, setMiraInput] = useState('')
  const [showTooltip, setShowTooltip] = useState(false)
  const handleMiraSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault()
    if (miraInput.trim()) {
      // MIRA interaction logic would go here
      setMiraInput('')
    }
  }

  return (
    <aside
      className={`fixed top-16 right-0 bottom-0 transition-all duration-200 bg-white border-l shadow-sm flex flex-col ${collapsed ? 'w-14 px-2' : 'w-80 px-6'} z-40`}
      style={{ minWidth: collapsed ? '56px' : '320px', maxWidth: collapsed ? '56px' : '320px' }}
    >
      <div className="p-4 border-b border-gray-200 flex-shrink-0 flex items-center justify-between">
        {!collapsed && (
          <h3 className="text-lg font-bold text-violet-600">MIRA</h3>
        )}
        {!collapsed && (
          <button
            className="p-1 hover:bg-gray-100 rounded transition-colors ml-auto"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Collapse MIRA"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>
      {!collapsed ? (
        <>
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">Based on the symptoms, consider asking about:</p>
                <div className="space-y-2">
                  <button className="flex items-center space-x-2 w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                    <Plus className="w-4 h-4 text-violet-600" />
                    <span>Duration of symptoms</span>
                  </button>
                  <button className="flex items-center space-x-2 w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                    <Plus className="w-4 h-4 text-violet-600" />
                    <span>Related conditions</span>
                  </button>
                  <button className="flex items-center space-x-2 w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                    <Plus className="w-4 h-4 text-violet-600" />
                    <span>Previous treatments</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Fixed MIRA Input at bottom */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <form className="flex space-x-2" onSubmit={handleMiraSubmit}>
              <input
                type="text"
                className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                placeholder="Ask MIRA..."
                value={miraInput}
                onChange={e => setMiraInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) handleMiraSubmit(e)
                }}
              />
              <button
                type="submit"
                className="p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center py-4">
          <div 
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div 
              className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center hover:bg-violet-200 transition-colors cursor-pointer"
              onClick={() => setCollapsed(false)}
            >
              <Bot className="w-4 h-4 text-violet-600" />
            </div>
            {showTooltip && (
              <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 w-56 p-3 bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="text-sm font-bold text-violet-600 mb-1">MIRA</div>
                <p className="text-xs text-gray-600">Your intelligent medical assistant that helps with patient documentation, suggests relevant questions, and provides clinical insights.</p>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-white border-r border-b border-gray-200" />
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  )
} 