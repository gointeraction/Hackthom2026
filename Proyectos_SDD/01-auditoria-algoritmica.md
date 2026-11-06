# SDD — Plataforma nacional de auditoría algorítmica

> Hackathon UNETI IA 2026 · Proyecto #1 · Eje 1 · IA Ética · Complejidad: Avanzada
> Ente público: MPPCT / CNTI
> Nombre sugerido del sistema: **AuditorIA** — Sello de Equidad Algorítmica para el Estado Venezolano

## 1. Problema
Los entes públicos venezolanos (MPPCT, CNTI y organismos adscritos) adoptan e integran modelos de inteligencia artificial —screening de solicitudes, asignación de beneficios, triaje de casos— sin una evaluación previa que verifique si discriminan por género, edad, origen territorial o condición socioeconómica, o si vulneran derechos constitucionales como la igualdad (CRBV art. 21) y la privacidad (CRBV art. 60). Esto expone al Estado a decisiones automatizadas injustas, a responsabilidad legal y a la pérdida de confianza ciudadana en los servicios públicos.

## 2. Objetivos
- Reducir a menos de 30 minutos el tiempo de evaluación automatizada de equidad de un modelo nuevo, sin intervención manual del equipo auditor.
- Cuantificar la disparidad de impacto y la precisión por grupo protegido con métricas estandarizadas (disparate impact ratio, equal opportunity difference, recall y precisión desagregadas), con umbrales de alerta configurables.
- Emitir un dictamen normativo automático (apto / apto con condiciones / no apto) mapeado a artículos específicos de la CRBV, la Ley de Infogobierno y los lineamientos del CNTI.
- Garantizar trazabilidad total: cada auditoría queda versionada y reproducible, con hash del modelo, del dataset y del informe, para auditoría posterior y rendición de cuentas.

## 3. Requisitos funcionales (RF)
- RF-01: Cargar un modelo de IA (exportado en ONNX, joblib, pickle o vía API de inferencia) junto con un dataset de evaluación etiquetado y su diccionario de atributos protegidos.
- RF-02: Calcular métricas de equidad por grupo —disparate impact ratio, equal opportunity difference, demographic parity y statistical parity difference— para cada atributo protegido declarado (género, edad, región, nivel socioeconómico).
- RF-03: Calcular métricas de precisión desagregadas por grupo —accuracy, precision, recall, F1 y matriz de confusión— identificando grupos con desempeño atípicamente bajo respecto al promedio global.
- RF-04: Verificar cumplimiento normativo cruzando los hallazgos contra un catálogo interno de reglas (CRBV art. 21 y 60, Ley de Infogobierno, lineamientos CNTI sobre gobernanza de datos) y generar un dictamen con justificación artículo por artículo.
- RF-05: Generar un acta de auditoría exportable (PDF y JSON) con dictamen, umbrales violados, evidencia de métricas y recomendaciones de mitigación (rebalanceo, calibración, revisión de variables).
- RF-06: Mantener histórico versionado de auditorías por modelo, permitiendo comparar evaluaciones sucesivas de un mismo modelo tras su corrección.

## 4. Requisitos no funcionales (RNF)
- RNF-01 (Seguridad/privacidad): los datos de evaluación deben tratarse con seudonimización y cifrado en reposo y en tránsito; los registros de auditoría no deben exponer información personal identificable más allá del mínimo necesario, en cumplimiento de la CRBV art. 60 y la Ley de Infogobierno.
- RNF-02 (Escalabilidad): la plataforma debe evaluar lotes de modelos de múltiples entes de forma concurrente y escalar horizontalmente; soportar datasets de evaluación de hasta 1 millón de registros por auditoría.
- RNF-03 (Rendimiento): una auditoría estándar (métricas de equidad + precisión por grupo + dictamen) debe completarse en menos de 5 minutos para datasets de hasta 100 000 registros en la infraestructura de referencia.
- RNF-04 (Accesibilidad/usabilidad): interfaz en español, accesible (WCAG 2.1 AA), con dashboard visual de disparidades y lenguaje claro para personal técnico y no técnico de los entes públicos.

