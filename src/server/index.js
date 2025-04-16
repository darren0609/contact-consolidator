import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Database } from './db.js';
import { parse } from 'csv-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3001;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize database
const db = new Database(join(__dirname, '../../contacts.db'));

// Initialize schema before starting server
await db.initialize();

// Add new table for dismissed matches
await db.run(`
  CREATE TABLE IF NOT EXISTS dismissed_matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contact1_id INTEGER,
    contact2_id INTEGER,
    dismissed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reason TEXT,
    UNIQUE(contact1_id, contact2_id),
    FOREIGN KEY(contact1_id) REFERENCES contacts(id),
    FOREIGN KEY(contact2_id) REFERENCES contacts(id)
  )
`);

// Move findDuplicates function to the top level
const findDuplicates = async (contacts) => {
  const dismissedPairs = await db.all(`
    SELECT contact1_id, contact2_id FROM dismissed_matches
  `);
  
  const dismissedSet = new Set(
    dismissedPairs.map(pair => `${pair.contact1_id}-${pair.contact2_id}`)
  );

  const duplicateGroups = new Map();
  
  // Process each contact for duplicates
  contacts.forEach((contact, idx) => {
    if (!contact) return;
    
    const matches = contacts
      .slice(idx + 1)
      .filter(candidate => {
        if (!candidate) return false;
        if (dismissedSet.has(`${contact.id}-${candidate.id}`)) return false;
        
        // Your existing duplicate detection logic
        return checkForDuplicate(contact, candidate);
      })
      .map(match => ({
        contact: match,
        confidence: calculateMatchConfidence(contact, match)
      }));

    if (matches.length > 0) {
      duplicateGroups.set(contact, matches);
    }
  });
  
  return {
    groups: duplicateGroups,
    count: duplicateGroups.size
  };
};

// API Routes
app.get('/api/contacts', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM contacts WHERE merged_from_id IS NULL');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

app.post('/api/contacts/merge', async (req, res) => {
  try {
    console.log('🔄 Processing merge request:', JSON.stringify(req.body, null, 2));

    const { primary, secondary, mergedData } = req.body;

    // Validate request data
    if (!primary?.id || !secondary?.id || !mergedData) {
      const error = {
        error: 'Missing required data',
        details: 'Invalid request data',
        received: { primary, secondary, mergedData }
      };
      console.error('❌ Validation failed:', error);
      return res.status(400).json(error);
    }

    await db.withTransaction(async () => {
      // Update primary contact
      await db.run(`
        UPDATE contacts 
        SET first_name = ?,
            last_name = ?,
            email = ?,
            phone = ?,
            company = ?,
            notes = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        mergedData.first_name || '',
        mergedData.last_name || '',
        mergedData.email || '',
        mergedData.phone || '',
        mergedData.company || '',
        mergedData.notes || '{}',
        primary.id
      ]);

      // Add merge history
      await db.run(`
        INSERT INTO merge_history (
          primary_contact_id,
          secondary_contact_id,
          result_contact_id,
          merge_data
        ) VALUES (?, ?, ?, ?)
      `, [
        primary.id,
        secondary.id,
        primary.id,
        JSON.stringify({ primary, secondary, mergedData })
      ]);

      // Delete secondary contact
      await db.run('DELETE FROM contacts WHERE id = ?', [secondary.id]);
    });

    res.json({ 
      success: true,
      message: 'Contacts merged successfully'
    });
  } catch (error) {
    console.error('❌ Merge failed:', error);
    res.status(500).json({
      error: 'Failed to merge contacts',
      details: error.message
    });
  }
});

app.post('/api/contacts/import', async (req, res) => {
  try {
    const { records } = req.body;
    
    await db.withTransaction(async () => {
      const chunkSize = 100;
      for (let i = 0; i < records.length; i += chunkSize) {
        const chunk = records.slice(i, i + chunkSize);
        const values = chunk.map(() => '(?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)').join(',');
        const params = chunk.flatMap(record => [
          record.first_name || '',
          record.last_name || '',
          record.email || '',
          record.phone || '',
          record.company || '',
          'csv_import',
          JSON.stringify(record.notes || {})
        ]);

        await db.run(`
          INSERT INTO contacts (
            first_name, last_name, email, phone, company, source_file,
            created_at, updated_at, notes
          ) VALUES ${values}
        `, params);
      }
    });

    res.json({ success: true, count: records.length });
  } catch (error) {
    console.error('Import failed:', error);
    res.status(500).json({ error: 'Failed to import contacts' });
  }
});

// Add dismiss match endpoint
app.post('/api/contacts/dismiss-match', async (req, res) => {
  const { contact1Id, contact2Id } = req.body;

  if (!contact1Id || !contact2Id) {
    return res.status(400).json({ error: 'Both contact IDs are required' });
  }

  try {
    await db.withTransaction(async () => {
      // First try to insert normally
      try {
        await db.run(`
          INSERT INTO dismissed_matches (contact1_id, contact2_id)
          VALUES (?, ?)
        `, [contact1Id, contact2Id]);
      } catch (insertError) {
        // If unique constraint fails, check if reverse order exists
        if (insertError.code === 'SQLITE_CONSTRAINT') {
          // Try reverse order
          await db.run(`
            INSERT OR IGNORE INTO dismissed_matches (contact1_id, contact2_id)
            VALUES (?, ?)
          `, [contact2Id, contact1Id]);
        } else {
          throw insertError; // Re-throw if it's a different error
        }
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to dismiss match:', error);
    res.status(500).json({ error: 'Failed to dismiss match' });
  }
});

// Add endpoint to fetch merge history
app.get('/api/contacts/:id/merge-history', async (req, res) => {
  try {
    // Check if table exists
    const tableExists = await db.get(`
      SELECT name 
      FROM sqlite_master 
      WHERE type='table' AND name='merge_history'
    `);

    if (!tableExists) {
      // Initialize the table if it doesn't exist
      await db.exec(`
        CREATE TABLE IF NOT EXISTS merge_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          merged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          primary_contact_id INTEGER,
          secondary_contact_id INTEGER,
          result_contact_id INTEGER,
          merge_data TEXT,
          FOREIGN KEY(result_contact_id) REFERENCES contacts(id)
        )
      `);
      return res.json([]);
    }

    const history = await db.all(`
      SELECT 
        m.*,
        c1.first_name as primary_first_name,
        c1.last_name as primary_last_name,
        c2.first_name as secondary_first_name,
        c2.last_name as secondary_last_name
      FROM merge_history m
      LEFT JOIN contacts c1 ON m.primary_contact_id = c1.id
      LEFT JOIN contacts c2 ON m.secondary_contact_id = c2.id
      WHERE m.primary_contact_id = ? OR m.secondary_contact_id = ?
      ORDER BY m.merged_at DESC
    `, [req.params.id, req.params.id]);

    res.json(history);
  } catch (error) {
    console.error('Failed to fetch merge history:', error);
    res.status(500).json({ error: 'Failed to fetch merge history' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await db.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error closing database:', error);
    process.exit(1);
  }
});