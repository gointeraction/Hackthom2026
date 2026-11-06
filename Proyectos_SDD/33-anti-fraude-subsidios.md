# SDD — Detección de fraude en programas sociales

> Hackathon UNETI IA 2026 · Proyecto #33 · Eje 2 · Ciberseguridad · Complejidad: Avanzada
> Ente público: Ministerios sociales

## 1. Problema
Los programas de subsidios y beneficios sociales de los ministerios sufren cobros duplicados o irregulares: una misma persona o núcleo familiar recibe el mismo beneficio más de una vez, o perfiles fraudulentos capturan ayudas que no les corresponden. Esto afecta a los ciudadanos en situación de vulnerabilidad —que dejan de recibir recursos— y al Estado, que pierde fondos públicos por pagos indebidos. Importa porque cada bolívar desviado reduce la cobertura real de la política social y erosiona la confianza en la administración pública.

## 2. Objetivos
- Detectar al menos el 90 % de los casos de duplicidad de beneficiarios comparando identidad, cédula, núcleo familiar, dirección y datos bancarios en el primer trimestre de operación.
- Reducir en un 40 % el tiempo de validación manual de solicitudes de beneficios mediante un motor de alertas automático priorizado por riesgo.
- Generar un expediente auditable por cada alerta de fraude (evidencias, puntaje y regla disparada) que sirva como insumo para los organismos de control.
- Clasificar cada solicitud en riesgo bajo, medio o alto con una explicación interpretable del puntaje, sin exponer datos sensibles a operadores no autorizados.

## 3. Requisitos funcionales (RF)
- RF-01: El sistema debe ingestar múltiples fuentes de datos de beneficiarios (Sistema Patria, registros de nómina, bases de ministerios, listados de pensiones) y normalizarlas a un esquema único de identidad.
- RF-02: El sistema debe resolver identidades con coincidencia difusa (fuzzy matching) sobre cédula, nombres, apellidos, fecha de nacimiento, dirección y teléfono para detectar registros duplicados aunque presenten errores de tipeo o variaciones de formato.
- RF-03: El sistema debe aplicar reglas de negocio configurables (misma cédula con dos cuentas, mismo núcleo familiar cobrando en paralelo, beneficiario fallecido, dirección inexistente, IBAN duplicado) y emitir alertas con un puntaje de riesgo.
- RF-04: El sistema debe generar un tablero de control para analistas con filtros por ministerio, programa social, región y nivel de riesgo, permitiendo exportar cada caso en formato auditable (CSV/JSON).
- RF-05: El sistema debe registrar un historial inmutable de decisiones (aprobado, en revisión, rechazado por fraude) con usuario, fecha, motivo y evidencias, para trazabilidad y auditoría.
- RF-06: El sistema debe permitir a un administrador actualizar umbrales de puntaje, listas de exclusión y nuevas reglas sin modificar el código (configuración declarativa).

## 4. Requisitos no funcionales (RNF)
- RNF-01: Seguridad y privacidad — cifrado en tránsito (TLS 1.3) y en reposo (AES-256), anonimización/seudonimización de datos personales para perfiles sin privilegios, control de acceso basado en roles (RBAC) y registro de auditoría de toda consulta a datos sensibles.
- RNF-02: Escalabilidad — la plataforma debe soportar la incorporación progresiva de millones de registros históricos y el ingreso por lotes (batch) de nuevas remesas de datos sin degradar las alertas en línea.
- RNF-03: Rendimiento — una corrida de detección sobre 1 millón de registros debe completarse en menos de 60 minutos, y las consultas del tablero deben responder en menos de 2 segundos en el percentil 95.
- RNF-04: Accesibilidad y usabilidad — interfaz en español con soporte de teclado y contraste WCAG 2.1 AA, usable por analistas no técnicos de los ministerios con entrenamiento mínimo (onboarding menor a 1 día).

