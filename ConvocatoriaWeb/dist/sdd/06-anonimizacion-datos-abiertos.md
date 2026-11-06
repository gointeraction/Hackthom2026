# SDD — Anonimización de datos para datos abiertos del Estado

> Hackathon UNETI IA 2026 · Proyecto #6 · Eje 1 · IA Ética · Complejidad: Media
> Ente público: INE / portales de datos abiertos

## 1. Problema

El INE y los portales de datos abiertos del Estado venezolano acumulan documentos y datasets (censos, registros administrativos, padrones) que contienen datos personales —cédulas (V/E), nombres y apellidos, teléfonos, RIF y direcciones— y hoy publicarlos sin filtrar esos campos violaría la privacidad ciudadana. Esto frena la transparencia: el ente prefiere no publicar antes que arriesgar una filtración de PII, y la revisión manual es lenta, costosa y no escala a millones de registros.

## 2. Objetivos

- Reducir a menos del 0,1 % la fuga de datos personales en los datasets anonimizados entregados a publicación.
- Alcanzar una recuperación (recall) ≥ 98 % en cédulas, nombres y teléfonos venezolanos sobre un corpus anotado de prueba.
- Procesar un lote de 100 000 registros en menos de 15 minutos con un costo de inferencia controlado.
- Generar una bitácora de auditoría inmutable que registre qué campos se redactaron, con qué técnica y qué hash de documento, verificable por el ente.

## 3. Requisitos funcionales (RF)

- RF-01: Detectar y redactar cédulas de identidad venezolanas en formatos `V-12345678`, `E-12345678`, `V 12.345.678` y variantes con/sin separadores, tanto en texto libre como en columnas estructuradas (CSV/JSON).
- RF-02: Detectar y redactar nombres y apellidos completos, teléfonos venezolanos (`+58 412…`, `0412…`, `0212…`), correos electrónicos, RIF (`J-`, `G-`, `V-`, `E-`) y direcciones postales.
- RF-03: Aplicar redacción por sustitución (`[CÉDULA]`, `[NOMBRE]`, `[TELÉFONO]`) o por seudonimización con valores sintéticos consistentes (la misma cédula siempre se reemplaza por el mismo token), según configuración del usuario.
- RF-04: Procesar por lotes archivos CSV, JSON, JSONL, DOCX y PDF escaneado (con OCR previo), conservando la estructura y las columnas no sensibles intactas.
- RF-05: Emitir un reporte por lote con: total de ocurrencias redactadas por tipo de PII, tiempo de procesamiento, nivel de confianza promedio y resumen de auditoría exportable.
- RF-06: Exponer una API (REST) y un panel web mínimo para cargar archivos, elegir reglas de redacción y descargar el resultado anonimizado.

## 4. Requisitos no funcionales (RNF)

- RNF-01: Seguridad/privacidad — los archivos originales y los logs nunca exponen los valores reales de PII; las claves de API y credenciales se manejan como secretos de entorno; el procesamiento debe poder ejecutarse en infraestructura local del ente (sin salida de datos a terceros).
- RNF-02: Escalabilidad — el pipeline debe escalar horizontalmente: procesamiento por colas (jobs independientes por archivo/lote) para absorber picos sin bloquear la publicación.
- RNF-03: Rendimiento — latencia menor a 2 segundos por documento corto en la API; procesamiento por lotes con paralelización y límite de memoria configurable.
- RNF-04: Accesibilidad/usabilidad — interfaz en español, operable por personal no técnico del ente, con mensajes de error claros, vista previa del antes/después y documentación de uso en una página.

## 5. Historias de usuario

- Como analista de datos del INE, quiero subir un CSV con microdatos censales y que el sistema redacte automáticamente cédulas y nombres, para poder publicar el dataset sin exponer a los ciudadanos.
- Como responsable de transparencia, quiero un reporte de auditoría por lote con los campos redactados y su justificación, para demostrar ante el órgano rector que se cumplió la protección de datos.
- Como ciudadano, quiero que los documentos públicos que contienen mis datos personales sean anonimizados antes de publicarse, para ejercer mi derecho al habeas data sin renunciar a la transparencia.

## 6. Criterios de aceptación

