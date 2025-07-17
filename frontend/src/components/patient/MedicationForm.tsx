import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Search, Plus, Minus } from 'lucide-react'
import type { Medication, Patient, MedicationDatabase } from '../../types/patient'
import { mockMedicationDatabase } from '../../mocks/medications'
import { FormSection } from '../ui/FormSection'
import { FormField } from '../ui/FormField'
import { TimePicker } from '../ui/time-picker/TimePicker'
import { DosageCalculator } from './DosageCalculator'

// Enhanced Zod validation schema with comprehensive validation rules
const medicationSchema = z.object({
  name: z.string()
    .min(1, 'Medication name is required')
    .max(100, 'Medication name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-\.\/\(\)]+$/, 'Medication name contains invalid characters'),
  genericName: z.string()
    .max(100, 'Generic name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-\.\/\(\)]*$/, 'Generic name contains invalid characters')
    .optional(),
  dosageAmount: z.number()
    .min(0.001, 'Dosage amount must be greater than 0')
    .max(10000, 'Dosage amount seems unusually high')
    .refine((val) => {
      const str = val.toString()
      const decimalIndex = str.indexOf('.')
      if (decimalIndex === -1) return true
      return str.length - decimalIndex - 1 <= 3
    }, 'Dosage amount can have at most 3 decimal places'),
  dosageUnit: z.string()
    .min(1, 'Dosage unit is required')
    .max(20, 'Dosage unit must be less than 20 characters'),
  frequencyTimes: z.number()
    .int('Frequency times must be a whole number')
    .min(1, 'Frequency must be at least 1 time')
    .max(24, 'Frequency cannot exceed 24 times per day'),
  frequencyPeriod: z.enum(['daily', 'weekly', 'monthly'], {
    errorMap: () => ({ message: 'Please select a valid frequency period' })
  }),
  route: z.enum(['oral', 'IV', 'IM', 'topical', 'inhalation', 'sublingual', 'rectal', 'other'], {
    errorMap: () => ({ message: 'Please select a valid route of administration' })
  }),
  startDate: z.string()
    .min(1, 'Start date is required')
    .refine((date) => {
      const selectedDate = new Date(date)
      const today = new Date()
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(today.getFullYear() - 1)
      const oneYearFromNow = new Date()
      oneYearFromNow.setFullYear(today.getFullYear() + 1)
      
      return selectedDate >= oneYearAgo && selectedDate <= oneYearFromNow
    }, 'Start date must be within one year of today'),
  durationAmount: z.number()
    .int('Duration amount must be a whole number')
    .min(1, 'Duration amount must be at least 1')
    .max(365, 'Duration amount cannot exceed 365')
    .optional(),
  durationUnit: z.enum(['days', 'weeks', 'months']).optional(),
  indication: z.string()
    .max(500, 'Indication must be less than 500 characters')
    .optional(),
  notes: z.string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional(),
  schedule: z.array(z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format')).optional()
}).refine((data) => {
  if (data.durationAmount && !data.durationUnit) {
    return false
  }
  if (!data.durationAmount && data.durationUnit) {
    return false
  }
  return true
}, {
  message: 'Both duration amount and unit must be provided together',
  path: ['durationUnit']
}).refine((data) => {
  if (data.schedule && data.schedule.length > data.frequencyTimes) {
    return false
  }
  return true
}, {
  message: 'Number of scheduled times cannot exceed frequency times',
  path: ['schedule']
}).refine((data) => {
  if (data.schedule && data.schedule.length > 1) {
    const uniqueTimes = new Set(data.schedule.filter(time => time.trim() !== ''))
    return uniqueTimes.size === data.schedule.filter(time => time.trim() !== '').length
  }
  return true
}, {
  message: 'Duplicate schedule times are not allowed',
  path: ['schedule']
})

type MedicationFormData = z.infer<typeof medicationSchema>

interface MedicationFormProps {
  isOpen: boolean
  medication?: Medication
  patient: Patient
  onSave: (medication: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

const DOSAGE_UNITS = [
  { value: 'mg', label: 'mg' },
  { value: 'g', label: 'g' },
  { value: 'ml', label: 'ml' },
  { value: 'units', label: 'units' },
  { value: 'mcg', label: 'mcg' },
  { value: 'IU', label: 'IU' }
]

const ROUTES = [
  { value: 'oral', label: 'Oral' },
  { value: 'IV', label: 'Intravenous (IV)' },
  { value: 'IM', label: 'Intramuscular (IM)' },
  { value: 'topical', label: 'Topical' },
  { value: 'inhalation', label: 'Inhalation' },
  { value: 'sublingual', label: 'Sublingual' },
  { value: 'rectal', label: 'Rectal' },
  { value: 'other', label: 'Other' }
]

const FREQUENCY_PERIODS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
]

const DURATION_UNITS = [
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
  { value: 'months', label: 'Months' }
]

export function MedicationForm({ isOpen, medication, patient, onSave, onCancel }: MedicationFormProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedMedication, setSelectedMedication] = useState<MedicationDatabase | null>(null)
  const [scheduleItems, setScheduleItems] = useState<string[]>([''])
  const modalRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: '',
      genericName: '',
      dosageAmount: 0,
      dosageUnit: 'mg',
      frequencyTimes: 1,
      frequencyPeriod: 'daily',
      route: 'oral',
      startDate: new Date().toISOString().split('T')[0],
      indication: '',
      notes: ''
    }
  })

  const watchedName = watch('name')
  const watchedFrequencyTimes = watch('frequencyTimes')
  const watchedFrequencyPeriod = watch('frequencyPeriod')

  // Filter medication suggestions based on search term
  const filteredMedications = mockMedicationDatabase.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.brandNames.some(brand => brand.toLowerCase().includes(searchTerm.toLowerCase()))
  ).slice(0, 10)

  // Initialize form when editing existing medication
  useEffect(() => {
    if (medication) {
      reset({
        name: medication.name,
        genericName: medication.genericName || '',
        dosageAmount: medication.dosage.amount,
        dosageUnit: medication.dosage.unit,
        frequencyTimes: medication.frequency.times,
        frequencyPeriod: medication.frequency.period,
        route: medication.route,
        startDate: medication.startDate,
        durationAmount: medication.duration?.amount,
        durationUnit: medication.duration?.unit,
        indication: medication.indication || '',
        notes: medication.notes || ''
      })
      setScheduleItems(medication.frequency.schedule || [''])
    } else {
      reset({
        name: '',
        genericName: '',
        dosageAmount: 0,
        dosageUnit: 'mg',
        frequencyTimes: 1,
        frequencyPeriod: 'daily',
        route: 'oral',
        startDate: new Date().toISOString().split('T')[0],
        indication: '',
        notes: ''
      })
      setScheduleItems([''])
    }
    setSearchTerm('')
    setSelectedMedication(null)
  }, [medication, reset])

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCancel()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onCancel])

  // Handle recommended dose selection
  useEffect(() => {
    const handleUseRecommendedDose = (event: CustomEvent) => {
      const { recommendedDose } = event.detail
      setValue('dosageAmount', recommendedDose)
    }

    window.addEventListener('useRecommendedDose', handleUseRecommendedDose as EventListener)
    
    return () => {
      window.removeEventListener('useRecommendedDose', handleUseRecommendedDose as EventListener)
    }
  }, [setValue])

  // Handle medication selection from autocomplete
  const handleMedicationSelect = (med: MedicationDatabase) => {
    setValue('name', med.name)
    setValue('genericName', med.genericName)
    setSearchTerm(med.name)
    setSelectedMedication(med)
    setShowSuggestions(false)

    // Auto-populate common dosage if available
    if (med.commonDosages.length > 0) {
      const commonDosage = med.commonDosages[0]
      setValue('dosageAmount', commonDosage.amount)
      setValue('dosageUnit', commonDosage.unit)
    }
  }

  // Handle schedule time changes
  const handleScheduleChange = (index: number, value: string) => {
    const newSchedule = [...scheduleItems]
    newSchedule[index] = value
    setScheduleItems(newSchedule)
  }

  const addScheduleItem = () => {
    setScheduleItems([...scheduleItems, ''])
  }

  const removeScheduleItem = (index: number) => {
    if (scheduleItems.length > 1) {
      const newSchedule = scheduleItems.filter((_, i) => i !== index)
      setScheduleItems(newSchedule)
    }
  }

  // Form submission
  const onSubmit = (data: MedicationFormData) => {
    const medicationData: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'> = {
      patientId: patient.id,
      name: data.name,
      genericName: data.genericName || undefined,
      dosage: {
        amount: data.dosageAmount,
        unit: data.dosageUnit
      },
      frequency: {
        times: data.frequencyTimes,
        period: data.frequencyPeriod,
        schedule: scheduleItems.filter(item => item.trim() !== '')
      },
      route: data.route,
      startDate: data.startDate,
      duration: data.durationAmount && data.durationUnit ? {
        amount: data.durationAmount,
        unit: data.durationUnit
      } : undefined,
      status: medication?.status || 'active',
      prescribedBy: {
        id: 'current-user',
        name: 'Current User' // This would come from auth context in real app
      },
      indication: data.indication || undefined,
      notes: data.notes || undefined,
      // Add weight-based dosing info if available
      isWeightBased: selectedMedication?.isWeightBased,
      dosePerKg: selectedMedication?.pediatricDosing?.dosePerKg || selectedMedication?.adultDosing?.commonDose
    }

    onSave(medicationData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div ref={modalRef} className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          {/* Fixed Header */}
          <div className="p-6 border-b flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {medication ? 'Edit Medication' : 'Add New Medication'}
              </h2>
              <button
                type="button"
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-500"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="space-y-6">
              {/* Medication Information */}
              <FormSection title="Medication Information">
                {/* Medication Name with Autocomplete */}
                <div className="relative">
                  <label htmlFor="medication-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Medication Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="medication-name"
                      ref={searchRef}
                      type="text"
                      value={searchTerm || watchedName}
                      onChange={(e) => {
                        const value = e.target.value
                        setSearchTerm(value)
                        setValue('name', value)
                        setShowSuggestions(value.length > 0)
                      }}
                      onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 ${errors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                      placeholder="Search for medication..."
                      disabled={isSubmitting}
                    />
                    <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                  </div>

                  {/* Autocomplete Suggestions */}
                  {showSuggestions && filteredMedications.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredMedications.map((med) => (
                        <button
                          key={med.id}
                          type="button"
                          onClick={() => handleMedicationSelect(med)}
                          className="w-full px-3 py-2 text-left hover:bg-violet-50 focus:bg-violet-50 focus:outline-none"
                        >
                          <div className="font-medium text-gray-900">{med.name}</div>
                          <div className="text-sm text-gray-500">
                            {med.genericName} • {med.category}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>

                {/* Generic Name */}
                <FormField
                  label="Generic Name"
                  value={watch('genericName') || ''}
                  onChange={(value) => setValue('genericName', value)}
                  placeholder="Generic name (optional)"
                  disabled={isSubmitting}
                />
              </FormSection>

              {/* Dosage Information */}
              <FormSection title="Dosage Information">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Dosage Amount"
                    type="number"
                    value={watch('dosageAmount') || 0}
                    onChange={(value) => setValue('dosageAmount', parseFloat(value) || 0)}
                    required
                    placeholder="0.00"
                    disabled={isSubmitting}
                    error={errors.dosageAmount?.message}
                  />

                  <FormField
                    label="Unit"
                    value={watch('dosageUnit') || 'mg'}
                    onChange={(value) => setValue('dosageUnit', value)}
                    required
                    options={DOSAGE_UNITS}
                    disabled={isSubmitting}
                    error={errors.dosageUnit?.message}
                  />
                </div>
              </FormSection>

              {/* Dosage Calculator */}
              {selectedMedication && (
                <DosageCalculator
                  patient={patient}
                  medication={selectedMedication}
                  dosageAmount={watch('dosageAmount') || 0}
                  dosageUnit={watch('dosageUnit') || 'mg'}
                  frequencyTimes={watch('frequencyTimes') || 1}
                  frequencyPeriod={watch('frequencyPeriod') || 'daily'}
                  onCalculationComplete={(calculation) => {
                    // Store calculation results for form submission
                    if (calculation.isWithinNormalRange && calculation.recommendedDose > 0) {
                      // Optionally auto-update the dosage if it's significantly different
                      const currentDose = watch('dosageAmount') || 0
                      if (currentDose === 0 || Math.abs(currentDose - calculation.recommendedDose) / calculation.recommendedDose > 0.2) {
                        // Only suggest if difference is more than 20%
                      }
                    }
                  }}
                  className="mb-6"
                />
              )}

              {/* Frequency Information */}
              <FormSection title="Frequency & Schedule">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Times per Period"
                    type="number"
                    value={watch('frequencyTimes') || 1}
                    onChange={(value) => setValue('frequencyTimes', parseInt(value) || 1)}
                    required
                    placeholder="1"
                    disabled={isSubmitting}
                    error={errors.frequencyTimes?.message}
                  />

                  <FormField
                    label="Period"
                    value={watch('frequencyPeriod') || 'daily'}
                    onChange={(value) => setValue('frequencyPeriod', value as 'daily' | 'weekly' | 'monthly')}
                    required
                    options={FREQUENCY_PERIODS}
                    disabled={isSubmitting}
                    error={errors.frequencyPeriod?.message}
                  />
                </div>

                {/* Schedule Builder */}
                {watchedFrequencyTimes > 1 && watchedFrequencyPeriod === 'daily' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specific Times (Optional)
                    </label>
                    <div className="space-y-2">
                      {scheduleItems.map((time, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <TimePicker
                            value={time}
                            onChange={(value) => handleScheduleChange(index, value)}
                            disabled={isSubmitting}
                            format24={true}
                          />
                          {scheduleItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeScheduleItem(index)}
                              className="p-1 text-red-500 hover:text-red-700"
                              disabled={isSubmitting}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      {scheduleItems.length < watchedFrequencyTimes && (
                        <button
                          type="button"
                          onClick={addScheduleItem}
                          className="flex items-center gap-1 text-violet-600 hover:text-violet-700 text-sm"
                          disabled={isSubmitting}
                        >
                          <Plus className="w-4 h-4" />
                          Add Time
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </FormSection>

              {/* Administration Information */}
              <FormSection title="Administration">
                <FormField
                  label="Route of Administration"
                  value={watch('route') || 'oral'}
                  onChange={(value) => setValue('route', value as any)}
                  required
                  options={ROUTES}
                  disabled={isSubmitting}
                  error={errors.route?.message}
                />
              </FormSection>

              {/* Duration Information */}
              <FormSection title="Duration & Dates">
                <FormField
                  label="Start Date"
                  type="date"
                  value={watch('startDate') || ''}
                  onChange={(value) => setValue('startDate', value)}
                  required
                  disabled={isSubmitting}
                  error={errors.startDate?.message}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Duration Amount"
                    type="number"
                    value={watch('durationAmount') || ''}
                    onChange={(value) => setValue('durationAmount', value ? parseInt(value) : undefined)}
                    placeholder="Optional"
                    disabled={isSubmitting}
                  />

                  <FormField
                    label="Duration Unit"
                    value={watch('durationUnit') || ''}
                    onChange={(value) => setValue('durationUnit', value as 'days' | 'weeks' | 'months' | undefined)}
                    options={[{ value: '', label: 'Select unit' }, ...DURATION_UNITS]}
                    disabled={isSubmitting}
                  />
                </div>
              </FormSection>

              {/* Additional Information */}
              <FormSection title="Additional Information">
                <FormField
                  label="Indication"
                  value={watch('indication') || ''}
                  onChange={(value) => setValue('indication', value)}
                  placeholder="Reason for prescribing (optional)"
                  disabled={isSubmitting}
                />

                <FormField
                  label="Notes"
                  type="textarea"
                  value={watch('notes') || ''}
                  onChange={(value) => setValue('notes', value)}
                  placeholder="Additional notes or instructions (optional)"
                  rows={3}
                  disabled={isSubmitting}
                />
              </FormSection>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="p-6 border-t bg-white flex-shrink-0">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  medication ? 'Update Medication' : 'Add Medication'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}