## 5. Historias de usuario
- Como auditora del CNTI, quiero cargar un modelo del MPPCT y su dataset para obtener en minutos un reporte de equidad y precisión por grupo, para decidir si autorizo su despliegue.
- Como responsable de un ente público, quiero recibir un dictamen con los artículos normativos incumplidos y las acciones correctivas sugeridas, para corregir el modelo antes de ponerlo en producción.
- Como ciudadana u órgano de contraloría, quiero consultar el acta de auditoría pública de un modelo del Estado, para verificar que fue evaluado en equidad y cumplimiento normativo antes de usarse.

## 6. Criterios de aceptación
- Dado un modelo cargado con atributos protegidos declarados, cuando se ejecuta la auditoría, entonces el sistema genera métricas de disparate impact ratio, equal opportunity difference y precisión por grupo en menos de 5 minutos para 100 000 registros.
- Dado un modelo que viola el umbral de disparate impact ratio (por ejemplo < 0.8) en el atributo género, cuando finaliza la evaluación, entonces el dictamen se emite como "no apto" y cita el umbral y el grupo afectado.
- Dado un modelo corregido y re-auditado, cuando se compara con la auditoría anterior, entonces el sistema muestra un diff de métricas y conserva el historial versionado sin sobrescribir la evaluación previa.
- Dado un acta de auditoría, cuando un tercero la abre, entonces puede verificar el hash del modelo, el hash del dataset y la versión del catálogo normativo usados, garantizando reproducibilidad.

## 7. Datos y fuentes sugeridas
- **Datasets de referencia para benchmarking de equidad:** COMPAS (recidivismo, ProPublica), Adult Income / Census Income (UCI), German Credit (UCI), folktables (ACS del censo de EE. UU.), FairFace y CelebA (sesgo de visión), más datasets sintéticos propios generados con escenarios de servicios públicos venezolanos.
- **Librerías y estándares de equidad:** IBM AI Fairness 360 (AIF360), Microsoft Fairlearn, Aequitas (Center for Data Science and Public Policy), Holistic AI Library.
- **Marcos normativos aplicables en Venezuela:** Constitución de la República Bolivariana de Venezuela (art. 21 igualdad y no discriminación; art. 28 y 60 protección de datos y privacidad), Ley de Infogobierno (2013), Ley sobre Protección a la Privacidad de las Comunicaciones, lineamientos y estándares de interoperabilidad del CNTI.
- **Referencias internacionales:** Recomendación sobre la Ética de la IA (UNESCO, 2021), AI Act europeo (categorías de riesgo), NIST AI Risk Management Framework, catálogo de métricas de fairness de Google PAIR / WIT.

## 8. Stack tecnológico sugerido
- **Backend y evaluación:** Python 3.11+, FastAPI (API REST), Pandas y Polars (procesamiento), scikit-learn (métricas base), Fairlearn y AIF360 (métricas de equidad y mitigación), Great Expectations (validación de datos), ONNX Runtime (ejecución de modelos estandarizados).
- **Persistencia y trazabilidad:** PostgreSQL para metadatos de auditoría + almacenamiento de artefactos (modelos, datasets, actas) en almacenamiento de objetos con hash SHA-256 para reproducibilidad.
- **Frontend:** React + TypeScript, visualización de disparidades con Apache ECharts o Recharts, componentes accesibles (WCAG 2.1 AA).
- **Cloudflare (despliegue edge):** Cloudflare Pages para el frontend, Cloudflare Workers para la API de consulta pública de actas, R2 para actas y artefactos, D1 para el registro público de auditorías y Turnstile para proteger los endpoints públicos. El pipeline pesado de evaluación corre en Workers o en un servicio dedicado; Workers AI puede usarse para el módulo de explicabilidad/recomendaciones.
- **Orquestación y entrega:** Docker + Docker Compose, MLflow para registro de experimentos y versionado de modelos, GitHub Actions para CI/CD con pruebas unitarias de métricas.

