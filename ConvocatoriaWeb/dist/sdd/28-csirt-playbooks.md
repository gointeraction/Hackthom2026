# SDD — CSIRT con triaje y playbooks automatizados

> Hackathon UNETI IA 2026 · Proyecto #28 · Eje 2 · Ciberseguridad · Complejidad: Avanzada
> Ente público: Coordinación entre entes

## 1. Problema
Los incidentes de ciberseguridad que reportan los distintos entes del Estado venezolano se reciben por correo, teléfono o formatos manuales y se triajean a mano, lo que retrasa la respuesta horas e incluso días. Esto afecta a los equipos de respuesta (CSIRT) y a los organismos coordinados, que no logran correlacionar alertas dispersas ni priorizar el incidente crítico a tiempo, aumentando el daño y el tiempo de contención.

## 2. Objetivos
- Reducir el tiempo de triaje inicial de un incidente de horas a menos de 5 minutos mediante clasificación automática.
- Correlacionar automáticamente al menos el 80 % de los eventos relacionados (IP, dominio, hash, CVE) en un incidente único.
- Ejecutar playbooks de respuesta automatizados para los 5 tipos de incidente más frecuentes (phishing, malware, DDoS, fuga de datos, acceso no autorizado).
- Medir y reportar el tiempo medio de respuesta (MTTR) y tiempo de contención por ente coordinado en un tablero único.

## 3. Requisitos funcionales (RF)
- RF-01: Ingestar incidentes desde múltiples canales (correo, formulario web, API de SIEM y carga de archivos IOC) en un formato normalizado (STIX/JSON).
- RF-02: Clasificar automáticamente cada incidente por severidad (baja, media, alta, crítica) y categoría usando un modelo de IA.
- RF-03: Correlacionar indicadores de compromiso (IP, dominio, hash de archivo, CVE) contra una base de amenazas y agrupar alertas en incidentes consolidados.
- RF-04: Ejecutar playbooks de respuesta por tipo de incidente con pasos accionables y aprobación humana obligatoria antes de acciones irreversibles (bloqueo, aislamiento).
- RF-05: Generar reportes y notificaciones automáticas a los entes afectados y a la coordinación, con trazabilidad de cada decisión.
- RF-06: Permitir asignación de roles (analista, coordinador, administrador) con registro de auditoría de todas las acciones.

## 4. Requisitos no funcionales (RNF)
- RNF-01: Seguridad/privacidad: cifrado TLS en tránsito y en reposo, autenticación multifactor, control de acceso basado en roles y manejo de datos personales conforme a la normativa aplicable.
- RNF-02: Escalabilidad: soportar la ingesta simultánea de incidentes de al menos 20 entes coordinados y crecer horizontalmente ante picos de alertas.
- RNF-03: Rendimiento: el motor de triaje debe emitir una clasificación en menos de 5 segundos por incidente y soportar al menos 100 incidentes por minuto.
- RNF-04: Accesibilidad/usabilidad: interfaz en español, operable por analistas sin conocimientos de programación, con diseño responsive y tiempos de carga menores a 3 segundos.

## 5. Historias de usuario
- Como analista de un CSIRT, quiero que el sistema clasifique y priorice automáticamente los incidentes entrantes, para atender primero los de mayor severidad sin revisar manualmente cada reporte.
- Como coordinador de ciberseguridad, quiero ver en un tablero los incidentes correlacionados de todos los entes, para detectar campañas coordinadas que afectan a varias instituciones a la vez.
- Como responsable de respuesta, quiero ejecutar playbooks automatizados con pasos guiados y aprobación previa, para contener incidentes de forma consistente y auditable.

## 6. Criterios de aceptación
- Dado un reporte de phishing recibido por correo, cuando se procesa en el sistema, entonces se clasifica como "phishing" con severidad asignada y se sugiere el playbook correspondiente en menos de 5 minutos.
- Dado un conjunto de alertas con la misma IP maliciosa, cuando se correlacionan, entonces se agrupan en un único incidente con el indicador compartido identificado.
- Dado un playbook con una acción de bloqueo irreversible, cuando el analista lo ejecuta, entonces el sistema exige aprobación explícita y registra la acción en la auditoría.
- Dado un incidente crítico, cuando se confirma, entonces se notifica automáticamente al ente afectado y a la coordinación con el detalle del incidente en menos de 2 minutos.

## 7. Datos y fuentes sugeridas
- Feeds de indicadores de compromiso abiertos: MISP threat sharing, OpenCTI, AlienVault OTX, Abuse.ch (URLhaus y MalwareBazaar).
- MITRE ATT&CK (técnicas, tácticas y mitigaciones) para mapear cada incidente a un adversario conocido.
- CVE/NVD para enriquecimiento de vulnerabilidades correlacionadas.
- Registros de ejemplo: PCAP y logs de firewall/IDS públicos (p. ej., conjuntos de datos de CICIDS, UNSW-NB15) para entrenar y probar el clasificador.
- Formatos de intercambio: STIX 2.1 y TAXII 2.1 para interoperabilidad entre entes coordinados.

