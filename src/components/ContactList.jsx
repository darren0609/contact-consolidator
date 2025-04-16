import React, { useMemo } from 'react';
import { Mail, Phone, Building2, Star, UserCircle, Briefcase, FileSpreadsheet } from 'lucide-react';

const ContactCard = ({ contact, isDuplicate, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-gray-800 rounded-lg shadow-lg p-4 cursor-pointer
        transition-all duration-200 ease-in-out hover:bg-gray-700
        ${isDuplicate ? 'border-2 border-yellow-500' : 'border border-gray-700'}
      `}
    >
      <div className="flex space-x-4">
        {/* Left side - Photo/Avatar */}
        <div className="flex-shrink-0">
          {contact.photo ? (
            <img
              src={contact.photo}
              alt={`${contact.first_name} ${contact.last_name}`}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <UserCircle className="w-16 h-16 text-gray-600" />
          )}
        </div>

        {/* Right side - Contact Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-white truncate">
              {contact.first_name} {contact.last_name}
            </h3>
            {isDuplicate && <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" />}
          </div>
          
          <div className="mt-2 space-y-1">
            {contact.company && (
              <p className="contact-field">
                <Building2 className="contact-icon" />
                <span className="contact-text">{contact.company}</span>
              </p>
            )}
            {contact.job_title && (
              <p className="contact-field">
                <Briefcase className="contact-icon" />
                <span className="contact-text">{contact.job_title}</span>
              </p>
            )}
            {contact.phone && (
              <p className="contact-field">
                <Phone className="contact-icon" />
                <span className="contact-text">{contact.phone}</span>
              </p>
            )}
            {contact.email && (
              <p className="contact-field">
                <Mail className="contact-icon" />
                <span className="contact-text">{contact.email}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ContactList({ contacts, onContactSelect, duplicateIds }) {
  const groupedContacts = useMemo(() => {
    // Group contacts by first letter
    const groups = contacts.reduce((acc, contact) => {
      const letter = (contact.first_name || contact.last_name || '')
        .trim()
        .charAt(0)
        .toUpperCase();
      
      if (!acc[letter]) {
        acc[letter] = [];
      }
      acc[letter].push(contact);
      return acc;
    }, {});

    // Sort letters and their contacts
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([letter, letterContacts]) => [
        letter,
        letterContacts.sort((a, b) => 
          `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
        )
      ]);
  }, [contacts]);

  return (
    <div className="space-y-8 pt-2">
      {groupedContacts.map(([letter, letterContacts]) => (
        <div 
          key={letter} 
          id={`letter-${letter}`}
          className="scroll-mt-16"
        >
          <h2 className="text-xl font-semibold text-white mb-4 bg-gray-900 py-2">
            {letter}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {letterContacts.map(contact => (
              <ContactCard
                key={contact.id}
                contact={contact}
                isDuplicate={duplicateIds.has(contact.id)}
                onClick={() => onContactSelect(contact)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}