## 9. Ente público y visión de despliegue
El sistema es adoptado por el **CNTI** como autoridad técnica en tecnologías de información del Estado, y por el **MPPCT** como ente rector de ciencia y tecnología. Se despliega como una plataforma central de auditoría algorítmica: los entes que deseen poner un modelo de IA en producción deben someterlo al sistema, que emite un **sello de equidad algorítmica** con vigencia y dictamen vinculante para la autorización de despliegue. La adopción se apoya en la Ley de Infogobierno (uso eficiente y transparente de las TIC en el Estado), con actas públicas consultables para contraloría social y rendición de cuentas.

## 10. Definition of Done
- [ ] El sistema calcula métricas de equidad (disparate impact ratio, equal opportunity difference) y precisión desagregada por grupo para al menos los atributos género, edad y región.
- [ ] El dictamen normativo cita artículos concretos de la CRBV, la Ley de Infogobierno y lineamientos CNTI, con justificación por hallazgo.
- [ ] El acta de auditoría se exporta en PDF y JSON e incluye hash verificable del modelo y del dataset.
- [ ] El historial versionado permite comparar dos auditorías de un mismo modelo sin pérdida de datos previos.
- [ ] La suite de pruebas cubre casos de sesgo evidente (por ejemplo, disparate impact ratio < 0.8) y casos de modelo equitativo, con resultados esperados verificados.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Plataforma nacional de auditoría algorítmica
## Problema
Los entes públicos (MPPCT / CNTI) adoptan modelos de IA sin evaluar si discriminan por género, edad, región o condición socioeconómica, ni si vulneran la CRBV (art. 21, 60) y la Ley de Infogobierno antes de su despliegue.

## RF / RNF
### RF
- RF-01: Carga de modelo (ONNX/joblib/pickle/API) y dataset de evaluación con atributos protegidos.
- RF-02: Cálculo de métricas de equidad por grupo (disparate impact ratio, equal opportunity difference, demographic parity).
- RF-03: Cálculo de precisión desagregada por grupo (accuracy, precision, recall, F1, matriz de confusión).
- RF-04: Verificación de cumplimiento normativo y emisión de dictamen (apto / apto con condiciones / no apto).
- RF-05: Exportación de acta de auditoría (PDF/JSON) con evidencia y recomendaciones.
- RF-06: Historial versionado de auditorías por modelo.

### RNF
- RNF-01: Seguridad/privacidad — seudonimización y cifrado, cumplimiento CRBV art. 60.
- RNF-02: Escalabilidad — evaluación concurrente y hasta 1M de registros por auditoría.
- RNF-03: Rendimiento — auditoría estándar < 5 min para 100 000 registros.
- RNF-04: Accesibilidad/usabilidad — español, WCAG 2.1 AA, dashboard comprensible.

## Historias de usuario
- Como auditora del CNTI, quiero evaluar un modelo del MPPCT en minutos, para autorizar o rechazar su despliegue con evidencia.
- Como responsable de un ente, quiero recibir dictamen y acciones correctivas, para corregir el modelo antes de producción.
- Como ciudadana, quiero consultar el acta pública, para verificar la equidad del modelo antes de que se use.

## Criterios de aceptación
- Dado un modelo con atributos protegidos, cuando se audita, entonces se generan métricas de equidad y precisión por grupo en < 5 min.
- Dado un disparate impact ratio < 0.8 en género, cuando finaliza la evaluación, entonces el dictamen es "no apto" y cita el grupo afectado.
- Dado un modelo re-auditado, cuando se compara con su versión previa, entonces se muestra el diff de métricas conservando el historial.
- Dado un acta, cuando un tercero la abre, entonces verifica hashes del modelo, dataset y catálogo normativo.

