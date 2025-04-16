export const validateContact = (contact) => {
  const errors = [];

  // Required fields
  if (!contact['First Name']?.trim()) {
    errors.push('First name is required');
  }

  // Email format
  if (contact['Email'] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact['Email'])) {
    errors.push('Invalid email format');
  }

  // Phone number format (basic validation)
  const phoneFields = ['Phone', 'Mobile', 'Work Phone'];
  phoneFields.forEach(field => {
    if (contact[field] && !/^[\d\s\-\(\)\.]+$/.test(contact[field])) {
      errors.push(`Invalid ${field.toLowerCase()} format`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};