# SDD — Sistema de prevención de fuga de datos (DLP)

> Hackathon UNETI IA 2026 · Proyecto #31 · Eje 2 · Ciberseguridad · Complejidad: Avanzada
> Ente público: Datos del Estado

## 1. Problema
Información clasificada del Estado y datos personales de la ciudadanía (cédulas, RIF, historiales médicos, expedientes) se filtran por error humano o por malicia a través de correo, navegación web, USB o servicios en la nube. Afecta a los funcionarios, a los ciudadanos titulares de los datos y a la confianza en las instituciones públicas, y puede derivar en sanciones legales, suplantación de identidad y pérdida de soberanía sobre la información del Estado.

## 2. Objetivos
- Detectar y bloquear en tiempo real al menos el 95 % de las transferencias de datos sensibles clasificados que intenten salir de la red del ente por correo, web, USB o nube.
- Clasificar automáticamente documentos y campos de datos sensibles (documentos de identidad, bancarios, salud, información clasificada) con una precisión mínima del 90 % en el conjunto de validación.
- Reducir el tiempo de detección de una fuga de días a minutos, generando una alerta y una acción de bloqueo o cuarentena en menos de 10 segundos desde el intento.
- Proveer trazabilidad auditable e inmutable de cada incidente, con registro de quién, qué dato, por qué canal y cuándo se intentó transferir.

## 3. Requisitos funcionales (RF)
- RF-01: Detectar datos sensibles mediante patrones y modelos de IA (cédula `V-00000000`, RIF `J-00000000-0`, pasaporte, IBAN/números de cuenta, correos masivos, historias clínicas, palabras clave de clasificación como "SECRETO" o "CONFIDENCIAL").
- RF-02: Monitorear en tiempo real los canales de salida: correo institucional, tráfico web/HTTP(S), dispositivos USB y aplicaciones de almacenamiento en la nube.
- RF-03: Bloquear automáticamente o enviar a cuarentena toda transferencia no autorizada según la política asignada al usuario y al nivel de clasificación del dato.
- RF-04: Generar alertas en un panel de operación con severidad, origen, tipo de dato, canal y usuario responsable, permitiendo liberar o confirmar el bloqueo de forma manual.
- RF-05: Administrar políticas por rol y nivel de clasificación (ej. un analista no puede exportar datos de salud; un director sí con doble autorización).
- RF-06: Registrar cada evento en un almacén de auditoría inmutable (append-only) exportable para revisiones y auditorías del ente.

## 4. Requisitos no funcionales (RNF)
- RNF-01: Seguridad/privacidad — cifrado en tránsito y en reposo, hashing de datos sensibles en los registros, control de acceso basado en roles y no persistencia de contenido sensible en claro.
- RNF-02: Escalabilidad — soportar inspección concurrente de miles de usuarios y múltiples puntos de salida sin degradar la red del ente.
- RNF-03: Rendimiento — la inspección y decisión de bloqueo debe ejecutarse en menos de 500 ms por transacción para no afectar la operación diaria.
- RNF-04: Accesibilidad/usabilidad — panel en español, con nivel de contraste AA, navegable por teclado y flujos claros para oficiales de seguridad sin formación técnica profunda.

## 5. Historias de usuario
- Como oficial de seguridad de la información, quiero ver en un panel todas las transferencias bloqueadas con su nivel de riesgo, para responder a incidentes de fuga antes de que los datos abandonen la red.
- Como funcionario autorizado, quiero que una transferencia legítima sea liberada tras una doble confirmación, para poder trabajar sin interrupciones innecesarias.
- Como auditor del ente, quiero exportar el registro inmutable de eventos con fecha, usuario y canal, para sustentar auditorías y cumplir con la normativa de protección de datos.

