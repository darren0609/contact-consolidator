const API_URL = 'http://localhost:3001/api';

export const contactsApi = {
  async getContacts() {
    const response = await fetch(`${API_URL}/contacts`);
    if (!response.ok) throw new Error('Failed to fetch contacts');
    return response.json();
  },

  async importContacts(contacts, filename) {
    const response = await fetch(`${API_URL}/contacts/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contacts, filename })
    });
    if (!response.ok) throw new Error('Failed to import contacts');
    return response.json();
  },

  async mergeContacts(id1, id2) {
    const response = await fetch(`${API_URL}/contacts/merge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id1, id2 })
    });
    if (!response.ok) throw new Error('Failed to merge contacts');
    return response.json();
  }
};