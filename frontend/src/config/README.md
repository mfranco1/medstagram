# Chart Entry Type Configuration System

This system provides a comprehensive configuration framework for different chart entry types in the medical application. It includes type definitions, validation rules, and auto-population capabilities.

## Overview

The system supports 7 different chart entry types:
- **Progress Note**: Daily progress documentation with SOAP format
- **Admission Note**: Comprehensive initial patient assessment
- **Procedure Note**: Documentation for medical procedures and interventions
- **Discharge Summary**: Comprehensive summary for patient discharge
- **Consultation Note**: Specialist consultation and recommendations
- **Emergency/Code Note**: Rapid documentation for emergency situations
- **Quick Note**: Brief documentation for simple updates

## Core Components

### 1. Chart Entry Type Registry

The registry provides centralized access to all chart entry type configurations:

```typescript
import { ChartEntryTypeRegistry } from './chartEntryTypes';

const registry = ChartEntryTypeRegistry.getInstance();

// Get configuration for a specific type
const config = registry.getConfig('progress_note');

// Get all available types
const types = registry.getAvailableTypes();

// Get display metadata
const metadata = registry.getDisplayMetadata('admission_note');
```

### 2. Validation Engine

The validation engine validates chart entries based on their type configuration:

```typescript
import { validateChartEntry, validateForSave } from '../utils/chartEntryValidation';

// Validate an entry during editing
const result = validateChartEntry(entry, 'progress_note');
if (!result.isValid) {
  console.log('Validation errors:', result.errors);
  console.log('Warnings:', result.warnings);
}

// Validate before saving
const saveResult = validateForSave(entry, 'progress_note');
if (saveResult.isValid) {
  // Safe to save
}
```

### 3. Auto-Population Engine

The auto-population engine can automatically populate fields based on available data:

```typescript
import { autoPopulateEntry, applyAutoPopulation } from '../utils/chartEntryAutoPopulation';

const context = {
  patient: currentPatient,
  existingEntries: patientChartEntries
};

// Get auto-population suggestions
const suggestions = autoPopulateEntry('progress_note', context);

// Apply suggestions to an entry
const updatedEntry = applyAutoPopulation(partialEntry, suggestions);
```

## Configuration Structure

Each chart entry type has the following configuration:

```typescript
interface ChartEntryTypeConfig {
  type: ChartEntryType;
  displayName: string;        // Human-readable name
  description: string;        // Brief description
  icon: string;              // Icon identifier
  color: string;             // Color code for UI
  requiredFields: string[];   // Required field paths
  optionalFields: string[];   // Optional field paths
  validationRules: ValidationRule[];     // Validation rules
  autoPopulationSources: AutoPopulationSource[]; // Auto-population sources
}
```

## Validation Rules

The system supports several validation rule types:

- **required**: Field must have a value
- **minLength**: Minimum character length for strings
- **maxLength**: Maximum character length for strings
- **pattern**: Regular expression pattern matching
- **custom**: Custom validation logic

Example validation rule:
```typescript
{
  field: 'subjective',
  type: 'required',
  message: 'Subjective findings are required for progress notes',
  severity: 'error'
}
```

## Auto-Population Sources

Auto-population can pull data from various sources:

- **vitals**: Recent vital signs
- **labs**: Laboratory results
- **medications**: Active medications
- **allergies**: Patient allergies
- **previous_notes**: Previous chart entries

Example auto-population source:
```typescript
{
  field: 'objective',
  source: 'vitals',
  transform: (vitals) => `Vitals: T ${vitals.temperature}°C, BP ${vitals.bloodPressure?.systolic}/${vitals.bloodPressure?.diastolic}`,
  conditions: ['vitals.timestamp within 24 hours']
}
```

## Usage Examples

### Creating a New Chart Entry with Validation

```typescript
import { 
  validateChartEntry, 
  autoPopulateEntry, 
  applyAutoPopulation 
} from '../config';

// Start with basic entry data
let entry = {
  type: 'progress_note',
  timestamp: new Date().toISOString(),
  createdBy: currentUser
};

// Auto-populate available fields
const context = { patient, existingEntries };
const suggestions = autoPopulateEntry('progress_note', context);
entry = applyAutoPopulation(entry, suggestions);

// Validate as user fills in fields
const validation = validateChartEntry(entry, 'progress_note');
if (!validation.isValid) {
  // Show validation errors to user
  displayValidationErrors(validation.errors);
}
```

### Getting Display Information for UI

```typescript
import { ChartEntryTypeRegistry } from '../config';

const registry = ChartEntryTypeRegistry.getInstance();

// Build entry type selector
const entryTypes = registry.getAvailableTypes().map(type => {
  const metadata = registry.getDisplayMetadata(type);
  return {
    type,
    ...metadata
  };
});

// Render selector with icons and colors
entryTypes.forEach(({ type, displayName, description, icon, color }) => {
  renderEntryTypeOption(type, displayName, description, icon, color);
});
```

### Field-Specific Auto-Population

```typescript
import { getFieldSuggestions } from '../config';

// Get suggestions for a specific field
const suggestions = getFieldSuggestions(
  'objective', 
  'progress_note', 
  { patient, existingEntries }
);

// Show suggestions to user
suggestions.forEach(suggestion => {
  showSuggestion(suggestion.value, suggestion.confidence);
});
```

## Testing

The system includes comprehensive tests for all components:

```bash
# Run all chart entry type tests
npm test -- --run src/config/__tests__/chartEntryTypes.test.ts
npm test -- --run src/utils/__tests__/chartEntryValidation.test.ts
npm test -- --run src/utils/__tests__/chartEntryAutoPopulation.test.ts
```

## Extending the System

### Adding a New Chart Entry Type

1. Add the new type to the `ChartEntryType` union in `types/patient.ts`
2. Create the structured data interface if needed
3. Add configuration to `CHART_ENTRY_TYPE_CONFIGS`
4. Add validation rules and auto-population sources
5. Write tests for the new type

### Adding New Validation Rules

1. Extend the validation engine in `chartEntryValidation.ts`
2. Add the new rule type to the `ValidationRule` interface
3. Implement validation logic in `validateField` method
4. Add tests for the new validation rule

### Adding New Auto-Population Sources

1. Add the new source type to `AutoPopulationSource` interface
2. Implement data retrieval logic in `populateFromSource` method
3. Add condition evaluation logic if needed
4. Add tests for the new auto-population source

## Performance Considerations

- The registry uses singleton pattern for efficient access
- Validation is performed incrementally to avoid blocking UI
- Auto-population uses confidence scoring to prioritize suggestions
- Transform functions are cached where possible

## Security Considerations

- All user input is validated before processing
- Auto-population sources are sanitized
- Field paths are validated to prevent injection attacks
- Sensitive data is handled according to HIPAA requirements