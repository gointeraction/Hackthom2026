CREATE TABLE IF NOT EXISTS registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  correo TEXT NOT NULL UNIQUE,
  nacimiento TEXT NOT NULL,
  anio TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_registrations_correo ON registrations(correo);
