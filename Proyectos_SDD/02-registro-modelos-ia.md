# SDD — Registro soberano de modelos de IA del Estado

> Hackathon UNETI IA 2026 · Proyecto #2 · Eje 1 · IA Ética · Complejidad: Avanzada
> Ente público: CNTI

## 1. Problema
Los entes del Estado venezolano despliegan modelos de IA sin registrar qué modelo, qué conjunto de datos, qué versión ni qué persona los autorizó, lo que hace imposible auditar decisiones automatizadas. Esto afecta a ciudadanos (cuyos trámites dependen de esos modelos), a los organismos reguladores y al propio CNTI, que no puede rendir cuentas ni detectar sesgos o usos indebidos. Importa porque la trazabilidad es la base de una IA ética: sin registro versionado no hay responsabilidad posible.

## 2. Objetivos
- Permitir que cada ente registre un modelo de IA con su versión, dataset, metadatos y responsable en menos de 5 minutos, validado con firma institucional.
- Garantizar trazabilidad completa: cualquier modelo desplegado en producción debe poder reconstruirse (versión exacta + datos + responsable) en una consulta de auditoría.
- Reducir a cero los modelos "huérfanos": al cierre del piloto, el 100 % de los modelos activos del ente piloto debe estar vinculado a un registro del ledger.
- Generar informes de gobernanza y rendición de cuentas exportables (por ente, por responsable y por período) para auditorías internas y externas.

## 3. Requisitos funcionales (RF)
- RF-01: El sistema debe permitir registrar un modelo de IA con los campos obligatorios: nombre, proveedor/framework, versión, hash del artefacto (SHA-256), dataset(s) de entrenamiento/fine-tuning con su versión, y responsable institucional identificado.
- RF-02: El ledger debe mantener un historial versionado inmutable: cada cambio de versión de modelo o dataset genera una nueva entrada enlazada a la anterior, sin sobrescribir registros previos.
- RF-03: El sistema debe emitir un identificador único y verificable (registro tipo hash en cadena de compromisos) por cada entrada, que permita confirmar que un registro no fue alterado.
- RF-04: Debe permitir la búsqueda y auditoría por ente, modelo, responsable, versión y rango de fechas, con exportación a CSV/PDF para rendición de cuentas.
- RF-05: Debe registrar cambios de estado del modelo (en desarrollo, en validación, en producción, retirado) con la persona y el momento de cada transición.
- RF-06: Debe restringir el acceso por roles (registrador, validador, auditor, administrador) con autenticación y trazabilidad de quién realiza cada acción.

## 4. Requisitos no funcionales (RNF)
- RNF-01 (seguridad/privacidad): Los datos de acceso se protegen con autenticación robusta, cifrado en tránsito (TLS) y en reposo; los registros no deben exponer información personal de ciudadanos, solo metadatos institucionales. La integridad del ledger se garantiza con hashes encadenados y firmas.
- RNF-02 (escalabilidad): El ledger debe soportar el crecimiento progresivo desde un ente piloto hasta decenas de entes con miles de registros, manteniendo un esquema de datos consistente y particionable por organización.
- RNF-03 (rendimiento): Las consultas de auditoría sobre hasta 100 000 registros deben responder en menos de 2 segundos en condiciones normales, y la creación de una entrada debe confirmarse en menos de 1 segundo.
- RNF-04 (accesibilidad/usabilidad): La interfaz debe ser operable por personal técnico y no técnico, en español, responsive, con nivel AA de accesibilidad (WCAG 2.1) y funcionando sobre la conectividad limitada típica de entes públicos venezolanos.

## 5. Historias de usuario
- Como responsable técnico de un ente, quiero registrar un modelo con su dataset y versión en un formulario guiado, para dejar constancia institucional de qué se está usando y quién lo aprobó.
- Como auditor del CNTI, quiero consultar el historial completo de un modelo (versiones, datos y responsables) con un identificador único, para verificar su trazabilidad sin depender de terceros.
- Como ciudadano u órgano de control, quiero consultar la ficha pública de un modelo en producción, para saber qué datos y qué versión respaldan una decisión automatizada que me afecta.

## 6. Criterios de aceptación
- Dado un usuario con rol registrador autenticado, cuando envía un registro con todos los campos obligatorios, entonces el sistema crea una entrada con identificador único, hash del artefacto y responsable, y la enlaza al historial del modelo.
- Dado un auditor, cuando consulta un identificador de registro, entonces obtiene la cadena de versiones (modelo, dataset, responsable y estado) sin huecos ni registros sobrescritos.
- Dado un intento de modificar una entrada ya confirmada, cuando se compara su hash con el hash encadenado, entonces el sistema detecta la alteración y la marca como no íntegra.
- Dado un administrador del CNTI, cuando solicita un informe por ente y período, entonces obtiene un reporte exportable (CSV/PDF) con modelos, versiones, responsables y estados en menos de 2 segundos.

