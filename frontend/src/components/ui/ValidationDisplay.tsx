import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import type { ValidationError } from '../patient/contexts/ValidationContext'

interface ValidationDisplayProps {
  errors?: ValidationError[]
  warnings?: ValidationError[]
  infos?: ValidationError[]
  field?: string
  className?: string
  showIcons?: boolean
  dismissible?: boolean
  onDismiss?: (error: ValidationError) => void
}

export function ValidationDisplay({
  errors = [],
  warnings = [],
  infos = [],
  field,
  className = '',
  showIcons = true,
  dismissible = false,
  onDismiss
}: ValidationDisplayProps) {
  // Filter by field if specified
  const filteredErrors = field ? errors.filter(e => e.field === field) : errors
  const filteredWarnings = field ? warnings.filter(w => w.field === field) : warnings
  const filteredInfos = field ? infos.filter(i => i.field === field) : infos

  const allMessages = [
    ...filteredErrors.map(e => ({ ...e, severity: 'error' as const })),
    ...filteredWarnings.map(w => ({ ...w, severity: 'warning' as const })),
    ...filteredInfos.map(i => ({ ...i, severity: 'info' as const }))
  ]

  if (allMessages.length === 0) return null

  const getIcon = (severity: 'error' | 'warning' | 'info') => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-4 h-4" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />
      case 'info':
        return <Info className="w-4 h-4" />
    }
  }

  const getColorClasses = (severity: 'error' | 'warning' | 'info') => {
    switch (severity) {
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          icon: 'text-red-400',
          text: 'text-red-700',
          button: 'text-red-400 hover:text-red-600'
        }
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          icon: 'text-yellow-400',
          text: 'text-yellow-700',
          button: 'text-yellow-400 hover:text-yellow-600'
        }
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-400',
          text: 'text-blue-700',
          button: 'text-blue-400 hover:text-blue-600'
        }
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {allMessages.map((message, index) => {
        const colors = getColorClasses(message.severity)
        
        return (
          <div
            key={`${message.field}-${message.type}-${index}`}
            className={`p-3 border rounded-md ${colors.container}`}
          >
            <div className="flex items-start">
              {showIcons && (
                <div className={`flex-shrink-0 ${colors.icon}`}>
                  {getIcon(message.severity)}
                </div>
              )}
              <div className={`${showIcons ? 'ml-3' : ''} flex-1`}>
                <p className={`text-sm ${colors.text}`}>
                  {message.message}
                </p>
                {message.field && !field && (
                  <p className={`text-xs mt-1 ${colors.text} opacity-75`}>
                    Field: {message.field}
                  </p>
                )}
              </div>
              {dismissible && onDismiss && (
                <button
                  type="button"
                  onClick={() => onDismiss(message)}
                  className={`flex-shrink-0 ml-2 ${colors.button} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 rounded-md`}
                  aria-label="Dismiss validation message"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Inline validation display for form fields
interface InlineValidationProps {
  field: string
  errors?: ValidationError[]
  warnings?: ValidationError[]
  infos?: ValidationError[]
  showWarnings?: boolean
  showInfos?: boolean
  className?: string
}

export function InlineValidation({
  field,
  errors = [],
  warnings = [],
  infos = [],
  showWarnings = true,
  showInfos = false,
  className = ''
}: InlineValidationProps) {
  const fieldErrors = errors.filter(e => e.field === field)
  const fieldWarnings = showWarnings ? warnings.filter(w => w.field === field) : []
  const fieldInfos = showInfos ? infos.filter(i => i.field === field) : []

  const allMessages = [
    ...fieldErrors,
    ...fieldWarnings,
    ...fieldInfos
  ]

  if (allMessages.length === 0) return null

  return (
    <div className={`mt-1 space-y-1 ${className}`}>
      {allMessages.map((message, index) => {
        const colorClass = message.severity === 'error' 
          ? 'text-red-600' 
          : message.severity === 'warning' 
          ? 'text-yellow-600' 
          : 'text-blue-600'
        
        return (
          <p
            key={`${message.field}-${message.type}-${index}`}
            className={`text-xs ${colorClass}`}
          >
            {message.message}
          </p>
        )
      })}
    </div>
  )
}

// Validation summary component
interface ValidationSummaryProps {
  errors: ValidationError[]
  warnings: ValidationError[]
  infos: ValidationError[]
  className?: string
  showCounts?: boolean
}

export function ValidationSummary({
  errors,
  warnings,
  infos,
  className = '',
  showCounts = true
}: ValidationSummaryProps) {
  const hasErrors = errors.length > 0
  const hasWarnings = warnings.length > 0
  const hasInfos = infos.length > 0

  if (!hasErrors && !hasWarnings && !hasInfos) {
    return (
      <div className={`p-3 bg-green-50 border border-green-200 rounded-md ${className}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">All validation checks passed</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {hasErrors && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {showCounts ? `${errors.length} error${errors.length !== 1 ? 's' : ''} found` : 'Errors found'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {hasWarnings && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {showCounts ? `${warnings.length} warning${warnings.length !== 1 ? 's' : ''} found` : 'Warnings found'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {hasInfos && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                {showCounts ? `${infos.length} suggestion${infos.length !== 1 ? 's' : ''} available` : 'Suggestions available'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}