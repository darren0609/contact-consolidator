export const generateContactId = (contact) => {
  const firstName = (contact["First Name"] || '').toLowerCase().trim();
  const lastName = (contact["Last Name"] || '').toLowerCase().trim();
  const email = (contact["Email"] || '').toLowerCase().trim();
  const phone = (contact["Mobile"] || contact["Phone"] || contact["Work"] || '').replace(/\D/g, '');
  
  return `${firstName}-${lastName}-${email}-${phone}`;
};

export const findDuplicates = (contacts) => {
  const seen = new Map();
  const duplicateIds = new Set();

  contacts.forEach((contact) => {
    const id = generateContactId(contact);
    if (seen.has(id)) {
      duplicateIds.add(id);
      duplicateIds.add(seen.get(id));
    } else {
      seen.set(id, id);
    }
  });

  return {
    duplicateIds,
    count: duplicateIds.size
  };
};