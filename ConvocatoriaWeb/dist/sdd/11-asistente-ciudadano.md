# SDD — Asistente ciudadano estatal con IA explicable

> Hackathon UNETI IA 2026 · Proyecto #11 · Eje 1 · IA Ética · Complejidad: Media
> Ente público: Gobernaciones / alcaldías

## 1. Problema

La atención ciudadana en gobernaciones y alcaldías es lenta y opaca: trámites sin estado visible, respuestas sin sustento y sin registro de lo prometido. Afecta a ciudadanos que necesitan saber el estado de un permiso, una denuncia o una solicitud, y a los funcionarios que no pueden demostrar qué respondieron ni por qué. Importa porque la confianza pública se pierde cuando la gestión no se puede auditar ni citar.

## 2. Objetivos

- Reducir el tiempo medio de respuesta ciudadana de días a menos de 60 segundos para consultas frecuentes, medido con telemetría del asistente.
- Garantizar que el 100 % de las respuestas generadas incluyan al menos una fuente oficial (ley, ordenanza, gaceta o URL del ente) citada de forma verificable.
- Mostrar una puntuación de confianza por respuesta y permitir auditar el historial completo de cada interacción ciudadana.
- Escalar un incidente a un funcionario humano cuando la confianza de la respuesta sea inferior al umbral definido, dejando trazabilidad del traspaso.

## 3. Requisitos funcionales (RF)

- RF-01: El sistema expone una ventanilla única (web y chat) donde el ciudadano puede consultar trámites, requisitos, estados y plazos usando lenguaje natural.
- RF-02: Cada respuesta incluye citas enlazadas a la fuente oficial (ley, ordenanza, gaceta municipal/regional o página del ente) de la que se extrajo la información.
- RF-03: El sistema calcula y muestra un indicador de confianza (porcentaje o nivel alto/medio/bajo) junto a cada respuesta, derivado de la solidez de las fuentes y la coincidencia semántica.
- RF-04: Toda interacción queda registrada en un registro de auditoría inmutable: pregunta, respuesta, fuentes citadas, confianza, modelo utilizado y funcionario que intervino si hubo escalamiento.
- RF-05: Cuando la confianza está por debajo de un umbral configurable, el sistema deriva la consulta a un operador humano con el contexto completo pre-cargado.
- RF-06: El ciudadano puede calificar la respuesta (útil/no útil) y solicitar revisión humana, retroalimentación que alimenta la mejora del sistema.

## 4. Requisitos no funcionales (RNF)

- RNF-01: Seguridad y privacidad — los datos personales del ciudadano se minimizan y cifran; el acceso al registro de auditoría requiere roles (ciudadano ve lo suyo, auditor ve lo autorizado) y no se comparte información con terceros.
- RNF-02: Escalabilidad — la ventanilla debe soportar picos de demanda (por ejemplo, temporadas de pago de tributos o declaraciones) con escalado horizontal y caché de respuestas frecuentes.
- RNF-03: Rendimiento — la primera respuesta debe generarse en menos de 3 segundos en condiciones normales, con colas y reintentos para no perder solicitudes.
- RNF-04: Accesibilidad y usabilidad — interfaz en español, compatible con lectores de pantalla (WCAG 2.1 AA), legible en móvil y con lenguaje claro, evitando jerga administrativa.

## 5. Historias de usuario

- Como ciudadano, quiero preguntar por el estado de mi trámite en lenguaje natural, para saber en qué etapa está sin tener que ir presencialmente a la oficina.
- Como ciudadano, quiero ver la fuente oficial de cada respuesta y su nivel de confianza, para confiar en que la información es veraz y no inventada.
- Como funcionario de atención, quiero recibir las consultas de baja confianza con su contexto completo, para responder con criterio y dejar registro de mi intervención.

## 6. Criterios de aceptación

