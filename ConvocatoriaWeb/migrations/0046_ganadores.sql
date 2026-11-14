CREATE TABLE IF NOT EXISTS ganadores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo TEXT NOT NULL DEFAULT 'puesto',
  puesto INTEGER,
  team_id INTEGER,
  equipo TEXT NOT NULL,
  proyecto TEXT,
  puntaje REAL,
  nota TEXT,
  orden INTEGER NOT NULL DEFAULT 0,
  creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO ganadores (tipo, puesto, team_id, equipo, proyecto, puntaje, nota, orden) VALUES
('puesto', 1, 8, 'Aduana IA', '', 4.60, 'Pasarela de confianza para IA en servicios públicos.', 1),
('reconocimiento', NULL, 5, 'Los 39', '', 4.53, 'Equipo invitado · reconocimiento especial por su participación.', 2),
('puesto', 2, 9, 'Centinela', '', 4.23, '', 3),
('puesto', 3, 7, 'Alfa', '', 4.26, '', 4);
