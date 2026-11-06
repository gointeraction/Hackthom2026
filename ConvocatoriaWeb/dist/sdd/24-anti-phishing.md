# SDD — Motor de detección de phishing dirigido a funcionarios

> Hackathon UNETI IA 2026 · Proyecto #24 · Eje 2 · Ciberseguridad · Complejidad: Media
> Ente público: Correo institucional

## 1. Problema
El phishing por correo electrónico es la puerta de entrada más común a los sistemas de los entes públicos venezolanos, aprovechando la confianza de funcionarios en mensajes que suplantan a colegas, bancos o proveedores del Estado. Afecta directamente a los usuarios del correo institucional, quienes no siempre distinguen un mensaje legítimo de uno malicioso, y expone a la institución a robo de credenciales, fuga de datos y compromiso de sistemas internos.

## 2. Objetivos
- Reducir en al menos un 40% la tasa de clics de los funcionarios en enlaces de correos catalogados como phishing durante la fase piloto.
- Detectar y alertar en tiempo real (menos de 30 segundos desde la recepción) los correos institucionales con indicadores de suplantación, enlaces sospechosos o adjuntos maliciosos.
- Elevar el nivel de conciencia del usuario mediante microformación automática y contextual, con una tasa de finalización de módulos educativos superior al 70%.
- Generar un panel de métricas por dependencia que permita al ente priorizar campañas y medir la evolución del riesgo.

## 3. Requisitos funcionales (RF)
- RF-01: El sistema debe conectarse al buzón institucional (IMAP/Microsoft Graph) para analizar cada correo entrante sin interrumpir su entrega.
- RF-02: El sistema debe clasificar cada mensaje con un nivel de riesgo (bajo, medio, alto) a partir de análisis de remitente, enlaces, adjuntos y patrones de texto.
- RF-03: El sistema debe generar alertas al usuario y al área de TI cuando un correo supere el umbral de riesgo alto, incluyendo el motivo del alerta en lenguaje claro.
- RF-04: El sistema debe activar automáticamente píldoras educativas cortas (por ejemplo, "este correo simulaba ser de tu banco") cuando el usuario interactúa con un mensaje riesgoso.
- RF-05: El sistema debe permitir a un administrador reportar falsos positivos/negativos para reentrenar o ajustar el motor de detección.

## 4. Requisitos no funcionales (RNF)
- RNF-01 (Seguridad/privacidad): El análisis debe realizarse sin exponer el contenido de los correos a terceros; los datos sensibles se procesan en infraestructura controlada por el ente y los logs se anonimizan.
- RNF-02 (Escalabilidad): Debe soportar el volumen de correo de un ente mediano (miles de cuentas y decenas de miles de mensajes diarios) sin degradar el servicio.
- RNF-03 (Rendimiento): El tiempo de clasificación por mensaje no debe superar los 2 segundos en el percentil 95, y el sistema debe operar de forma asíncrona para no retrasar la entrega.
- RNF-04 (Accesibilidad/usabilidad): Las alertas y los módulos educativos deben ser comprensibles para personal no técnico, en español, con legibilidad AA (WCAG 2.1) y disponibles también en dispositivos móviles.

## 5. Historias de usuario
- Como funcionario público, quiero recibir una advertencia clara antes de abrir un correo sospechoso, para no caer en un intento de suplantación de identidad.
- Como responsable de TI del ente, quiero ver un panel con los correos bloqueados y los usuarios más expuestos, para priorizar las acciones de contención.
- Como usuario, quiero recibir una explicación breve de por qué un correo fue marcado como peligroso, para aprender a identificarlo por mí mismo en el futuro.

## 6. Criterios de aceptación
- Dado un correo con dominio suplantado (ej. `@banco-estado.ve` en lugar de `@bancoestado.com`), cuando el sistema lo analiza, entonces lo clasifica como riesgo alto y emite alerta en menos de 30 segundos.
- Dado un correo legítimo de un dominio institucional autorizado, cuando el sistema lo procesa, entonces no genera alerta y mantiene una tasa de falsos positivos menor al 5% sobre el corpus de validación.
- Dado que un usuario hace clic en un enlace de un correo de riesgo, cuando el clic es interceptado, entonces se muestra la píldora educativa y se registra el evento en el panel de TI.
- Dado un lote de 10 000 correos de prueba, cuando se procesa en paralelo, entonces el sistema completa la clasificación sin pérdida de mensajes ni degradación mayor al 10% del tiempo base.

