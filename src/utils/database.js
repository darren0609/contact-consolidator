import sqlite3 from 'sqlite3';
const { verbose } = sqlite3;
const sqlite = verbose();

class DatabaseHandler {
  constructor() {
    this.db = null;
  }

  initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite.Database('./contacts.db', (err) => {
        if (err) {
          reject(err);
          return;
        }
        this.createTables()
          .then(resolve)
          .catch(reject);
      });
    });
  }

  createTables() {
    return new Promise((resolve, reject) => {
      const tables = [
        `CREATE TABLE IF NOT EXISTS contacts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          first_name TEXT,
          last_name TEXT,
          email TEXT,
          work_email TEXT,
          personal_email TEXT,
          mobile TEXT,
          phone TEXT,
          work_phone TEXT,
          company TEXT,
          job_title TEXT,
          notes TEXT,
          source_file TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          merged_from_id INTEGER,
          FOREIGN KEY(merged_from_id) REFERENCES contacts(id)
        )`,
        `CREATE TABLE IF NOT EXISTS contact_merges (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          source_id INTEGER,
          target_id INTEGER,
          merged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(source_id) REFERENCES contacts(id),
          FOREIGN KEY(target_id) REFERENCES contacts(id)
        )`
      ];

      this.db.serialize(() => {
        this.db.run('BEGIN TRANSACTION');
        tables.forEach(table => this.db.run(table));
        this.db.run('COMMIT', (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  }

  findDuplicates() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          c1.id as id1,
          c2.id as id2,
          c1.first_name,
          c1.last_name,
          c1.email,
          c2.email as email2,
          c1.phone,
          c2.phone as phone2,
          CASE
            WHEN c1.phone = c2.phone THEN 'phone'
            WHEN c1.email = c2.email THEN 'email'
            WHEN c1.first_name = c2.first_name AND c1.last_name = c2.last_name THEN 'name'
          END as match_reason,
          CASE
            WHEN c1.phone = c2.phone THEN 1
            WHEN c1.email = c2.email THEN 0.9
            WHEN c1.first_name = c2.first_name AND c1.last_name = c2.last_name THEN 0.8
          END as similarity_score
        FROM contacts c1
        JOIN contacts c2 ON c1.id < c2.id
        WHERE (
          c1.phone = c2.phone OR
          c1.email = c2.email OR
          (c1.first_name = c2.first_name AND c1.last_name = c2.last_name)
        )
        AND c1.merged_from_id IS NULL
        AND c2.merged_from_id IS NULL
        ORDER BY similarity_score DESC
      `;

      this.db.all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async mergeContacts(id1, id2) {
    let [contact1, contact2] = await Promise.all([
      this.getContactById(id1),
      this.getContactById(id2)
    ]);

    if (!contact1 || !contact2) {
      throw new Error('One or both contacts not found');
    }

    // Swap contacts if necessary to ensure contact1 has the personal email
    if (contact2.source_file === 'personal.csv') {
      [contact1, contact2] = [contact2, contact1];
    }

    const mergedContact = {
      first_name: contact1.first_name || contact2.first_name,
      last_name: contact1.last_name || contact2.last_name,
      email: contact2.source_file === 'work.csv' ? contact1.email : contact2.email,
      work_email: contact2.source_file === 'work.csv' ? contact2.email : contact1.work_email,
      mobile: contact2.mobile || contact1.mobile,
      phone: contact1.phone || contact2.phone,
      work_phone: contact2.work_phone || contact1.work_phone,
      company: contact2.company || contact1.company,
      job_title: contact2.job_title || contact1.job_title,
      notes: [contact1.notes, contact2.notes].filter(Boolean).join('\n'),
      merged_from_id: id2
    };

    const setClause = Object.keys(mergedContact)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = [...Object.values(mergedContact), id1];

    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run('BEGIN TRANSACTION');

        this.db.run(
          `UPDATE contacts SET ${setClause} WHERE id = ?`,
          values,
          (err) => {
            if (err) {
              console.error('Update error:', err);
              this.db.run('ROLLBACK');
              reject(err);
              return;
            }
          }
        );

        this.db.run(
          `INSERT INTO contact_merges (source_id, target_id) VALUES (?, ?)`,
          [id2, id1],
          (err) => {
            if (err) {
              console.error('Merge tracking error:', err);
              this.db.run('ROLLBACK');
              reject(err);
              return;
            }
          }
        );

        this.db.run('COMMIT', (err) => {
          if (err) {
            reject(err);
          } else {
            this.getContactById(id1).then(resolve).catch(reject);
          }
        });
      });
    });
  }

  getContactById(id) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM contacts WHERE id = ?',  // Removed merged_from_id check
        [id],
        (err, row) => {
          if (err) {
            console.error('Database error:', err);
            reject(err);
            return;
          }
          if (!row) {
            console.error(`No contact found with id ${id}`);
            reject(new Error(`Contact with id ${id} not found`));
            return;
          }
          console.log(`Found contact:`, row);
          resolve(row);
        }
      );
    });
  }

  importContacts(contacts, filename) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO contacts (
          first_name, last_name, email, phone, mobile,
          work_phone, company, job_title, notes, source_file
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      this.db.serialize(() => {
        this.db.run('BEGIN TRANSACTION');

        contacts.forEach(contact => {
          stmt.run(
            contact['First Name'],
            contact['Last Name'],
            contact['Email'],
            contact['Phone'],
            contact['Mobile'],
            contact['Work Phone'],
            contact['Company'],
            contact['Job Title'],
            contact['Notes'],
            filename,
            (err) => {
              if (err) {
                this.db.run('ROLLBACK');
                reject(err);
                return;
              }
            }
          );
        });

        stmt.finalize();
        this.db.run('COMMIT', (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  }

  getContacts() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM contacts', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

export const db = new DatabaseHandler();