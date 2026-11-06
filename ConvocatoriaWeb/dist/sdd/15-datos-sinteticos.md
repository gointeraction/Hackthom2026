# SDD — Plataforma de datos sintéticos con privacidad

> Hackathon UNETI IA 2026 · Proyecto #15 · Eje 1 · IA Ética · Complejidad: Avanzada
> Ente público: Colaboración interinstitucional

## 1. Problema
Cuando dos o más entes públicos venezolanos (ministerios, institutos de salud, registro civil, universidades, órganos electorales o de estadística) necesitan compartir datos para análisis conjunto, exponen información personal identificable (cédulas, nombres, direcciones, historiales médicos o laborales) que viola la privacidad ciudadana y la normativa de protección de datos. Esta fricción impide que se materialicen estudios de interés público (salud pública, movilidad, educación, política social) porque el miedo a la fuga de datos frena la colaboración. El proyecto importa porque resuelve el dilema entre utilidad analítica y privacidad: permitir compartir datos sin compartir a las personas.

## 2. Objetivos
- Generar datasets sintéticos que conserven al menos el 90% de la utilidad estadística del dataset real de origen (medida por correlaciones clave y distribuciones marginales), sin contener ningún registro identificable del original.
- Alcanzar una garantía verificable de privacidad con un presupuesto de privacidad diferencial ε ≤ 1.0 por consulta, documentado y reproducible.
- Reducir el riesgo de re-identificación por debajo de un umbral definido (p. ej., ≤ 0.05 de probabilidad de enlace con el registro fuente usando métricas de ataque de vinculación).
- Proveer una interfaz o pipeline que permita a personal no especializado de cada ente generar y descargar un dataset sintético en menos de 30 minutos de uso.

## 3. Requisitos funcionales (RF)
- RF-01: El sistema debe cargar datasets tabulares reales en formatos CSV/Parquet/Excel y detectar automáticamente tipos de columnas (numérica, categórica, fecha, texto libre, identificador directo).
- RF-02: El sistema debe clasificar y eliminar o enmascarar identificadores directos (cédula, nombre completo, teléfono, correo, RIF, dirección exacta) antes del modelado, manteniendo un registro de trazabilidad de esa transformación.
- RF-03: El sistema debe generar un dataset sintético mediante modelos generativos (CTGAN/TVAE u equivalentes) entrenados únicamente sobre los datos ya anonimizados, preservando la estructura de correlaciones y rangos plausibles.
- RF-04: El sistema debe aplicar privacidad diferencial durante el entrenamiento o muestreo y reportar el presupuesto ε/δ consumido en un informe adjunto a cada dataset generado.
- RF-05: El sistema debe emitir un informe de evaluación de calidad (fidelidad estadística) y un informe de riesgo de privacidad (ataques de vinculación, distancia al registro más cercano, uniqueness) por cada dataset exportado.
- RF-06: El sistema debe permitir exportar el dataset sintético junto con su metadata de gobernanza (hash del artefacto, parámetros usados, fecha, ente generador) en un empaquetado auditable.

## 4. Requisitos no funcionales (RNF)
- RNF-01: Seguridad/privacidad — Todo procesamiento debe ocurrir en el entorno controlado del ente (on-premise o edge privado); los datos reales jamás abandonan la infraestructura del dueño y solo se comparte el dataset sintético. Cifrado en reposo y en tránsito (AES-256/TLS 1.3), control de acceso basado en roles.
- RNF-02: Escalabilidad — El pipeline debe procesar tablas de hasta 5 millones de filas y 200 columnas en un servidor estándar, escalando horizontalmente con procesamiento por lotes.
- RNF-03: Rendimiento — El entrenamiento y generación para un dataset de 1 millón de filas debe completarse en menos de 2 horas en hardware CPU+GPU moderado; la generación incremental (sin reentrenar) debe responder en menos de 5 minutos.
- RNF-04: Accesibilidad/usabilidad — Interfaz en español con vocabulario claro para analistas sin formación avanzada en ML, con plantillas preconfiguradas, modo guiado paso a paso y accesibilidad WCAG 2.1 AA.

## 5. Historias de usuario
- Como analista de un ente público, quiero subir mi base de datos real y recibir una versión sintética equivalente, para poder compartirla con otro ente sin exponer datos personales de los ciudadanos.
- Como responsable de cumplimiento normativo, quiero un informe de privacidad diferencial y de riesgo de re-identificación por cada exportación, para demostrar ante auditoría que el dataset cumple la protección de datos.
- Como investigador que recibe el dataset sintético, quiero que conserve las correlaciones y distribuciones del original, para que mis modelos y análisis produzcan conclusiones válidas.

