CREATE TABLE IF NOT EXISTS logistica (
  grupo TEXT PRIMARY KEY,
  responsables TEXT NOT NULL DEFAULT '',
  insumos TEXT NOT NULL DEFAULT '',
  actividades TEXT NOT NULL DEFAULT ''
);

INSERT OR IGNORE INTO logistica (grupo, insumos, actividades) VALUES
('1. Coordinación General',
'Plan maestro impreso
Listas de responsables
Canal de coordinación (WhatsApp/radio)
Planilla de incidencias',
'Supervisar el plan maestro
Gestionar permisos MPPCT
Convocar reuniones de seguimiento
Resolver incidencias
Evaluación post-evento'),

('2. Registro y Acreditación',
'Gafetes
Listas de inscritos
Mesas
Computadora
Impresora',
'Acreditar participantes
Verificar preseleccionados y remotos
Control de asistencia'),

('3. Tecnología y Servidores',
'Servidores
Video beam
Red y cables
Estaciones de trabajo
UPS y extensiones',
'Montaje de equipos
Soporte técnico continuo
Prueba de audio/video para pitches
Desmontaje'),

('4. Salas y Espacios',
'Mesas
Sillas
Señalización
Papelería',
'Montaje de espacios
Control de aforo y orden
Desmontaje y limpieza'),

('5. Catering y Alimentación',
'Refrigerios
Almuerzos
Agua
Vajilla y mesas de servicio',
'Coordinar proveedor
Distribución de alimentos
Gestionar dietas especiales'),

('6. Comunicaciones y Difusión',
'Cámara
Trípode
Acceso a redes sociales
Plantillas gráficas',
'Cobertura (fotos y videos)
Redes en vivo
Enviar instructivo a remotos
Comunicado de resultados'),

('7. Protocolo y Charlas',
'Atril
Micrófonos
Presentaciones
Agua para charlistas',
'Acto de apertura
Coordinar charlistas y agenda técnica
Acto de premiación'),

('8. Jurados y Evaluación',
'Rúbricas impresas
Planillas de puntuación
Calculadoras
Laptops',
'Entregar materiales a jurados
Evaluar pitches
Deliberar resultados'),

('9. Voluntariado y Soporte',
'Chalecos identificadores
Mapa de espacios
Radios',
'Apoyo general
Orientar participantes
Apoyar a mentores'),

('10. Seguridad y Accesos',
'Listas de acceso
Gafetes de staff
Contacto MPPCT',
'Control de ingreso
Verificar listas
Salida ordenada');
