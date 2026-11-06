# SDD — SOC nacional asistido por IA (SIEM + detección)

> Hackathon UNETI IA 2026 · Proyecto #21 · Eje 2 · Ciberseguridad · Complejidad: Avanzada
> Ente público: CSIRT nacional / CNTI

## 1. Problema
Los entes públicos venezolanos detectan los incidentes de ciberseguridad tarde o no los detectan, porque cada organismo monitorea sus sistemas de forma aislada y sin correlación entre sí. Esto afecta a ministerios, gobernaciones, empresas del Estado y servicios ciudadanos, y deja al CSIRT nacional sin una visión unificada para reaccionar a tiempo ante campañas que atacan a varios entes a la vez.

## 2. Objetivos
- Reducir el tiempo medio de detección (MTTD) de incidentes de horas/días a menos de 5 minutos mediante correlación centralizada de eventos.
- Centralizar la ingesta de eventos de al menos 3 entes públicos piloto en el primer despliegue y escalar a decenas de entes en producción.
- Priorizar automáticamente las alertas según severidad, criticidad del activo e impacto sectorial, para que el analista atienda primero lo más urgente.
- Generar informes agregados por sector y por ente que permitan al CNTI reportar al ente rector y orientar políticas públicas de ciberseguridad.

## 3. Requisitos funcionales (RF)
- RF-01: Ingesta normalizada de eventos desde múltiples entes mediante agentes y API seguras, aceptando Syslog (RFC 5424), CEF, LEEF y JSON estructurado.
- RF-02: Motor de correlación que une eventos de distintos entes usando reglas Sigma y de detección basadas en MITRE ATT&CK, y genera una única alerta por campaña o ataque coordinado.
- RF-03: Motor de priorización que asigna severidad (baja/media/alta/crítica) combinando el tipo de evento, la criticidad del activo y el sector afectado.
- RF-04: Panel de control en tiempo real con mapa de incidentes, cola de triaje y búsqueda de indicadores de compromiso (IoC) entre entes.
- RF-05: Notificación y escalamiento automático al equipo de turno del CSIRT por correo, mensajería (Telegram/Webhook) y registro de acuse de recibo.
- RF-06: Gestión de casos e informes automáticos con timeline del incidente y exportación de IoC en formato STIX 2.1 para compartir con otras plataformas.

## 4. Requisitos no funcionales (RNF)
- RNF-01: Seguridad/privacidad: cifrado TLS en tránsito y en reposo, control de acceso basado en roles (RBAC), auditoría completa de acciones y anonimización de datos sensibles de los entes adheridos, alineado con la Ley de Infogobierno.
- RNF-02: Escalabilidad: soportar el crecimiento horizontal desde 3 hasta cientos de entes y al menos 10.000 eventos por segundo sin degradar la correlación.
- RNF-03: Rendimiento: latencia de correlación menor a 60 segundos desde la recepción del evento y disponibilidad mínima del 99,5 % mensual.
- RNF-04: Accesibilidad/usabilidad: interfaz en español, conforme a WCAG 2.1 nivel AA, responsive para escritorio y móvil, con perfiles diferenciados por rol (analista, gestor, director).

## 5. Historias de usuario
- Como analista del CSIRT nacional, quiero ver en un único panel las alertas correlacionadas de todos los entes adheridos, para priorizar el triaje sin revisar consolas por separado.
- Como responsable de seguridad de un ministerio, quiero enviar mis eventos de forma segura y anónima, para contribuir a la detección nacional sin exponer datos internos sensibles.
- Como director del CNTI, quiero recibir informes agregados de incidentes por sector y por ente, para reportar al ente rector y orientar las políticas públicas de ciberseguridad.

## 6. Criterios de aceptación
- Dado un ataque coordinado cuyos eventos llegan desde dos entes distintos, cuando el motor de correlación los procesa, entonces se genera una única alerta correlacionada con severidad priorizada en menos de 60 segundos.
- Dado un usuario con rol "analista", cuando intente acceder a datos de un sector al que no está autorizado, entonces el sistema deniega el acceso y registra el intento en el registro de auditoría.
- Dado que un ente deja de enviar eventos, cuando transcurren 5 minutos sin latido (heartbeat), entonces el sistema genera una alerta de "ente sin señal" y notifica al equipo de turno del CSIRT.
- Dado un incidente confirmado, cuando el analista lo cierra, entonces el sistema genera automáticamente un informe con el timeline y los IoC exportados en STIX 2.1.

