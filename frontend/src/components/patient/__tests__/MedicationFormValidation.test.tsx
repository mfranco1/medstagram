import { z } from 'zod'

// Test the Zod validation schema directly
const getCurrentDate = () => new Date().toISOString().split('T')[0]

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

describe('Medication Form Validation Schema', () => {
  describe('Required Field Validation', () => {
    it('should require medication name', () => {
      const result = medicationSchema.safeParse({
        name: '',
        dosageAmount: 10,
        dosageUnit: 'mg',
        frequencyTimes: 1,
        frequencyPeriod: 'daily',
        route: 'oral',
        startDate: getCurrentDate()
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Medication name is required')
      }
    })

    it('should require dosage amount greater than 0', () => {
      const result = medicationSchema.safeParse({
        name: 'Test Med',
        dosageAmount: 0,
        dosageUnit: 'mg',
        frequencyTimes: 1,
        frequencyPeriod: 'daily',
        route: 'oral',
        startDate: getCurrentDate()
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Dosage amount must be greater than 0')
      }
    })

    it('should require frequency times at least 1', () => {
      const result = medicationSchema.safeParse({
        name: 'Test Med',
        dosageAmount: 10,
        dosageUnit: 'mg',
        frequencyTimes: 0,
        frequencyPeriod: 'daily',
        route: 'oral',
        startDate: getCurrentDate()
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Frequency must be at least 1 time')
      }
    })
  })

  describe('Format Validation', () => {
    it('should reject medication names with invalid characters', () => {
      const result = medicationSchema.safeParse({
        name: 'Invalid@Name#',
        dosageAmount: 10,
        dosageUnit: 'mg',
        frequencyTimes: 1,
        frequencyPeriod: 'daily',
        route: 'oral',
        startDate: getCurrentDate()
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Medication name contains invalid characters')
      }
    })

    it('should reject dosage amounts with too many decimal places', () => {
      const result = medicationSchema.safeParse({
        name: 'Test Med',
        dosageAmount: 10.1234,
        dosageUnit: 'mg',
        frequencyTimes: 1,
        frequencyPeriod: 'daily',
        route: 'oral',
        startDate: getCurrentDate()
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Dosage amount can have at most 3 decimal places')
      }
    })

    it('should reject medication names that are too long', () => {
      const longName = 'a'.repeat(101)
      const result = medicationSchema.safeParse({
        name: longName,
        dosageAmount: 10,
        dosageUnit: 'mg',
        frequencyTimes: 1,
        frequencyPeriod: 'daily',
        route: 'oral',
        startDate: getCurrentDate()
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Medication name must be less than 100 characters')
      }
    })
  })

  describe('Range Validation', () => {
    it('should reject unusually high dosage amounts', () => {
      const result = medicationSchema.safeParse({
        name: 'Test Med',
        dosageAmount: 15000,
        dosageUnit: 'mg',
        frequencyTimes: 1,
        frequencyPeriod: 'daily',
        route: 'oral',
        startDate: getCurrentDate()
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Dosage amount seems unusually high')
      }
    })

    it('should reject frequency times exceeding 24', () => {
      const result = medicationSchema.safeParse({
        name: 'Test Med',
        dosageAmount: 10,
        dosageUnit: 'mg',
        frequencyTimes: 30,
        frequencyPeriod: 'daily',
        route: 'oral',
        startDate: getCurrentDate()
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Frequency cannot exceed 24 times per day')
      }
    })

    it('should reject start dates outside valid range', () => {
      const result = medicationSchema.safeParse({
        name: 'Test Med',
        dosageAmount: 10,
        dosageUnit: 'mg',
        frequencyTimes: 1,
        frequencyPeriod: 'daily',
        route: 'oral',
        startDate: '2020-01-01' // Too far in the past
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Start date must be within one year of today')
      }
    })
  })

  describe('Cross-field Validation', () => {
    it('should require both duration amount and unit together', () => {
      const result = medicationSchema.safeParse({
        name: 'Test Med',
        dosageAmount: 10,
        dosageUnit: 'mg',
        frequencyTimes: 1,
        frequencyPeriod: 'daily',
        route: 'oral',
        startDate: getCurrentDate(),
        durationAmount: 30
        // Missing durationUnit
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        // Find the specific error for duration validation
        const durationError = result.error.issues.find(issue => 
          issue.message === 'Both duration amount and unit must be provided together'
        )
        expect(durationError).toBeDefined()
        expect(durationError?.message).toBe('Both duration amount and unit must be provided together')
      }
    })

    it('should reject schedule times exceeding frequency times', () => {
      const result = medicationSchema.safeParse({
        name: 'Test Med',
        dosageAmount: 10,
        dosageUnit: 'mg',
        frequencyTimes: 2,
        frequencyPeriod: 'daily',
        route: 'oral',
        startDate: getCurrentDate(),
        schedule: ['08:00', '12:00', '18:00'] // 3 times but frequency is 2
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        // Find the specific error for schedule validation
        const scheduleError = result.error.issues.find(issue => 
          issue.message === 'Number of scheduled times cannot exceed frequency times'
        )
        expect(scheduleError).toBeDefined()
        expect(scheduleError?.message).toBe('Number of scheduled times cannot exceed frequency times')
      }
    })

    it('should reject duplicate schedule times', () => {
      const result = medicationSchema.safeParse({
        name: 'Test Med',
        dosageAmount: 10,
        dosageUnit: 'mg',
        frequencyTimes: 2,
        frequencyPeriod: 'daily',
        route: 'oral',
        startDate: getCurrentDate(),
        schedule: ['08:00', '08:00'] // Duplicate times
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        // Find the specific error for duplicate schedule validation
        const duplicateError = result.error.issues.find(issue => 
          issue.message === 'Duplicate schedule times are not allowed'
        )
        expect(duplicateError).toBeDefined()
        expect(duplicateError?.message).toBe('Duplicate schedule times are not allowed')
      }
    })
  })

  describe('Valid Data', () => {
    it('should accept valid medication data', () => {
      const result = medicationSchema.safeParse({
        name: 'Lisinopril',
        genericName: 'Lisinopril',
        dosageAmount: 10,
        dosageUnit: 'mg',
        frequencyTimes: 1,
        frequencyPeriod: 'daily',
        route: 'oral',
        startDate: getCurrentDate(),
        durationAmount: 30,
        durationUnit: 'days',
        indication: 'Hypertension',
        notes: 'Take with food',
        schedule: ['08:00']
      })

      expect(result.success).toBe(true)
    })

    it('should accept minimal valid medication data', () => {
      const result = medicationSchema.safeParse({
        name: 'Aspirin',
        dosageAmount: 81,
        dosageUnit: 'mg',
        frequencyTimes: 1,
        frequencyPeriod: 'daily',
        route: 'oral',
        startDate: getCurrentDate()
      })

      expect(result.success).toBe(true)
    })

    it('should accept valid schedule times', () => {
      const result = medicationSchema.safeParse({
        name: 'Test Med',
        dosageAmount: 10,
        dosageUnit: 'mg',
        frequencyTimes: 3,
        frequencyPeriod: 'daily',
        route: 'oral',
        startDate: getCurrentDate(),
        schedule: ['08:00', '14:00', '20:00']
      })

      expect(result.success).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle decimal dosage amounts correctly', () => {
      const result = medicationSchema.safeParse({
        name: 'Test Med',
        dosageAmount: 2.5,
        dosageUnit: 'mg',
        frequencyTimes: 1,
        frequencyPeriod: 'daily',
        route: 'oral',
        startDate: getCurrentDate()
      })

      expect(result.success).toBe(true)
    })

    it('should handle maximum allowed values', () => {
      const result = medicationSchema.safeParse({
        name: 'Test Med',
        dosageAmount: 10000, // Maximum allowed
        dosageUnit: 'mg',
        frequencyTimes: 24, // Maximum allowed
        frequencyPeriod: 'daily',
        route: 'oral',
        startDate: getCurrentDate(),
        durationAmount: 365, // Maximum allowed
        durationUnit: 'days'
      })

      expect(result.success).toBe(true)
    })

    it('should handle empty optional fields', () => {
      const result = medicationSchema.safeParse({
        name: 'Test Med',
        dosageAmount: 10,
        dosageUnit: 'mg',
        frequencyTimes: 1,
        frequencyPeriod: 'daily',
        route: 'oral',
        startDate: getCurrentDate(),
        genericName: '',
        indication: '',
        notes: ''
      })

      expect(result.success).toBe(true)
    })
  })
})