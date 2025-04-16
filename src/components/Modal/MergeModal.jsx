import React, { useState, useEffect, useCallback } from 'react';
import { X, CheckSquare, AlertTriangle } from 'lucide-react';

const MergeModal = ({ contacts, onMerge, onClose }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedFields, setSelectedFields] = useState(() => {
    const fields = {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      company: ''
    };

    if (contacts?.[0]) {
      Object.keys(fields).forEach(field => {
        fields[field] = contacts[0][field] || '';
      });
    }

    return fields;
  });

  const handleFieldSelect = (field, value) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: value || ''
    }));
    setError(null);
  };

  const handleMerge = useCallback(async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      if (!contacts?.[0]?.id || !contacts?.[1]?.id) {
        throw new Error('Invalid contact data');
      }

      const safeNotes = typeof contacts[0].notes === 'string'
        ? contacts[0].notes
        : JSON.stringify(contacts[0].notes || {});

      const requestData = {
        primary: contacts[0],
        secondary: contacts[1],
        mergedData: {
          first_name: selectedFields.first_name || contacts[0].first_name || '',
          last_name: selectedFields.last_name || '',
          email: selectedFields.email || '',
          phone: selectedFields.phone || '',
          company: selectedFields.company || '',
          notes: safeNotes
        }
      };

      const response = await fetch('http://localhost:3001/api/contacts/merge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to merge contacts');
      }

      await onMerge();
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [contacts, selectedFields, isLoading, onMerge, onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Merge Contacts</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 p-3 rounded">
            <AlertTriangle className="w-5 h-5" />
            <p>Select which information to keep in the merged contact.</p>
          </div>

          {Object.entries(selectedFields).map(([field, value]) => (
            <div key={field} className="space-y-2">
              <p className="text-sm text-gray-400 capitalize">{field.replace('_', ' ')}</p>
              <div className="grid grid-cols-2 gap-4">
                {contacts.map((contact, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleFieldSelect(field, contact[field])}
                    className={`flex items-center justify-between p-3 rounded
                      ${value === contact[field]
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300'}`}
                  >
                    <span>{contact[field] || '(empty)'}</span>
                    {value === contact[field] && (
                      <CheckSquare className="w-5 h-5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 p-4 border-t border-gray-700">
          {error && (
            <div className="text-red-400 text-sm px-2">
              {error}
            </div>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleMerge}
              disabled={isLoading}
              className={`px-4 py-2 text-white rounded-md transition-colors
                ${isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isLoading ? 'Merging...' : 'Merge Contacts'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MergeModal;
