# SDD — Detector de deepfakes para comunicados oficiales

> Hackathon UNETI IA 2026 · Proyecto #16 · Eje 1 · IA Ética · Complejidad: Avanzada
> Ente público: Comunicación del Estado

## 1. Problema
La difusión de audios y videos falsos (deepfakes) que suplantan a autoridades del Estado puede desestabilizar la confianza ciudadana y generar desinformación en momentos críticos. Este problema afecta directamente a la ciudadanía venezolana, a los voceros institucionales y a los canales oficiales de comunicación, y es urgente porque un material falso bien elaborado puede propagarse en minutos y causar daño reputacional e institucional antes de ser desmentido.

## 2. Objetivos
- Verificar la autenticidad de audios y videos institucionales con una precisión de al menos 90% (F1-score) sobre un corpus de prueba etiquetado.
- Emitir un dictamen de autenticidad (auténtico / sospechoso / manipulado) en menos de 60 segundos por pieza audiovisual.
- Integrar la verificación al flujo de publicación de Comunicación del Estado, bloqueando o marcando contenido que no supere el umbral de confianza.
- Entregar un panel con trazabilidad y evidencia técnica (puntajes, regiones alteradas, metadatos) auditable por ciudadanos y periodistas.

## 3. Requisitos funcionales (RF)
- RF-01: El sistema debe analizar videos y audios cargados y clasificarlos como «auténtico», «sospechoso» o «manipulado» mediante modelos de detección de deepfakes.
- RF-02: El sistema debe detectar y resaltar espacial/temporalmente las regiones del video (rostro, labios) y los segmentos del audio donde se identifique manipulación.
- RF-03: El sistema debe generar un reporte de autenticidad descargable (PDF/JSON) con puntajes de confianza, método usado y hash criptográfico (SHA-256) del material original.
- RF-04: El sistema debe verificar la correspondencia entre voz y rostro de la autoridad contra un registro de referencia institucional autorizado.
- RF-05: El sistema debe validar metadatos y procedencia (firma de origen, marca de agua institucional, cadena de custodia) cuando estén disponibles.
- RF-06: El sistema debe exponer una API pública de verificación para que otros entes y la ciudadanía puedan validar piezas sin acceso al panel interno.

## 4. Requisitos no funcionales (RNF)
- RNF-01: Seguridad y privacidad: los materiales cargados deben cifrarse en tránsito (TLS) y en reposo, con retención limitada y política de eliminación automática; el acceso al panel requiere autenticación y roles (RBAC).
- RNF-02: Escalabilidad: el sistema debe soportar procesamiento concurrente de al menos 100 piezas audiovisuales simultáneas y escalar horizontalmente mediante colas de trabajo.
- RNF-03: Rendimiento: el análisis debe completarse en menos de 60 segundos para piezas de hasta 5 minutos de duración, con notificación asíncrona del resultado.
- RNF-04: Accesibilidad y usabilidad: la interfaz debe cumplir criterios WCAG 2.1 AA, estar en español, y permitir que un operador no técnico cargue y lea un dictamen sin entrenamiento especializado.

## 5. Historias de usuario
- Como operador de Comunicación del Estado, quiero cargar un video de una autoridad y obtener un veredicto de autenticidad con evidencia visual, para decidir si publicarlo o bloquearlo antes de su difusión.
- Como ciudadano, quiero enviar un audio o video que circula por redes y recibir un dictamen verificable, para saber si el material es oficial o fue manipulado.
- Como auditor o periodista, quiero descargar el reporte técnico con puntajes, regiones alteradas y hash, para contrastar la decisión del sistema de forma independiente.

## 6. Criterios de aceptación
- Dado un video auténtico de una autoridad registrada, cuando se procesa en el sistema, entonces se clasifica como «auténtico» con confianza superior al umbral definido (≥ 0.90).
- Dado un video con rostro reemplazado (face swap) o labios re-sincronizados, cuando se procesa, entonces el sistema lo marca como «manipulado» e identifica la región alterada del fotograma.
- Dado un audio con voz clonada de una autoridad, cuando se procesa, entonces el sistema detecta la inconsistencia de voz y emite «sospechoso» o «manipulado» con el segmento temporal señalado.
- Dado un material sin metadatos ni registro de referencia, cuando se procesa, entonces el sistema lo clasifica como «sospechoso» (no afirmar autenticidad) y documenta la ausencia de evidencia en el reporte.

## 7. Datos y fuentes sugeridas
- Deepfake Detection Challenge (DFDC) — Meta: videos reales y manipulados para entrenar detección de rostro.
- FaceForensics++ (FF++): dataset de manipulación facial (FaceSwap, DeepFakes, Face2Face, NeuralTextures).
- ASVspoof 2019/2021: detección de suplantación y clonación de voz (spoofing).
- FakeAVCeleb: videos con audio y video falsos de celebridades, útil para multimodal.
- AudioDeepFake dataset / WaveFake: audios sintéticos y clonados.
- Registro audiovisual oficial propio de Comunicación del Estado (muestras de voz e imagen de autoridades autorizadas, bajo consentimiento y resguardo).