## 7. Datos y fuentes sugeridas
- Model cards y fichas técnicas públicas de modelos: Hugging Face Model Hub (metadatos de modelos, licencias y datasets).
- Datasets abiertos de referencia para validar el esquema de metadatos: datasets venezolanos e hispanohablantes en Hugging Face Datasets (ej. corpus legales y administrativos en español).
- Normativas y marcos éticos: Ley de Infogobierno (Venezuela), guías de la UNESCO sobre la ética de la IA, y el modelo de "AI Risk Management Framework" del NIST para etiquetar nivel de riesgo.
- Estándares de trazabilidad: MLflow Tracking, OpenML y la especificación "Dataset Cards" / "Model Cards" (Google) como plantilla de metadatos.
- Registros administrativos del CNTI (entes adscritos, responsables institucionales) para poblar el catálogo de organizaciones y roles.

## 8. Stack tecnológico sugerido
- Backend: TypeScript + Node.js sobre Cloudflare Workers (o una API REST con Hono), con Workers AI para tareas auxiliares de clasificación de metadatos.
- Persistencia: Cloudflare D1 (SQLite) para el catálogo relacional y R2 para almacenar artefactos/hashes de modelos; Durable Objects para coordinar escrituras versionadas por ente.
- Inmutabilidad: hashes encadenados (tipo hash chain) sobre los registros y firma con Web Crypto API; opcionalmente publicación de raíces de integridad en una cadena pública para auditoría externa.
- Frontend: React (o Astro) desplegado en Cloudflare Pages, con Workers para el enrutado y Cloudflare Access para control de acceso por roles.
- Autenticación: proveedores de identidad institucionales (SSO/OIDC) y Cloudflare Zero Trust; Vectorize para búsqueda semántica opcional de modelos.
- Monitoreo: Cloudflare Analytics/Logpush para registrar accesos de auditoría y alertas de integridad.

## 9. Ente público y visión de despliegue
El CNTI (Centro Nacional de Tecnologías de Información) adopta el ledger como servicio central para todos los entes de la Administración Pública: publica una API y un portal donde cada organismo registra sus modelos con responsables institucionales, y el CNTI actúa como validador y auditor. El despliegue se hace en fases: (1) piloto con un ente, (2) incorporación progresiva de entes con onboarding y capacitación, (3) obligatoriedad de registro para modelos en producción y (4) integración con procesos de auditoría y rendición de cuentas del Estado, todo sobre infraestructura Cloudflare en el borde para disponibilidad y bajo costo.

## 10. Definition of Done
- [ ] El registro, el historial versionado y el encadenamiento de hashes de integridad funcionan de extremo a extremo con datos reales de un ente piloto.
- [ ] Los roles (registrador, validador, auditor, administrador) están implementados y verificados con pruebas automatizadas.
- [ ] La auditoría por ente, modelo, responsable y fecha, con exportación CSV/PDF, está operativa y probada con un volumen de al menos 100 000 registros.
- [ ] Existe documentación de despliegue y un SPEC.md final, más pruebas de seguridad (integridad, autenticación y control de acceso).
- [ ] El piloto demuestra un informe de rendición de cuentas generado y validado por un auditor del CNTI.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Registro soberano de modelos de IA del Estado
## Problema
Los entes públicos usan modelos de IA sin trazabilidad de modelo, datos, versión ni responsable, impidiendo auditar y rendir cuentas sobre decisiones automatizadas. Se requiere un ledger institucional versionado con gobernanza.

## RF / RNF
RF-01: Registrar modelo con versión, hash SHA-256, dataset(s), responsable y estado.
RF-02: Historial versionado inmutable enlazado por entradas.
RF-03: Identificador único verificable por hash encadenado.
RF-04: Auditoría y exportación CSV/PDF por ente, modelo, responsable y fecha.
RF-05: Registro de transiciones de estado (desarrollo → validación → producción → retirado).
RF-06: Control de acceso por roles con trazabilidad de acciones.

RNF-01: Seguridad y privacidad (TLS, cifrado en reposo, hashes encadenados, firmas).
RNF-02: Escalabilidad de un ente a decenas con miles de registros.
RNF-03: Consultas de auditoría < 2 s sobre 100 000 registros; alta de registro < 1 s.
RNF-04: Usabilidad y accesibilidad WCAG 2.1 AA, en español, responsive y tolerante a conectividad limitada.

