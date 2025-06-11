import { useState, useRef, useEffect } from 'react'
import { Filter, ChevronDown, X } from 'lucide-react'
import { Select } from './Select'

export interface FilterOption {
  id: string
  label: string
  value: string
  options: { value: string; label: string }[]
}

interface FiltersProps {
  filters: FilterOption[]
  values: Record<string, string>
  onChange: (id: string, value: string) => void
  onReset: () => void
  title?: string
}

export function Filters({ filters, values, onChange, onReset, title = 'Filter' }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const filtersRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close filters
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const activeFiltersCount = Object.values(values).filter(Boolean).length

  return (
    <div className="relative" ref={filtersRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
      >
        <Filter className="h-4 w-4 mr-2" />
        {title}
        {activeFiltersCount > 0 && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
            {activeFiltersCount}
          </span>
        )}
        <ChevronDown className={`h-4 w-4 ml-2 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filters Dropdown */}
      {isOpen && (
        <div className="absolute z-20 mt-2 w-96 bg-white rounded-md shadow-lg border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={onReset}
                className="inline-flex items-center px-2 py-1 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <X className="h-4 w-4 mr-1" />
                Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {filters.map(filter => (
              <div key={filter.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {filter.label}
                </label>
                <Select
                  value={values[filter.id]}
                  onChange={(value) => onChange(filter.id, value)}
                  options={filter.options}
                  placeholder={`Select ${filter.label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 