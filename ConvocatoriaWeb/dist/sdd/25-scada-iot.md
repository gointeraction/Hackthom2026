# SDD — Protección de sistemas SCADA/IoT industrial

> Hackathon UNETI IA 2026 · Proyecto #25 · Eje 2 · Ciberseguridad · Complejidad: Avanzada
> Ente público: Operadores de servicios públicos

## 1. Problema
Las redes industriales de los servicios públicos de agua y energía en Venezuela (SCADA, RTU, PLC, sensores IoT) operan con protocolos legados como Modbus, DNP3 y OPC-UA que carecen de autenticación y cifrado, y su tráfico rara vez se monitorea en tiempo real. Esto deja expuestas las plantas de potabilización, bombeo y subestaciones eléctricas a intrusiones, manipulaciones de telemetría y fallas operativas silenciosas que pueden interrumpir el suministro a la población. El problema afecta directamente a los operadores públicos, que hoy detectan anomalías de forma reactiva, horas o días después del incidente, sin visibilidad sobre sus dispositivos IoT ni sobre comandos anómalos dirigidos a los controladores.

## 2. Objetivos
- Detectar anomalías en el tráfico de red industrial (Modbus/TCP, DNP3, OPC-UA) y en la telemetría de dispositivos IoT con una precisión (F1-score) igual o superior a 0,85 sobre datos de validación etiquetados.
- Emitir alertas en menos de 10 segundos desde la detección de una anomalía, priorizadas por severidad y asociadas al activo (PLC, RTU, bomba, medidor) afectado.
- Integrar al menos 3 fuentes de datos distintas (captura de tráfico, telemetría de sensores y registros de eventos) en un único tablero de monitoreo en tiempo real.
- Reducir el tiempo medio de detección (MTTD) de incidentes en un entorno simulado a menos de 60 segundos, demostrado con réplicas controladas de ataques (inyección de comandos, escaneo de red, suplantación de maestro).

## 3. Requisitos funcionales (RF)
- RF-01: El sistema debe capturar y decodificar paquetes de protocolos industriales (Modbus/TCP en puerto 502, DNP3 en puerto 20000 y OPC-UA) y extraer campos como códigos de función, direcciones de esclavo, registros leídos/escritos y unidades de datos.
- RF-02: El sistema debe entrenar y servir un modelo de detección de anomalías (no supervisado o semisupervisado) capaz de marcar tráfico, secuencias de comandos y lecturas de sensores como "normal" o "anómalo" con su puntaje de confianza.
- RF-03: El sistema debe generar alertas en tiempo real con severidad (baja/media/alta/crítica), protocolo, origen/destino, activo afectado, tipo de anomalía inferida y evidencia asociada (paquete o ventana de telemetría).
- RF-04: El sistema debe mantener un inventario de dispositivos IoT y activos industriales con su comportamiento histórico, permitiendo consultar el estado operativo y las alertas recientes por cada activo.
- RF-05: El sistema debe exponer un tablero web con series temporales de tráfico y telemetría, línea base de comportamiento y listado de alertas, con filtros por protocolo, activo, severidad y rango de tiempo.
- RF-06: El sistema debe permitir la ingesta de telemetría IoT vía MQTT y HTTP, y registrar todos los eventos procesados en almacenamiento persistente para auditoría y reentrenamiento.

## 4. Requisitos no funcionales (RNF)
- RNF-01: Seguridad/privacidad — Los datos de telemetría y tráfico se transmiten cifrados (TLS/MQTT sobre TLS) y el acceso al sistema exige autenticación y control de roles (operador, analista, administrador); los paquetes crudos capturados se almacenan con retención limitada y ofuscación de datos sensibles.
- RNF-02: Escalabilidad — El pipeline de ingesta debe sostener al menos 5 000 mensajes de telemetría por minuto y 50 Mbps de tráfico de red analizado, escalando horizontalmente mediante procesamiento distribuido de flujo.
- RNF-03: Rendimiento — La latencia de extremo a extremo entre la captura de un paquete y su clasificación no debe superar 5 segundos en el percentil 95, y el tablero debe renderizar consultas de 24 horas de histórico en menos de 3 segundos.
- RNF-04: Accesibilidad/usabilidad — El tablero debe ser operable por personal técnico de planta sin conocimientos de IA, con alertas redactadas en lenguaje claro y accesible (contraste, textos alternativos, navegación por teclado) y funcionamiento en ancho de banda reducido típico de instalaciones remotas.

