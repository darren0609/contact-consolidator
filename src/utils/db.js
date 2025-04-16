import Database from 'better-sqlite3';

class ContactDatabase {
  constructor() {
    this.db = new Database('contacts.sqlite', { verbose: console.log });
    this.initializeDatabase();
  }

  initializeDatabase() {
    // Create contacts table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT,
        last_name TEXT,
        email TEXT,
        mobile TEXT,
        phone TEXT,
        work_phone TEXT,
        company TEXT,
        job_title TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        postal_code TEXT,
        country TEXT,
        notes TEXT,
        source TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create source tracking table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS import_sources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        import_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        contact_count INTEGER NOT NULL
      )
    `);
  }

  // Add method to close database connection
  close() {
    this.db.close();
  }
}

// Create and export a singleton instance
const db = new ContactDatabase();
export default db;