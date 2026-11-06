# SDD — Plataforma de inteligencia de amenazas (CTI) para infraestructura crítica

> Hackathon UNETI IA 2026 · Proyecto #22 · Eje 2 · Ciberseguridad · Complejidad: Avanzada
> Ente público: Entes reguladores / operadores

## 1. Problema
Los entes reguladores y operadores de servicios esenciales (energía eléctrica, agua potable y telecomunicaciones) no cuentan con una visión unificada y oportuna de las amenazas cibernéticas dirigidas a sus sectores. Hoy cada fuente de inteligencia (feeds de indicadores, boletines CERT, foros, OSINT, telemetría propia) se consulta por separado y de forma reactiva, lo que retrasa la detección y la respuesta ante incidentes que pueden afectar la continuidad de servicios críticos para la población.

## 2. Objetivos
- Reducir a menos de 15 minutos el tiempo entre la publicación de una amenaza en fuentes externas y la emisión de una alerta temprana dirigida a un sector crítico.
- Consolidar al menos 5 fuentes de inteligencia de amenazas (feeds IOC, boletines CERT/CSIRT nacionales, OSINT, foros y telemetría del operador) en un único panel de correlación.
- Clasificar cada alerta por sector (energía, agua, telecom), tipo de amenaza (malware, phishing, DDoS, APT, vulnerabilidad) y severidad con una precisión mínima del 85 %.
- Generar alertas tempranas priorizadas por sector con indicadores de compromiso (IoC) y recomendaciones de mitigación accionables para los equipos SOC de cada operador.

## 3. Requisitos funcionales (RF)
- RF-01: El sistema debe ingestar de forma automática y periódica indicadores de compromiso (IP, dominio, URL, hash) desde feeds públicos y suscripciones privadas mediante conectores configurables (STIX/TAXII 2.1, MISP, RSS, API REST).
- RF-02: El sistema debe normalizar y deduplicar los indicadores y eventos recolectados en un modelo de datos común (tipo, valor, fuente, fecha, confianza, sector afectado).
- RF-03: El sistema debe enriquecer cada amenaza con contexto sectorial y asignar una severidad (baja, media, alta, crítica) aplicando reglas de correlación y puntuación de confianza.
- RF-04: El sistema debe notificar alertas tempranas dirigidas por sector mediante múltiples canales (panel web, correo, API y webhook a SIEM/SOAR) indicando el sector crítico afectado.
- RF-05: El sistema debe exponer un tablero con filtros por sector, tipo de amenaza, severidad y ventana temporal, y permitir exportar informes en formato PDF/CSV/STIX.
- RF-06: El sistema debe mantener una bitácora auditable (trazabilidad) de qué fuente originó cada indicador y qué regla disparó cada alerta.

## 4. Requisitos no funcionales (RNF)
- RNF-01: Seguridad/privacidad — cifrado TLS en tránsito, control de acceso basado en roles (RBAC), secreto de API gestionado (vault/variables cifradas) y anonimización de datos personales conforme a la normativa venezolana de protección de datos.
- RNF-02: Escalabilidad — la arquitectura debe soportar la ingesta de al menos 100 000 indicadores/día y escalar horizontalmente sin degradar la correlación.
- RNF-03: Rendimiento — la consulta de un indicador en el tablero debe responder en menos de 2 segundos y la correlación de un lote de eventos en menos de 5 minutos.
- RNF-04: Accesibilidad/usabilidad — interfaz en español, legible para personal técnico y directivo, con vistas simplificadas, WCAG 2.1 nivel AA y operación completa desde navegador sin software adicional.

## 5. Historias de usuario
- Como analista SOC de un operador de energía, quiero recibir alertas priorizadas por severidad con los IoC asociados, para bloquear indicadores maliciosos antes de que afecten la red OT/SCADA.
- Como ente regulador, quiero consultar un panel consolidado por sector crítico, para supervisar el nivel de exposición de cada operador y exigir medidas de mitigación.
- Como oficial de ciberseguridad de una empresa de agua, quiero exportar un informe en STIX/PDF del último período, para documentar el cumplimiento y reportar incidentes al CSIRT nacional.

