CREATE TABLE IF NOT EXISTS certificados_ponentes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT NOT NULL UNIQUE,
  ponente TEXT NOT NULL,
  charla_id INTEGER,
  titulo TEXT,
  dia INTEGER,
  hora_inicio TEXT,
  hora_fin TEXT,
  creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO certificados_ponentes (codigo, ponente, charla_id, titulo, dia, hora_inicio, hora_fin) VALUES
('8FBEBE7A', 'Jorge Barrero', 1, 'DeepSeek Harness', 1, '09:30', '10:00'),
('679029E3', 'Carlos Berbeci', 2, 'Antigravity', 1, '10:00', '10:30'),
('B6C7BF5E', 'José Yvan Bohorquez', 3, 'Cloudflare', 1, '11:00', '11:35'),
('E3EA70B6', 'Alex Cabello', 4, 'Ciberseguridad', 1, '11:35', '12:10'),
('1BF2E0CC', 'Yoher Vazquez', 5, 'Creación y gestión de Agentes IA', 2, '09:30', '10:05'),
('714560CE', 'Rafael Nuñez', 6, 'Ciberseguridad', 2, '10:05', '10:40');
