import type { Patient } from '../../../types/patient'

interface CaseSummaryTabProps {
  patient: Patient
}

export function CaseSummaryTab({ patient }: CaseSummaryTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Overview</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Admission Summary</h4>
            <p className="text-sm text-gray-600">
              Patient was admitted on [Date] with [Chief Complaint]. Initial assessment revealed [Key Findings].
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Current Status</h4>
            <p className="text-sm text-gray-600">
              Currently stable. Vital signs within normal limits. [Current Treatment Plan] in progress.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Clinical Information</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Active Problems</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Primary diagnosis: [Diagnosis]</li>
              <li>Comorbidities: [List of comorbidities]</li>
              <li>Risk factors: [List of risk factors]</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Treatment Plan</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Current medications: [List of medications]</li>
              <li>Procedures: [List of procedures]</li>
              <li>Follow-up plan: [Follow-up details]</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Developments</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 mt-2 bg-violet-500 rounded-full"></div>
            <div>
              <p className="text-sm text-gray-600">[Date] - [Recent event or change in condition]</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 mt-2 bg-violet-500 rounded-full"></div>
            <div>
              <p className="text-sm text-gray-600">[Date] - [Recent event or change in condition]</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Care Team</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Primary Team</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Attending: [Name]</li>
              <li>Resident: [Name]</li>
              <li>Nurse: [Name]</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Consultants</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>[Specialty]: [Name]</li>
              <li>[Specialty]: [Name]</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 