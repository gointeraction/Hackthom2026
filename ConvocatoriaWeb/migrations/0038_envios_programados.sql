CREATE TABLE IF NOT EXISTS envios_programados (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  clave TEXT UNIQUE NOT NULL,
  descripcion TEXT,
  ejecutar_at TEXT NOT NULL,
  ejecutado INTEGER DEFAULT 0,
  ejecutado_at TEXT,
  resultado TEXT
);

INSERT OR IGNORE INTO envios_programados (clave, descripcion, ejecutar_at)
VALUES (
  'instructivo-remoto',
  'Instructivo del panel remoto a participantes remotos',
  '2026-11-11T23:00:00Z'
);
