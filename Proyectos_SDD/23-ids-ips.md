# SDD — IDS/IPS para redes gubernamentales

> Hackathon UNETI IA 2026 · Proyecto #23 · Eje 2 · Ciberseguridad · Complejidad: Avanzada
> Ente público: Ministerios / gobernaciones

## 1. Problema
Las redes de datos de ministerios y gobernaciones de Venezuela son blanco constante de intrusiones, escaneos y exfiltración de información sensible, y los equipos de TI estatales carecen de visibilidad en tiempo real sobre el tráfico malicioso. Esta situación compromete infraestructura crítica y datos de la ciudadanía, por lo que se requiere una capa de detección y prevención de intrusos (IDS/IPS) automatizada basada en aprendizaje automático (ML) sobre el tráfico de red estatal.

## 2. Objetivos
- Detectar al menos el 90% de las intrusiones del conjunto de referencia (detecciones por firma conocidas) con una tasa de falsos positivos menor al 5% en pruebas con datos etiquetados.
- Clasificar el tráfico de red en tiempo real (o cuasi-real, latencia < 1 s por flujo) en las categorías: normal, escaneo/DoS, intrusión de red y ataque web.
- Emitir alertas con severidad y mitigación sugerida, integrables con un SIEM o panel de monitoreo del ente público.
- Reducir el tiempo medio de detección (MTTD) de incidentes de horas a minutos mediante automatización de la inspección de flujos.

## 3. Requisitos funcionales (RF)
- RF-01: Ingestionar tráfico de red estatal en formato PCAP/flujo (NetFlow/IPFIX) y extraer características por flujo (duración, bytes, paquetes, protocolo, flags, puertos, direcciones).
- RF-02: Preprocesar y normalizar las características para el modelo de ML (manejo de valores faltantes, escalado y codificación de variables categóricas).
- RF-03: Entrenar y evaluar un modelo de clasificación de intrusos con métricas de precisión, recall y F1-score, usando un conjunto de datos etiquetado (IDS).
- RF-04: Clasificar flujos en línea y emitir una alerta con severidad (baja/media/alta/crítica) cuando se detecte una amenaza.
- RF-05: Bloquear o cuarentenar automáticamente direcciones IP y flujos maliciosos (modo IPS) mediante reglas dinámicas de firewall o integración con el plano de control de red.
- RF-06: Persistir detecciones y eventos en una base de datos con marca de tiempo, IP origen/destino, tipo de ataque y confianza del modelo, para auditoría y reportes.

## 4. Requisitos no funcionales (RNF)
- RNF-01: Seguridad/privacidad — el sistema debe operar sobre tráfico autorizado, cifrar credenciales y registros, aplicar control de acceso basado en roles (RBAC) y no exponer cargas útiles (payloads) sensibles de los usuarios de la red estatal.
- RNF-02: Escalabilidad — soportar el análisis de múltiples puntos de red (sedes, ministerios y gobernaciones) con procesamiento distribuido y colas de mensajería, creciendo horizontalmente.
- RNF-03: Rendimiento — procesar el volumen de flujos de una red estatal con latencia de inferencia inferior a 1 segundo por flujo y disponibilidad del 99,5% en horario de operación.
- RNF-04: Accesibilidad/usabilidad — panel de monitoreo en español, con filtros por severidad, IP y tipo de ataque, accesible para personal técnico no especializado en ML.

## 5. Historias de usuario
- Como analista de seguridad de un ministerio, quiero ver en un panel las alertas de intrusión clasificadas por severidad, para priorizar la respuesta ante incidentes en tiempo real.
- Como administrador de red de una gobernación, quiero que el sistema bloquee automáticamente IPs maliciosas detectadas, para contener ataques sin intervención manual inmediata.
- Como responsable de TI del ente público, quiero exportar reportes de detecciones y métricas del modelo, para justificar inversiones y auditar la seguridad de la red.

## 6. Criterios de aceptación
- Dado un conjunto de flujos etiquetados de prueba, cuando el modelo procesa el conjunto, entonces alcanza un F1-score ≥ 0,90 y una tasa de falsos positivos ≤ 5%.
- Dado un flujo de red malicioso en vivo, cuando ingresa al sistema, entonces se genera una alerta con severidad y tipo de ataque en menos de 1 segundo.
- Dado que se detecta una IP maliciosa recurrente, cuando se activa el modo IPS, entonces se aplica una regla de bloqueo y la IP queda cuarentenada en la política de red.
- Dado un evento de intrusión persistido, cuando el analista consulta el panel, entonces puede filtrar por IP origen, severidad y rango de fechas y ver el detalle del evento.

