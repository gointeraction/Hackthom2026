PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE IF NOT EXISTS "d1_migrations"(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(1,'0001_registrations.sql','2026-10-31 20:48:16');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(2,'0002_teams.sql','2026-10-31 22:02:27');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(3,'0003_sponsors.sql','2026-10-31 22:22:33');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(4,'0004_judges_scores.sql','2026-10-31 22:28:51');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(5,'0005_registration_validation.sql','2026-11-01 10:26:20');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(6,'0006_propuesta.sql','2026-11-01 10:43:00');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(7,'0007_modalidad.sql','2026-11-01 10:45:43');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(8,'0008_logistica.sql','2026-11-01 11:39:49');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(9,'0009_acreditado.sql','2026-11-01 11:55:23');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(10,'0010_evaluador.sql','2026-11-01 12:04:51');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(11,'0011_presupuesto.sql','2026-11-01 12:44:31');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(12,'0012_auditoria.sql','2026-11-01 12:49:49');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(13,'0013_gaps.sql','2026-11-01 13:57:34');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(14,'0014_team_contact.sql','2026-11-01 15:40:47');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(15,'0015_participant_code.sql','2026-11-01 19:34:39');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(16,'0016_entrega_code.sql','2026-11-01 19:44:23');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(17,'0017_errores.sql','2026-11-01 20:27:27');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(18,'0018_usuarios.sql','2026-11-06 21:51:02');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(19,'0019_fotos.sql','2026-11-07 12:18:21');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(20,'0020_charlas.sql','2026-11-07 16:00:38');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(21,'0021_judges_telefono.sql','2026-11-07 17:36:59');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(22,'0022_charlas_curriculum.sql','2026-11-07 17:44:11');
CREATE TABLE registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  correo TEXT NOT NULL UNIQUE,
  nacimiento TEXT NOT NULL,
  anio TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
, group_id TEXT, validated INTEGER NOT NULL DEFAULT 0, validation_token TEXT, propuesta TEXT, modalidad TEXT, acreditado INTEGER NOT NULL DEFAULT 0, codigo TEXT);
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(2,'Reymon','RIVAS','inversionespconline@gmail.com','1983-01-24','5to año','2026-10-31 23:43:08',NULL,0,NULL,NULL,NULL,0,'9AE0CDB5');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(3,'Alejandro','Sánchez','alejandroendry23@gmail.com','2005-06-23','2do año','2026-11-01 00:19:44',NULL,0,NULL,NULL,NULL,0,'1EE1E1B2');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(4,'Hernán H','Rendón A','rendon.hernanh@gmail.com','1979-01-27','2do año','2026-11-01 00:40:00',NULL,0,NULL,NULL,NULL,0,'9CF5AE2A');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(5,'Luis Alberto','Vivas Correa','luis.vivas.uneti@gmail.com','1969-08-26','5to año','2026-11-01 00:41:38',NULL,0,NULL,NULL,NULL,0,'8FDE92BA');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(6,'Delia Ana','Parra','deliaparra2007@gmail.com','1966-01-25','4to año','2026-11-01 01:14:32',NULL,0,NULL,NULL,NULL,0,'36062B19');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(7,'Williams','Peñaloza','williamsalejandrop@gmail.com','1992-09-11','2do año','2026-11-01 01:18:02',NULL,0,NULL,NULL,NULL,0,'371D2D0E');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(8,'Jun','Loaiza','juneloaizar2@gmail.com','1986-03-09','2do año','2026-11-01 02:28:04',NULL,0,NULL,NULL,NULL,0,'F7CF8E6A');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(9,'Osmir','Nieto','osmirnieto1@gmail.com','1977-05-15','2do año','2026-11-01 02:32:35',NULL,0,NULL,NULL,NULL,0,'89BF4558');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(10,'Jesus','Montilva','jmontilva2018@gmail.com','1982-02-05','1er año','2026-11-01 02:50:54',NULL,0,NULL,NULL,NULL,0,'B0562283');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(11,'David','Bravo','dayuholcim@gmail.com','1964-09-10','2do año','2026-11-01 03:10:21',NULL,0,NULL,NULL,NULL,0,'F2B1A951');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(12,'Iván Manuel','Vásquez Rui','ivasquezrui@gmail.com','2004-03-16','1er año','2026-11-01 03:15:11',NULL,0,NULL,NULL,NULL,0,'F3057A58');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(13,'Ronald Smith','Cubillan baez','rcsmithty@gmail.com','2002-09-22','1er año','2026-11-01 05:32:43',NULL,0,NULL,NULL,NULL,0,'66ACF119');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(14,'Jesús L','Medina','jesusl.medinamedina@gmail.com','1979-10-04','1er año','2026-11-01 06:12:40',NULL,0,NULL,NULL,NULL,0,'05EED8DE');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(15,'Jose Yvan','Bohorquez','jibohorquez@gmail.com','1973-06-27','5to año','2026-11-01 10:10:04',NULL,0,NULL,NULL,NULL,0,'6365923C');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(18,'Nohelia Alexandra','Detán Muñoz','gatabella32@gmail.com','1979-04-18','2do año','2026-11-01 11:54:34',NULL,0,'9459fcac-4de1-425a-979d-f287fbc91f1d',NULL,'remoto',0,'D6ACD3F7');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(19,'Joseph Alfredo','Marcano zerpa','1698joseph@gmail.com','1998-01-16','1er año','2026-11-01 12:01:15',NULL,0,'602cf565-f06f-42ec-917b-b65545448eca',NULL,'remoto',0,'9556177E');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(20,'Leonardo','Gonzalez Gonzalez','gonzalezg.leonardo@gmail.com','1976-04-13','4to año','2026-11-01 12:11:32',NULL,0,'59beca53-8b77-4883-9668-a45324b8500e',NULL,'remoto',0,'C557242C');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(21,'Anthony','Leguisamo','anthony.leguisamo.g@gmail.com','1994-12-06','1er año','2026-11-01 13:11:31',NULL,0,'cbea4886-1f83-4006-a39c-f726fb59dd90',NULL,'remoto',0,'1FDA9053');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(22,'Daniela','Solano','danielalsolanoc83@gmail.com','2003-07-03','1er año','2026-11-01 13:28:29',NULL,0,'58df5a96-567f-4d8f-a3b2-a64481d8f4d6',NULL,'remoto',0,'C065BBEB');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(23,'Luis','Navarro','masterlent@gmail.com','1978-04-28','3er año','2026-11-01 14:36:46',NULL,0,'110d7f95-ab54-4c3f-ac5d-3416d839a0f4',NULL,'remoto',0,'AB6CB9A0');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(24,'Omar','Matheus','omarmatheus035@gmail.com','2001-08-27','5to año','2026-11-01 16:55:18',NULL,0,'cb20bf33-0d0e-47ff-a65f-e5be3978ae46',NULL,'remoto',0,'C5C0FA5A');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(25,'Betsaida','León','betsaidaleonn@gmail.com','1992-07-07','2do año','2026-11-01 19:42:52',NULL,0,'69d9b3f3-ea42-4f61-be5a-ec6eb4b99f1d',NULL,'remoto',0,'8A4FB8F5');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(26,'Daniel Armando','Romero Morales','danielarm0303@gmail.com','2006-03-03','3er año','2026-11-02 01:01:13',NULL,0,'eb198650-3914-41ca-af4f-4aa262041ae1',NULL,'remoto',0,'5F3BDB7F');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(27,'JOSE VICENTE','OCHOA BUSTAMANTE','ochoajose150418@gmail.com','1990-06-22','4to año','2026-11-02 10:31:42',NULL,0,'1dbd8afb-1eaf-446d-a119-c7490bf1048f',NULL,'remoto',0,'DB259AC4');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(28,'José','Siiva','joserafa1145@gmail.com','1991-04-24','1er año','2026-11-02 13:51:25',NULL,0,'7a2dea8c-7c10-4f2f-99bc-9cd0e0f3ce44',NULL,'remoto',0,'1D8012A2');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(29,'Erlinton','Eligon','aceleraciontecnologica@gmail.com','1975-08-01','1er año','2026-11-02 13:53:17',NULL,0,'842bdc6b-7220-46cc-9ae1-bcdc2576f8fd',NULL,'remoto',0,'50396CA2');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(30,'Erlinton','Eligon','erlintoneloy@gmail.com','1975-08-01','1er año','2026-11-02 15:44:44',NULL,0,'9508c392-74da-4c43-b370-ea3bb52dc3c6',NULL,'remoto',0,'2D10A518');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(31,'Gabriel','Molina','gabolina2009@gmail.com','2009-09-05','1er año','2026-11-02 16:01:03',NULL,0,'a0e44367-0ce4-4a1c-91b8-5697ab72b7e8',NULL,'remoto',0,'552CDEE9');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(32,'amy','colina','colinaeimy17@gmail.com','2007-01-06','3er año','2026-11-02 16:33:58',NULL,0,'8ad97132-3e83-4390-97b3-bbb5417fddd2',NULL,'remoto',0,'F5588C8A');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(33,'Yaneth Del Valle','Rojas Contreras','yrojas15cantv@gmail.com','1976-11-17','3er año','2026-11-02 17:46:36',NULL,0,'9a3b0227-15c4-41a4-bcf6-8fa5f081fd6d',NULL,'remoto',0,'7602D85B');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(34,'Rodríguez Castillo','Areli Nancy','lamardelaluna@gmail.com','1967-07-21','4to año','2026-11-02 22:26:22',NULL,0,'063ec256-cd07-45a8-9707-ca128f2720b4',NULL,'remoto',0,'B9BC2FDD');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(35,'Nickollt','Figueroa','figueroanickollt@gmail.com','2006-10-14','2do año','2026-11-02 22:31:51',NULL,0,'5b0cde6a-897d-42c7-a597-b18abad2e5d3',NULL,'remoto',0,'28E0B63C');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(36,'LEONARDO','RIVERO','lriver12cantv@gmail.com','1983-02-18','1er año','2026-11-03 01:32:14',NULL,0,'9465120a-a29f-422b-8392-66e88511ae4c',NULL,'remoto',0,'967F72EA');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(37,'Jose','Delis','delisjose1725@gmail.com','1966-02-12','1er año','2026-11-03 12:55:01',NULL,0,'0c42ea14-aa7d-4c40-9258-9cd7563fe6ef',NULL,'remoto',0,'FD3E6298');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(38,'Angel Luis','Rivas Hernández','alrivash@gmail.com','1991-10-14','1er año','2026-11-03 18:01:19',NULL,0,'7ac63af3-3510-4a4f-a3cc-1b4bbcb5a252',NULL,'remoto',0,'FFC0F939');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(39,'Rita  Maria','Ulgiati','rulgiati@hotmail.com','1962-02-01','1er año','2026-11-06 15:05:57',NULL,0,'219b975b-40b2-4284-9a3f-1ce7fdc7a708',NULL,'remoto',0,'F7825A24');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(40,'Carlos','Ramos','carlosgaray55@gmail.com','1955-02-13','4to año','2026-11-06 15:10:09',NULL,0,'5db15a34-7625-4b49-9c0f-245e7f61b233',NULL,'remoto',0,'41BFD66A');
INSERT INTO "registrations" ("id","nombre","apellido","correo","nacimiento","anio","created_at","group_id","validated","validation_token","propuesta","modalidad","acreditado","codigo") VALUES(41,'Alex Jean Frank','Perez Martínez','alexjeanperez39@gmail.com','1995-08-09','1er año','2026-11-07 16:48:41',NULL,0,'ae450a5e-b6ff-41dc-af49-68abcaa5780e',NULL,'remoto',0,'B3D8E635');
CREATE TABLE teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  mentor TEXT NOT NULL,
  eje TEXT NOT NULL,
  proyecto TEXT,
  integrantes TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
