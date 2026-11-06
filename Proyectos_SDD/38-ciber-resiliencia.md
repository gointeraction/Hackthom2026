# SDD — Ciber-resiliencia y continuidad de servicios públicos

> Hackathon UNETI IA 2026 · Proyecto #38 · Eje 2 · Ciberseguridad · Complejidad: Media
> Ente público: Servicios ciudadanos

## 1. Problema
Un ciberataque (ransomware, borrado masivo o fallo de infraestructura) puede dejar caídos servicios ciudadanos esenciales — portales de trámites, sistemas de salud o pagos de tasas — durante días, porque no existen respaldos verificados ni planes de recuperación probados. Afecta directamente a ciudadanos que no pueden realizar trámites y a las instituciones públicas que pierden confianza y operatividad. Importa porque cada hora de indisponibilidad implica pérdidas económicas, datos irrecuperables y riesgo reputacional para el Estado.

## 2. Objetivos
- Reducir el tiempo de recuperación ante un incidente (RTO) de "días" a **menos de 4 horas** para los 3 servicios ciudadanos más críticos.
- Garantizar que **100 % de los respaldos** se verifiquen automáticamente (integridad + restaurabilidad) al menos una vez por semana.
- Automatizar **al menos 2 simulacros de recuperación mensuales** con evidencia auditable y sin intervención manual en producción.
- Disminuir el punto de pérdida de datos (RPO) a **máximo 15 minutos** en los sistemas transaccionales priorizados.

## 3. Requisitos funcionales (RF)
- RF-01: El sistema debe ejecutar **respaldos automáticos programados** (diarios incrementales y semanales completos) de bases de datos, ficheros y configuraciones de los servicios ciudadanos priorizados.
- RF-02: El sistema debe **verificar la integridad y restaurabilidad** de cada respaldo (hash + restauración de prueba en entorno aislado) y emitir un informe de conformidad por cada ejecución.
- RF-03: El sistema debe ofrecer **planes de recuperación versionados** (runbooks) que, al activarse, restauren el servicio, validen su funcionamiento y registren métricas de RTO/RPO.
- RF-04: El sistema debe generar **alertas tempranas** cuando un respaldo falle, esté corrupto o se desvíe del cronograma, notificando al equipo de operaciones por correo y canal interno.
- RF-05: El sistema debe mantener un **panel de resiliencia** que muestre estado de respaldos, últimos simulacros, RTO/RPO reales y servicios recuperables.
- RF-06: El sistema debe almacenar copias **en al menos dos ubicaciones** (una en Cloudflare R2 con retención inmutable/object lock y otra local o en un segundo proveedor) para resistir borrado o cifrado malicioso.

## 4. Requisitos no funcionales (RNF)
- RNF-01: **Seguridad/privacidad** — los respaldos deben cifrarse en reposo (AES-256) y en tránsito (TLS 1.3); el acceso se regirá por roles y autenticación multifactor, y los datos personales de ciudadanos cumplirán la normativa venezolana de protección de datos.
- RNF-02: **Escalabilidad** — la solución debe soportar el crecimiento de al menos 20 entes/portales conectados sin rediseño, usando almacenamiento de objetos elástico y colas de trabajo.
- RNF-03: **Rendimiento** — la restauración de un servicio priorizado debe iniciar en menos de 5 minutos desde la activación del plan y completarse dentro del RTO de 4 horas.
- RNF-04: **Accesibilidad/usabilidad** — el panel debe cumplir WCAG 2.1 nivel AA, estar en español y permitir activar un plan de recuperación en menos de 3 clics, con lenguaje claro para personal técnico y directivo no especializado.

## 5. Historias de usuario
- Como **operador de TI del ente público**, quiero activar un plan de recuperación con un solo botón y ver el progreso en tiempo real, para restablecer el servicio ciudadano sin depender de pasos manuales.
- Como **directivo/responsable de la institución**, quiero recibir un informe semanal de respaldos verificados y simulacros ejecutados, para demostrar cumplimiento y tomar decisiones con evidencia.
- Como **auditor de seguridad**, quiero consultar el historial inmutable de respaldos, verificaciones y simulacros, para comprobar que la recuperación fue probada y no solo declarada.