- Dado un CSV de 10 000 registros con 500 cédulas y 500 teléfonos reales anotados, cuando se ejecuta el pipeline, entonces el recall de cédulas y teléfonos es ≥ 98 % y la fuga de PII es < 0,1 %.
- Dado un documento DOCX con nombres y RIF, cuando se procesa con la regla de seudonimización, entonces el mismo identificador se reemplaza por el mismo token en todo el documento (consistencia) y el resto del texto permanece íntegro.
- Dado un PDF escaneado con cédulas en imagen, cuando se aplica OCR y detección, entonces las cédulas detectadas se redactan y el reporte indica el nivel de confianza de cada detección OCR.
- Dado un lote procesado, cuando se consulta la bitácora, entonces se puede reconstruir qué documento, qué campo, qué técnica y qué hash se generó, sin almacenar el valor original de PII.

## 7. Datos y fuentes sugeridas

- **Catálogo Nacional de Datos Abiertos de Venezuela** (`data.gob.ve`): datasets reales del Estado para estudiar formatos y columnas sensibles.
- **INE** (`ine.gob.ve`): microdatos de censos, encuestas de hogares y estadísticas demográficas (estructura real de registros administrativos).
- **CNE — Registro Electoral** (`cne.gob.ve`): referencia del formato estándar de cédula venezolana y datos nominales.
- **Microsoft Presidio** (reconocedores y patrones base) y **spaCy `es_core_news_lg`**: modelo de NER en español para nombres, organizaciones y ubicaciones.
- **Faker** (`es_ES` / `es_VE`): generación de datos sintéticos de prueba con cédulas, RIF y teléfonos venezolanos plausibles.
- **Corpus anotado propio**: 2 000–5 000 ejemplos etiquetados a mano (cédula/nombre/teléfono/RIF/dirección) para evaluar recall/precisión; puede complementarse con datasets públicos de PII anotados (p. ej. de Kaggle) y plantillas de formularios del Estado.

## 8. Stack tecnológico sugerido

- **Lenguajes**: Python 3.11+ (detección y redacción) y TypeScript (API edge y panel web).
- **Detección de PII**: Microsoft Presidio (`presidio-analyzer` + `presidio-anonymizer`) con reconocedores personalizados por regex para cédula (`V|E[ -]?\d{1,2}\.?\d{3}\.?\d{3}`), RIF (`[JGVEC]-?\d{6,9}`) y teléfono (`(\+58|0)(412|414|416|424|212|…)`).
- **NER contextual**: spaCy (`es_core_news_lg`) para nombres propios en texto libre, combinado con Presidio.
- **API y colas**: FastAPI + Celery/Redis para procesamiento local por lotes; en la nube, **Cloudflare Queues** para jobs asíncronos por archivo.
- **Servicios Cloudflare**: **Workers** (API de redacción y OCR ligero), **R2** (almacenamiento de archivos crudos y anonimizados con URLs firmadas), **D1** (bitácora de auditoría y metadatos de lotes), **Workers AI** (modelos LLM para NER contextual y validación de detecciones dudosas) y **Turnstile** (protección del panel de subida).
- **OCR**: Tesseract (`spa` o `por`+`eng`) o una alternativa basada en Workers AI para PDF escaneado.
- **Evaluación**: `presidio-evaluator`, sklearn (precision/recall/F1 por tipo de PII) y pytest con fuzzing (`hypothesis`) de formatos de cédula.
- **Empaquetado y CI/CD**: Docker + Docker Compose, GitHub Actions o GitLab CI con un job de verificación de fuga de PII en cada merge.

## 9. Ente público y visión de despliegue

El adoptante natural es el **INE** en coordinación con la plataforma nacional de datos abiertos, que usaría el pipeline como paso obligatorio antes de publicar cualquier conjunto de datos con contenido personal. Se despliega en dos modalidades: (1) **on-premise** dentro de la infraestructura del ente (Docker en servidores locales) para datos sensibles que no deben salir, y (2) **nube soberana/edge** con Cloudflare Workers, R2 y Queues para portales de transparencia de menor sensibilidad. La publicación real la ejecuta el equipo de datos del ente tras revisar el reporte de auditoría; el sistema emite evidencia verificable (hash y bitácora) que el ente puede presentar ante el órgano rector de protección de datos, alineado con la Constitución (arts. 28 y 60) y la Ley de Infogobierno.

