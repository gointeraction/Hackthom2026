ALTER TABLE teams ADD COLUMN origen TEXT DEFAULT 'comite';
UPDATE teams SET origen = 'registro' WHERE codigo IN (SELECT DISTINCT codigo FROM registrations WHERE group_id IS NOT NULL);
