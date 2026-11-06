# SDD — Protección de datos biométricos del Estado

> Hackathon UNETI IA 2026 · Proyecto #39 · Eje 2 · Ciberseguridad · Complejidad: Avanzada
> Ente público: Registros de identidad

## 1. Problema

Los registros de identidad venezolanos almacenan plantillas biométricas (huellas dactilares, rostro e iris) de millones de ciudadanos, y una filtración de estos datos es **irreversible**: a diferencia de una contraseña, un patrón biométrico no puede cambiarse. El problema afecta directamente a toda persona inscrita en el sistema de identificación y cédulas, y su impacto no es solo de privacidad, sino de suplantación de identidad, fraude electoral y acceso indebido a servicios públicos. Importa porque la confianza en el Estado depende de que la biometría del ciudadano jamás circule en claro, ni siquiera ante un atacante con acceso interno.

## 2. Objetivos

- Cifrar el 100 % de las plantillas biométricas en reposo con un esquema que permita verificarlas **sin descifrarlas** (búsqueda en dominio cifrado o _enclaves_).
- Reducir a **0** los accesos de lectura a datos biométricos sin registro de auditoría: toda operación queda asociada a un funcionario, un motivo y una marca de tiempo.
- Garantizar que una filtración de la base de datos (por ejemplo, un respaldo robado) no revele ni un solo patrón biométrico utilizable, verificable mediante una prueba de penetración en un entorno controlado.
- Cumplir un tiempo de verificación 1:N de identidad **≤ 2 segundos** para un padrón de 10 millones de registros, manteniendo una tasa de falsos positivos (FAR) ≤ 0,001 %.

## 3. Requisitos funcionales (RF)

- RF-01: El sistema debe capturar y registrar plantillas biométricas (huella, rostro) únicamente desde dispositivos de enrolamiento autorizados y con el consentimiento explícito registrado del ciudadano.
- RF-02: Cada plantilla biométrica debe cifrarse con AES-256-GCM antes de persistirse; el material de claves debe residir en un HSM o servicio de gestión de secretos y **nunca** en la misma base de datos que las plantillas.
- RF-03: El acceso a los datos biométricos debe estar controlado por roles (RBAC) —por ejemplo, `enrolador`, `verificador`, `auditor`— con permisos diferenciados de lectura, verificación y exportación.
- RF-04: Toda operación de consulta, enrolamiento, actualización o exportación debe generar un evento de auditoría inmutable (tipo de operación, funcionario, IP, fecha, hash del registro accedido).
- RF-05: La verificación de identidad debe realizarse por comparación dentro de un dominio protegido (matching en memoria segura o criptografía homomórfica), sin devolver la plantilla cruda a la aplicación solicitante.
- RF-06: Debe existir un mecanismo de revocación y rotación: si un ciudadano reporta suplantación, su referencia biométrica se re-emite con nuevos parámetros de protección y se bloquea la antigua.

## 4. Requisitos no funcionales (RNF)

- RNF-01 — Seguridad/privacidad: Cumplir los principios de la Ley de Infogobierno y la normativa venezolana de protección de datos personales; aplicar _minimización_ (guardar solo lo necesario) y _secreto perfecto hacia adelante_ en la transmisión (TLS 1.3 + cifrado de extremo a extremo).
- RNF-02 — Escalabilidad: El almacén de plantillas debe escalar horizontalmente para soportar el padrón nacional completo (~10 M de ciudadanos y crecimiento anual), sin degradación lineal del rendimiento de búsqueda.
- RNF-03 — Rendimiento: Verificación 1:1 ≤ 500 ms y 1:N ≤ 2 s; el sistema de auditoría no debe añadir más de 50 ms de latencia por transacción.
- RNF-04 — Accesibilidad/usabilidad: Las pantallas de enrolamiento y verificación deben funcionar en equipos de baja gama y conexiones de red intermitentes, con textos en español, soporte de lectura y tiempos de respuesta perceptibles (< 3 s de feedback visual).

## 5. Historias de usuario

- Como **ciudadano**, quiero que mi huella se almacene cifrada y que nadie pueda copiarla, para saber que mi identidad no puede ser suplantada si el sistema es atacado.
- Como **funcionario de registro civil**, quiero enrolar a un ciudadano con un flujo guiado que registre su consentimiento y cifre la biometría automáticamente, para no tener que manipular jamás los datos en claro.
- Como **auditor del ente público**, quiero consultar un registro inmutable de quién accedió a qué dato biométrico y por qué, para detectar accesos indebidos y rendir cuentas ante incidentes.

## 6. Criterios de aceptación