## 7. Datos y fuentes sugeridas
- CIC-IDS2017 y CIC-IDS2018 (Canadian Institute for Cybersecurity): flujos etiquetados de ataques DoS/DDoS, escaneos, fuerza bruta y ataques web.
- UNSW-NB15: tráfico moderno con nueve familias de ataques (fuzzers, exploits, backdoors, DoS, etc.).
- NSL-KDD: versión corregida del KDD Cup 1999, útil como línea base de comparación.
- CSE-CIC-IDS2018 en AWS: tráfico generado en infraestructura con ataques de red variados.
- Capturas propias de la red estatal (previo acuerdo y anonimización de payloads) para validar el modelo en el dominio real del ente público.

## 8. Stack tecnológico sugerido
- Lenguajes: Python 3.11+ (procesamiento y ML) y SQL para consultas de eventos.
- ML: scikit-learn (Random Forest, Gradient Boosting), XGBoost y, opcionalmente, PyTorch para redes neuronales sobre características de flujo.
- Procesamiento de tráfico: Scapy y CICFlowMeter para extraer características de PCAP/flujos; Suricata o Zeek como motor de detección por firma complementario.
- Backend y streaming: FastAPI (API REST), Apache Kafka o NATS para ingesta de flujos y publicación de alertas.
- Almacenamiento: PostgreSQL (eventos) y Redis (cache y reglas de bloqueo en caliente).
- Despliegue en la nube: Cloudflare (Tunnel para exposición segura, WAF/DDoS como capa de borde) y Workers para endpoints ligeros; Workers AI para inferencia auxiliar de clasificación de texto de alertas.
- Panel: Grafana (dashboards) o un frontend en React/Next.js desplegado en Cloudflare Pages.
- Orquestación: Docker y Docker Compose para el piloto; Kubernetes para despliegue multi-sede.

## 9. Ente público y visión de despliegue
Lo adoptan ministerios y gobernaciones de Venezuela a través de sus direcciones de tecnología o unidades de ciberseguridad. El sistema se despliega como piloto en un punto de espejo de red (SPAN/TAP) del ente, en modo pasivo (IDS) para ajustar umbrales, y luego pasa a modo activo (IPS) acoplado al firewall perimetral. Cada sede envía eventos a un concentrador central del ente, donde un equipo SOC (Security Operations Center) supervisa las alertas y define políticas de bloqueo por gobernación, garantizando la soberanía de los datos en infraestructura estatal.

## 10. Definition of Done
- [ ] El pipeline ingesta PCAP/flujos y extrae las características de red definidas en RF-01.
- [ ] El modelo de ML está entrenado y evaluado, con F1-score ≥ 0,90 y tasa de falsos positivos ≤ 5% sobre datos de prueba no vistos.
- [ ] La API y el panel emiten y muestran alertas con severidad en menos de 1 segundo por flujo.
- [ ] El modo IPS aplica y revierte reglas de bloqueo de forma verificable y auditada.
- [ ] Existe documentación de despliegue (README) y un reporte de métricas del modelo para el ente público.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — IDS/IPS para redes gubernamentales
## Problema
Las redes de ministerios y gobernaciones sufren intrusiones constantes sin visibilidad automatizada; se necesita un IDS/IPS con ML sobre el tráfico estatal.

## RF / RNF
- RF-01: Ingestionar tráfico PCAP/flujo y extraer características.
- RF-02: Preprocesar y normalizar características para ML.
- RF-03: Entrenar y evaluar clasificador de intrusos (F1 ≥ 0,90).
- RF-04: Clasificar flujos en línea y emitir alertas con severidad.
- RF-05: Bloquear IPs/flujos maliciosos (modo IPS).
- RF-06: Persistir detecciones para auditoría.
- RNF-01: Seguridad y privacidad (cifrado, RBAC, sin payloads sensibles).
- RNF-02: Escalabilidad distribuida multi-sede.
- RNF-03: Rendimiento con inferencia < 1 s y disponibilidad 99,5%.
- RNF-04: Usabilidad del panel en español para personal técnico.