- Dado que el ciudadano pregunta por un requisito de un trámite, cuando el sistema responde, entonces la respuesta incluye al menos una URL o referencia normativa verificable y una puntuación de confianza visible.
- Dado que una consulta obtiene confianza inferior al umbral, cuando el sistema evalúa la respuesta, entonces la deriva a un operador humano y registra el evento en el registro de auditoría.
- Dado que un auditor consulta una interacción pasada, cuando abre el registro, entonces puede ver pregunta, respuesta, fuentes citadas, modelo y confianza asociados a esa interacción.
- Dado que el sistema cita una fuente inexistente o desactualizada, cuando se valida el enlace, entonces la respuesta se marca con confianza baja y no se presenta como certeza.

## 7. Datos y fuentes sugeridas

- Gacetas Oficiales de la República Bolivariana de Venezuela y gacetas municipales/regionales del ente (fuente primaria normativa).
- Ley Orgánica de Procedimientos Administrativos (LOPA) y ordenanzas municipales vigentes del ente objetivo.
- Portales oficiales de gobernaciones y alcaldías (páginas de trámites, requisitos y tasas) para construir la base de conocimiento con enlaces verificables.
- Preguntas frecuentes y manuales de trámites internos del ente, revisados y validados por el equipo jurídico antes de indexarlos.
- Conjuntos de datos de atención ciudadana anonimizados del propio ente (históricos de tickets) para entrenar/afinar la clasificación de consultas.

## 8. Stack tecnológico sugerido

- Frontend: Next.js (React + TypeScript) desplegado en Cloudflare Pages, con diseño accesible y componentes en Tailwind CSS.
- Backend: Cloudflare Workers con Workers AI para generación y embeddings, usando un modelo de lenguaje con contexto recuperado (RAG).
- Recuperación: Cloudflare Vectorize para búsqueda semántica sobre la base normativa y de trámites, y D1 (SQLite) para el registro de auditoría y sesiones.
- Orquestación y agentes: Cloudflare Agents SDK para manejar la conversación, el escalamiento humano y colas de tareas con Workflows.
- Observabilidad: Cloudflare Workers Analytics + logs estructurados para medir latencia, tasa de escalamiento y calidad de citas.
- Seguridad: Cloudflare Access para roles (ciudadano / funcionario / auditor) y Turnstile para proteger los formularios públicos.

## 9. Ente público y visión de despliegue

El sistema lo adopta una gobernación o alcaldía como capa de atención ciudadana sobre su portal y sus canales de mensajería existentes. Se despliega como una ventanilla única embebida en el sitio web del ente (y opcionalmente en WhatsApp o Telegram vía un puente), conectada a su base normativa interna. El despliegue comienza con un piloto acotado a 3-5 trámites de alta demanda, con validación jurídica de las fuentes antes de publicar, y se expande por fases a medida que el equipo valida la calidad de las citas y el registro de auditoría.

## 10. Definition of Done

- [ ] La ventanilla responde consultas frecuentes con cita de fuente oficial y puntuación de confianza visible.
- [ ] El registro de auditoría conserva pregunta, respuesta, fuentes, confianza y modelo de cada interacción, con control de acceso por rol.
- [ ] El escalamiento humano se activa con confianza baja y deja trazabilidad del traspaso.
- [ ] Se cumplen los umbrales de rendimiento (respuesta < 3 s) y accesibilidad (WCAG 2.1 AA) en pruebas.
- [ ] El piloto incluye 3-5 trámites validados jurídicamente y una guía de despliegue para el ente público.

## 11. Plantilla SPEC.md (lista para copiar)

