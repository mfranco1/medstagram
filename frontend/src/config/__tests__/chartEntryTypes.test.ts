import { ChartEntryTypeRegistry, CHART_ENTRY_TYPE_CONFIGS } from '../chartEntryTypes';
import { ChartEntryType } from '../../types/patient';

describe('ChartEntryTypeRegistry', () => {
  let registry: ChartEntryTypeRegistry;

  beforeEach(() => {
    registry = ChartEntryTypeRegistry.getInstance();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ChartEntryTypeRegistry.getInstance();
      const instance2 = ChartEntryTypeRegistry.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Configuration Access', () => {
    it('should return configuration for valid chart entry type', () => {
      const config = registry.getConfig('progress_note');
      expect(config).toBeDefined();
      expect(config.type).toBe('progress_note');
      expect(config.displayName).toBe('Progress Note');
    });

    it('should return all configurations', () => {
      const allConfigs = registry.getAllConfigs();
      expect(Object.keys(allConfigs)).toHaveLength(7); // All 7 entry types
      expect(allConfigs.progress_note).toBeDefined();
      expect(allConfigs.admission_note).toBeDefined();
    });

    it('should return available types', () => {
      const types = registry.getAvailableTypes();
      expect(types).toContain('progress_note');
      expect(types).toContain('admission_note');
      expect(types).toContain('procedure_note');
      expect(types).toContain('discharge_summary');
      expect(types).toContain('consultation_note');
      expect(types).toContain('emergency_note');
      expect(types).toContain('quick_note');
    });
  });

  describe('Display Metadata', () => {
    it('should return display metadata for progress note', () => {
      const metadata = registry.getDisplayMetadata('progress_note');
      expect(metadata.displayName).toBe('Progress Note');
      expect(metadata.description).toBe('Daily progress documentation with SOAP format');
      expect(metadata.icon).toBe('clipboard-document-list');
      expect(metadata.color).toBe('#3B82F6');
    });

    it('should return display metadata for admission note', () => {
      const metadata = registry.getDisplayMetadata('admission_note');
      expect(metadata.displayName).toBe('Admission Note');
      expect(metadata.description).toBe('Comprehensive initial patient assessment');
      expect(metadata.icon).toBe('user-plus');
      expect(metadata.color).toBe('#10B981');
    });
  });

  describe('Validation Rules', () => {
    it('should return validation rules for progress note', () => {
      const rules = registry.getValidationRules('progress_note');
      expect(rules).toHaveLength(5);
      
      const requiredRules = rules.filter(rule => rule.type === 'required');
      expect(requiredRules).toHaveLength(4); // subjective, objective, assessment, plan
      
      const subjectiveRule = rules.find(rule => rule.field === 'subjective' && rule.type === 'required');
      expect(subjectiveRule?.message).toBe('Subjective findings are required for progress notes');
      expect(subjectiveRule?.severity).toBe('error');
    });

    it('should return validation rules for admission note', () => {
      const rules = registry.getValidationRules('admission_note');
      expect(rules.length).toBeGreaterThan(0);
      
      const historyRule = rules.find(rule => 
        rule.field === 'structuredData.admissionNote.historyOfPresentIllness' && 
        rule.type === 'required'
      );
      expect(historyRule).toBeDefined();
      expect(historyRule?.severity).toBe('error');
    });

    it('should return validation rules for procedure note', () => {
      const rules = registry.getValidationRules('procedure_note');
      expect(rules.length).toBeGreaterThan(0);
      
      const indicationRule = rules.find(rule => 
        rule.field === 'structuredData.procedureNote.indication' && 
        rule.type === 'required'
      );
      expect(indicationRule).toBeDefined();
      
      const consentRule = rules.find(rule => 
        rule.field === 'structuredData.procedureNote.informedConsent' && 
        rule.type === 'required'
      );
      expect(consentRule).toBeDefined();
    });
  });

  describe('Auto-Population Sources', () => {
    it('should return auto-population sources for progress note', () => {
      const sources = registry.getAutoPopulationSources('progress_note');
      expect(sources).toHaveLength(2);
      
      const vitalsSource = sources.find(source => source.source === 'vitals');
      expect(vitalsSource).toBeDefined();
      expect(vitalsSource?.field).toBe('objective');
      expect(vitalsSource?.conditions).toContain('vitals.timestamp within 24 hours');
      
      const labsSource = sources.find(source => source.source === 'labs');
      expect(labsSource).toBeDefined();
      expect(labsSource?.field).toBe('objective');
    });

    it('should return auto-population sources for admission note', () => {
      const sources = registry.getAutoPopulationSources('admission_note');
      expect(sources.length).toBeGreaterThan(0);
      
      const previousNotesSource = sources.find(source => source.source === 'previous_notes');
      expect(previousNotesSource).toBeDefined();
      expect(previousNotesSource?.field).toBe('structuredData.admissionNote.pastMedicalHistory');
    });

    it('should return empty array for quick note auto-population', () => {
      const sources = registry.getAutoPopulationSources('quick_note');
      expect(sources).toHaveLength(0);
    });
  });

  describe('Required and Optional Fields', () => {
    it('should return required fields for progress note', () => {
      const requiredFields = registry.getRequiredFields('progress_note');
      expect(requiredFields).toContain('subjective');
      expect(requiredFields).toContain('objective');
      expect(requiredFields).toContain('assessment');
      expect(requiredFields).toContain('plan');
    });

    it('should return optional fields for progress note', () => {
      const optionalFields = registry.getOptionalFields('progress_note');
      expect(optionalFields).toContain('chiefComplaint');
    });

    it('should return required fields for admission note', () => {
      const requiredFields = registry.getRequiredFields('admission_note');
      expect(requiredFields).toContain('structuredData.admissionNote.historyOfPresentIllness');
      expect(requiredFields).toContain('structuredData.admissionNote.pastMedicalHistory');
      expect(requiredFields).toContain('structuredData.admissionNote.physicalExamination');
      expect(requiredFields).toContain('structuredData.admissionNote.admissionDiagnoses');
    });

    it('should return required fields for procedure note', () => {
      const requiredFields = registry.getRequiredFields('procedure_note');
      expect(requiredFields).toContain('structuredData.procedureNote.indication');
      expect(requiredFields).toContain('structuredData.procedureNote.procedureName');
      expect(requiredFields).toContain('structuredData.procedureNote.informedConsent');
      expect(requiredFields).toContain('structuredData.procedureNote.timeStarted');
      expect(requiredFields).toContain('structuredData.procedureNote.timeCompleted');
    });
  });
});

