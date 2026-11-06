# SDD — Integridad y auditoría de procesos electorales/consultas

> Hackathon UNETI IA 2026 · Proyecto #35 · Eje 2 · Ciberseguridad · Complejidad: Avanzada
> Ente público: Entes electorales

## 1. Problema
La confianza en los procesos de votación y consulta ciudadana se erosiona cuando no existe evidencia verificable de que cada voto se registró, no se alteró y se contabilizó exactamente una vez. Esta desconfianza afecta a los entes electorales venezolanos y a la ciudadanía en general, porque sin trazabilidad criptográfica cualquier irregularidad es difícil de detectar y de probar ante observadores, partidos y organismos de control. El proyecto importa porque la legitimidad de un resultado electoral depende de poder auditar la cadena completa que va desde la emisión del voto hasta el acta final de escrutinio.

## 2. Objetivos
- Permitir que el 100% de los votos y consultas emitidos queden asociados a un registro inmutable con hash criptográfico verificable por terceros.
- Detectar cualquier alteración, duplicación o eliminación de un voto en un tiempo de verificación inferior a 5 segundos por acta.
- Ofrecer un panel de auditoría donde observadores y entes electorales puedan verificar el estado íntegro de una mesa o centro de votación sin exponer la identidad del votante.
- Generar automáticamente un reporte de trazabilidad por voto/consulta que enlace la emisión, el almacenamiento y el escrutinio con un identificador anónimo auditable.

## 3. Requisitos funcionales (RF)
- RF-01: El sistema debe registrar cada voto/consulta con un identificador único y un hash criptográfico (SHA-256) que encadene cada registro con el anterior (estructura tipo cadena verificable / Merkle tree).
- RF-02: El sistema debe permitir a un auditor externo verificar la integridad de una urna o acta ingresando el hash raíz publicado, sin requerir acceso a los datos personales de los votantes.
- RF-03: El sistema debe detectar y notificar automáticamente cualquier voto cuyo hash no coincida con el registro almacenado, indicando mesa, centro y registro afectado.
- RF-04: El sistema debe generar un acta de escrutinio firmada digitalmente (firma con clave pública/privada) que incluya el total de votos, el hash raíz y la fecha/hora de cierre.
- RF-05: El sistema debe mantener un registro de auditoría (log) de eventos administrativos —apertura, cierre, importación de padrones, publicación de resultados— también encadenado criptográficamente.
- RF-06: El sistema debe permitir exportar los datos de trazabilidad en un formato estándar (JSON/CSV) para su publicación en el portal del ente electoral.

## 4. Requisitos no funcionales (RNF)
- RNF-01 (Seguridad/Privacidad): El voto debe permanecer anónimo e imposible de vincular con el votante; la trazabilidad se logra con identificadores seudónimos y hashes, nunca con datos de identidad. Todo acceso administrativo requiere autenticación multifactor y control de roles.
- RNF-02 (Escalabilidad): El sistema debe soportar la concurrencia de miles de mesas registrando votos de forma simultánea sin degradar la integridad de la cadena de registros.
- RNF-03 (Rendimiento): El registro de un voto y el cálculo de su hash deben completarse en menos de 500 ms, y la verificación global de un centro debe finalizar en menos de 30 segundos.
- RNF-04 (Accesibilidad/Usabilidad): La interfaz de auditoría debe ser operable por personal técnico y observadores con nivel básico, con mensajes claros en español y una vista pública de verificación sin fricciones.

## 5. Historias de usuario
- Como ciudadano votante, quiero que mi voto quede registrado con un hash verificable, para tener la certeza de que no fue alterado sin revelar mi identidad.
- Como observador electoral, quiero verificar la integridad de una mesa ingresando el hash raíz publicado, para detectar cualquier manipulación sin depender del ente electoral.
- Como técnico del ente electoral, quiero generar un acta firmada digitalmente con el hash de cada urna, para respaldar el resultado con evidencia criptográfica auditable.

