# SDD — Trazabilidad de decisiones automatizadas (ledger)

> Hackathon UNETI IA 2026 · Proyecto #17 · Eje 1 · IA Ética · Complejidad: Avanzada
> Ente público: Fiscalización

## 1. Problema
Los organismos de fiscalización pública venezolanos (contralorías y unidades de auditoría interna) emiten decisiones y dictámenes apoyados cada vez más en modelos de IA, pero hoy no existe forma de reconstruir quién aprobó una decisión, qué modelo la generó ni qué datos la sustentaron. Esto afecta a auditores, contralores y ciudadanos, que no pueden verificar si un hallazgo o sanción fue arbitrario o si se basó en criterios objetivos, erosionando la confianza institucional y la rendición de cuentas.

## 2. Objetivos
- Registrar de forma inmutable el 100% de las decisiones asistidas por IA en el proceso de fiscalización, con su actor, modelo, versión, datos y justificación.
- Reducir a cero la imposibilidad de reconstruir el "quién, qué y con qué criterio" de cada decisión automatizada.
- Permitir a un auditor externo verificar la integridad de una decisión en menos de 60 segundos mediante comparación de hash.
- Asegurar que toda decisión cuente con una justificación humana legible y trazable en el 100% de los casos.

## 3. Requisitos funcionales (RF)
- RF-01: El sistema debe capturar y persistir, de forma inmutable, cada decisión con el identificador del funcionario responsable, el modelo de IA utilizado, su versión y la justificación del criterio aplicado.
- RF-02: El sistema debe registrar el conjunto de datos de entrada (fuentes, fechas y versiones) que alimentaron la decisión, junto con su hash criptográfico SHA-256.
- RF-03: El sistema debe permitir la verificación de integridad de cualquier registro mediante comparación de hash contra un libro de compromisos anclado externamente.
- RF-04: El sistema debe exponer un panel de auditoría con filtros por fecha, ente, modelo y tipo de decisión, exportable en formato legible (CSV/PDF).
- RF-05: El sistema debe emitir alertas cuando una decisión carezca de justificación, de modelo declarado o de datos de respaldo.
- RF-06: El sistema debe permitir la revisión retrospectiva (replay) de una decisión mostrando modelo, datos y justificación tal como estaban en el momento exacto de su emisión.

## 4. Requisitos no funcionales (RNF)
- RNF-01: Seguridad/privacidad: cifrado en tránsito y en reposo, control de acceso basado en roles, y seudonimización de datos personales de terceros conforme a la normativa de protección de datos aplicable.
- RNF-02: Escalabilidad: soporte para al menos 50 entes fiscalizados y 10 000 decisiones diarias sin degradación, con almacenamiento horizontalmente escalable.
- RNF-03: Rendimiento: registro de una decisión en menos de 500 ms y consulta/verificación de integridad en menos de 2 segundos para el percentil 95.
- RNF-04: Accesibilidad/usabilidad: interfaz en español, compatible con lectores de pantalla (WCAG 2.1 AA) y operable por auditores sin formación técnica avanzada.

## 5. Historias de usuario
- Como contralor, quiero ver quién aprobó cada decisión y con qué criterio, para auditar y responsabilizar en caso de hallazgo arbitrario.
- Como analista de datos, quiero registrar automáticamente el modelo y los datos usados en cada dictamen, para no depender de anotaciones manuales que se pierden.
- Como ciudadano, quiero verificar públicamente que una sanción se basó en criterios objetivos y trazables, para confiar en el órgano fiscalizador.

## 6. Criterios de aceptación
- Dado que un funcionario emite una decisión asistida por IA, cuando el registro se confirma, entonces la decisión queda almacenada con actor, modelo, versión, datos y justificación, y su hash no puede modificarse sin invalidar la cadena.
- Dado que un auditor consulta un registro, cuando solicita su verificación, entonces el sistema devuelve la comparación de hash y confirma la integridad en menos de 2 segundos.
- Dado que una decisión no tiene justificación declarada, cuando se intenta finalizar, entonces el sistema la bloquea y emite una alerta de cumplimiento.
- Dado que se modifica cualquier campo de un registro histórico, cuando se intenta persistir, entonces el sistema lo rechaza y conserva la versión original íntegra.

