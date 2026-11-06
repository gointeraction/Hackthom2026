ALTER TABLE registrations ADD COLUMN group_id TEXT;
ALTER TABLE registrations ADD COLUMN validated INTEGER NOT NULL DEFAULT 0;
ALTER TABLE registrations ADD COLUMN validation_token TEXT;

CREATE INDEX IF NOT EXISTS idx_registrations_token ON registrations(validation_token);
