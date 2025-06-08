import { useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { AIAssistantPanel } from '../ai/AIAssistantPanel'
import { Footer } from './Footer'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [aiCollapsed, setAiCollapsed] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1 pt-16">
        <div className={sidebarExpanded ? 'w-64' : 'w-16'} /> {/* Spacer for fixed sidebar */}
        <div className="flex-1 flex">
          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>
          <div className={aiCollapsed ? 'w-14' : 'w-80'} /> {/* Spacer for fixed AI panel */}
        </div>
      </div>
      <Sidebar onExpandChange={setSidebarExpanded} />
      <AIAssistantPanel collapsed={aiCollapsed} setCollapsed={setAiCollapsed} />
      <Footer />
    </div>
  )
} 