## 5. Historias de usuario
- Como operador de sala de control de una hidrológica, quiero recibir una alerta inmediata cuando un PLC reciba un comando de escritura fuera de horario, para evitar la manipulación remota no autorizada de bombas y válvulas.
- Como analista de ciberseguridad del ente público, quiero visualizar la línea base de comportamiento de cada dispositivo IoT y las desviaciones detectadas, para investigar rápidamente si una anomalía es un ciberataque o una falla de equipo.
- Como gerente de operaciones de una empresa eléctrica, quiero un reporte diario de anomalías por subestación y por tipo, para priorizar la inversión en protección de los activos más vulnerables.

## 6. Criterios de aceptación
- Dado un flujo de tráfico Modbus/TCP que incluye una inyección de comando de escritura a un registro crítico, cuando el sistema procesa el flujo, entonces emite una alerta de severidad alta con el activo y el código de función correctos en menos de 10 segundos.
- Dado un conjunto de validación etiquetado con tráfico normal y anómalo, cuando se evalúa el modelo, entonces el F1-score sobre la clase anómala es igual o superior a 0,85 y la tasa de falsos positivos es menor a 5 %.
- Dado un ataque de escaneo de red sobre el rango de direcciones de los PLC, cuando el sistema lo detecta, entonces el tablero muestra el origen del escaneo y lo clasifica como actividad de reconocimiento.
- Dado un operador sin sesión iniciada, cuando intenta acceder al tablero, entonces el sistema le deniega el acceso y lo redirige al flujo de autenticación con roles.