## Fuera de alcance
- Entrenamiento o reentrenamiento automático de modelos de los entes (solo se evalúa y se recomienda mitigación).
- Juicio legal definitivo: el dictamen es un soporte técnico, no sustituye la opinión jurídica del órgano competente.
- Monitoreo continuo en producción del modelo ya desplegado (fase futura).
- Evaluación de modelos de terceros no estatales o de uso exclusivamente privado.
```

## 12. Elevator Pitch
**AuditorIA** es la plataforma nacional que audita, en menos de 30 minutos y de forma automática, la equidad y el cumplimiento normativo de cualquier modelo de IA *antes* de que un ente público lo ponga en producción. Dirigida al **CNTI** (autoridad técnica) y al **MPPCT** (ente rector), detecta si el modelo discrimina por género, edad, región o condición socioeconómica y emite un **dictamen vinculante** mapeado artículo por artículo a la CRBV y a la Ley de Infogobierno. Su valor diferencial es un **sello de equidad algorítmica** trazable —con hash del modelo, del dataset y del acta— que convierte la auditoría de IA del Estado venezolano en un proceso reproducible, transparente y verificable por la contraloría social.

## 13. Impacto en el organismo público
- **Eficiencia operativa:** reduce de días a menos de 30 minutos la evaluación de equidad de un modelo nuevo (cómputo < 5 min para 100 000 registros), sin intervención manual del equipo auditor.
- **Cumplimiento normativo:** emite dictámenes automáticos (apto / apto con condiciones / no apto) con justificación artículo por artículo de la CRBV (art. 21 y 60), la Ley de Infogobierno y los lineamientos del CNTI, reduciendo la exposición a responsabilidad legal.
- **Transparencia y rendición de cuentas:** publica actas de auditoría consultables con hash verificable del modelo, del dataset y del catálogo normativo, habilitando la contraloría social sobre los modelos del Estado.
- **Confianza ciudadana:** asegura decisiones automatizadas justas y no discriminatorias en servicios públicos (screening de solicitudes, asignación de beneficios, triaje de casos), protegiendo los derechos constitucionales y la legitimidad de los entes.
- **Ahorro de recursos:** centraliza la auditoría de múltiples entes de forma concurrente y escalable (hasta 1M de registros por auditoría), evitando evaluaciones ad hoc duplicadas y no estandarizadas.

## 14. README y documentación del proyecto
El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción** clara del proyecto: *AuditorIA — Plataforma nacional de auditoría algorítmica*, que evalúa la equidad y el cumplimiento normativo de modelos de IA de entes públicos venezolanos antes de su despliegue, resolviendo el riesgo de decisiones automatizadas discriminatorias (CRBV art. 21 y 60).
- **Badges** (build, tests, licencia, cobertura).
- **Características** principales: carga de modelos (ONNX/joblib/pickle/API), métricas de equidad por grupo (disparate impact ratio, equal opportunity difference, demographic parity), precisión desagregada, dictamen normativo automático, acta exportable (PDF/JSON), historial versionado y sello de equidad algorítmica.
- **Arquitectura** (diagrama de componentes y flujo de datos): backend Python/FastAPI → motor de evaluación (Fairlearn/AIF360) → persistencia (PostgreSQL + almacenamiento de objetos con SHA-256) → frontend React → capa edge Cloudflare (Pages/Workers/R2/D1/Turnstile) para consulta pública de actas.
- **Instalación y ejecución** (prerrequisitos: Python 3.11+, Docker; pasos; variables de entorno).
- **Uso** (ejemplos, endpoints/API de auditoría y consulta de actas, capturas del dashboard).
- **Datos y datasets** (COMPAS, Adult Income, German Credit, folktables, FairFace/CelebA, datasets sintéticos propios; formato y cómo obtenerlos).
- **Pruebas** (cómo correr la suite: casos de sesgo evidente con disparate impact ratio < 0.8 y casos de modelo equitativo).
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
