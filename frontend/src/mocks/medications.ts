import type { Medication, MedicationDatabase, PatientAllergy } from '../types/patient'
import { mockDoctor } from './doctor'

// Mock prescriber data
const mockPrescriber = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: `${mockDoctor.title} ${mockDoctor.firstName} ${mockDoctor.lastName}`
}

// Comprehensive medication database with common drugs
export const mockMedicationDatabase: MedicationDatabase[] = [
  {
    id: 'med-db-001',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    brandNames: ['Prinivil', 'Zestril'],
    category: 'ACE Inhibitor',
    commonDosages: [
      { amount: 5, unit: 'mg' },
      { amount: 10, unit: 'mg' },
      { amount: 20, unit: 'mg' },
      { amount: 40, unit: 'mg' }
    ],
    routes: ['oral'],
    isWeightBased: false,
    adultDosing: {
      minDose: 5,
      maxDose: 40,
      commonDose: 10
    },
    contraindications: ['Pregnancy', 'Angioedema history', 'Bilateral renal artery stenosis'],
    commonSideEffects: ['Dry cough', 'Hyperkalemia', 'Hypotension', 'Angioedema']
  },
  {
    id: 'med-db-002',
    name: 'Metformin',
    genericName: 'Metformin',
    brandNames: ['Glucophage', 'Fortamet', 'Glumetza'],
    category: 'Antidiabetic',
    commonDosages: [
      { amount: 500, unit: 'mg' },
      { amount: 850, unit: 'mg' },
      { amount: 1000, unit: 'mg' }
    ],
    routes: ['oral'],
    isWeightBased: false,
    adultDosing: {
      minDose: 500,
      maxDose: 2550,
      commonDose: 1000
    },
    contraindications: ['Severe kidney disease', 'Metabolic acidosis', 'Diabetic ketoacidosis'],
    commonSideEffects: ['Nausea', 'Diarrhea', 'Metallic taste', 'Vitamin B12 deficiency']
  },
  {
    id: 'med-db-003',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    brandNames: ['Amoxil', 'Trimox', 'Moxatag'],
    category: 'Antibiotic',
    commonDosages: [
      { amount: 250, unit: 'mg' },
      { amount: 500, unit: 'mg' },
      { amount: 875, unit: 'mg' }
    ],
    routes: ['oral'],
    isWeightBased: true,
    pediatricDosing: {
      minAge: 0,
      maxAge: 18,
      dosePerKg: 25,
      maxDose: 1000
    },
    adultDosing: {
      minDose: 250,
      maxDose: 1000,
      commonDose: 500
    },
    contraindications: ['Penicillin allergy', 'Mononucleosis'],
    commonSideEffects: ['Nausea', 'Diarrhea', 'Rash', 'Yeast infections']
  },
  {
    id: 'med-db-004',
    name: 'Furosemide',
    genericName: 'Furosemide',
    brandNames: ['Lasix'],
    category: 'Diuretic',
    commonDosages: [
      { amount: 20, unit: 'mg' },
      { amount: 40, unit: 'mg' },
      { amount: 80, unit: 'mg' }
    ],
    routes: ['oral', 'IV'],
    isWeightBased: false,
    adultDosing: {
      minDose: 20,
      maxDose: 600,
      commonDose: 40
    },
    contraindications: ['Anuria', 'Severe electrolyte depletion'],
    commonSideEffects: ['Dehydration', 'Electrolyte imbalance', 'Hypotension', 'Ototoxicity']
  },
  {
    id: 'med-db-005',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin',
    brandNames: ['Lipitor'],
    category: 'Statin',
    commonDosages: [
      { amount: 10, unit: 'mg' },
      { amount: 20, unit: 'mg' },
      { amount: 40, unit: 'mg' },
      { amount: 80, unit: 'mg' }
    ],
    routes: ['oral'],
    isWeightBased: false,
    adultDosing: {
      minDose: 10,
      maxDose: 80,
      commonDose: 20
    },
    contraindications: ['Active liver disease', 'Pregnancy', 'Breastfeeding'],
    commonSideEffects: ['Muscle pain', 'Liver enzyme elevation', 'Headache', 'Nausea']
  },
  {
    id: 'med-db-006',
    name: 'Warfarin',
    genericName: 'Warfarin',
    brandNames: ['Coumadin', 'Jantoven'],
    category: 'Anticoagulant',
    commonDosages: [
      { amount: 1, unit: 'mg' },
      { amount: 2, unit: 'mg' },
      { amount: 2.5, unit: 'mg' },
      { amount: 5, unit: 'mg' },
      { amount: 10, unit: 'mg' }
    ],
    routes: ['oral'],
    isWeightBased: false,
    adultDosing: {
      minDose: 1,
      maxDose: 15,
      commonDose: 5
    },
    contraindications: ['Active bleeding', 'Pregnancy', 'Severe liver disease'],
    commonSideEffects: ['Bleeding', 'Bruising', 'Hair loss', 'Skin necrosis']
  },
  {
    id: 'med-db-007',
    name: 'Prednisone',
    genericName: 'Prednisone',
    brandNames: ['Deltasone', 'Rayos'],
    category: 'Corticosteroid',
    commonDosages: [
      { amount: 5, unit: 'mg' },
      { amount: 10, unit: 'mg' },
      { amount: 20, unit: 'mg' },
      { amount: 50, unit: 'mg' }
    ],
    routes: ['oral'],
    isWeightBased: true,
    pediatricDosing: {
      minAge: 0,
      maxAge: 18,
      dosePerKg: 1,
      maxDose: 80
    },
    adultDosing: {
      minDose: 5,
      maxDose: 100,
      commonDose: 20
    },
    contraindications: ['Systemic fungal infections', 'Live vaccines'],
    commonSideEffects: ['Weight gain', 'Mood changes', 'Increased appetite', 'Insomnia']
  },
  {
    id: 'med-db-008',
    name: 'Insulin',
    genericName: 'Insulin',
    brandNames: ['Humalog', 'Novolog', 'Lantus', 'Levemir'],
    category: 'Antidiabetic',
    commonDosages: [
      { amount: 10, unit: 'units' },
      { amount: 20, unit: 'units' },
      { amount: 30, unit: 'units' }
    ],
    routes: ['IV', 'IM'],
    isWeightBased: true,
    pediatricDosing: {
      minAge: 0,
      maxAge: 18,
      dosePerKg: 0.5,
      maxDose: 100
    },
    adultDosing: {
      minDose: 5,
      maxDose: 200,
      commonDose: 20
    },
    contraindications: ['Hypoglycemia'],
    commonSideEffects: ['Hypoglycemia', 'Weight gain', 'Injection site reactions']
  },
  {
    id: 'med-db-009',
    name: 'Morphine',
    genericName: 'Morphine',
    brandNames: ['MS Contin', 'Kadian', 'Avinza'],
    category: 'Opioid Analgesic',
    commonDosages: [
      { amount: 5, unit: 'mg' },
      { amount: 10, unit: 'mg' },
      { amount: 15, unit: 'mg' },
      { amount: 30, unit: 'mg' }
    ],
    routes: ['oral', 'IV', 'IM'],
    isWeightBased: true,
    pediatricDosing: {
      minAge: 0,
      maxAge: 18,
      dosePerKg: 0.1,
      maxDose: 15
    },
    adultDosing: {
      minDose: 5,
      maxDose: 200,
      commonDose: 15
    },
    contraindications: ['Respiratory depression', 'Paralytic ileus', 'Severe asthma'],
    commonSideEffects: ['Sedation', 'Constipation', 'Nausea', 'Respiratory depression']
  },
  {
    id: 'med-db-010',
    name: 'Aspirin',
    genericName: 'Aspirin',
    brandNames: ['Bayer', 'Bufferin', 'Ecotrin'],
    category: 'Antiplatelet',
    commonDosages: [
      { amount: 81, unit: 'mg' },
      { amount: 325, unit: 'mg' },
      { amount: 650, unit: 'mg' }
    ],
    routes: ['oral'],
    isWeightBased: false,
    adultDosing: {
      minDose: 81,
      maxDose: 1300,
      commonDose: 325
    },
    contraindications: ['Active bleeding', 'Severe liver disease', 'Children with viral infections'],
    commonSideEffects: ['GI bleeding', 'Tinnitus', 'Nausea', 'Allergic reactions']
  }
]

