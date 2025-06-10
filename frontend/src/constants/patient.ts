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