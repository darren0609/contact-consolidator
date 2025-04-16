export const exportFormats = {
  CSV: 'csv',
  VCARD: 'vcard',
  JSON: 'json'
};

const convertToCSV = (contacts) => {
  if (!contacts.length) return '';
  
  const headers = Object.keys(contacts[0]);
  const csvHeader = headers.join(',');
  const csvRows = contacts.map(contact => 
    headers.map(header => contact[header] || '').join(',')
  );
  
  return [csvHeader, ...csvRows].join('\n');
};

const convertToVCard = (contacts) => {
  return contacts.map(contact => {
    const vcard = [];
    vcard.push('BEGIN:VCARD');
    vcard.push('VERSION:3.0');
    vcard.push(`FN:${contact.first_name} ${contact.last_name}`);
    vcard.push(`N:${contact.last_name};${contact.first_name};;;`);
    if (contact.email) vcard.push(`EMAIL:${contact.email}`);
    if (contact.phone) vcard.push(`TEL:${contact.phone}`);
    vcard.push('END:VCARD');
    return vcard.join('\n');
  }).join('\n\n');
};

export const exportContacts = async (contacts, format) => {
  switch (format) {
    case exportFormats.CSV:
      return convertToCSV(contacts);
    case exportFormats.VCARD:
      return convertToVCard(contacts);
    case exportFormats.JSON:
      return JSON.stringify(contacts, null, 2);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};