- Dado un respaldo completo de la base de datos robado, cuando un evaluador intenta extraer plantillas biométricas, entonces no obtiene ningún patrón utilizable (solo texto cifrado y claves ausentes).
- Dado un funcionario con rol `verificador`, cuando intenta exportar una plantilla completa, entonces el sistema rechaza la operación y registra el intento en auditoría.
- Dado un padrón de 10 millones de registros, cuando se ejecuta una consulta de verificación 1:N, entonces responde en ≤ 2 segundos con FAR ≤ 0,001 % y sin devolver la plantilla cruda.
- Dado un ciudadano que reporta suplantación de identidad, cuando se ejecuta la revocación, entonces su referencia antigua queda inutilizable y la nueva queda activa en ≤ 5 minutos.

## 7. Datos y fuentes sugeridas

- **NIST FRVT** (Face Recognition Vendor Test) y **NIST ELFT** (Evaluations of Latent Fingerprint Technologies): referencias oficiales para medir precisión de motores biométricos.
- **SFinGe** y **FVC2000–2006** (Fingerprint Verification Competition): generación de huellas sintéticas y conjuntos de prueba públicos para no usar datos reales de ciudadanos en desarrollo.
- **LFW / CelebA** (rostros) para prototipos de reconocimiento facial ético, siempre con anonimización.
- **NIST SP 800-53 Rev. 5** y **ISO/IEC 27001**: controles de seguridad del sistema.
- **ISO/IEC 24745** (Biometric information protection) e **ISO/IEC 19794** (formatos de intercambio biométrico): guías normativas de protección y portabilidad.
- **MITRE ATT&CK** (tácticas de exfiltración, _credential access_) para diseñar el modelo de amenazas del proyecto.
- **Ley de Infogobierno (2013)** y normativa venezolana de protección de datos personales: marco legal local aplicable al ente público.

## 8. Stack tecnológico sugerido

- **Backend**: Cloudflare Workers (TypeScript) + Durable Objects para sesiones de enrolamiento con estado; Python (FastAPI) para el motor de matching biométrico.
- **Almacenamiento**: D1 (metadatos transaccionales y auditoría) + R2 (plantillas cifradas, _object storage_ inmutable con versionado).
- **Cifrado y secretos**: AES-256-GCM vía WebCrypto / `libsodium`; Cloudflare **Secrets Store** para claves; Argon2id para derivación de claves de operador.
- **Protección del matching**: OpenFHE / Microsoft SEAL (criptografía homomórfica) o enclaves (AWS Nitro Enclaves) para comparar sin descifrar.
- **Control de acceso**: Cloudflare **Access** (Zero Trust) con autenticación por rol; **Turnstile** para evitar enrolamientos automatizados.
- **IA / detección**: Workers AI para detección de ataques de presentación (liveness) y clasificación de anomalías en los logs de auditoría.
- **Observabilidad y auditoría**: cola de eventos + Workers Queues; registro de auditoría con hash encadenado (estilo _hash chain_) para inmutabilidad.

## 9. Ente público y visión de despliegue

El sistema lo adopta el **ente público rector de los registros de identidad** (la institución responsable del registro civil, las cédulas de identidad y el padrón de identificación en Venezuela), integrado con las estaciones de enrolamiento de sus oficinas regionales. El despliegue se concibe en fases: (1) piloto en un municipio con datos sintéticos, (2) despliegue nacional por lotes migrando las plantillas existentes a cifrado sin ventana de exposición, y (3) publicación de la API de verificación segura para que otros organismos públicos validen identidad sin recibir nunca la biometría. La operación incluye un centro de monitoreo continuo y un plan de respuesta ante incidentes con simulacros semestrales.

## 10. Definition of Done

- [ ] Todas las plantillas biométricas se almacenan cifradas y la prueba de "respaldo robado" demuestra que no se recupera ningún patrón en claro.
- [ ] El control de acceso por roles (RBAC) está implementado y cubierto por pruebas automatizadas de permisos (positivas y negativas).
- [ ] La auditoría inmutable registra el 100 % de las operaciones sobre datos biométricos y es consultable por el rol `auditor`.
- [ ] Las métricas de rendimiento (1:1 ≤ 500 ms, 1:N ≤ 2 s, FAR ≤ 0,001 %) se verifican con una prueba de carga sobre 10 M de registros sintéticos.
- [ ] La documentación operativa (arquitectura, modelo de amenazas y runbook de respuesta a incidentes) está completa y revisada.

## 11. Plantilla SPEC.md (lista para copiar)

