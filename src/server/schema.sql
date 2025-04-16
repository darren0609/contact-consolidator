CREATE TABLE IF NOT EXISTS merge_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    merged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    primary_contact_id INTEGER,
    secondary_contact_id INTEGER,
    result_contact_id INTEGER,
    merge_data TEXT,
    FOREIGN KEY(result_contact_id) REFERENCES contacts(id)
);