## 6. Criterios de aceptación
- Dado un voto emitido en una mesa, cuando el sistema lo persiste, entonces el registro incluye identificador único, hash SHA-256 y enlace con el registro anterior verificable.
- Dado un hash raíz publicado, cuando un auditor lo ingresa en el verificador público, entonces obtiene confirmación de integridad o la lista exacta de registros alterados en menos de 5 segundos.
- Dado un intento de modificar o duplicar un voto, cuando el sistema lo detecta, entonces emite una alerta con mesa, centro y hash del registro afectado sin exponer datos del votante.
- Dado el cierre de una mesa, cuando el operador genera el acta, entonces se produce un documento firmado digitalmente que incluye total de votos, hash raíz y sello temporal.

## 7. Datos y fuentes sugeridas
- Datos abiertos históricos del Consejo Nacional Electoral (CNE) de Venezuela: resultados por mesa, centro y entidad para modelar volúmenes y escenarios de escrutinio.
- Especificaciones y estándares de integridad electoral: recomendaciones de OEA/IDEA Internacional sobre auditoría de sistemas de votación y verificación de resultados.
- NIST SP 800-57 y FIPS 140 para criterios de algoritmos criptográficos y gestión de claves aplicables al registro de votos.
- Estándares de firma digital y sellado de tiempo (RFC 3161 / CMS) para la generación de actas firmadas.
- Conjuntos sintéticos de votos (mock data) para pruebas de carga y de integridad, evitando usar datos reales de votantes por privacidad.

## 8. Stack tecnológico sugerido
- Backend: TypeScript/Node.js (o Python/FastAPI) con API REST y WebSocket para el registro y la auditoría en tiempo real.
- Criptografía: Web Crypto API y Node.js `crypto` (SHA-256, HMAC, Ed25519/ECDSA para firmas) y Merkle tree para el hash raíz por urna.
- Almacenamiento inmutable: base de datos con registros encadenados por hash y copias de respaldo (PostgreSQL con triggers de integridad + objeto de almacenamiento versionado).
- Despliegue y seguridad en el borde: Cloudflare Workers para el verificador público y la API de bajo costo global, Durable Objects para coordinar mesas en tiempo real, R2 para almacenar actas y registros exportados, y Turnstile para proteger endpoints públicos de bots.
- IA: detección de anomalías en patrones de registro (frecuencia inusual, duplicados) con Workers AI o un modelo ligero de clasificación sobre los logs de auditoría.

## 9. Ente público y visión de despliegue
El adoptante natural es el ente electoral nacional (CNE) y los organismos electorales estadales, que desplegarían el sistema como complemento de auditoría del proceso de votación y consulta. La implementación comenzaría por un piloto en centros de votación seleccionados, con el verificador público expuesto en el portal del ente para observadores y partidos; posteriormente se escalaría a todas las mesas con respaldo de actas firmadas y reportes de trazabilidad publicables.

## 10. Definition of Done
- [ ] Cada voto/consulta persiste con identificador único, hash SHA-256 y enlace al registro anterior.
- [ ] El verificador público confirma integridad o reporta alteraciones a partir del hash raíz publicado.
- [ ] Las actas de escrutinio se generan con firma digital y sello temporal verificables.
- [ ] Se detectan y alertan alteraciones, duplicados y eliminaciones sin exponer identidad del votante.
- [ ] La documentación de operación y el reporte de trazabilidad exportable están completos y probados con datos sintéticos.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Integridad y auditoría de procesos electorales/consultas
## Problema
La confianza electoral exige integridad verificable de cada voto/consulta mediante auditoría criptográfica y trazabilidad.

## RF / RNF
- RF-01: Registro de cada voto con identificador único y hash SHA-256 encadenado.
- RF-02: Verificación externa de integridad por hash raíz.
- RF-03: Detección y alerta de alteraciones, duplicados y eliminaciones.
- RF-04: Acta de escrutinio firmada digitalmente con sello temporal.
- RNF-01: Anonimato del voto y acceso administrativo con MFA y roles.
- RNF-02: Escalabilidad para miles de mesas concurrentes.
- RNF-03: Registro < 500 ms y verificación de centro < 30 s.
- RNF-04: Verificador público usable por observadores no técnicos.

## Historias de usuario
- Como votante, quiero que mi voto quede registrado con hash verificable, para tener certeza de que no fue alterado sin revelar mi identidad.
- Como observador, quiero verificar la integridad de una mesa con el hash raíz, para detectar manipulación de forma independiente.
- Como técnico del ente, quiero generar actas firmadas, para respaldar el resultado con evidencia criptográfica.

