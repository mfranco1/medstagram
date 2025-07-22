# Design Document

## Overview

The Enhanced Chart Entry Types feature transforms the current single SOAP note interface into a comprehensive clinical documentation system with multiple specialized templates. This design introduces a template-driven architecture that provides structured, context-aware documentation tools while maintaining the flexibility healthcare providers need.

The system will support six primary chart entry types: Progress Notes, Admission Notes, Procedure Notes, Discharge Summaries, Consultation Notes, and Emergency/Code Notes. Each type will have its own template structure, validation rules, and visual presentation, while sharing common functionality for creation, editing, and display.

## Architecture

### Component Hierarchy
```
ChartTab
├── ChartEntryTypeSelector (new)
├── ChartEntryList (enhanced)
│   └── ChartEntryCard (enhanced with type indicators)
├── ChartEntryModal (refactored)
│   ├── ProgressNoteTemplate (new)
│   ├── AdmissionNoteTemplate (new)
│   ├── ProcedureNoteTemplate (new)
│   ├── DischargeSummaryTemplate (new)
│   ├── ConsultationNoteTemplate (new)
│   └── EmergencyNoteTemplate (new)
└── QuickNoteModal (existing, enhanced)
```

### Data Flow
1. User selects chart entry type from selector
2. Appropriate template component loads with pre-configured fields
3. Template validates required fields and provides contextual assistance
4. Completed entry is saved with type metadata and structured data
5. Chart list displays entries with type-specific formatting and icons

## Components and Interfaces

### ChartEntryTypeSelector Component
**Purpose**: Provides interface for selecting chart entry types
**Props**:
- `onTypeSelect: (type: ChartEntryType) => void`
- `availableTypes: ChartEntryType[]`
- `defaultType?: ChartEntryType`

**Features**:
- Grid or dropdown layout with type descriptions
- Icons and brief descriptions for each type
- Keyboard navigation support
- Role-based type availability

### Enhanced ChartEntry Interface
```typescript
interface ChartEntry {
  id: string
  timestamp: string
  type: ChartEntryType
  templateVersion: string
  chiefComplaint?: string
  subjective: string
  objective: string
  assessment: string
  plan: string
  createdBy: {
    name: string
    role: string
    id: string
  }
  // Type-specific structured data
  structuredData?: {
    admissionNote?: AdmissionNoteData
    procedureNote?: ProcedureNoteData
    dischargeNote?: DischargeSummaryData
    consultationNote?: ConsultationNoteData
    emergencyNote?: EmergencyNoteData
  }
  metadata: {
    requiredFieldsCompleted: boolean
    lastModified: string
    wordCount: number
    estimatedReadTime: number
  }
}

type ChartEntryType = 
  | 'progress_note' 
  | 'admission_note' 
  | 'procedure_note' 
  | 'discharge_summary' 
  | 'consultation_note' 
  | 'emergency_note' 
  | 'quick_note'
```

### Template-Specific Data Structures

#### AdmissionNoteData
```typescript
interface AdmissionNoteData {
  historyOfPresentIllness: string
  pastMedicalHistory: string
  socialHistory: string
  familyHistory: string
  reviewOfSystems: {
    [system: string]: string
  }
  physicalExamination: {
    [system: string]: string
  }
  admissionDiagnoses: string[]
  initialOrders: string[]
}
```

#### ProcedureNoteData
```typescript
interface ProcedureNoteData {
  indication: string
  procedureName: string
  procedureDescription: string
  findings: string
  complications: string
  postProcedurePlan: string
  informedConsent: boolean
  timeStarted: string
  timeCompleted: string
  assistants: string[]
  suggestedCptCodes: string[]
}
```

#### DischargeSummaryData
```typescript
interface DischargeSummaryData {
  hospitalCourse: string
  dischargeDiagnoses: string[]
  dischargeMedications: {
    continued: string[]
    newlyStarted: string[]
    discontinued: string[]
  }
  followUpInstructions: string
  patientEducation: string[]
  dischargeDisposition: string
  functionalStatus: string
}
```

### Template Components Architecture

Each template component will follow a consistent pattern:
- **Header Section**: Entry type, timestamp, required field indicators
- **Form Sections**: Structured input areas with validation
- **Helper Panels**: Context-aware assistance and auto-population
- **Footer Actions**: Save, cancel, preview options

