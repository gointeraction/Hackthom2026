# SDD — Gestión de identidad y acceso con riesgo adaptativo (IAM)

> Hackathon UNETI IA 2026 · Proyecto #26 · Eje 2 · Ciberseguridad · Complejidad: Media
> Ente público: Sistemas de misión crítica

## 1. Problema
Los sistemas de misión crítica del Estado venezolano dependen de accesos estáticos (usuario/contraseña fija) y contraseñas débiles, lo que expone servicios públicos a suplantación de identidad y accesos no autorizados. Esta debilidad afecta a operadores, funcionarios y ciudadanos, porque una sola credencial comprometida permite a un atacante moverse dentro de la infraestructura sin ser detectado. Importa porque un fallo de autenticación en estos sistemas no solo filtra datos, sino que puede interrumpir servicios esenciales.

## 2. Objetivos
- Reducir en al menos un 80% los accesos con contraseña estática reutilizada o débil mediante autenticación continua basada en riesgo.
- Evaluar el riesgo de cada sesión en tiempo real combinando tres señales: dispositivo, ubicación y comportamiento del usuario.
- Detectar y bloquear accesos anómalos en menos de 5 segundos desde la detección de la desviación de comportamiento.
- Integrar el sistema sin modificar el flujo de inicio de sesión existente, actuando como capa de evaluación de riesgo sobre los sistemas legados.

## 3. Requisitos funcionales (RF)
- RF-01: El sistema debe calcular una puntuación de riesgo (0-100) por cada sesión activa a partir de la identidad del dispositivo (huella de hardware/navegador), la ubicación geográfica/IP y los patrones de comportamiento del usuario.
- RF-02: El sistema debe mantener una línea base de comportamiento por usuario (horarios, velocidad de tecleo, trayectoria del ratón, secuencia de acciones) y compararla contra la actividad en curso.
- RF-03: El sistema debe emitir decisiones automáticas según umbrales de riesgo: permitir, exigir segundo factor (MFA), o revocar/bloquear la sesión.
- RF-04: El sistema debe registrar un evento de auditoría inmutable por cada decisión de riesgo, incluyendo usuario, puntuación, factores contribuyentes y decisión tomada.
- RF-05: El sistema debe enviar alertas al equipo de seguridad cuando la puntuación supere el umbral crítico configurado.

## 4. Requisitos no funcionales (RNF)
- RNF-01: Seguridad/privacidad — los datos biométricos de comportamiento y las huellas de dispositivo se almacenan cifrados (AES-256) y anonimizados; el sistema cumple principios de minimización de datos y no comparte señales con terceros.
- RNF-02: Escalabilidad — debe soportar al menos 10.000 sesiones concurrentes y crecer horizontalmente sin degradar la evaluación de riesgo.
- RNF-03: Rendimiento — la evaluación de riesgo de una acción debe responder en menos de 300 ms (p95) para no entorpecer el trabajo de los operadores.
- RNF-04: Accesibilidad/usabilidad — la fricción (MFA o bloqueo) solo se activa cuando el riesgo lo justifica; los usuarios legítimos con comportamiento estable no deben notar el sistema más del 5% de las sesiones.

## 5. Historias de usuario
- Como operador de un sistema de misión crítica, quiero iniciar sesión sin pasos adicionales cuando mi comportamiento y dispositivo son habituales, para trabajar sin interrupciones innecesarias.
- Como responsable de seguridad del ente público, quiero recibir una alerta y ver la puntuación de riesgo cuando un acceso se desvía del patrón normal, para responder antes de que ocurra un incidente.
- Como funcionario que accede desde un equipo o ubicación nueva, quiero que el sistema me pida un segundo factor solo en ese caso, para confirmar mi identidad sin debilitar la seguridad del servicio.

## 6. Criterios de aceptación
- Dado un usuario con sesión estable y comportamiento habitual, cuando realiza acciones dentro de su patrón, entonces la sesión se mantiene sin fricción adicional.
- Dado un acceso desde un dispositivo no reconocido y una ubicación atípica, cuando el usuario intenta autenticarse, entonces el sistema exige un segundo factor antes de conceder el acceso.
- Dado un usuario cuya velocidad de tecleo y secuencia de acciones se desvían del patrón, cuando la puntuación de riesgo supera el umbral crítico, entonces la sesión se bloquea y se genera una alerta en menos de 5 segundos.
- Dado cualquier acceso denegado o elevado de riesgo, cuando se toma la decisión, entonces se registra un evento de auditoría con la puntuación y los factores contribuyentes.

## 7. Datos y fuentes sugeridas
- Conjuntos de datos de comportamiento de tecleo y ratón: CMU Keystroke Dynamics Benchmark, dataset "DSL-StrongPasswordData" (dinámica de tecleo de 51 sujetos).
- Registros de autenticación simulados basados en logs de sistemas públicos venezolanos (anonimizados) para construir líneas base de horarios y ubicaciones.
- Feed de reputación de IPs y geolocalización: listas públicas de amenazas (Abuse.ch, AlienVault OTX) y servicios de geolocalización (Cloudflare, MaxMind GeoLite2).
- Documentación de referencia: NIST SP 800-63B (autenticación y gestión de credenciales), NIST SP 800-207 (Zero Trust Architecture).

## 8. Stack tecnológico sugerido
- Backend: Python (FastAPI) o Node.js (TypeScript) para el servicio de evaluación de riesgo en tiempo real.
- Modelo de IA/ML: scikit-learn o XGBoost para el clasificador de riesgo y detección de anomalías; isolación forest para desviaciones de comportamiento.
- Base de datos: PostgreSQL (eventos y líneas base) + Redis (sesiones y puntuaciones en memoria).
- Infraestructura: Cloudflare Workers para el endpoint de evaluación, Cloudflare D1/KV para estado distribuido y Turnstile como capa anti-bot complementaria.
- Observabilidad y auditoría: registro inmutable con hashes encadenados (append-only log) y panel de alertas.

