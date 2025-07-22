import type { 
  ChartEntry, 
  ChartEntryType, 
  AdmissionNoteData, 
  ProcedureNoteData,
  DischargeSummaryData,
  ConsultationNoteData,
  EmergencyNoteData,
  ValidationRule,
  AutoPopulationSource,
  ChartEntryTypeConfig
} from '../patient'

describe('Patient Type Definitions', () => {
  describe('ChartEntryType', () => {
    it('should include all expected chart entry types', () => {
      const validTypes: ChartEntryType[] = [
        'progress_note',
        'admission_note', 
        'procedure_note',
        'discharge_summary',
        'consultation_note',
        'emergency_note',
        'quick_note'
      ]
      
      // This test passes if TypeScript compilation succeeds
      expect(validTypes).toHaveLength(7)
    })
  })

  describe('ChartEntry Interface', () => {
    it('should create a valid chart entry with required fields', () => {
      const chartEntry: ChartEntry = {
        id: 'test-id',
        timestamp: '2024-03-20T10:00:00Z',
        type: 'progress_note',
        templateVersion: '1.0',
        subjective: 'Patient reports feeling better',
        objective: 'Vital signs stable',
        assessment: 'Improving condition',
        plan: 'Continue current treatment',
        createdBy: {
          name: 'Dr. Test',
          role: 'Doctor',
          id: 'dr-test'
        },
        metadata: {
          requiredFieldsCompleted: true,
          lastModified: '2024-03-20T10:00:00Z',
          wordCount: 20,
          estimatedReadTime: 1
        }
      }

      expect(chartEntry.type).toBe('progress_note')
      expect(chartEntry.createdBy.id).toBe('dr-test')
      expect(chartEntry.metadata.requiredFieldsCompleted).toBe(true)
    })

    it('should support structured data for different entry types', () => {
      const admissionEntry: ChartEntry = {
        id: 'admission-1',
        timestamp: '2024-03-20T10:00:00Z',
        type: 'admission_note',
        templateVersion: '1.0',
        subjective: 'Patient admitted with chest pain',
        objective: 'BP 140/90, HR 85',
        assessment: 'Rule out MI',
        plan: 'Serial EKGs, cardiac enzymes',
        createdBy: {
          name: 'Dr. Test',
          role: 'Doctor',
          id: 'dr-test'
        },
        metadata: {
          requiredFieldsCompleted: true,
          lastModified: '2024-03-20T10:00:00Z',
          wordCount: 30,
          estimatedReadTime: 1
        },
        structuredData: {
          admissionNote: {
            historyOfPresentIllness: 'Chest pain started 2 hours ago',
            pastMedicalHistory: 'HTN, DM',
            socialHistory: 'Non-smoker',
            familyHistory: 'Father had MI at 65',
            reviewOfSystems: {
              cardiovascular: 'Chest pain, no palpitations',
              respiratory: 'No SOB'
            },
            physicalExamination: {
              cardiovascular: 'RRR, no murmurs',
              respiratory: 'Clear to auscultation'
            },
            admissionDiagnoses: ['Chest pain, rule out MI'],
            initialOrders: ['EKG', 'Troponin', 'CBC', 'BMP']
          }
        }
      }

      expect(admissionEntry.structuredData?.admissionNote?.historyOfPresentIllness).toBe('Chest pain started 2 hours ago')
      expect(admissionEntry.structuredData?.admissionNote?.admissionDiagnoses).toContain('Chest pain, rule out MI')
    })
  })

  describe('Template-specific Data Interfaces', () => {
    it('should create valid AdmissionNoteData', () => {
      const admissionData: AdmissionNoteData = {
        historyOfPresentIllness: 'Test HPI',
        pastMedicalHistory: 'Test PMH',
        socialHistory: 'Test SH',
        familyHistory: 'Test FH',
        reviewOfSystems: {
          cardiovascular: 'Normal',
          respiratory: 'Normal'
        },
        physicalExamination: {
          general: 'Well-appearing',
          cardiovascular: 'RRR'
        },
        admissionDiagnoses: ['Diagnosis 1'],
        initialOrders: ['Order 1', 'Order 2']
      }

      expect(admissionData.historyOfPresentIllness).toBe('Test HPI')
      expect(admissionData.admissionDiagnoses).toHaveLength(1)
    })

    it('should create valid ProcedureNoteData', () => {
      const procedureData: ProcedureNoteData = {
        indication: 'Diagnostic procedure',
        procedureName: 'Colonoscopy',
        procedureDescription: 'Complete colonoscopy performed',
        findings: 'Normal mucosa',
        complications: 'None',
        postProcedurePlan: 'Routine follow-up',
        informedConsent: true,
        timeStarted: '10:00',
        timeCompleted: '10:30',
        assistants: ['Nurse Smith'],
        suggestedCptCodes: ['45378']
      }

      expect(procedureData.informedConsent).toBe(true)
      expect(procedureData.suggestedCptCodes).toContain('45378')
    })
  })

  describe('Validation and Auto-population Interfaces', () => {
    it('should create valid ValidationRule', () => {
      const rule: ValidationRule = {
        field: 'subjective',
        type: 'required',
        message: 'Subjective field is required',
        severity: 'error'
      }

      expect(rule.severity).toBe('error')
      expect(rule.type).toBe('required')
    })

    it('should create valid AutoPopulationSource', () => {
      const source: AutoPopulationSource = {
        field: 'objective',
        source: 'vitals',
        transform: (data) => `Vitals: ${JSON.stringify(data)}`,
        conditions: ['patient_has_vitals']
      }

      expect(source.source).toBe('vitals')
      expect(source.conditions).toContain('patient_has_vitals')
    })

    it('should create valid ChartEntryTypeConfig', () => {
      const config: ChartEntryTypeConfig = {
        type: 'progress_note',
        displayName: 'Progress Note',
        description: 'Daily progress documentation',
        icon: 'file-text',
        color: 'blue',
        requiredFields: ['subjective', 'objective'],
        optionalFields: ['chiefComplaint'],
        validationRules: [],
        autoPopulationSources: []
      }

      expect(config.type).toBe('progress_note')
      expect(config.requiredFields).toContain('subjective')
    })
  })
})