CREATE TABLE IF NOT EXISTS evaluador_config (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  prompt TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS evaluaciones (
  group_id TEXT PRIMARY KEY,
  propuesta TEXT,
  puntaje REAL,
  justificacion TEXT,
  estado TEXT NOT NULL DEFAULT 'pendiente'
);
