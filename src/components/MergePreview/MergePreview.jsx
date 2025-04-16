import React from 'react'
import { Check, X } from 'lucide-react'

export default function MergePreview({ contact1, contact2, mergedResult, onAccept, onReject }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Merge Preview</h2>
        
        <div className="grid grid-cols-3 gap-4">
          {/* Contact 1 */}
          <div className="bg-gray-700 p-4 rounded">
            <h3 className="font-bold mb-2">Contact 1</h3>
            {/* Display contact1 fields */}
          </div>

          {/* Contact 2 */}
          <div className="bg-gray-700 p-4 rounded">
            <h3 className="font-bold mb-2">Contact 2</h3>
            {/* Display contact2 fields */}
          </div>

          {/* Merged Result */}
          <div className="bg-blue-900/50 p-4 rounded">
            <h3 className="font-bold mb-2">Merged Result</h3>
            {/* Display mergedResult fields */}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onReject}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            <X className="w-4 h-4" />
            Skip
          </button>
          <button
            onClick={onAccept}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            <Check className="w-4 h-4" />
            Merge
          </button>
        </div>
      </div>
    </div>
  )
}