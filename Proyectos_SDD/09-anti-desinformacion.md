# SDD — Detector de desinformación para la esfera pública

> Hackathon UNETI IA 2026 · Proyecto #9 · Eje 1 · IA Ética · Complejidad: Avanzada
> Ente público: Comunicación oficial

## 1. Problema
Las narrativas falsas que circulan en redes sociales y mensajería masiva erosionan la confianza de la ciudadanía en las instituciones públicas venezolanas y generan inestabilidad cuando se viralizan afirmaciones sin sustento. Afecta directamente a la oficina de comunicación oficial, que hoy verifica manualmente y llega tarde a desmentir o confirmar. Importa porque cada hora de retraso en la verificación amplifica el alcance del rumor y debilita la voz institucional como fuente de verdad.

## 2. Objetivos
- Reducir de horas a **menos de 5 minutos** el tiempo entre la detección de una afirmación viral y la emisión de un dictamen de verificación preliminar.
- Verificar automáticamente **al menos el 80 %** de las afirmaciones entrantes contra fuentes oficiales indexadas, con trazabilidad de la evidencia usada.
- Asignar a cada afirmación un **nivel de confianza** (verdadera / engañosa / falsa / no verificable) con explicación legible y citable por un comunicador no técnico.
- Publicar un panel interno de monitoreo con **métricas de alcance, riesgo y cobertura** de desinformación por tema, región y plataforma.

## 3. Requisitos funcionales (RF)
- RF-01: Ingesta de afirmaciones desde múltiples canales (X/Twitter, Instagram, Telegram, WhatsApp reportado, medios digitales) con metadatos de origen, autor, fecha y alcance estimado (reposts, vistas, reenvíos).
- RF-02: Extracción automática de la *claim* (afirmación verificable) a partir de cada contenido, separando el hecho central de la opinión o el adjetivo.
- RF-03: Verificación de cada afirmación contra un índice de fuentes con autoridad (Gaceta Oficial, boletines del ente, sitios oficiales, organismos del Estado, medios verificados) mediante recuperación semántica y comparación de hechos, cifras y fechas.
- RF-04: Asignación de un **nivel de confianza** de 0 a 100 con etiqueta y justificación, incluyendo el estado "no verificable" cuando no exista evidencia suficiente, sin forzar una conclusión.
- RF-05: Generación de un **informe de verificación** por afirmación con enlaces y citas textuales de las fuentes usadas, accesible para redactar la respuesta oficial.
- RF-06: Sistema de **alertas tempranas** que prioriza afirmaciones por riesgo (tema sensible, velocidad de propagación, mención a la institución) y notifica al equipo de comunicación.

## 4. Requisitos no funcionales (RNF)
- RNF-01: Seguridad/privacidad: cifrado en tránsito y reposo; los datos personales de autores solo se conservan de forma agregada y anonimizada; trazabilidad de auditoría de quién consultó y publicó cada dictamen.
- RNF-02: Escalabilidad: capaz de procesar **miles de publicaciones por hora** sin degradación, con colas desacopladas y almacenamiento vectorial que crezca horizontalmente.
- RNF-03: Rendimiento: latencia de verificación de una afirmación individual **menor a 5 segundos** en el percentil 95; el panel de monitoreo debe actualizarse en tiempo casi real (≤ 30 s).
- RNF-04: Accesibilidad/usabilidad: interfaz en español, compatible con lectores de pantalla (WCAG 2.1 AA), usable por personal de comunicación sin formación técnica, con niveles de confianza legibles y código de colores que no dependa solo del color.

## 5. Historias de usuario
- Como **comunicador oficial**, quiero recibir una alerta inmediata cuando una afirmación sobre la institución se viraliza, para responder antes de que el rumor se consolide.
- Como **jefe de prensa**, quiero ver el nivel de confianza y las fuentes que sustentan cada verificación, para redactar un desmentido o confirmación con respaldo verificable.
- Como **analista de datos del ente**, quiero un panel con métricas de desinformación por tema y región, para orientar las campañas de comunicación preventiva.

## 6. Criterios de aceptación
- Dado un contenido viral con una afirmación verificable, cuando el sistema lo procesa, entonces emite un dictamen con nivel de confianza y fuentes citadas en menos de 5 minutos.
- Dado un afirmación que contradice una fuente oficial indexada, cuando se compara semánticamente, entonces el sistema la clasifica como "falsa" o "engañosa" con al menos un enlace de evidencia.
- Dado un afirmación sin evidencia suficiente, cuando se consultan las fuentes disponibles, entonces el sistema la marca como "no verificable" y no inventa una conclusión.
- Dado un usuario del equipo de comunicación, cuando abre el informe de una verificación, entonces puede ver la explicación en lenguaje claro y acceder a las citas originales de cada fuente.