## 6. Criterios de aceptación
- Dado un dataset real con identificadores directos, cuando el sistema lo procesa, entonces el dataset sintético resultante no contiene ningún valor que coincida con un identificador directo del original (verificado por comparación exacta y por distancia de similitud).
- Dado un dataset sintético generado, cuando se evalúa su fidelidad, entonces la correlación entre las 10 variables más importantes del original y del sintético difiere en menos del 10% (coeficiente de Pearson/coincidencia de distribución).
- Dado un dataset sintético exportado, cuando se ejecuta un ataque de vinculación con el original, entonces la tasa de re-identificación es menor o igual al 5% sobre la muestra de prueba.
- Dado un lote generado con privacidad diferencial, cuando se revisa el informe adjunto, entonces el presupuesto ε reportado es ≤ 1.0 y el proceso de generación es reproducible con la misma semilla y parámetros.

## 7. Datos y fuentes sugeridas
- Datasets públicos venezolanos de referencia: microdatos del INE (Instituto Nacional de Estadística) de encuestas de hogares, censos y estadísticas vitales.
- Datos abiertos de salud pública (boletines epidemiológicos, registros de morbilidad desagregados) del MPPS, siempre anonimizados en origen.
- Datos administrativos de educación superior (matrícula, prosecución) publicados por universidades y el MPPEU/OPSU.
- Conjuntos abiertos internacionales para benchmarks de privacidad: Adult Census Income (UCI), MIMIC-III (salud, acceso controlado), y suites de ataque como las del SDMetrics y el proyecto Synthetic Data Vault (SDV).
- Normativa de referencia: Constitución venezolana (derecho a la intimidad), Ley de Infogobierno, y estándares internacionales como el RGPD y la ley modelo de protección de datos, para enmarcar los criterios de cumplimiento.

## 8. Stack tecnológico sugerido
- Lenguajes: Python 3.11+ (pipeline de datos y ML); TypeScript para la interfaz.
- Modelos y librerías: Synthetic Data Vault (SDV) con CTGAN/TVAE/CopulaGAN; PyTorch para el entrenamiento generativo; OpenDP o Google DP (differential privacy) para presupuesto ε/δ; SDMetrics para evaluar fidelidad y privacidad.
- Datos y orquestación: pandas/Polars y Apache Arrow para el manejo tabular; DuckDB para análisis local de grandes volúmenes; Prefect o Dagster para orquestar el pipeline por lotes.
- Interfaz y despliegue: React + Next.js (frontend); API con FastAPI; empaquetado en contenedores Docker.
- Plataforma Cloudflare: Workers para el portal de entrega y descarga de artefactos sintéticos, R2 para almacenamiento de datasets exportados con control de acceso, D1 para el registro de gobernanza/auditoría, Access para autenticar a los entes colaboradores, y Workers AI como opción de inferencia ligera. El entrenamiento sensible permanece on-premise del ente dueño de los datos; Cloudflare gestiona la capa de distribución segura.

## 9. Ente público y visión de despliegue
El proyecto lo adopta una instancia de coordinación interinstitucional (por ejemplo, un consejo o mesa técnica de datos del Estado que agrupa INE, ministerios sectoriales y universidades), actuando como nodo de gobernanza que define los protocolos comunes. Cada ente mantiene su propia instancia del generador en su infraestructura (modo on-premise o edge privado) y solo publica el dataset sintético a un repositorio compartido. El despliegue se implementa por fases: (1) piloto con un ente y un dataset de demostración; (2) integración de dos entes con intercambio real de datos sintéticos; (3) portal federado con autenticación, catálogo de datasets y auditoría continua. La sostenibilidad se apoya en una gobernanza clara, acuerdos de intercambio y capacitación del personal analista.

## 10. Definition of Done
- [ ] El pipeline anonimiza, entrena, genera y evalúa un dataset sintético de extremo a extremo sin intervención manual.
- [ ] Cada exportación incluye informe de privacidad (ε/δ) y de fidelidad estadística generado automáticamente.
- [ ] Una prueba de re-identificación automatizada demuestra tasa ≤ 5% sobre el dataset de validación.
- [ ] Existe documentación de uso en español y una demo reproducible con un dataset público de ejemplo.
- [ ] El código pasa revisión de seguridad (sin fuga de datos reales a logs, cachés o almacenamiento externo) y está versionado con licencia definida.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Plataforma de datos sintéticos con privacidad
## Problema
Compartir datos entre entes públicos expone información personal identificable, bloqueando la colaboración interinstitucional en análisis de interés público.

## RF / RNF
- RF-01: Cargar tablas CSV/Parquet/Excel y detectar tipos de columnas.
- RF-02: Detectar y eliminar/enmascarar identificadores directos con trazabilidad.
- RF-03: Generar dataset sintético con CTGAN/TVAE preservando correlaciones.
- RF-04: Aplicar privacidad diferencial y reportar ε/δ por exportación.
- RF-05: Emitir informes de fidelidad estadística y de riesgo de re-identificación.
- RF-06: Exportar dataset sintético con metadata de gobernanza auditable.
- RNF-01: Seguridad/privacidad — datos reales nunca salen del ente dueño; cifrado y control de acceso.
- RNF-02: Escalabilidad — hasta 5M filas y 200 columnas.
- RNF-03: Rendimiento — < 2 h para 1M filas; generación incremental < 5 min.
- RNF-04: Accesibilidad/usabilidad — interfaz en español, modo guiado, WCAG 2.1 AA.

