import { ChartEntry, ChartEntryType, Patient, AutoPopulationSource } from '../types/patient';
import { ChartEntryTypeRegistry } from '../config/chartEntryTypes';

export interface AutoPopulationContext {
  patient: Patient;
  existingEntries: ChartEntry[];
  currentEntry?: Partial<ChartEntry>;
}

export interface AutoPopulationResult {
  field: string;
  value: any;
  source: string;
  confidence: number; // 0-1 scale
  timestamp: string;
}

export class ChartEntryAutoPopulationEngine {
  private registry: ChartEntryTypeRegistry;

  constructor() {
    this.registry = ChartEntryTypeRegistry.getInstance();
  }

  /**
   * Auto-populates fields for a chart entry based on available data
   */
  public autoPopulateEntry(
    entryType: ChartEntryType,
    context: AutoPopulationContext
  ): AutoPopulationResult[] {
    const autoPopulationSources = this.registry.getAutoPopulationSources(entryType);
    const results: AutoPopulationResult[] = [];

    for (const source of autoPopulationSources) {
      const result = this.populateFromSource(source, context);
      if (result) {
        results.push(result);
      }
    }

    return results;
  }

  /**
   * Populates a specific field from a data source
   */
  private populateFromSource(
    source: AutoPopulationSource,
    context: AutoPopulationContext
  ): AutoPopulationResult | null {
    try {
      let sourceData: any;
      let confidence = 1.0;

      // Get data based on source type
      switch (source.source) {
        case 'vitals':
          sourceData = context.patient.lastVitals;
          if (sourceData) {
            confidence = this.calculateVitalsConfidence(sourceData.timestamp);
          }
          break;

        case 'labs':
          // For now, we'll simulate lab data since it's not in the current Patient interface
          sourceData = this.getRecentLabData(context.patient);
          confidence = 0.8; // Lower confidence for simulated data
          break;

        case 'medications':
          sourceData = context.patient.medications?.filter(med => med.status === 'active') || [];
          confidence = 0.9;
          break;

        case 'allergies':
          sourceData = context.patient.allergies || [];
          confidence = 1.0;
          break;

        case 'previous_notes':
          sourceData = context.existingEntries || [];
          confidence = 0.7; // Lower confidence for derived data
          break;

        default:
          return null;
      }

      // Check conditions if specified
      if (source.conditions && !this.checkConditions(source.conditions, sourceData, context)) {
        return null;
      }

      // Transform data if transform function is provided
      let value: any;
      if (source.transform && sourceData) {
        value = source.transform(sourceData);
      } else {
        value = sourceData;
      }

      // Only return result if we have a meaningful value
      if (value !== null && value !== undefined && value !== '') {
        return {
          field: source.field,
          value,
          source: source.source,
          confidence,
          timestamp: new Date().toISOString()
        };
      }

      return null;
    } catch (error) {
      console.warn(`Auto-population failed for field ${source.field}:`, error);
      return null;
    }
  }

  /**
   * Calculates confidence score for vitals based on how recent they are
   */
  private calculateVitalsConfidence(vitalsTimestamp: string): number {
    const now = new Date();
    const vitalsDate = new Date(vitalsTimestamp);
    const hoursDiff = (now.getTime() - vitalsDate.getTime()) / (1000 * 60 * 60);

    if (hoursDiff <= 1) return 1.0;
    if (hoursDiff <= 6) return 0.9;
    if (hoursDiff <= 12) return 0.8;
    if (hoursDiff <= 24) return 0.7;
    if (hoursDiff <= 48) return 0.5;
    return 0.3;
  }

  /**
   * Simulates recent lab data (placeholder for actual lab integration)
   */
  private getRecentLabData(patient: Patient): any[] {
    // This would be replaced with actual lab data retrieval
    // For now, return empty array to avoid errors
    return [];
  }

