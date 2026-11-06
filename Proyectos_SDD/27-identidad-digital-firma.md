# SDD — Identidad digital ciudadana y firma electrónica segura

> Hackathon UNETI IA 2026 · Proyecto #27 · Eje 2 · Ciberseguridad · Complejidad: Avanzada
> Ente público: Transformación digital de trámites

## 1. Problema
Los trámites presenciales en las instituciones públicas venezolanas exigen que el ciudadano demuestre quién es y firme documentos en papel, lo que obliga a desplazamientos, colas y duplicación de expedientes. Esto afecta a ciudadanos, funcionarios y oficinas de atención, y se traduce en trámites lentos, costosos y expuestos a suplantación de identidad y falsificación de firmas. Resolverlo importa porque sin identidad verificable y firma con validez legal no es posible digitalizar de forma segura los trámites del Estado.

## 2. Objetivos
- Emitir credenciales de identidad digital verificables para al menos 3 perfiles de usuario (ciudadano, funcionario, persona jurídica) con autenticación multifactor (MFA).
- Reducir el tiempo de un trámite que hoy requiere firma presencial de horas a menos de 10 minutos de firma electrónica remota con trazabilidad.
- Garantizar que cada firma electrónica quede ligada criptográficamente a un documento y a una identidad verificada, con evidencia auditable e inalterable.
- Desplegar un prototipo funcional con verificación en línea que un ente público pueda pilotar en un trámite real durante el hackathon.

## 3. Requisitos funcionales (RF)
- RF-01: El sistema debe permitir el alta de ciudadanos con verificación de identidad en dos pasos: documento de identidad (cédula venezolana) más prueba de vida mediante selfie biométrico comparado por IA.
- RF-02: El sistema debe emitir una credencial de identidad digital firmada (estilo W3C Verifiable Credential) que el usuario pueda presentar para autenticarse sin repetir el onboarding.
- RF-03: El sistema debe exigir autenticación fuerte con MFA —contraseña + código TOTP o llave WebAuthn/passkey— antes de cualquier firma.
- RF-04: El sistema debe permitir firmar electrónicamente un documento PDF con firma calificada o avanzada, incrustando sello de tiempo y hash del documento, y generar un acta de firma auditable.
- RF-05: El sistema debe registrar un registro de auditoría inmutable (log encadenado con hash) de cada evento de identidad, autenticación y firma.
- RF-06: El sistema debe permitir a un funcionario/validador verificar la validez de una credencial y de una firma mediante un código QR o un hash en línea, sin instalar software.

## 4. Requisitos no funcionales (RNF)
- RNF-01: Seguridad/privacidad — los datos biométricos y de identidad deben cifrarse en reposo y en tránsito, minimizarse a lo indispensable (principio de mínima divulgación) y cumplir marcos como la Ley de Infogobierno y estándares de protección de datos aplicables en Venezuela.
- RNF-02: Escalabilidad — el servicio debe soportar picos de miles de verificaciones simultáneas típicos de jornadas de trámites, con arquitectura serverless que escale horizontalmente.
- RNF-03: Rendimiento — la verificación de una credencial o firma debe responder en menos de 1 segundo en el percentil 95, y la emisión de credencial en menos de 30 segundos excluyendo la espera del usuario.
- RNF-04: Accesibilidad/usabilidad — la interfaz debe cumplir WCAG 2.1 AA, funcionar en dispositivos móviles de gama baja y ofrecer textos en español claro, incluyendo lectores de pantalla.

## 5. Historias de usuario
- Como ciudadano, quiero crear mi identidad digital con mi cédula y un selfie, para poder autenticarme en trámites sin ir presencialmente.
- Como funcionario de una oficina pública, quiero verificar la identidad y la firma de un solicitante escaneando un código QR, para aprobar trámites con certeza legal.
- Como persona jurídica (empresa/ente), quiero firmar electrónicamente documentos de contratación o solicitudes con validez y trazabilidad, para eliminar el papel y agilizar procesos.