### Template Component Interface
```typescript
interface TemplateComponentProps {
  initialData?: Partial<ChartEntry>
  patient: Patient
  onSave: (entry: ChartEntry) => Promise<void>
  onCancel: () => void
  isEditing?: boolean
  readOnly?: boolean
}
```

## Data Models

### Chart Entry Type Configuration
```typescript
interface ChartEntryTypeConfig {
  type: ChartEntryType
  displayName: string
  description: string
  icon: string
  color: string
  requiredFields: string[]
  optionalFields: string[]
  validationRules: ValidationRule[]
  autoPopulationSources: AutoPopulationSource[]
  templateComponent: React.ComponentType<TemplateComponentProps>
}
```

### Validation System
```typescript
interface ValidationRule {
  field: string
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom'
  value?: any
  message: string
  severity: 'error' | 'warning' | 'info'
}
```

### Auto-Population System
```typescript
interface AutoPopulationSource {
  field: string
  source: 'vitals' | 'labs' | 'medications' | 'allergies' | 'previous_notes'
  transform?: (data: any) => string
  conditions?: string[]
}
```

## Error Handling

### Validation Error Handling
- **Field-level validation**: Real-time validation with inline error messages
- **Form-level validation**: Comprehensive validation before save attempts
- **Progressive validation**: Warnings for incomplete sections, errors for required fields
- **Recovery suggestions**: Contextual help for resolving validation errors

### Data Persistence Error Handling
- **Auto-save functionality**: Periodic saving of draft content
- **Conflict resolution**: Handle concurrent editing scenarios
- **Offline support**: Local storage backup for network interruptions
- **Recovery mechanisms**: Restore unsaved content on page reload

### Template Loading Error Handling
- **Graceful degradation**: Fall back to basic template if specialized template fails
- **Error boundaries**: Isolate template errors from main application
- **User feedback**: Clear messaging about template availability issues

## Testing Strategy

### Unit Testing
- **Template Components**: Test each template's rendering, validation, and data handling
- **Validation Logic**: Test all validation rules and edge cases
- **Data Transformation**: Test auto-population and data mapping functions
- **Type Safety**: Ensure TypeScript interfaces prevent runtime errors

### Integration Testing
- **Template Switching**: Test seamless transitions between entry types
- **Data Persistence**: Test saving and loading of different entry types
- **User Workflows**: Test complete documentation workflows for each type
- **Cross-browser Compatibility**: Test template rendering across browsers

### Clinical Workflow Testing
- **Usability Testing**: Test with healthcare providers using realistic scenarios
- **Performance Testing**: Ensure templates load quickly and respond smoothly
- **Accessibility Testing**: Verify keyboard navigation and screen reader support
- **Mobile Responsiveness**: Test template usability on tablets and mobile devices

### End-to-End Testing
- **Complete Documentation Cycles**: Test full patient documentation workflows
- **Multi-user Scenarios**: Test concurrent access and editing
- **Data Migration**: Test upgrading existing entries to new template system
- **Backup and Recovery**: Test data integrity during system failures

## Implementation Considerations

### Performance Optimization
- **Lazy Loading**: Load template components only when needed
- **Code Splitting**: Separate template bundles for optimal loading
- **Memoization**: Cache template configurations and validation rules
- **Virtual Scrolling**: Handle large numbers of chart entries efficiently

### Accessibility Requirements
- **WCAG 2.1 AA Compliance**: Ensure all templates meet accessibility standards
- **Keyboard Navigation**: Full functionality without mouse interaction
- **Screen Reader Support**: Proper ARIA labels and semantic markup
- **High Contrast Support**: Ensure visibility in high contrast modes

### Security Considerations
- **Input Sanitization**: Prevent XSS attacks in rich text fields
- **Data Validation**: Server-side validation of all template data
- **Audit Logging**: Track all changes to chart entries with full audit trails
- **Access Control**: Role-based permissions for different entry types

### Internationalization
- **Template Localization**: Support for multiple languages in templates
- **Cultural Adaptation**: Adjust templates for different healthcare systems
- **Date/Time Formatting**: Locale-appropriate formatting throughout
- **Medical Terminology**: Support for local medical terminology standards