import React from 'react';
import ContactCard from './ContactCard';
import { generateContactId } from '../../utils/contactUtils';

export default function ContactList({ contacts, onContactClick, duplicateIds }) {
  const groupedContacts = contacts.reduce((groups, contact) => {
    const name = `${contact["First Name"]} ${contact["Last Name"]}`.trim();
    const letter = (name ? name[0] : '#').toUpperCase();
    
    if (!groups[letter]) {
      groups[letter] = [];
    }
    
    const uniqueId = generateContactId(contact);
    groups[letter].push({
      ...contact,
      uniqueId
    });
    
    return groups;
  }, {});

  const letters = Object.keys(groupedContacts).sort();

  return (
    <div className="flex-1 h-full flex flex-col">
      {/* Letter Index */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="px-6 py-3 flex gap-2">
          {letters.map((letter, index) => (
            <button
              key={`letter-${letter}-${index}`}
              className="px-3 py-1 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
              onClick={() => document.getElementById(`group-${letter}`).scrollIntoView({ behavior: 'smooth' })}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full px-6 py-6">
          <div className="max-w-[50%] space-y-8">
            {letters.map((letter, groupIndex) => (
              <div 
                key={`group-${letter}-${groupIndex}`} 
                id={`group-${letter}`}
              >
                <div className="sticky top-0 bg-gray-900 py-2 mb-4">
                  <h2 className="text-lg font-semibold text-gray-400">
                    {letter}
                  </h2>
                </div>
                <div className="space-y-4">
                  {groupedContacts[letter].map((contact, contactIndex) => (
                    <ContactCard 
                      key={`contact-${contact.uniqueId}-${contactIndex}`}
                      contact={contact}
                      onClick={() => onContactClick(contact)}
                      isDuplicate={duplicateIds.has(contact.uniqueId)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}