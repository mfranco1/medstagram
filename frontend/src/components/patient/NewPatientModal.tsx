import { X } from 'lucide-react'
import { mockPatients, type Patient } from '../../pages/PatientsPage'
import { FormField } from '../ui/FormField'
import { FormSection } from '../ui/FormSection'
import { usePatientForm } from '../../hooks/usePatientForm'
import { GENDERS, CIVIL_STATUSES, PATIENT_STATUSES } from '../../constants/patient'
import { formatAge, calculateAge } from '../../utils/patient'
import { DatePicker } from '../ui/date-picker/DatePicker'

interface NewPatientModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (patient: Omit<Patient, 'id'>) => Promise<void>
}

export function NewPatientModal({ isOpen, onClose, onSave }: NewPatientModalProps) {
  const existingCaseNumbers = mockPatients.map(p => p.caseNumber)
  const { formData, errors, isLoading, handleChange, handleSubmit } = usePatientForm({
    existingCaseNumbers,
    onSubmit: async (data) => {
      await onSave(data)
      onClose()
    }
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">New Patient</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Basic Information */}
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

              {/* Personal Information */}
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

              {/* Medical Information */}
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

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Cancel
              </button>
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
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 