// Mock patient allergies for testing alert functionality
export const mockPatientAllergies: { [patientId: number]: PatientAllergy[] } = {
  1: [
    {
      type: 'drug',
      allergen: 'Penicillin',
      reaction: 'Rash and hives',
      severity: 'moderate'
    },
    {
      type: 'drug',
      allergen: 'Sulfa drugs',
      reaction: 'Severe skin reaction',
      severity: 'severe'
    }
  ],
  2: [
    {
      type: 'drug',
      allergen: 'Aspirin',
      reaction: 'Bronchospasm',
      severity: 'severe'
    }
  ],
  3: [
    {
      type: 'drug',
      allergen: 'Morphine',
      reaction: 'Nausea and vomiting',
      severity: 'mild'
    }
  ],
  5: [
    {
      type: 'drug',
      allergen: 'Iodine contrast',
      reaction: 'Anaphylaxis',
      severity: 'severe'
    }
  ],
  7: [
    {
      type: 'drug',
      allergen: 'ACE inhibitors',
      reaction: 'Angioedema',
      severity: 'severe'
    }
  ],
  10: [
    {
      type: 'drug',
      allergen: 'Latex',
      reaction: 'Contact dermatitis',
      severity: 'moderate'
    }
  ]
}

// Mock medications for patients with various statuses, dosages, and routes
export const mockPatientMedications: { [patientId: number]: Medication[] } = {
  // Patient 1: Restituto Arapipap - Respiratory failure/pneumonia
  1: [
    {
      id: 'med-001',
      patientId: 1,
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      dosage: { amount: 875, unit: 'mg' },
      frequency: { times: 2, period: 'daily' },
      route: 'oral',
      startDate: '2024-03-15',
      duration: { amount: 10, unit: 'days' },
      status: 'active',
      prescribedBy: mockPrescriber,
      indication: 'Community Acquired Pneumonia',
      notes: 'Take with food to reduce GI upset',
      createdAt: '2024-03-15T08:00:00Z',
      updatedAt: '2024-03-15T08:00:00Z',
      isWeightBased: true,
      dosePerKg: 25,
      calculatedDose: {
        patientWeight: 70,
        calculatedAmount: 875,
        formula: '25 mg/kg × 70 kg = 1750 mg/day (divided into 2 doses)'
      }
    },
    {
      id: 'med-002',
      patientId: 1,
      name: 'Prednisone',
      genericName: 'Prednisone',
      dosage: { amount: 40, unit: 'mg' },
      frequency: { times: 1, period: 'daily' },
      route: 'oral',
      startDate: '2024-03-16',
      duration: { amount: 5, unit: 'days' },
      status: 'active',
      prescribedBy: mockPrescriber,
      indication: 'Respiratory inflammation',
      notes: 'Taper dose after 5 days',
      createdAt: '2024-03-16T09:00:00Z',
      updatedAt: '2024-03-16T09:00:00Z'
    },
    {
      id: 'med-003',
      patientId: 1,
      name: 'Furosemide',
      genericName: 'Furosemide',
      dosage: { amount: 40, unit: 'mg' },
      frequency: { times: 1, period: 'daily' },
      route: 'IV',
      startDate: '2024-03-15',
      endDate: '2024-03-18',
      status: 'discontinued',
      prescribedBy: mockPrescriber,
      indication: 'Fluid overload',
      discontinuationReason: 'Patient improved, switched to oral',
      createdAt: '2024-03-15T10:00:00Z',
      updatedAt: '2024-03-18T10:00:00Z'
    }
  ],

  // Patient 2: Jane Smith - Respiratory failure (discharged)
  2: [
    {
      id: 'med-004',
      patientId: 2,
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      dosage: { amount: 10, unit: 'mg' },
      frequency: { times: 1, period: 'daily' },
      route: 'oral',
      startDate: '2024-03-10',
      status: 'completed',
      prescribedBy: mockPrescriber,
      indication: 'Hypertension',
      createdAt: '2024-03-10T08:00:00Z',
      updatedAt: '2024-03-20T08:00:00Z'
    }
  ],

  // Patient 3: Robert Johnson - Septic shock
  3: [
    {
      id: 'med-005',
      patientId: 3,
      name: 'Morphine',
      genericName: 'Morphine',
      dosage: { amount: 2, unit: 'mg' },
      frequency: { times: 4, period: 'daily' },
      route: 'IV',
      startDate: '2024-03-05',
      endDate: '2024-03-12',
      status: 'discontinued',
      prescribedBy: mockPrescriber,
      indication: 'Pain management',
      discontinuationReason: 'Patient discharged',
      createdAt: '2024-03-05T08:00:00Z',
      updatedAt: '2024-03-12T08:00:00Z',
      allergyWarnings: ['Patient allergic to morphine - mild reaction']
    },
    {
      id: 'med-006',
      patientId: 3,
      name: 'Furosemide',
      genericName: 'Furosemide',
      dosage: { amount: 80, unit: 'mg' },
      frequency: { times: 2, period: 'daily' },
      route: 'IV',
      startDate: '2024-03-06',
      endDate: '2024-03-10',
      status: 'discontinued',
      prescribedBy: mockPrescriber,
      indication: 'Fluid overload secondary to sepsis',
      discontinuationReason: 'Fluid balance achieved',
      createdAt: '2024-03-06T08:00:00Z',
      updatedAt: '2024-03-10T08:00:00Z'
    }
  ],

  // Patient 5: Michael Wilson - CVD Infarct (active)
  5: [
    {
      id: 'med-007',
      patientId: 5,
      name: 'Atorvastatin',
      genericName: 'Atorvastatin',
      dosage: { amount: 80, unit: 'mg' },
      frequency: { times: 1, period: 'daily' },
      route: 'oral',
      startDate: '2024-03-12',
      status: 'active',
      prescribedBy: mockPrescriber,
      indication: 'Post-stroke cholesterol management',
      notes: 'High-intensity statin therapy',
      createdAt: '2024-03-12T08:00:00Z',
      updatedAt: '2024-03-12T08:00:00Z'
    },
    {
      id: 'med-008',
      patientId: 5,
      name: 'Warfarin',
      genericName: 'Warfarin',
      dosage: { amount: 5, unit: 'mg' },
      frequency: { times: 1, period: 'daily' },
      route: 'oral',
      startDate: '2024-03-13',
      status: 'active',
      prescribedBy: mockPrescriber,
      indication: 'Stroke prevention',
      notes: 'Monitor INR regularly, target 2.0-3.0',
      createdAt: '2024-03-13T08:00:00Z',
      updatedAt: '2024-03-13T08:00:00Z'
    }
  ],

  // Patient 7: James Rodriguez - Heart failure
  7: [
    {
      id: 'med-009',
      patientId: 7,
      name: 'Furosemide',
      genericName: 'Furosemide',
      dosage: { amount: 40, unit: 'mg' },
      frequency: { times: 2, period: 'daily' },
      route: 'oral',
      startDate: '2024-03-17',
      status: 'active',
      prescribedBy: mockPrescriber,
      indication: 'Heart failure fluid management',
      notes: 'Monitor electrolytes and kidney function',
      createdAt: '2024-03-17T08:00:00Z',
      updatedAt: '2024-03-17T08:00:00Z'
    },
    {
      id: 'med-010',
      patientId: 7,
      name: 'Metformin',
      genericName: 'Metformin',
      dosage: { amount: 1000, unit: 'mg' },
      frequency: { times: 2, period: 'daily' },
      route: 'oral',
      startDate: '2024-03-17',
      status: 'on-hold',
      prescribedBy: mockPrescriber,
      indication: 'Diabetes management',
      notes: 'Held due to kidney function concerns',
      createdAt: '2024-03-17T08:00:00Z',
      updatedAt: '2024-03-20T08:00:00Z'
    }
  ],

  // Patient 9: David Kim - Kidney injury (pediatric patient)
  9: [
    {
      id: 'med-011',
      patientId: 9,
      name: 'Insulin',
      genericName: 'Insulin',
      dosage: { amount: 2, unit: 'units' },
      frequency: { times: 4, period: 'daily' },
      route: 'IV',
      startDate: '2024-03-19',
      status: 'active',
      prescribedBy: mockPrescriber,
      indication: 'Diabetes management in CKD',
      notes: 'Sliding scale protocol, monitor glucose closely',
      createdAt: '2024-03-19T08:00:00Z',
      updatedAt: '2024-03-19T08:00:00Z',
      isWeightBased: true,
      dosePerKg: 0.5,
      calculatedDose: {
        patientWeight: 4,
        calculatedAmount: 2,
        formula: '0.5 units/kg × 4 kg = 2 units per dose'
      }
    }
  ],

  // Patient 10: Lisa Patel - Cholecystitis
  10: [
    {
      id: 'med-012',
      patientId: 10,
      name: 'Morphine',
      genericName: 'Morphine',
      dosage: { amount: 4, unit: 'mg' },
      frequency: { times: 6, period: 'daily' },
      route: 'IV',
      startDate: '2024-03-16',
      status: 'active',
      prescribedBy: mockPrescriber,
      indication: 'Post-operative pain management',
      notes: 'PRN for severe pain, assess pain scale before administration',
      createdAt: '2024-03-16T08:00:00Z',
      updatedAt: '2024-03-16T08:00:00Z'
    }
  ],

  // Patient 13: Carlos Martinez - COPD exacerbation
  13: [
    {
      id: 'med-013',
      patientId: 13,
      name: 'Prednisone',
      genericName: 'Prednisone',
      dosage: { amount: 40, unit: 'mg' },
      frequency: { times: 1, period: 'daily' },
      route: 'oral',
      startDate: '2024-03-22',
      duration: { amount: 5, unit: 'days' },
      status: 'active',
      prescribedBy: mockPrescriber,
      indication: 'COPD exacerbation',
      notes: 'Short course, no taper needed',
      createdAt: '2024-03-22T08:00:00Z',
      updatedAt: '2024-03-22T08:00:00Z'
    }
  ],

  // Patient 14: Emma Thompson - Colorectal cancer
  14: [
    {
      id: 'med-014',
      patientId: 14,
      name: 'Morphine',
      genericName: 'Morphine',
      dosage: { amount: 15, unit: 'mg' },
      frequency: { times: 4, period: 'daily' },
      route: 'oral',
      startDate: '2024-03-23',
      status: 'active',
      prescribedBy: mockPrescriber,
      indication: 'Cancer pain management',
      notes: 'Long-acting formulation, breakthrough pain PRN',
      createdAt: '2024-03-23T08:00:00Z',
      updatedAt: '2024-03-23T08:00:00Z'
    },
    {
      id: 'med-015',
      patientId: 14,
      name: 'Prednisone',
      genericName: 'Prednisone',
      dosage: { amount: 20, unit: 'mg' },
      frequency: { times: 1, period: 'daily' },
      route: 'oral',
      startDate: '2024-03-23',
      status: 'active',
      prescribedBy: mockPrescriber,
      indication: 'Anti-inflammatory for cancer treatment',
      notes: 'Long-term therapy, monitor for side effects',
      createdAt: '2024-03-23T08:00:00Z',
      updatedAt: '2024-03-23T08:00:00Z'
    }
  ]
}