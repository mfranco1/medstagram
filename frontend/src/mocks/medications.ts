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
  },
  {
    id: 'med-db-011',
    name: 'Albuterol',
    genericName: 'Albuterol',
    brandNames: ['ProAir', 'Ventolin', 'Proventil'],
    category: 'Bronchodilator',
    commonDosages: [
      { amount: 90, unit: 'mcg' },
      { amount: 2.5, unit: 'mg' },
      { amount: 5, unit: 'mg' }
    ],
    routes: ['inhaler', 'nebulizer'],
    isWeightBased: false,
    adultDosing: {
      minDose: 90,
      maxDose: 720,
      commonDose: 180
    },
    contraindications: ['Hypersensitivity to albuterol'],
    commonSideEffects: ['Tremor', 'Nervousness', 'Headache', 'Tachycardia']
  },
  {
    id: 'med-db-012',
    name: 'Ipratropium',
    genericName: 'Ipratropium Bromide',
    brandNames: ['Atrovent'],
    category: 'Anticholinergic Bronchodilator',
    commonDosages: [
      { amount: 17, unit: 'mcg' },
      { amount: 0.5, unit: 'mg' }
    ],
    routes: ['inhaler', 'nebulizer'],
    isWeightBased: false,
    adultDosing: {
      minDose: 17,
      maxDose: 68,
      commonDose: 34
    },
    contraindications: ['Hypersensitivity to ipratropium', 'Narrow-angle glaucoma'],
    commonSideEffects: ['Dry mouth', 'Cough', 'Upper respiratory infection', 'Headache']
  },
  {
    id: 'med-db-013',
    name: 'Azithromycin',
    genericName: 'Azithromycin',
    brandNames: ['Zithromax', 'Z-Pak'],
    category: 'Antibiotic',
    commonDosages: [
      { amount: 250, unit: 'mg' },
      { amount: 500, unit: 'mg' },
      { amount: 600, unit: 'mg' }
    ],
    routes: ['oral', 'IV'],
    isWeightBased: true,
    pediatricDosing: {
      minAge: 6,
      maxAge: 18,
      dosePerKg: 10,
      maxDose: 500
    },
    adultDosing: {
      minDose: 250,
      maxDose: 600,
      commonDose: 500
    },
    contraindications: ['Macrolide allergy', 'Severe liver disease'],
    commonSideEffects: ['Nausea', 'Diarrhea', 'Abdominal pain', 'QT prolongation']
  },
  {
    id: 'med-db-014',
    name: 'Tiotropium',
    genericName: 'Tiotropium Bromide',
    brandNames: ['Spiriva'],
    category: 'Long-Acting Anticholinergic',
    commonDosages: [
      { amount: 18, unit: 'mcg' },
      { amount: 2.5, unit: 'mcg' }
    ],
    routes: ['inhaler'],
    isWeightBased: false,
    adultDosing: {
      minDose: 2.5,
      maxDose: 18,
      commonDose: 18
    },
    contraindications: ['Hypersensitivity to tiotropium', 'Narrow-angle glaucoma'],
    commonSideEffects: ['Dry mouth', 'Constipation', 'Upper respiratory infection', 'Urinary retention']
  },
  {
    id: 'med-db-015',
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    brandNames: ['Prilosec', 'Losec'],
    category: 'Proton Pump Inhibitor',
    commonDosages: [
      { amount: 10, unit: 'mg' },
      { amount: 20, unit: 'mg' },
      { amount: 40, unit: 'mg' }
    ],
    routes: ['oral'],
    isWeightBased: false,
    adultDosing: {
      minDose: 10,
      maxDose: 40,
      commonDose: 20
    },
    contraindications: ['Hypersensitivity to omeprazole', 'Concurrent rilpivirine use'],
    commonSideEffects: ['Headache', 'Nausea', 'Diarrhea', 'Vitamin B12 deficiency']
  },
  {
    id: 'med-db-016',
    name: 'Levothyroxine',
    genericName: 'Levothyroxine',
    brandNames: ['Synthroid', 'Levoxyl', 'Tirosint'],
    category: 'Thyroid Hormone',
    commonDosages: [
      { amount: 25, unit: 'mcg' },
      { amount: 50, unit: 'mcg' },
      { amount: 75, unit: 'mcg' },
      { amount: 100, unit: 'mcg' },
      { amount: 125, unit: 'mcg' }
    ],
    routes: ['oral'],
    isWeightBased: true,
    adultDosing: {
      minDose: 25,
      maxDose: 300,
      commonDose: 100
    },
    contraindications: ['Untreated adrenal insufficiency', 'Acute MI', 'Thyrotoxicosis'],
    commonSideEffects: ['Palpitations', 'Insomnia', 'Weight loss', 'Heat intolerance']
  },
  {
    id: 'med-db-017',
    name: 'Sertraline',
    genericName: 'Sertraline',
    brandNames: ['Zoloft'],
    category: 'SSRI Antidepressant',
    commonDosages: [
      { amount: 25, unit: 'mg' },
      { amount: 50, unit: 'mg' },
      { amount: 100, unit: 'mg' },
      { amount: 200, unit: 'mg' }
    ],
    routes: ['oral'],
    isWeightBased: false,
    adultDosing: {
      minDose: 25,
      maxDose: 200,
      commonDose: 50
    },
    contraindications: ['MAOI use within 14 days', 'Pimozide use'],
    commonSideEffects: ['Nausea', 'Sexual dysfunction', 'Insomnia', 'Dry mouth']
  },
  {
    id: 'med-db-018',
    name: 'Amlodipine',
    genericName: 'Amlodipine',
    brandNames: ['Norvasc'],
    category: 'Calcium Channel Blocker',
    commonDosages: [
      { amount: 2.5, unit: 'mg' },
      { amount: 5, unit: 'mg' },
      { amount: 10, unit: 'mg' }
    ],
    routes: ['oral'],
    isWeightBased: false,
    adultDosing: {
      minDose: 2.5,
      maxDose: 10,
      commonDose: 5
    },
    contraindications: ['Severe aortic stenosis', 'Cardiogenic shock'],
    commonSideEffects: ['Peripheral edema', 'Dizziness', 'Flushing', 'Fatigue']
  },
  {
    id: 'med-db-019',
    name: 'Hydrochlorothiazide',
    genericName: 'Hydrochlorothiazide',
    brandNames: ['Microzide'],
    category: 'Thiazide Diuretic',
    commonDosages: [
      { amount: 12.5, unit: 'mg' },
      { amount: 25, unit: 'mg' },
      { amount: 50, unit: 'mg' }
    ],
    routes: ['oral'],
    isWeightBased: false,
    adultDosing: {
      minDose: 12.5,
      maxDose: 100,
      commonDose: 25
    },
    contraindications: ['Anuria', 'Sulfonamide allergy'],
    commonSideEffects: ['Hyponatremia', 'Hypokalemia', 'Hyperuricemia', 'Photosensitivity']
  },
  {
    id: 'med-db-020',
    name: 'Gabapentin',
    genericName: 'Gabapentin',
    brandNames: ['Neurontin'],
    category: 'Anticonvulsant',
    commonDosages: [
      { amount: 100, unit: 'mg' },
      { amount: 300, unit: 'mg' },
      { amount: 400, unit: 'mg' },
      { amount: 600, unit: 'mg' },
      { amount: 800, unit: 'mg' }
    ],
    routes: ['oral'],
    isWeightBased: false,
    adultDosing: {
      minDose: 100,
      maxDose: 3600,
      commonDose: 300
    },
    contraindications: ['Hypersensitivity to gabapentin'],
    commonSideEffects: ['Dizziness', 'Somnolence', 'Peripheral edema', 'Ataxia']
  },
  {
    id: 'med-db-021',
    name: 'Pantoprazole',
    genericName: 'Pantoprazole',
    brandNames: ['Protonix'],
    category: 'Proton Pump Inhibitor',
    commonDosages: [
      { amount: 20, unit: 'mg' },
      { amount: 40, unit: 'mg' }
    ],
    routes: ['oral', 'IV'],
    isWeightBased: false,
    adultDosing: {
      minDose: 20,
      maxDose: 80,
      commonDose: 40
    },
    contraindications: ['Hypersensitivity to pantoprazole'],
    commonSideEffects: ['Headache', 'Diarrhea', 'Nausea', 'Abdominal pain']
  },
  {
    id: 'med-db-022',
    name: 'Tramadol',
    genericName: 'Tramadol',
    brandNames: ['Ultram', 'ConZip'],
    category: 'Opioid Analgesic',
    commonDosages: [
      { amount: 50, unit: 'mg' },
      { amount: 100, unit: 'mg' },
      { amount: 200, unit: 'mg' }
    ],
    routes: ['oral'],
    isWeightBased: false,
    adultDosing: {
      minDose: 50,
      maxDose: 400,
      commonDose: 100
    },
    contraindications: ['Severe respiratory depression', 'Acute intoxication', 'MAOI use'],
    commonSideEffects: ['Nausea', 'Dizziness', 'Constipation', 'Headache']
  },
  {
    id: 'med-db-023',
    name: 'Cephalexin',
    genericName: 'Cephalexin',
    brandNames: ['Keflex'],
    category: 'Antibiotic',
    commonDosages: [
      { amount: 250, unit: 'mg' },
      { amount: 500, unit: 'mg' },
      { amount: 750, unit: 'mg' }
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
    contraindications: ['Cephalosporin allergy'],
    commonSideEffects: ['Nausea', 'Diarrhea', 'Abdominal pain', 'Rash']
  },
  {
    id: 'med-db-024',
    name: 'Losartan',
    genericName: 'Losartan',
    brandNames: ['Cozaar'],
    category: 'ARB',
    commonDosages: [
      { amount: 25, unit: 'mg' },
      { amount: 50, unit: 'mg' },
      { amount: 100, unit: 'mg' }
    ],
    routes: ['oral'],
    isWeightBased: false,
    adultDosing: {
      minDose: 25,
      maxDose: 100,
      commonDose: 50
    },
    contraindications: ['Pregnancy', 'Bilateral renal artery stenosis'],
    commonSideEffects: ['Dizziness', 'Upper respiratory infection', 'Hyperkalemia']
  },
  {
    id: 'med-db-025',
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    brandNames: ['Advil', 'Motrin'],
    category: 'NSAID',
    commonDosages: [
      { amount: 200, unit: 'mg' },
      { amount: 400, unit: 'mg' },
      { amount: 600, unit: 'mg' },
      { amount: 800, unit: 'mg' }
    ],
    routes: ['oral'],
    isWeightBased: true,
    pediatricDosing: {
      minAge: 6,
      maxAge: 18,
      dosePerKg: 10,
      maxDose: 800
    },
    adultDosing: {
      minDose: 200,
      maxDose: 800,
      commonDose: 400
    },
    contraindications: ['Active GI bleeding', 'Severe heart failure', 'NSAID allergy'],
    commonSideEffects: ['GI upset', 'Headache', 'Dizziness', 'Fluid retention']
  },
  {
    id: 'med-db-026',
    name: 'Fluticasone',
    genericName: 'Fluticasone',
    brandNames: ['Flonase', 'Flovent'],
    category: 'Corticosteroid',
    commonDosages: [
      { amount: 44, unit: 'mcg' },
      { amount: 110, unit: 'mcg' },
      { amount: 220, unit: 'mcg' }
    ],
    routes: ['inhaler', 'nasal'],
    isWeightBased: false,
    adultDosing: {
      minDose: 44,
      maxDose: 880,
      commonDose: 220
    },
    contraindications: ['Primary treatment of status asthmaticus', 'Hypersensitivity'],
    commonSideEffects: ['Throat irritation', 'Hoarseness', 'Oral thrush', 'Nasal irritation']
  },
  {
    id: 'med-db-027',
    name: 'Montelukast',
    genericName: 'Montelukast',
    brandNames: ['Singulair'],
    category: 'Leukotriene Receptor Antagonist',
    commonDosages: [
      { amount: 4, unit: 'mg' },
      { amount: 5, unit: 'mg' },
      { amount: 10, unit: 'mg' }
    ],
    routes: ['oral'],
    isWeightBased: false,
    pediatricDosing: {
      minAge: 2,
      maxAge: 18,
      dosePerKg: 0,
      maxDose: 10
    },
    adultDosing: {
      minDose: 10,
      maxDose: 10,
      commonDose: 10
    },
    contraindications: ['Hypersensitivity to montelukast'],
    commonSideEffects: ['Headache', 'Abdominal pain', 'Cough', 'Dental pain']
  },
  {
    id: 'med-db-028',
    name: 'Digoxin',
    genericName: 'Digoxin',
    brandNames: ['Lanoxin'],
    category: 'Cardiac Glycoside',
    commonDosages: [
      { amount: 0.125, unit: 'mg' },
      { amount: 0.25, unit: 'mg' }
    ],
    routes: ['oral', 'IV'],
    isWeightBased: true,
    adultDosing: {
      minDose: 0.125,
      maxDose: 0.5,
      commonDose: 0.25
    },
    contraindications: ['Ventricular fibrillation', 'Heart block', 'Digitalis toxicity'],
    commonSideEffects: ['Nausea', 'Vomiting', 'Visual disturbances', 'Arrhythmias']
  },
  {
    id: 'med-db-029',
    name: 'Clonazepam',
    genericName: 'Clonazepam',
    brandNames: ['Klonopin'],
    category: 'Benzodiazepine',
    commonDosages: [
      { amount: 0.5, unit: 'mg' },
      { amount: 1, unit: 'mg' },
      { amount: 2, unit: 'mg' }
    ],
    routes: ['oral'],
    isWeightBased: false,
    adultDosing: {
      minDose: 0.5,
      maxDose: 20,
      commonDose: 1
    },
    contraindications: ['Severe respiratory depression', 'Acute narrow-angle glaucoma'],
    commonSideEffects: ['Drowsiness', 'Dizziness', 'Fatigue', 'Memory impairment']
  },
  {
    id: 'med-db-030',
    name: 'Ranitidine',
    genericName: 'Ranitidine',
    brandNames: ['Zantac'],
    category: 'H2 Receptor Antagonist',
    commonDosages: [
      { amount: 75, unit: 'mg' },
      { amount: 150, unit: 'mg' },
      { amount: 300, unit: 'mg' }
    ],
    routes: ['oral', 'IV'],
    isWeightBased: false,
    adultDosing: {
      minDose: 75,
      maxDose: 300,
      commonDose: 150
    },
    contraindications: ['Hypersensitivity to ranitidine'],
    commonSideEffects: ['Headache', 'Dizziness', 'Constipation', 'Diarrhea']
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

  // Patient 13: Carlos Martinez - COPD exacerbation with comorbidities
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
    },
    {
      id: 'med-016',
      patientId: 13,
      name: 'Albuterol',
      genericName: 'Albuterol',
      dosage: { amount: 2.5, unit: 'mg' },
      frequency: { times: 4, period: 'daily' },
      route: 'nebulizer',
      startDate: '2024-03-22',
      status: 'active',
      prescribedBy: mockPrescriber,
      indication: 'Bronchodilation for COPD',
      notes: 'Nebulizer treatment, PRN for shortness of breath',
      createdAt: '2024-03-22T08:30:00Z',
      updatedAt: '2024-03-22T08:30:00Z'
    },
    {
      id: 'med-017',
      patientId: 13,
      name: 'Ipratropium',
      genericName: 'Ipratropium Bromide',
      dosage: { amount: 0.5, unit: 'mg' },
      frequency: { times: 4, period: 'daily' },
      route: 'nebulizer',
      startDate: '2024-03-22',
      status: 'active',
      prescribedBy: mockPrescriber,
      indication: 'Anticholinergic bronchodilator for COPD',
      notes: 'Combined with albuterol in nebulizer',
      createdAt: '2024-03-22T08:30:00Z',
      updatedAt: '2024-03-22T08:30:00Z'
    },
    {
      id: 'med-018',
      patientId: 13,
      name: 'Azithromycin',
      genericName: 'Azithromycin',
      dosage: { amount: 500, unit: 'mg' },
      frequency: { times: 1, period: 'daily' },
      route: 'oral',
      startDate: '2024-03-22',
      duration: { amount: 5, unit: 'days' },
      status: 'active',
      prescribedBy: mockPrescriber,
      indication: 'COPD exacerbation antibiotic therapy',
      notes: 'Z-pack course for bacterial infection',
      createdAt: '2024-03-22T09:00:00Z',
      updatedAt: '2024-03-22T09:00:00Z'
    },
    {
      id: 'med-019',
      patientId: 13,
      name: 'Tiotropium',
      genericName: 'Tiotropium Bromide',
      dosage: { amount: 18, unit: 'mcg' },
      frequency: { times: 1, period: 'daily' },
      route: 'inhaler',
      startDate: '2024-03-20',
      status: 'active',
      prescribedBy: mockPrescriber,
      indication: 'Long-term COPD maintenance therapy',
      notes: 'HandiHaler device, once daily maintenance',
      createdAt: '2024-03-20T08:00:00Z',
      updatedAt: '2024-03-20T08:00:00Z'
    },
    {
      id: 'med-020',
      patientId: 13,
      name: 'Metformin',
      genericName: 'Metformin',
      dosage: { amount: 1000, unit: 'mg' },
      frequency: { times: 2, period: 'daily' },
      route: 'oral',
      startDate: '2024-02-15',
      status: 'active',
      prescribedBy: mockPrescriber,
      indication: 'Type 2 diabetes mellitus',
      notes: 'Take with meals to reduce GI upset',
      createdAt: '2024-02-15T08:00:00Z',
      updatedAt: '2024-02-15T08:00:00Z'
    },
    {
      id: 'med-021',
      patientId: 13,
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      dosage: { amount: 20, unit: 'mg' },
      frequency: { times: 1, period: 'daily' },
      route: 'oral',
      startDate: '2024-01-10',
      status: 'active',
      prescribedBy: mockPrescriber,
      indication: 'Hypertension',
      notes: 'Monitor blood pressure and kidney function',
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-10T08:00:00Z'
    },
    {
      id: 'med-022',
      patientId: 13,
      name: 'Atorvastatin',
      genericName: 'Atorvastatin',
      dosage: { amount: 40, unit: 'mg' },
      frequency: { times: 1, period: 'daily' },
      route: 'oral',
      startDate: '2024-01-10',
      status: 'active',
      prescribedBy: mockPrescriber,
      indication: 'Hyperlipidemia',
      notes: 'Take in evening, monitor liver enzymes',
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-10T08:00:00Z'
    },
    {
      id: 'med-023',
      patientId: 13,
      name: 'Aspirin',
      genericName: 'Aspirin',
      dosage: { amount: 81, unit: 'mg' },
      frequency: { times: 1, period: 'daily' },
      route: 'oral',
      startDate: '2024-01-10',
      status: 'active',
      prescribedBy: mockPrescriber,
      indication: 'Cardiovascular protection',
      notes: 'Low-dose aspirin for primary prevention',
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-10T08:00:00Z'
    },
    {
      id: 'med-024',
      patientId: 13,
      name: 'Omeprazole',
      genericName: 'Omeprazole',
      dosage: { amount: 20, unit: 'mg' },
      frequency: { times: 1, period: 'daily' },
      route: 'oral',
      startDate: '2024-01-15',
      status: 'active',
      prescribedBy: mockPrescriber,
      indication: 'GERD and gastroprotection',
      notes: 'Take before breakfast, gastroprotection with aspirin use',
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
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