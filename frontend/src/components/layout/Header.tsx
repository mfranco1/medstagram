import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

export function Header() {
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-6 py-4 shadow-sm z-50">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-4"
        >
          <img src="/medstagram_small.png" alt="Medstagram Logo" className="w-8 h-8 rounded-lg" />
          <h1 className="text-xl font-semibold text-gray-900">medstagram</h1>
        </button>

        <div className="flex-1 max-w-sm mx-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </header>
  )
} 