## 8. Stack tecnológico sugerido
- Backend: Python 3.12 con FastAPI para la API de verificación y procesamiento.
- Detección de deepfake en video: PyTorch con modelos preentrenados (XceptionNet/MesoNet para rostro, transformers de visión para anomalías temporales) y OpenCV para preprocesamiento.
- Detección de voz: librosa + modelos de detección de spoofing (AASIST / RawNet2) y verificación de locutor con ECAPA-TDNN.
- Colas y escalado: Redis + Celery (o BullMQ) para procesamiento asíncrono de piezas.
- Frontend: React + TypeScript con panel de operador y visor de reportes.
- Despliegue y servicios IA: Cloudflare Workers para la API pública y CDN, Cloudflare R2 para almacenamiento de evidencias, Cloudflare Turnstile para proteger el envío ciudadano, y Workers AI (o GPU en Cloudflare) para inferencia ligera; contenedores en Cloudflare Containers para los modelos pesados.
- Seguridad y trazabilidad: hashes SHA-256, firma digital de reportes y registro inmutable (cadena de custodia).

## 9. Ente público y visión de despliegue
El adoptante es el área de Comunicación del Estado, que integrará el verificador como paso obligatorio en su flujo editorial: antes de publicar cualquier pieza audiovisual de una autoridad, el material pasa por el sistema y solo se difunde si obtiene veredicto «auténtico». El despliegue contempla una API pública (con protección Turnstile) para que la ciudadanía y otros entes validen contenido viral, un panel interno con roles para operadores y auditores, y una política de retención de datos alineada con privacidad. El sistema se publica de forma escalonada: piloto con un ente, expansión a otros organismos y, finalmente, apertura ciudadana con reportes auditable.

## 10. Definition of Done
- [ ] El sistema clasifica audios y videos en las tres categorías con F1-score ≥ 0.90 sobre el corpus de prueba.
- [ ] El reporte de autenticidad incluye puntajes, regiones/segmentos alterados y hash SHA-256 verificable.
- [ ] La API pública y el panel interno están desplegados, documentados y protegidos (TLS, RBAC, Turnstile).
- [ ] Se cumplen los criterios de aceptación definidos en la sección 6 con pruebas automatizadas.
- [ ] Existe documentación de uso en español y un manual de operación para Comunicación del Estado.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Detector de deepfakes para comunicados oficiales
## Problema
Audios y videos falsos que suplantan a autoridades del Estado pueden desestabilizar la confianza ciudadana y propagar desinformación. Se requiere un sistema que verifique la autenticidad del contenido audiovisual institucional antes de su difusión.

## RF / RNF
RF: clasificar en auténtico/sospechoso/manipulado; resaltar regiones alteradas; generar reporte con hash y puntajes; verificar voz-rostro contra registro oficial; validar metadatos y procedencia; exponer API pública.
RNF: cifrado en tránsito y reposo con retención limitada; escalado horizontal para 100+ piezas concurrentes; análisis < 60 s por pieza; interfaz accesible WCAG 2.1 AA en español.

## Historias de usuario
- Como operador, quiero cargar un video y obtener un veredicto con evidencia, para decidir su publicación.
- Como ciudadano, quiero validar un material viral, para saber si es oficial o manipulado.
- Como auditor, quiero descargar el reporte técnico, para contrastar la decisión de forma independiente.

## Criterios de aceptación
- Dado un video auténtico, cuando se procesa, entonces se clasifica «auténtico» con confianza ≥ 0.90.
- Dado un face swap, cuando se procesa, entonces se marca «manipulado» y se señala la región alterada.
- Dado un audio con voz clonada, cuando se procesa, entonces se detecta la inconsistencia y se señala el segmento.
- Dado material sin metadatos ni referencia, cuando se procesa, entonces se marca «sospechoso» y se documenta la ausencia de evidencia.

## Fuera de alcance
- No se determina intención ni autoría del material manipulado.
- No se elimina ni modifica el contenido en redes sociales de terceros.
- No se reemplaza el criterio editorial ni la decisión humana final de publicación.
- No se procesa contenido de menores ni datos biométricos sin consentimiento y base legal.
```

## 12. Elevator Pitch
El Detector de deepfakes para comunicados oficiales es un sistema que verifica, en menos de 60 segundos, si un audio o video institucional es auténtico o fue manipulado, señalando las regiones del rostro, los labios o los segmentos de voz alterados y generando un reporte auditable con hash criptográfico. Está diseñado para el área de Comunicación del Estado, que lo integra como paso obligatorio en su flujo editorial para que solo se publique contenido verificado con veredicto «auténtico». Su valor diferencial es combinar detección multimodal de video y voz, validación contra un registro de referencia de autoridades y una API pública con trazabilidad, de modo que operadores, periodistas y ciudadanos puedan contrastar la decisión de forma independiente y frenar la desinformación antes de que se propague.

## 13. Impacto en el organismo público
- **Eficiencia operativa:** automatiza la verificación audiovisual y la reduce a menos de 60 segundos por pieza, frente a la revisión manual y subjetiva actual.
- **Confianza ciudadana:** al publicar solo contenido con veredicto «auténtico», Comunicación del Estado refuerza la credibilidad de sus canales oficiales y blinda su reputación institucional frente a suplantaciones.
- **Transparencia y trazabilidad:** cada dictamen entrega puntajes, regiones alteradas, metadatos y hash SHA-256, permitiendo que ciudadanos y periodistas auditen la decisión de forma independiente.
- **Ahorro de recursos:** el escalado horizontal (100+ piezas concurrentes) y la política de retención limitada optimizan infraestructura y almacenamiento, evitando reprocesos y costos por contenido falso difundido.
- **Cumplimiento normativo y ético:** la verificación previa a publicación y el resguardo de datos alineado con privacidad refuerzan el cumplimiento de buenas prácticas y el uso responsable de IA en la comunicación institucional.

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
