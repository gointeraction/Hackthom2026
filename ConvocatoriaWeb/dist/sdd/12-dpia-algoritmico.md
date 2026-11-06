# SDD — Evaluación de impacto algorítmico (DPIA algorítmico)

> Hackathon UNETI IA 2026 · Proyecto #12 · Eje 1 · IA Ética · Complejidad: Avanzada
> Ente público: Ente rector / Contraloría

## 1. Problema
En Venezuela se despliegan sistemas de IA en servicios públicos (admisión a beneficios, fiscalización, priorización de trámites) sin una evaluación previa de su impacto sobre derechos fundamentales como la igualdad, la privacidad o el debido proceso. Esto afecta directamente a la ciudadanía —en especial a grupos vulnerables— y a la propia Administración Pública, que asume responsabilidad por decisiones automatizadas no documentadas. Importa porque un algoritmo sin evaluación puede reproducir sesgos, negar derechos sin trazabilidad y erosionar la confianza en las instituciones, además de exponer al ente rector a riesgos legales y de control fiscal.

## 2. Objetivos
- Lograr que el 100 % de los algoritmos de riesgo alto del ente público cuenten con una Evaluación de Impacto Algorítmico (DPIA algorítmica) documentada **antes** de su puesta en producción.
- Reducir de semanas a días el tiempo de dictamen técnico mediante una clasificación automática de riesgo reproducible.
- Garantizar trazabilidad completa: cada dictamen firmado debe quedar inmutable (hash) y vinculado a la versión exacta del modelo y del dataset evaluado.
- Proveer un tablero de control público que permita a la ciudadanía y a la Contraloría consultar el estado de cada algoritmo evaluado (aprobado / con mitigaciones / rechazado).

## 3. Requisitos funcionales (RF)
- RF-01: **Registro de algoritmos.** El sistema mantiene un inventario auditable con ficha técnica por algoritmo: nombre, ente responsable, finalidad, proveedor, versión del modelo, dataset de entrenamiento, datos personales tratados y fecha de registro.
- RF-02: **Clasificación de riesgo.** Un cuestionario estructurado asigna de forma automática el nivel de riesgo (bajo / medio / alto / riesgo inadmisible) según criterios como uso de datos sensibles, decisión automatizada con efectos jurídicos, vigilancia o perfilado, y población afectada.
- RF-03: **Matriz de derechos fundamentales.** La evaluación cruza cada etapa del ciclo de vida del algoritmo (datos, entrenamiento, despliegue, operación, retiro) contra derechos afectados (igualdad y no discriminación, privacidad, debido proceso, libertad de expresión, protección de datos), con severidad y probabilidad documentadas.
- RF-04: **Dictamen e informe exportable.** El sistema genera un informe DPIA algorítmico en PDF con dictamen final (aprobar / aprobar con mitigaciones / rechazar), firmado digitalmente y con hash SHA-256 para garantizar inmutabilidad.
- RF-05: **Plan de mitigación y monitoreo.** Registra controles de mitigación obligatorios (auditoría humana, umbrales de confianza, detección de sesgo) y un plan de monitoreo post-despliegue con métricas de deriva y periodicidad de re-evaluación.
- RF-06: **Bitácora de cambios.** Todo cambio en el modelo, el dataset o la finalidad marca la evaluación vigente como obsoleta y exige una nueva evaluación antes de continuar operando.

## 4. Requisitos no funcionales (RNF)
- RNF-01: **Seguridad/privacidad.** Cifrado TLS en tránsito y en reposo, control de acceso por roles (registrador, evaluador, rector, auditor ciudadano), minimización de datos y anonimización antes del almacenamiento; cumplimiento de los principios de la Ley de Infogobierno y de la Ley Orgánica de la Contraloría General de la República.
- RNF-02: **Escalabilidad.** La plataforma debe soportar el registro concurrente de múltiples entes y miles de algoritmos, con arquitectura desacoplada (API + cola de trabajo) que permita incorporar nuevos organismos sin rediseño.
- RNF-03: **Rendimiento.** El cuestionario de clasificación debe devolver el nivel de riesgo en menos de 2 segundos y la generación del informe PDF en menos de 10 segundos; disponibilidad objetivo del 99,5 %.
- RNF-04: **Accesibilidad/usabilidad.** Interfaz en español conforme a WCAG 2.1 nivel AA, operable por funcionarios sin formación técnica avanzada, con textos de ayuda, glosario jurídico-técnico y soporte para lectores de pantalla.

## 5. Historias de usuario
- Como **funcionario del ente público**, quiero registrar un algoritmo con su ficha técnica y adjuntar el dataset de entrenamiento, para dejar constancia formal antes de su despliegue.
- Como **evaluador de riesgos de la Contraloría**, quiero responder el cuestionario y obtener un nivel de riesgo automático con su justificación, para priorizar los algoritmos que requieren evaluación profunda.
- Como **ciudadano o auditor**, quiero consultar el dictamen público de un algoritmo, para conocer qué riesgos fueron identificados y qué mitigaciones se aplicaron antes de su uso.