## 6. Criterios de aceptación
- Dado un respaldo programado, cuando finaliza la copia, entonces el sistema calcula y almacena su hash, intenta restaurarlo en un entorno aislado y marca el respaldo como "verificado" o "fallido" con su informe.
- Dado un incidente simulado sobre un servicio ciudadano, cuando el operador activa el plan de recuperación, entonces el servicio queda restaurado y validado en menos de 4 horas y se registran RTO y RPO reales.
- Dado un respaldo corrupto o ausente, cuando se detecta la anomalía, entonces se genera una alerta al equipo de operaciones en menos de 5 minutos con la causa y el respaldo afectado.
- Dado un ataque que borra la copia primaria, cuando se intenta recuperar, entonces la copia secundaria inmutable en Cloudflare R2 permite restaurar los datos sin pérdida mayor a 15 minutos.

## 7. Datos y fuentes sugeridas
- **Registros de disponibilidad/incidentes** del ente público objetivo (tiempos de caída históricos por servicio, causa raíz).
- **Inventario de servicios ciudadanos críticos** (catálogo de trámites, dependencias, BIA — análisis de impacto al negocio).
- **Métricas sintéticas**: series de RTO/RPO objetivo vs. real de simulacros previos (si existen) o generadas para el demo.
- **Frameworks y referencias**: NIST SP 800-34 (planificación de contingencia), NIST CSF 2.0 (función *Recover*), CIS Controls v8 (control 11: Recuperación de datos).
- **Datos públicos de Venezuela**: portales de trámites y estadísticas de servicios en línea para dimensionar volúmenes de transacciones.

## 8. Stack tecnológico sugerido
- **Backend**: Python (FastAPI) o Node.js (TypeScript) para la orquestación de respaldos y runbooks.
- **Despliegue serverless**: Cloudflare Workers + **Workflows** (o Durable Objects) para orquestar verificaciones y simulacros con reintentos y persistencia.
- **Almacenamiento de respaldos**: Cloudflare **R2** con *Object Lock* (inmutabilidad) y retención; cifrado AES-256.
- **Base de datos / estado**: Cloudflare **D1** (SQLite) para registrar inventario de respaldos, verificaciones y simulacros; **KV** para configuración y banderas.
- **Colas y programación**: Cloudflare **Queues** + **Cron Triggers** para tareas periódicas y reintentos de restauración.
- **Notificaciones**: Cloudflare Email Service para alertas por correo; Webhook/API para canales internos (Telegram/Slack).
- **IA de apoyo**: Workers AI (modelos de texto) para clasificar incidentes, resumir informes de simulacro y proponer pasos de recuperación a partir de los runbooks.
- **Frontend**: React + Tailwind para el panel de resiliencia (dashboards, estado, activación de planes).

## 9. Ente público y visión de despliegue
Lo adopta un **ente público que gestiona servicios ciudadanos** (p. ej., una alcaldía, gobernación u organismo nacional con portales de trámites, recaudación y salud). Se implementa como una capa de resiliencia transversal: un agente ligero (Worker o conector) se integra a los sistemas existentes para tomar respaldos y registrar configuraciones, mientras el núcleo en Cloudflare orquesta verificaciones, simulacros y runbooks. El despliegue es progresivo: primero 3 servicios piloto, luego el resto del catálogo, con simulacros mensuales obligatorios y un panel único para operaciones y dirección.

## 10. Definition of Done
- [ ] Los respaldos automáticos se ejecutan según cronograma y cada uno queda con estado "verificado" o "fallido" registrado.
- [ ] Existe un plan de recuperación versionado y ejecutable para cada servicio priorizado.
- [ ] Al menos 2 simulacros de recuperación automatizados se ejecutan al mes con evidencia auditable (RTO/RPO medidos).
- [ ] La copia inmutable en R2 con Object Lock está operativa y se demuestra una restauración desde ella.
- [ ] El panel muestra estado de resiliencia y las alertas de respaldo fallido llegan en menos de 5 minutos.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Ciber-resiliencia y continuidad de servicios públicos
## Problema
Un ciberataque puede dejar caídos servicios ciudadanos esenciales por días por falta de respaldos verificados y recuperación probada.