describe('CHART_ENTRY_TYPE_CONFIGS', () => {
  it('should have configurations for all chart entry types', () => {
    const expectedTypes: ChartEntryType[] = [
      'progress_note',
      'admission_note', 
      'procedure_note',
      'discharge_summary',
      'consultation_note',
      'emergency_note',
      'quick_note'
    ];

    for (const type of expectedTypes) {
      expect(CHART_ENTRY_TYPE_CONFIGS[type]).toBeDefined();
      expect(CHART_ENTRY_TYPE_CONFIGS[type].type).toBe(type);
      expect(CHART_ENTRY_TYPE_CONFIGS[type].displayName).toBeTruthy();
      expect(CHART_ENTRY_TYPE_CONFIGS[type].description).toBeTruthy();
      expect(CHART_ENTRY_TYPE_CONFIGS[type].icon).toBeTruthy();
      expect(CHART_ENTRY_TYPE_CONFIGS[type].color).toBeTruthy();
      expect(Array.isArray(CHART_ENTRY_TYPE_CONFIGS[type].requiredFields)).toBe(true);
      expect(Array.isArray(CHART_ENTRY_TYPE_CONFIGS[type].optionalFields)).toBe(true);
      expect(Array.isArray(CHART_ENTRY_TYPE_CONFIGS[type].validationRules)).toBe(true);
      expect(Array.isArray(CHART_ENTRY_TYPE_CONFIGS[type].autoPopulationSources)).toBe(true);
    }
  });

  it('should have unique colors for different entry types', () => {
    const colors = Object.values(CHART_ENTRY_TYPE_CONFIGS).map(config => config.color);
    const uniqueColors = new Set(colors);
    expect(uniqueColors.size).toBe(colors.length);
  });

  it('should have unique icons for different entry types', () => {
    const icons = Object.values(CHART_ENTRY_TYPE_CONFIGS).map(config => config.icon);
    const uniqueIcons = new Set(icons);
    expect(uniqueIcons.size).toBe(icons.length);
  });

  it('should have meaningful display names', () => {
    Object.values(CHART_ENTRY_TYPE_CONFIGS).forEach(config => {
      expect(config.displayName.length).toBeGreaterThan(0);
      expect(config.displayName).not.toBe(config.type);
      expect(config.description.length).toBeGreaterThan(10);
    });
  });
});