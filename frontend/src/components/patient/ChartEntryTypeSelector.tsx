import { useState, useRef, useEffect } from 'react'
import { 
  ClipboardList, 
  UserPlus, 
  Wrench,
  LogOut,
  MessageSquare,
  AlertTriangle,
  PenSquare
} from 'lucide-react'
import type { ChartEntryType } from '../../types/patient'
import { ChartEntryTypeRegistry } from '../../config/chartEntryTypes'

interface ChartEntryTypeSelectorProps {
  onTypeSelect: (type: ChartEntryType) => void
  availableTypes?: ChartEntryType[]
  defaultType?: ChartEntryType
  userRole?: string
  className?: string
}

// Icon mapping for chart entry types
const CHART_ENTRY_ICONS = {
  progress_note: ClipboardList,
  admission_note: UserPlus,
  procedure_note: Wrench,
  discharge_summary: LogOut,
  consultation_note: MessageSquare,
  emergency_note: AlertTriangle,
  quick_note: PenSquare
} as const

// Role-based type filtering
const ROLE_TYPE_ACCESS = {
  doctor: ['progress_note', 'admission_note', 'procedure_note', 'discharge_summary', 'consultation_note', 'emergency_note', 'quick_note'],
  nurse: ['progress_note', 'quick_note', 'emergency_note'],
  specialist: ['consultation_note', 'procedure_note', 'progress_note', 'quick_note'],
  resident: ['progress_note', 'admission_note', 'quick_note'],
  intern: ['progress_note', 'quick_note']
} as const

export function ChartEntryTypeSelector({ 
  onTypeSelect, 
  availableTypes,
  defaultType = 'progress_note',
  userRole = 'doctor',
  className = ''
}: ChartEntryTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<ChartEntryType>(defaultType)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const registry = ChartEntryTypeRegistry.getInstance()

  // Get filtered types based on role and availability
  const getFilteredTypes = (): ChartEntryType[] => {
    const roleTypes = ROLE_TYPE_ACCESS[userRole as keyof typeof ROLE_TYPE_ACCESS] || ROLE_TYPE_ACCESS.doctor
    const baseTypes = availableTypes || registry.getAvailableTypes()
    return baseTypes.filter(type => roleTypes.includes(type))
  }

  const filteredTypes = getFilteredTypes()

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault()
          setFocusedIndex(prev => (prev + 1) % filteredTypes.length)
          break
        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault()
          setFocusedIndex(prev => (prev - 1 + filteredTypes.length) % filteredTypes.length)
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          const focusedType = filteredTypes[focusedIndex]
          setSelectedType(focusedType)
          onTypeSelect(focusedType)
          break
        case 'Home':
          event.preventDefault()
          setFocusedIndex(0)
          break
        case 'End':
          event.preventDefault()
          setFocusedIndex(filteredTypes.length - 1)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [filteredTypes, focusedIndex, onTypeSelect])

  const handleTypeSelect = (type: ChartEntryType) => {
    setSelectedType(type)
    onTypeSelect(type)
  }

  const handleMouseEnter = (index: number) => {
    setFocusedIndex(index)
  }

  return (
    <div 
      ref={containerRef}
      className={`chart-entry-type-selector ${className}`}
      role="radiogroup"
      aria-label="Select chart entry type"
    >
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Select Entry Type</h3>
        <p className="text-sm text-gray-600">Choose the appropriate template for your documentation</p>
      </div>

      {/* Grid layout for larger screens, stack for mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredTypes.map((type, index) => {
          const config = registry.getConfig(type)
          const IconComponent = CHART_ENTRY_ICONS[type]
          const isSelected = selectedType === type
          const isFocused = focusedIndex === index

          return (
            <button
              key={type}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-describedby={`${type}-description`}
              tabIndex={isFocused ? 0 : -1}
              className={`
                relative p-4 rounded-lg border-2 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500
                ${isSelected 
                  ? 'border-violet-500 bg-violet-50 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }
                ${isFocused ? 'ring-2 ring-violet-500 ring-offset-2' : ''}
              `}
              onClick={() => handleTypeSelect(type)}
              onMouseEnter={() => handleMouseEnter(index)}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-violet-500 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className="flex items-center mb-3">
                <div 
                  className={`
                    p-2 rounded-lg mr-3 transition-colors
                    ${isSelected ? 'bg-violet-100' : 'bg-gray-100'}
                  `}
                  style={{ 
                    backgroundColor: isSelected ? `${config.color}20` : undefined 
                  }}
                >
                  <IconComponent 
                    className={`w-5 h-5 ${isSelected ? 'text-violet-600' : 'text-gray-600'}`}
                    style={{ 
                      color: isSelected ? config.color : undefined 
                    }}
                  />
                </div>
              </div>

              {/* Content */}
              <div>
                <h4 className={`font-medium text-sm mb-1 ${isSelected ? 'text-violet-900' : 'text-gray-900'}`}>
                  {config.displayName}
                </h4>
                <p 
                  id={`${type}-description`}
                  className={`text-xs leading-relaxed ${isSelected ? 'text-violet-700' : 'text-gray-600'}`}
                >
                  {config.description}
                </p>
              </div>

              {/* Hover/focus indicator */}
              <div 
                className={`
                  absolute inset-0 rounded-lg transition-opacity pointer-events-none
                  ${isFocused && !isSelected ? 'bg-gray-50 opacity-50' : 'opacity-0'}
                `}
              />
            </button>
          )
        })}
      </div>

      {/* Selected type summary */}
      {selectedType && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${registry.getConfig(selectedType).color}20` }}
            >
              {(() => {
                const IconComponent = CHART_ENTRY_ICONS[selectedType]
                return (
                  <IconComponent 
                    className="w-5 h-5"
                    style={{ color: registry.getConfig(selectedType).color }}
                  />
                )
              })()}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">
                Selected: {registry.getConfig(selectedType).displayName}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {registry.getConfig(selectedType).description}
              </p>
              
              {/* Required fields indicator */}
              <div className="text-xs text-gray-500">
                <span className="font-medium">Required fields:</span>{' '}
                {registry.getRequiredFields(selectedType).length > 0 
                  ? `${registry.getRequiredFields(selectedType).length} fields`
                  : 'None'
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accessibility instructions */}
      <div className="sr-only" aria-live="polite">
        Use arrow keys to navigate between entry types. Press Enter or Space to select.
        Currently focused: {filteredTypes[focusedIndex] ? registry.getConfig(filteredTypes[focusedIndex]).displayName : ''}
      </div>
    </div>
  )
}