## 6. Criterios de aceptación
- Dado que un feed publica un dominio malicioso asociado al sector agua, cuando el conector lo ingesta, entonces el sistema lo normaliza, lo asigna al sector agua y emite una alerta en menos de 15 minutos.
- Dado que dos fuentes reportan el mismo indicador, cuando el sistema lo procesa, entonces lo deduplica y conserva la trazabilidad de ambas fuentes sin duplicar la alerta.
- Dado que un analista filtra el tablero por sector telecom y severidad crítica, cuando aplica los filtros, entonces la vista se actualiza en menos de 2 segundos mostrando solo las alertas que cumplen el criterio.
- Dado que se configura un webhook de un SIEM, cuando se dispara una alerta de severidad alta o crítica, entonces el sistema entrega la alerta en formato STIX 2.1 al destino configurado.

## 7. Datos y fuentes sugeridas
- MISP (Malware Information Sharing Platform) — comunidades y feeds de instancias públicas que comparten eventos e IoC.
- Botnets/abuso públicos: Feodo Tracker (botnets), URLhaus (URLs de malware), MalwareBazaar (muestras/hashes), PhishTank/OpenPhish (phishing).
- CERT/CSIRT regionales y nacionales: CSIRT-UNETI Venezuela, CCN-CERT, LACNIC/CSIRT América Latina y boletines de CERT de operadores de infraestructura.
- OSINT sectorial: alertas de ICS-CERT/CISA sobre vulnerabilidades en sistemas OT/SCADA (electricidad y agua) y NVD (National Vulnerability Database).
- Datos internos del operador: logs de firewalls/IDS, telemetría DNS y registros de intentos de acceso a sistemas de control.

## 8. Stack tecnológico sugerido
- Backend de ingesta y correlación: Python (FastAPI) y/o TypeScript (Cloudflare Workers) para conectores y API de alertas.
- Cola y procesamiento asíncrono: Cloudflare Queues (o Kafka/RabbitMQ) para ingesta masiva y Workers para normalización/desduplicado.
- Base de datos y búsqueda: PostgreSQL (D1/Turso para arranque) + vector store/índice de búsqueda (Cloudflare Vectorize o Elasticsearch/OpenSearch) para consultas rápidas de IoC.
- IA/enriquecimiento: Workers AI (o un LLM como Llama/Mistral) para clasificar descripciones, extraer entidades y priorizar severidad; embeddings para agrupar campañas similares.
- Frontend: React/Next.js desplegado en Cloudflare Pages, con autenticación RBAC mediante Cloudflare Access.
- Notificaciones e informes: Cloudflare Email Routing/Email Sending, webhooks a SIEM/SOAR y exportación STIX 2.1/PDF/CSV.

## 9. Ente público y visión de despliegue
El sistema está dirigido a entes reguladores (como el regulador de telecomunicaciones y los ministerios con competencia en servicios públicos) y a los operadores de energía, agua y telecomunicaciones. Se despliega como una plataforma nacional multi-tenant: cada operador accede únicamente a su vista sectorial, mientras el ente regulador consolida la situación país. El despliegue prioriza infraestructura en la nube (Cloudflare Workers/Pages/Queues) con un nodo de respaldo local para datos sensibles y cumplimiento de soberanía tecnológica, iniciando con un piloto en un sector (energía) antes de escalar a agua y telecom.

## 10. Definition of Done
- [ ] La ingesta automática de al menos 5 fuentes funciona de extremo a extremo con normalización y deduplicado verificado en pruebas.
- [ ] Las alertas se clasifican por sector y severidad con pruebas que demuestran precisión ≥ 85 % sobre un conjunto de datos etiquetado.
- [ ] Las notificaciones llegan por al menos 2 canales (panel + webhook/API) en menos de 15 minutos desde la publicación de la amenaza.
- [ ] El tablero permite filtrar por sector, tipo, severidad y rango de fechas, y exportar en PDF/CSV/STIX.
- [ ] La documentación (SPEC, guía de despliegue y manual de operación) está completa y el código está versionado con pruebas automatizadas en CI.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Plataforma de inteligencia de amenazas (CTI) para infraestructura crítica
## Problema
Los entes reguladores y operadores de sectores críticos (energía, agua, telecom) carecen de una visión unificada y oportuna de las amenazas cibernéticas, lo que retrasa la detección y la respuesta ante incidentes que afectan la continuidad de servicios esenciales.

