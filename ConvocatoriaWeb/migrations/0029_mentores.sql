CREATE TABLE IF NOT EXISTS mentores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  organizacion TEXT,
  correo TEXT,
  telefono TEXT,
  eje TEXT,
  team_id INTEGER,
  activo INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_mentores_team ON mentores(team_id);
