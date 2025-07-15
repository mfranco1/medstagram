export const PATIENT_STATUSES = ['Active Admission', 'Discharged', 'Transferred', 'Deceased'] as const
export const GENDERS = ['Male', 'Female', 'Other'] as const
export const CIVIL_STATUSES = ['Single', 'Married', 'Widowed', 'Separated'] as const
export const PRIMARY_SERVICES = [
  'Internal Medicine',
  'Surgery',
  'Pediatrics',
  'Obstetrics and Gynecology',
  'Orthopedics',
  'Neurology',
  'Cardiology',
  'Pulmonology',
  'Gastroenterology',
  'Nephrology',
  'Oncology',
  'Urology'
] as const

export const STATUS_COLORS = {
  'Active Admission': 'bg-green-100 text-green-800',
  'Discharged': 'bg-gray-100 text-gray-800',
  'Transferred': 'bg-blue-100 text-blue-800',
  'Deceased': 'bg-red-100 text-red-800'
} as const

// Medication-related constants
export const MEDICATION_STATUSES = ['active', 'discontinued', 'completed', 'on-hold'] as const
export const MEDICATION_ROUTES = ['oral', 'IV', 'IM', 'topical', 'inhalation', 'sublingual', 'rectal', 'other'] as const
export const MEDICATION_FREQUENCY_PERIODS = ['daily', 'weekly', 'monthly'] as const
export const MEDICATION_DURATION_UNITS = ['days', 'weeks', 'months'] as const
export const DOSAGE_UNITS = ['mg', 'g', 'ml', 'units', 'mcg', 'IU', 'drops', 'puffs', 'tablets', 'capsules'] as const
export const ALLERGY_TYPES = ['drug', 'food', 'environmental'] as const
export const ALLERGY_SEVERITIES = ['mild', 'moderate', 'severe'] as const
export const INTERACTION_SEVERITIES = ['mild', 'moderate', 'severe'] as const

export const MEDICATION_STATUS_COLORS = {
  'active': 'bg-green-100 text-green-800',
  'discontinued': 'bg-red-100 text-red-800',
  'completed': 'bg-blue-100 text-blue-800',
  'on-hold': 'bg-yellow-100 text-yellow-800'
} as const

export const ALLERGY_SEVERITY_COLORS = {
  'mild': 'bg-yellow-100 text-yellow-800',
  'moderate': 'bg-orange-100 text-orange-800',
  'severe': 'bg-red-100 text-red-800'
} as const

export const INTERACTION_SEVERITY_COLORS = {
  'mild': 'bg-yellow-100 text-yellow-800',
  'moderate': 'bg-orange-100 text-orange-800',
  'severe': 'bg-red-100 text-red-800'
} as const

export const DEFAULT_PATIENT = {
  name: '',
  age: 0,
  gender: 'Male',
  diagnosis: '',
  status: 'Active Admission',
  caseNumber: '',
  dateAdmitted: new Date().toISOString().split('T')[0],
  location: '',
  dateOfBirth: '',
  civilStatus: 'Single',
  nationality: 'Filipino',
  religion: '',
  address: '',
  philhealth: '',
  primaryService: 'Internal Medicine'
} as const 