## RF / RNF
- RF-01: Respaldos automáticos programados (diarios incrementales, semanales completos).
- RF-02: Verificación de integridad y restaurabilidad con informe por respaldo.
- RF-03: Planes de recuperación versionados que restauran y validan el servicio.
- RF-04: Alertas tempranas ante respaldos fallidos o corruptos.
- RF-05: Panel de resiliencia con estado, simulacros y RTO/RPO.
- RF-06: Copias en dos ubicaciones (R2 inmutable + local/secundario).
- RNF-01: Cifrado AES-256 en reposo, TLS 1.3 en tránsito, MFA y roles.
- RNF-02: Escalable a 20+ entes sin rediseño.
- RNF-03: Restauración iniciada en <5 min y completada en <4 h.
- RNF-04: WCAG 2.1 AA, español, activación en <3 clics.

## Historias de usuario
- Como operador de TI, quiero activar un plan con un clic, para restaurar el servicio sin pasos manuales.
- Como directivo, quiero un informe semanal de respaldos y simulacros, para decidir con evidencia.
- Como auditor, quiero historial inmutable de respaldos y simulacros, para comprobar la recuperación probada.

## Criterios de aceptación
- Dado un respaldo, cuando finaliza, entonces se verifica hash + restauración y se marca "verificado" o "fallido".
- Dado un incidente, cuando se activa el plan, entonces el servicio queda restaurado en <4 h con RTO/RPO medidos.
- Dado un respaldo corrupto, cuando se detecta, entonces se alerta en <5 min con causa y respaldo afectado.
- Dado un borrado de la copia primaria, cuando se recupera, entonces la copia inmutable en R2 restaura sin pérdida >15 min.

## Fuera de alcance
- Respuesta a incidentes de red perimetral (firewall/IPS) y análisis forense profundo.
- Recuperación de hardware físico o reconstrucción de centros de datos.
- Gestión de identidades y autenticación de usuarios finales ciudadanos.
- Cumplimiento normativo integral (se documenta, no se audita formalmente en esta fase).
```

## 12. Elevator Pitch
Un ciberataque no debería poder tumbar los trámites, la salud o los pagos de un ente público durante días. Este proyecto despliega una capa de resiliencia que automatiza respaldos, los verifica de verdad (integridad y restauración de prueba) y ensaya la recuperación cada mes, reduciendo el tiempo de caída de "días" a menos de 4 horas y la pérdida de datos a un máximo de 15 minutos. Está pensado para el ente público que gestiona servicios ciudadanos (alcaldía, gobernación u organismo nacional con portales de trámites, recaudación y salud), que recupera operatividad, evidencia auditable y confianza ciudadana. Su diferencial: respaldos inmutables en Cloudflare R2 con Object Lock, verificaciones automáticas semanales y simulacros con métricas de RTO/RPO, no solo copias que "se supone" funcionan.

## 13. Impacto en el organismo público
- **Eficiencia operativa**: la activación de un plan de recuperación pasa de pasos manuales a un solo clic, con restauración iniciada en menos de 5 minutos y completada en menos de 4 horas, devolviendo el servicio a los ciudadanos lo antes posible.
- **Transparencia y auditoría**: un historial inmutable de respaldos, verificaciones y simulacros permite al directivo y al auditor demostrar con evidencia que la recuperación fue probada y no solo declarada.
- **Confianza ciudadana**: menos interrupciones y recuperaciones más rápidas reducen el riesgo reputacional del Estado y la percepción de fragilidad de los servicios en línea.
- **Ahorro de recursos**: al automatizar respaldos, verificaciones y simulacros se elimina el trabajo manual repetitivo del equipo de TI y se evitan los costos de caídas prolongadas e incidentes no ensayados.
- **Cumplimiento normativo**: el cifrado AES-256, TLS 1.3, MFA y roles, junto con los informes de conformidad semanales y la alineación a NIST SP 800-34, NIST CSF 2.0 y CIS Controls v8, respaldan las obligaciones de continuidad y protección de datos del organismo.

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
