ALTER TABLE teams ADD COLUMN modalidad TEXT DEFAULT 'presencial';
UPDATE teams SET modalidad = COALESCE((
  SELECT r.modalidad FROM registrations r WHERE r.codigo = teams.codigo AND r.group_id IS NOT NULL LIMIT 1
), 'presencial') WHERE origen = 'registro';
