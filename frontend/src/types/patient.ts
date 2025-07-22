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

// Chart Entry Type Definitions
export type ChartEntryType = 
  | 'progress_note' 
  | 'admission_note' 
  | 'procedure_note' 
  | 'discharge_summary' 
  | 'consultation_note' 
  | 'emergency_note' 
  | 'quick_note'

// Template-specific data interfaces
export interface AdmissionNoteData {
  historyOfPresentIllness: string
  pastMedicalHistory: string
  socialHistory: string
  familyHistory: string
  reviewOfSystems: {
    [system: string]: string
  }
  physicalExamination: {
    [system: string]: string
  }
  admissionDiagnoses: string[]
  initialOrders: string[]
}

export interface ProcedureNoteData {
  indication: string
  procedureName: string
  procedureDescription: string
  findings: string
  complications: string
  postProcedurePlan: string
  informedConsent: boolean
  timeStarted: string
  timeCompleted: string
  assistants: string[]
  suggestedCptCodes: string[]
}

export interface DischargeSummaryData {
  hospitalCourse: string
  dischargeDiagnoses: string[]
  dischargeMedications: {
    continued: string[]
    newlyStarted: string[]
    discontinued: string[]
  }
  followUpInstructions: string
  patientEducation: string[]
  dischargeDisposition: string
  functionalStatus: string
}

export interface ConsultationNoteData {
  reasonForConsultation: string
  referringPhysician: {
    id: string
    name: string
    department: string
  }
  focusedHistory: string
  focusedExamination: string
  impression: string
  recommendations: {
    text: string
    urgency: 'routine' | 'urgent' | 'stat'
    followUpRequired: boolean
  }[]
  notificationSent: boolean
}

export interface EmergencyNoteData {
  eventType: string
  personnelInvolved: string[]
  interventions: {
    time: string
    intervention: string
    response: string
  }[]
  medications: {
    time: string
    medication: string
    dose: string
    route: string
  }[]
  outcome: string
  addendums: {
    timestamp: string
    author: string
    content: string
  }[]
}

// Validation rule interfaces
export interface ValidationRule {
  field: string
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom'
  value?: any
  message: string
  severity: 'error' | 'warning' | 'info'
}

// Auto-population interfaces
export interface AutoPopulationSource {
  field: string
  source: 'vitals' | 'labs' | 'medications' | 'allergies' | 'previous_notes'
  transform?: (data: any) => string
  conditions?: string[]
}

// Chart Entry Type Configuration
export interface ChartEntryTypeConfig {
  type: ChartEntryType
  displayName: string
  description: string
  icon: string
  color: string
  requiredFields: string[]
  optionalFields: string[]
  validationRules: ValidationRule[]
  autoPopulationSources: AutoPopulationSource[]
}

// Enhanced ChartEntry interface
export interface ChartEntry {
  id: string
  timestamp: string
  type: ChartEntryType
  templateVersion: string
  chiefComplaint?: string
  subjective: string
  objective: string
  assessment: string
  plan: string
  createdBy: {
    name: string
    role: string
    id: string
  }
  // Type-specific structured data
  structuredData?: {
    admissionNote?: AdmissionNoteData
    procedureNote?: ProcedureNoteData
    dischargeNote?: DischargeSummaryData
    consultationNote?: ConsultationNoteData
    emergencyNote?: EmergencyNoteData
  }
  metadata: {
    requiredFieldsCompleted: boolean
    lastModified: string
    wordCount: number
    estimatedReadTime: number
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