ALTER TABLE judges ADD COLUMN codigo TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_judges_codigo ON judges(codigo);
