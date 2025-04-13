const normalizeContact = (contact) => {
  // Normalize fields for comparison
  const firstName = (contact["First Name"] || "").toLowerCase().trim();
  const lastName = (contact["Last Name"] || "").toLowerCase().trim();
  const email = (contact["Email"] || "").toLowerCase().trim();
  const phone = (contact["Phone"] || contact["Mobile"] || contact["Work"] || "").replace(/\D/g, '');

  return {
    name: `${firstName} ${lastName}`.trim(),
    email,
    phone
  };
};

export const findDuplicates = (contacts) => {
  const duplicateGroups = new Map();
  const duplicateIds = new Set();

  contacts.forEach((contact, index) => {
    const normalized = normalizeContact(contact);
    
    // Create a key for comparison
    const key = JSON.stringify({
      name: normalized.name || null,
      email: normalized.email || null,
      phone: normalized.phone || null
    });

    if (!duplicateGroups.has(key)) {
      duplicateGroups.set(key, []);
    }
    duplicateGroups.get(key).push({ ...contact, index });
  });

  // Filter groups with more than one contact
  duplicateGroups.forEach((group) => {
    if (group.length > 1) {
      group.forEach(contact => duplicateIds.add(contact.uniqueId));
    }
  });

  return {
    duplicateIds,
    count: duplicateIds.size,
    groups: Array.from(duplicateGroups.values()).filter(group => group.length > 1)
  };
};