  /**
   * Checks if conditions are met for auto-population
   */
  private checkConditions(
    conditions: string[],
    sourceData: any,
    context: AutoPopulationContext
  ): boolean {
    for (const condition of conditions) {
      if (!this.evaluateCondition(condition, sourceData, context)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Evaluates a single condition
   */
  private evaluateCondition(
    condition: string,
    sourceData: any,
    context: AutoPopulationContext
  ): boolean {
    try {
      // Simple condition parsing - in a real implementation, this would be more sophisticated
      if (condition.includes('within 24 hours')) {
        if (sourceData && sourceData.timestamp) {
          const dataDate = new Date(sourceData.timestamp);
          const now = new Date();
          const hoursDiff = (now.getTime() - dataDate.getTime()) / (1000 * 60 * 60);
          return hoursDiff <= 24;
        }
        return false;
      }

      if (condition.includes('within 48 hours')) {
        if (sourceData && sourceData.timestamp) {
          const dataDate = new Date(sourceData.timestamp);
          const now = new Date();
          const hoursDiff = (now.getTime() - dataDate.getTime()) / (1000 * 60 * 60);
          return hoursDiff <= 48;
        }
        return false;
      }

      if (condition.includes('active medications exist')) {
        return Array.isArray(sourceData) && sourceData.length > 0;
      }

      if (condition.includes('previous admission notes exist')) {
        return Array.isArray(sourceData) && 
               sourceData.some(entry => entry.type === 'admission_note');
      }

      if (condition.includes('recent progress notes exist')) {
        return Array.isArray(sourceData) && 
               sourceData.some(entry => entry.type === 'progress_note');
      }

      if (condition.includes('creating new')) {
        return !context.currentEntry?.id; // New entry if no ID exists
      }

      // Default to true for unknown conditions to avoid blocking
      return true;
    } catch (error) {
      console.warn(`Condition evaluation failed for: ${condition}`, error);
      return false;
    }
  }

  /**
   * Applies auto-population results to an entry
   */
  public applyAutoPopulation(
    entry: Partial<ChartEntry>,
    results: AutoPopulationResult[]
  ): Partial<ChartEntry> {
    const updatedEntry = { ...entry };

    for (const result of results) {
      // Only apply if the field is currently empty
      const currentValue = this.getFieldValue(updatedEntry, result.field);
      if (this.isEmpty(currentValue)) {
        this.setFieldValue(updatedEntry, result.field, result.value);
      }
    }

    return updatedEntry;
  }

  /**
   * Gets the value of a field using dot notation
   */
  private getFieldValue(entry: Partial<ChartEntry>, fieldPath: string): any {
    const parts = fieldPath.split('.');
    let value: any = entry;

    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return undefined;
      }
    }

    return value;
  }

  /**
   * Sets the value of a field using dot notation
   */
  private setFieldValue(entry: Partial<ChartEntry>, fieldPath: string, value: any): void {
    const parts = fieldPath.split('.');
    let current: any = entry;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current) || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part];
    }

    current[parts[parts.length - 1]] = value;
  }

  /**
   * Checks if a value is considered empty
   */
  private isEmpty(value: any): boolean {
    if (value === null || value === undefined) {
      return true;
    }

    if (typeof value === 'string') {
      return value.trim().length === 0;
    }

    if (Array.isArray(value)) {
      return value.length === 0;
    }

    if (typeof value === 'object') {
      return Object.keys(value).length === 0;
    }

    return false;
  }

  /**
   * Gets auto-population suggestions for a specific field
   */
  public getFieldSuggestions(
    field: string,
    entryType: ChartEntryType,
    context: AutoPopulationContext
  ): AutoPopulationResult[] {
    const autoPopulationSources = this.registry.getAutoPopulationSources(entryType);
    const relevantSources = autoPopulationSources.filter(source => source.field === field);
    const results: AutoPopulationResult[] = [];

    for (const source of relevantSources) {
      const result = this.populateFromSource(source, context);
      if (result) {
        results.push(result);
      }
    }

    return results;
  }
}

// Singleton instance for easy access
export const chartEntryAutoPopulator = new ChartEntryAutoPopulationEngine();

// Utility functions for common auto-population scenarios
export const autoPopulateEntry = (
  entryType: ChartEntryType,
  context: AutoPopulationContext
): AutoPopulationResult[] => {
  return chartEntryAutoPopulator.autoPopulateEntry(entryType, context);
};

export const applyAutoPopulation = (
  entry: Partial<ChartEntry>,
  results: AutoPopulationResult[]
): Partial<ChartEntry> => {
  return chartEntryAutoPopulator.applyAutoPopulation(entry, results);
};

export const getFieldSuggestions = (
  field: string,
  entryType: ChartEntryType,
  context: AutoPopulationContext
): AutoPopulationResult[] => {
  return chartEntryAutoPopulator.getFieldSuggestions(field, entryType, context);
};