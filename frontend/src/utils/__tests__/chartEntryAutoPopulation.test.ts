import { ChartEntryAutoPopulationEngine, autoPopulateEntry, applyAutoPopulation, getFieldSuggestions } from '../chartEntryAutoPopulation';
import { Patient, ChartEntry, ChartEntryType } from '../../types/patient';

describe('ChartEntryAutoPopulationEngine', () => {
  let engine: ChartEntryAutoPopulationEngine;
  let mockPatient: Patient;
  let mockExistingEntries: ChartEntry[];

  beforeEach(() => {
    engine = new ChartEntryAutoPopulationEngine();
    
    mockPatient = {
      id: 1,
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      caseNumber: 'CASE001',
      dateAdmitted: '2024-01-15',
      location: 'Room 101',
      status: 'admitted',
      diagnosis: 'Chest pain',
      dateOfBirth: '1979-01-15',
      civilStatus: 'Married',
      nationality: 'American',
      religion: 'Christian',
      address: '123 Main St',
      philhealth: 'PH123456',
      primaryService: 'Internal Medicine',
      lastVitals: {
        temperature: 37.2,
        bloodPressure: {
          systolic: 120,
          diastolic: 80
        },
        heartRate: 72,
        respiratoryRate: 16,
        oxygenSaturation: 98,
        gcs: {
          eye: 4,
          verbal: 5,
          motor: 6,
          total: 15
        },
        timestamp: new Date().toISOString() // Recent vitals
      },
      medications: [
        {
          id: 'med1',
          patientId: 1,
          name: 'Lisinopril',
          dosage: { amount: 10, unit: 'mg' },
          frequency: { times: 1, period: 'daily' },
          route: 'oral',
          startDate: '2024-01-15',
          status: 'active',
          prescribedBy: { id: 'doc1', name: 'Dr. Smith' },
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        }
      ],
      allergies: [
        {
          type: 'drug',
          allergen: 'Penicillin',
          reaction: 'Rash',
          severity: 'moderate'
        }
      ]
    } as Patient;

    mockExistingEntries = [
      {
        id: 'entry1',
        timestamp: '2024-01-15T08:00:00Z',
        type: 'admission_note',
        templateVersion: '1.0',
        subjective: 'Patient admitted with chest pain',
        objective: 'Vitals stable',
        assessment: 'Rule out MI',
        plan: 'Serial ECGs, cardiac enzymes',
        createdBy: {
          name: 'Dr. Smith',
          role: 'Physician',
          id: 'doc1'
        },
        structuredData: {
          admissionNote: {
            historyOfPresentIllness: 'Chest pain started 2 hours ago',
            pastMedicalHistory: 'Hypertension, diabetes',
            socialHistory: 'Non-smoker',
            familyHistory: 'Father had MI',
            reviewOfSystems: {},
            physicalExamination: {},
            admissionDiagnoses: ['Chest pain, rule out MI'],
            initialOrders: ['ECG', 'Cardiac enzymes']
          }
        },
        metadata: {
          requiredFieldsCompleted: true,
          lastModified: '2024-01-15T08:00:00Z',
          wordCount: 100,
          estimatedReadTime: 2
        }
      }
    ] as ChartEntry[];
  });

  describe('Progress Note Auto-Population', () => {
    it('should auto-populate objective section with recent vitals', () => {
      const context = {
        patient: mockPatient,
        existingEntries: mockExistingEntries
      };

      const results = engine.autoPopulateEntry('progress_note', context);
      
      const vitalsResult = results.find(result => result.source === 'vitals');
      expect(vitalsResult).toBeDefined();
      expect(vitalsResult?.field).toBe('objective');
      expect(vitalsResult?.value).toContain('T 37.2°C');
      expect(vitalsResult?.value).toContain('BP 120/80');
      expect(vitalsResult?.value).toContain('HR 72');
      expect(vitalsResult?.confidence).toBeGreaterThan(0.8); // Recent vitals should have high confidence
    });

    it('should not auto-populate when vitals are too old', () => {
      // Set vitals timestamp to 3 days ago
      const oldVitalsPatient = {
        ...mockPatient,
        lastVitals: {
          ...mockPatient.lastVitals!,
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      };

      const context = {
        patient: oldVitalsPatient,
        existingEntries: mockExistingEntries
      };

      const results = engine.autoPopulateEntry('progress_note', context);
      
      const vitalsResult = results.find(result => result.source === 'vitals');
      if (vitalsResult) {
        expect(vitalsResult.confidence).toBeLessThan(0.5); // Old vitals should have low confidence
      } else {
        // If no vitals result found, that's also acceptable for old vitals
        expect(vitalsResult).toBeUndefined();
      }
    });
  });

  describe('Admission Note Auto-Population', () => {
    it('should auto-populate past medical history from previous admission notes', () => {
      const context = {
        patient: mockPatient,
        existingEntries: mockExistingEntries
      };

      const results = engine.autoPopulateEntry('admission_note', context);
      
      const previousNotesResult = results.find(result => result.source === 'previous_notes');
      expect(previousNotesResult).toBeDefined();
      expect(previousNotesResult?.field).toBe('structuredData.admissionNote.pastMedicalHistory');
    });

    it('should auto-populate initial orders with active medications', () => {
      const context = {
        patient: mockPatient,
        existingEntries: mockExistingEntries
      };

      const results = engine.autoPopulateEntry('admission_note', context);
      
      const medicationsResult = results.find(result => result.source === 'medications');
      expect(medicationsResult).toBeDefined();
      expect(medicationsResult?.field).toBe('structuredData.admissionNote.initialOrders');
      expect(Array.isArray(medicationsResult?.value)).toBe(true);
      expect(medicationsResult?.value[0]).toContain('Lisinopril');
    });
  });

  describe('Procedure Note Auto-Population', () => {
    it('should auto-populate start time for new procedure notes', () => {
      const context = {
        patient: mockPatient,
        existingEntries: mockExistingEntries,
        currentEntry: {} // New entry without ID
      };

      const results = engine.autoPopulateEntry('procedure_note', context);
      
      const timeResult = results.find(result => 
        result.field === 'structuredData.procedureNote.timeStarted'
      );
      expect(timeResult).toBeDefined();
      expect(timeResult?.source).toBe('vitals');
      expect(new Date(timeResult?.value as string)).toBeInstanceOf(Date);
    });
  });

  describe('Discharge Summary Auto-Population', () => {
    it('should auto-populate continued medications', () => {
      const context = {
        patient: mockPatient,
        existingEntries: mockExistingEntries
      };

      const results = engine.autoPopulateEntry('discharge_summary', context);
      
      const medicationsResult = results.find(result => 
        result.field === 'structuredData.dischargeNote.dischargeMedications.continued'
      );
      expect(medicationsResult).toBeDefined();
      expect(Array.isArray(medicationsResult?.value)).toBe(true);
      expect(medicationsResult?.value[0]).toContain('Lisinopril');
    });

    it('should auto-populate discharge diagnoses from admission note', () => {
      const context = {
        patient: mockPatient,
        existingEntries: mockExistingEntries
      };

      const results = engine.autoPopulateEntry('discharge_summary', context);
      
      const diagnosesResult = results.find(result => 
        result.field === 'structuredData.dischargeNote.dischargeDiagnoses'
      );
      expect(diagnosesResult).toBeDefined();
      expect(diagnosesResult?.value).toContain('Chest pain, rule out MI');
    });
  });

  describe('Consultation Note Auto-Population', () => {
    it('should auto-populate focused history from recent progress notes', () => {
      const progressNote: ChartEntry = {
        id: 'progress1',
        timestamp: '2024-01-15T12:00:00Z',
        type: 'progress_note',
        templateVersion: '1.0',
        subjective: 'Patient reports chest pain improving',
        objective: 'Vitals stable',
        assessment: 'Chest pain resolving',
        plan: 'Continue monitoring',
        createdBy: {
          name: 'Dr. Smith',
          role: 'Physician',
          id: 'doc1'
        },
        metadata: {
          requiredFieldsCompleted: true,
          lastModified: '2024-01-15T12:00:00Z',
          wordCount: 50,
          estimatedReadTime: 1
        }
      };

      const context = {
        patient: mockPatient,
        existingEntries: [...mockExistingEntries, progressNote]
      };

      const results = engine.autoPopulateEntry('consultation_note', context);
      
      const historyResult = results.find(result => 
        result.field === 'structuredData.consultationNote.focusedHistory'
      );
      expect(historyResult).toBeDefined();
      expect(historyResult?.value).toBe('Patient reports chest pain improving');
    });
  });

  describe('Apply Auto-Population', () => {
    it('should apply auto-population results to entry', () => {
      const entry = {
        subjective: 'Patient doing well'
      };

      const results = [
        {
          field: 'objective',
          value: 'Vitals: T 37.2°C, BP 120/80',
          source: 'vitals',
          confidence: 0.9,
          timestamp: new Date().toISOString()
        }
      ];

      const updatedEntry = engine.applyAutoPopulation(entry, results);
      expect(updatedEntry.objective).toBe('Vitals: T 37.2°C, BP 120/80');
      expect(updatedEntry.subjective).toBe('Patient doing well'); // Should preserve existing data
    });

    it('should not overwrite existing field values', () => {
      const entry = {
        subjective: 'Patient doing well',
        objective: 'Existing objective data'
      };

      const results = [
        {
          field: 'objective',
          value: 'Auto-populated objective data',
          source: 'vitals',
          confidence: 0.9,
          timestamp: new Date().toISOString()
        }
      ];

      const updatedEntry = engine.applyAutoPopulation(entry, results);
      expect(updatedEntry.objective).toBe('Existing objective data'); // Should not overwrite
    });

    it('should handle nested field paths', () => {
      const entry = {};

      const results = [
        {
          field: 'structuredData.admissionNote.pastMedicalHistory',
          value: 'Hypertension, diabetes',
          source: 'previous_notes',
          confidence: 0.8,
          timestamp: new Date().toISOString()
        }
      ];

      const updatedEntry = engine.applyAutoPopulation(entry, results);
      expect(updatedEntry.structuredData?.admissionNote?.pastMedicalHistory).toBe('Hypertension, diabetes');
    });
  });

  describe('Field Suggestions', () => {
    it('should get suggestions for specific field', () => {
      const context = {
        patient: mockPatient,
        existingEntries: mockExistingEntries
      };

      const suggestions = engine.getFieldSuggestions('objective', 'progress_note', context);
      expect(suggestions.length).toBeGreaterThan(0);
      
      const vitalsSuggestion = suggestions.find(s => s.source === 'vitals');
      expect(vitalsSuggestion).toBeDefined();
      expect(vitalsSuggestion?.value).toContain('T 37.2°C');
    });

    it('should return empty array for fields without auto-population sources', () => {
      const context = {
        patient: mockPatient,
        existingEntries: mockExistingEntries
      };

      const suggestions = engine.getFieldSuggestions('assessment', 'progress_note', context);
      expect(suggestions).toHaveLength(0);
    });
  });

  describe('Utility Functions', () => {
    it('should auto-populate entry using utility function', () => {
      const context = {
        patient: mockPatient,
        existingEntries: mockExistingEntries
      };

      const results = autoPopulateEntry('progress_note', context);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should apply auto-population using utility function', () => {
      const entry = { subjective: 'Test' };
      const results = [
        {
          field: 'objective',
          value: 'Test objective',
          source: 'vitals',
          confidence: 0.9,
          timestamp: new Date().toISOString()
        }
      ];

      const updatedEntry = applyAutoPopulation(entry, results);
      expect(updatedEntry.objective).toBe('Test objective');
    });

    it('should get field suggestions using utility function', () => {
      const context = {
        patient: mockPatient,
        existingEntries: mockExistingEntries
      };

      const suggestions = getFieldSuggestions('objective', 'progress_note', context);
      expect(Array.isArray(suggestions)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing patient data gracefully', () => {
      const context = {
        patient: { ...mockPatient, lastVitals: undefined },
        existingEntries: mockExistingEntries
      };

      const results = engine.autoPopulateEntry('progress_note', context);
      // Should not throw error, may return fewer results
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle transform function errors gracefully', () => {
      const context = {
        patient: mockPatient,
        existingEntries: mockExistingEntries
      };

      // This should not throw even if transform functions encounter errors
      expect(() => {
        engine.autoPopulateEntry('admission_note', context);
      }).not.toThrow();
    });
  });
});