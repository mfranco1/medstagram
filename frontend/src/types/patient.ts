import { PATIENT_STATUSES, PRIMARY_SERVICES } from '../constants/patient'

export interface ChartEntry {
  id: string
  timestamp: string
  type: 'soap' | 'quick_note'
  chiefComplaint: string
  subjective: string
  objective: string
  assessment: string
  plan: string
  createdBy: {
    name: string
    role: string
  }
}

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
    id: string
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
  chartEntries?: ChartEntry[]
  orders?: {
    diagnostics?: {
      id: string
      name: string
      status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
      orderedBy: string
      orderedAt: string
      notes?: string
    }[]
    imaging?: {
      id: string
      name: string
      status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
      orderedBy: string
      orderedAt: string
      notes?: string
    }[]
    procedures?: {
      id: string
      name: string
      status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
      orderedBy: string
      orderedAt: string
      scheduledFor?: string
      notes?: string
    }[]
    therapeutics?: {
      id: string
      name: string
      status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
      orderedBy: string
      orderedAt: string
      frequency: string
      duration: string
      notes?: string
    }[]
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

export type PatientTab = 'general' | 'medical' | 'orders' | 'chart' | 'diagnostics' | 'therapeutics' | 'case-summary' 