## 7. Datos y fuentes sugeridas
- **Gaceta Oficial de la República Bolivariana de Venezuela** (texto oficial de leyes, decretos y resoluciones).
- Boletines, comunicados y notas de prensa del **ente público objetivo** y de sus cuentas oficiales verificadas.
- Sitios y cuentas oficiales de **organismos del Estado venezolano** (ministerios, instituciones autónomas, gobernaciones, alcaldías).
- Medios digitales venezolanos con línea editorial verificada y registro de publicación.
- Datasets abiertos de desinformación para entrenamiento/benchmark: *FEVER*, *LIAR*, *MultiFC* y corpus en español como *FakeDeS* y *CheckThat! Lab* (CLEF) para español.
- Archivos históricos de la propia oficina de comunicación para calibrar el clasificador a la terminología y temas locales.

## 8. Stack tecnológico sugerido
- **Backend**: Python 3.12 + FastAPI; Celery + Redis (colas) para la ingesta y verificación asíncrona.
- **NLP/IA**: modelos de embeddings multilingües (p. ej. `multilingual-e5-large` o `BGE-M3`) para recuperación semántica; LLM para extracción de claims y redacción de justificaciones (con verificación de citas); Hugging Face Transformers / LangChain para orquestación.
- **Almacenamiento**: PostgreSQL (metadatos y auditoría) + pgvector o Qdrant (índice vectorial de fuentes y afirmaciones).
- **Plataforma y edge**: Cloudflare Workers (API de ingesta y panel serverless), Cloudflare Workers AI para inferencia ligera, Cloudflare D1 o R2 para cache y artefactos públicos, y Cloudflare Turnstile para proteger endpoints de reporte ciudadano.
- **Frontend**: React + TypeScript (Next.js) con componentes accesibles; visualización con Recharts/D3 para el panel de monitoreo.
- **Despliegue**: Docker + orquestación en contenedores; observabilidad con Prometheus/Grafana o Cloudflare Observability.

## 9. Ente público y visión de despliegue
La **oficina de comunicación oficial** del ente público adopta el sistema como herramienta interna de gestión de crisis y verificación. Se despliega en tres fases: (1) piloto con las cuentas y boletines propios del ente como única fuente de verdad; (2) integración de fuentes del Estado y medios verificados, con un equipo editorial que valida y publica los dictámenes; (3) apertura de un canal público de "verificación institucional" y un formulario ciudadano (protegido con Turnstile) para reportar contenidos sospechosos. La gobernanza es humana en el bucle: la IA propone, el comunicador decide y publica, garantizando el uso ético y la rendición de cuentas.

## 10. Definition of Done
- [ ] El sistema ingiere afirmaciones de al menos 4 canales y extrae la claim verificable de forma automática.
- [ ] Cada dictamen incluye nivel de confianza, etiqueta, justificación y citas a fuentes con enlace verificable.
- [ ] Las afirmaciones sin evidencia se marcan "no verificable" (no se fuerza una conclusión falsa).
- [ ] El panel de monitoreo muestra métricas de alcance, riesgo y cobertura, y es accesible (WCAG 2.1 AA) y en español.
- [ ] Se documenta y audita toda decisión del modelo (trazabilidad de datos, fuentes y operadores humanos).

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Detector de desinformación para la esfera pública
## Problema
Narrativas falsas en redes y mensajería erosionan la confianza institucional y la estabilidad; la comunicación oficial verifica tarde y de forma manual.

## RF / RNF
- RF-01: Ingesta multicanal (X, Instagram, Telegram, WhatsApp reportado, medios).
- RF-02: Extracción automática de la claim verificable.
- RF-03: Verificación semántica contra fuentes con autoridad.
- RF-04: Nivel de confianza 0–100 con etiqueta y justificación.
- RF-05: Informe de verificación con citas y enlaces.
- RF-06: Alertas tempranas priorizadas por riesgo y propagación.
- RNF-01: Seguridad y privacidad (cifrado, anonimización, auditoría).
- RNF-02: Escalabilidad (miles de publicaciones/hora).
- RNF-03: Rendimiento (verificación < 5 s p95; panel ≤ 30 s).
- RNF-04: Accesibilidad/usabilidad (español, WCAG 2.1 AA).

