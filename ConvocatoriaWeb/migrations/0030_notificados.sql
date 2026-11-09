ALTER TABLE registrations ADD COLUMN notificado INTEGER DEFAULT 0;
ALTER TABLE registrations ADD COLUMN notificado_at TEXT;
UPDATE registrations SET notificado = 1, notificado_at = CURRENT_TIMESTAMP WHERE modalidad = 'presencial';