## 6. Criterios de aceptación
- Dado un correo que contiene 20 números de cédula en un adjunto, cuando el usuario sin autorización intenta enviarlo, entonces el sistema lo bloquea y genera una alerta de severidad alta en menos de 10 segundos.
- Dado un documento marcado como "CONFIDENCIAL", cuando un usuario intenta subirlo a un servicio en la nube, entonces la transferencia se envía a cuarentena y se registra el evento en el almacén de auditoría.
- Dado un falso positivo confirmado por el oficial de seguridad, cuando se libera la transferencia, entonces el sistema registra la liberación con el usuario que la autorizó y el motivo.
- Dado un usuario que intenta copiar datos a una memoria USB, cuando el endpoint tiene agente instalado y la política lo prohíbe, entonces el copiado se bloquea y se notifica al oficial de seguridad.

## 7. Datos y fuentes sugeridas
- Conjuntos sintéticos de PII etiquetados: Microsoft Presidio (open source) y datasets de detección de PII en Hugging Face (ej. `pii-masking`, datasets de reconocimiento de entidades para datos de identidad y salud).
- Catálogo oficial de formatos venezolanos: cédula de identidad, RIF (patrones del SENIAT), pasaporte, cuenta bancaria, para construir expresiones regulares de validación.
- Corpus de documentos del ente etiquetados por nivel de clasificación (público, interno, confidencial, secreto) para entrenar el clasificador.
- Informes y marcos de referencia: ISO/IEC 27001 (controles de fuga), NIST SP 800-88 (sanitización), Guía OWASP de DLP y la documentación de Cloudflare One/DLP para arquitectura de despliegue.

## 8. Stack tecnológico sugerido
- Backend de políticas e inspección: Python + FastAPI; detección de PII con Microsoft Presidio; clasificación de documentos con scikit-learn y modelos de Hugging Face Transformers.
- Motor de decisión y colas: Cloudflare Workers + Cloudflare Queues para reglas y enrutamiento de eventos a escala.
- Frontera de red y DLP: Cloudflare Zero Trust (Gateway DLP, CASB) como punto de inspección del tráfico de salida.
- Frontend de panel: TypeScript + React + Cloudflare Pages, con Cloudflare Turnstile para autenticación de operadores.
- Persistencia: PostgreSQL o Cloudflare D1 para políticas y metadatos; Cloudflare R2 para cuarentena cifrada; registro de auditoría append-only con hash encadenado.
- Observabilidad/SIEM: OpenSearch/Elastic para correlación de alertas y dashboards.

## 9. Ente público y visión de despliegue
El sistema lo adopta el ente público "Datos del Estado", desplegado como gateway de salida en su perímetro de red (inspección de correo y tráfico web), con agentes ligeros en los endpoints para controlar USB y aplicaciones cloud, integrado al directorio de usuarios institucional. Se implementa por fases: primero monitoreo en modo observación para ajustar falsos positivos, luego bloqueo por canal y por último endurecimiento con políticas por rol, acompañado de capacitación a oficiales de seguridad y funcionarios.

## 10. Definition of Done
- [ ] El motor detecta y bloquea datos sensibles en correo, web, USB y nube con pruebas automatizadas que cubren los 4 canales.
- [ ] El panel de alertas permite confirmar, liberar o escalar incidentes y registra cada decisión con usuario y motivo.
- [ ] El almacén de auditoría es append-only, cifrado y exportable, con integridad verificable por hash.
- [ ] Existen políticas por rol y nivel de clasificación configuradas y validadas con usuarios de prueba.
- [ ] La documentación de despliegue y operación, y un plan de pruebas de aceptación, están completos y aprobados por el ente.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Sistema de prevención de fuga de datos (DLP)
## Problema
Información clasificada del Estado y datos ciudadanos se filtran por error o malicia por correo, web, USB o nube.