## 9. Ente público y visión de despliegue
El sistema es adoptado por entes públicos que operan sistemas de misión crítica (por ejemplo, organismos de seguridad, registro civil, infraestructura de servicios esenciales). Se despliega como una capa de evaluación de riesgo delante de los sistemas legados, mediante un proxy o un servicio de identidad que consume las señales de dispositivo, ubicación y comportamiento sin reemplazar los sistemas de autenticación existentes. La implementación se realiza por fases: primero en modo observación (solo puntuar y registrar), luego en modo activo (exigir MFA y bloquear) para los entornos piloto.

## 10. Definition of Done
- [ ] El motor de riesgo calcula una puntuación 0-100 combinando dispositivo, ubicación y comportamiento, con evidencia de pruebas.
- [ ] La detección de anomalías responde en menos de 300 ms (p95) bajo carga de 10.000 sesiones concurrentes.
- [ ] Las decisiones (permitir, MFA, bloquear) se ejecutan automáticamente según umbrales configurables y verificados.
- [ ] Cada decisión queda registrada en un log de auditoría inmutable con su puntuación y factores.
- [ ] La documentación SPEC.md, el README de despliegue y las pruebas unitarias/de integración están completos y pasando.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Gestión de identidad y acceso con riesgo adaptativo (IAM)
## Problema
Los sistemas de misión crítica del Estado usan accesos estáticos y contraseñas débiles, exponiendo servicios públicos a suplantación y accesos no autorizados.

## RF / RNF
- RF-01: Calcular puntuación de riesgo (0-100) por sesión con señales de dispositivo, ubicación y comportamiento.
- RF-02: Mantener una línea base de comportamiento por usuario y compararla en tiempo real.
- RF-03: Emitir decisiones automáticas: permitir, exigir MFA o bloquear.
- RF-04: Registrar evento de auditoría inmutable por cada decisión.
- RNF-01: Seguridad/privacidad con cifrado AES-256 y minimización de datos.
- RNF-02: Escalabilidad para 10.000 sesiones concurrentes.
- RNF-03: Rendimiento < 300 ms (p95) por evaluación.
- RNF-04: Fricción solo cuando el riesgo lo justifica.

## Historias de usuario
- Como operador, quiero iniciar sesión sin pasos extra cuando mi comportamiento es habitual, para trabajar sin interrupciones.
- Como responsable de seguridad, quiero recibir alertas ante desviaciones de riesgo, para responder antes de un incidente.
- Como funcionario con equipo nuevo, quiero que se me pida un segundo factor solo en ese caso, para confirmar mi identidad.

## Criterios de aceptación
- Dado comportamiento habitual, cuando actúo dentro de mi patrón, entonces la sesión se mantiene sin fricción.
- Dado dispositivo no reconocido y ubicación atípica, cuando intento autenticarme, entonces se exige MFA.
- Dado desvío de comportamiento que supera el umbral crítico, cuando se detecta, entonces la sesión se bloquea y se alerta en < 5 segundos.
- Dado cualquier decisión de riesgo, cuando se toma, entonces se registra auditoría con puntuación y factores.

## Fuera de alcance
- Reemplazar los sistemas de autenticación legados existentes.
- Biometría física (huella dactilar, reconocimiento facial) en esta fase.
- Gestión de contraseñas y políticas de rotación de credenciales.
- Acceso a datos personales de ciudadanos más allá de las señales mínimas de autenticación.
```

## 12. Elevator Pitch
Los sistemas de misión crítica del Estado venezolano dependen de contraseñas estáticas y débiles, y una sola credencial comprometida basta para que un atacante se mueva sin ser detectado. Nuestro proyecto añade una capa de autenticación continua basada en riesgo que puntúa cada sesión en tiempo real combinando dispositivo, ubicación y comportamiento, y decide automáticamente permitir, exigir un segundo factor o bloquear en menos de 5 segundos. Se integra sin tocar el flujo de inicio de sesión existente, por lo que los entes que operan sistemas de misión crítica ganan protección real sin rediseñar su infraestructura. El resultado: menos accesos no autorizados y un equipo de seguridad que responde antes de que ocurra un incidente.

## 13. Impacto en el organismo público
- **Reducción del riesgo de suplantación**: al sustituir la dependencia de contraseñas estáticas por evaluación continua, se reducen los accesos no autorizados derivados de credenciales comprometidas en los sistemas de misión crítica.
- **Eficiencia operativa para el personal de seguridad**: las decisiones automáticas (permitir, MFA, bloquear) y las alertas ante riesgo crítico evitan la revisión manual de cada acceso y acortan el tiempo de respuesta.
- **Menor fricción para operadores y funcionarios legítimos**: la fricción (MFA o bloqueo) solo se activa cuando el riesgo lo justifica, de modo que el trabajo diario no se interrumpe de forma innecesaria.
- **Transparencia y auditoría**: cada decisión queda en un registro inmutable con puntuación y factores contribuyentes, lo que facilita la rendición de cuentas y la investigación de incidentes.
- **Cumplimiento normativo y alineación con buenas prácticas**: la solución se apoya en NIST SP 800-63B y NIST SP 800-207 (Zero Trust), reforzando la postura de seguridad frente a estándares reconocidos.
- **Ahorro de recursos e integración progresiva**: se despliega como capa sobre los sistemas legados (primero observación, luego modo activo), evitando costosos rediseños y permitiendo validar en entornos piloto antes de escalar.

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