## RF / RNF
### RF
- RF-01: Ingesta automática de IoC desde feeds STIX/TAXII 2.1, MISP, RSS y API REST.
- RF-02: Normalización y deduplicado en un modelo de datos común con trazabilidad de fuentes.
- RF-03: Enriquecimiento sectorial y asignación de severidad mediante reglas de correlación.
- RF-04: Notificación de alertas tempranas por sector vía panel, correo, API y webhook SIEM/SOAR.
- RF-05: Tablero con filtros y exportación de informes en PDF/CSV/STIX.
- RF-06: Bitácora auditable de origen de indicadores y reglas disparadas.

### RNF
- RNF-01: TLS, RBAC, gestión de secretos y anonimización de datos personales.
- RNF-02: Escalabilidad horizontal para ≥ 100 000 indicadores/día.
- RNF-03: Consultas < 2 s y correlación de lotes < 5 min.
- RNF-04: UI en español, WCAG 2.1 AA y operación desde navegador.

## Historias de usuario
- Como analista SOC de energía, quiero alertas priorizadas con IoC, para bloquear amenazas antes de que afecten la red OT/SCADA.
- Como ente regulador, quiero un panel consolidado por sector, para supervisar la exposición de cada operador.
- Como oficial de ciberseguridad de agua, quiero exportar informes STIX/PDF, para cumplir y reportar al CSIRT nacional.

## Criterios de aceptación
- Dado un dominio malicioso del sector agua publicado en un feed, cuando se ingesta, entonces se normaliza y emite alerta en < 15 min.
- Dado un indicador duplicado en dos fuentes, cuando se procesa, entonces se deduplica conservando la trazabilidad.
- Dado un filtro por sector telecom y severidad crítica, cuando se aplica, entonces la vista responde en < 2 s.
- Dado un webhook SIEM configurado, cuando se dispara una alerta alta/crítica, entonces se entrega en STIX 2.1.

## Fuera de alcance
- Acciones de respuesta automática sobre sistemas OT/SCADA del operador (bloqueo o contención activa).
- Correlación con fuentes clasificadas o de inteligencia gubernamental no públicas.
- Cumplimiento normativo/legal específico de cada ente (asistencia, no reemplazo del marco regulatorio).
- Predicción de ataques con modelos causales; el sistema entrega alertas basadas en evidencia y heurística.
```

## 12. Elevator Pitch
La Plataforma de inteligencia de amenazas (CTI) para infraestructura crítica consolida en un único panel las fuentes de amenazas cibernéticas (feeds de IoC, boletines CERT/CSIRT, OSINT y telemetría) que hoy los entes reguladores y los operadores de energía, agua y telecomunicaciones consultan por separado. En menos de 15 minutos convierte una amenaza publicada externamente en una alerta temprana clasificada por sector y severidad, con los indicadores de compromiso y las recomendaciones de mitigación que necesita cada equipo SOC. Su valor diferencial es una visión país multi-tenant: cada operador ve únicamente su sector y el regulador consolida la exposición nacional, con una clasificación automática de precisión mínima del 85 %.

## 13. Impacto en el organismo público
- **Eficiencia operativa:** reduce a menos de 15 minutos el tiempo entre la publicación de una amenaza y la emisión de la alerta, eliminando la consulta manual y reactiva de múltiples fuentes separadas.
- **Transparencia y trazabilidad:** la bitácora auditable deja registro de qué fuente originó cada indicador y qué regla disparó cada alerta, facilitando la rendición de cuentas del regulador ante los operadores.
- **Confianza ciudadana:** al supervisar en tiempo casi real el nivel de exposición de cada sector crítico (energía, agua, telecom), el ente regulador puede exigir medidas de mitigación que protegen la continuidad de los servicios esenciales para la población.
- **Ahorro de recursos:** la consolidación en un único panel multi-tenant y la clasificación automática por sector, tipo y severidad evitan duplicar herramientas y esfuerzos en cada operador.
- **Cumplimiento normativo:** la exportación de informes en STIX/PDF y el control de acceso basado en roles (RBAC) apoyan el reporte al CSIRT nacional y la conformidad con la normativa de protección de datos.

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