## 6. Criterios de aceptación
- Dado un algoritmo que usa **datos sensibles** y toma **decisiones automatizadas con efectos jurídicos**, cuando el evaluador completa el cuestionario, entonces el sistema lo clasifica como **riesgo alto** y exige mitigaciones obligatorias antes de emitir dictamen favorable.
- Dado un informe de evaluación finalizado, cuando el evaluador lo firma digitalmente, entonces se genera un PDF con hash SHA-256 y el documento queda **inmutable** en la bitácora de auditoría.
- Dado un algoritmo clasificado como **riesgo inadmisible** (por ejemplo, puntuación social generalizada), cuando se intenta autorizar su uso, entonces el sistema **bloquea la autorización** y deriva el caso al Comité de Ética y al ente rector.
- Dado un cambio registrado en la versión del modelo o del dataset, cuando se guarda el cambio, entonces la evaluación vigente se marca como **obsoleta** y el algoritmo queda en estado "requiere re-evaluación".

## 7. Datos y fuentes sugeridas
- **Reglamento (UE) 2024/1689 — Ley de Inteligencia Artificial (AI Act):** anexos de clasificación de riesgo alto e inadmisible, para el cuestionario de RF-02.
- **NIST AI Risk Management Framework (AI RMF 1.0):** funciones *Govern, Map, Measure, Manage* para estructurar la matriz de RF-03.
- **Principios de IA de la OCDE (2019) y Recomendación de la UNESCO sobre la Ética de la IA (2021):** catálogo de principios y valores para la matriz de derechos.
- **RGPD — Evaluación de Impacto relativa a la Protección de Datos (art. 35):** plantilla base de DPIA adaptada a algoritmos.
- **Ley de Infogobierno (Venezuela, 2014)** y **Constitución de la República Bolivariana de Venezuela** (arts. 19–31, 60: privacidad; 141: administración al servicio de la ciudadanía).
- **AI Incident Database (AIID)** y **OECD AI Incidents Monitor:** casos reales de daño algorítmico para construir escenarios de prueba y ejemplos de mitigación.
- **Bancos de datos de equidad** (COMPAS ProPublica, FairFace, German Credit) para validar métricas de detección de sesgo en la etapa de monitoreo de RF-05.