## Historias de usuario
- Como analista de seguridad, quiero ver alertas clasificadas por severidad, para priorizar la respuesta.
- Como administrador de red, quiero bloqueo automático de IPs maliciosas, para contener ataques sin intervención manual.
- Como responsable de TI, quiero reportes de detecciones, para auditar y justificar inversiones.

## Criterios de aceptación
- Dado un conjunto de prueba etiquetado, cuando el modelo procesa los flujos, entonces F1 ≥ 0,90 y falsos positivos ≤ 5%.
- Dado un flujo malicioso en vivo, cuando ingresa, entonces se emite una alerta en < 1 s.
- Dado una IP maliciosa recurrente, cuando se activa el IPS, entonces se aplica una regla de bloqueo.
- Dado un evento persistido, cuando el analista consulta el panel, entonces puede filtrar por IP, severidad y fechas.

## Fuera de alcance
- Descifrado de tráfico TLS/cifrado a nivel de payload.
- Intercepción o almacenamiento de contenidos personales de usuarios de la red.
- Cumplimiento normativo o certificaciones formales de seguridad (ISO 27001) en esta fase.
- Integración con proveedores de nube o SIEM comerciales específicos.
```

## 12. Elevator Pitch
Las redes de ministerios y gobernaciones de Venezuela son blanco constante de intrusiones, escaneos y exfiltración de datos, y sus equipos de TI no tienen visibilidad en tiempo real del tráfico malicioso. Este proyecto entrega un IDS/IPS basado en aprendizaje automático que clasifica cada flujo de red en menos de un segundo (normal, escaneo/DoS, intrusión o ataque web), detecta al menos el 90% de las intrusiones con menos del 5% de falsos positivos y emite alertas con severidad y mitigación sugerida. En modo IPS bloquea y cuarentena automáticamente IPs maliciosas, reduciendo el tiempo de detección de horas a minutos. Su valor diferencial es una capa de defensa automatizada, en español y con soberanía de datos, que se integra al SOC y al firewall perimetral de cada ente público.

## 13. Impacto en el organismo público
- **Eficiencia operativa:** reduce el tiempo medio de detección (MTTD) de incidentes de horas a minutos, liberando al personal de seguridad para tareas de respuesta en lugar de inspección manual de tráfico.
- **Protección de la infraestructura crítica:** detecta y bloquea en tiempo real intrusiones, escaneos/DoS y ataques web, protegiendo los sistemas y los datos de la ciudadanía que gestionan ministerios y gobernaciones.
- **Transparencia y auditoría:** cada detección queda persistida con marca de tiempo, IP origen/destino, tipo de ataque y confianza del modelo, permitiendo reportes auditables para justificar inversiones y decisiones de seguridad.
- **Ahorro de recursos:** la automatización de la inspección de flujos y el bloqueo dinámico reducen la carga de trabajo manual y permiten cubrir múltiples sedes con un concentrador central supervisado por un equipo SOC.
- **Cumplimiento y soberanía:** opera sobre tráfico autorizado, cifra credenciales y registros, aplica RBAC y no expone payloads sensibles, manteniendo los datos en infraestructura estatal bajo control del ente público.

## 14. README y documentación del proyecto
El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción** clara del proyecto: IDS/IPS para redes gubernamentales — sistema de detección y prevención de intrusos basado en ML que clasifica el tráfico de red estatal en tiempo real (qué hace) y da visibilidad automatizada frente a intrusiones, escaneos, DoS y ataques web (qué problema resuelve).
- **Badges** (build, tests, licencia, cobertura).
- **Características** principales (lista de funcionalidades): ingesta de PCAP/NetFlow/IPFIX, extracción de características por flujo, clasificación ML (normal/escaneo-DoS/intrusión/ataque web), alertas con severidad y mitigación, bloqueo IPS de IPs maliciosas, persistencia y panel de monitoreo.
- **Arquitectura** (diagrama de componentes y flujo de datos): ingesta → extracción de características → preprocesado → modelo de ML → motor de alertas → bloqueo (IPS) / persistencia → panel/SIEM.
- **Instalación y ejecución** (prerrequisitos, pasos, variables de entorno).
- **Uso** (ejemplos, endpoints/API, capturas).
- **Datos y datasets** (fuentes: CIC-IDS2017/2018, UNSW-NB15, NSL-KDD, CSE-CIC-IDS2018; formato PCAP/flujo; cómo obtenerlos y cómo generar capturas propias anonimizadas).
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
