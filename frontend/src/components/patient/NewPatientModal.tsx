import { X, User, FileText, Stethoscope, ChevronRight, ChevronLeft } from 'lucide-react'
import { mockPatients } from '../../mocks/patients'
import type { Patient } from '../../types/patient'
import { FormField } from '../ui/FormField'
import { FormSection } from '../ui/FormSection'
import { usePatientForm } from '../../hooks/usePatientForm'
import { GENDERS, CIVIL_STATUSES, PATIENT_STATUSES, PRIMARY_SERVICES } from '../../constants/patient'
import { formatAge, calculateAge } from '../../utils/patient'
import { DatePicker } from '../ui/date-picker/DatePicker'
import { useState } from 'react'

interface NewPatientModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (patient: Omit<Patient, 'id'>) => Promise<void>
}

type Step = 'basic' | 'personal' | 'medical'

const STEPS: { id: Step; title: string; icon: typeof User }[] = [
  { id: 'basic', title: 'Basic Information', icon: User },
  { id: 'personal', title: 'Personal Information', icon: FileText },
  { id: 'medical', title: 'Medical Information', icon: Stethoscope }
]

export function NewPatientModal({ isOpen, onClose, onSave }: NewPatientModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('basic')
  const existingCaseNumbers = mockPatients.map(p => p.caseNumber)
  const { formData, errors, isLoading, handleChange, handleSubmit } = usePatientForm({
    existingCaseNumbers,
    onSubmit: async (data) => {
      await onSave(data)
      onClose()
    }
  })

  if (!isOpen) return null

  const currentStepIndex = STEPS.findIndex(step => step.id === currentStep)
  const isLastStep = currentStepIndex === STEPS.length - 1
  const isFirstStep = currentStepIndex === 0

  const handleNext = () => {
    if (!isLastStep) {
      const nextStep = STEPS[currentStepIndex + 1].id
      setCurrentStep(nextStep)
    }
  }

  const handleBack = () => {
    if (!isFirstStep) {
      const prevStep = STEPS[currentStepIndex - 1].id
      setCurrentStep(prevStep)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Fixed Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">New Patient</h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
                disabled={isLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Steps */}
            <div>
              <div className="flex items-center justify-between">
                {STEPS.map((step, index) => {
                  const Icon = step.icon
                  const isActive = currentStep === step.id
                  const isCompleted = STEPS.findIndex(s => s.id === currentStep) > index
                  
                  return (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          isActive
                            ? 'bg-violet-100 text-violet-600'
                            : isCompleted
                            ? 'bg-violet-600 text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${
                          isActive ? 'text-violet-600' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </p>
                      </div>
                      {index < STEPS.length - 1 && (
                        <div className="w-24 h-0.5 mx-4 bg-gray-200">
                          <div
                            className={`h-full bg-violet-600 transition-all duration-300 ${
                              isCompleted ? 'w-full' : 'w-0'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="space-y-6">
              {/* Basic Information Step */}
              {currentStep === 'basic' && (
                <div className="space-y-6">
                  <FormSection title="Basic Information">
                    <FormField
                      label="Full Name"
                      value={formData.name}
                      onChange={(value) => handleChange('name', value)}
                      required
                      disabled={isLoading}
                    />
                    <div>
                      <FormField
                        label="Age"
                        value={formData.dateOfBirth ? formatAge(calculateAge(formData.dateOfBirth)) : '0 days'}
                        onChange={() => {}}
                        disabled
                      />
                      <p className="mt-1 text-xs text-gray-500">Calculated from date of birth</p>
                    </div>
                    <FormField
                      label="Gender"
                      value={formData.gender}
                      onChange={(value) => handleChange('gender', value)}
                      required
                      options={GENDERS.map(gender => ({ value: gender, label: gender }))}
                      disabled={isLoading}
                    />
                    <FormField
                      label="Date of Birth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(value) => handleChange('dateOfBirth', value)}
                      required
                      error={errors.dateOfBirth}
                      disabled={isLoading}
                      maxDate={new Date().toISOString().split('T')[0]}
                    />
                  </FormSection>
                </div>
              )}

              {/* Personal Information Step */}
              {currentStep === 'personal' && (
                <div className="space-y-6">
                  <FormSection title="Personal Information">
                    <FormField
                      label="Civil Status"
                      value={formData.civilStatus}
                      onChange={(value) => handleChange('civilStatus', value)}
                      required
                      options={CIVIL_STATUSES.map(status => ({ value: status, label: status }))}
                      disabled={isLoading}
                    />
                    <FormField
                      label="Nationality"
                      value={formData.nationality}
                      onChange={(value) => handleChange('nationality', value)}
                      required
                      disabled={isLoading}
                    />
                    <FormField
                      label="Religion"
                      value={formData.religion}
                      onChange={(value) => handleChange('religion', value)}
                      required
                      disabled={isLoading}
                    />
                    <FormField
                      label="PhilHealth Number"
                      value={formData.philhealth}
                      onChange={(value) => handleChange('philhealth', value)}
                      required
                      disabled={isLoading}
                    />
                    <div className="col-span-2">
                      <FormField
                        label="Address"
                        value={formData.address}
                        onChange={(value) => handleChange('address', value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </FormSection>
                </div>
              )}

              {/* Medical Information Step */}
              {currentStep === 'medical' && (
                <div className="space-y-6">
                  <FormSection title="Medical Information">
                    <FormField
                      label="Case Number"
                      value={formData.caseNumber}
                      onChange={(value) => handleChange('caseNumber', value)}
                      required
                      error={errors.caseNumber}
                      placeholder="6-digit number"
                      disabled={isLoading}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date Admitted
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <DatePicker
                        value={formData.dateAdmitted}
                        onChange={(value) => handleChange('dateAdmitted', value)}
                        required
                        disabled={isLoading}
                        maxDate={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <FormField
                      label="Location"
                      value={formData.location}
                      onChange={(value) => handleChange('location', value)}
                      required
                      placeholder="e.g., Ward 9"
                      disabled={isLoading}
                    />
                    <FormField
                      label="Primary Service"
                      value={formData.primaryService}
                      onChange={(value) => handleChange('primaryService', value)}
                      required
                      options={PRIMARY_SERVICES.map(service => ({ value: service, label: service }))}
                      disabled={isLoading}
                    />
                    <FormField
                      label="Status"
                      value={formData.status}
                      onChange={(value) => handleChange('status', value)}
                      required
                      options={PATIENT_STATUSES.map(status => ({ value: status, label: status }))}
                      disabled={isLoading}
                    />
                    <div className="col-span-2">
                      <FormField
                        label="Diagnosis"
                        type="textarea"
                        value={formData.diagnosis}
                        onChange={(value) => handleChange('diagnosis', value)}
                        required
                        rows={3}
                        disabled={isLoading}
                      />
                    </div>
                  </FormSection>
                </div>
              )}
            </div>
          </div>

          {/* Fixed Navigation Buttons */}
          <div className="p-6 border-t bg-white">
            <div className="flex justify-between">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                {!isFirstStep && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    disabled={isLoading}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </button>
                )}
              </div>
              <div className="flex space-x-3">
                {!isLastStep ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    disabled={isLoading}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 