import React, { useState, useCallback } from 'react';
import { findDuplicates } from './utils/contactUtils';
import Sidebar from './components/Sidebar/Sidebar';
import ContactList from './components/ContactList';
import ContactModal from './components/Modal/ContactModal';

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [duplicateInfo, setDuplicateInfo] = useState({ count: 0, duplicateIds: new Set() });

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const handleImportCsv = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n');
        const headers = rows[0].split(',');
        
        const parsedContacts = rows.slice(1)
          .filter(row => row.trim()) // Filter out empty rows
          .map((row) => {
            const values = row.split(',');
            return headers.reduce((obj, header, idx) => {
              obj[header.trim()] = values[idx]?.trim() || '';
              return obj;
            }, {});
          });

        const { duplicateIds, count } = findDuplicates(parsedContacts);
        console.log(`Found ${count} duplicates`); // Debug log
        
        setDuplicateInfo({
          count,
          duplicateIds
        });
        setContacts(parsedContacts);
      };
      reader.readAsText(file);
    }
  }, []);

  const filteredContacts = contacts.filter(contact => {
    if (!searchTerm) return true;
    const searchableFields = ['First Name', 'Last Name', 'Company', 'Email'];
    return searchableFields.some(field => 
      contact[field]?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar 
        onSearch={handleSearch}
        onImportCsv={handleImportCsv}
        duplicatesCount={duplicateInfo.count}
      />
      
      <main className="flex-1 ml-[20%]">
        <ContactList 
          contacts={filteredContacts}
          onContactClick={setSelectedContact}
          duplicateIds={duplicateInfo.duplicateIds}
        />
      </main>

      {selectedContact && (
        <ContactModal 
          contact={selectedContact} 
          onClose={() => setSelectedContact(null)} 
          isDuplicate={duplicateInfo.duplicateIds.has(selectedContact.uniqueId)}
        />
      )}
    </div>
  );
}