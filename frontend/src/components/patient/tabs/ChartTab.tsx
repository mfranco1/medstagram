import { useState, useEffect } from 'react'
import { Clock, Plus, FileText } from 'lucide-react'
import type { Patient, ChartEntry } from '../../../types/patient'
import { NewChartEntryModal } from '../NewChartEntryModal'
import { QuickNoteModal } from '../QuickNoteModal'
import { mockPatients } from '../../../mocks/patients'

interface ChartTabProps {
  patient: Patient
}

export function ChartTab({ patient }: ChartTabProps) {
  const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false)
  const [isQuickNoteModalOpen, setIsQuickNoteModalOpen] = useState(false)
  const [chartEntries, setChartEntries] = useState<ChartEntry[]>(patient.chartEntries || [])

  useEffect(() => {
    setChartEntries(patient.chartEntries || [])
  }, [patient.chartEntries])

  const handleSaveEntry = async (entry: Omit<ChartEntry, 'id' | 'timestamp' | 'createdBy' | 'type' | 'templateVersion' | 'metadata'> & { templateVersion?: string, metadata?: any }) => {
    // Create a new chart entry with required fields
    const now = new Date().toISOString();
    const templateVersion = entry.templateVersion || '1.0';
    const baseMetadata = entry.metadata || {};
    // Compute word count and read time if missing
    const wordCount = baseMetadata.wordCount ?? Object.values(entry).join(' ').split(/\s+/).filter(Boolean).length;
    const estimatedReadTime = baseMetadata.estimatedReadTime ?? Math.ceil(wordCount / 200);
    const lastModified = baseMetadata.lastModified || now;
    const requiredFieldsCompleted = baseMetadata.requiredFieldsCompleted ?? true;
    const newEntry: ChartEntry = {
      ...entry,
      type: 'progress_note', // TODO: Use selected type if/when multi-type is supported
      templateVersion,
      id: crypto.randomUUID(),
      timestamp: now,
      createdBy: {
        name: 'Dr. Marty Franco', // TODO: Get from auth context
        role: 'Doctor', // TODO: Get from auth context
        id: 'dr-marty-franco' // TODO: Get from auth context
      },
      metadata: {
        requiredFieldsCompleted,
        lastModified,
        wordCount,
        estimatedReadTime
      }
    }

    // Find the patient in mockPatients and update their chart entries
    const patientIndex = mockPatients.findIndex(p => p.id === patient.id)
    if (patientIndex !== -1) {
      const updatedPatient = {
        ...mockPatients[patientIndex],
        chartEntries: [
          ...(mockPatients[patientIndex].chartEntries || []),
          newEntry
        ]
      }
      mockPatients[patientIndex] = updatedPatient
      
      // Update local state to trigger re-render
      setChartEntries(prevEntries => [...prevEntries, newEntry])
    }
  }

  const handleSaveQuickNote = async (note: string) => {
    // Create a new chart entry with just the note in the subjective field
    const now = new Date().toISOString();
    const wordCount = note.split(/\s+/).filter(Boolean).length;
    const estimatedReadTime = Math.ceil(wordCount / 200);
    const newEntry: ChartEntry = {
      id: crypto.randomUUID(),
      timestamp: now,
      type: 'quick_note',
      templateVersion: '1.0',
      chiefComplaint: '',
      subjective: note,
      objective: '',
      assessment: '',
      plan: '',
      createdBy: {
        name: 'Dr. Marty Franco', // TODO: Get from auth context
        role: 'Doctor', // TODO: Get from auth context
        id: 'dr-marty-franco' // TODO: Get from auth context
      },
      metadata: {
        requiredFieldsCompleted: true,
        lastModified: now,
        wordCount,
        estimatedReadTime
      }
    }

    // Find the patient in mockPatients and update their chart entries
    const patientIndex = mockPatients.findIndex(p => p.id === patient.id)
    if (patientIndex !== -1) {
      const updatedPatient = {
        ...mockPatients[patientIndex],
        chartEntries: [
          ...(mockPatients[patientIndex].chartEntries || []),
          newEntry
        ]
      }
      mockPatients[patientIndex] = updatedPatient
      
      // Update local state to trigger re-render
      setChartEntries(prevEntries => [...prevEntries, newEntry])
    }
  }

  return (
    <div className="space-y-8">
      {/* Header with New Entry and Quick Note buttons */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900">Patient Chart</h3>
          <div className="flex space-x-3">
          <button
            onClick={() => setIsQuickNoteModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            <FileText className="h-4 w-4 mr-2" />
            Quick Note
          </button>
          <button
            onClick={() => setIsNewEntryModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </button>
        </div>
        </div>
      </div>

      {/* Chart Entries List */}
      <div className="space-y-4">
        {chartEntries.length ? (
          chartEntries
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .map(entry => (
              <div key={entry.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                    {entry.type === 'quick_note' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                        Quick Note
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    By {entry.createdBy.name} ({entry.createdBy.role})
                  </div>
                </div>

                <div className="space-y-4">
                  {entry.type === 'quick_note' ? (
                    <div>
                      <p className="text-sm text-gray-600">{entry.subjective}</p>
                    </div>
                  ) : (
                    <>
                      {entry.chiefComplaint && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Chief Complaint</h4>
                          <p className="text-sm text-gray-600">{entry.chiefComplaint}</p>
                        </div>
                      )}
                      {entry.subjective && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Subjective</h4>
                          <p className="text-sm text-gray-600">{entry.subjective}</p>
                        </div>
                      )}
                      {entry.objective && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Objective</h4>
                          <p className="text-sm text-gray-600">{entry.objective}</p>
                        </div>
                      )}
                      {entry.assessment && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Assessment</h4>
                          <p className="text-sm text-gray-600">{entry.assessment}</p>
                        </div>
                      )}
                      {entry.plan && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Plan</h4>
                          <p className="text-sm text-gray-600">{entry.plan}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
        ) : (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No chart entries yet. Click "New Entry" to add one.</p>
          </div>
        )}
      </div>

      <NewChartEntryModal
        isOpen={isNewEntryModalOpen}
        onClose={() => setIsNewEntryModalOpen(false)}
        onSave={handleSaveEntry}
      />

      <QuickNoteModal
        isOpen={isQuickNoteModalOpen}
        onClose={() => setIsQuickNoteModalOpen(false)}
        onSave={handleSaveQuickNote}
      />
    </div>
  )
} 