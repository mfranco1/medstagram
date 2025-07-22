import { ChartEntryType, ChartEntryTypeConfig, ValidationRule, AutoPopulationSource } from '../types/patient'

// Chart Entry Type Registry with Display Metadata
export const CHART_ENTRY_TYPE_CONFIGS: Record<ChartEntryType, ChartEntryTypeConfig> = {
  progress_note: {
    type: 'progress_note',
    displayName: 'Progress Note',
    description: 'Daily progress documentation with SOAP format',
    icon: 'clipboard-document-list',
    color: '#3B82F6', // blue-500
    requiredFields: ['subjective', 'objective', 'assessment', 'plan'],
    optionalFields: ['chiefComplaint'],
    validationRules: [
      {
        field: 'subjective',
        type: 'required',
        message: 'Subjective findings are required for progress notes',
        severity: 'error'
      },
      {
        field: 'objective',
        type: 'required',
        message: 'Objective findings are required for progress notes',
        severity: 'error'
      },
      {
        field: 'assessment',
        type: 'required',
        message: 'Assessment is required for progress notes',
        severity: 'error'
      },
      {
        field: 'plan',
        type: 'required',
        message: 'Plan is required for progress notes',
        severity: 'error'
      },
      {
        field: 'subjective',
        type: 'minLength',
        value: 10,
        message: 'Subjective section should be more detailed',
        severity: 'warning'
      }
    ],
    autoPopulationSources: [
      {
        field: 'objective',
        source: 'vitals',
        transform: (vitals) => `Vitals: T ${vitals.temperature}°C, BP ${vitals.bloodPressure?.systolic}/${vitals.bloodPressure?.diastolic}, HR ${vitals.heartRate}, RR ${vitals.respiratoryRate}, O2 Sat ${vitals.oxygenSaturation}%`,
        conditions: ['vitals.timestamp within 24 hours']
      },
      {
        field: 'objective',
        source: 'labs',
        transform: (labs) => `Recent Labs: ${labs.map(lab => `${lab.name}: ${lab.value} ${lab.unit}`).join(', ')}`,
        conditions: ['labs.timestamp within 48 hours']
      }
    ]
  },

  admission_note: {
    type: 'admission_note',
    displayName: 'Admission Note',
    description: 'Comprehensive initial patient assessment',
    icon: 'user-plus',
    color: '#10B981', // emerald-500
    requiredFields: [
      'structuredData.admissionNote.historyOfPresentIllness',
      'structuredData.admissionNote.pastMedicalHistory',
      'structuredData.admissionNote.physicalExamination',
      'structuredData.admissionNote.admissionDiagnoses',
      'assessment',
      'plan'
    ],
    optionalFields: [
      'structuredData.admissionNote.socialHistory',
      'structuredData.admissionNote.familyHistory',
      'structuredData.admissionNote.reviewOfSystems',
      'structuredData.admissionNote.initialOrders'
    ],
    validationRules: [
      {
        field: 'structuredData.admissionNote.historyOfPresentIllness',
        type: 'required',
        message: 'History of Present Illness is required for admission notes',
        severity: 'error'
      },
      {
        field: 'structuredData.admissionNote.pastMedicalHistory',
        type: 'required',
        message: 'Past Medical History is required for admission notes',
        severity: 'error'
      },
      {
        field: 'structuredData.admissionNote.physicalExamination',
        type: 'required',
        message: 'Physical Examination is required for admission notes',
        severity: 'error'
      },
      {
        field: 'structuredData.admissionNote.admissionDiagnoses',
        type: 'required',
        message: 'At least one admission diagnosis is required',
        severity: 'error'
      },
      {
        field: 'structuredData.admissionNote.historyOfPresentIllness',
        type: 'minLength',
        value: 50,
        message: 'History of Present Illness should be comprehensive',
        severity: 'warning'
      }
    ],
    autoPopulationSources: [
      {
        field: 'structuredData.admissionNote.pastMedicalHistory',
        source: 'previous_notes',
        transform: (notes) => notes.filter(note => note.type === 'admission_note').slice(-1)[0]?.structuredData?.admissionNote?.pastMedicalHistory || '',
        conditions: ['previous admission notes exist']
      },
      {
        field: 'objective',
        source: 'vitals',
        transform: (vitals) => `Admission Vitals: T ${vitals.temperature}°C, BP ${vitals.bloodPressure?.systolic}/${vitals.bloodPressure?.diastolic}, HR ${vitals.heartRate}, RR ${vitals.respiratoryRate}, O2 Sat ${vitals.oxygenSaturation}%`
      },
      {
        field: 'structuredData.admissionNote.initialOrders',
        source: 'medications',
        transform: (medications) => medications.filter(med => med.status === 'active').map(med => `${med.name} ${med.dosage.amount}${med.dosage.unit} ${med.route}`),
        conditions: ['active medications exist']
      }
    ]
  },

  procedure_note: {
    type: 'procedure_note',
    displayName: 'Procedure Note',
    description: 'Documentation for medical procedures and interventions',
    icon: 'wrench-screwdriver',
    color: '#F59E0B', // amber-500
    requiredFields: [
      'structuredData.procedureNote.indication',
      'structuredData.procedureNote.procedureName',
      'structuredData.procedureNote.procedureDescription',
      'structuredData.procedureNote.findings',
      'structuredData.procedureNote.postProcedurePlan',
      'structuredData.procedureNote.informedConsent',
      'structuredData.procedureNote.timeStarted',
      'structuredData.procedureNote.timeCompleted'
    ],
    optionalFields: [
      'structuredData.procedureNote.complications',
      'structuredData.procedureNote.assistants',
      'structuredData.procedureNote.suggestedCptCodes'
    ],
    validationRules: [
      {
        field: 'structuredData.procedureNote.indication',
        type: 'required',
        message: 'Procedure indication is required',
        severity: 'error'
      },
      {
        field: 'structuredData.procedureNote.procedureName',
        type: 'required',
        message: 'Procedure name is required',
        severity: 'error'
      },
      {
        field: 'structuredData.procedureNote.informedConsent',
        type: 'required',
        message: 'Informed consent status must be documented',
        severity: 'error'
      },
      {
        field: 'structuredData.procedureNote.timeStarted',
        type: 'required',
        message: 'Procedure start time is required',
        severity: 'error'
      },
      {
        field: 'structuredData.procedureNote.timeCompleted',
        type: 'required',
        message: 'Procedure completion time is required',
        severity: 'error'
      },
      {
        field: 'structuredData.procedureNote.complications',
        type: 'custom',
        message: 'Consider documenting any complications or note "None"',
        severity: 'info'
      }
    ],
    autoPopulationSources: [
      {
        field: 'structuredData.procedureNote.timeStarted',
        source: 'vitals',
        transform: () => new Date().toISOString(),
        conditions: ['creating new procedure note']
      }
    ]
  },

  discharge_summary: {
    type: 'discharge_summary',
    displayName: 'Discharge Summary',
    description: 'Comprehensive summary for patient discharge',
    icon: 'arrow-right-on-rectangle',
    color: '#8B5CF6', // violet-500
    requiredFields: [
      'structuredData.dischargeNote.hospitalCourse',
      'structuredData.dischargeNote.dischargeDiagnoses',
      'structuredData.dischargeNote.dischargeMedications',
      'structuredData.dischargeNote.followUpInstructions',
      'structuredData.dischargeNote.dischargeDisposition'
    ],
    optionalFields: [
      'structuredData.dischargeNote.patientEducation',
      'structuredData.dischargeNote.functionalStatus'
    ],
    validationRules: [
      {
        field: 'structuredData.dischargeNote.hospitalCourse',
        type: 'required',
        message: 'Hospital course summary is required',
        severity: 'error'
      },
      {
        field: 'structuredData.dischargeNote.dischargeDiagnoses',
        type: 'required',
        message: 'At least one discharge diagnosis is required',
        severity: 'error'
      },
      {
        field: 'structuredData.dischargeNote.followUpInstructions',
        type: 'required',
        message: 'Follow-up instructions are required',
        severity: 'error'
      },
      {
        field: 'structuredData.dischargeNote.hospitalCourse',
        type: 'minLength',
        value: 100,
        message: 'Hospital course should provide comprehensive summary',
        severity: 'warning'
      }
    ],
    autoPopulationSources: [
      {
        field: 'structuredData.dischargeNote.dischargeMedications.continued',
        source: 'medications',
        transform: (medications) => medications.filter(med => med.status === 'active').map(med => `${med.name} ${med.dosage.amount}${med.dosage.unit} ${med.frequency.times}x ${med.frequency.period}`),
        conditions: ['active medications exist']
      },
      {
        field: 'structuredData.dischargeNote.dischargeDiagnoses',
        source: 'previous_notes',
        transform: (notes) => {
          const admissionNote = notes.find(note => note.type === 'admission_note');
          return admissionNote?.structuredData?.admissionNote?.admissionDiagnoses || [];
        },
        conditions: ['admission note exists']
      }
    ]
  },

  consultation_note: {
    type: 'consultation_note',
    displayName: 'Consultation Note',
    description: 'Specialist consultation and recommendations',
    icon: 'chat-bubble-left-right',
    color: '#EF4444', // red-500
    requiredFields: [
      'structuredData.consultationNote.reasonForConsultation',
      'structuredData.consultationNote.referringPhysician',
      'structuredData.consultationNote.focusedHistory',
      'structuredData.consultationNote.focusedExamination',
      'structuredData.consultationNote.impression',
      'structuredData.consultationNote.recommendations'
    ],
    optionalFields: [
      'structuredData.consultationNote.notificationSent'
    ],
    validationRules: [
      {
        field: 'structuredData.consultationNote.reasonForConsultation',
        type: 'required',
        message: 'Reason for consultation is required',
        severity: 'error'
      },
      {
        field: 'structuredData.consultationNote.referringPhysician',
        type: 'required',
        message: 'Referring physician information is required',
        severity: 'error'
      },
      {
        field: 'structuredData.consultationNote.impression',
        type: 'required',
        message: 'Clinical impression is required',
        severity: 'error'
      },
      {
        field: 'structuredData.consultationNote.recommendations',
        type: 'required',
        message: 'At least one recommendation is required',
        severity: 'error'
      }
    ],
    autoPopulationSources: [
      {
        field: 'structuredData.consultationNote.focusedHistory',
        source: 'previous_notes',
        transform: (notes) => {
          const recentNote = notes.filter(note => note.type === 'progress_note').slice(-1)[0];
          return recentNote?.subjective || '';
        },
        conditions: ['recent progress notes exist']
      }
    ]
  },

  emergency_note: {
    type: 'emergency_note',
    displayName: 'Emergency/Code Note',
    description: 'Rapid documentation for emergency situations',
    icon: 'exclamation-triangle',
    color: '#DC2626', // red-600
    requiredFields: [
      'structuredData.emergencyNote.eventType',
      'structuredData.emergencyNote.personnelInvolved',
      'structuredData.emergencyNote.interventions',
      'structuredData.emergencyNote.outcome'
    ],
    optionalFields: [
      'structuredData.emergencyNote.medications',
      'structuredData.emergencyNote.addendums'
    ],
    validationRules: [
      {
        field: 'structuredData.emergencyNote.eventType',
        type: 'required',
        message: 'Emergency event type is required',
        severity: 'error'
      },
      {
        field: 'structuredData.emergencyNote.personnelInvolved',
        type: 'required',
        message: 'Personnel involved must be documented',
        severity: 'error'
      },
      {
        field: 'structuredData.emergencyNote.interventions',
        type: 'required',
        message: 'At least one intervention must be documented',
        severity: 'error'
      },
      {
        field: 'structuredData.emergencyNote.outcome',
        type: 'required',
        message: 'Event outcome is required',
        severity: 'error'
      }
    ],
    autoPopulationSources: [
      {
        field: 'timestamp',
        source: 'vitals',
        transform: () => new Date().toISOString(),
        conditions: ['creating new emergency note']
      }
    ]
  },

  quick_note: {
    type: 'quick_note',
    displayName: 'Quick Note',
    description: 'Brief documentation for simple updates',
    icon: 'pencil-square',
    color: '#6B7280', // gray-500
    requiredFields: ['subjective'],
    optionalFields: ['objective', 'assessment', 'plan'],
    validationRules: [
      {
        field: 'subjective',
        type: 'required',
        message: 'Note content is required',
        severity: 'error'
      },
      {
        field: 'subjective',
        type: 'maxLength',
        value: 500,
        message: 'Quick notes should be brief. Consider using a different entry type for longer documentation.',
        severity: 'warning'
      }
    ],
    autoPopulationSources: []
  }
};

