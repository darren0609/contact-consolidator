import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { db } from '../utils/database';
import fs from 'fs/promises';

describe('DatabaseHandler', () => {
  beforeAll(async () => {
    await db.initialize();
  });

  afterAll(async () => {
    await db.close();
    try {
      await fs.unlink('./contacts.db');
    } catch (error) {
      console.error('Error cleaning up test database:', error);
    }
  });

  beforeEach(async () => {
    // Clear contacts table before each test
    await new Promise((resolve, reject) => {
      db.db.run('DELETE FROM contacts', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  it('should initialize database with required tables', async () => {
    return new Promise((resolve, reject) => {
      db.db.all(
        "SELECT name FROM sqlite_master WHERE type='table'",
        (err, tables) => {
          if (err) reject(err);
          const tableNames = tables.map(t => t.name);
          expect(tableNames).toContain('contacts');
          resolve();
        }
      );
    });
  });

  it('should import contacts successfully', async () => {
    const testContacts = [
      {
        'First Name': 'John',
        'Last Name': 'Doe',
        'Email': 'john@example.com',
        'Phone': '123-456-7890'
      }
    ];

    await db.importContacts(testContacts, 'test.csv');
    const savedContacts = await db.getContacts();
    
    expect(savedContacts.length).toBe(1);
    expect(savedContacts[0].first_name).toBe('John');
    expect(savedContacts[0].email).toBe('john@example.com');
  });

  it('should detect duplicate contacts', async () => {
    const contacts = [
      {
        'First Name': 'John',
        'Last Name': 'Doe',
        'Email': 'john@example.com',
        'Phone': '123-456-7890'
      },
      {
        'First Name': 'John',
        'Last Name': 'Doe',
        'Email': 'john.doe@other.com',
        'Phone': '123-456-7890'
      }
    ];

    await db.importContacts(contacts, 'test1.csv');
    const duplicates = await db.findDuplicates();
    
    expect(duplicates.length).toBeGreaterThan(0);
    expect(duplicates[0].similarity_score).toBeGreaterThan(0.7);
    expect(duplicates[0].match_reason).toContain('phone');
  });

  it('should merge duplicate contacts', async () => {
    // First contact
    await db.importContacts([{
      'First Name': 'John',
      'Last Name': 'Doe',
      'Email': 'john@example.com',
      'Phone': '123-456-7890'
    }], 'personal.csv');

    // Second contact
    await db.importContacts([{
      'First Name': 'John',
      'Last Name': 'Doe',
      'Email': 'john.doe@work.com',
      'Mobile': '987-654-3210',
      'Company': 'Acme Corp'
    }], 'work.csv');

    // Get all contacts and log them for debugging
    const contacts = await db.getContacts();
    console.log('Available contacts:', contacts);

    // Verify we have exactly 2 contacts
    expect(contacts.length).toBe(2);

    // Get the actual IDs from the database
    const sourceId = contacts[0].id;
    const targetId = contacts[1].id;

    console.log(`Attempting to merge contact ${sourceId} into ${targetId}`);

    // Perform the merge
    const merged = await db.mergeContacts(targetId, sourceId);
    
    // Verify merged data
    expect(merged).toBeDefined();
    expect(merged.first_name).toBe('John');
    expect(merged.last_name).toBe('Doe');
    expect(merged.email).toBe('john@example.com');
    expect(merged.work_email).toBe('john.doe@work.com');
    expect(merged.phone).toBe('123-456-7890');
    expect(merged.company).toBe('Acme Corp');
  });
});