## 8. Stack tecnológico sugerido
- **Backend:** Python 3.12 con **FastAPI** (API REST), **Pydantic** para validación de fichas, **SQLAlchemy** + **PostgreSQL** como base principal, **Redis** para cola de generación de informes.
- **Frontend:** **Next.js 14 + TypeScript**, componentes accesibles con **Radix UI** y **Tailwind CSS**, desplegado en **Cloudflare Pages**.
- **Plataforma e IA (Cloudflare):** **Workers AI** para un asistente de redacción de dictámenes (modelos Llama 3 / Mistral), **Vectorize** con *embeddings* para búsqueda de precedentes de riesgo, **Workers + Durable Objects** para la orquestación del flujo de evaluación, y **D1**/**R2** para metadatos y almacenamiento de informes firmados.
- **Seguridad y control de acceso:** **Cloudflare Access** (Zero Trust con roles), **WAF + Turnstile** para proteger el portal público, **Cloudflare Workers KV** para sesiones y límites de tasa.
- **Firma e inmutabilidad:** hash **SHA-256** y firma electrónica; exportación a **PDF/A** para conservación documental exigible en sede de control fiscal.

## 9. Ente público y visión de despliegue
La plataforma es adoptada por el **ente rector en materia de IA** y por la **Contraloría General de la República**, que actúan como autoridad de supervisión: los organismos registran sus algoritmos, el ente rector dictamina y la Contraloría audita la trazabilidad del proceso. El despliegue se realiza en tres fases: (1) **piloto** con 2–3 organismos y un catálogo reducido de algoritmos de riesgo alto; (2) **expansión** a todos los entes obligados, con tablero ciudadano público; y (3) **consolidación** con integración al Sistema Nacional de Control Fiscal y emisión de normativa que haga obligatoria la evaluación previa. La infraestructura se aloja en la nube con respaldo en territorio nacional y redundancia para continuidad operativa.

## 10. Definition of Done
- [ ] Todo algoritmo registrado cuenta con ficha técnica completa y nivel de riesgo asignado y justificado.
- [ ] La matriz de derechos fundamentales está completada para las etapas de datos, entrenamiento, despliegue, operación y retiro.
- [ ] El informe DPIA algorítmico en PDF se genera con hash SHA-256, firma electrónica y queda inmutable en la bitácora.
- [ ] Los algoritmos de riesgo inadmisible quedan bloqueados y derivados al Comité de Ética, sin excepción manual.
- [ ] El tablero ciudadano permite consultar el dictamen público de cada algoritmo y el plan de mitigación vigente.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Evaluación de impacto algorítmico (DPIA algorítmico)
## Problema
Se despliega IA pública sin evaluar riesgos a derechos fundamentales.

## RF / RNF
- RF-01: Inventario auditable de algoritmos (ficha técnica, versión, dataset).
- RF-02: Clasificación automática de riesgo (bajo / medio / alto / inadmisible).
- RF-03: Matriz de impacto sobre derechos fundamentales por etapa del ciclo de vida.
- RF-04: Informe DPIA algorítmico en PDF, firmado digitalmente y con hash SHA-256.
- RF-05: Plan de mitigación y monitoreo post-despliegue.
- RF-06: Bitácora de cambios que obliga a re-evaluación.
- RNF-01: Seguridad y privacidad (TLS, roles, minimización, anonimización).
- RNF-02: Escalabilidad multiente y miles de algoritmos.
- RNF-03: Rendimiento (clasificación < 2 s, informe < 10 s).
- RNF-04: Accesibilidad WCAG 2.1 AA e interfaz en español.

## Historias de usuario
- Como funcionario, quiero registrar un algoritmo, para dejar constancia formal.
- Como evaluador, quiero obtener un nivel de riesgo automático, para priorizar.
- Como ciudadano, quiero consultar el dictamen público, para conocer las mitigaciones.

## Criterios de aceptación
- Dado datos sensibles con decisión automatizada, cuando completo el cuestionario, entonces se clasifica como riesgo alto y exige mitigaciones.
- Dado un informe finalizado, cuando se firma, entonces se genera PDF con hash y queda inmutable.
- Dado un riesgo inadmisible, cuando se intenta autorizar, entonces se bloquea y se deriva al Comité de Ética.

## Fuera de alcance
- Construcción o entrenamiento de los algoritmos evaluados (solo se evalúan los del ente).
- Sustitución del proceso judicial o de las garantías del debido proceso.
- Certificación internacional de conformidad con el AI Act (es evaluación nacional, no sello UE).
```

## 12. Elevator Pitch
Antes de desplegar cualquier algoritmo en la Administración Pública, nuestro sistema realiza una Evaluación de Impacto Algorítmico (DPIA algorítmica) que clasifica su nivel de riesgo, cruza su impacto sobre derechos fundamentales (igualdad, privacidad, debido proceso) y emite un dictamen firmado digitalmente e inmutable mediante hash SHA-256. Está dirigido al ente rector en materia de IA y a la Contraloría General de la República, que pasan de auditar "a posteriori" a supervisar "antes" de que un algoritmo pueda negar un derecho o reproducir un sesgo. Su valor diferencial es la trazabilidad total: cada dictamen queda vinculado a la versión exacta del modelo y del dataset, con mitigaciones obligatorias y un tablero público donde la ciudadanía puede consultar el estado de cada algoritmo. El resultado: decisiones automatizadas documentadas, auditables y con responsabilidad institucional.

## 13. Impacto en el organismo público
- **Eficiencia:** reduce de semanas a días el tiempo de dictamen técnico gracias a la clasificación automática de riesgo, liberando a los evaluadores para los casos de riesgo alto.
- **Transparencia:** el tablero ciudadano público expone el estado de cada algoritmo (aprobado / con mitigaciones / rechazado), convirtiendo un proceso opaco en información verificable para la ciudadanía.
- **Confianza ciudadana:** al documentar y publicar los riesgos y mitigaciones antes del despliegue, el ente rector demuestra que protege derechos fundamentales y evita la erosión de la confianza en las instituciones.
- **Ahorro de recursos:** la inmutabilidad de los dictámenes (hash SHA-256) y la bitácora de auditoría reducen el costo de los procesos de control fiscal posteriores y de la reconstrucción de trazabilidad.
- **Cumplimiento normativo:** la plataforma materializa los principios de la Ley de Infogobierno y de la Ley Orgánica de la Contraloría General de la República, alineando al organismo con estándares internacionales (AI Act, NIST AI RMF, OCDE, UNESCO) y reduciendo la exposición legal del ente.

## 14. README y documentación del proyecto
El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción** clara del proyecto: plataforma de Evaluación de Impacto Algorítmico (DPIA algorítmica) que registra algoritmos, clasifica su riesgo, evalúa su impacto sobre derechos fundamentales y emite dictámenes firmados e inmutables antes de su puesta en producción.
- **Badges** (build, tests, licencia, cobertura).
- **Características** principales: inventario auditable de algoritmos, clasificación automática de riesgo, matriz de derechos fundamentales, generación de informe PDF con firma digital y hash SHA-256, plan de mitigación y monitoreo, bitácora de cambios y tablero ciudadano.
- **Arquitectura** (diagrama de componentes y flujo de datos): API REST (FastAPI) + cola de trabajo (Redis) + PostgreSQL; frontend Next.js 14; Workers AI / Vectorize / Durable Objects / D1 / R2 en Cloudflare; control de acceso Cloudflare Access + WAF + Turnstile.
- **Instalación y ejecución** (prerrequisitos, pasos, variables de entorno).
- **Uso** (ejemplos, endpoints/API, capturas).
- **Datos y datasets** (fuentes, formato, cómo obtenerlos): reglamento AI Act, NIST AI RMF, principios OCDE/UNESCO, RGPD art. 35, Ley de Infogobierno, AI Incident Database, bancos de equidad (COMPAS, FairFace, German Credit).
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