// Chart Entry Type Registry Class
export class ChartEntryTypeRegistry {
  private static instance: ChartEntryTypeRegistry;
  private configs: Record<ChartEntryType, ChartEntryTypeConfig>;

  private constructor() {
    this.configs = CHART_ENTRY_TYPE_CONFIGS;
  }

  public static getInstance(): ChartEntryTypeRegistry {
    if (!ChartEntryTypeRegistry.instance) {
      ChartEntryTypeRegistry.instance = new ChartEntryTypeRegistry();
    }
    return ChartEntryTypeRegistry.instance;
  }

  public getConfig(type: ChartEntryType): ChartEntryTypeConfig {
    return this.configs[type];
  }

  public getAllConfigs(): Record<ChartEntryType, ChartEntryTypeConfig> {
    return { ...this.configs };
  }

  public getAvailableTypes(): ChartEntryType[] {
    return Object.keys(this.configs) as ChartEntryType[];
  }

  public getDisplayMetadata(type: ChartEntryType) {
    const config = this.configs[type];
    return {
      displayName: config.displayName,
      description: config.description,
      icon: config.icon,
      color: config.color
    };
  }

  public getValidationRules(type: ChartEntryType): ValidationRule[] {
    return this.configs[type].validationRules;
  }

  public getAutoPopulationSources(type: ChartEntryType): AutoPopulationSource[] {
    return this.configs[type].autoPopulationSources;
  }

  public getRequiredFields(type: ChartEntryType): string[] {
    return this.configs[type].requiredFields;
  }

  public getOptionalFields(type: ChartEntryType): string[] {
    return this.configs[type].optionalFields;
  }
}