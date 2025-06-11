import { PATIENT_STATUSES, PRIMARY_SERVICES } from '../constants/patient'

export interface Patient {
  id: number
  name: string
  age: number
  gender: string
  caseNumber: string
  dateAdmitted: string
  location: string
  status: typeof PATIENT_STATUSES[number]
  diagnosis: string
  dateOfBirth: string
  civilStatus: string
  nationality: string
  religion: string
  address: string
  philhealth: string
  primaryService: typeof PRIMARY_SERVICES[number]
} 