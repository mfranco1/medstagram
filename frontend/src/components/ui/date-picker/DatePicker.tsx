import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  format,
  parse,
  isValid,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  getYear,
  setYear,
  setMonth,
  startOfWeek,
  endOfWeek,
  addDays
} from 'date-fns'

interface DatePickerProps {
  value: string
  onChange: (date: string) => void
  label?: string
  required?: boolean
  disabled?: boolean
  minDate?: string
  maxDate?: string
  error?: string
}

export function DatePicker({
  value,
  onChange,
  label,
  required = false,
  disabled = false,
  minDate,
  maxDate,
  error
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isMonthOpen, setIsMonthOpen] = useState(false)
  const [isYearOpen, setIsYearOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Parse the current value
  const selectedDate = value ? parse(value, 'yyyy-MM-dd', new Date()) : null
  const isValidDate = selectedDate && isValid(selectedDate)

  // Format the display value
  const displayValue = isValidDate ? format(selectedDate, 'MMM d, yyyy') : ''

  // Generate years (current year ± 100 years)
  const currentYear = getYear(new Date())
  const years = Array.from({ length: 201 }, (_, i) => currentYear - 100 + i)

  // Find the index of the current year for scrolling
  const currentYearIndex = years.indexOf(currentYear)

  // Generate months
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // Handle outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsMonthOpen(false)
        setIsYearOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  })

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    onChange(format(date, 'yyyy-MM-dd'))
    setIsOpen(false)
  }

  // Handle month navigation
  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))
  }

  // Handle month selection
  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth(prev => setMonth(prev, monthIndex))
    setIsMonthOpen(false)
  }

  // Handle year selection
  const handleYearSelect = (year: number) => {
    setCurrentMonth(prev => setYear(prev, year))
    setIsYearOpen(false)
  }

  // Handle today button
  const handleToday = () => {
    const today = new Date()
    onChange(format(today, 'yyyy-MM-dd'))
    setCurrentMonth(today)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          readOnly
          className={`
            w-full px-3 py-2
            border ${error ? 'border-red-500' : 'border-gray-300'}
            rounded-md
            focus:outline-none focus:ring-2 focus:ring-violet-500
            disabled:bg-gray-50 disabled:text-gray-500
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
          placeholder="Select date"
          onClick={() => !disabled && setIsOpen(true)}
          disabled={disabled}
        />
        <button
          type="button"
          className={`
            absolute right-2 top-1/2 -translate-y-1/2
            text-gray-400 hover:text-violet-600
            focus:outline-none focus:text-violet-600
            ${disabled ? 'cursor-not-allowed opacity-50' : ''}
          `}
          onClick={() => !disabled && setIsOpen(true)}
          disabled={disabled}
        >
          <Calendar className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}

      {isOpen && (
        <div className="
          absolute z-50 mt-1
          bg-white rounded-lg shadow-lg
          border border-gray-200
          animate-slide-up
        ">
          <div className="p-3 bg-violet-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="p-1 hover:bg-violet-100 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                onClick={handlePrevMonth}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <button
                    type="button"
                    className="px-2 py-1 text-sm font-medium hover:bg-violet-100 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                    onClick={() => setIsMonthOpen(!isMonthOpen)}
                  >
                    {format(currentMonth, 'MMMM')}
                  </button>
                  {isMonthOpen && (
                    <div className="absolute top-full left-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                      <div className="max-h-48 overflow-y-auto py-1">
                        {months.map((month, index) => (
                          <button
                            key={month}
                            type="button"
                            className={`
                              w-full px-3 py-1.5 text-left text-sm
                              hover:bg-violet-50
                              focus:outline-none focus:bg-violet-50
                              ${currentMonth.getMonth() === index ? 'bg-violet-100 text-violet-900' : ''}
                            `}
                            onClick={() => handleMonthSelect(index)}
                          >
                            {month}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    type="button"
                    className="px-2 py-1 text-sm font-medium hover:bg-violet-100 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                    onClick={() => setIsYearOpen(!isYearOpen)}
                  >
                    {format(currentMonth, 'yyyy')}
                  </button>
                  {isYearOpen && (
                    <div className="absolute top-full left-0 mt-1 w-24 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                      <div 
                        className="max-h-48 overflow-y-auto py-1"
                        ref={(el) => {
                          if (el && isYearOpen) {
                            // Scroll to current year when dropdown opens
                            const yearHeight = 32 // Approximate height of each year button
                            const scrollPosition = currentYearIndex * yearHeight - (el.clientHeight / 2) + (yearHeight / 2)
                            el.scrollTop = Math.max(0, scrollPosition)
                          }
                        }}
                      >
                        {years.map(year => (
                          <button
                            key={year}
                            type="button"
                            className={`
                              w-full px-3 py-1.5 text-left text-sm
                              hover:bg-violet-50
                              focus:outline-none focus:bg-violet-50
                              ${currentMonth.getFullYear() === year ? 'bg-violet-100 text-violet-900' : ''}
                            `}
                            onClick={() => handleYearSelect(year)}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="p-1 hover:bg-violet-100 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                onClick={handleNextMonth}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-3">
            <div className="grid grid-cols-7 gap-1">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-center text-sm text-gray-500">
                  {day}
                </div>
              ))}
              {days.map((day: Date) => {
                const isSelected = selectedDate && isSameDay(day, selectedDate)
                const isCurrentMonth = isSameMonth(day, currentMonth)
                const isCurrentDay = isToday(day)
                
                return (
                  <button
                    key={day.toString()}
                    type="button"
                    className={`
                      h-8 w-8 rounded-full
                      text-sm
                      focus:outline-none focus:ring-2 focus:ring-violet-500
                      ${isSelected ? 'bg-violet-600 text-white' : ''}
                      ${!isSelected && isCurrentDay ? 'bg-violet-100 text-violet-900' : ''}
                      ${!isSelected && !isCurrentDay && isCurrentMonth ? 'hover:bg-violet-50' : ''}
                      ${!isCurrentMonth ? 'text-gray-400' : ''}
                      ${disabled ? 'cursor-not-allowed opacity-50' : ''}
                    `}
                    onClick={() => handleDateSelect(day)}
                    disabled={disabled}
                  >
                    {format(day, 'd')}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="p-2 border-t border-gray-100">
            <button
              type="button"
              className="
                w-full px-3 py-1.5
                text-sm text-violet-600
                hover:bg-violet-50 rounded
                focus:outline-none focus:ring-2 focus:ring-violet-500
              "
              onClick={handleToday}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 