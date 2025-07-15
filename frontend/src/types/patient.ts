import { PATIENT_STATUSES, PRIMARY_SERVICES } from '../constants/patient'

// Medication-related interfaces
export interface Medication {
  id: string
  patientId: number
  name: string
  genericName?: string
  dosage: {
    amount: number
    unit: string // mg, g, ml, units, etc.
  }
  frequency: {
    times: number
    period: 'daily' | 'weekly' | 'monthly'
    schedule?: string[] // specific times if needed
  }
  route: 'oral' | 'IV' | 'IM' | 'topical' | 'inhalation' | 'sublingual' | 'rectal' | 'other'
  startDate: string
  endDate?: string
  duration?: {
    amount: number
    unit: 'days' | 'weeks' | 'months'
  }
  status: 'active' | 'discontinued' | 'completed' | 'on-hold'
  prescribedBy: {
    id: string
    name: string
  }
  indication?: string
  notes?: string
  discontinuationReason?: string
  createdAt: string
  updatedAt: string
  // Dosage calculation fields
  isWeightBased?: boolean
  dosePerKg?: number
  calculatedDose?: {
    patientWeight: number
    calculatedAmount: number
    formula: string
  }
  // Safety fields
  allergyWarnings?: string[]
  interactions?: {
    medicationId: string
    medicationName: string
    severity: 'mild' | 'moderate' | 'severe'
    description: string
  }[]
}

export interface DosageCalculation {
  patientWeight: number
  dosePerKg: number
  calculatedAmount: number
  recommendedDose: number
  formula: string
  warnings: string[]
  isWithinNormalRange: boolean
}

export interface MedicationDatabase {
  id: string
  name: string
  genericName: string
  brandNames: string[]
  category: string
  commonDosages: {
    amount: number
    unit: string
  }[]
  routes: string[]
  isWeightBased: boolean
  pediatricDosing?: {
    minAge: number
    maxAge: number
    dosePerKg: number
    maxDose?: number
  }
  adultDosing?: {
    minDose: number
    maxDose: number
    commonDose: number
  }
  contraindications: string[]
  commonSideEffects: string[]
}

export interface PatientAllergy {
  type: 'drug' | 'food' | 'environmental'
  allergen: string
  reaction: string
  severity: 'mild' | 'moderate' | 'severe'
}

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
  allergies?: PatientAllergy[]
  medications?: Medication[]
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