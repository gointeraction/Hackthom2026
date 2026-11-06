# SDD — Anti-bots y anti-fraude en trámites en línea

> Hackathon UNETI IA 2026 · Proyecto #34 · Eje 2 · Ciberseguridad · Complejidad: Media
> Ente público: Portales de trámites

## 1. Problema
Los portales públicos de trámites (registro civil, permisos, solicitudes de documentos) son blanco constante de bots y scripts que agotan turnos, inflan formularios y degradan el servicio para los ciudadanos reales. Esto afecta directamente a los usuarios que necesitan completar un trámite y a las instituciones que ven saturados sus servidores y colas de atención. Detectar y bloquear ese tráfico automatizado es clave para que los trámites sigan siendo accesibles, justos y confiables.

## 2. Objetivos
- Detectar y bloquear al menos el 90 % del tráfico automatizado en los formularios de trámites sin afectar a usuarios legítimos.
- Reducir en un 80 % los envíos de formularios duplicados o fraudulentos en un entorno de pruebas.
- Ofrecer una clasificación de riesgo (humano / sospechoso / bot) en tiempo real, con latencia inferior a 300 ms por solicitud.
- Publicar un panel de monitoreo con métricas de tráfico bloqueado, tasa de falsos positivos y origen de las peticiones.

## 3. Requisitos funcionales (RF)
- RF-01: El sistema debe analizar cada envío de formulario de trámite y clasificarlo como humano, sospechoso o bot en tiempo real.
- RF-02: El sistema debe bloquear o exigir verificación adicional (por ejemplo, un desafío tipo CAPTCHA) cuando una solicitud sea clasificada como bot o supere un umbral de riesgo.
- RF-03: El sistema debe registrar un log auditable de cada decisión con IP, geolocalización aproximada, user-agent, puntaje de riesgo, timestamp y acción tomada.
- RF-04: El sistema debe permitir la administración de una lista de exclusión (allowlist) para IPs u organizaciones legítimas y una lista de bloqueo (denylist) para orígenes maliciosos.
- RF-05: El sistema debe exponer un panel de monitoreo con métricas agregadas: total de solicitudes, bloqueadas, permitidas, tasa de falsos positivos y distribución por origen.
- RF-06: El sistema debe integrarse con los formularios existentes del portal mediante una API o un SDK embebible sin requerir reescritura del backend del trámite.

## 4. Requisitos no funcionales (RNF)
- RNF-01 (seguridad/privacidad): Los datos personales capturados en el análisis (IP, user-agent, geolocalización) deben tratarse conforme a la normativa venezolana de protección de datos, minimizando su retención y anonimizando los registros no esenciales.
- RNF-02 (escalabilidad): El sistema debe soportar picos de demanda típicos de apertura de trámites (por ejemplo, 10 000 solicitudes concurrentes) sin degradación del servicio.
- RNF-03 (rendimiento): La clasificación de cada solicitud debe completarse en menos de 300 ms en el percentil 95, sin bloquear el flujo normal del trámite.
- RNF-04 (accesibilidad/usabilidad): El desafío de verificación debe ser accesible (compatible con lectores de pantalla y teclado) y no excluir a usuarios con conexiones lentas o dispositivos de gama baja.

## 5. Historias de usuario
- Como ciudadano que realiza un trámite en línea, quiero que el sistema distinga mi navegación legítima de un bot, para no quedar bloqueado ni tener que repetir el formulario.
- Como administrador del portal de trámites, quiero ver en un panel qué porcentaje del tráfico es automatizado y desde dónde proviene, para ajustar las reglas de protección.
- Como analista de seguridad del ente público, quiero revisar un log con el motivo y el puntaje de cada bloqueo, para auditar decisiones y reducir falsos positivos.

## 6. Criterios de aceptación
- Dado un formulario de trámite, cuando un bot envía múltiples solicitudes desde la misma IP en un intervalo corto, entonces el sistema lo clasifica como bot y bloquea o desafía al menos el 90 % de esos envíos.
- Dado un usuario humano que completa el formulario de forma normal, cuando envía su solicitud, entonces el sistema lo deja pasar sin desafío en al menos el 95 % de los casos (falsos positivos ≤ 5 %).
- Dado un panel de monitoreo, cuando el administrador consulta las métricas, entonces puede ver el total de solicitudes, bloqueadas, permitidas y la tasa de falsos positivos actualizada en tiempo real.
- Dado un desafío de verificación activado, cuando un usuario lo resuelve correctamente, entonces su solicitud se reanuda y queda registrada como verificada en el log de auditoría.

## 7. Datos y fuentes sugeridas
- Conjuntos de datos de tráfico web y bots: registros de servidores públicos (logs de acceso) de portales de trámites venezolanos, previa anonimización.
- Datasets públicos etiquetados de detección de bots: AWS WAF sample logs, Cloudflare bot management sample data y datasets académicos de tráfico malicioso (por ejemplo, CIC-IDS, CTU-13) adaptados a HTTP.
- Listas públicas de reputación de IP y user-agents de bots: AbuseIPDB, Project Honey Pot, listas de bots conocidos (matomo/referrer-spam-blacklist).
- Datos de referencia de navegación legítima: métricas de Google Analytics o Matomo del propio portal para construir la línea base de comportamiento humano.

