// Chart Entry Type Configuration System
export {
  ChartEntryTypeRegistry,
  CHART_ENTRY_TYPE_CONFIGS
} from './chartEntryTypes';

// Validation System
export {
  ChartEntryValidationEngine,
  chartEntryValidator,
  validateChartEntry,
  validateForSave,
  checkRequiredFields
} from '../utils/chartEntryValidation';

export type {
  ValidationResult,
  ValidationError
} from '../utils/chartEntryValidation';

// Auto-Population System
export {
  ChartEntryAutoPopulationEngine,
  chartEntryAutoPopulator,
  autoPopulateEntry,
  applyAutoPopulation,
  getFieldSuggestions
} from '../utils/chartEntryAutoPopulation';

export type {
  AutoPopulationContext,
  AutoPopulationResult
} from '../utils/chartEntryAutoPopulation';

// Re-export relevant types from patient.ts
export type {
  ChartEntryType,
  ChartEntryTypeConfig,
  ValidationRule,
  AutoPopulationSource,
  ChartEntry,
  AdmissionNoteData,
  ProcedureNoteData,
  DischargeSummaryData,
  ConsultationNoteData,
  EmergencyNoteData
} from '../types/patient';