## 7. Datos y fuentes sugeridas
- Marco normativo de control fiscal venezolano: Ley Orgánica de la Contraloría General de la República y del Sistema Nacional de Control Fiscal (LOCGRSNCF) y normativa de la Contraloría General de la República.
- Repositorios de decisiones administrativas y dictámenes publicados por contralorías estadales y municipales en sus portales de transparencia.
- Modelos de referencia para trazabilidad de IA: tarjetas de modelo (Model Cards), fichas de datos (Datasheets for Datasets) y el estándar de procedencia de datos W3C PROV como esquema de registro.
- Conjuntos de datos históricos de hallazgos de auditoría (anonimizados) para pruebas de carga y validación de criterios.

## 8. Stack tecnológico sugerido
- Backend: Node.js + TypeScript sobre Cloudflare Workers; Python (FastAPI) para servicios de IA y validación de modelos.
- Persistencia inmutable: Cloudflare D1 (SQL) para consultas y Workers KV/R2 para artefactos de evidencia; registro de hashes anclado a una cadena de bloques pública o a un libro de compromisos con hash raíz publicado periódicamente.
- IA: Cloudflare Workers AI para inferencia de modelos y Vectorize para búsqueda de precedentes por similitud.
- Frontend: React + TypeScript desplegado en Cloudflare Pages; autenticación con Cloudflare Access (Zero Trust).
- Verificación: hashes SHA-256 y firma digital por actor; integración con Workers Cron para el anclado periódico del hash raíz.

## 9. Ente público y visión de despliegue
El ente adoptante es un organismo de fiscalización (contraloría estadal, municipal o unidad de auditoría interna del poder público). El despliegue se plantea como un servicio web interno (intranet gubernamental) con una vista pública de consulta de solo lectura para la ciudadanía, desplegado en la nube de Cloudflare con políticas Zero Trust, cuentas de auditoría separadas y respaldo del registro de integridad anclado externamente para evitar la manipulación unilateral.

## 10. Definition of Done
- [ ] Todo registro de decisión incluye actor, modelo, versión, datos y justificación, y queda inmutable tras confirmarse.
- [ ] La verificación de integridad por hash funciona y devuelve resultado en menos de 2 segundos.
- [ ] El sistema bloquea decisiones sin justificación y emite la alerta correspondiente.
- [ ] El panel de auditoría permite filtrar y exportar registros, y cumple accesibilidad WCAG 2.1 AA.
- [ ] Pruebas de carga confirman el soporte de al menos 10 000 decisiones diarias sin degradación.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Trazabilidad de decisiones automatizadas (ledger)
## Problema
No se puede auditar quién decidió qué ni con qué criterio en los procesos de fiscalización asistidos por IA.

## RF / RNF
- RF-01: registro inmutable de decisión con actor, modelo, versión, datos y justificación.
- RF-02: verificación de integridad por hash.
- RF-03: panel de auditoría filtrable y exportable.
- RNF-01: cifrado y control de acceso por roles.
- RNF-02: escalabilidad para 50 entes y 10 000 decisiones diarias.
- RNF-03: registro < 500 ms, verificación < 2 s.
- RNF-04: accesibilidad WCAG 2.1 AA en español.

## Historias de usuario
- Como contralor, quiero ver quién aprobó cada decisión y con qué criterio, para auditar y responsabilizar.
- Como analista, quiero registrar automáticamente modelo y datos, para no perder trazabilidad.
- Como ciudadano, quiero verificar que una sanción fue objetiva y trazable, para confiar en el ente.

