import { Calendar, User, MapPin, Church, Home, Phone, Clock, UserCog, Droplet, AlertTriangle, Heart, Thermometer, Activity, Scale, PhoneCall, Brain, Wind } from 'lucide-react'
import type { Patient, PatientTab } from '../../types/patient'
import { ConfirmModal } from '../ui/ConfirmModal'
import { EditPatientModal } from './EditPatientModal'
import { calculateBMI, formatBloodPressure, formatGCS } from '../../utils/patient'
import { PatientHeader } from './PatientHeader'
import { PatientMedicalStatus } from './PatientMedicalStatus'
import { PatientTabNavigation } from './PatientTabNavigation'
import { usePatientModals } from '../../hooks/usePatientModals'

interface PatientInfoCardProps {
  activeTab: PatientTab
  setActiveTab: (tab: PatientTab) => void
  patient: Patient
  onDelete?: (patientId: number) => void
  onEdit?: (patient: Patient) => Promise<void>
}

export function PatientInfoCard({ activeTab, setActiveTab, patient, onDelete, onEdit }: PatientInfoCardProps) {
  const {
    isDeleteModalOpen,
    isEditModalOpen,
    openDeleteModal,
    closeDeleteModal,
    openEditModal,
    closeEditModal,
    handleDelete
  } = usePatientModals({ patient, onDelete, onEdit })

  return (
    <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
      <PatientHeader
        patient={patient}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />

      <PatientMedicalStatus patient={patient} />

      <PatientTabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'general' && (
          <div className="grid grid-cols-3 gap-x-8 gap-y-6 text-sm">
            <div className="flex items-start space-x-3 col-span-3">
              <PhoneCall className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
              <div className="min-w-0">
                <span className="text-gray-500">Emergency Contact</span>
                {patient.emergencyContact ? (
                  <div>
                    <p className="font-medium text-gray-900">{patient.emergencyContact.name}</p>
                    <p className="text-sm text-gray-500">
                      {patient.emergencyContact.relationship} • {patient.emergencyContact.phone}
                    </p>
                  </div>
                ) : (
                  <p className="font-medium text-gray-900">Not recorded</p>
                )}
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
              <div className="min-w-0">
                <span className="text-gray-500">Date of Birth</span>
                <p className="font-medium text-gray-900">{patient.dateOfBirth}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <User className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
              <div className="min-w-0">
                <span className="text-gray-500">Civil Status</span>
                <p className="font-medium text-gray-900">{patient.civilStatus}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
              <div className="min-w-0">
                <span className="text-gray-500">Nationality</span>
                <p className="font-medium text-gray-900">{patient.nationality}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Church className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
              <div className="min-w-0">
                <span className="text-gray-500">Religion</span>
                <p className="font-medium text-gray-900">{patient.religion}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Home className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
              <div className="min-w-0">
                <span className="text-gray-500">Address</span>
                <p className="font-medium text-gray-900">{patient.address}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
              <div className="min-w-0">
                <span className="text-gray-500">Philhealth</span>
                <p className="font-medium text-gray-900">{patient.philhealth || 'Not specified'}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'case-summary' && (
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
        )}

        {activeTab === 'orders' && (
          <div className="space-y-8">
            {/* Diagnostics Orders */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">Diagnostics</h3>
                <button className="text-sm text-violet-600 hover:text-violet-700">+ Add Order</button>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {patient.orders?.diagnostics && patient.orders.diagnostics.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ordered By</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ordered At</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {patient.orders.diagnostics.map((order) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderedBy}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderedAt}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{order.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">No diagnostic orders found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Imaging Orders */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">Imaging</h3>
                <button className="text-sm text-violet-600 hover:text-violet-700">+ Add Order</button>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {patient.orders?.imaging && patient.orders.imaging.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Study</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ordered By</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ordered At</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {patient.orders.imaging.map((order) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderedBy}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderedAt}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{order.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">No imaging orders found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Procedures */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">Procedures</h3>
                <button className="text-sm text-violet-600 hover:text-violet-700">+ Add Order</button>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {patient.orders?.procedures && patient.orders.procedures.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Procedure</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ordered By</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled For</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {patient.orders.procedures.map((order) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderedBy}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderedAt}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{order.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">No procedure orders found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Therapeutics */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">Therapeutics</h3>
                <button className="text-sm text-violet-600 hover:text-violet-700">+ Add Order</button>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {patient.orders?.therapeutics && patient.orders.therapeutics.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ordered By</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {patient.orders.therapeutics.map((order) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderedBy}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.frequency}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.duration}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{order.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">No therapeutic orders found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chart' && (
          <div className="space-y-6">
            {/* Add medical chart content here */}
            <p className="text-gray-500 text-sm">Medical chart content will be added here.</p>
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div className="space-y-8">
            {/* Vital Signs Trends Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Vital Signs Trends</h3>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="h-48 flex items-center justify-center">
                  <p className="text-sm text-gray-500">Vital signs trend chart will be displayed here</p>
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Heart Rate</p>
                    <p className="text-sm font-medium text-gray-900">-- bpm</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Respiratory Rate</p>
                    <p className="text-sm font-medium text-gray-900">-- /min</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Blood Pressure</p>
                    <p className="text-sm font-medium text-gray-900">--/-- mmHg</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Temperature</p>
                    <p className="text-sm font-medium text-gray-900">-- °C</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">O₂ Saturation</p>
                    <p className="text-sm font-medium text-gray-900">-- %</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lab Results Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Laboratory Results</h3>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference Range</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Complete Blood Count</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Pending</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Imaging Studies Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Imaging Studies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">Chest X-Ray</h4>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">No results available</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">CT Scan</h4>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">No results available</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'therapeutics' && (
          <div className="space-y-8">
            {/* Add therapeutic content here */}
            <p className="text-gray-500 text-sm">Therapeutic content will be added here.</p>
          </div>
        )}

        {activeTab === 'medical' && (
          <div className="space-y-8">
            {/* Medical Information Section */}
            <div>
              <div className="grid grid-cols-3 gap-x-8 gap-y-6 text-sm">
                {/* Attending Physician */}
                <div className="flex items-start space-x-3 col-span-3">
                  <UserCog className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                  <div className="min-w-0">
                    <span className="text-gray-500">Attending Physician</span>
                    {patient.attendingPhysician ? (
                      <div>
                        <p className="font-medium text-gray-900">{patient.attendingPhysician.name}</p>
                        <p className="text-sm text-gray-500">
                          {patient.attendingPhysician.specialization} • {patient.attendingPhysician.contactNumber}
                        </p>
                      </div>
                    ) : (
                      <p className="font-medium text-gray-900">Not assigned</p>
                    )}
                  </div>
                </div>

                {/* Date Admitted */}
                <div className="flex items-start space-x-3">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                  <div className="min-w-0">
                    <span className="text-gray-500">Date Admitted</span>
                    <p className="font-medium text-gray-900">{patient.dateAdmitted}</p>
                  </div>
                </div>

                {/* Blood Type */}
                <div className="flex items-start space-x-3">
                  <Droplet className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                  <div className="min-w-0">
                    <span className="text-gray-500">Blood Type</span>
                    <p className="font-medium text-gray-900">{patient.bloodType || 'Unknown'}</p>
                  </div>
                </div>

                {/* Allergies */}
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                  <div className="min-w-0">
                    <span className="text-gray-500">Allergies</span>
                    <p className="font-medium text-gray-900">
                      {patient.allergies?.length ? patient.allergies.join(', ') : 'Unknown'}
                    </p>
                  </div>
                </div>

                {/* Height & Weight */}
                <div className="flex items-start space-x-3">
                  <Scale className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                  <div className="min-w-0">
                    <span className="text-gray-500">Height & Weight</span>
                    <div className="font-medium text-gray-900">
                      {patient.height && patient.weight ? (
                        <>
                          <p>{patient.height} cm / {patient.weight} kg</p>
                          <p className="text-sm text-gray-500">BMI: {calculateBMI()}</p>
                        </>
                      ) : (
                        <p>Not recorded</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vital Signs Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Latest Vital Signs</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <Activity className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="min-w-0">
                    <span className="text-sm text-gray-500">Heart Rate</span>
                    <p className="font-medium text-sm text-gray-900">
                      {patient.lastVitals?.heartRate ? `${patient.lastVitals.heartRate} bpm` : 'Not recorded'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Wind className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="min-w-0">
                    <span className="text-sm text-gray-500">Respiratory Rate</span>
                    <p className="font-medium text-sm text-gray-900">
                      {patient.lastVitals?.respiratoryRate ? `${patient.lastVitals.respiratoryRate} /min` : 'Not recorded'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Heart className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="min-w-0">
                    <span className="text-sm text-gray-500">Blood Pressure</span>
                    <p className="font-medium text-sm text-gray-900">{formatBloodPressure(patient.lastVitals?.bloodPressure)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Thermometer className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="min-w-0">
                    <span className="text-sm text-gray-500">Temperature</span>
                    <p className="font-medium text-sm text-gray-900">
                      {patient.lastVitals?.temperature ? `${patient.lastVitals.temperature}°C` : 'Not recorded'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Droplet className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="min-w-0">
                    <span className="text-sm text-gray-500">O₂ Saturation</span>
                    <p className="font-medium text-sm text-gray-900">
                      {patient.lastVitals?.oxygenSaturation ? `${patient.lastVitals.oxygenSaturation}%` : 'Not recorded'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Brain className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="min-w-0">
                    <span className="text-sm text-gray-500">GCS</span>
                    <p className="font-medium text-sm text-gray-900">{formatGCS(patient.lastVitals?.gcs)}</p>
                  </div>
                </div>
              </div>
              {patient.lastVitals?.timestamp && (
                <p className="text-xs text-gray-500">
                  Last recorded: {new Date(patient.lastVitals.timestamp).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Patient"
        message={`Are you sure you want to delete ${patient.name}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />

      <EditPatientModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSave={onEdit ?? (async () => {})}
        patient={patient}
      />
    </div>
  )
} 