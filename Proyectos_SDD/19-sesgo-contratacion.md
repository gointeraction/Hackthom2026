# SDD — Detector de sesgo en contratación pública

> Hackathon UNETI IA 2026 · Proyecto #19 · Eje 1 · IA Ética · Complejidad: Media
> Ente público: Talento humano / compras públicas
> **Nombre sugerido del sistema:** *Monitor de Equidad en Selección y Contratación Pública (MESCP)*

## 1. Problema
Los procesos de selección de personal y de compras/contrataciones públicas en Venezuela pueden incorporar criterios de evaluación sesgados (por género, edad, región, discapacidad o afinidad), lo que produce disparidades injustas en quién es contratado o adjudicado. Esto afecta a postulantes a cargos públicos, a empresas y proveedores que participan en licitaciones, y a la ciudadanía que recibe los servicios. Importa porque la inequidad no detectada erosiona la confianza institucional, puede derivar en responsabilidad administrativa y perpetúa exclusiones estructurales.

## 2. Objetivos
- Detectar disparidades en las tasas de selección y adjudicación por grupo (género, edad, región, condición de discapacidad) con una exactitud mínima del 85% sobre conjuntos de datos anonimizados.
- Medir el impacto adverso con la regla de las 4/5 (80%) y métricas de paridad demográfica para cada convocatoria, lote de licitación o concurso.
- Reducir en al menos 20% la cantidad de criterios con disparidad estadísticamente significativa tras la corrección sugerida en un piloto de 6 meses.
- Entregar un tablero de auditoría y reportes exportables que permitan a contraloría y a talento humano sustentar decisiones con evidencia trazable.

## 3. Requisitos funcionales (RF)
- RF-01: El sistema debe permitir cargar lotes de datos de convocatorias y resultados (postulantes, puntajes por criterio, adjudicaciones) en formatos CSV, XLSX o mediante API.
- RF-02: Debe calcular indicadores de equidad por grupo protegido: ratio de selección, paridad demográfica, brecha salarial y regla de las 4/5, para cada convocatoria o proceso.
- RF-03: Debe detectar correlaciones entre criterios de evaluación y resultados dispares, y marcar los criterios con mayor contribución al sesgo observado.
- RF-04: Debe emitir alertas automáticas cuando un criterio o proceso supera umbrales de disparidad configurables (por ejemplo, ratio inferior al 80% del grupo de referencia).
- RF-05: Debe clasificar la dimensión del sesgo (género, edad, región, discapacidad) y generar una explicación comprensible (lenguaje natural) del hallazgo para personal no técnico.
- RF-06: Debe exportar evidencia auditable (informe PDF/CSV, registro de datos utilizados, versión del modelo y umbrales aplicados) con trazabilidad completa.

## 4. Requisitos no funcionales (RNF)
- RNF-01: **Seguridad/privacidad** — los datos personales deben anonimizarse o seudonimizarse antes del análisis, cumpliendo la Ley de Infogobierno y el marco venezolano de protección de datos personales; el acceso debe estar restringido por roles (talento humano, contraloría, auditor).
- RNF-02: **Escalabilidad** — el sistema debe soportar el procesamiento concurrente de múltiples entes públicos y regiones, con crecimiento horizontal en la capa de despliegue (Cloudflare Workers/D1).
- RNF-03: **Rendimiento** — el análisis de un lote de hasta 50.000 registros debe completarse en menos de 5 minutos y el tablero debe responder en menos de 2 segundos por consulta.
- RNF-04: **Accesibilidad/usabilidad** — la interfaz debe ser usable por funcionarios sin formación técnica, con lenguaje claro en español, y cumplir lineamientos WCAG 2.1 AA (contraste, lectores de pantalla, navegación por teclado).

## 5. Historias de usuario
- Como analista de talento humano, quiero visualizar en un tablero las disparidades de selección por género y edad, para corregir criterios sesgados antes de publicar una convocatoria.
- Como auditor de la Contraloría, quiero exportar un informe con trazabilidad de datos y del modelo aplicado, para sustentar hallazgos en un informe de fiscalización.
- Como empresa o proveedor participante en una licitación, quiero verificar que los criterios de adjudicación fueron evaluados de forma equitativa, para confiar en la legalidad y transparencia del proceso.

## 6. Criterios de aceptación
- Dado un lote de 500 postulaciones anonimizadas, cuando el sistema calcula el ratio de selección por grupo, entonces identifica los grupos cuyo ratio es inferior al 80% del grupo de referencia (regla de las 4/5) y los resalta en el tablero.
- Dado un criterio de evaluación con disparidad estadísticamente significativa, cuando supera el umbral configurado, entonces el sistema genera una alerta con la dimensión del sesgo y una explicación en lenguaje natural.
- Dado un reporte de auditoría, cuando el usuario lo exporta, entonces el archivo incluye el origen de los datos, la versión del modelo, los umbrales usados y el hash de integridad de los registros.
- Dado el acceso de un funcionario sin rol de auditoría, cuando inicia sesión, entonces solo visualiza datos anonimizados y no puede exportar información personal identificable.

