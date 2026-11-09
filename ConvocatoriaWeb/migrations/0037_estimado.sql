CREATE TABLE IF NOT EXISTS estimado_personas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  grupo TEXT NOT NULL,
  rol TEXT NOT NULL,
  minimo INTEGER DEFAULT 0,
  maximo INTEGER DEFAULT 0,
  central INTEGER DEFAULT 0,
  nota TEXT,
  orden INTEGER DEFAULT 0
);

INSERT INTO estimado_personas (grupo, rol, minimo, maximo, central, nota, orden) VALUES
('Participantes', 'Participantes presenciales', 62, 62, 62, 'Confirmados en el sistema', 1),
('Participantes', 'Participantes remotos', 2, 2, 2, 'Confirmados en el sistema', 2),
('Participantes', 'Ponentes', 6, 6, 6, 'Charlas confirmadas', 3),
('Personal', 'Jurados', 5, 7, 6, '1 por cada 2–3 equipos', 4),
('Personal', 'Mentores', 6, 8, 7, '1 por equipo presencial', 5),
('Personal', 'Personal de logística', 15, 20, 18, 'Acreditación, alimentación, transporte, sala, insumos', 6),
('Personal', 'Responsables de grupo', 6, 8, 7, '1 por área operativa', 7),
('Personal', 'Staff institucional', 8, 12, 10, 'Mincyt, IVIC, UNETI, FONACIT, CAVECOM-E', 8),
('Personal', 'Prensa y difusión', 5, 5, 5, 'Equipo de comunicación', 9),
('Invitados', 'Autoridades', 6, 10, 8, 'Mincyt, IVIC, UNETI, FONACIT', 10),
('Invitados', 'Aliados y patrocinadores', 4, 6, 5, 'Parque Tecnológico, CAVECOM-E', 11),
('Invitados', 'Invitados especiales', 3, 5, 4, 'Invitaciones protocolares', 12);