## 7. Datos y fuentes sugeridas
- Corpus públicos de phishing en español y multilingüe: *Nazario Phishing Corpus* y *SpamAssassin Public Corpus* para entrenar el clasificador.
- Dataset de URLs maliciosas: *PhishTank* (lista comunitaria verificada) y *OpenPhish* (feed de phishing en tiempo real).
- Conjunto *Phishing Email Dataset* de Kaggle (eml con etiquetas de phishing/legítimo) para la línea base de detección.
- Dominios institucionales oficiales y whitelist de remitentes del ente (datos propios, confidenciales) para reducir falsos positivos.
- Plantillas reales de comunicaciones internas del ente (previo acuerdo de uso) para el módulo educativo contextual.

## 8. Stack tecnológico sugerido
- Backend: Python (FastAPI) para el motor de análisis y la API de alertas, con tareas asíncronas en Celery o colas de Cloudflare Queues.
- IA/NLP: modelo de clasificación de texto (por ejemplo, fine-tuning de un modelo multilingüe tipo `bert-base-multilingual-cased` vía Hugging Face) y heurísticas de reputación de dominio (DMARC/SPF/DKIM).
- Infraestructura: Cloudflare Workers para el proxy de clics y la protección de enlaces, Cloudflare Email Routing/Email Workers para interceptar y auditar mensajes, y Cloudflare D1 + R2 para métricas y almacenamiento de adjuntos en cuarentena.
- Frontend: React + Tailwind para el panel de administración y las píldoras educativas embebidas.
- Despliegue: Docker + CI/CD (GitHub Actions) y monitoreo con Prometheus/Grafana.

## 9. Ente público y visión de despliegue
El ente público (correo institucional) adopta la solución como un servicio interno de ciberseguridad: el área de TI despliega el conector al buzón institucional y el panel de gestión, mientras los funcionarios reciben las alertas y la formación sin cambiar de cliente de correo. La implementación se hace en tres fases — piloto con un grupo reducido de cuentas, despliegue progresivo por dependencias y operación continua con reentrenamiento periódico del modelo a partir de los falsos positivos reportados.

## 10. Definition of Done
- [ ] El clasificador alcanza una exactitud ≥ 90% y una tasa de falsos positivos < 5% sobre el corpus de validación reservado.
- [ ] La integración con el buzón institucional (lectura + entrega sin interrupción) funciona de extremo a extremo en el entorno de pruebas.
- [ ] Las alertas, el panel de TI y las píldoras educativas están implementados, probados y documentados en español.
- [ ] Se entrega una guía de despliegue para el ente y un plan de reentrenamiento del modelo con los datos reportados.
- [ ] El proyecto pasa las pruebas de seguridad/privacidad (logs anonimizados, sin envío de contenido a terceros) y cumple accesibilidad WCAG 2.1 nivel AA.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Motor de detección de phishing dirigido a funcionarios
## Problema
El phishing por correo es la puerta de entrada más común a los entes públicos; los funcionarios del correo institucional son el eslabón más débil y requieren detección temprana y educación continua.

## RF / RNF
- RF-01: Conexión al buzón institucional sin interrumpir la entrega.
- RF-02: Clasificación de riesgo (bajo/medio/alto) por remitente, enlaces, adjuntos y texto.
- RF-03: Alertas al usuario y a TI con motivo claro.
- RF-04: Píldoras educativas automáticas ante interacción con correo riesgoso.
- RF-05: Reporte de falsos positivos/negativos para reentrenar.
- RNF-01: Seguridad/privacidad (sin exponer contenido a terceros, logs anonimizados).
- RNF-02: Escalabilidad (miles de cuentas, decenas de miles de mensajes diarios).
- RNF-03: Rendimiento (clasificación ≤ 2 s p95, procesamiento asíncrono).
- RNF-04: Accesibilidad/usabilidad (español, WCAG 2.1 AA, móvil).

## Historias de usuario
- Como funcionario, quiero una advertencia clara antes de abrir un correo sospechoso, para no caer en suplantaciones.
- Como responsable de TI, quiero un panel con correos bloqueados y usuarios expuestos, para priorizar la contención.
- Como usuario, quiero saber por qué un correo fue marcado como peligroso, para aprender a identificarlo.

