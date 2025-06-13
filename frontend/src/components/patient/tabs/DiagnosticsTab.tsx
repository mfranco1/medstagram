import type { Patient } from '../../../types/patient'

interface DiagnosticsTabProps {
  patient: Patient
}

export function DiagnosticsTab({ patient }: DiagnosticsTabProps) {
  return (
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
  )
} 