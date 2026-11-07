CREATE TABLE IF NOT EXISTS charlas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  ponente TEXT,
  contacto TEXT,
  dia INTEGER NOT NULL DEFAULT 1,
  hora_inicio TEXT,
  hora_fin TEXT,
  orden INTEGER DEFAULT 0
);
