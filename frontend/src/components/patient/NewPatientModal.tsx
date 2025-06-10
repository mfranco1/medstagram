import { X } from 'lucide-react'
import { mockPatients, type Patient } from '../../pages/PatientsPage'
import { FormField } from '../ui/FormField'
import { FormSection } from '../ui/FormSection'
import { usePatientForm } from '../../hooks/usePatientForm'
import { GENDERS, CIVIL_STATUSES, PATIENT_STATUSES } from '../../constants/patient'
import { formatAge, calculateAge } from '../../utils/patient'

interface NewPatientModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (patient: Omit<Patient, 'id'>) => void
}

export function NewPatientModal({ isOpen, onClose, onSave }: NewPatientModalProps) {
  const existingCaseNumbers = mockPatients.map(p => p.caseNumber)
  const { formData, errors, handleChange, handleSubmit } = usePatientForm({
    existingCaseNumbers,
    onSubmit: onSave
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
                />
                <FormField
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(value) => handleChange('dateOfBirth', value)}
                  required
                  error={errors.dateOfBirth}
                  // max={new Date().toISOString().split('T')[0]} // Add this to FormField if needed in the future
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
                />
                <FormField
                  label="Nationality"
                  value={formData.nationality}
                  onChange={(value) => handleChange('nationality', value)}
                  required
                />
                <FormField
                  label="Religion"
                  value={formData.religion}
                  onChange={(value) => handleChange('religion', value)}
                  required
                />
                <FormField
                  label="PhilHealth Number"
                  value={formData.philhealth}
                  onChange={(value) => handleChange('philhealth', value)}
                  required
                />
                <div className="col-span-2">
                  <FormField
                    label="Address"
                    value={formData.address}
                    onChange={(value) => handleChange('address', value)}
                    required
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
                />
                <FormField
                  label="Date Admitted"
                  type="date"
                  value={formData.dateAdmitted}
                  onChange={(value) => handleChange('dateAdmitted', value)}
                  required
                />
                <FormField
                  label="Location"
                  value={formData.location}
                  onChange={(value) => handleChange('location', value)}
                  required
                  placeholder="e.g., Ward 9"
                />
                <FormField
                  label="Status"
                  value={formData.status}
                  onChange={(value) => handleChange('status', value)}
                  required
                  options={PATIENT_STATUSES.map(status => ({ value: status, label: status }))}
                />
                <div className="col-span-2">
                  <FormField
                    label="Diagnosis"
                    type="textarea"
                    value={formData.diagnosis}
                    onChange={(value) => handleChange('diagnosis', value)}
                    required
                    rows={3}
                  />
                </div>
              </FormSection>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 