## 7. Datos y fuentes sugeridas
- **SWaT (Secure Water Treatment)** — iTrust, Singapur: telemetría de una planta de tratamiento de agua real con ataques documentados (https://itrust.sutd.edu.sg).
- **BATADAL** — Conjunto de datos de ataque a red de distribución de agua (sensores de presión/caudal con ataques a PLC).
- **HAI (HIL-based Augmented ICS)** — Telemetría de un banco de pruebas de energía con ataques; útil para el dominio eléctrico.
- **Electra (CICESE)** — Dataset ICS de red eléctrica con tráfico Modbus y ataques, para validar la detección sobre protocolo industrial.
- **Gas Pipeline / IEC 60870-5-104 datasets** — Tráfico SCADA etiquetado para generalizar la detección más allá de Modbus.
- **CICIDS 2017 / CSE-CIC-IDS2018** — Tráfico de red general etiquetado para la capa de reconocimiento (escaneos, DDoS) como preproceso del modelo.

## 8. Stack tecnológico sugerido
- **Lenguajes:** Python 3.11+ (detección/modelado), TypeScript/JavaScript (tablero y Workers).
- **Modelado de anomalías:** scikit-learn (Isolation Forest, One-Class SVM), PyOD, y para secuencias temporales autoencoders LSTM o Transformers con PyTorch.
- **Captura y decodificación de protocolos industriales:** Zeek + plugin ICS (o Suricata) para Modbus/DNP3, y OPC-UA-asyncio/asyncua para OPC-UA.
- **Ingesta y procesamiento de flujo:** Apache Kafka + Faust (o Redpanda), MQTT (EMQX/Mosquitto) para telemetría IoT.
- **Almacenamiento:** TimescaleDB o InfluxDB para series temporales, PostgreSQL para activos/alertas, y un bucket de objetos (R2) para evidencia de paquetes.
- **Servicios Cloudflare:** Workers (API serverless y tablero), D1 (inventario de activos y alertas), R2 (evidencia cruda), Tunnel (acceso seguro a plantas remotas) y Workers AI para clasificación ligera en el borde.
- **Visualización:** Grafana con paneles de series temporales y alertas, o un tablero propio con React + D3.
- **Despliegue/entorno de prueba:** Docker Compose para el laboratorio simulado (miniCPS o Grid2Op para replicar plantas y ataques), con CI/CD en GitHub Actions.

## 9. Ente público y visión de despliegue
El sistema lo adopta el operador público de servicios esenciales (hidrológicas regionales y empresas eléctricas del Estado, en coordinación con el ente rector del sector) como una capa de monitoreo que se superpone a la infraestructura SCADA existente sin reemplazarla. Se despliega por fases: (1) un piloto en una planta de tratamiento de agua y una subestación seleccionada, instalando un sensor de red en espejo (port mirroring/TAP) y gateways IoT seguros; (2) el motor de detección y el tablero centralizados, accesibles al personal autorizado a través de un túnel cifrado; y (3) la expansión progresiva a más activos con reentrenamiento por planta. Cada sitio remoto publica telemetría y alertas por enlace cifrado hacia el centro de operaciones, garantizando que las plantas sigan funcionando aunque se pierda la conectividad con la central.

## 10. Definition of Done
- [ ] El pipeline captura y decodifica tráfico Modbus/DNP3/OPC-UA y telemetría MQTT en el entorno de laboratorio simulado.
- [ ] El modelo de anomalías supera el F1-score 0,85 y la tasa de falsos positivos menor a 5 % sobre el conjunto de validación etiquetado.
- [ ] Las alertas se emiten en menos de 10 segundos y el tablero las muestra con severidad, activo, protocolo y evidencia.
- [ ] El acceso al sistema está protegido con autenticación y roles, y la transmisión de datos usa cifrado.
- [ ] Existe documentación de instalación, manual de operador y un demo grabado que reproduce un ataque y su detección de extremo a extremo.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Protección de sistemas SCADA/IoT industrial
## Problema
Las redes industriales de agua y energía usan protocolos sin seguridad y sin monitoreo,
dejando PLC, RTU e IoT expuestos a ataques y fallas silenciosas que hoy se detectan tarde.

## RF / RNF
- RF-01: Capturar y decodificar tráfico Modbus/TCP, DNP3 y OPC-UA.
- RF-02: Entrenar y servir un modelo de detección de anomalías con puntaje de confianza.
- RF-03: Emitir alertas en tiempo real con severidad, activo, protocolo y evidencia.
- RF-04: Mantener inventario de activos IoT con comportamiento histórico.
- RF-05: Exponer tablero web con series temporales, línea base y filtros.
- RF-06: Ingerir telemetría MQTT/HTTP y persistir eventos para auditoría.
- RNF-01: Seguridad — cifrado en tránsito, autenticación y roles, retención limitada.
- RNF-02: Escalabilidad — 5 000 msg/min y 50 Mbps analizados, escalado horizontal.
- RNF-03: Rendimiento — clasificación p95 < 5 s, consultas de 24 h < 3 s.
- RNF-04: Usabilidad — operable sin conocimientos de IA y en ancho de banda reducido.

## Historias de usuario
- Como operador de sala de control, quiero alertas inmediatas ante comandos anómalos,
  para evitar la manipulación remota de bombas y válvulas.
- Como analista de ciberseguridad, quiero ver la línea base y las desviaciones de cada
  dispositivo, para distinguir ciberataques de fallas de equipo.
- Como gerente de operaciones, quiero un reporte diario de anomalías por activo y tipo,
  para priorizar la protección de los activos más vulnerables.

## Criterios de aceptación
- Dado tráfico Modbus con un comando de escritura malicioso, cuando se procesa, entonces
  se emite una alerta de severidad alta con el activo correcto en menos de 10 segundos.
- Dado un conjunto de validación etiquetado, cuando se evalúa el modelo, entonces el
  F1-score anómalo >= 0,85 y la tasa de falsos positivos < 5 %.
- Dado un escaneo de red sobre los PLC, cuando se detecta, entonces el tablero muestra
  el origen y lo clasifica como reconocimiento.
- Dado un usuario sin sesión, cuando intenta acceder, entonces se le deniega y se le
  redirige a autenticación con roles.

## Fuera de alcance
- Modificación automática del SCADA: el sistema solo monitorea y alerta, no ejecuta
  acciones correctivas sobre PLC ni válvulas sin intervención humana.
- Sustitución de la infraestructura SCADA/protocolos existentes ni del personal de planta.
- Cumplimiento normativo o certificaciones de seguridad industrial (solo alineación referencial).
- Detección de amenazas físicas o sabotaje no observable a través de red/telemetría.
```

## 12. Elevator Pitch
Las plantas de agua y las subestaciones eléctricas del Estado venezolano operan sobre protocolos industriales (Modbus, DNP3, OPC-UA) sin autenticación ni cifrado, por lo que un comando malicioso contra un PLC puede pasar desapercibido horas o días. Nuestra solución es una capa de monitoreo en tiempo real que se superpone a la infraestructura SCADA existente: captura y decodifica el tráfico industrial, aprende la línea base de cada activo y emite alertas en menos de 10 segundos, con una precisión (F1-score) superior a 0,85. Está pensada para los operadores públicos de servicios esenciales —hidrológicas regionales y empresas eléctricas del Estado—, permitiéndoles detectar intrusiones y manipulaciones de telemetría de forma proactiva, sin reemplazar sus sistemas ni exigir conocimientos de IA al personal de planta.

## 13. Impacto en el organismo público
- **Eficiencia operativa:** reduce el tiempo medio de detección (MTTD) de incidentes a menos de 60 segundos y el de emisión de alertas a menos de 10 segundos, frente a las horas o días actuales de reacción reactiva.
- **Confianza ciudadana y continuidad del servicio:** al detectar fallas silenciosas y manipulaciones de telemetría antes de que interrumpan el suministro de agua y energía a la población.
- **Ahorro de recursos:** prioriza alertas por severidad y activo afectado, y genera reportes diarios por subestación y tipo de anomalía, orientando la inversión hacia los activos más vulnerables sin sustituir la infraestructura existente.
- **Transparencia y trazabilidad:** registro persistente y auditable de eventos, con inventario de activos y evidencia asociada a cada alerta, para investigar y rendir cuentas ante el ente rector del sector.
- **Seguridad y cumplimiento:** cifrado en tránsito (TLS/MQTT sobre TLS), autenticación con roles y retención limitada de paquetes crudos, alineado con buenas prácticas de ciberseguridad industrial, sin ejecutar acciones correctivas automáticas sobre el SCADA.

## 14. README y documentación del proyecto
El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción** clara del proyecto: capa de monitoreo y detección de anomalías en tiempo real para protocolos SCADA/IoT (Modbus/TCP, DNP3, OPC-UA y telemetría MQTT) que protege las plantas de agua y energía sin reemplazar la infraestructura existente.
- **Badges** (build, tests, licencia, cobertura).
- **Características** principales (lista de funcionalidades): captura/decodificación de protocolos industriales, modelo de detección de anomalías con puntaje de confianza, alertas priorizadas por severidad, inventario de activos IoT, tablero web con series temporales y filtros, ingesta MQTT/HTTP y persistencia para auditoría.
- **Arquitectura** (diagrama de componentes y flujo de datos): sensor de red en espejo (port mirroring/TAP) → captura/decodificación (Zeek/Suricata) → ingesta de flujo (Kafka/Faust, MQTT) → motor de detección (scikit-learn/PyOD/PyTorch) → almacenamiento (TimescaleDB/InfluxDB, PostgreSQL, R2) → tablero y API (Workers/React+Grafana).
- **Instalación y ejecución** (prerrequisitos, pasos, variables de entorno).
- **Uso** (ejemplos, endpoints/API, capturas).
- **Datos y datasets** (fuentes, formato, cómo obtenerlos): SWaT, BATADAL, HAI, Electra, Gas Pipeline / IEC 60870-5-104 y CICIDS/CSE-CIC-IDS2018.
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
