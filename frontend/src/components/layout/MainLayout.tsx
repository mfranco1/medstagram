import { useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { AIAssistantPanel } from '../ai/AIAssistantPanel'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [aiCollapsed, setAiCollapsed] = useState(false)
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex pt-16">
        <div className="w-16" /> {/* Spacer for fixed sidebar */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>
          <AIAssistantPanel collapsed={aiCollapsed} setCollapsed={setAiCollapsed} />
        </div>
      </div>
      <Sidebar />
    </div>
  )
} 