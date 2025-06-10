import { type ChangeEvent } from 'react'
import { DatePicker } from './date-picker/DatePicker'

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
  options
}: FormFieldProps) {
  const baseInputClasses = `mt-1 block w-full rounded-md border ${
    error ? 'border-red-300' : 'border-gray-300'
  } px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 ${
    disabled ? 'bg-gray-50 text-gray-500' : ''
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
        />
      )
    }

    if (type === 'textarea') {
      return (
        <textarea
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
        <select
          required={required}
          disabled={disabled}
          value={value}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
          className={baseInputClasses}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    }

    return (
      <input
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
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {renderInput()}
      {error && type !== 'date' && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
} 