## 8. Stack tecnológico sugerido
- Backend: Python (FastAPI) o Node.js (Hono) para la API de ingesta y orquestación de playbooks.
- Motor de IA: Workers AI (Cloudflare) o un modelo local/hospedado para clasificación de texto e incidentes; vectorización con Cloudflare Vectorize para búsqueda semántica de incidentes similares.
- Almacenamiento: Cloudflare D1 (SQLite) para incidentes y playbooks, y R2 para adjuntos y evidencias (PCAP, correos).
- Orquestación y colas: Cloudflare Queues y Workflows para ejecutar playbooks con reintentos y pasos de aprobación.
- Frontend: React/Next.js desplegado en Cloudflare Pages, con panel de triaje, tablero de correlación y editor de playbooks.
- Seguridad perimetral: Cloudflare Turnstile para el formulario público y Cloudflare Access (Zero Trust) para el acceso de analistas.

## 9. Ente público y visión de despliegue
La solución la adopta la coordinación de ciberseguridad entre entes públicos, que actúa como nodo central del CSIRT nacional. Se despliega como plataforma web segura (Cloudflare Workers/Pages) a la que cada ente se conecta mediante un conector o API para enviar incidentes; los analistas de cada organismo acceden con roles propios y la coordinación consolida el panorama nacional de amenazas.

## 10. Definition of Done
- [ ] La ingesta normaliza incidentes desde al menos 3 canales distintos a un formato STIX/JSON común.
- [ ] El modelo de clasificación alcanza una precisión ≥ 85 % sobre un conjunto de prueba etiquetado.
- [ ] La correlación agrupa correctamente incidentes que comparten al menos un indicador de compromiso.
- [ ] Cada playbook ejecutable exige aprobación humana para acciones irreversibles y deja trazabilidad de auditoría.
- [ ] Existe un tablero con métricas de MTTR por ente y una demostración de punta a punta validada.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — CSIRT con triaje y playbooks automatizados
## Problema
La respuesta a incidentes entre entes públicos es lenta y manual, lo que retrasa la contención y aumenta el daño.

## RF / RNF
- RF-01: Ingesta multicanal normalizada (correo, web, API, IOC).
- RF-02: Triaje automático por severidad y categoría.
- RF-03: Correlación de indicadores de compromiso.
- RF-04: Playbooks de respuesta con aprobación humana.
- RF-05: Reportes y notificaciones con trazabilidad.
- RNF-01: Seguridad (TLS, MFA, RBAC, cifrado).
- RNF-02: Escalabilidad horizontal entre 20+ entes.
- RNF-03: Rendimiento (< 5 s por clasificación).
- RNF-04: Usabilidad (español, sin código, responsive).

## Historias de usuario
- Como analista, quiero triaje automático, para priorizar incidentes críticos.
- Como coordinador, quiero correlación entre entes, para detectar campañas conjuntas.
- Como responsable, quiero playbooks guiados, para responder de forma auditable.

## Criterios de aceptación
- Dado un reporte de phishing, cuando se procesa, entonces se clasifica y sugiere playbook en < 5 min.
- Dado alertas con una misma IP, cuando se correlacionan, entonces se agrupan en un incidente único.
- Dado una acción irreversible, cuando se ejecuta, entonces exige aprobación y queda auditada.
- Dado un incidente crítico confirmado, cuando ocurre, entonces notifica al ente y a la coordinación.

## Fuera de alcance
- Respuesta física a incidentes (forense in situ o incautación de equipos).
- Reemplazo de los SIEM o herramientas de cada ente.
- Atribución ofensiva (hack-back) contra los atacantes.
```

## 12. Elevator Pitch
La coordinación de ciberseguridad entre entes públicos recibe hoy los incidentes por correo y formatos manuales y los triajea a mano, perdiendo horas e incluso días en la contención. Nuestra plataforma ingesta esos reportes desde múltiples canales, los clasifica con IA por severidad y categoría en menos de 5 minutos, y correlaciona los indicadores de compromiso para agrupar alertas dispersas en un único incidente. Además, ejecuta playbooks de respuesta guiados con aprobación humana obligatoria, y muestra en un tablero el MTTR y el tiempo de contención de cada ente coordinado. El resultado: respuesta más rápida, auditable y con una visión nacional consolidada de las amenazas.

## 13. Impacto en el organismo público
- **Eficiencia:** reduce el triaje inicial de horas a menos de 5 minutos y acelera la contención al priorizar automáticamente el incidente crítico.
- **Transparencia:** cada decisión queda trazada en auditoría, con reportes y notificaciones automáticas al ente afectado y a la coordinación.
- **Confianza ciudadana:** una respuesta coordinada y medible entre los entes mejora la protección frente a campañas que atacan a varias instituciones a la vez.
- **Ahorro de recursos:** la clasificación y correlación automáticas liberan a los analistas del trabajo manual repetitivo para concentrarlos en la respuesta real.
- **Cumplimiento normativo:** cifrado, autenticación multifactor, control de acceso por roles y manejo de datos personales alineados a la normativa aplicable.

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
