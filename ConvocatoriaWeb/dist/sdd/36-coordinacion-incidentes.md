# SDD — Plataforma de coordinación de incidentes entre entes

> Hackathon UNETI IA 2026 · Proyecto #36 · Eje 2 · Ciberseguridad · Complejidad: Media
> Ente público: Canal oficial entre CSIRT y administración

## 1. Problema

Los entes públicos venezolanos responden a los incidentes de ciberseguridad de forma aislada: cada organismo gestiona sus propios reportes, sin un canal único que los conecte con el CSIRT nacional. Esto retrasa la detección de amenazas que afectan a varias instituciones a la vez (como campañas de phishing dirigidas al sector público) y dificulta una respuesta coordinada a nivel país.

## 2. Objetivos

- Reducir el tiempo de notificación de un incidente desde un ente público al CSIRT a menos de 24 horas desde su detección.
- Clasificar de forma automática al menos el 80 % de los reportes entrantes en categorías estándar (malware, phishing, intrusión, fuga de datos, denegación de servicio) con apoyo de IA.
- Permitir que el CSIRT asigne y coordine la respuesta de un incidente entre dos o más organismos desde un único panel.
- Generar indicadores de situación (número de incidentes por sector, tipo y severidad) actualizados en tiempo casi real para la administración pública.

## 3. Requisitos funcionales (RF)

- RF-01: La plataforma debe permitir a un ente público registrar un incidente mediante un formulario con tipo, severidad, sistema afectado, descripción y evidencias adjuntas (capturas, hashes, IOCs).
- RF-02: El sistema debe clasificar automáticamente cada reporte con un motor de IA y asignar una severidad inicial (baja, media, alta, crítica) editable por el CSIRT.
- RF-03: El CSIRT debe poder crear "casos de coordinación" que vinculen varios reportes de distintos organismos cuando detecte un patrón o campaña común.
- RF-04: Cada incidente debe tener un estado trazable (reportado, en triaje, en investigación, coordinando, mitigado, cerrado) con historial de cambios y responsables.
- RF-05: La plataforma debe emitir alertas y notificaciones por correo y panel cuando un incidente crítico requiera acción inmediata de un ente o del CSIRT.
- RF-06: Debe existir un tablero de indicadores (dashboard) con métricas agregadas, filtrable por ente, sector, tipo de incidente y rango de fechas.

## 4. Requisitos no funcionales (RNF)

- RNF-01 — Seguridad/privacidad: cifrado TLS en tránsito y en reposo, control de acceso basado en roles (ente reportante, analista CSIRT, administrador) y registro de auditoría de todas las acciones sobre un caso.
- RNF-02 — Escalabilidad: la arquitectura debe soportar la incorporación progresiva de decenas de entes públicos sin degradación, usando componentes serverless que escalen según la demanda de reportes.
- RNF-03 — Rendimiento: la clasificación automática de un reporte debe completarse en menos de 10 segundos y el dashboard debe responder en menos de 2 segundos para consultas agregadas.
- RNF-04 — Accesibilidad/usabilidad: interfaz en español, usable por personal no técnico de los entes (formulario guiado con validación), y conforme a pautas básicas de accesibilidad (contraste, navegación por teclado, textos alternativos).

## 5. Historias de usuario

- Como analista de TI de un ente público, quiero reportar un incidente con un formulario guiado y adjuntar evidencias, para que el CSIRT reciba la información completa sin fricción.
- Como oficial del CSIRT, quiero ver todos los reportes clasificados por severidad y vincular los que parecen parte de una misma campaña, para coordinar una respuesta nacional única en lugar de respuestas aisladas.
- Como directivo de la administración pública, quiero un tablero con indicadores de incidentes por sector y severidad, para tomar decisiones informadas sobre recursos y políticas de seguridad.

## 6. Criterios de aceptación

- Dado un reporte con evidencias adjuntas, cuando el ente lo envía, entonces el sistema lo clasifica automáticamente y lo marca con estado "en triaje" en menos de 10 segundos.
- Dado un incidente crítico recién reportado, cuando se guarda, entonces se notifica por correo y panel al equipo del CSIRT responsable en menos de 1 minuto.
- Dado un oficial del CSIRT que vincula tres reportes de distintos entes, cuando crea el caso de coordinación, entonces todos los reportes asociados muestran el caso común y un único responsable.
- Dado un analista que consulta el dashboard, cuando filtra por sector y severidad, entonces obtiene los conteos y tendencias correctos en menos de 2 segundos.