## 6. Criterios de aceptación
- Dado un ciudadano con cédula válida y selfie, cuando completa el onboarding, entonces recibe una credencial de identidad verificable y puede iniciar sesión con MFA en menos de 5 minutos.
- Dado un documento PDF subido por un usuario autenticado con MFA, cuando aplica su firma electrónica, entonces se genera un PDF firmado con hash, sello de tiempo y un acta de firma que puede verificarse en línea.
- Dado un intento de suplantación (selfie que no coincide con la cédula o MFA fallido), cuando ocurre, entonces el sistema rechaza la operación y registra el evento en el log de auditoría.
- Dado un validador con el código QR de una firma, cuando lo escanea, entonces obtiene en menos de 1 segundo el estado de validez, el firmante y la fecha de la firma.

## 7. Datos y fuentes sugeridas
- Repositorio de legislación y normativa venezolana sobre firma electrónica: Ley sobre Mensajes de Datos y Firmas Electrónicas (2001), Decreto con Fuerza de Ley de Infogobierno, y providencias de la Superintendencia de Servicios de Certificación Electrónica (SUSCERTE).
- Especificaciones abiertas de identidad verificable: W3C Verifiable Credentials Data Model, DID (Decentralized Identifiers) y DIDComm.
- Estándares de firma: PAdES para firma de PDF, RFC 3161 (Time-Stamp Protocol) y WebAuthn/FIDO2 para autenticación resistente a phishing.
- Conjuntos de prueba para biometría facial y detección de suplantación (liveness): Face Anti-Spoofing Challenge datasets (p. ej. CASIA-FASD, CelebA-Spoof) para entrenar/validar el anti-fraude, usados solo en entorno de pruebas.
- Datos sintéticos de trámites públicos (creados por el equipo) para simular carga, métricas de verificación y pruebas de escalabilidad.

## 8. Stack tecnológico sugerido
- Backend serverless: Cloudflare Workers (TypeScript) + Workers KV o D1 para credenciales y sesiones, y R2 para almacenar documentos firmados y actas.
- Criptografía y firma: Web Crypto API / Cloudflare Workers con soporte de claves ECDSA-P256 y SHA-256; generación de PDF firmado con PAdES (p. ej. `@signpdf`/`node-signpdf` en un Workers o un servicio auxiliar) y sellos de tiempo RFC 3161.
- Autenticación: passkeys/WebAuthn (FIDO2) + TOTP; para el prototipo, librerías como `@simplewebauthn/server` y `otplib`.
- Identidad verificable: credenciales W3C VC firmadas con DID:key, usando `did:key` y JSON-LD + JSON Web Signature (JWS).
- IA anti-fraude: Workers AI (modelos de detección facial/verificación de liveness) o un servicio de IA para comparar selfie contra foto de documento y detectar suplantación.
- Frontend: React/Next.js desplegado en Cloudflare Pages con Turnstile para proteger formularios de alta y login contra bots.
- Observabilidad y auditoría: log inmutable con hash encadenado en Durable Objects + almacenamiento de hashes de auditoría en un registro verificable.

## 9. Ente público y visión de despliegue
Lo adopta un ente público encargado de la transformación digital de trámites (una alcaldía, gobernación o servicio de atención ciudadana) que quiera sustituir la firma manuscrita y la validación presencial por identidad y firma digital. La implementación se haría en fases: (1) piloto con un trámite interno de bajo riesgo, (2) emisión de identidades digitales al personal y luego a ciudadanos, y (3) integración con el sistema de gestión de trámites del ente mediante API, manteniendo un nodo de verificación pública accesible vía QR. Se alinea con la Ley de Infogobierno como marco habilitante de interoperabilidad y seguridad del Estado.

## 10. Definition of Done
- [ ] El ciudadano puede registrarse con cédula + selfie y recibir una credencial verificable funcional en el entorno de demo.
- [ ] La autenticación MFA (passkey o TOTP) está operativa y bloquea accesos sin segundo factor.
- [ ] Un PDF puede firmarse electrónicamente y la firma es verificable por QR con estado válido/inválido en menos de 1 segundo.
- [ ] Existe un log de auditoría inmutable con hash encadenado que registra identidad, autenticación y firmas.
- [ ] El prototipo pasa una demostración en vivo ante el jurado con un trámite de extremo a extremo y la documentación SPEC.md completa.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Identidad digital ciudadana y firma electrónica segura
## Problema
Los trámites presenciales dependen de identidades verificables y firmas, causando desplazamientos, colas y riesgo de suplantación y falsificación.

