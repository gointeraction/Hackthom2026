CREATE TABLE IF NOT EXISTS tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref TEXT NOT NULL,
  persona_tipo TEXT NOT NULL,
  nombre TEXT NOT NULL,
  codigo TEXT,
  dia TEXT NOT NULL,
  comida TEXT NOT NULL,
  entregado INTEGER DEFAULT 0,
  entregado_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(ref, dia, comida)
);

CREATE TABLE IF NOT EXISTS personal_logistica (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  rol TEXT,
  correo TEXT,
  telefono TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