, codigo TEXT, contacto_email TEXT);
CREATE TABLE sponsors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  empresa TEXT NOT NULL,
  contacto TEXT NOT NULL,
  correo TEXT NOT NULL,
  telefono TEXT,
  tipo TEXT NOT NULL DEFAULT '[]',
  detalle TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "sponsors" ("id","empresa","contacto","correo","telefono","tipo","detalle","created_at") VALUES(1,'Go Interaction Marketing','Jose Yvan Bohorquez','jibohorquez@gmail.com','+584126074572','["insumos"]','Premios','2026-11-01 10:09:08');
CREATE TABLE judges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  organizacion TEXT,
  correo TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
, telefono TEXT);
CREATE TABLE scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  judge_id INTEGER NOT NULL,
  team_id INTEGER NOT NULL,
  criterio TEXT NOT NULL,
  puntaje INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(judge_id, team_id, criterio)
);
CREATE TABLE logistica (
  grupo TEXT PRIMARY KEY,
  responsables TEXT NOT NULL DEFAULT '',
  insumos TEXT NOT NULL DEFAULT '',
  actividades TEXT NOT NULL DEFAULT ''
);
INSERT INTO "logistica" ("grupo","responsables","insumos","actividades") VALUES('1. Coordinación General','',replace('Plan maestro impreso\nListas de responsables\nCanal de coordinación (WhatsApp/radio)\nPlanilla de incidencias','\n',char(10)),replace('Supervisar el plan maestro\nGestionar permisos MPPCT\nConvocar reuniones de seguimiento\nResolver incidencias\nEvaluación post-evento','\n',char(10)));
INSERT INTO "logistica" ("grupo","responsables","insumos","actividades") VALUES('2. Registro y Acreditación','',replace('Gafetes\nListas de inscritos\nMesas\nComputadora\nImpresora','\n',char(10)),replace('Acreditar participantes\nVerificar preseleccionados y remotos\nControl de asistencia','\n',char(10)));
INSERT INTO "logistica" ("grupo","responsables","insumos","actividades") VALUES('3. Tecnología y Servidores','',replace('Servidores\nVideo beam\nRed y cables\nEstaciones de trabajo\nUPS y extensiones','\n',char(10)),replace('Montaje de equipos\nSoporte técnico continuo\nPrueba de audio/video para pitches\nDesmontaje','\n',char(10)));
INSERT INTO "logistica" ("grupo","responsables","insumos","actividades") VALUES('4. Salas y Espacios','',replace('Mesas\nSillas\nSeñalización\nPapelería\nColchonetas y cobertores\nKits de higiene\nPuntos de carga eléctrica\nHidratación nocturna','\n',char(10)),replace('Montaje de espacios\nControl de aforo y orden\nDesmontaje y limpieza\nAcondicionar zona de pernocta (IVIC)','\n',char(10)));
INSERT INTO "logistica" ("grupo","responsables","insumos","actividades") VALUES('5. Catering y Alimentación','',replace('Refrigerios\nAlmuerzos\nAgua\nVajilla y mesas de servicio\nCena (día 1)\nDesayuno (día 2)\nRefrigerio nocturno (pernocta IVIC)\nCafé y bebidas calientes (madrugada)\nRefrigerio de madrugada (pernocta)','\n',char(10)),replace('Coordinar proveedor\nDistribución de alimentos\nGestionar dietas especiales\nCoordinar cena y desayuno (pernocta)','\n',char(10)));
INSERT INTO "logistica" ("grupo","responsables","insumos","actividades") VALUES('6. Comunicaciones y Difusión','',replace('Cámara\nTrípode\nAcceso a redes sociales\nPlantillas gráficas','\n',char(10)),replace('Cobertura (fotos y videos)\nRedes en vivo\nEnviar instructivo a remotos\nComunicado de resultados','\n',char(10)));
INSERT INTO "logistica" ("grupo","responsables","insumos","actividades") VALUES('7. Protocolo y Charlas','',replace('Atril\nMicrófonos\nPresentaciones\nAgua para charlistas','\n',char(10)),replace('Acto de apertura\nCoordinar charlistas y agenda técnica\nActo de premiación','\n',char(10)));
INSERT INTO "logistica" ("grupo","responsables","insumos","actividades") VALUES('8. Jurados y Evaluación','',replace('Rúbricas impresas\nPlanillas de puntuación\nCalculadoras\nLaptops','\n',char(10)),replace('Entregar materiales a jurados\nEvaluar pitches\nDeliberar resultados','\n',char(10)));
INSERT INTO "logistica" ("grupo","responsables","insumos","actividades") VALUES('9. Voluntariado y Soporte','',replace('Chalecos identificadores\nMapa de espacios\nRadios','\n',char(10)),replace('Apoyo general\nOrientar participantes\nApoyar a mentores','\n',char(10)));
INSERT INTO "logistica" ("grupo","responsables","insumos","actividades") VALUES('10. Seguridad y Accesos','',replace('Listas de acceso\nGafetes de staff\nContacto MPPCT\nTurno nocturno de vigilancia','\n',char(10)),replace('Control de ingreso\nVerificar listas\nSalida ordenada\nVigilancia y control de acceso durante la pernocta','\n',char(10)));
INSERT INTO "logistica" ("grupo","responsables","insumos","actividades") VALUES('11. Transporte y Traslado','',replace('Unidades de transporte (buses/vans)\nListas de pasajeros\nPuntos de encuentro\nConductores y coordinadores','\n',char(10)),replace('Salida Mincyt → Parque Tecnológico + Más Ciencia (IVIC) · día 1 · 7:00 am\nTraslado de regreso IVIC → Mincyt · día 2 · 18:00 (tras preparación de pitch y presentación al jurado)\nCoordinar horarios, unidades y listas','\n',char(10)));
INSERT INTO "logistica" ("grupo","responsables","insumos","actividades") VALUES('12. Participantes Presenciales — Qué llevar','',replace('Laptop personal + cargador\nExtensión / regleta de corriente\nCédula de identidad\nCódigo de acceso (participante o grupo)\nRopa cómoda y de cambio\nAbrigo / chaqueta (IVIC, zona de montaña)\nArtículos de aseo personal\nCobija o saco de dormir ligero (opcional)\nCalzado cómodo\nMedicamentos personales (si aplica)\nSnacks / bebidas personales (opcional)','\n',char(10)),replace('Comunicar la lista a los participantes seleccionados\nVerificar checklist durante la acreditación\nRecordar traslados: viernes 18:00 Mincyt → IVIC · sábado 18:00 IVIC → Mincyt','\n',char(10)));
CREATE TABLE evaluador_config (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  prompt TEXT NOT NULL DEFAULT ''
);
CREATE TABLE evaluaciones (
  group_id TEXT PRIMARY KEY,
  propuesta TEXT,
  puntaje REAL,
  justificacion TEXT,
  estado TEXT NOT NULL DEFAULT 'pendiente'
);
CREATE TABLE presupuesto (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  concepto TEXT NOT NULL,
  tipo TEXT NOT NULL,
  monto REAL NOT NULL,
  categoria TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE auditoria (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rol TEXT,
  metodo TEXT,
  ruta TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "auditoria" ("id","rol","metodo","ruta","created_at") VALUES(1,'admin','POST','/api/admin/agente-triaje','2026-11-01 20:12:20');
INSERT INTO "auditoria" ("id","rol","metodo","ruta","created_at") VALUES(2,'admin','POST','/api/admin/agente-github','2026-11-01 20:12:28');
CREATE TABLE consultas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER,
  nombre TEXT,
  consulta TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
, codigo TEXT);
CREATE TABLE asistencia_remota (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  registro_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE comunicados (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  contenido TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "comunicados" ("id","titulo","contenido","created_at") VALUES(1,'Pernocta y traslado — Parque Tecnológico + Más Ciencia (IVIC)',replace('Informamos que el hackathon se realizará en el Parque Tecnológico + Más Ciencia (IVIC), con desarrollo continuo y pernocta.\n\nSalida: el viernes 13 a las 7:00 am desde la sede Mincyt (Av. Universidad), con traslado incluido al Parque Tecnológico.\n\nEl evento finaliza el sábado 14 a las 6:00 pm, con el traslado de regreso a la sede Mincyt.\n\nEl comité proveerá cena, desayuno, hidratación, zona de descanso y acompañamiento. Lleva ropa cómoda y artículos personales.','\n',char(10)),'2026-11-07 13:00:27');
CREATE TABLE entregas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT NOT NULL UNIQUE,
  repositorio TEXT NOT NULL,
  proyecto TEXT,
  demo TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE errores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  endpoint TEXT,
  mensaje TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  nombre TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "usuarios" ("id","username","password_hash","role","nombre","created_at") VALUES(1,'administrador','6cff9623aa1f6d989ca628d9a147dcc4980308fb33f1f825782fc700da08d999','admin','Administrador','2026-11-06 21:51:16');
INSERT INTO "usuarios" ("id","username","password_hash","role","nombre","created_at") VALUES(2,'acreditacion','b7369b73e21138766a9a41a2f503e64e2ed9d36092215d038060fda1c453bae9','acreditacion','Acreditación','2026-11-06 21:51:16');
INSERT INTO "usuarios" ("id","username","password_hash","role","nombre","created_at") VALUES(3,'jurado','6b746d345c78e02bc3b3b78985e6ef18b6ce403a9d2e1749009ef00363d49ac2','jurado','Jurado','2026-11-06 21:51:16');
INSERT INTO "usuarios" ("id","username","password_hash","role","nombre","created_at") VALUES(4,'logistica','f0e5526d7c56ef64eee27ddb3486a0377072b475e43eb385148da9b113404224','logistica','Logística','2026-11-06 21:51:16');
INSERT INTO "usuarios" ("id","username","password_hash","role","nombre","created_at") VALUES(5,'cavecome','6c4b48303c55ff75cf93749a1930d17845751b43f4b348f59982fee7811ffe53','admin','CAVECOM-E','2026-11-07 14:18:14');
INSERT INTO "usuarios" ("id","username","password_hash","role","nombre","created_at") VALUES(6,'parquetecnologico','41cdbce1f36a350863c45f333a109e5a3ff7602a2fc0f9799272f848093d030e','admin','Parque Tecnológico + Más Ciencia','2026-11-07 14:18:14');
INSERT INTO "usuarios" ("id","username","password_hash","role","nombre","created_at") VALUES(7,'uneti','bad98f1e96194610dda5db83ae5e8eb1d3dfc65dad1a19524ed5f86a990fdea0','admin','UNETI','2026-11-07 14:18:14');
CREATE TABLE fotos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL,
  caption TEXT,
  content_type TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE charlas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  ponente TEXT,
  contacto TEXT,
  dia INTEGER NOT NULL DEFAULT 1,
  hora_inicio TEXT,
  hora_fin TEXT,
  orden INTEGER DEFAULT 0
, curriculum TEXT);
INSERT INTO "charlas" ("id","titulo","ponente","contacto","dia","hora_inicio","hora_fin","orden","curriculum") VALUES(1,'DeepSeek Harness','Jorge Barrero','',1,'09:30','10:00',1,NULL);
INSERT INTO "charlas" ("id","titulo","ponente","contacto","dia","hora_inicio","hora_fin","orden","curriculum") VALUES(2,'Antigravity','Carlos Berbeci','',1,'10:00','10:30',2,NULL);
INSERT INTO "charlas" ("id","titulo","ponente","contacto","dia","hora_inicio","hora_fin","orden","curriculum") VALUES(3,'Cloudflare','José Yvan Bohorquez','',1,'11:00','11:35',3,NULL);
INSERT INTO "charlas" ("id","titulo","ponente","contacto","dia","hora_inicio","hora_fin","orden","curriculum") VALUES(4,'Ciberseguridad','Rafael Nuñez','',1,'11:35','12:10',4,NULL);
INSERT INTO "charlas" ("id","titulo","ponente","contacto","dia","hora_inicio","hora_fin","orden","curriculum") VALUES(5,'Creación y gestión de Agentes IA','Yoher Vazquez','',2,'09:30','10:05',1,NULL);
INSERT INTO "charlas" ("id","titulo","ponente","contacto","dia","hora_inicio","hora_fin","orden","curriculum") VALUES(6,'Ciberseguridad','Alex Cabello','',2,'10:05','10:40',2,NULL);
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('d1_migrations',22);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('registrations',41);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('sponsors',1);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('auditoria',2);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('usuarios',7);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('comunicados',1);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('charlas',6);
CREATE INDEX idx_registrations_correo ON registrations(correo);
CREATE INDEX idx_teams_eje ON teams(eje);
CREATE INDEX idx_scores_team ON scores(team_id);
CREATE INDEX idx_registrations_token ON registrations(validation_token);