```markdown
# SPEC — Asistente ciudadano estatal con IA explicable

## Problema
La atención ciudadana en gobernaciones y alcaldías es lenta y opaca: sin estado visible, sin fuentes y sin auditoría.

## RF / RNF
- RF-01: Ventanilla única con consultas en lenguaje natural.
- RF-02: Respuestas con citas a fuentes oficiales.
- RF-03: Puntuación de confianza por respuesta.
- RF-04: Registro de auditoría inmutable de cada interacción.
- RF-05: Escalamiento humano con confianza baja.
- RNF-01: Seguridad y privacidad (datos minimizados, roles, cifrado).
- RNF-02: Escalabilidad ante picos de demanda.
- RNF-03: Rendimiento (respuesta < 3 s).
- RNF-04: Accesibilidad WCAG 2.1 AA y usabilidad móvil.

## Historias de usuario
- Como ciudadano, quiero consultar el estado de mi trámite en lenguaje natural, para no ir presencialmente.
- Como ciudadano, quiero ver la fuente y la confianza de cada respuesta, para confiar en la información.
- Como funcionario, quiero recibir consultas de baja confianza con contexto, para responder y dejar registro.

## Criterios de aceptación
- Dado que pregunto por un trámite, cuando el sistema responde, entonces cita una fuente verificable y muestra confianza.
- Dado que la confianza es baja, cuando se evalúa, entonces se deriva a un humano y se audita el evento.
- Dado que un auditor revisa una interacción, cuando la abre, entonces ve pregunta, respuesta, fuentes, modelo y confianza.

## Fuera de alcance
- Resolución automática de trámites (firma y aprobación siguen siendo humanas).
- Sustitución de los sistemas legales o de gestión documental del ente.
- Atención de emergencias (911/seguridad) o diagnósticos médicos.
- Garantía de veracidad sin validación jurídica previa de las fuentes indexadas.
```

## 12. Elevator Pitch
Los ciudadanos de gobernaciones y alcaldías esperan días por respuestas sin estado visible ni sustento verificable. Nuestro asistente ciudadano estatal con IA explicable les responde en menos de 60 segundos por una ventanilla única —web y chat— con la fuente oficial citada y una puntuación de confianza visible en cada respuesta. Cuando la confianza es baja, el sistema deriva al funcionario humano con todo el contexto y deja un registro de auditoría inmutable, de modo que el ente público puede demostrar qué respondió, por qué y con qué fundamento normativo.

## 13. Impacto en el organismo público
- **Eficiencia:** reduce el tiempo medio de respuesta ciudadana de días a menos de 60 segundos para consultas frecuentes, liberando al personal de atención de tareas repetitivas.
- **Transparencia:** cada respuesta incluye al menos una fuente oficial (ley, ordenanza, gaceta o URL del ente) y una puntuación de confianza, lo que hace auditable y verificable toda la gestión.
- **Confianza ciudadana:** el ciudadano ve la fuente y la confianza de cada respuesta y puede calificarla o solicitar revisión humana, fortaleciendo la credibilidad del ente.
- **Ahorro de recursos:** el registro de auditoría inmutable y el escalamiento automático de consultas de baja confianza reducen retrabajo, llamadas repetidas y visitas presenciales.
- **Cumplimiento y trazabilidad:** deja evidencia de pregunta, respuesta, fuentes, modelo y funcionario interviniente, facilitando la rendición de cuentas y el control normativo.

## 14. README y documentación del proyecto
El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción** clara del proyecto: asistente ciudadano estatal con IA explicable que responde consultas de trámites citando fuentes oficiales, con confianza visible y auditoría inmutable.
- **Badges** (build, tests, licencia, cobertura).
- **Características** principales: ventanilla única web/chat, respuestas con citas verificables, puntuación de confianza, registro de auditoría inmutable, escalamiento humano por confianza baja y retroalimentación ciudadana.
- **Arquitectura** (diagrama de componentes y flujo de datos: Next.js → Workers AI/RAG → Vectorize/D1 → Agents SDK/Workflows → auditoría).
- **Instalación y ejecución** (prerrequisitos, pasos, variables de entorno).
- **Uso** (ejemplos, endpoints/API, capturas).
- **Datos y datasets** (gacetas oficiales, LOPA y ordenanzas, portales de trámites, históricos anonimizados de tickets; formato y cómo obtenerlos).
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
