# SDD — OSINT de amenazas con NLP sobre fuentes abiertas

> Hackathon UNETI IA 2026 · Proyecto #37 · Eje 2 · Ciberseguridad · Complejidad: Avanzada
> Ente público: Cuerpos de seguridad

## 1. Problema
Los grupos delictivos y actores maliciosos anuncian sus intenciones en foros de la *deep web*, mercados ilegales, canales de mensajería y *pastes* de datos filtrados **antes** de ejecutar el ataque. Los cuerpos de seguridad venezolanos no cuentan con una herramienta que consolide y priorice estas señales tempranas en tiempo casi real, lo que hoy los obliga a reaccionar de forma reactiva y con horas o días de retraso.

## 2. Objetivos
- Recolectar de forma automatizada publicaciones de al menos 4 tipos de fuentes abiertas (foros, canales de mensajería, *paste sites* y mercados) mediante conectores verificados.
- Clasificar cada ítem con análisis de lenguaje (NLP) en categorías de amenaza: anuncio de ataque, venta de datos, reclutamiento, y coordinación, con una precisión mínima del 85% sobre un conjunto de prueba anotado.
- Generar alertas priorizadas por severidad (crítica/alta/media/baja) con un tiempo de detección menor a 5 minutos desde la publicación de la fuente.
- Entregar un panel de monitoreo para analistas de los cuerpos de seguridad con evidencia trazable (fuente, URL, hash, fecha) exportable a un informe oficial.

## 3. Requisitos funcionales (RF)
- RF-01: El sistema debe ingerir publicaciones desde fuentes OSINT (foros públicos, canales de Telegram, *paste sites* tipo Pastebin, y listados de mercados) mediante conectores programables.
- RF-02: El módulo de análisis de lenguaje debe detectar indicadores de riesgo (armas, ubicaciones, fechas, objetivos, jerga delictiva venezolana y regional) y producir un puntaje de severidad por ítem.
- RF-03: El sistema debe deduplicar contenido idéntico o casi idéntico (similitud de texto) y agrupar ítems relacionados en incidentes.
- RF-04: El sistema debe emitir alertas con prioridad, enriquecidas con la fuente, la URL original, el hash del contenido y la marca de tiempo de recolección.
- RF-05: El sistema debe permitir que un analista confirme, descarte o anote una alerta (etiquetado supervisado) y que esas decisiones realimenten el modelo.
- RF-06: El sistema debe generar una línea de tiempo y un reporte exportable (PDF/CSV) de un incidente para su remisión a instancias superiores.

## 4. Requisitos no funcionales (RNF)
- RNF-01: **Seguridad/privacidad** — Todo acceso al panel debe requerir autenticación con roles (analista, supervisor, administrador), cifrado TLS en tránsito, cifrado en reposo y registro de auditoría de accesos y acciones sobre alertas.
- RNF-02: **Escalabilidad** — La arquitectura de recolección debe soportar al menos 10.000 ítems nuevos por día sin degradación, mediante colas de trabajo y procesamiento horizontal.
- RNF-03: **Rendimiento** — El pipeline de análisis debe procesar un ítem individual en menos de 2 segundos y el panel debe mostrar alertas nuevas en menos de 5 segundos tras su publicación.
- RNF-04: **Accesibilidad/usabilidad** — El panel debe ser usable por personal no técnico: interfaz en español, navegación simple, filtros por severidad/fuente/fecha y documentación de operación clara.

## 5. Historias de usuario
- Como **analista de inteligencia de un cuerpo de seguridad**, quiero ver una lista priorizada de amenazas anunciadas en fuentes abiertas, para concentrar mis recursos en los casos de mayor riesgo.
- Como **supervisor**, quiero recibir una alerta crítica con su evidencia (fuente, captura, URL, hash) en menos de 5 minutos, para autorizar una respuesta operativa oportuna.
- Como **administrador del sistema**, quiero agregar o desactivar fuentes de recolección y revisar la bitácora de auditoría, para mantener el monitoreo actualizado y auditable.

## 6. Criterios de aceptación
- Dado un mensaje publicado en un canal monitoreado con lenguaje de amenaza (p. ej., venta de datos robados), cuando el conector lo ingesta y el modelo lo clasifica, entonces se crea una alerta de severidad alta con fuente, URL y hash asociados.
- Dado un conjunto de prueba de 200 ítems anotados por expertos, cuando se evalúa el clasificador, entonces la precisión macro-F1 es igual o superior a 0.85.
- Dado un ítem duplicado publicado en dos fuentes distintas, cuando el sistema lo procesa, entonces se agrupa bajo un único incidente sin duplicar la alerta.
- Dado un analista con rol autorizado, cuando consulta el panel, entonces ve las alertas ordenadas por severidad y puede exportar el reporte del incidente en PDF.