## 7. Datos y fuentes sugeridas
- **Datos Abiertos Venezuela** (datos.gob.ve): catálogos de contrataciones, presupuesto y organismos públicos.
- **Servicio Nacional de Contrataciones / Oficina Nacional de Contrataciones** (registros de licitaciones, proveedores y adjudicaciones en el marco de la Ley de Contrataciones Públicas).
- **INE — Instituto Nacional de Estadística**: distribución demográfica por género, edad y región para construir grupos de referencia y detectar sobrerrepresentación/subrepresentación.
- **MPPPST / ente rector del trabajo** y **ONAPRE**: normativa y datos de nómina y selección del sector público.
- **CONAPDIS (Consejo Nacional para las Personas con Discapacidad)**: cuotas y criterios de inclusión laboral de personas con discapacidad.
- **Contraloría General de la República**: informes de auditoría y criterios de fiscalización aplicables.

## 8. Stack tecnológico sugerido
- **Lenguaje y análisis:** Python 3.12 con pandas, scikit-learn, y bibliotecas de equidad como `fairlearn` y `aif360` para métricas de paridad e impacto adverso.
- **Backend:** FastAPI (API REST) con validación Pydantic; tareas asíncronas con Colas de Cloudflare para reprocesos y alertas.
- **Frontend:** React + Next.js con gráficos (Recharts/D3) desplegados en **Cloudflare Pages**.
- **Persistencia:** PostgreSQL local para desarrollo; **Cloudflare D1** para datos operativos y **R2** para almacenamiento de reportes y lotes históricos.
- **IA/NLP:** **Cloudflare Workers AI** (modelos de texto) para la explicación en lenguaje natural de hallazgos y el análisis de pliegos/licitaciones; **Cloudflare Vectorize** para indexar criterios históricos y detectar similitudes.
- **Cumplimiento y auditoría:** registro inmutable de decisiones con hashes de integridad y exportación firmada (sello de tiempo) para contraloría.

## 9. Ente público y visión de despliegue
El sistema sería adoptado por el **ente rector de talento humano del sector público** (ministerio con competencia en trabajo/función pública) en conjunto con la **Oficina Nacional de Contrataciones Públicas** y la **Contraloría General de la República**. La visión es desplegar un piloto en 2–3 instituciones durante 6 meses, conectado a sus registros de selección y contratación ya anonimizados, para luego exponer un panel nacional que permita a cada organismo auditar la equidad de sus propios procesos y publicar indicadores de transparencia a la ciudadanía.

## 10. Definition of Done
- [ ] El módulo de métricas valida la regla de las 4/5 y la paridad demográfica sobre un conjunto de prueba etiquetado con una exactitud ≥ 85%.
- [ ] Las alertas de disparidad se generan automáticamente y se documentan los umbrales y la dimensión de sesgo de cada una.
- [ ] La exportación de reportes incluye trazabilidad de datos, versión del modelo y hash de integridad verificable.
- [ ] El sistema está desplegado en Cloudflare con datos anonimizados y control de acceso por roles.
- [ ] Existe una guía de uso en español para funcionarios no técnicos y cobertura de pruebas unitarias ≥ 80%.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Detector de sesgo en contratación pública

## Problema
Los procesos de selección y contratación pública en Venezuela pueden
incorporar criterios sesgados (género, edad, región, discapacidad) que
generan disparidades injustas y erosionan la confianza ciudadana.

## RF / RNF
### RF
- RF-01: Cargar lotes de postulaciones y adjudicaciones (CSV/XLSX/API).
- RF-02: Calcular indicadores de equidad (regla 4/5, paridad demográfica).
- RF-03: Detectar criterios correlacionados con resultados dispares.
- RF-04: Emitir alertas al superar umbrales de disparidad.
- RF-05: Clasificar la dimensión del sesgo y explicarla en lenguaje natural.
- RF-06: Exportar evidencia auditable con trazabilidad.

### RNF
- RNF-01: Anonimización de datos personales y acceso por roles.
- RNF-02: Escalabilidad horizontal (Cloudflare Workers/D1).
- RNF-03: Análisis de 50.000 registros en < 5 minutos.
- RNF-04: Usabilidad para funcionarios no técnicos y WCAG 2.1 AA.

## Historias de usuario
- Como analista de talento humano, quiero ver disparidades por género/edad,
  para corregir criterios antes de publicar la convocatoria.
- Como auditor de la Contraloría, quiero exportar evidencia trazable,
  para sustentar informes de fiscalización.
- Como proveedor licitante, quiero verificar que la evaluación fue equitativa,
  para confiar en la transparencia del proceso.

## Criterios de aceptación
- Dado un lote de 500 postulaciones, cuando se calcula el ratio por grupo,
  entonces se resaltan grupos con ratio < 80% del grupo de referencia.