```markdown
# SPEC — Protección de datos biométricos del Estado

## Problema
La biometría almacenada en los registros de identidad es irrecuperable si se filtra. Hoy los datos pueden circular en claro y sin trazabilidad, exponiendo a los ciudadanos a suplantación irreversible.

## RF / RNF
### Funcionales
- RF-01: Enrolamiento con consentimiento registrado y captura desde dispositivos autorizados.
- RF-02: Cifrado AES-256-GCM de toda plantilla antes de persistir.
- RF-03: Control de acceso por roles (enrolador / verificador / auditor).
- RF-04: Auditoría inmutable de toda operación sobre datos biométricos.
- RF-05: Verificación sin exponer la plantilla cruda (matching en dominio protegido).
- RF-06: Revocación y rotación de referencias biométricas.

### No funcionales
- RNF-01: Seguridad y privacidad (Ley de Infogobierno, minimización de datos).
- RNF-02: Escalabilidad para el padrón nacional (~10 M de registros).
- RNF-03: Rendimiento (1:1 ≤ 500 ms, 1:N ≤ 2 s).
- RNF-04: Accesibilidad en equipos de baja gama y redes intermitentes.

## Historias de usuario
- Como ciudadano, quiero que mi huella esté cifrada y sea imposible de copiar, para evitar la suplantación de mi identidad.
- Como funcionario de registro civil, quiero enrolar con cifrado automático y consentimiento, para no manipular nunca biometría en claro.
- Como auditor, quiero un registro inmutable de accesos, para detectar usos indebidos.

## Criterios de aceptación
- Dado un respaldo robado, cuando se intenta extraer plantillas, entonces no se obtiene ningún patrón utilizable.
- Dado un rol sin permisos de exportación, cuando intenta descargar una plantilla, entonces la operación se rechaza y se audita.
- Dado un padrón de 10 M, cuando se verifica 1:N, entonces responde ≤ 2 s con FAR ≤ 0,001 %.
- Dada una revocación por suplantación, cuando se ejecuta, entonces la referencia antigua queda inutilizable en ≤ 5 min.

## Fuera de alcance
- Reconocimiento biométrico masivo en vía pública (vigilancia facial en tiempo real).
- Uso de los datos biométricos para fines distintos a la identificación civil y electoral autorizada.
- Almacenamiento de biometría en dispositivos personales del ciudadano.
- Intercambio internacional de plantillas sin convenio y sin cifrado de extremo a extremo.
```

## 12. Elevator Pitch

La biometría de un ciudadano no se puede cambiar: si se filtra, se pierde para siempre. Nuestro sistema cifra el 100 % de las plantillas biométricas (huella y rostro) del ente rector de los registros de identidad para que puedan verificarse **sin descifrarlas**, mediante matching en dominio protegido y auditoría inmutable. Así, ni siquiera un atacante con acceso interno o un respaldo robado puede obtener un patrón utilizable, garantizando verificación 1:N en menos de 2 segundos para 10 millones de registros. El valor diferencial es que el Estado demuestra, con evidencia técnica, que la identidad del ciudadano jamás circula en claro.

## 13. Impacto en el organismo público

- **Confianza ciudadana**: al garantizar que la biometría nunca circula en claro, el ente rector de registros de identidad fortalece la confianza en el sistema de cédulas y en el padrón, reduciendo el temor a suplantación de identidad.
- **Seguridad irreversible**: elimina el riesgo de daño permanente ante una filtración, porque un respaldo robado no revela ningún patrón biométrico utilizable (verificable con prueba de penetración controlada).
- **Transparencia y rendición de cuentas**: la auditoría inmutable asocia cada acceso a un funcionario, un motivo y una marca de tiempo, facilitando la detección de accesos indebidos y la respuesta ante incidentes.
- **Cumplimiento normativo**: alinea la operación con la Ley de Infogobierno y la normativa venezolana de protección de datos personales, aplicando minimización y cifrado de extremo a extremo.
- **Eficiencia y ahorro de recursos**: el despliegue por fases y la API de verificación segura permiten que otros organismos validen identidad sin recibir jamás la biometría, evitando duplicación de datos sensibles y reduciendo la superficie de riesgo.

## 14. README y documentación del proyecto

El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción** clara del proyecto: "Protección de datos biométricos del Estado" — sistema que cifra y verifica plantillas biométricas sin descifrarlas, resolviendo el problema de la filtración irreversible de identidad.
- **Badges** (build, tests, licencia, cobertura).
- **Características** principales (lista de funcionalidades): enrolamiento con consentimiento, cifrado AES-256-GCM, RBAC, auditoría inmutable, verificación en dominio protegido y revocación/rotación.
- **Arquitectura** (diagrama de componentes y flujo de datos): Workers + Durable Objects, D1/R2, HSM/Secrets Store, motor de matching homomórfico o enclaves, y capa de auditoría con hash encadenado.
- **Instalación y ejecución** (prerrequisitos, pasos, variables de entorno).
- **Uso** (ejemplos, endpoints/API, capturas).
- **Datos y datasets** (fuentes, formato, cómo obtenerlos): NIST FRVT/ELFT, SFinGe, FVC2000–2006, LFW/CelebA.
- **Pruebas** (cómo correrlas): unitarias de permisos, prueba de "respaldo robado" y carga sobre 10 M de registros sintéticos.
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