## 7. Datos y fuentes sugeridas
- Conjuntos de datos públicos de detección de intrusiones para entrenar y validar la correlación: CICIDS2017, CSE-CIC-IDS2018, UNSW-NB15, Bot-IoT y ToN-IoT (Universidad de New Brunswick y UNSW Canberra).
- Intel de amenazas en tiempo real: AlienVault OTX, Abuse.ch (URLHaus, ThreatFox), VirusTotal API, feeds de indicadores de Shadowserver.
- Marcos de referencia: MITRE ATT&CK (tácticas/técnicas), reglas Sigma (sigma-hq), taxonomía STIX 2.1 y protocolo TAXII 2.1.
- Datos de superficie de exposición para el monitoreo nacional: Shodan y Censys sobre activos expuestos de los entes adheridos.

## 8. Stack tecnológico sugerido
- Backend de ingesta y correlación: Python con FastAPI, Apache Kafka o Redpanda para colas de eventos, y motor de reglas con Sigma + detección semiautomática con aprendizaje automático (scikit-learn o XGBoost para puntuación de alertas).
- Almacenamiento y búsqueda: OpenSearch/Elasticsearch para logs y alertas, PostgreSQL con TimescaleDB para series temporales.
- Detección en el borde: Suricata (IDS/IPS), Zeek y Wazuh como agentes de los entes; TheHive + Cortex para gestión de casos y respuesta.
- Compartición de inteligencia: MISP como plataforma de intercambio de indicadores entre el CSIRT y los entes.
- Frontend: TypeScript con React y visualización con Grafana/Prometheus para dashboards operativos.
- Servicios en la nube perimetral: Cloudflare Workers para la API pública de ingesta, Turnstile para proteger formularios de reporte, R2 para almacenamiento de evidencias y Workers AI para clasificación inicial de texto de incidentes.
- Despliegue: contenedores con Docker y orquestación Kubernetes, CI/CD con pruebas de seguridad (SAST/DAST).

## 9. Ente público y visión de despliegue
El sistema es adoptado por el CSIRT nacional, operado junto al CNTI como ente rector de las tecnologías de información del Estado venezolano. Se despliega en tres fases: (1) piloto con tres entes voluntarios enviando eventos normalizados; (2) incorporación progresiva de ministerios y empresas del Estado mediante agentes ligeros y un acuerdo de adhesión; (3) operación nacional con soporte 24/7, integración con el marco legal de Infogobierno y reportes periódicos al ente rector. Cada ente mantiene la soberanía de sus datos sensibles, aportando solo eventos anonimizados y agregados al centro de monitoreo.

## 10. Definition of Done
- [ ] La ingesta normaliza y almacena eventos de al menos 3 fuentes (Syslog/CEF, JSON vía API y archivos PCAP) con validación de formato.
- [ ] El motor de correlación ejecuta al menos 10 reglas Sigma con pruebas automatizadas que verifican detección y priorización.
- [ ] El panel de control, la cola de triaje y la gestión de casos están desplegados con control de acceso por roles.
- [ ] Existe un pipeline CI/CD con análisis de seguridad (SAST/DAST) y reportes de cobertura de código documentados.
- [ ] Se entrega documentación de despliegue y un manual de operación para el equipo del CSIRT/CNTI.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — SOC nacional asistido por IA (SIEM + detección)
## Problema
Los entes públicos detectan incidentes tarde o no los detectan por monitorear de forma aislada; el CSIRT carece de una visión unificada para responder a campañas coordinadas.

## RF / RNF
RF-01: Ingesta normalizada (Syslog, CEF, LEEF, JSON) desde múltiples entes.
RF-02: Motor de correlación con reglas Sigma y MITRE ATT&CK.
RF-03: Priorización de alertas por severidad, criticidad e impacto sectorial.
RF-04: Panel en tiempo real con mapa, cola de triaje y búsqueda de IoC.
RF-05: Notificación y escalamiento automático al equipo de turno.
RF-06: Gestión de casos e informes con exportación STIX 2.1.
RNF-01: Seguridad y privacidad (TLS, RBAC, auditoría, anonimización).
RNF-02: Escalabilidad horizontal a cientos de entes y 10.000 EPS.
RNF-03: Rendimiento con correlación < 60 s y disponibilidad 99,5 %.
RNF-04: Accesibilidad WCAG 2.1 AA e interfaz en español.

## Historias de usuario
- Como analista del CSIRT, quiero un panel unificado de alertas correlacionadas, para priorizar el triaje.
- Como responsable de un ministerio, quiero enviar eventos de forma segura y anónima, para aportar sin exponer datos sensibles.
- Como director del CNTI, quiero informes agregados por sector, para orientar políticas públicas.

