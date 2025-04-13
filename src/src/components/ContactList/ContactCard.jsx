import React from 'react';
import { User, Mail, Phone, AlertTriangle } from 'lucide-react';

export default function ContactCard({ contact, onClick, isDuplicate }) {
  const phoneNumber = contact["Mobile"] || contact["Phone"] || contact["Work"] || contact["Home"] || "";
  
  return (
    <div 
      onClick={onClick}
      className="bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-700 cursor-pointer transition-all duration-200 relative"
    >
      {isDuplicate && (
        <div 
          className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1.5 z-10 shadow-lg"
          title="Possible duplicate contact"
        >
          <AlertTriangle className="w-4 h-4 text-gray-900" />
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 min-w-0 mr-4">
          <h3 className="text-white font-medium truncate">
            {`${contact["First Name"] || ""} ${contact["Last Name"] || ""}`.trim()}
          </h3>
          
          <div className="text-sm text-gray-400 space-y-0.5">
            <p className="truncate">{contact["Company"] || ""}</p>
            <p className="truncate">{contact["Job Title"] || ""}</p>
          </div>
        </div>

        <div className="w-[180px] flex flex-col items-start text-sm text-gray-400 space-y-0.5">
          {phoneNumber && (
            <div className="flex items-center gap-1 w-full">
              <Phone className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{phoneNumber}</span>
            </div>
          )}
          
          {contact["Email"] && (
            <div className="flex items-center gap-1 w-full">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{contact["Email"]}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}