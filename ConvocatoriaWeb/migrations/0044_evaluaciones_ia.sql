CREATE TABLE IF NOT EXISTS evaluaciones_ia (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER NOT NULL,
  equipo TEXT,
  codigo TEXT,
  repositorio TEXT,
  puntaje REAL,
  viabilidad REAL,
  impacto REAL,
  innovacion REAL,
  pitch REAL,
  etica REAL,
  escalabilidad REAL,
  justificacion TEXT,
  fortalezas TEXT,
  riesgos TEXT,
  modelo TEXT,
  creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_eval_ia_team ON evaluaciones_ia(team_id);