## RF / RNF
- RF-01: Alta de ciudadano con cédula + selfie biométrico verificado por IA.
- RF-02: Emisión de credencial de identidad verificable (W3C VC).
- RF-03: Autenticación fuerte MFA (passkey/WebAuthn o TOTP).
- RF-04: Firma electrónica de PDF con hash, sello de tiempo y acta auditable.
- RF-05: Registro de auditoría inmutable con hash encadenado.
- RF-06: Verificación en línea de credencial y firma por código QR.
- RNF-01: Seguridad y privacidad (cifrado, mínima divulgación, Infogobierno).
- RNF-02: Escalabilidad serverless para picos de verificación.
- RNF-03: Rendimiento: verificación < 1 s (p95), emisión < 30 s.
- RNF-04: Accesibilidad WCAG 2.1 AA y móvil de gama baja.

## Historias de usuario
- Como ciudadano, quiero crear mi identidad digital con cédula y selfie, para autenticarme en trámites sin ir presencialmente.
- Como funcionario, quiero verificar identidad y firma escaneando un QR, para aprobar trámites con certeza legal.
- Como persona jurídica, quiero firmar electrónicamente con validez y trazabilidad, para eliminar el papel.

## Criterios de aceptación
- Dado un ciudadano con cédula y selfie válidos, cuando completa el onboarding, entonces recibe credencial y puede iniciar sesión con MFA.
- Dado un PDF y un usuario autenticado con MFA, cuando firma, entonces se genera PDF firmado con hash, sello de tiempo y acta verificable.
- Dado un intento de suplantación o MFA fallido, cuando ocurre, entonces se rechaza y se registra en auditoría.
- Dado un QR de firma, cuando se escanea, entonces se obtiene validez, firmante y fecha en menos de 1 segundo.

## Fuera de alcance
- Emisión de cédulas de identidad oficiales (se consume la cédula como dato de entrada, no se reemplaza al SAIME).
- Firma calificada con certificados de una autoridad de certificación acreditada (se simula o se integra en fase posterior).
- Gestión completa del expediente del trámite (se entrega solo la capa de identidad y firma).
- Resolución de disputas legales o notariado electrónico.
```

## 12. Elevator Pitch
El Estado venezolano sigue dependiendo de trámites presenciales con firma manuscrita, lo que genera desplazamientos, colas y riesgo de suplantación. Este proyecto entrega a un ente público de transformación digital (alcaldía, gobernación o servicio de atención ciudadana) una identidad digital verificable con autenticación multifactor y firma electrónica de PDF con validez legal y trazabilidad, verificable en línea por QR en menos de un segundo. Sustituye el papel y la validación presencial por un flujo 100 % digital: un trámite que hoy toma horas pasa a resolverse en menos de 10 minutos, con un registro de auditoría inmutable alineado a la Ley de Infogobierno.

## 13. Impacto en el organismo público
- **Eficiencia**: reduce el tiempo de un trámite con firma presencial de horas a menos de 10 minutos de firma electrónica remota, descongestionando oficinas y eliminando colas.
- **Transparencia**: cada firma queda ligada criptográficamente a un documento y a una identidad verificada, con acta de firma y log de auditoría inmutable con hash encadenado.
- **Confianza ciudadana**: la verificación en línea de credenciales y firmas mediante código QR permite a funcionarios y ciudadanos validar la autenticidad sin instalar software, reduciendo suplantación de identidad y falsificación.
- **Ahorro de recursos**: elimina papel, desplazamientos y duplicación de expedientes al digitalizar la capa de identidad y firma de los trámites.
- **Cumplimiento normativo**: se alinea con la Ley de Infogobierno y con estándares de firma electrónica (Ley sobre Mensajes de Datos y Firmas Electrónicas, SUSCERTE, PAdES y RFC 3161).

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
