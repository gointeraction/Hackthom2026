CREATE TABLE IF NOT EXISTS certificados_mentores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT NOT NULL UNIQUE,
  mentor_id INTEGER,
  nombre TEXT NOT NULL,
  organizacion TEXT,
  creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO certificados_mentores (codigo, mentor_id, nombre, organizacion) VALUES
('B5244BAA', 3, 'José Martin Leonardo  Márquez Vaamonde', 'CETE UNETI'),
('E516D3B0', 5, 'Rosa Oropeza', 'Dirección de Tecnología UNETI'),
('3E2B59F6', 6, 'Cristofer Urbina', 'PNF Ingenieria de Informatica'),
('ABC28E05', 7, 'Alejandro Daniel Rivero Crespo', 'PNF INFORMATICA'),
('F28F0B90', 8, 'Asdrubal Anania Fernandez Farfan', 'PNF Informatica'),
('158A0B2F', 9, 'Jonnathan Rivero', 'PNF Informática'),
('81018687', 10, 'Luis Diaz', 'PNF Informatica'),
('9F2E745C', 13, 'Katiuska Hernández', 'PNF Informática'),
('D93E41D5', 14, 'Vicky Linares', 'UNETI'),
('E07B4E52', 15, 'Yoher Vázquez', 'UNETI'),
('AA0D41C3', 16, 'Militza Saume', 'UNETI'),
('AC58A911', 17, 'Nerissa José Aguilera Arteaga', 'UNETI'),
('8E5B7EDE', 18, 'Katiuska Berroterán', 'UNETI'),
('947B45AA', 19, 'Maria Graciela Herrera González', 'UNETI'),
('43AC8218', 20, 'Eddy Alexander Bolívar Rodriguez', 'UNETI'),
('9DCD46F7', 21, 'Tomas Bolívar Vásquez', 'UNETI'),
('A81D5FD5', 22, 'Maribel Moreno', 'UNETI');