## 10. Definition of Done

- [ ] Los reconocedores de cédula, RIF, teléfono, nombre y correo pasan el test de recall ≥ 98 % y fuga < 0,1 % sobre el corpus anotado.
- [ ] El pipeline procesa CSV, JSON, JSONL, DOCX y PDF escaneado con reporte de auditoría por lote, sin almacenar valores originales de PII.
- [ ] La API y el panel web permiten subir, configurar reglas, previsualizar antes/después y descargar el resultado anonimizado.
- [ ] La bitácora D1 registra documento, campo, técnica y hash de forma verificable; la suite de pruebas y el job de CI de fuga de PII están en verde.
- [ ] La documentación en español (uso, despliegue local y en Cloudflare, límites y mitigaciones de riesgo ético) está escrita y versionada en el repositorio.

## 11. Plantilla SPEC.md (lista para copiar)

```markdown
# SPEC — Anonimización de datos para datos abiertos del Estado

## Problema
El INE y los portales de datos abiertos no publican datasets con cédulas, nombres y teléfonos por riesgo de fuga de datos personales; la redacción manual no escala.

## RF / RNF
- RF-01: Detectar y redactar cédulas (V/E), RIF, nombres, teléfonos, correos y direcciones en texto libre y columnas estructuradas.
- RF-02: Redacción por sustitución (`[CÉDULA]`) o seudonimización consistente (mismo valor → mismo token).
- RF-03: Procesar por lotes CSV, JSON, JSONL, DOCX y PDF escaneado (con OCR).
- RF-04: Emitir reporte y bitácora de auditoría por lote sin almacenar el valor original de PII.
- RF-05: API REST y panel web en español para cargar, configurar y descargar resultados.
- RNF-01 (Seguridad/privacidad): procesamiento local del ente, secretos como variables de entorno, sin exponer PII en logs.
- RNF-02 (Escalabilidad): procesamiento por colas independientes por archivo/lote.
- RNF-03 (Rendimiento): latencia < 2 s por documento corto; 100 000 registros en < 15 min.
- RNF-04 (Accesibilidad/usabilidad): interfaz operable por personal no técnico, en español.

## Historias de usuario
- Como analista del INE, quiero redactar automáticamente cédulas y nombres de un CSV, para publicarlo sin exponer a ciudadanos.
- Como responsable de transparencia, quiero un reporte de auditoría por lote, para demostrar cumplimiento de protección de datos.
- Como ciudadano, quiero que mis datos sean anonimizados antes de publicar documentos, para ejercer el habeas data sin perder transparencia.

## Criterios de aceptación
- Dado un CSV anotado, cuando se procesa, entonces recall ≥ 98 % y fuga < 0,1 %.
- Dado un DOCX con RIF, cuando se seudonimiza, entonces el mismo identificador mantiene el mismo token en todo el documento.
- Dado un PDF escaneado, cuando se aplica OCR, entonces las cédulas se redactan y el reporte muestra la confianza de cada detección.
- Dado un lote procesado, cuando se consulta la bitácora, entonces se reconstruye documento, campo, técnica y hash sin el valor original.

## Fuera de alcance
- Reidentificación inversa de tokens o diseño de esquemas de privacidad diferencial avanzados.
- Publicación automática directa a data.gob.ve (la publicación la ejecuta y aprueba el ente).
- Firma electrónica, validez legal de documentos o gestión de consentimientos.
- Anonimización de audio, video o datos biométricos (solo texto y documentos).
```

## 12. Elevator Pitch

El **INE** no puede publicar buena parte de sus datasets porque contienen cédulas, nombres, teléfonos y RIF, y filtrarlos violaría la privacidad ciudadana. Nuestro pipeline **anonimiza automáticamente** esos datos en CSV, JSON, DOCX y PDF escaneado, con una fuga de PII menor al 0,1 % y una detección de cédulas, nombres y teléfonos venezolanos superior al 98 %. Procesa 100 000 registros en menos de 15 minutos y emite una **bitácora de auditoría verificable** (hash por documento) que el ente puede presentar ante el órgano rector de protección de datos. Todo corre en la infraestructura local del ente, sin que los datos salgan a terceros: más transparencia, menos riesgo.

