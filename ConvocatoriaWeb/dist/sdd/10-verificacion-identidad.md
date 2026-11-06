# SDD — Verificación de identidad documental con detección de fraude

> Hackathon UNETI IA 2026 · Proyecto #10 · Eje 1 · IA Ética · Complejidad: Avanzada
> Ente público: Registros civiles / migración

## 1. Problema
La falsificación de actas de nacimiento, matrimonio, defunción y documentos de identidad (cédula, pasaporte, antecedentes migratorios) vulnera la integridad de los trámites y registros públicos venezolanos. Afecta directamente a los registros civiles y a las oficinas de migración (SAIME), que hoy validan documentos de forma manual y sin contraste automatizado contra fuentes oficiales. Importa porque una identidad falsa habilita fraudes, dobles identidades, suplantación y tráfico de personas, erosionando la confianza institucional.

## 2. Objetivos
- Detectar alteraciones (edición, clonado, retoque de sellos, manipulación de metadatos) en documentos digitalizados con una precisión ≥ 95 % en un set de prueba etiquetado.
- Verificar la autenticidad cruzando el documento con registros fuente oficiales (partidas del registro civil y bases de identidad) en menos de 5 segundos por consulta.
- Emitir un dictamen explicable por cada verificación: auténtico / alterado / sospechoso / no verificable, con las evidencias que lo sustentan.
- Cumplir principios de IA ética: privacidad de datos personales, transparencia del modelo, auditoría de decisiones y mitigación de sesgos demográficos.

## 3. Requisitos funcionales (RF)
- RF-01: El sistema debe recibir un documento escaneado o fotografiado (PDF/JPEG/PNG) y clasificar su tipo: acta de nacimiento, matrimonio, defunción, cédula de identidad o pasaporte.
- RF-02: El sistema debe detectar manipulaciones visuales (inserción/borrado de texto, clonado de sellos, empalme de regiones, inconsistencias de iluminación/ruido) mediante análisis forense de imagen.
- RF-03: El sistema debe extraer los campos clave (nombres, número de documento, fecha, libro/folio/acta) mediante OCR y validar su consistencia interna y contra fuentes oficiales.
- RF-04: El sistema debe verificar la integridad y procedencia del archivo (hash, metadatos EXIF/XMP, firma digital si existe) y contrastar el documento con el registro civil o la base de identidad correspondiente.
- RF-05: El sistema debe generar un reporte de verificación auditable con nivel de confianza, evidencias y trazabilidad, descargable en PDF/JSON y registrado en un log inmutable.
- RF-06: El sistema debe gestionar usuarios con roles (funcionario de registro civil, agente de migración, auditor, administrador) y control de acceso basado en el principio de menor privilegio.

## 4. Requisitos no funcionales (RNF)
- RNF-01: Seguridad/privacidad — cifrado de datos en tránsito (TLS 1.3) y en reposo, minimización de datos, anonimización de registros en ambientes de prueba y cumplimiento de la LOPDP venezolana y buenas prácticas internacionales (tipo LGPD/GDPR) para datos biométricos y de identidad.
- RNF-02: Escalabilidad — soportar al menos 10 000 verificaciones diarias y 50 consultas concurrentes sin degradación, con arquitectura serverless autoescalable y colas para picos de demanda (jornadas de cedulación).
- RNF-03: Rendimiento — latencia de verificación de un solo documento ≤ 5 segundos en condiciones normales, procesamiento de lotes de hasta 1 000 documentos con informes en menos de 1 hora.
- RNF-04: Accesibilidad/usabilidad — interfaz en español con contraste AA, navegable por teclado y lector de pantalla, y operación completa en menos de 3 clics por parte del funcionario, con conexiones de bajo ancho de banda.

## 5. Historias de usuario
- Como funcionario de registro civil, quiero subir una partida escaneada y recibir un dictamen de autenticidad con sus evidencias, para aprobar o rechazar un trámite sin depender de una inspección visual subjetiva.
- Como agente de migración, quiero verificar en tiempo real si una cédula o pasaporte presentado coincide con los registros oficiales y no presenta alteraciones, para impedir la suplantación de identidad en frontera.
- Como auditor del ente público, quiero consultar el historial completo de verificaciones con trazabilidad y justificación de cada decisión, para auditar el uso del sistema y rendir cuentas.

## 6. Criterios de aceptación
- Dado un documento con una firma o sello clonado digitalmente, cuando se procesa en el sistema, entonces el dictamen es "alterado" y reporta la región exacta de la anomalía con un nivel de confianza ≥ 90 %.
- Dado un documento auténtico sin manipulación, cuando se verifica contra el registro fuente, entonces el resultado es "auténtico" y se devuelve en menos de 5 segundos.
- Dado un documento cuya fuente oficial no está disponible o es ambigua, cuando se procesa, entonces el sistema responde "no verificable" (y no "auténtico") y lo deriva a revisión humana.
- Dada una decisión del modelo, cuando se audita, entonces se recupera el registro de la decisión con los campos de entrada (sin datos personales crudos), el modelo usado, su versión y el puntaje de confianza.

