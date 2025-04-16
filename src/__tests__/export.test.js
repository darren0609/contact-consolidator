import { describe, it, expect } from 'vitest';
import { exportContacts, exportFormats } from '../utils/export';

describe('Contact Export', () => {
  const testContacts = [
    {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '123-456-7890'
    }
  ];

  it('should export to CSV format', async () => {
    const csv = await exportContacts(testContacts, exportFormats.CSV);
    expect(csv).toContain('first_name,last_name,email,phone');
    expect(csv).toContain('John,Doe,john@example.com,123-456-7890');
  });

  it('should export to vCard format', async () => {
    const vcard = await exportContacts(testContacts, exportFormats.VCARD);
    expect(vcard).toContain('BEGIN:VCARD');
    expect(vcard).toContain('FN:John Doe');
    expect(vcard).toContain('END:VCARD');
  });

  it('should export to JSON format', async () => {
    const json = await exportContacts(testContacts, exportFormats.JSON);
    expect(JSON.parse(json)).toEqual(testContacts);
  });
});