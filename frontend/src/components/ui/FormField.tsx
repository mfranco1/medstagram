import { type ChangeEvent, useId } from 'react'
import { DatePicker } from './date-picker/DatePicker'
import { Select } from './Select'

interface FormFieldProps {
  label: string
  type?: 'text' | 'date' | 'number' | 'textarea'
  value: string | number
  onChange: (value: string) => void
  required?: boolean
  disabled?: boolean
  error?: string
  placeholder?: string
  className?: string
  rows?: number
  options?: { value: string; label: string }[]
  maxDate?: string
  id?: string
}

export function FormField({
  label,
  type = 'text',
  value,
  onChange,
  required,
  disabled,
  error,
  placeholder,
  className = '',
  rows,
  options,
  maxDate,
  id: providedId
}: FormFieldProps) {
  const generatedId = useId()
  const fieldId = providedId || generatedId
  
  const baseInputClasses = `mt-1 block w-full rounded-lg border transition-colors ${
    error ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-gray-300 focus:border-violet-400'
  } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-20 ${
    disabled ? 'bg-gray-50 text-gray-500' : 'bg-white'
  } ${className}`

  const renderInput = () => {
    if (type === 'date') {
      return (
        <DatePicker
          value={value as string}
          onChange={onChange}
          required={required}
          disabled={disabled}
          error={error}
          maxDate={maxDate}
        />
      )
    }

    if (type === 'textarea') {
      return (
        <textarea
          id={fieldId}
          required={required}
          disabled={disabled}
          value={value}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows || 3}
          className={baseInputClasses}
        />
      )
    }

    if (options) {
      return (
        <Select
          id={fieldId}
          value={value as string}
          onChange={onChange}
          options={options}
          required={required}
          disabled={disabled}
          error={error}
          placeholder={placeholder}
        />
      )
    }

    return (
      <input
        id={fieldId}
        type={type}
        required={required}
        disabled={disabled}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        className={baseInputClasses}
      />
    )
  }

  return (
    <div>
      <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {error && type !== 'date' && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs">!</span>
          {error}
        </p>
      )}
    </div>
  )
} 