## 7. Datos y fuentes sugeridas
- Conjuntos públicos de imágenes de documentos de identidad y facturas para entrenar detección de manipulación: MIDV-500 / MIDV-2020 (documentos de identidad), DTD (DIBCO Document Tampering), IEEE IFS-TC Image Forensics Challenge, CASIA tampered image dataset (v1/v2), y la familia SIDD/NoisePrint para ruido de sensor.
- Documentos oficiales venezolanos publicados en el Boletín Oficial y formatos de actas del registro civil (SAREN) y de la cédula/pasaporte (SAIME) como referencia de campos y sellos (solo plantillas públicas, nunca datos personales reales).
- Datos sintéticos generados localmente (documentos de prueba creados con nombres ficticios) para cumplir la minimización de datos y la LOPDP.
- Modelos preentrenados de OCR: Tesseract, PaddleOCR, TrOCR (para texto manuscrito/impreso en actas antiguas); embeddings y detección: DINOv2 / EfficientNet para clasificación de tipo de documento.

## 8. Stack tecnológico sugerido
- Backend: Cloudflare Workers (TypeScript) con Hono para API REST; Workers AI para OCR e inferencia; Durable Objects para sesiones de verificación con estado; D1 (SQLite) para metadatos y reportes; R2 para almacenar documentos cifrados; Queues para procesamiento por lotes; KV para caché de plantillas y configuraciones.
- IA/ML: Workers AI para modelos de visión (detección de objetos en sellos), más detección de manipulación con análisis de ruido (NoisePrint), ELA (Error Level Analysis) y análisis de doble compresión JPEG implementados en el Worker; hash criptográfico SHA-256 para integridad de archivo.
- Verificación de integridad y trazabilidad: registro de auditoría append-only en D1 con hash encadenado (patrón de log inmutable) y Cloudflare Access para autenticación de funcionarios con roles.
- Frontend: React/Next.js o Astro desplegado en Cloudflare Pages; Turnstile para proteger formularios de subida; Workers Logs y Grafana para observabilidad.

## 9. Ente público y visión de despliegue
Lo adopta el Servicio Administrativo de Identificación, Migración y Extranjería (SAIME) y el Servicio Autónomo de Registros y Notarías (SAREN), en coordinación con el Consejo Nacional Electoral para validación de identidad. Se despliega en la nube de Cloudflare (edge, sin infraestructura local costosa) expuesto solo a redes autorizadas vía Cloudflare Access y Zero Trust, con una fase piloto en 2–3 oficinas de registro civil y un punto de migración, integrado a los sistemas existentes por API y con auditoría externa del uso y los sesgos antes del despliegue nacional.

## 10. Definition of Done
- [ ] El sistema clasifica al menos 5 tipos de documento y detecta manipulación con precisión ≥ 95 % validada sobre un set de prueba etiquetado y separado del entrenamiento.
- [ ] La verificación completa (detección + contraste con fuente) responde en ≤ 5 segundos por documento en el entorno de despliegue.
- [ ] Cada dictamen incluye nivel de confianza, evidencias y trazabilidad, y queda registrado en un log de auditoría inmutable.
- [ ] Se documentan y mitigan los sesgos demográficos del modelo (matriz de equidad por edad, género y región) y se cumple la LOPDP en el manejo de datos.
- [ ] La documentación técnica y la SPEC.md están completas, el código tiene pruebas de integración y el despliegue se valida con un piloto controlado ante funcionarios reales.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Verificación de identidad documental con detección de fraude
## Problema
Documentos de identidad y actas falsificados vulneran los trámites del registro civil y migración en Venezuela; la validación manual no detecta alteraciones ni contrasta con fuentes oficiales.

## RF / RNF
- RF-01: Clasificar el tipo de documento recibido (acta, cédula, pasaporte).
- RF-02: Detectar manipulaciones visuales y de metadatos.
- RF-03: Extraer y validar campos con OCR y contraste contra registros oficiales.
- RF-04: Verificar integridad/procedencia del archivo y autenticidad de la fuente.
- RF-05: Generar dictamen auditable con evidencias y trazabilidad.
- RF-06: Gestionar roles y control de acceso por menor privilegio.
- RNF-01: Cifrado en tránsito y reposo, minimización de datos y cumplimiento LOPDP.
- RNF-02: ≥ 10 000 verificaciones/día y 50 consultas concurrentes.
- RNF-03: Verificación por documento ≤ 5 s; lotes de 1 000 en < 1 h.
- RNF-04: Interfaz en español, accesible (WCAG AA) y operable con bajo ancho de banda.

