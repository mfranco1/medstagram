import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  label?: string
  required?: boolean
  disabled?: boolean
  error?: string
  placeholder?: string
  className?: string
}

export function Select({
  value,
  onChange,
  options,
  label,
  required = false,
  disabled = false,
  error,
  placeholder = 'Select an option',
  className = ''
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return

      const currentIndex = options.findIndex(option => option.value === value)
      let newIndex = currentIndex

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          newIndex = Math.min(currentIndex + 1, options.length - 1)
          break
        case 'ArrowUp':
          event.preventDefault()
          newIndex = Math.max(currentIndex - 1, 0)
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (currentIndex >= 0) {
            onChange(options[currentIndex].value)
            setIsOpen(false)
          }
          break
        case 'Escape':
          event.preventDefault()
          setIsOpen(false)
          break
      }

      if (newIndex !== currentIndex) {
        onChange(options[newIndex].value)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, options, value, onChange])

  const selectedOption = options.find(option => option.value === value)

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          className={`
            w-full px-3 py-2
            text-sm
            text-left
            bg-white
            border ${error ? 'border-red-500' : 'border-gray-300'}
            rounded-md
            focus:outline-none focus:ring-2 focus:ring-violet-500
            disabled:bg-gray-50 disabled:text-gray-500
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            ${className}
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex items-center justify-between">
            <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown 
              className={`
                w-4 h-4 text-gray-400
                transition-transform duration-200
                ${isOpen ? 'transform rotate-180' : ''}
              `}
            />
          </div>
        </button>

        {isOpen && (
          <div
            ref={dropdownRef}
            className={`absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 py-1 text-sm ring-1 ring-black ring-opacity-5 focus:outline-none ${
              isOpen
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-1 pointer-events-none'
            } transition-all duration-150 ease-out`}
          >
            <ul
              role="listbox"
              className="py-1"
            >
              {options.map(option => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                  className={`
                    px-3 py-2
                    text-sm
                    cursor-pointer
                    select-none
                    flex items-center justify-between
                    ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-violet-50'}
                    ${option.value === value ? 'bg-violet-50 text-violet-900' : 'text-gray-900'}
                  `}
                  onClick={() => {
                    if (!option.disabled) {
                      onChange(option.value)
                      setIsOpen(false)
                    }
                  }}
                >
                  <span>{option.label}</span>
                  {option.value === value && (
                    <Check className="w-4 h-4 text-violet-600" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
} 