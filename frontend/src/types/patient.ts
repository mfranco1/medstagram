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
  bloodType?: string
  allergies?: string[]
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
  height?: number
  weight?: number
  attendingPhysician?: {
    name: string
    specialization: string
    contactNumber: string
  }
  upcomingProcedure?: {
    name: string
    date: string
    time: string
    location: string
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  }
  lastVitals?: {
    temperature?: number
    bloodPressure?: {
      systolic: number
      diastolic: number
    }
    heartRate?: number
    respiratoryRate?: number
    oxygenSaturation?: number
    gcs?: {
      eye: number
      verbal: number | string
      motor: number
      total: number
    }
    timestamp: string
  }
} 