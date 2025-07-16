import { useState, useRef, useEffect } from 'react'
import { Clock, ChevronUp, ChevronDown } from 'lucide-react'

interface TimePickerProps {
  value: string
  onChange: (time: string) => void
  label?: string
  required?: boolean
  disabled?: boolean
  error?: string
  format24?: boolean
}

export function TimePicker({
  value,
  onChange,
  label,
  required = false,
  disabled = false,
  error,
  format24 = true
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHourDropdownOpen, setIsHourDropdownOpen] = useState(false)
  const [isMinuteDropdownOpen, setIsMinuteDropdownOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Parse the time value
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hours: 12, minutes: 0, period: 'AM' }
    
    const [time, period] = timeStr.includes(' ') ? timeStr.split(' ') : [timeStr, '']
    const [hoursStr, minutesStr] = time.split(':')
    let hours = parseInt(hoursStr) || 0
    const minutes = parseInt(minutesStr) || 0
    
    if (!format24 && period) {
      return { hours: hours === 0 ? 12 : hours, minutes, period }
    } else if (!format24 && !period) {
      // Convert 24h to 12h
      const ampm = hours >= 12 ? 'PM' : 'AM'
      hours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
      return { hours, minutes, period: ampm }
    }
    
    return { hours, minutes, period: hours >= 12 ? 'PM' : 'AM' }
  }

  const { hours, minutes, period } = parseTime(value)

  // Format display value
  const formatDisplayValue = () => {
    if (!value) return ''
    
    if (format24) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    } else {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`
    }
  }

  // Handle outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsHourDropdownOpen(false)
        setIsMinuteDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Update time
  const updateTime = (newHours: number, newMinutes: number, newPeriod?: string) => {
    if (format24) {
      const timeStr = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`
      onChange(timeStr)
    } else {
      let hours24 = newHours
      if (newPeriod === 'PM' && newHours !== 12) hours24 += 12
      if (newPeriod === 'AM' && newHours === 12) hours24 = 0
      
      const timeStr = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')} ${newPeriod}`
      onChange(timeStr)
    }
  }

  // Handle hour change
  const handleHourChange = (increment: boolean) => {
    let newHours = hours
    if (format24) {
      newHours = increment ? (hours + 1) % 24 : (hours - 1 + 24) % 24
    } else {
      newHours = increment ? (hours % 12) + 1 : hours === 1 ? 12 : hours - 1
    }
    updateTime(newHours, minutes, period)
  }

  // Handle minute change
  const handleMinuteChange = (increment: boolean) => {
    const newMinutes = increment ? (minutes + 1) % 60 : (minutes - 1 + 60) % 60
    updateTime(hours, newMinutes, period)
  }

  // Handle period change
  const handlePeriodChange = () => {
    if (!format24) {
      const newPeriod = period === 'AM' ? 'PM' : 'AM'
      updateTime(hours, minutes, newPeriod)
    }
  }

  // Handle now button
  const handleNow = () => {
    const now = new Date()
    const currentHours = now.getHours()
    const currentMinutes = now.getMinutes()
    
    if (format24) {
      onChange(`${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`)
    } else {
      const displayHours = currentHours === 0 ? 12 : currentHours > 12 ? currentHours - 12 : currentHours
      const ampm = currentHours >= 12 ? 'PM' : 'AM'
      onChange(`${displayHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')} ${ampm}`)
    }
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
      
      <div className="relative w-32">
        <input
          type="text"
          value={formatDisplayValue()}
          readOnly
          className={`
            w-full px-3 py-2
            border ${error ? 'border-red-500' : 'border-gray-300'}
            rounded-md
            text-sm
            focus:outline-none focus:ring-2 focus:ring-violet-500
            disabled:bg-gray-50 disabled:text-gray-500
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
          placeholder="Select time"
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
          <Clock className="w-5 h-5" />
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
          w-48
        ">
          <div className="p-3 bg-violet-50 rounded-t-lg">
            <div className="text-center text-sm font-medium text-gray-700 mb-2">
              Select Time
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-center space-x-2">
              {/* Hours */}
              <div className="flex flex-col items-center relative">
                <button
                  type="button"
                  className="p-1 hover:bg-violet-100 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                  onClick={() => handleHourChange(true)}
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="w-12 h-10 flex items-center justify-center bg-violet-50 hover:bg-violet-100 rounded text-lg font-medium focus:outline-none focus:ring-2 focus:ring-violet-500"
                  onClick={() => setIsHourDropdownOpen(!isHourDropdownOpen)}
                >
                  {hours.toString().padStart(2, '0')}
                </button>
                <button
                  type="button"
                  className="p-1 hover:bg-violet-100 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                  onClick={() => handleHourChange(false)}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {/* Hour Dropdown */}
                {isHourDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-16 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                    <div className="max-h-32 overflow-y-auto py-1">
                      {Array.from({ length: format24 ? 24 : 12 }, (_, i) => {
                        const hourValue = format24 ? i : i + 1
                        return (
                          <button
                            key={hourValue}
                            type="button"
                            className={`
                              w-full px-2 py-1 text-sm text-center
                              hover:bg-violet-50
                              focus:outline-none focus:bg-violet-50
                              ${hours === hourValue ? 'bg-violet-100 text-violet-900' : ''}
                            `}
                            onClick={() => {
                              updateTime(hourValue, minutes, period)
                              setIsHourDropdownOpen(false)
                            }}
                          >
                            {hourValue.toString().padStart(2, '0')}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-lg font-medium text-gray-500">:</div>

              {/* Minutes */}
              <div className="flex flex-col items-center relative">
                <button
                  type="button"
                  className="p-1 hover:bg-violet-100 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                  onClick={() => handleMinuteChange(true)}
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="w-12 h-10 flex items-center justify-center bg-violet-50 hover:bg-violet-100 rounded text-lg font-medium focus:outline-none focus:ring-2 focus:ring-violet-500"
                  onClick={() => setIsMinuteDropdownOpen(!isMinuteDropdownOpen)}
                >
                  {minutes.toString().padStart(2, '0')}
                </button>
                <button
                  type="button"
                  className="p-1 hover:bg-violet-100 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                  onClick={() => handleMinuteChange(false)}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {/* Minute Dropdown */}
                {isMinuteDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-16 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                    <div className="max-h-32 overflow-y-auto py-1">
                      {Array.from({ length: 12 }, (_, i) => i * 5).map(minuteValue => (
                        <button
                          key={minuteValue}
                          type="button"
                          className={`
                            w-full px-2 py-1 text-sm text-center
                            hover:bg-violet-50
                            focus:outline-none focus:bg-violet-50
                            ${minutes === minuteValue ? 'bg-violet-100 text-violet-900' : ''}
                          `}
                          onClick={() => {
                            updateTime(hours, minuteValue, period)
                            setIsMinuteDropdownOpen(false)
                          }}
                        >
                          {minuteValue.toString().padStart(2, '0')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* AM/PM for 12-hour format */}
              {!format24 && (
                <>
                  <div className="w-px h-8 bg-gray-300 mx-2" />
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      className={`
                        px-2 py-1 rounded text-sm font-medium
                        focus:outline-none focus:ring-2 focus:ring-violet-500
                        ${period === 'AM' ? 'bg-violet-600 text-white' : 'bg-gray-100 hover:bg-violet-100'}
                      `}
                      onClick={handlePeriodChange}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      className={`
                        px-2 py-1 rounded text-sm font-medium mt-1
                        focus:outline-none focus:ring-2 focus:ring-violet-500
                        ${period === 'PM' ? 'bg-violet-600 text-white' : 'bg-gray-100 hover:bg-violet-100'}
                      `}
                      onClick={handlePeriodChange}
                    >
                      PM
                    </button>
                  </div>
                </>
              )}
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
              onClick={handleNow}
            >
              Now
            </button>
          </div>
        </div>
      )}
    </div>
  )
}