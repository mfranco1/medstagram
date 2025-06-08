import { ChevronLeft, ChevronRight, Plus, Send, Bot } from 'lucide-react'
import { useState } from 'react'

interface AIAssistantPanelProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

export function AIAssistantPanel({ collapsed, setCollapsed }: AIAssistantPanelProps) {
  const [aiInput, setAiInput] = useState('')
  const handleAiSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault()
    if (aiInput.trim()) {
      // AI interaction logic would go here
      setAiInput('')
    }
  }

  return (
    <aside
      className={`relative transition-all duration-200 bg-white border-l shadow-sm flex flex-col ${collapsed ? 'w-14 px-2' : 'w-80 px-6'}`}
      style={{ minWidth: collapsed ? '56px' : '320px', maxWidth: collapsed ? '56px' : '320px' }}
    >
      <div className="p-4 border-b border-gray-200 flex-shrink-0 flex items-center justify-between">
        {!collapsed && (
          <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
        )}
        <button
          className="p-1 hover:bg-gray-100 rounded transition-colors ml-auto"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand AI Assistant' : 'Collapse AI Assistant'}
        >
          {collapsed ? (
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>
      {!collapsed ? (
        <>
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">AI Suggestions</h4>
                <p className="text-sm text-gray-600 mb-4">Based on the symptoms, consider asking about:</p>
                <div className="space-y-2">
                  <button className="flex items-center space-x-2 w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                    <Plus className="w-4 h-4 text-gray-400" />
                    <span>Duration of symptoms</span>
                  </button>
                  <button className="flex items-center space-x-2 w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                    <Plus className="w-4 h-4 text-gray-400" />
                    <span>Related conditions</span>
                  </button>
                  <button className="flex items-center space-x-2 w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                    <Plus className="w-4 h-4 text-gray-400" />
                    <span>Previous treatments</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Fixed AI Input at bottom */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <form className="flex space-x-2" onSubmit={handleAiSubmit}>
              <input
                type="text"
                className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                placeholder="Ask AI assistant..."
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) handleAiSubmit(e)
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
          <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-violet-600" />
          </div>
        </div>
      )}
    </aside>
  )
} 