- Dado un criterio con disparidad significativa, cuando supera el umbral,
  entonces se genera una alerta con dimensión del sesgo y explicación.
- Dado un reporte exportado, cuando el usuario lo descarga, entonces incluye
  origen de datos, versión del modelo, umbrales y hash de integridad.

## Fuera de alcance
- No reemplaza la decisión humana de selección o adjudicación; solo audita.
- No determina responsabilidad legal ni emite sanciones automáticas.
- No procesa datos personales sin anonimizar ni comparte información entre entes.
```

## 12. Elevator Pitch
El **Monitor de Equidad en Selección y Contratación Pública (MESCP)** detecta, de forma automática y con evidencia trazable, criterios de evaluación sesgados por género, edad, región o discapacidad en los procesos de selección de personal y de contratación pública. Está pensado para el **ente rector de talento humano del sector público**, la **Oficina Nacional de Contrataciones Públicas** y la **Contraloría General de la República**, para que auditen la equidad de sus propias convocatorias y licitaciones. Su valor diferencial es convertir la inequidad no detectada en indicadores medibles (regla de las 4/5 y paridad demográfica) con alertas y explicaciones en lenguaje natural, sin reemplazar la decisión humana ni exponer datos personales.

## 13. Impacto en el organismo público
- **Eficiencia:** automatiza el cálculo de métricas de equidad y la detección de criterios dispares, reduciendo el tiempo de análisis por convocatoria o lote de licitación y liberando a los analistas de revisión manual.
- **Transparencia:** expone un tablero de auditoría con indicadores por proceso y reportes exportables, permitiendo sustentar decisiones con evidencia trazable (origen de datos, versión del modelo y umbrales aplicados).
- **Confianza ciudadana:** al publicar indicadores de equidad y permitir a proveedores verificar que la evaluación fue justa, fortalece la credibilidad institucional frente a postulantes, empresas y ciudadanía.
- **Ahorro de recursos:** previene reprocesos, impugnaciones y posibles hallazgos de fiscalización al corregir criterios sesgados antes de publicar la convocatoria, con una meta de reducción del 20% de criterios con disparidad significativa en un piloto de 6 meses.
- **Cumplimiento normativo:** apoya la alineación con la Ley de Infogobierno, el marco venezolano de protección de datos personales y la Ley de Contrataciones Públicas, mediante anonimización de datos y control de acceso por roles (talento humano, contraloría, auditor).

## 14. README y documentación del proyecto
El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción:** *Monitor de Equidad en Selección y Contratación Pública (MESCP)* — sistema que detecta sesgos en procesos de selección de personal y contratación pública en Venezuela y entrega evidencia auditable de equidad.
- **Badges:** estado del build, ejecución de pruebas, cobertura y licencia.
- **Características:** carga de lotes (CSV/XLSX/API), cálculo de indicadores de equidad (regla 4/5, paridad demográfica, brecha salarial), detección de criterios correlacionados con resultados dispares, alertas por umbrales configurables, clasificación y explicación en lenguaje natural, exportación de informes auditables.
- **Arquitectura:** diagrama de componentes (frontend Next.js/React en Cloudflare Pages → API FastAPI → análisis Python/pandas/fairlearn/aif360 → persistencia PostgreSQL/D1 y R2 → IA/NLP con Cloudflare Workers AI y Vectorize) y flujo de datos desde la ingesta anonimizada hasta el tablero y la exportación de reportes.
- **Instalación y ejecución:** prerrequisitos (Python 3.12, Node.js, PostgreSQL local, cuenta Cloudflare), pasos de configuración, variables de entorno (conexión a base de datos, credenciales de Cloudflare, umbrales de disparidad) y comandos de arranque.
- **Uso:** ejemplos de carga de un lote de postulaciones, consulta de indicadores por proceso, endpoints/API REST, y capturas del tablero.
- **Datos y datasets:** fuentes sugeridas (Datos Abiertos Venezuela, Servicio/Oficina Nacional de Contrataciones, INE, MPPPST/ONAPRE, CONAPDIS, Contraloría General de la República), formato esperado de los lotes y cómo obtenerlos y anonimizarlos antes del análisis.
- **Pruebas:** instrucciones para ejecutar pruebas unitarias (cobertura ≥ 80%) y validación de métricas sobre un conjunto etiquetado (exactitud ≥ 85%).
- **Contribución:** guía para colaborar (flujo de trabajo, estándares de código, apertura de issues y pull requests).
- **Licencia y créditos:** licencia del proyecto y reconocimiento a las fuentes de datos y al Hackathon UNETI IA 2026.

### Carpeta docs/
- `SPEC.md` (especificación).
- `SDD.md` (este documento).
- `architecture.md` (diagramas y decisiones de diseño).
- `user-guide.md` (manual de usuario en español para funcionarios no técnicos).

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