## Criterios de aceptación
- Dado un correo con dominio suplantado, cuando se analiza, entonces se clasifica como riesgo alto y alerta en < 30 s.
- Dado un correo legítimo de dominio autorizado, cuando se procesa, entonces no alerta y mantiene falsos positivos < 5%.
- Dado un clic en enlace riesgoso, cuando se intercepta, entonces se muestra píldora educativa y se registra en el panel.

## Fuera de alcance
- Bloqueo total del correo entrante (solo alerta y cuarentena opcional de adjuntos).
- Sustitución del cliente de correo institucional existente.
- Análisis de canales distintos al correo (mensajería, telefonía, redes sociales).
- Responsabilidad legal por incidentes derivados de correos no detectados.
```

## 12. Elevator Pitch
El correo institucional es la puerta de entrada más explotada por los atacantes: hoy un funcionario puede abrir un mensaje que suplanta a un colega, a un banco o a un proveedor del Estado sin distinguirlo de uno legítimo. Nuestra solución analiza cada correo entrante en tiempo real —remitente, enlaces, adjuntos y texto—, lo clasifica por nivel de riesgo y alerta al usuario y al área de TI en menos de 30 segundos, sin interrumpir la entrega del correo. Además, convierte cada amenaza en microformación automática: cuando un funcionario interactúa con un mensaje riesgoso, aprende en ese mismo instante a reconocerlo. El resultado es un motor de ciberseguridad que no solo bloquea el phishing, sino que fortalece al eslabón más débil: el usuario.

## 13. Impacto en el organismo público
- **Eficiencia operativa:** el área de TI del correo institucional deja de revisar manualmente mensajes sospechosos y prioriza acciones a partir de un panel de métricas por dependencia, con detección y alertas en menos de 30 segundos.
- **Confianza ciudadana y del funcionario:** los usuarios del correo institucional reciben advertencias claras y explicaciones en lenguaje sencillo, lo que reduce la probabilidad de caer en suplantaciones y protege la integridad de las comunicaciones internas.
- **Ahorro de recursos:** la microformación automática y contextual sustituye campañas genéricas de concienciación, reduciendo el costo de capacitar a miles de cuentas y acotando el impacto de los incidentes.
- **Transparencia y trazabilidad:** el panel permite al ente medir la evolución del riesgo por dependencia, auditar correos catalogados y justificar las decisiones de contención con métricas objetivas.
- **Cumplimiento normativo y de seguridad/privacidad:** el procesamiento se realiza en infraestructura controlada por el ente, sin exponer el contenido a terceros y con logs anonimizados, alineándose con los requisitos de privacidad (RNF-01) y accesibilidad WCAG 2.1 AA.

## 14. README y documentación del proyecto
El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción:** "Motor de detección de phishing dirigido a funcionarios" — qué hace (analiza cada correo institucional entrante, clasifica su riesgo y alerta/formación) y qué problema resuelve (el phishing como puerta de entrada a los sistemas del ente público, explotando la confianza del funcionario).
- **Badges:** build, tests, licencia y cobertura.
- **Características** principales:
  - Conexión al buzón institucional (IMAP/Microsoft Graph) sin interrumpir la entrega.
  - Clasificación de riesgo (bajo/medio/alto) por remitente, enlaces, adjuntos y patrones de texto.
  - Alertas al usuario y al área de TI con el motivo en lenguaje claro.
  - Píldoras educativas automáticas ante interacción con correo riesgoso.
  - Panel de métricas por dependencia y reporte de falsos positivos/negativos para reentrenar.
- **Arquitectura:** diagrama de componentes (backend FastAPI + tareas asíncronas, proxy de clics y protección de enlaces con Cloudflare Workers, Email Routing/Email Workers para interceptar, D1 + R2 para métricas y cuarentena, frontend React + Tailwind) y flujo de datos desde la recepción del correo hasta la alerta y la formación del usuario.
- **Instalación y ejecución:** prerrequisitos (Python, Node, Docker, credenciales del buzón), pasos de instalación, y variables de entorno (`.env.example`).
- **Uso:** ejemplos, endpoints/API de alertas y del panel, y capturas de la interfaz.
- **Datos y datasets:** fuentes (Nazario Phishing Corpus, SpamAssassin Public Corpus, PhishTank, OpenPhish, Phishing Email Dataset de Kaggle), formato y cómo obtenerlos; whitelist de dominios institucionales como datos propios confidenciales.
- **Pruebas:** cómo ejecutar la suite (unitarias, integración y corpus de validación de 10 000 correos).
- **Contribución:** guía para colaborar (ramas, issues, convenciones).
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