## 7. Datos y fuentes sugeridas
- **Datos anotados de amenazas:** *Cyber Threat Intelligence (CTI) datasets* públicos, por ejemplo el *JSON* de reportes OSINT de comunidades como **AlienVault OTX** (indicadores y *pulses*), y *threat feeds* de **Abuse.ch** (URLhaus, ThreatFox).
- **Lenguaje/delito:** corpus de *pastes* de **Pastebin/Ghostbin** (históricos públicos), y listas de *leaked credentials* referenciadas por **Have I Been Pwned** para validar filtraciones.
- **Jerga y entidades:** listas de vocabulario de ciberdelito en español e inglés (argot de foros) y gazetteers de ubicaciones/organizaciones venezolanas para reconocimiento de entidades (NER).
- **Bases de fuentes:** directorios OSINT como **osintframework.com** y **start.me OSINT** para construir el catálogo inicial de fuentes verificables.

## 8. Stack tecnológico sugerido
- **Recolección:** Python 3.11+ con `httpx`, `telethon` (Telegram), `Scrapy`/`Playwright` para foros y *paste sites*, y colas con `Redis` + `Celery`.
- **NLP / IA:** modelos de lenguaje para clasificación y NER — `spaCy` (español) para entidades, y modelos tipo `transformers` (BERT multilingüe, p. ej. `dccuchile/bert-base-spanish-wwm-uncased` o un LLM pequeño) para clasificación y severidad; `sentence-transformers` para deduplicación por similitud.
- **Backend / API:** FastAPI (Python) con autenticación JWT y roles; base de datos PostgreSQL + búsqueda con OpenSearch/Elasticsearch.
- **Frontend:** React + TypeScript con tablas/filtros y visualización de línea de tiempo (v.g. D3 o vis-timeline).
- **Servicios Cloudflare / IA:** **Cloudflare Workers** para proxies y *rate-limiting* de conectores, **Workers AI** para inferencia de clasificación ligera en el *edge*, **Cloudflare R2** para almacenar evidencia (capturas/hashes), **D1** para metadatos y **Queues** para orquestar el pipeline de alertas. (Sustituible por Workers AI/Vectores según disponibilidad.)

## 9. Ente público y visión de despliegue
Lo adopta un cuerpo de seguridad del Estado venezolano (p. ej., una dirección de inteligencia/ciberdelito) como sistema interno de alerta temprana. Se despliega en infraestructura soberana o en nube con cumplimiento de datos: los conectores corren de forma programada, el pipeline de NLP se ejecuta en el *edge* o en servidores locales, y los analistas operan desde una intranet segura con roles y auditoría. Se inicia como piloto con 3–5 fuentes verificadas y un grupo reducido de analistas, para luego ampliar fuentes y usuarios.

## 10. Definition of Done
- [ ] Los conectores de recolección están implementados y verificados para al menos 4 tipos de fuente (foro, canal de mensajería, *paste site*, mercado).
- [ ] El clasificador de NLP alcanza F1 ≥ 0.85 sobre el conjunto de prueba anotado y el resultado queda documentado.
- [ ] La deduplicación y agrupación en incidentes funciona con casos de prueba de contenido repetido entre fuentes.
- [ ] El panel con roles, filtros y exportación PDF/CSV está desplegado y accesible con autenticación y bitácora de auditoría.
- [ ] Existe una demo grabada de extremo a extremo (publicación → alerta priorizada → reporte) reproducible por el jurado.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — OSINT de amenazas con NLP sobre fuentes abiertas
## Problema
Las amenazas se anuncian en foros, mercados y leaks antes de atacar; los cuerpos de seguridad carecen de alerta temprana automatizada con análisis de lenguaje.

## RF / RNF
### RF
- RF-01: Ingesta OSINT desde foros, canales de mensajería, paste sites y mercados.
- RF-02: Análisis de lenguaje (NLP) con detección de indicadores y puntaje de severidad.
- RF-03: Deduplicación por similitud y agrupación de ítems en incidentes.
- RF-04: Alertas priorizadas con fuente, URL, hash y marca de tiempo.
- RF-05: Confirmación/anotación supervisada por analistas con realimentación al modelo.
- RF-06: Línea de tiempo y reporte exportable (PDF/CSV).

### RNF
- RNF-01: Autenticación con roles, TLS, cifrado en reposo y auditoría de accesos.
- RNF-02: Soportar ≥10.000 ítems/día con procesamiento horizontal.
- RNF-03: Ítem procesado en <2 s; alerta visible en <5 s.
- RNF-04: Interfaz en español, usable por personal no técnico.