## Historias de usuario
- Como responsable técnico, quiero registrar un modelo con datos y versión, para dejar constancia de qué se usa y quién lo aprobó.
- Como auditor del CNTI, quiero consultar el historial completo de un modelo, para verificar trazabilidad sin depender de terceros.
- Como ciudadano u órgano de control, quiero consultar la ficha pública de un modelo, para saber qué respalda una decisión que me afecta.

## Criterios de aceptación
- Dado un registrador autenticado, cuando envía un registro completo, entonces se crea una entrada con identificador único y responsable, enlazada al historial.
- Dado un auditor, cuando consulta un identificador, entonces obtiene la cadena de versiones sin huecos ni sobrescrituras.
- Dado un intento de modificación, cuando se compara el hash encadenado, entonces se detecta y marca la alteración.
- Dado un administrador, cuando pide un informe por ente y período, entonces obtiene CSV/PDF en menos de 2 segundos.

## Fuera de alcance
- Entrenamiento o ejecución de modelos de IA (esto es solo trazabilidad y gobernanza).
- Juicio automático sobre la ética o sesgo de un modelo (se registra y audita, no se sanciona).
- Acceso a datos personales de ciudadanos en el ledger (solo metadatos institucionales).
```

## 12. Elevator Pitch
Hoy los entes públicos venezolanos despliegan modelos de IA sin registrar qué modelo, qué datos, qué versión ni quién lo autorizó, por lo que ninguna decisión automatizada puede auditarse. El CNTI adopta un **registro soberano (ledger) de modelos de IA**: un servicio central donde cada organismo registra en minutos su modelo con versión, dataset y responsable, validado con firma institucional y protegido con hashes encadenados inmutables. El valor diferencial es la trazabilidad total: cualquier modelo en producción puede reconstruirse y auditarse en una sola consulta, permitiendo al Estado rendir cuentas, detectar sesgos y construir una IA ética de verdad.

## 13. Impacto en el organismo público
- **Eficiencia:** el CNTI pasa de no tener visibilidad a disponer de un catálogo único y consultable de modelos, versiones y responsables en menos de 2 segundos, reduciendo el trabajo manual de rastreo.
- **Transparencia:** cada ciudadano u órgano de control puede consultar la ficha pública de un modelo en producción para saber qué datos y qué versión respaldan una decisión automatizada.
- **Confianza ciudadana:** la trazabilidad y la rendición de cuentas convierten al CNTI en garante verificable de la IA pública, fortaleciendo la legitimidad de los trámites.
- **Ahorro de recursos:** la infraestructura en el borde de Cloudflare y el registro guiado en menos de 5 minutos reducen costos operativos y evitan reconstrucciones costosas de auditoría.
- **Cumplimiento normativo:** el registro se alinea con la Ley de Infogobierno y marcos éticos (UNESCO, NIST), posicionando al CNTI como validador y auditor institucional.

## 14. README y documentación del proyecto
El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción** clara del proyecto (qué hace y qué problema resuelve): "Registro soberano de modelos de IA del Estado", un ledger versionado e inmutable para registrar, auditar y rendir cuentas de los modelos de IA desplegados por los entes públicos, resolviendo la falta de trazabilidad de modelo, dataset, versión y responsable.
- **Badges** (build, tests, licencia, cobertura).
- **Características** principales (lista de funcionalidades): registro de modelos con metadatos y hash SHA-256, historial versionado enlazado, identificador único verificable, auditoría y exportación CSV/PDF, registro de estados (desarrollo → validación → producción → retirado) y control de acceso por roles.
- **Arquitectura** (diagrama de componentes y flujo de datos): frontend (React/Astro) → API (Hono/Workers) → persistencia (D1, R2, Durable Objects) con hashes encadenados y firma Web Crypto, sobre Cloudflare Pages/Workers/Access/Zero Trust.
- **Instalación y ejecución** (prerrequisitos, pasos, variables de entorno): Node.js, cuenta Cloudflare, Wrangler; pasos de `npm install`, configuración de `wrangler.toml` y variables de entorno en `.env`.
- **Uso** (ejemplos, endpoints/API, capturas): ejemplos de registro, consulta de auditoría, ficha pública e informes exportables.
- **Datos y datasets** (fuentes, formato, cómo obtenerlos): Model Cards/Dataset Cards de Hugging Face, datasets abiertos en español y registros administrativos del CNTI.
- **Pruebas** (cómo correrlas): comando de test para integridad, autenticación y control de acceso.
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