## 8. Stack tecnológico sugerido
- Backend de detección: Python (FastAPI) con modelo de clasificación de riesgo (scikit-learn / XGBoost) y reglas heurísticas de frecuencia y reputación de IP.
- Integración con el navegador: Cloudflare Turnstile o hCaptcha como desafío accesible, más Cloudflare Bot Management / WAF como capa de red.
- Almacenamiento y métricas: PostgreSQL (o SQLite para el MVP) para logs y decisiones, Redis para rate-limiting y contadores en memoria, y Grafana + Prometheus para el panel.
- Despliegue: contenedores Docker sobre Cloudflare Workers (edge) o un VPS nacional; API REST para integrar el puntaje de riesgo con los formularios existentes.
- Detección en tiempo real opcional: feature engineering de señales (velocidad de tecleo, movimientos de ratón, tiempos entre campos) enviadas desde el frontend en JavaScript.

## 9. Ente público y visión de despliegue
El sistema está pensado para ser adoptado por portales de trámites de entes públicos venezolanos (registros civiles, alcaldías, oficinas de atención al ciudadano). Se implementa como una capa de protección en el borde: un script JavaScript en el formulario recoge señales de comportamiento, una API de clasificación evalúa el riesgo y un proxy/WAF aplica la decisión (permitir, desafiar o bloquear) sin modificar el backend del trámite. El despliegue piloto se haría en un portal de baja criticidad para calibrar el modelo, y luego se escalaría a los trámites de mayor demanda.

## 10. Definition of Done
- [ ] El modelo de clasificación alcanza ≥ 90 % de detección de bots y ≤ 5 % de falsos positivos sobre un conjunto de datos de prueba etiquetado.
- [ ] La API de clasificación responde en < 300 ms (p95) y soporta la carga objetivo de solicitudes concurrentes.
- [ ] El desafío de verificación está integrado y es accesible (teclado + lector de pantalla).
- [ ] El panel de monitoreo muestra métricas en tiempo real y el log de auditoría registra cada decisión con su motivo.
- [ ] Existe documentación de integración (README + SPEC.md) que permite a un equipo del ente público conectar un formulario nuevo en menos de un día.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Anti-bots y anti-fraude en trámites en línea
## Problema
Los portales de trámites reciben tráfico automatizado (bots) que satura formularios, agota turnos y degrada el servicio a ciudadanos reales.

## RF / RNF
- RF-01: Clasificar cada envío como humano, sospechoso o bot en tiempo real.
- RF-02: Bloquear o desafiar solicitudes de alto riesgo.
- RF-03: Registrar log auditable de cada decisión.
- RF-04: Administrar allowlist/denylist.
- RF-05: Panel de monitoreo con métricas agregadas.
- RF-06: API/SDK para integrar formularios existentes sin reescribir el backend.
- RNF-01: Tratar datos personales conforme a la normativa de protección de datos.
- RNF-02: Soportar picos de 10 000 solicitudes concurrentes.
- RNF-03: Clasificar en < 300 ms (p95).
- RNF-04: Desafío accesible y usable en dispositivos de gama baja.

## Historias de usuario
- Como ciudadano, quiero que mi navegación legítima no sea bloqueada, para completar mi trámite sin fricciones.
- Como administrador, quiero ver métricas de tráfico automatizado, para ajustar las reglas de protección.
- Como analista de seguridad, quiero auditar cada bloqueo con su motivo, para reducir falsos positivos.

## Criterios de aceptación
- Dado un envío masivo desde una misma IP, cuando ocurre en un intervalo corto, entonces ≥ 90 % se bloquea o desafía.
- Dado un usuario humano, cuando completa el formulario normalmente, entonces pasa sin desafío en ≥ 95 % de los casos.
- Dado el panel, cuando el administrador lo consulta, entonces ve métricas actualizadas en tiempo real.
- Dado un desafío, cuando se resuelve correctamente, entonces la solicitud se reanuda y se registra como verificada.

## Fuera de alcance
- Sustituir la infraestructura o el backend de los trámites existentes.
- Autenticación biométrica o verificación de identidad de los ciudadanos.
- Persecución legal o atribución forense de atacantes individuales.
- Protección contra otros tipos de ataque (DDoS volumétrico, inyección SQL) más allá de la detección de bots en formularios.
```

## 12. Elevator Pitch
Los portales de trámites venezolanos —registros civiles, alcaldías y oficinas de atención al ciudadano— pierden turnos y colapsan sus servidores por el tráfico de bots que satura formularios y agota citas. Este proyecto añade una capa de protección en el borde que clasifica cada envío como humano, sospechoso o bot en tiempo real (menos de 300 ms) y aplica la decisión automáticamente: permitir, desafiar con CAPTCHA accesible o bloquear, sin tocar el backend del trámite. El valor diferencial es que el ente público recupera un servicio justo y confiable, con detección ≥ 90 % de bots, falsos positivos ≤ 5 % y un panel de monitoreo auditable para demostrar el impacto a la ciudadanía.

## 13. Impacto en el organismo público
- **Eficiencia operativa:** reduce la saturación de servidores y colas al bloquear el tráfico automatizado, liberando capacidad para que los ciudadanos reales completen sus trámites sin fricciones.
- **Transparencia y auditoría:** cada decisión queda registrada en un log auditable (IP, user-agent, puntaje de riesgo, timestamp y acción tomada), permitiendo al ente público justificar y revisar cada bloqueo.
- **Confianza ciudadana:** al impedir que los bots agoten turnos y dupliquen formularios, los trámites se vuelven más accesibles y equitativos, reforzando la credibilidad del portal.
- **Ahorro de recursos:** la detección automática y el panel de monitoreo reducen el esfuerzo manual de moderación y el costo de infraestructura por tráfico fraudulento.
- **Cumplimiento normativo:** el tratamiento de IP, user-agent y geolocalización se ajusta a la normativa venezolana de protección de datos, minimizando retención y anonimizando registros no esenciales.

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