## 7. Datos y fuentes sugeridas

- CVE (Common Vulnerabilities and Exposures) y NVD para enriquecer la clasificación de vulnerabilidades asociadas a incidentes.
- MITRE ATT&CK como taxonomía de técnicas, tácticas y procedimientos para etiquetar incidentes.
- Conjuntos de datos de referencia de IOCs (URLs, hashes, IPs) de fuentes abiertas como MalwareBazaar y Abuse.ch para entrenar/validar el clasificador.
- Registros históricos simulados del CSIRT (logs, reportes anonimizados) para probar el flujo de coordinación sin exponer datos reales de los entes.
- ENISA Threat Landscape como referencia metodológica de categorización de amenazas en el sector público.

## 8. Stack tecnológico sugerido

- Frontend: React + TypeScript con Tailwind CSS, desplegado en Cloudflare Pages.
- Backend/API: Cloudflare Workers (TypeScript) con D1 como base de datos relacional y R2 para almacenar evidencias adjuntas.
- Cola y trabajos asíncronos: Cloudflare Queues para procesar la clasificación y las notificaciones sin bloquear el envío del reporte.
- IA: Cloudflare Workers AI con un modelo de clasificación de texto para categorizar y asignar severidad inicial; opcionalmente un embedding + Vectorize para agrupar reportes similares (detección de campañas).
- Autenticación: Cloudflare Access con identidad federada para el acceso de entes y del CSIRT.
- Correo: Cloudflare Email Routing / Email Workers para notificaciones y confirmaciones.

## 9. Ente público y visión de despliegue

El producto lo adopta el CSIRT nacional como canal oficial de comunicación con la administración pública: cada ente público recibe un acceso federado y reporta por la misma vía. La implementación se haría en fases —primero un piloto con un número reducido de entes, luego la incorporación progresiva del resto—, alojando la plataforma en la infraestructura de borde de Cloudflare para garantizar disponibilidad y resistir picos de reportes durante incidentes masivos.

## 10. Definition of Done

- [ ] El formulario de reporte permite registrar incidente con evidencias y lo envía al backend sin errores.
- [ ] La clasificación automática por IA y la severidad inicial funcionan y quedan documentadas en el historial del caso.
- [ ] El panel del CSIRT permite crear casos de coordinación y vincular reportes de distintos entes.
- [ ] El dashboard muestra indicadores agregados correctos, filtrables por ente, sector, tipo y fecha.
- [ ] Las notificaciones de incidentes críticos se envían por correo y panel, y todas las acciones quedan en el registro de auditoría.

## 11. Plantilla SPEC.md (lista para copiar)

```markdown
# SPEC — Plataforma de coordinación de incidentes entre entes

## Problema
Los entes públicos responden a incidentes de ciberseguridad de forma aislada,
sin un canal único con el CSIRT, lo que retrasa la respuesta coordinada nacional.

## RF / RNF
### RF
- RF-01 Registro de incidentes con tipo, severidad, sistema afectado y evidencias.
- RF-02 Clasificación automática por IA con severidad inicial editable.
- RF-03 Casos de coordinación que vinculan reportes de varios organismos.
- RF-04 Estado trazable del incidente con historial de cambios.
- RF-05 Notificaciones por correo y panel para incidentes críticos.
- RF-06 Dashboard de indicadores filtrable por ente, sector, tipo y fecha.

### RNF
- RNF-01 Seguridad: TLS, roles de acceso y auditoría.
- RNF-02 Escalabilidad: componentes serverless ante incorporación de entes.
- RNF-03 Rendimiento: clasificación <10 s y dashboard <2 s.
- RNF-04 Usabilidad/Accesibilidad: interfaz en español, usable por personal no técnico.

## Historias de usuario
- Como analista de un ente, quiero reportar un incidente con formulario guiado,
  para que el CSIRT reciba información completa.
- Como oficial del CSIRT, quiero vincular reportes de una misma campaña,
  para coordinar una respuesta nacional.
- Como directivo, quiero indicadores por sector y severidad,
  para decidir sobre recursos y políticas.

## Criterios de aceptación
- Dado un reporte enviado, cuando se procesa, entonces queda clasificado y en
  "triaje" en <10 s.
- Dado un incidente crítico, cuando se guarda, entonces se notifica en <1 min.
- Dado un caso de coordinación, cuando vincula reportes, entonces todos comparten
  el caso y un responsable.
- Dado un dashboard consultado, cuando se filtra, entonces los conteos son
  correctos en <2 s.

## Fuera de alcance
- Respuesta técnica automática o contención del incidente (la plataforma coordina,
  no ejecuta remediación).
- Integración con SIEM o herramientas forenses de cada ente en esta fase.
- Atribución de atacantes o inteligencia ofensiva.
```