## 5. Historias de usuario
- Como analista de un ministerio social, quiero ver las solicitudes duplicadas agrupadas por beneficiario y con un puntaje de riesgo, para priorizar los casos que requieren investigación inmediata.
- Como auditor del organismo de control, quiero exportar el expediente completo de una alerta con sus evidencias y reglas disparadas, para sustentar un procedimiento administrativo o penal.
- Como administrador de la plataforma, quiero ajustar umbrales de riesgo y reglas de duplicidad desde una configuración declarativa, para adaptar la detección a nuevos programas sociales sin esperar un desarrollo de software.

## 6. Criterios de aceptación
- Dado un conjunto de datos de prueba con 10.000 beneficiarios que incluye 500 duplicados conocidos, cuando se ejecuta el motor de detección, entonces el sistema identifica al menos 450 de esos 500 duplicados (recall ≥ 90 %) con una precisión mínima del 80 %.
- Dado un registro duplicado por misma cédula y dos cuentas bancarias distintas, cuando el analista abre la alerta, entonces el sistema muestra ambos registros enlazados, la regla disparada y el puntaje de riesgo con su explicación.
- Dado un usuario con rol "analista" sin privilegios de datos sensibles, cuando consulta el detalle de un beneficiario, entonces los campos de cédula y datos bancarios aparecen enmascarados (solo últimos 4 dígitos visibles).
- Dado un cambio de umbral de riesgo por un administrador, cuando se reejecuta la evaluación, entonces las nuevas alertas se generan usando el umbral actualizado y queda registrado quién y cuándo realizó el cambio.

## 7. Datos y fuentes sugeridas
- Sistema de Protección Social "Patria" (Venezuela) — asignación de bonos y beneficios sociales.
- Registros del Instituto Venezolano de los Seguros Sociales (IVSS) — pensiones y asegurados.
- Base de datos del Consejo Nacional Electoral (CNE) / Registro Electoral para verificación de identidad y estatus de fallecimiento.
- SAIME (Servicio Administrativo de Identificación, Migración y Extranjería) — validación de cédulas y datos de identidad.
- Datasets públicos anonimizados de referencia para probar algoritmos de deduplicación: "record linkage" del UCI ML Repository y North Carolina Voter Registration (para ensayar fuzzy matching de nombres y direcciones).
- RIF y registros tributarios del SENIAT como fuente de verificación cruzada de personas jurídicas beneficiarias.

## 8. Stack tecnológico sugerido
- Lenguajes y procesamiento: Python 3.12 con pandas, Polars, dedupe/recordlinkage y scikit-learn para el motor de deduplicación y puntaje.
- Backend/API: FastAPI (REST) desplegada como Worker de Cloudflare Workers con Python, o alternativamente Cloudflare Workers con TypeScript para la API ligera de alertas.
- Base de datos: PostgreSQL (con extensión pg_trgm para similitud de texto) y vectorización opcional de perfiles con Cloudflare Vectorize para búsqueda de identidades semánticamente similares.
- Almacenamiento de objetos y colas: Cloudflare R2 para remesas de datos e insumos, Cloudflare KV para configuración de reglas y umbrales, y Cloudflare Queues para el procesamiento asíncrono por lotes.
- Autenticación y seguridad: Cloudflare Access (Zero Trust) para RBAC y acceso por roles, y Cloudflare Turnstile para proteger los formularios de ingreso.
- Frontend: React + TypeScript con Tailwind CSS para el tablero de analistas; observabilidad con Cloudflare Workers Analytics / logs estructurados.
- IA interpretable: modelo de clasificación de riesgo (bosques aleatorios / gradient boosting) con explicaciones SHAP para justificar cada puntaje ante auditoría.

