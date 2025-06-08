export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-6 py-4 shadow-sm z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src="/medstagram_small.png" alt="Medstagram Logo" className="w-8 h-8 rounded-lg" />
          <h1 className="text-xl font-semibold text-gray-900">medstagram</h1>
        </div>
      </div>
    </header>
  )
} 