## 12. Elevator Pitch

Los entes públicos venezolanos hoy reportan incidentes de ciberseguridad por vías separadas y sin un canal único, lo que retrasa la respuesta nacional. Nuestra plataforma le da al CSIRT nacional un canal oficial para recibir, clasificar con IA y coordinar incidentes de toda la administración pública en un solo panel. Reduce la notificación a menos de 24 horas, clasifica automáticamente al menos el 80 % de los reportes y permite vincular ataques que afectan a varios organismos como una sola campaña. El resultado: de respuestas aisladas a una defensa coordinada a nivel país, con indicadores en tiempo casi real para la toma de decisiones.

## 13. Impacto en el organismo público

- **Eficiencia operativa:** el CSIRT concentra todos los reportes en un único panel y automatiza el triaje con IA, liberando horas de clasificación manual en cada incidente.
- **Respuesta más rápida:** la notificación cae a menos de 24 horas desde la detección, y los incidentes críticos se notifican por correo y panel en menos de 1 minuto.
- **Transparencia y trazabilidad:** cada incidente tiene un estado trazable con historial de cambios, responsables y registro de auditoría de todas las acciones.
- **Confianza ciudadana e interinstitucional:** un canal oficial y seguro (cifrado TLS, roles de acceso, identidad federada) fortalece la confianza de los entes en el proceso de reporte.
- **Ahorro de recursos:** la clasificación automática y los componentes serverless reducen el esfuerzo manual y el costo de infraestructura, permitiendo incorporar decenas de entes sin degradación.
- **Cumplimiento y decisión informada:** el dashboard de indicadores por sector, tipo y severidad apoya la definición de políticas y la asignación de recursos con datos actualizados.

## 14. README y documentación del proyecto

El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción** clara del proyecto: *Plataforma de coordinación de incidentes entre entes* — canal oficial entre el CSIRT nacional y la administración pública para reportar, clasificar y coordinar incidentes de ciberseguridad.
- **Badges** (build, tests, licencia, cobertura).
- **Características** principales:
  - Formulario guiado de reporte con evidencias adjuntas (capturas, hashes, IOCs).
  - Clasificación automática por IA con severidad inicial editable.
  - Casos de coordinación que vinculan reportes de varios organismos.
  - Estado trazable del incidente con historial de cambios.
  - Notificaciones por correo y panel para incidentes críticos.
  - Dashboard de indicadores filtrable por ente, sector, tipo y fecha.
- **Arquitectura**: diagrama de componentes y flujo de datos (frontend React en Cloudflare Pages → Workers API con D1/R2 → cola Cloudflare Queues para clasificación y notificaciones → Workers AI / Vectorize para agrupar campañas).
- **Instalación y ejecución**: prerrequisitos (Node.js, Wrangler CLI), pasos de instalación y variables de entorno (cuentas y bindings de Cloudflare).
- **Uso**: ejemplos de registro de incidente, endpoints/API y capturas del panel.
- **Datos y datasets**: fuentes (CVE/NVD, MITRE ATT&CK, MalwareBazaar, Abuse.ch, ENISA Threat Landscape), formato y cómo obtenerlos para entrenar/validar el clasificador.
- **Pruebas**: cómo ejecutar la suite de tests del clasificador y del flujo de coordinación.
- **Contribución**: guía para colaborar (issues, pull requests, estándares de código).
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
