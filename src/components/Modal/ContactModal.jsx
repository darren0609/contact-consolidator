import React, { useState, useEffect } from 'react';
import { parsePhoneNumber } from 'libphonenumber-js';
import { 
  UserCircle, 
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
  Building2,
  Clock
} from 'lucide-react';
import { SourceIndicator } from '../SourceIndicator';

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

const ContactModal = ({ contact, onClose, onSave }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:3001/api/contacts/${contact.id}/merge-history`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error('Failed to fetch history:', error);
        setError('Failed to load merge history');
      } finally {
        setLoading(false);
      }
    };

    if (contact?.id) {
      fetchHistory();
    }
  }, [contact?.id]);

  if (!contact) return null;

  const fieldEntries = Object.entries(contact)
    .filter(([key, value]) => {
      return !["First Name", "Last Name", "Company", "Job Title", "uniqueId", "id"].includes(key) 
        && value 
        && value.trim() !== '';
    });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl mx-4">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-start">
            <div className="flex space-x-4">
              {/* Contact Photo/Avatar */}
              <div className="flex-shrink-0">
                {contact.photo ? (
                  <img
                    src={contact.photo}
                    alt={`${contact.first_name} ${contact.last_name}`}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-24 h-24 text-gray-600" />
                )}
              </div>

              {/* Contact Summary */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-2xl font-bold text-white">
                    {contact.first_name} {contact.last_name}
                  </h2>
                  <SourceIndicator source={contact.source_type} />
                </div>
                {contact.company && (
                  <p className="text-gray-300 flex items-center space-x-2 mb-1">
                    <Building2 className="w-4 h-4" />
                    <span>{contact.company}</span>
                  </p>
                )}
                {contact.job_title && (
                  <p className="text-gray-300 flex items-center space-x-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{contact.job_title}</span>
                  </p>
                )}
              </div>
            </div>
            
            <button onClick={onClose}>
              <X className="w-6 h-6 text-gray-400 hover:text-white" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto">
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

          {/* Merge History Section */}
          {history.length > 0 && (
            <div className="mt-6 border-t border-gray-700 pt-4">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Merge History
              </h3>
              <div className="space-y-3">
                {history.map((record) => (
                  <div key={record.id} className="bg-gray-700/50 rounded p-3">
                    <p className="text-sm text-gray-300">
                      Merged with {record.secondary_first_name} {record.secondary_last_name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(record.merged_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-4 text-gray-400">
              Loading merge history...
            </div>
          )}

          {error && (
            <div className="text-center py-4 text-red-400">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;