## Historias de usuario
- Como analista de un ente, quiero generar una versión sintética de mi base real, para compartirla sin exponer datos personales.
- Como responsable de cumplimiento, quiero un informe de privacidad por exportación, para demostrar conformidad ante auditoría.
- Como investigador receptor, quiero que el dataset conserve las correlaciones, para que mis análisis sean válidos.

## Criterios de aceptación
- Dado un dataset con identificadores directos, cuando se procesa, entonces el sintético no contiene valores identificadores coincidentes.
- Dado un dataset sintético, cuando se evalúa fidelidad, entonces las 10 correlaciones clave difieren < 10% del original.
- Dado un ataque de vinculación, cuando se ejecuta contra el original, entonces la re-identificación es ≤ 5%.
- Dado un lote con privacidad diferencial, cuando se revisa el informe, entonces ε ≤ 1.0 y el proceso es reproducible.

## Fuera de alcance
- Intercambio de datos reales identificables entre entes (queda prohibido por diseño).
- Firma electrónica o interoperabilidad con sistemas de identidad nacional (SAIME) en esta fase.
- Predicción de individuos o decisiones automatizadas sobre personas concretas a partir del dataset sintético.
- Garantía legal de cumplimiento: el sistema aporta evidencia técnica, pero no sustituye la asesoría jurídica de cada ente.
```

## 12. Elevator Pitch
Cuando dos o más entes públicos venezolanos quieren analizar datos en conjunto, hoy deben elegir entre exponer datos personales de los ciudadanos (cédulas, nombres, historiales) o renunciar a colaborar. Nuestra plataforma genera datasets sintéticos que conservan al menos el 90% de la utilidad estadística del original sin contener ningún registro identificable, aplicando privacidad diferencial (ε ≤ 1.0) y emitiendo un informe auditable de fidelidad y riesgo de re-identificación. Está dirigida a la instancia de coordinación interinstitucional —la mesa técnica de datos del Estado que agrupa INE, ministerios sectoriales y universidades—, que define los protocolos y permite que cada ente publique solo el dataset sintético a un repositorio compartido. El valor diferencial: compartir datos sin compartir a las personas, en menos de 30 minutos de uso.

## 13. Impacto en el organismo público
- **Eficiencia operativa:** personal analista no especializado puede generar y descargar un dataset sintético en menos de 30 minutos, acelerando estudios conjuntos de salud, movilidad, educación y política social.
- **Transparencia y trazabilidad:** cada exportación incluye metadata de gobernanza auditable (hash del artefacto, parámetros, fecha y ente generador) junto con el informe de presupuesto ε/δ, facilitando la rendición de cuentas ante auditoría.
- **Confianza ciudadana:** al eliminar y enmascarar identificadores directos y garantizar que los datos reales jamás abandonan la infraestructura del ente dueño, se protege la intimidad de los ciudadanos y se refuerza la legitimidad del uso de datos públicos.
- **Ahorro de recursos:** el pipeline procesa tablas de hasta 5 millones de filas y 200 columnas en un servidor estándar, y la generación incremental responde en menos de 5 minutos sin reentrenar, evitando costos de infraestructura centralizada.
- **Cumplimiento normativo:** aporta evidencia técnica de privacidad diferencial y reducción del riesgo de re-identificación (≤ 5%), alineada con la Constitución venezolana, la Ley de Infogobierno y estándares internacionales como el RGPD.

## 14. README y documentación del proyecto
El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción** clara del proyecto (qué hace y qué problema resuelve): *Plataforma de datos sintéticos con privacidad* — genera datasets sintéticos que preservan la utilidad estadística del original sin contener registros identificables, resolviendo el dilema entre utilidad analítica y privacidad en el intercambio de datos entre entes públicos.
- **Badges** (build, tests, licencia, cobertura).
- **Características** principales (lista de funcionalidades): carga de CSV/Parquet/Excel con detección de tipos, anonimización de identificadores directos con trazabilidad, generación con CTGAN/TVAE, privacidad diferencial con informe ε/δ, informes de fidelidad y riesgo de re-identificación, y exportación con metadata de gobernanza auditable.
- **Arquitectura** (diagrama de componentes y flujo de datos): frontend (React + Next.js) → API (FastAPI) → pipeline de datos (pandas/Polars, DuckDB) → modelos generativos (SDV: CTGAN/TVAE, PyTorch) y privacidad diferencial (OpenDP/Google DP) → evaluación (SDMetrics) → distribución segura (Cloudflare Workers, R2, D1, Access). El entrenamiento sensible permanece on-premise del ente dueño de los datos.
- **Instalación y ejecución** (prerrequisitos, pasos, variables de entorno).
- **Uso** (ejemplos, endpoints/API, capturas).
- **Datos y datasets** (fuentes, formato, cómo obtenerlos): microdatos del INE, datos abiertos de salud pública (MPPS), datos administrativos de educación superior (MPPEU/OPSU) y benchmarks como Adult Census Income (UCI) y MIMIC-III.
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