## Historias de usuario
- Como analista, quiero una lista priorizada de amenazas, para enfocar recursos en el mayor riesgo.
- Como supervisor, quiero alerta crítica con evidencia en <5 min, para autorizar respuesta oportuna.
- Como administrador, quiero gestionar fuentes y auditoría, para mantener el monitoreo auditable.

## Criterios de aceptación
- Dado un mensaje con lenguaje de amenaza, cuando se ingesta y clasifica, entonces se crea una alerta de severidad alta con evidencia.
- Dado un conjunto de prueba de 200 ítems, cuando se evalúa el clasificador, entonces F1 ≥ 0.85.
- Dado un ítem duplicado en dos fuentes, cuando se procesa, entonces se agrupa en un único incidente.
- Dado un analista autorizado, cuando consulta el panel, entonces ve alertas ordenadas y puede exportar PDF.

## Fuera de alcance
- Intervención activa o *takedown* de fuentes (solo monitoreo pasivo de fuentes abiertas).
- Acceso no autorizado a sistemas privados o interceptación de comunicaciones.
- Identificación biométrica o vigilancia de individuos sin base legal.
- Atribución judicial automática (el sistema sugiere, no emite veredictos).
```

## 12. Elevator Pitch
Los grupos delictivos anuncian sus intenciones en foros de la *deep web*, mercados ilegales, canales de mensajería y *pastes* de datos filtrados antes de atacar; hoy los cuerpos de seguridad venezolanos reaccionan de forma reactiva, con horas o días de retraso. Este proyecto construye una plataforma que recolecta automáticamente esas fuentes abiertas, clasifica cada publicación con análisis de lenguaje (NLP) en categorías de amenaza y emite alertas priorizadas por severidad en menos de 5 minutos. Está diseñada para analistas de una dirección de inteligencia/ciberdelito del Estado venezolano, que pasan de perseguir incidentes a anticiparlos con evidencia trazable (fuente, URL, hash y fecha). Su valor diferencial es convertir el monitoreo pasivo de OSINT en alerta temprana accionable, con un panel seguro por roles y reportes exportables listos para la respuesta operativa.

## 13. Impacto en el organismo público
- **Eficiencia operativa:** concentra el trabajo de los analistas en los casos de mayor riesgo al entregar una lista priorizada por severidad, en lugar de revisar manualmente múltiples fuentes.
- **Tiempo de respuesta:** reduce el tiempo de detección de horas o días a menos de 5 minutos desde la publicación, habilitando una reacción temprana ante anuncios de ataque o venta de datos.
- **Trazabilidad y evidencia:** cada alerta queda enriquecida con fuente, URL original, hash del contenido y marca de tiempo, lo que respalda informes oficiales remitidos a instancias superiores.
- **Transparencia y auditoría:** el control de acceso con roles (analista, supervisor, administrador) y la bitácora de auditoría de accesos y acciones fortalecen la rendición de cuentas interna.
- **Cumplimiento y soberanía:** el despliegue en infraestructura soberana o en nube con cumplimiento de datos, junto con el alcance limitado a monitoreo pasivo de fuentes abiertas, mantiene la operación dentro del marco legal y normativo.

## 14. README y documentación del proyecto
El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción:** *OSINT de amenazas con NLP sobre fuentes abiertas* — plataforma de alerta temprana que recolecta fuentes OSINT, clasifica amenazas con NLP y prioriza alertas para cuerpos de seguridad.
- **Badges:** build, tests, licencia y cobertura.
- **Características:** conectores para foros, canales de mensajería, *paste sites* y mercados; clasificación NLP en categorías de amenaza; deduplicación por similitud y agrupación en incidentes; alertas priorizadas con evidencia; panel con roles, filtros y exportación PDF/CSV.
- **Arquitectura:** diagrama de componentes (recolección → colas → pipeline NLP → almacenamiento → API → panel) y flujo de datos extremo a extremo.
- **Instalación y ejecución:** prerrequisitos (Python 3.11+, Redis, PostgreSQL), pasos de instalación y variables de entorno.
- **Uso:** ejemplos de ejecución, endpoints/API (FastAPI) y capturas del panel.
- **Datos y datasets:** fuentes OSINT (AlienVault OTX, Abuse.ch, Pastebin/Ghostbin, HIBP), formato y cómo obtenerlos.
- **Pruebas:** cómo ejecutar la suite y la evaluación del clasificador (F1 ≥ 0.85).
- **Contribución:** guía para colaborar.
- **Licencia y créditos.**

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