## 9. Ente público y visión de despliegue
Lo adopta un ministerio del área social (por ejemplo, el Ministerio del Poder Popular para las Comunas y Movimientos Sociales u otro con programas de subsidios), en coordinación con los organismos de control fiscal y la contraloría. Se implementa en fases: (1) piloto con un programa social acotado y datos históricos anonimizados para calibrar umbrales; (2) integración por lotes con las fuentes oficiales a través de conectores seguros; y (3) despliegue en producción sobre infraestructura Cloudflare con acceso federado por roles, tablero para analistas y exportación de expedientes auditarles para los entes de control.

## 10. Definition of Done
- [ ] El motor de detección cumple recall ≥ 90 % y precisión ≥ 80 % sobre el conjunto de prueba de duplicados conocido.
- [ ] Las reglas de duplicidad y los umbrales de riesgo son configurables sin cambios de código y quedan versionados.
- [ ] Cada alerta genera un expediente exportable con evidencias, regla disparada y puntaje interpretable.
- [ ] El control de acceso por roles enmascara datos sensibles para perfiles sin privilegios y audita toda consulta.
- [ ] La documentación de despliegue, el SPEC.md y las pruebas automatizadas (unitarias e integración) están completos y aprobados.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Detección de fraude en programas sociales
## Problema
Los programas de subsidios sociales sufren cobros duplicados o irregulares por registros fraudulentos o duplicados de un mismo beneficiario, desviando fondos públicos de los ciudadanos vulnerables.

## RF / RNF
- RF-01: Ingesta y normalización de múltiples fuentes de beneficiarios a un esquema único de identidad.
- RF-02: Resolución de identidad con coincidencia difusa (cédula, nombre, dirección, teléfono, datos bancarios).
- RF-03: Reglas configurables de fraude con alertas y puntaje de riesgo explicable.
- RF-04: Tablero de analistas con filtros y exportación de expedientes auditables.
- RF-05: Historial inmutable de decisiones con trazabilidad para auditoría.
- RNF-01: Seguridad y privacidad (TLS 1.3, AES-256, RBAC, enmascaramiento de datos sensibles).
- RNF-02: Escalabilidad a millones de registros y procesamiento por lotes.
- RNF-03: Rendimiento (corrida < 60 min por millón de registros, consultas < 2 s p95).
- RNF-04: Accesibilidad WCAG 2.1 AA y usabilidad para analistas no técnicos.

## Historias de usuario
- Como analista, quiero ver solicitudes duplicadas agrupadas y priorizadas por riesgo, para investigar primero los casos críticos.
- Como auditor, quiero exportar el expediente completo de una alerta, para sustentar procedimientos administrativos.
- Como administrador, quiero ajustar umbrales y reglas sin código, para adaptarme a nuevos programas sociales.

## Criterios de aceptación
- Dado un lote con 500 duplicados conocidos, cuando se ejecuta la detección, entonces se identifican ≥ 450 con precisión ≥ 80 %.
- Dado un duplicado por misma cédula y dos cuentas, cuando se abre la alerta, entonces se muestran ambos registros, la regla y el puntaje explicado.
- Dado un rol sin privilegios, cuando consulta un beneficiario, entonces los datos sensibles aparecen enmascarados.
- Dado un cambio de umbral, cuando se reejecuta, entonces las alertas usan el nuevo umbral y el cambio queda auditado.

