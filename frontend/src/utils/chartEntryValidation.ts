import { ChartEntry, ValidationRule, ChartEntryType } from '../types/patient';
import { ChartEntryTypeRegistry } from '../config/chartEntryTypes';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  info: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  rule: ValidationRule;
}

export class ChartEntryValidationEngine {
  private registry: ChartEntryTypeRegistry;

  constructor() {
    this.registry = ChartEntryTypeRegistry.getInstance();
  }

  /**
   * Validates a chart entry based on its type configuration
   */
  public validateEntry(entry: Partial<ChartEntry>, entryType: ChartEntryType): ValidationResult {
    const validationRules = this.registry.getValidationRules(entryType);
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    const info: ValidationError[] = [];

    for (const rule of validationRules) {
      const validationError = this.validateField(entry, rule);
      if (validationError) {
        switch (validationError.severity) {
          case 'error':
            errors.push(validationError);
            break;
          case 'warning':
            warnings.push(validationError);
            break;
          case 'info':
            info.push(validationError);
            break;
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      info
    };
  }

  /**
   * Validates a specific field against a validation rule
   */
  private validateField(entry: Partial<ChartEntry>, rule: ValidationRule): ValidationError | null {
    const fieldValue = this.getFieldValue(entry, rule.field);

    switch (rule.type) {
      case 'required':
        if (this.isEmpty(fieldValue)) {
          return {
            field: rule.field,
            message: rule.message,
            severity: rule.severity,
            rule
          };
        }
        break;

      case 'minLength':
        if (typeof fieldValue === 'string' && fieldValue.length < (rule.value as number)) {
          return {
            field: rule.field,
            message: rule.message,
            severity: rule.severity,
            rule
          };
        }
        break;

      case 'maxLength':
        if (typeof fieldValue === 'string' && fieldValue.length > (rule.value as number)) {
          return {
            field: rule.field,
            message: rule.message,
            severity: rule.severity,
            rule
          };
        }
        break;

      case 'pattern':
        if (typeof fieldValue === 'string' && rule.value) {
          const regex = new RegExp(rule.value as string);
          if (!regex.test(fieldValue)) {
            return {
              field: rule.field,
              message: rule.message,
              severity: rule.severity,
              rule
            };
          }
        }
        break;

      case 'custom':
        // Custom validation logic can be implemented here
        // For now, we'll treat custom rules as informational
        if (rule.severity === 'info') {
          return {
            field: rule.field,
            message: rule.message,
            severity: rule.severity,
            rule
          };
        }
        break;
    }

    return null;
  }

  /**
   * Gets the value of a field from the entry using dot notation
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
   * Checks if a value is considered empty for validation purposes
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
   * Validates required fields completion for metadata
   */
  public checkRequiredFieldsCompletion(entry: Partial<ChartEntry>, entryType: ChartEntryType): boolean {
    const requiredFields = this.registry.getRequiredFields(entryType);
    
    for (const field of requiredFields) {
      const value = this.getFieldValue(entry, field);
      if (this.isEmpty(value)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Gets validation summary for display purposes
   */
  public getValidationSummary(validationResult: ValidationResult): string {
    const { errors, warnings, info } = validationResult;
    const parts: string[] = [];

    if (errors.length > 0) {
      parts.push(`${errors.length} error${errors.length > 1 ? 's' : ''}`);
    }

    if (warnings.length > 0) {
      parts.push(`${warnings.length} warning${warnings.length > 1 ? 's' : ''}`);
    }

    if (info.length > 0) {
      parts.push(`${info.length} suggestion${info.length > 1 ? 's' : ''}`);
    }

    if (parts.length === 0) {
      return 'All validations passed';
    }

    return parts.join(', ');
  }

  /**
   * Validates entry before saving
   */
  public validateForSave(entry: Partial<ChartEntry>, entryType: ChartEntryType): ValidationResult {
    const result = this.validateEntry(entry, entryType);
    
    // Additional save-specific validations
    if (!entry.createdBy?.id) {
      result.errors.push({
        field: 'createdBy.id',
        message: 'Author information is required',
        severity: 'error',
        rule: {
          field: 'createdBy.id',
          type: 'required',
          message: 'Author information is required',
          severity: 'error'
        }
      });
      result.isValid = false;
    }

    if (!entry.timestamp) {
      result.errors.push({
        field: 'timestamp',
        message: 'Timestamp is required',
        severity: 'error',
        rule: {
          field: 'timestamp',
          type: 'required',
          message: 'Timestamp is required',
          severity: 'error'
        }
      });
      result.isValid = false;
    }

    return result;
  }
}

// Singleton instance for easy access
export const chartEntryValidator = new ChartEntryValidationEngine();

// Utility functions for common validation scenarios
export const validateChartEntry = (entry: Partial<ChartEntry>, entryType: ChartEntryType): ValidationResult => {
  return chartEntryValidator.validateEntry(entry, entryType);
};

export const validateForSave = (entry: Partial<ChartEntry>, entryType: ChartEntryType): ValidationResult => {
  return chartEntryValidator.validateForSave(entry, entryType);
};

export const checkRequiredFields = (entry: Partial<ChartEntry>, entryType: ChartEntryType): boolean => {
  return chartEntryValidator.checkRequiredFieldsCompletion(entry, entryType);
};