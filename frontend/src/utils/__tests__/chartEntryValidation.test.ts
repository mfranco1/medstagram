import { ChartEntryValidationEngine, validateChartEntry, validateForSave, checkRequiredFields } from '../chartEntryValidation';
import { ChartEntry, ChartEntryType } from '../../types/patient';

describe('ChartEntryValidationEngine', () => {
  let validator: ChartEntryValidationEngine;

  beforeEach(() => {
    validator = new ChartEntryValidationEngine();
  });

  describe('Progress Note Validation', () => {
    const progressNoteType: ChartEntryType = 'progress_note';

    it('should validate complete progress note successfully', () => {
      const entry: Partial<ChartEntry> = {
        subjective: 'Patient reports feeling better today',
        objective: 'Vital signs stable, no acute distress',
        assessment: 'Improving condition',
        plan: 'Continue current treatment'
      };

      const result = validator.validateEntry(entry, progressNoteType);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for missing required fields', () => {
      const entry: Partial<ChartEntry> = {
        subjective: 'Patient reports feeling better today'
        // Missing objective, assessment, plan
      };

      const result = validator.validateEntry(entry, progressNoteType);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3); // Missing objective, assessment, plan
      
      const errorFields = result.errors.map(error => error.field);
      expect(errorFields).toContain('objective');
      expect(errorFields).toContain('assessment');
      expect(errorFields).toContain('plan');
    });

    it('should generate warning for short subjective section', () => {
      const entry: Partial<ChartEntry> = {
        subjective: 'Short', // Less than 10 characters
        objective: 'Vital signs stable, no acute distress',
        assessment: 'Improving condition',
        plan: 'Continue current treatment'
      };

      const result = validator.validateEntry(entry, progressNoteType);
      expect(result.isValid).toBe(true); // Still valid, just a warning
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].field).toBe('subjective');
      expect(result.warnings[0].message).toBe('Subjective section should be more detailed');
    });
  });

  describe('Admission Note Validation', () => {
    const admissionNoteType: ChartEntryType = 'admission_note';

    it('should validate complete admission note successfully', () => {
      const entry: Partial<ChartEntry> = {
        assessment: 'Primary diagnosis established',
        plan: 'Treatment plan initiated',
        structuredData: {
          admissionNote: {
            historyOfPresentIllness: 'Patient presented with chest pain that started 2 hours ago',
            pastMedicalHistory: 'Hypertension, diabetes mellitus type 2',
            socialHistory: 'Non-smoker, occasional alcohol use',
            familyHistory: 'Father had MI at age 65',
            reviewOfSystems: {
              cardiovascular: 'Chest pain, no palpitations',
              respiratory: 'No shortness of breath'
            },
            physicalExamination: {
              general: 'Alert and oriented, mild distress',
              cardiovascular: 'Regular rate and rhythm'
            },
            admissionDiagnoses: ['Chest pain, rule out MI'],
            initialOrders: ['ECG', 'Cardiac enzymes', 'CBC']
          }
        }
      };

      const result = validator.validateEntry(entry, admissionNoteType);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for missing required structured data', () => {
      const entry: Partial<ChartEntry> = {
        assessment: 'Primary diagnosis established',
        plan: 'Treatment plan initiated'
        // Missing structuredData
      };

      const result = validator.validateEntry(entry, admissionNoteType);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      
      const errorFields = result.errors.map(error => error.field);
      expect(errorFields).toContain('structuredData.admissionNote.historyOfPresentIllness');
      expect(errorFields).toContain('structuredData.admissionNote.pastMedicalHistory');
    });

    it('should generate warning for short history of present illness', () => {
      const entry: Partial<ChartEntry> = {
        assessment: 'Primary diagnosis established',
        plan: 'Treatment plan initiated',
        structuredData: {
          admissionNote: {
            historyOfPresentIllness: 'Short history', // Less than 50 characters
            pastMedicalHistory: 'Hypertension, diabetes mellitus type 2',
            socialHistory: 'Non-smoker',
            familyHistory: 'Unremarkable',
            reviewOfSystems: {},
            physicalExamination: {
              general: 'Alert and oriented'
            },
            admissionDiagnoses: ['Chest pain'],
            initialOrders: ['ECG']
          }
        }
      };

      const result = validator.validateEntry(entry, admissionNoteType);
      expect(result.warnings.length).toBeGreaterThan(0);
      
      const historyWarning = result.warnings.find(warning => 
        warning.field === 'structuredData.admissionNote.historyOfPresentIllness'
      );
      expect(historyWarning).toBeDefined();
      expect(historyWarning?.message).toBe('History of Present Illness should be comprehensive');
    });
  });

  describe('Procedure Note Validation', () => {
    const procedureNoteType: ChartEntryType = 'procedure_note';

    it('should validate complete procedure note successfully', () => {
      const entry: Partial<ChartEntry> = {
        structuredData: {
          procedureNote: {
            indication: 'Diagnostic evaluation',
            procedureName: 'Upper endoscopy',
            procedureDescription: 'Flexible endoscopy performed',
            findings: 'Normal mucosa throughout',
            complications: 'None',
            postProcedurePlan: 'Routine post-procedure care',
            informedConsent: true,
            timeStarted: '2024-01-15T10:00:00Z',
            timeCompleted: '2024-01-15T10:30:00Z',
            assistants: ['Nurse Smith'],
            suggestedCptCodes: ['43235']
          }
        }
      };

      const result = validator.validateEntry(entry, procedureNoteType);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for missing informed consent', () => {
      const entry: Partial<ChartEntry> = {
        structuredData: {
          procedureNote: {
            indication: 'Diagnostic evaluation',
            procedureName: 'Upper endoscopy',
            procedureDescription: 'Flexible endoscopy performed',
            findings: 'Normal mucosa throughout',
            complications: 'None',
            postProcedurePlan: 'Routine post-procedure care',
            // informedConsent missing
            timeStarted: '2024-01-15T10:00:00Z',
            timeCompleted: '2024-01-15T10:30:00Z',
            assistants: [],
            suggestedCptCodes: []
          }
        }
      };

      const result = validator.validateEntry(entry, procedureNoteType);
      expect(result.isValid).toBe(false);
      
      const consentError = result.errors.find(error => 
        error.field === 'structuredData.procedureNote.informedConsent'
      );
      expect(consentError).toBeDefined();
      expect(consentError?.message).toBe('Informed consent status must be documented');
    });
  });

  describe('Quick Note Validation', () => {
    const quickNoteType: ChartEntryType = 'quick_note';

    it('should validate simple quick note successfully', () => {
      const entry: Partial<ChartEntry> = {
        subjective: 'Patient doing well, no complaints'
      };

      const result = validator.validateEntry(entry, quickNoteType);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should generate warning for long quick note', () => {
      const longText = 'A'.repeat(600); // More than 500 characters
      const entry: Partial<ChartEntry> = {
        subjective: longText
      };

      const result = validator.validateEntry(entry, quickNoteType);
      expect(result.isValid).toBe(true); // Still valid, just a warning
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].field).toBe('subjective');
      expect(result.warnings[0].message).toContain('Quick notes should be brief');
    });
  });

  describe('Save Validation', () => {
    it('should require author information for save', () => {
      const entry: Partial<ChartEntry> = {
        subjective: 'Patient reports feeling better',
        objective: 'Vital signs stable',
        assessment: 'Improving',
        plan: 'Continue treatment',
        timestamp: '2024-01-15T10:00:00Z'
        // Missing createdBy
      };

      const result = validator.validateForSave(entry, 'progress_note');
      expect(result.isValid).toBe(false);
      
      const authorError = result.errors.find(error => error.field === 'createdBy.id');
      expect(authorError).toBeDefined();
      expect(authorError?.message).toBe('Author information is required');
    });

    it('should require timestamp for save', () => {
      const entry: Partial<ChartEntry> = {
        subjective: 'Patient reports feeling better',
        objective: 'Vital signs stable',
        assessment: 'Improving',
        plan: 'Continue treatment',
        createdBy: {
          id: 'doc123',
          name: 'Dr. Smith',
          role: 'Physician'
        }
        // Missing timestamp
      };

      const result = validator.validateForSave(entry, 'progress_note');
      expect(result.isValid).toBe(false);
      
      const timestampError = result.errors.find(error => error.field === 'timestamp');
      expect(timestampError).toBeDefined();
      expect(timestampError?.message).toBe('Timestamp is required');
    });
  });

  describe('Required Fields Completion', () => {
    it('should return true when all required fields are completed', () => {
      const entry: Partial<ChartEntry> = {
        subjective: 'Patient reports feeling better',
        objective: 'Vital signs stable',
        assessment: 'Improving',
        plan: 'Continue treatment'
      };

      const isComplete = validator.checkRequiredFieldsCompletion(entry, 'progress_note');
      expect(isComplete).toBe(true);
    });

    it('should return false when required fields are missing', () => {
      const entry: Partial<ChartEntry> = {
        subjective: 'Patient reports feeling better'
        // Missing objective, assessment, plan
      };

      const isComplete = validator.checkRequiredFieldsCompletion(entry, 'progress_note');
      expect(isComplete).toBe(false);
    });
  });

  describe('Utility Functions', () => {
    it('should validate chart entry using utility function', () => {
      const entry: Partial<ChartEntry> = {
        subjective: 'Patient doing well'
      };

      const result = validateChartEntry(entry, 'quick_note');
      expect(result.isValid).toBe(true);
    });

    it('should validate for save using utility function', () => {
      const entry: Partial<ChartEntry> = {
        subjective: 'Patient doing well',
        createdBy: {
          id: 'doc123',
          name: 'Dr. Smith',
          role: 'Physician'
        },
        timestamp: '2024-01-15T10:00:00Z'
      };

      const result = validateForSave(entry, 'quick_note');
      expect(result.isValid).toBe(true);
    });

    it('should check required fields using utility function', () => {
      const entry: Partial<ChartEntry> = {
        subjective: 'Patient doing well'
      };

      const isComplete = checkRequiredFields(entry, 'quick_note');
      expect(isComplete).toBe(true);
    });
  });
});