## Historias de usuario
- Como comunicador oficial, quiero alertas inmediatas ante afirmaciones virales, para responder a tiempo.
- Como jefe de prensa, quiero nivel de confianza y fuentes por verificación, para redactar con respaldo verificable.
- Como analista, quiero métricas por tema y región, para orientar campañas preventivas.

## Criterios de aceptación
- Dado un contenido viral verificable, cuando se procesa, entonces emite dictamen con fuentes en < 5 min.
- Dado un afirmación que contradice una fuente oficial, cuando se compara, entonces se clasifica "falsa"/"engañosa" con evidencia.
- Dado un afirmación sin evidencia, cuando se consultan fuentes, entonces se marca "no verificable".
- Dado un usuario del equipo, cuando abre una verificación, entonces ve explicación clara y citas originales.

## Fuera de alcance
- Eliminación o bloqueo automático de contenidos o cuentas en plataformas de terceros.
- Atribución de culpabilidad a personas físicas o persecución de autores.
- Verificación de opiniones, preferencias o contenidos no factuales.
- Sustitución de la decisión editorial humana: la IA propone, el comunicador publica.
```

## 12. Elevator Pitch
Cuando una narrativa falsa se vuelve viral, la oficina de comunicación oficial hoy verifica a mano y llega tarde. Este sistema detecta en minutos la afirmación verificable, la contrasta automáticamente contra fuentes con autoridad (Gaceta Oficial, boletines y cuentas oficiales del Estado) y entrega un dictamen con nivel de confianza y citas listas para publicar. En menos de 5 minutos, el equipo de comunicación deja de reaccionar tarde y pasa a desmentir o confirmar con evidencia trazable, devolviéndole a la institución su rol de fuente de verdad.

## 13. Impacto en el organismo público
- **Eficiencia**: reduce de horas a menos de 5 minutos el tiempo entre la detección de una afirmación viral y el dictamen preliminar, liberando al equipo de la verificación manual.
- **Transparencia**: cada dictamen publica enlaces y citas textuales de las fuentes usadas, con trazabilidad de auditoría de quién consultó y publicó cada verificación.
- **Confianza ciudadana**: al desmentir o confirmar a tiempo y con respaldo verificable, la institución se consolida como fuente de verdad frente al rumor.
- **Ahorro de recursos**: la verificación automática del 80 % de las afirmaciones entrantes y el panel de métricas concentran el esfuerzo humano solo en los casos que requieren decisión editorial.
- **Cumplimiento normativo y ético**: la gobernanza "humano en el bucle" (la IA propone, el comunicador decide y publica) y el estado "no verificable" sin forzar conclusiones garantizan un uso responsable y rendición de cuentas.

## 14. README y documentación del proyecto
El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción**: "Detector de desinformación para la esfera pública" — detecta, verifica y dictamina automáticamente afirmaciones virales contra fuentes oficiales, para que la comunicación oficial desmienta o confirme a tiempo.
- **Badges**: build (CI), tests (cobertura de pytest), licencia y cobertura.
- **Características** principales: ingesta multicanal (X, Instagram, Telegram, WhatsApp reportado, medios), extracción automática de la *claim*, verificación semántica contra fuentes con autoridad, nivel de confianza 0–100 con etiqueta y justificación, informe de verificación con citas, alertas tempranas priorizadas por riesgo y panel de monitoreo accesible.
- **Arquitectura**: diagrama de componentes (ingesta → cola → extracción de claim → recuperación semántica → verificación → dictamen → alertas/panel) y flujo de datos con PostgreSQL + pgvector/Qdrant, Celery + Redis, FastAPI, Cloudflare Workers/Workers AI y React (Next.js).
- **Instalación y ejecución**: prerrequisitos (Python 3.12, PostgreSQL, Redis, Node.js), pasos de instalación, y variables de entorno documentadas en `.env.example`.
- **Uso**: ejemplos de endpoints de ingesta y consulta de dictámenes, API del panel y capturas del panel de monitoreo.
- **Datos y datasets**: fuentes oficiales (Gaceta Oficial, boletines del ente, sitios del Estado, medios verificados) y datasets de entrenamiento/benchmark (FEVER, LIAR, MultiFC, FakeDeS, CheckThat! Lab en español), con formato y forma de obtenerlos.
- **Pruebas**: cómo correr la suite (unitarias, integración y evaluación del clasificador).
- **Contribución**: guía para colaborar, flujo de ramas, commits y revisión.
- **Licencia** y créditos.

### Carpeta docs/
- `SPEC.md` (especificación).
- `SDD.md` (este documento).
- `architecture.md` (diagramas y decisiones de diseño).
- `user-guide.md` (manual de usuario para el equipo de comunicación).

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
