const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  const dbPath = path.resolve(__dirname, '../../database/contacts.db');
  const schemaPath = path.resolve(__dirname, './schema.sql');
  
  // Ensure database directory exists
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  try {
    // Open database connection
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Read and execute schema
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await db.exec(schema);
    
    console.log('Database schema updated successfully');
    await db.close();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

initializeDatabase();