## Criterios de aceptación
- Dado un ataque coordinado en dos entes, cuando se correlacionan los eventos, entonces se genera una alerta priorizada en menos de 60 segundos.
- Dado un analista sin permiso sectorial, cuando intente acceder, entonces se deniega y audita el intento.
- Dado un ente sin latido durante 5 minutos, cuando se detecta la ausencia, entonces se genera alerta y notificación.
- Dado un incidente cerrado, cuando se finaliza, entonces se genera informe con IoC en STIX 2.1.

## Fuera de alcance
- Respuesta activa automatizada (contención o bloqueo) sobre la infraestructura de los entes adheridos.
- Reemplazo de los SOC propios de cada ente: el sistema complementa, no sustituye.
- Investigación forense profunda de dispositivos; solo se correlacionan eventos y se gestiona el caso.
- Garantía de atribución de actores de amenaza: se detectan y priorizan incidentes, no se identifica con certeza al atacante.
```

## 12. Elevator Pitch
El SOC nacional asistido por IA centraliza la detección de ciberincidentes de todos los entes públicos venezolanos en una única plataforma operada por el CSIRT nacional junto al CNTI. Conecta los eventos de seguridad de ministerios, gobernaciones y empresas del Estado, los correlaciona con reglas Sigma y MITRE ATT&CK, y genera alertas priorizadas en menos de 60 segundos. Su valor diferencial es pasar de una detección aislada y tardía —de horas o días— a una respuesta nacional coordinada en minutos, con una sola alerta por campaña y respetando la soberanía de los datos de cada ente.

## 13. Impacto en el organismo público
- **Eficiencia**: reduce el tiempo medio de detección (MTTD) de horas o días a menos de 5 minutos y centraliza el triaje en un único panel, eliminando la revisión de consolas por separado.
- **Transparencia**: genera informes agregados por sector y por ente que permiten al CNTI reportar al ente rector y orientar las políticas públicas de ciberseguridad con evidencia.
- **Confianza ciudadana**: protege los servicios públicos y los datos de los ciudadanos al detectar campañas coordinadas que atacan a varios entes a la vez.
- **Ahorro de recursos**: prioriza automáticamente las alertas por severidad, criticidad del activo e impacto sectorial, enfocando al equipo de analistas en lo más urgente.
- **Cumplimiento normativo**: alinea la operación con la Ley de Infogobierno mediante cifrado TLS, RBAC, auditoría completa y anonimización de los datos sensibles de los entes adheridos.

## 14. README y documentación del proyecto
El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción** clara del proyecto: SOC nacional asistido por IA (SIEM + detección), que resuelve la detección tardía o inexistente de incidentes de ciberseguridad en los entes públicos por monitoreo aislado y sin correlación.
- **Badges**: build, tests, licencia y cobertura de código.
- **Características** principales (lista de funcionalidades):
  - Ingesta normalizada (Syslog, CEF, LEEF, JSON) desde múltiples entes.
  - Motor de correlación con reglas Sigma y MITRE ATT&CK.
  - Priorización automática de alertas por severidad, criticidad e impacto sectorial.
  - Panel en tiempo real con mapa de incidentes, cola de triaje y búsqueda de IoC.
  - Notificación y escalamiento automático al equipo de turno del CSIRT.
  - Gestión de casos e informes con exportación STIX 2.1.
- **Arquitectura**: diagrama de componentes (ingesta → Kafka/Redpanda → correlación → almacenamiento OpenSearch/PostgreSQL → panel) y flujo de datos de extremo a extremo.
- **Instalación y ejecución**: prerrequisitos, pasos de despliegue y variables de entorno (credenciales de colas, almacenamiento, APIs de inteligencia de amenazas, claves TLS).
- **Uso**: ejemplos, endpoints/API de ingesta y capturas del panel.
- **Datos y datasets**: fuentes (CICIDS2017, CSE-CIC-IDS2018, UNSW-NB15, Bot-IoT, ToN-IoT), feeds de inteligencia (AlienVault OTX, Abuse.ch, VirusTotal, Shadowserver) y formato de obtención.
- **Pruebas**: cómo ejecutar las pruebas automatizadas de detección y priorización de reglas.
- **Contribución**: guía para colaborar con el proyecto.
- **Licencia** y créditos.

### Carpeta docs/
- `SPEC.md` (especificación).
- `SDD.md` (este documento).
- `architecture.md` (diagramas y decisiones de diseño).
- `user-guide.md` (manual de usuario para analistas, gestores y directores).

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
