import React from 'react';
import { parsePhoneNumber } from 'libphonenumber-js';
import { 
  User, 
  X, 
  Briefcase, 
  Badge, 
  Mail, 
  Phone,
  Smartphone,
  PhoneCall,
  MapPin,
  Home,
  Building,
  CakeSlice,
  Globe,
  Link,
  Star,
  Building2
} from 'lucide-react';

const formatPhoneNumber = (phoneStr) => {
  if (!phoneStr) return '';
  
  try {
    const cleaned = phoneStr.replace(/\D/g, '');
    if (cleaned.length === 10) {
      const phoneNumber = parsePhoneNumber('+1' + cleaned);
      return phoneNumber.formatInternational();
    }
    
    if (cleaned.length > 10) {
      const phoneNumber = parsePhoneNumber('+' + cleaned);
      return phoneNumber.formatInternational();
    }
    return phoneStr;
  } catch (error) {
    return phoneStr;
  }
};

const getPhoneIcon = (key) => {
  const keyLower = key.toLowerCase();
  if (keyLower.includes('mobile') || keyLower.includes('cell')) {
    return Smartphone;
  } else if (keyLower.includes('phone') || keyLower.includes('tel')) {
    return Phone;
  }
  return PhoneCall;
};

// Update icon mappings with more specific cases
const iconComponents = {
  // Contact Methods
  "email": Mail,
  "phone": Phone,
  "mobile": Smartphone,
  "cell": Smartphone,
  "telephone": Phone,
  "fax": Phone,
  
  // Addresses
  "address": Home,
  "home address": Home,
  "office address": Building,
  "work address": Building,
  "business address": Building2,
  
  // Location fields
  "suburb": MapPin,
  "city": MapPin,
  "state": MapPin,
  "zip": MapPin,
  "zipcode": MapPin,
  "postal": MapPin,
  "postal code": MapPin,
  "country": Globe,
  
  // Other fields
  "birthday": CakeSlice,
  "birth date": CakeSlice,
  "dob": CakeSlice,
  "company": Building,
  "job title": Badge,
  "website": Link,
  "url": Link,
  "notes": Star
};

const getFieldIcon = (key, value) => {
  const keyLower = key.toLowerCase();
  
  // Handle phone numbers first
  if (keyLower.includes('phone') || keyLower.includes('mobile') || 
      keyLower.includes('cell') || keyLower.includes('tel')) {
    const Icon = getPhoneIcon(key);
    return <Icon className="w-5 h-5 text-gray-400" />;
  }

  // Handle addresses
  if (keyLower.includes('address')) {
    if (keyLower.includes('work') || keyLower.includes('office') || 
        keyLower.includes('business')) {
      return <Building className="w-5 h-5 text-gray-400" />;
    }
    return <Home className="w-5 h-5 text-gray-400" />;
  }

  // Handle location fields
  if (keyLower.includes('suburb') || keyLower.includes('city') || 
      keyLower.includes('state') || keyLower.includes('zip') || 
      keyLower.includes('postal')) {
    return <MapPin className="w-5 h-5 text-gray-400" />;
  }

  // Handle dates
  if (keyLower.includes('birth') || keyLower.includes('dob')) {
    return <CakeSlice className="w-5 h-5 text-gray-400" />;
  }

  // Handle websites
  if (keyLower.includes('web') || keyLower.includes('url') || 
      value?.toLowerCase().includes('http')) {
    return <Link className="w-5 h-5 text-gray-400" />;
  }

  // Look up icon in components map
  const IconComponent = iconComponents[keyLower] || Star;
  return <IconComponent className="w-5 h-5 text-gray-400" />;
};

const formatFieldValue = (key, value) => {
  const keyLower = key.toLowerCase();
  if (keyLower.includes('phone') || keyLower.includes('mobile') || keyLower.includes('cell')) {
    return formatPhoneNumber(value);
  }
  return value;
};

export default function ContactModal({ contact, onClose }) {
  if (!contact) return null;

  const fieldEntries = Object.entries(contact)
    .filter(([key, value]) => {
      return !["First Name", "Last Name", "Company", "Job Title", "uniqueId", "id"].includes(key) 
        && value 
        && value.trim() !== '';
    });

  return (
    <div className="fixed inset-0 flex items-center justify-end">
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative z-50 h-screen w-[75%] -ml-16 bg-gray-800 shadow-xl animate-slideIn">
        <div className="h-full overflow-y-auto">
          <div className="p-8">
            {/* Header Section */}
            <div className="flex items-start space-x-8 mb-8 border-b border-gray-700 pb-8">
              <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-16 h-16 text-gray-400" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h2 className="text-3xl font-bold text-white truncate pr-4">
                    {[contact["First Name"], contact["Last Name"]].filter(Boolean).join(' ')}
                  </h2>
                  <button 
                    onClick={onClose}
                    className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors flex-shrink-0"
                    aria-label="Close modal"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {contact["Company"] && (
                  <div className="flex items-center gap-2 text-gray-400 mt-4">
                    <Building className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate text-lg">{contact["Company"]}</span>
                  </div>
                )}
                
                {contact["Job Title"] && (
                  <div className="flex items-center gap-2 text-gray-400 mt-2">
                    <Badge className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate text-lg">{contact["Job Title"]}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Field Entries Grid */}
            <div className="grid grid-cols-2 gap-6">
              {fieldEntries.map(([key, value]) => (
                <div 
                  key={key}
                  className="bg-gray-700 p-6 rounded-lg flex items-center gap-4"
                >
                  <div className="flex-shrink-0 bg-gray-600 p-3 rounded-full">
                    {getFieldIcon(key, value)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-lg text-white truncate">
                      {formatFieldValue(key, value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}