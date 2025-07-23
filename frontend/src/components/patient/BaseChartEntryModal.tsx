import { X, Save, Loader2 } from 'lucide-react'
import { useState, useRef, useEffect, ReactNode } from 'react'

export interface BaseChartEntryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => Promise<void>
  title: string
  children: ReactNode
  isSaveDisabled?: boolean
  saveButtonText?: string
  isEditing?: boolean
}

export function BaseChartEntryModal({
  isOpen,
  onClose,
  onSave,
  title,
  children,
  isSaveDisabled = false,
  saveButtonText = 'Save Entry',
  isEditing = false
}: BaseChartEntryModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen, onClose])

  const handleSubmit = async () => {
    if (isSaveDisabled || isSaving) return

    try {
      setIsSaving(true)
      await onSave()
      onClose()
    } catch (error) {
      console.error('Failed to save chart entry:', error)
      // TODO: Show error toast/notification
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef} 
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? `Edit ${title}` : `New ${title}`}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 rounded-md"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving || isSaveDisabled}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {saveButtonText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}