## Criterios de aceptación
- Dado un voto emitido, cuando se persiste, entonces incluye ID único, hash y enlace al registro anterior.
- Dado un hash raíz, cuando se verifica, entonces se confirma integridad o se listan alteraciones en < 5 s.
- Dado un intento de alteración, cuando se detecta, entonces se alerta con mesa, centro y hash sin exponer al votante.

## Fuera de alcance
- Votación electrónica remota por internet en producción (solo auditoría y trazabilidad).
- Identificación biométrica del votante y desanonimización del voto.
- Sustitución del marco legal y reglamentario del ente electoral.
```

## 12. Elevator Pitch
"En 30 segundos: hoy no existe una manera sencilla y pública de comprobar que un voto no fue alterado o contado dos veces. Nuestro sistema, 'Integridad y auditoría de procesos electorales/consultas', registra cada voto con un hash criptográfico encadenado (SHA-256 y Merkle tree) y genera actas firmadas digitalmente. Está pensado para el ente electoral nacional (CNE) y los organismos electorales estadales, que publican el hash raíz para que observadores, partidos y ciudadanos verifiquen cualquier urna en menos de 5 segundos, sin exponer la identidad del votante. El valor diferencial es la trazabilidad criptográfica completa —de la emisión al acta— que convierte la auditoría electoral en algo verificable por terceros, no en un acto de confianza."

## 13. Impacto en el organismo público
- **Transparencia y confianza ciudadana**: el verificador público permite que observadores, partidos y ciudadanos comprueben la integridad de una mesa o centro ingresando únicamente el hash raíz publicado, sin depender de la palabra del ente ni exponer datos del votante.
- **Eficiencia en la auditoría**: la verificación de una acta se reduce a menos de 5 segundos y la de un centro completo a menos de 30 segundos, frente a conciliaciones manuales largas y propensas a error.
- **Respaldo probatorio normativo**: las actas de escrutinio firmadas digitalmente con sello temporal (firma de clave pública/privada, RFC 3161/CMS) dan evidencia criptográfica auditable que fortalece el cumplimiento y la defensa legal del resultado.
- **Ahorro de recursos**: la detección automática de alteraciones, duplicados y eliminaciones (con alerta de mesa, centro y registro afectado) evita investigaciones manuales costosas y permite priorizar la respuesta ante incidentes.
- **Capacidad de control independiente**: el registro de auditoría encadenado de eventos administrativos (apertura, cierre, importación de padrones, publicación de resultados) y los reportes exportables (JSON/CSV) facilitan la fiscalización por organismos de control y la publicación en el portal del ente.

## 14. README y documentación del proyecto
El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción** clara del proyecto: "Integridad y auditoría de procesos electorales/consultas" — qué hace (registro inmutable de votos con hash encadenado, verificación pública por hash raíz y actas firmadas) y qué problema resuelve (la falta de evidencia verificable de que cada voto no se alteró ni se contó más de una vez).
- **Badges** (build, tests, licencia, cobertura).
- **Características** principales (lista de funcionalidades): registro con hash SHA-256 encadenado (Merkle tree), verificación externa por hash raíz, detección y alerta de alteraciones, actas firmadas digitalmente, registro de auditoría encadenado y exportación JSON/CSV.
- **Arquitectura** (diagrama de componentes y flujo de datos): backend de registro (API REST/WebSocket), capa criptográfica (Web Crypto/Node.js `crypto`, Ed25519/ECDSA, Merkle tree), almacenamiento inmutable (PostgreSQL + objeto versionado), verificador público y API en el borde (Cloudflare Workers + Durable Objects + R2 + Turnstile) y detección de anomalías con Workers AI.
- **Instalación y ejecución** (prerrequisitos, pasos, variables de entorno).
- **Uso** (ejemplos, endpoints/API, capturas).
- **Datos y datasets** (fuentes, formato, cómo obtenerlos): datos abiertos históricos del CNE, estándares de OEA/IDEA Internacional y NIST/FIPS, y conjuntos sintéticos de votos (mock data) para pruebas.
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
