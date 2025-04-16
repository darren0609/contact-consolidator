import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { SpeedDial, SpeedDialIcon } from './components/SpeedDial/SpeedDial';
import { findDuplicates } from './utils/contactUtils';
import Sidebar from './components/Sidebar/Sidebar';
import ContactList from './components/ContactList';
import ContactModal from './components/Modal/ContactModal';
import AlphabetSpeedDial from './components/AlphabetSpeedDial/AlphabetSpeedDial';
import DuplicatesList from './components/DuplicatesList/DuplicatesList';
import MergeModal from './components/Modal/MergeModal';
import LoadingOverlay from './components/LoadingOverlay/LoadingOverlay';

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [duplicateInfo, setDuplicateInfo] = useState({ count: 0, duplicateIds: new Set() });
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [mergeContacts, setMergeContacts] = useState(null);
  const [importProgress, setImportProgress] = useState(null);
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    message: '',
    progress: null
  });
  const [showDuplicates, setShowDuplicates] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    const detectDuplicates = async () => {
      if (!contacts.length) return;

      setLoadingState({
        isLoading: true,
        message: 'Analyzing contacts for duplicates...'
      });

      // Use setTimeout to allow the loading state to render
      setTimeout(() => {
        try {
          const dupeInfo = findDuplicates(contacts);
          setDuplicateInfo(dupeInfo);
        } catch (error) {
          console.error('Duplicate detection failed:', error);
          setError(error.message);
        } finally {
          setLoadingState({
            isLoading: false,
            message: ''
          });
        }
      }, 0);
    };

    detectDuplicates();
  }, [contacts]);

  const loadContacts = async () => {
    try {
      setLoadingState({
        isLoading: true,
        message: 'Loading contacts...'
      });
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/contacts');
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const data = await response.json();
      console.log('Loaded contacts:', data); // Debug log
      setContacts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load contacts:', error);
      setError(error.message);
    } finally {
      setLoadingState({
        isLoading: false,
        message: ''
      });
      setLoading(false);
    }
  };

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const handleImportCsv = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoadingState({
        isLoading: true,
        message: 'Processing CSV file...',
        progress: 0
      });

      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const csvData = e.target.result;
          
          // Create worker
          const worker = new Worker(
            new URL('./workers/csvWorker.js', import.meta.url), 
            { type: 'module' }
          );

          worker.onmessage = async ({ data }) => {
            if (data.type === 'progress') {
              setLoadingState(prev => ({
                ...prev,
                progress: (data.processed / data.total) * 100
              }));
            } else if (data.type === 'complete') {
              setLoadingState(prev => ({
                ...prev,
                message: 'Importing contacts...'
              }));
              try {
                const response = await fetch('http://localhost:3001/api/contacts/import', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ records: data.records }),
                });

                if (!response.ok) {
                  throw new Error('Import failed');
                }

                const result = await response.json();
                console.log(`Imported ${result.count} contacts`);
                await loadContacts();
              } catch (error) {
                console.error('Import error:', error);
                setError(error.message);
              } finally {
                setImportProgress(null);
                worker.terminate();
              }
            } else if (data.type === 'error') {
              setError(data.error);
              setImportProgress(null);
              worker.terminate();
            }
          };

          worker.postMessage({ csvData, chunkSize: 1000 });
        } catch (error) {
          console.error('Import error:', error);
          setError(error.message);
          setImportProgress(null);
        }
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Import error:', error);
      setError(error.message);
      setImportProgress(null);
    }
  }, [loadContacts]);

  const availableLetters = useMemo(() => {
    if (!Array.isArray(contacts) || contacts.length === 0) return [];

    const letters = new Set(
      contacts
        .map(contact => {
          const firstChar = (contact.first_name || contact.last_name || '')
            .trim()
            .charAt(0)
            .toUpperCase();
          return firstChar.match(/[A-Z]/) ? firstChar : null;
        })
        .filter(Boolean)
    );
    
    return Array.from(letters).sort();
  }, [contacts]);

  const handleLetterSelect = useCallback((letter) => {
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      // Find the specific contact list container
      const container = element.closest('.overflow-y-auto');
      if (container) {
        const alphabetDivHeight = 48; // Height of the alphabet bar
        const elementTop = element.offsetTop - alphabetDivHeight;
        
        container.scrollTo({
          top: elementTop,
          behavior: 'smooth'
        });
      }
    }
  }, []);

  const handleMergeSelect = useCallback((primary, secondary) => {
    setMergeContacts([primary, secondary]);
    setShowMergeModal(true);
  }, []);

  const handleMerge = async () => {
    await loadContacts();
    setShowMergeModal(false);
    setMergeContacts(null);
  };
  

  /* Original handleMerge function
  const handleMerge = async (mergedContact) => {
    try {
      // Debug log	
      const response = await fetch('http://localhost:3001/api/contacts/merge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mergedContact),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to merge contacts');
      }

      await loadContacts(); // Reload contacts after successful merge
      setShowMergeModal(false);
      setMergeContacts(null);
    } catch (error) {
      console.error('Merge failed:', error);
      setError(error.message);
    }
  };*/

  const handleDismissMatch = useCallback(async (primary, secondary) => {
    try {
      setLoadingState({
        isLoading: true,
        message: 'Dismissing match...'
      });

      const response = await fetch('http://localhost:3001/api/contacts/dismiss-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact1Id: primary.id,
          contact2Id: secondary.id
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to dismiss match');
      }

      // Update local state to remove the dismissed match
      setDuplicateInfo(prevInfo => {
        const newGroups = new Map(prevInfo.groups);
        const matches = newGroups.get(primary) || [];
        const updatedMatches = matches.filter(m => m.contact.id !== secondary.id);
        
        if (updatedMatches.length === 0) {
          newGroups.delete(primary);
        } else {
          newGroups.set(primary, updatedMatches);
        }

        return {
          ...prevInfo,
          groups: newGroups,
          count: newGroups.size
        };
      });

    } catch (error) {
      console.error('Failed to dismiss match:', error);
      setError(error.message);
    } finally {
      setLoadingState({
        isLoading: false,
        message: ''
      });
    }
  }, []);

  const handleContactSelect = useCallback((contact) => {
    setSelectedContact(contact);
  }, []);

  const filteredContacts = React.useMemo(() => {
    console.log('Filtering contacts:', contacts); // Debug log
    if (!Array.isArray(contacts)) return [];
    
    const filtered = contacts.filter(contact => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        contact.first_name?.toLowerCase().includes(searchLower) ||
        contact.last_name?.toLowerCase().includes(searchLower) ||
        contact.email?.toLowerCase().includes(searchLower)
      );
    });
    
    console.log('Filtered results:', filtered); // Debug log
    return filtered;
  }, [contacts, searchTerm]);

  return (
    <div className="h-screen flex bg-gray-900">
      {loadingState.isLoading && (
        <LoadingOverlay 
          message={loadingState.message}
          progress={loadingState.progress}
        />
      )}
      
      <Sidebar 
        onSearch={handleSearch} 
        onImportCsv={handleImportCsv}
        duplicateCount={duplicateInfo?.count || 0}
        onToggleDuplicates={() => setShowDuplicates(!showDuplicates)}
        showDuplicates={showDuplicates}
      />
      
      <main className={`flex-1 ${showDuplicates ? 'grid grid-cols-[2fr,1fr]' : ''} overflow-hidden`}>
        <div className="h-full flex flex-col min-h-0">
          <AlphabetSpeedDial 
            letters={availableLetters}
            onLetterSelect={handleLetterSelect}
          />
          
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-4">
              <ContactList 
                contacts={filteredContacts}
                onContactSelect={handleContactSelect}
                duplicateIds={new Set(
                  Array.from(duplicateInfo?.groups || new Map())
                    .map(([contact]) => contact?.id)
                    .filter(Boolean)
                )}
              />
            </div>
          </div>
        </div>

        {showDuplicates && duplicateInfo?.groups && (
          <div className="border-l border-gray-700 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-4">
                <DuplicatesList
                  duplicateGroups={duplicateInfo.groups}
                  onMergeSelect={handleMergeSelect}
                  onDismissMatch={handleDismissMatch}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add MergeModal */}
      {showMergeModal && mergeContacts && (
        <MergeModal
          contacts={mergeContacts}
          onClose={() => {
            setShowMergeModal(false);
            setMergeContacts(null);
          }}
          onMerge={handleMerge}
        />
      )}

      {selectedContact && (
        <ContactModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onSave={async (updatedContact) => {
            try {
              const response = await fetch(`http://localhost:3001/api/contacts/${selectedContact.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedContact),
              });

              if (!response.ok) {
                throw new Error('Failed to update contact');
              }

              await loadContacts();
              setSelectedContact(null);
            } catch (error) {
              console.error('Update failed:', error);
              setError(error.message);
            }
          }}
        />
      )}
    </div>
  );
}