## Criterios de aceptación
- Dado un registro confirmado, cuando se intenta modificar, entonces el sistema lo rechaza y conserva la versión original.
- Dado un auditor que verifica, cuando consulta el hash, entonces confirma integridad en < 2 s.
- Dado una decisión sin justificación, cuando se finaliza, entonces se bloquea y alerta.

## Fuera de alcance
- Sustitución del criterio humano por decisiones totalmente autónomas de IA.
- Publicación de datos personales o reservados de los investigados.
- Integración con sistemas internos heredados sin contrato de datos firmado.
```

## 12. Elevator Pitch
Los organismos de fiscalización pública venezolanos toman decisiones cada vez más asistidas por IA, pero hoy nadie puede reconstruir quién aprobó cada dictamen, qué modelo lo generó ni qué datos lo sustentaron. "Trazabilidad de decisiones automatizadas (ledger)" registra de forma inmutable el 100% de esas decisiones —actor, modelo, versión, datos y justificación— y permite a un auditor externo verificar su integridad por hash en menos de 60 segundos. Para contralores, auditores y ciudadanos, transforma la rendición de cuentas: toda sanción o hallazgo queda demostrablemente objetivo, auditable y resistente a la manipulación.

## 13. Impacto en el organismo público
- **Rendición de cuentas verificable:** cada decisión queda vinculada a su actor, modelo, versión, datos y justificación, permitiendo reconstruir el "quién, qué y con qué criterio" de forma inmutable y auditable.
- **Transparencia y confianza ciudadana:** la vista pública de consulta de solo lectura permite que la ciudadanía compruebe que una sanción se basó en criterios objetivos y trazables, reforzando la legitimidad institucional.
- **Eficiencia en auditoría:** la verificación de integridad por hash reduce a menos de 60 segundos el tiempo de un auditor externo, y el panel filtrable y exportable (CSV/PDF) agiliza las labores de fiscalización.
- **Ahorro de recursos:** al automatizar el registro y eliminar anotaciones manuales que se pierden, se reducen reprocesos y el costo de reconstruir expedientes históricos.
- **Cumplimiento normativo y prevención:** las alertas automáticas ante decisiones sin justificación, sin modelo declarado o sin datos de respaldo ayudan a alinearse con el marco de control fiscal (LOCGRSNCF) y a prevenir hallazgos arbitrarios.

## 14. README y documentación del proyecto
El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción** clara del proyecto: "Trazabilidad de decisiones automatizadas (ledger)" — registro inmutable y auditable de decisiones de fiscalización asistidas por IA, resolviendo la imposibilidad de reconstruir quién decidió qué y con qué criterio.
- **Badges** (build, tests, licencia, cobertura).
- **Características** principales: registro inmutable de decisiones; verificación de integridad por hash SHA-256; panel de auditoría con filtros y exportación CSV/PDF; alertas de cumplimiento; revisión retrospectiva (replay); anclado periódico del hash raíz.
- **Arquitectura** (diagrama de componentes y flujo de datos): frontend React (Cloudflare Pages) → backend Node.js/TypeScript (Cloudflare Workers) y Python/FastAPI (servicios de IA) → persistencia en D1/KV/R2 → verificación por hash anclado externamente → vista pública de solo lectura.
- **Instalación y ejecución** (prerrequisitos, pasos, variables de entorno): Node.js, Python, Wrangler; pasos de instalación de dependencias y despliegue; variables de entorno documentadas en `.env.example`.
- **Uso** (ejemplos, endpoints/API, capturas): ejemplos de registro y verificación de decisiones, endpoints de la API y capturas del panel de auditoría.
- **Datos y datasets** (fuentes, formato, cómo obtenerlos): marco normativo de control fiscal (LOCGRSNCF), repositorios de decisiones/dictámenes publicados por contralorías, y datasets históricos anonimizados de hallazgos de auditoría.
- **Pruebas** (cómo correrlas): suite de tests unitarios, de integración y de carga (≥ 10 000 decisiones diarias).
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
