import { levenshteinDistance } from './stringUtils';

export const generateContactId = (contact) => {
  const firstName = (contact["First Name"] || '').toLowerCase().trim();
  const lastName = (contact["Last Name"] || '').toLowerCase().trim();
  const email = (contact["Email"] || '').toLowerCase().trim();
  const phone = (contact["Mobile"] || contact["Phone"] || contact["Work"] || '').replace(/\D/g, '');
  
  return `${firstName}-${lastName}-${email}-${phone}`;
};

export const findDuplicates = (contacts) => {
  if (!Array.isArray(contacts) || contacts.length === 0) {
    return {
      groups: new Map(),
      duplicateIds: new Set(),
      count: 0
    };
  }

  const duplicateGroups = new Map();
  const duplicateIds = new Set();
  
  contacts.forEach((contact, idx) => {
    if (!contact) return;
    
    // Skip if we've already processed this contact as a duplicate
    if (duplicateIds.has(contact.id)) return;

    const matches = contacts
      .slice(idx + 1)
      .filter(candidate => {
        if (!candidate) return false;
        
        const isMatch = checkForDuplicate(contact, candidate);
        if (isMatch) {
          duplicateIds.add(candidate.id);
          return true;
        }
        return false;
      })
      .map(match => ({
        contact: match,
        confidence: calculateMatchConfidence(contact, match)
      }));

    if (matches.length > 0) {
      duplicateGroups.set(contact, matches);
      duplicateIds.add(contact.id);
    }
  });

  return {
    groups: duplicateGroups,
    duplicateIds,
    count: duplicateGroups.size
  };
};

const checkForDuplicate = (contact1, contact2) => {
  // Exact match on email
  if (contact1.email && contact2.email && 
      contact1.email.toLowerCase() === contact2.email.toLowerCase()) {
    return true;
  }

  // Exact match on phone
  if (contact1.phone && contact2.phone && 
      normalizePhone(contact1.phone) === normalizePhone(contact2.phone)) {
    return true;
  }

  // Name match with high similarity
  const name1 = `${contact1.first_name || ''} ${contact1.last_name || ''}`.toLowerCase().trim();
  const name2 = `${contact2.first_name || ''} ${contact2.last_name || ''}`.toLowerCase().trim();
  
  if (name1 && name2) {
    const similarity = calculateNameSimilarity(name1, name2);
    if (similarity >= 0.8) return true;
  }

  return false;
};

const calculateMatchConfidence = (contact1, contact2) => {
  let score = 0;
  let checks = 0;

  // Email match
  if (contact1.email && contact2.email) {
    score += (contact1.email.toLowerCase() === contact2.email.toLowerCase()) ? 1 : 0;
    checks++;
  }

  // Phone match
  if (contact1.phone && contact2.phone) {
    score += (normalizePhone(contact1.phone) === normalizePhone(contact2.phone)) ? 1 : 0;
    checks++;
  }

  // Name similarity
  const name1 = `${contact1.first_name || ''} ${contact1.last_name || ''}`.toLowerCase().trim();
  const name2 = `${contact2.first_name || ''} ${contact2.last_name || ''}`.toLowerCase().trim();
  
  if (name1 && name2) {
    score += calculateNameSimilarity(name1, name2);
    checks++;
  }

  return checks > 0 ? score / checks : 0;
};

const calculateNameSimilarity = (str1, str2) => {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1;
  
  const distance = levenshteinDistance(str1, str2);
  return 1 - (distance / maxLength);
};

const normalizePhone = (phone) => {
  return phone.replace(/\D/g, '');
};