## 13. Impacto en el organismo público

- **Eficiencia**: reemplaza la revisión manual de millones de registros por un pipeline automático que procesa 100 000 registros en menos de 15 minutos, liberando horas del equipo de datos del INE.
- **Transparencia**: al eliminar el riesgo de fuga de PII, habilita la publicación de datasets (censos, registros administrativos, padrones) que hoy quedan retenidos por precaución.
- **Confianza ciudadana**: protege el derecho al habeas data anonimizando cédulas, nombres, teléfonos y RIF antes de publicar, sin renunciar a la apertura de datos.
- **Ahorro de recursos**: reduce el costo de revisión manual y de corrección de filtraciones, y evita incidentes reputacionales y legales asociados a la exposición de datos personales.
- **Cumplimiento normativo**: emite evidencia verificable (hash y bitácora de auditoría por documento/campo/técnica) alineada con la Constitución (arts. 28 y 60) y la Ley de Infogobierno, demostrable ante el órgano rector.

## 14. README y documentación del proyecto

El repositorio debe incluir, como mínimo:

### README.md (raíz)

- **Título y descripción**: "Anonimización de datos para datos abiertos del Estado" — pipeline que detecta y redacta automáticamente PII (cédulas V/E, RIF, nombres, teléfonos, correos, direcciones) en datasets y documentos, para que el INE y los portales de datos abiertos publiquen sin exponer datos personales.
- **Badges**: build, tests, cobertura y licencia.
- **Características**: detección de cédula/RIF/teléfono/nombre/correo/dirección; redacción por sustitución (`[CÉDULA]`) o seudonimización consistente; soporte CSV/JSON/JSONL/DOCX/PDF escaneado (OCR); API REST y panel web en español; reporte y bitácora de auditoría por lote.
- **Arquitectura**: diagrama de componentes y flujo de datos (carga → OCR/NER → detección → redacción → auditoría → descarga), incluyendo FastAPI + Celery/Redis, Workers/R2/D1/Workers AI en la nube, y Tesseract para OCR.
- **Instalación y ejecución**: prerrequisitos (Python 3.11+, Docker), pasos de instalación, variables de entorno (claves API, secretos) y arranque local con Docker Compose.
- **Uso**: ejemplos de subida de archivos, endpoints de la API REST y capturas del panel.
- **Datos y datasets**: fuentes (data.gob.ve, INE, CNE), formato de los datos y cómo obtenerlos; datos sintéticos de prueba con Faker.
- **Pruebas**: cómo ejecutar la suite (pytest, presidio-evaluator, fuzzing con hypothesis) y el job de CI de verificación de fuga de PII.
- **Contribución**: guía para colaborar (ramas, issues, convención de commits).
- **Licencia** y créditos.

### Carpeta docs/

- `SPEC.md` (especificación).
- `SDD.md` (este documento).
- `architecture.md` (diagramas y decisiones de diseño).
- `user-guide.md` (manual de usuario).

### Otros archivos

- `LICENSE`, `.gitignore`, `.env.example`, `requirements.txt` o `pyproject.toml`, `Dockerfile` y `docker-compose.yml`.

## 15. Preparación de la presentación en Google NotebookLM

Para preparar la defensa del proyecto con NotebookLM:

1. **Reúne los insumos** del proyecto: este SDD, el SPEC, el README, el código fuente (o fragmentos clave), la descripción del dataset y las capturas/demo.
2. **Crea un notebook** en NotebookLM y **sube** esos insumos como fuentes.
3. **Genera la "Guía de estudio"** para estructurar el pitch (problema → solución → impacto → demo).
4. **Genera el "Resumen de audio" (Audio Overview)** para practicar el pitch hablado y afinar el guion.
5. **Haz preguntas al notebook** para ensayar la defensa ante el jurado (ej.: "¿cuál es mi mayor riesgo técnico?", "¿cómo explico el impacto en 30 segundos?").
6. **Genera un "Briefing"** alineado a la rúbrica: viabilidad, impacto, innovación/IA, pitch, ética y escalabilidad.