## Historias de usuario
- Como funcionario de registro civil, quiero subir una partida y obtener un dictamen de autenticidad, para aprobar o rechazar trámites sin inspección visual subjetiva.
- Como agente de migración, quiero verificar en tiempo real si el documento coincide con registros oficiales y no está alterado, para impedir suplantación de identidad.
- Como auditor, quiero consultar el historial con trazabilidad de decisiones, para auditar el sistema y rendir cuentas.

## Criterios de aceptación
- Dado un documento con sello clonado, cuando se procesa, entonces el dictamen es "alterado" e indica la región anómala con confianza ≥ 90 %.
- Dado un documento auténtico con fuente disponible, cuando se verifica, entonces el resultado es "auténtico" en ≤ 5 s.
- Dado un documento sin fuente oficial accesible, cuando se procesa, entonces responde "no verificable" y se deriva a revisión humana.
- Dada una decisión del modelo, cuando se audita, entonces se recupera la trazabilidad completa sin datos personales crudos.

## Fuera de alcance
- Reconocimiento biométrico facial o de huella en esta fase (solo verificación documental).
- Emisión de cédulas, pasaportes o actas: el sistema verifica, no expide documentos.
- Integración automática con sistemas legados del SAIME/SAREN sin convenio formal y evaluación de seguridad.
- Persecución o vigilancia de personas: el sistema audita documentos en trámite, no perfila ciudadanos.
```

## 12. Elevator Pitch
En Venezuela, una identidad falsa en un acta o cédula habilita fraudes, dobles identidades y suplantación. Nuestro sistema de verificación de identidad documental detecta alteraciones en actas, cédulas y pasaportes con precisión ≥ 95 % y las contrasta contra los registros oficiales en menos de 5 segundos. Está diseñado para que SAIME, SAREN y el CNE validen documentos en trámite sin inspección manual, con un dictamen explicable y auditable. El valor diferencial: verificación forense de imagen más contraste con fuente y trazabilidad inmutable, cumpliendo la LOPDP.

## 13. Impacto en el organismo público
- **Eficiencia operativa:** reduce la validación manual de documentos en los registros civiles y puntos de migración, resolviendo cada verificación en ≤ 5 segundos y absorbiendo hasta 10 000 verificaciones diarias y 50 consultas concurrentes.
- **Transparencia y rendición de cuentas:** cada dictamen queda registrado en un log inmutable con evidencias, nivel de confianza y trazabilidad, permitiendo a los auditores de SAIME/SAREN justificar y auditar cada decisión.
- **Confianza ciudadana:** al impedir suplantaciones, dobles identidades y tráfico de personas, refuerza la integridad de los trámites y la credibilidad institucional en el registro civil y migración.
- **Ahorro de recursos:** el despliegue serverless en Cloudflare evita infraestructura local costosa y minimiza reprocesos por fraudes no detectados, liberando tiempo de los funcionarios para casos que sí requieren revisión humana.
- **Cumplimiento normativo:** incorpora cifrado, minimización de datos y anonimización en pruebas, alineado con la LOPDP venezolana y buenas prácticas tipo LGPD/GDPR para datos de identidad.

## 14. README y documentación del proyecto
El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción** clara del proyecto (qué hace y qué problema resuelve).
- **Badges** (build, tests, licencia, cobertura).
- **Características** principales (lista de funcionalidades).
- **Arquitectura** (diagrama de componentes y flujo de datos).
- **Instalación y ejecución** (prerrequisitos, pasos, variables de entorno).
- **Uso** (ejemplos, endpoints/API, capturas).
- **Datos y datasets** (fuentes, formato, cómo obtenerlos).
- **Pruebas** (cómo correrlas).
- **Contribución** (guía para colaborar).
- **Licencia** y créditos.

### Carpeta docs/
- `SPEC.md` (especificación).
- `SDD.md` (este documento).
- `architecture.md` (diagramas y decisiones de diseño).
- `user-guide.md` (manual de usuario).

### Otros archivos
- `LICENSE`, `.gitignore`, `.env.example`, `requirements.txt` o `pyproject.toml`, `Dockerfile` y `docker-compose.yml` (si aplica).

## 15. Preparación de la presentación en Google NotebookLM
Para preparar la defensa del proyecto con NotebookLM:

1. **Reúne los insumos** del proyecto: este SDD, el SPEC, el README, el código fuente (o fragmentos clave), la descripción del dataset y las capturas/demo.
2. **Crea un notebook** en NotebookLM y **sube** esos insumos como fuentes.
3. **Genera la "Guía de estudio"** para estructurar el pitch (problema → solución → impacto → demo).
4. **Genera el "Resumen de audio" (Audio Overview)** para practicar el pitch hablado y afinar el guion.
5. **Haz preguntas al notebook** para ensayar la defensa ante el jurado (ej.: "¿cuál es mi mayor riesgo técnico?", "¿cómo explico el impacto en 30 segundos?").
6. **Genera un "Briefing"** alineado a la rúbrica: viabilidad, impacto, innovación/IA, pitch, ética y escalabilidad.