## Fuera de alcance
- Reemplazo de los sistemas transaccionales de pago de beneficios (solo detección y alertas, no ejecución de pagos).
- Persecución penal automatizada: el sistema emite alertas y expedientes, la decisión sancionatoria es humana y de los organismos competentes.
- Integración con redes sociales u otras fuentes no oficiales para inferir comportamiento de los beneficiarios.
```

## 12. Elevator Pitch
Cada vez que un mismo beneficiario cobra un subsidio más de una vez —o un perfil fraudulento captura una ayuda que no le corresponde— los ministerios sociales pierden fondos públicos que dejan de llegar a los ciudadanos en situación de vulnerabilidad. Nuestro sistema detecta esos cobros duplicados e irregulares comparando identidad, cédula, núcleo familiar, dirección y datos bancarios, y prioriza cada caso con un puntaje de riesgo explicable que el analista puede entender sin ser técnico. Para los ministerios del área social (como el Ministerio del Poder Popular para las Comunas y Movimientos Sociales), el valor diferencial es triple: recuperar recursos para quienes de verdad los necesitan, reducir el tiempo de validación manual y entregar a los organismos de control expedientes auditables listos para sustentar cada decisión.

## 13. Impacto en el organismo público
- **Eficiencia operativa:** el motor de alertas automático priorizado por riesgo reduce en un 40 % el tiempo de validación manual de solicitudes, liberando a los analistas para investigar solo los casos críticos.
- **Transparencia y auditoría:** cada alerta genera un expediente exportable (CSV/JSON) con evidencias, regla disparada y puntaje interpretable, que sirve de insumo directo para los organismos de control fiscal y la contraloría.
- **Ahorro de recursos públicos:** al detectar al menos el 90 % de los casos de duplicidad, se recuperan bolívares hoy desviados por pagos indebidos, ampliando la cobertura real de la política social.
- **Confianza ciudadana:** los beneficios llegan a los beneficiarios legítimos y no a perfiles fraudulentos, reforzando la credibilidad de la administración pública ante la población vulnerable.
- **Cumplimiento normativo:** el historial inmutable de decisiones (usuario, fecha, motivo y evidencias) y el enmascaramiento de datos sensibles por roles aportan trazabilidad y respaldo probatorio para procedimientos administrativos o penales.

## 14. README y documentación del proyecto
El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción** clara del proyecto: *Detección de fraude en programas sociales* — detecta cobros duplicados o irregulares de subsidios comparando identidad, cédula, núcleo familiar, dirección y datos bancarios, y emite alertas de riesgo explicables y auditables.
- **Badges** (build, tests, licencia, cobertura).
- **Características** principales (lista de funcionalidades): ingesta y normalización multi-fuente, resolución de identidad con fuzzy matching, reglas configurables con puntaje de riesgo, tablero de analistas con exportación de expedientes, historial inmutable y RBAC con enmascaramiento de datos.
- **Arquitectura** (diagrama de componentes y flujo de datos): ingesta → normalización → motor de deduplicación y puntaje → alertas → tablero / exportación, sobre FastAPI + PostgreSQL + Cloudflare (R2, KV, Queues, Vectorize, Access).
- **Instalación y ejecución** (prerrequisitos, pasos, variables de entorno).
- **Uso** (ejemplos, endpoints/API, capturas).
- **Datos y datasets** (fuentes: Sistema Patria, IVSS, CNE, SAIME, SENIAT; datasets de referencia para record linkage; formato y cómo obtenerlos).
- **Pruebas** (cómo correrlas): unitarias e integración sobre el conjunto con 500 duplicados conocidos (recall ≥ 90 %, precisión ≥ 80 %).
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

1. **Reúne los insumos** del proyecto: este SDD, el SPEC, el README, el código fuente (o fragmentos clave del motor de deduplicación y el tablero), la descripción del dataset (fuentes Patria, IVSS, CNE, SAIME y los datasets de record linkage) y las capturas/demo.
2. **Crea un notebook** en NotebookLM y **sube** esos insumos como fuentes.
3. **Genera la "Guía de estudio"** para estructurar el pitch (problema → solución → impacto → demo).
4. **Genera el "Resumen de audio" (Audio Overview)** para practicar el pitch hablado y afinar el guion.
5. **Haz preguntas al notebook** para ensayar la defensa ante el jurado (ej.: "¿cuál es mi mayor riesgo técnico?", "¿cómo explico el impacto en 30 segundos?").
6. **Genera un "Briefing"** alineado a la rúbrica: viabilidad, impacto, innovación/IA, pitch, ética y escalabilidad.