## RF / RNF
- RF-01: Detectar datos sensibles (cédula, RIF, pasaporte, cuentas, salud) con patrones e IA.
- RF-02: Monitorear en tiempo real correo, web, USB y nube.
- RF-03: Bloquear o poner en cuarentena transferencias no autorizadas.
- RF-04: Panel de alertas con severidad, origen y usuario responsable.
- RF-05: Políticas por rol y nivel de clasificación.
- RF-06: Auditoría inmutable y exportable.
- RNF-01: Seguridad/privacidad (cifrado, hashing, RBAC, sin datos en claro).
- RNF-02: Escalabilidad (miles de usuarios, múltiples salidas).
- RNF-03: Rendimiento (decisión < 500 ms por transacción).
- RNF-04: Accesibilidad/usabilidad (panel en español, contraste AA, teclado).

## Historias de usuario
- Como oficial de seguridad, quiero ver transferencias bloqueadas con su riesgo, para responder antes de la fuga.
- Como funcionario autorizado, quiero liberar transferencias legítimas con doble confirmación, para no interrumpir mi trabajo.
- Como auditor, quiero exportar el registro inmutable de eventos, para sustentar auditorías.

## Criterios de aceptación
- Dado un correo con cédulas adjuntas, cuando un usuario no autorizado lo envía, entonces se bloquea y alerta en < 10 s.
- Dado un documento CONFIDENCIAL, cuando se sube a la nube, entonces va a cuarentena y se registra el evento.
- Dado un falso positivo, cuando el oficial lo libera, entonces se registra usuario y motivo.
- Dado un copiado a USB prohibido, cuando el agente lo detecta, entonces se bloquea y notifica.

## Fuera de alcance
- Cifrado de datos en reposo de sistemas legados del ente (solo se inspecciona la salida).
- Investigación forense posterior a incidentes y acciones legales.
- Sustitución del SIEM corporativo existente (se integra, no se reemplaza).
- Detección de fugas por canales físicos no digitales (impresión, fotografía, voz).
```

## 12. Elevator Pitch
El Estado venezolano filtra a diario datos clasificados y personales —cédulas, RIF, historias médicas— por correo, web, USB o nube, con costos legales y pérdida de confianza ciudadana. Nuestro sistema DLP, desplegado como gateway de salida en "Datos del Estado", detecta y bloquea en tiempo real (menos de 500 ms) esas transferencias usando IA de clasificación y patrones oficiales, generando alerta en menos de 10 segundos y dejando un registro de auditoría inmutable. A diferencia de soluciones genéricas, entiende los formatos venezolanos y las políticas por rol del ente, reduciendo una fuga de días a minutos. Es soberanía digital: la información del Estado deja de salir sin permiso.

## 13. Impacto en el organismo público
- **Eficiencia operativa:** el oficial de seguridad responde a incidentes en minutos y no en días, con un panel único en español que prioriza por severidad, origen, canal y usuario responsable, sin necesidad de formación técnica profunda.
- **Transparencia:** cada evento queda registrado con quién, qué dato, por qué canal y cuándo, en un almacén append-only exportable, lo que facilita auditorías internas y externas.
- **Confianza ciudadana:** al reducir filtraciones de cédulas, RIF y datos de salud, se protege a los ciudadanos titulares de los datos frente a suplantación de identidad y se refuerza la credibilidad institucional.
- **Ahorro de recursos:** la inspección automática y la cuarentena evitan el tratamiento manual de fugas, multas por incumplimiento y el costo reputacional asociado a incidentes de seguridad.
- **Cumplimiento normativo:** el sistema se alinea con ISO/IEC 27001 y las guías de protección de datos, demostrando trazabilidad y control exigibles en auditorías del sector público.

## 14. README y documentación del proyecto
El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción** clara del proyecto: "Sistema de prevención de fuga de datos (DLP)" — detecta y bloquea en tiempo real la salida de datos sensibles del Estado por correo, web, USB y nube.
- **Badges** (build, tests, licencia, cobertura).
- **Características** principales (lista de funcionalidades): detección por patrones e IA, monitoreo de los 4 canales, bloqueo/cuarentena por política, panel de alertas, auditoría inmutable.
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
