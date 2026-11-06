# SDD — Sistema de gestión de consentimiento y derechos del titular

> Hackathon UNETI IA 2026 · Proyecto #8 · Eje 1 · IA Ética · Complejidad: Media
> Ente público: Toda la administración

## 1. Problema
Los entes de la administración pública venezolana recolectan datos personales de los ciudadanos (cédula, nombre, dirección, historial de trámites) sin registrar de forma verificable el consentimiento otorgado, ni ofrecen canales ágiles para ejercer los derechos de acceso y rectificación que exige la ley. Esto afecta a toda persona que interactúa con el Estado, expone a los organismos a sanciones y pérdida de confianza ciudadana, y dificulta demostrar la legalidad del tratamiento ante auditorías. Importa porque un Estado que no gestiona el consentimiento ni la trazabilidad de los datos erosiona la confianza pública y no puede rendir cuentas sobre cómo usa la información de sus ciudadanos.

## 2. Objetivos
- Registrar y auditar el consentimiento explícito del ciudadano por cada finalidad de tratamiento, con fecha, versión del aviso de privacidad y evidencia íntegra (hash) en menos de 60 días desde el arranque.
- Permitir que el ciudadano presente solicitudes de acceso, rectificación, supresión y oposición (derechos ARCO) con número de radicado, estado y tiempo de respuesta trazables.
- Reducir el tiempo de respuesta de una solicitud de acceso/rectificación de más de 30 días a un máximo de 5 días hábiles mediante flujo de trabajo automatizado con IA de triaje.
- Generar un registro de trazabilidad (quién accedió, cuándo, para qué finalidad y con qué base legal) que sirva como evidencia auditable ante la autoridad de protección de datos.

## 3. Requisitos funcionales (RF)
- RF-01: El sistema debe permitir registrar el consentimiento de un ciudadano (otorgado o denegado) asociado a un aviso de privacidad versionado, con sello de tiempo y hash SHA-256 inmutable.
- RF-02: El sistema debe permitir crear solicitudes de acceso, rectificación, supresión y oposición, asignando un número de radicado único y un estado del ciclo de vida (recibida, en revisión, respondida, vencida).
- RF-03: El sistema debe validar la identidad del solicitante contra cédula de identidad y un segundo factor (correo o SMS) antes de entregar datos personales o efectuar rectificaciones.
- RF-04: El sistema debe permitir que un funcionario responda a una solicitud adjuntando la información exportada o la corrección aplicada, dejando constancia de la acción.
- RF-05: El sistema debe registrar un log de trazabilidad inalterable de cada acceso, consulta, modificación y consentimiento (quién, qué dato, cuándo, finalidad y base legal), consultable por el delegado de protección de datos.
- RF-06: El sistema debe notificar automáticamente al ciudadano por correo electrónico o SMS el estado de su solicitud y el resultado final.

## 4. Requisitos no funcionales (RNF)
- RNF-01: Seguridad/privacidad — cifrado de datos en tránsito (TLS 1.3) y en reposo (AES-256), minimización de datos, seudonimización de bitácoras y control de acceso por roles; el ciudadano solo ve sus propios datos.
- RNF-02: Escalabilidad — la plataforma debe soportar al menos 10 organismos públicos concurrentes y crecer hasta 1 millón de titulares de datos sin degradación de la consulta de consentimiento.
- RNF-03: Rendimiento — el registro de consentimiento debe confirmarse en menos de 500 ms y la consulta de trazabilidad de un titular debe responder en menos de 2 segundos en condiciones normales de carga.
- RNF-04: Accesibilidad/usabilidad — interfaz conforme a WCAG 2.1 AA, lenguaje ciudadano claro, operación en navegadores móviles de gama baja y disponibilidad offline de lectura para los formularios de solicitud.

## 5. Historias de usuario
- Como ciudadano, quiero otorgar o retirar mi consentimiento para cada finalidad de tratamiento, para tener control real sobre cómo el ente usa mis datos personales.
- Como ciudadano, quiero presentar una solicitud de acceso o rectificación y seguir su estado con un número de radicado, para ejercer mis derechos sin acudir presencialmente a una oficina.
- Como delegado de protección de datos, quiero consultar la trazabilidad completa de un titular y exportar un informe auditable, para demostrar el cumplimiento legal ante la autoridad y las auditorías.

## 6. Criterios de aceptación
- Dado un ciudadano identificado con cédula y segundo factor, cuando otorga consentimiento para una finalidad, entonces el sistema guarda un registro con sello de tiempo, versión del aviso y hash verificable, y le muestra la confirmación en menos de 500 ms.
- Dado un ciudadano que envía una solicitud de rectificación, cuando adjunta la evidencia del dato correcto, entonces el sistema genera un radicado único y notifica al funcionario responsable, quedando el estado "en revisión" registrado.
- Dado un funcionario que responde una solicitud de acceso, cuando adjunta la exportación de los datos del titular, entonces el sistema registra la acción en la trazabilidad y notifica al ciudadano con el resultado y la fecha de respuesta.
- Dado un auditor con permiso de consulta, cuando busca la trazabilidad de un titular, entonces obtiene en menos de 2 segundos la secuencia cronológica de accesos y consentimientos con finalidad y base legal, sin poder editarla.

## 7. Datos y fuentes sugeridas
- Marco legal venezolano de referencia: Constitución de la República Bolivariana de Venezuela (art. 28 y 60), Ley de Infonocracia vigente y proyectos de ley de protección de datos personales (a verificar con la versión aplicable al 2026).
- Reglamentos y normativa de SUDEBAN/INFOCENTRO y del ente rector de protección de datos que se designe; guías de la autoridad iberoamericana (Red Iberoamericana de Protección de Datos — RIPD).
- Estándares internacionales para el diseño: Reglamento General de Protección de Datos de la UE (RGPD/GDPR) como referencia de derechos ARCO y bases de legalidad, e ISO/IEC 29100 (marco de privacidad) e ISO/IEC 27701 (gestión de información de privacidad).
- Datos sintéticos para prototipado y pruebas: generación de titulares ficticios (cédulas de ejemplo, nombres sintéticos, historiales de trámites) con la librería `faker` y conjuntos anonimizados del portal de datos abiertos de Venezuela (datos.gob.ve), evitando usar datos personales reales de ciudadanos.

## 8. Stack tecnológico sugerido
- Frontend: React + TypeScript con Vite y Tailwind CSS; formularios accesibles con accesibilidad AA y modo claro/oscuro.
- Backend: API serverless en Cloudflare Workers (o Node.js + Hono) con validación de esquemas mediante Zod.
- Persistencia: Cloudflare D1 (SQLite) para datos de solicitudes y consentimientos, y Cloudflare KV para avisos de privacidad versionados y caché de configuraciones.
- Trazabilidad inmutable: registro de auditoría con hash encadenado (cadena tipo hash-chain) almacenado en Cloudflare R2, con cada evento firmado y sello de tiempo.
- IA ética: Cloudflare Workers AI (modelos de embeddings y clasificación ligera) para triaje y categorización de solicitudes ARCO, con supervisión humana obligatoria y sin decisiones automatizadas sobre derechos.
- Autenticación y firma: Cloudflare Access / Zero Trust para funcionarios, y verificación de identidad ciudadana con segundo factor OTP (SMS/correo) mediante un proveedor de mensajería.
- Correo transaccional: Cloudflare Email Service para notificaciones de estado de solicitudes y confirmaciones de consentimiento.
- Infraestructura como código y despliegue: Wrangler para despliegue continuo, y repositorio Git con CI/CD (GitHub Actions) para pruebas y despliegue automático.

## 9. Ente público y visión de despliegue
La plataforma es adoptada transversalmente por "toda la administración": un ente rector (por ejemplo, un futuro organismo de protección de datos o el ministerio competente en gobierno digital) opera la instancia central y habilita tenancias por organismo, de modo que cada entidad pública (ministerios, institutos, alcaldías, empresas del Estado) gestione a sus propios titulares sin duplicar infraestructura. El despliegue es progresivo en tres fases: (1) piloto en un organismo con un volumen controlado de titulares para validar consentimiento y solicitudes de acceso/rectificación; (2) incorporación de más organismos con un panel de administración multitenant y capacitación de delegados de protección de datos; y (3) integración con el portal único de trámites y con sistemas de gestión documental del Estado para que los radicados convivan con los flujos oficiales. La adopción se mide por el número de organismos integrados, el porcentaje de solicitudes respondidas dentro del plazo y la disponibilidad de evidencia auditable ante la autoridad de protección de datos.

## 10. Definition of Done
- [ ] El registro de consentimiento queda persistido con sello de tiempo, versión del aviso y hash, y es verificable sin modificar el registro original.
- [ ] El flujo completo de solicitud de acceso y rectificación (radicación → revisión → respuesta → notificación) funciona de extremo a extremo con datos de prueba.
- [ ] La trazabilidad de un titular es consultable, cronológica, no editable y exportable como informe con la base legal de cada acceso.
- [ ] Las pruebas de seguridad cubren cifrado en tránsito/reposo, control de roles y validación de identidad con segundo factor.
- [ ] La documentación para el usuario ciudadano y el funcionario delegado está redactada en lenguaje claro y disponible en el propio sistema.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Sistema de gestión de consentimiento y derechos del titular
## Problema
Los entes públicos no gestionan el consentimiento ni los derechos de acceso/rectificación de datos personales, exponiéndose a sanciones y erosionando la confianza ciudadana.

## RF / RNF
- RF-01: Registrar consentimiento versionado con sello de tiempo y hash.
- RF-02: Crear solicitudes ARCO con radicado único y estado trazable.
- RF-03: Validar identidad con cédula y segundo factor antes de entregar o rectificar datos.
- RF-04: Responder solicitudes adjuntando exportación o corrección con constancia.
- RF-05: Mantener trazabilidad inalterable de accesos y consentimientos.
- RNF-01: Cifrado TLS 1.3/AES-256, roles y minimización de datos.
- RNF-02: Escalar a 10 organismos y hasta 1 millón de titulares.
- RNF-03: Confirmación de consentimiento < 500 ms; trazabilidad < 2 s.
- RNF-04: Accesibilidad WCAG 2.1 AA y lenguaje ciudadano.

## Historias de usuario
- Como ciudadano, quiero otorgar o retirar mi consentimiento por finalidad, para controlar el uso de mis datos.
- Como ciudadano, quiero presentar una solicitud de acceso/rectificación y seguir su estado, para ejercer mis derechos en línea.
- Como delegado de protección de datos, quiero exportar la trazabilidad de un titular, para demostrar cumplimiento ante auditorías.

## Criterios de aceptación
- Dado un ciudadano identificado, cuando otorga consentimiento, entonces se guarda registro con hash verificable y confirmación < 500 ms.
- Dado un ciudadano que solicita rectificación con evidencia, cuando la envía, entonces se genera radicado único y el estado pasa a "en revisión".
- Dado un funcionario que responde una solicitud de acceso, cuando adjunta la exportación, entonces se registra la acción y se notifica al ciudadano.
- Dado un auditor, cuando consulta la trazabilidad de un titular, entonces obtiene el historial cronológico no editable en < 2 s.

## Fuera de alcance
- No se toman decisiones automatizadas que nieguen o aprueben derechos ARCO sin revisión humana.
- No se recolectan ni procesan datos biométricos ni categorías especiales en esta fase (Media).
- No se reemplaza el sistema de gestión documental oficial del Estado; solo se integra con él.
- No se presta asesoría jurídica personalizada; la plataforma remite a la normativa vigente.
```

## 12. Elevator Pitch
Los entes de la administración pública venezolana hoy recolectan datos personales sin dejar constancia verificable del consentimiento ni ofrecer canales ágiles para ejercer los derechos de acceso y rectificación. Nuestra plataforma registra cada consentimiento con sello de tiempo y hash inmutable, y gestiona las solicitudes ARCO con radicado, estado y trazabilidad auditable, reduciendo el tiempo de respuesta de más de 30 días a un máximo de 5 días hábiles gracias al triaje con IA supervisada. Está pensada para que "toda la administración" la adopte de forma transversal mediante un ente rector con tenancias por organismo, sin duplicar infraestructura. El valor diferencial es demostrar legalidad ante la autoridad de protección de datos y devolver al ciudadano el control real sobre su información, reconstruyendo la confianza en el Estado.

## 13. Impacto en el organismo público
- **Eficiencia operativa:** el flujo de trabajo automatizado con triaje por IA reduce el tiempo de respuesta de una solicitud de acceso/rectificación de más de 30 días a un máximo de 5 días hábiles, liberando a los funcionarios de tareas manuales de radicación y seguimiento.
- **Transparencia y rendición de cuentas:** el registro de trazabilidad inalterable (quién accedió, cuándo, para qué finalidad y con qué base legal) convierte cada tratamiento en evidencia auditable ante la autoridad de protección de datos.
- **Confianza ciudadana:** el ciudadano puede otorgar o retirar consentimiento por finalidad y seguir el estado de sus solicitudes en línea con un número de radicado, sin acudir presencialmente a una oficina.
- **Ahorro de recursos:** el despliegue multitenant con tenancias por organismo evita que ministerios, institutos, alcaldías y empresas del Estado dupliquen infraestructura, mientras el cifrado, la minimización y la seudonimización reducen el riesgo y el costo de incidentes.
- **Cumplimiento normativo:** la plataforma alinea a los entes con la Constitución (arts. 28 y 60), la Ley de Infonocracia y los estándares de referencia (RGPD/GDPR, ISO/IEC 29100 e ISO/IEC 27701), mitigando sanciones y facilitando auditorías.

## 14. README y documentación del proyecto
El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción:** "Sistema de gestión de consentimiento y derechos del titular" — registra consentimientos versionados con hash inmutable y gestiona solicitudes ARCO con trazabilidad auditable para la administración pública venezolana.
- **Badges:** estado de build, pruebas, cobertura y licencia (GitHub Actions, coverage, MIT).
- **Características:** registro de consentimiento por finalidad con hash SHA-256; solicitudes ARCO con radicado y ciclo de vida; validación de identidad con segundo factor; trazabilidad inalterable tipo hash-chain; triaje con IA supervisada; notificaciones transaccionales; panel multitenant por organismo.
- **Arquitectura:** diagrama de componentes (frontend React + TypeScript → API Cloudflare Workers/Hono → D1 y KV → R2 para hash-chain → Workers AI → Cloudflare Email Service y Access/Zero Trust) y flujo de datos del consentimiento y de una solicitud ARCO.
- **Instalación y ejecución:** prerrequisitos (Node.js, pnpm, cuenta Cloudflare/Wrangler), pasos de instalación, variables de entorno (orígenes permitidos, credenciales de mensajería, secretos de firma) y comandos de arranque en local y despliegue.
- **Uso:** ejemplos de endpoints/API (registrar consentimiento, crear/consultar solicitud ARCO, exportar trazabilidad), capturas de la interfaz ciudadana y del panel del delegado.
- **Datos y datasets:** marco legal de referencia, guías de la autoridad y RIPD, estándares ISO, y datos sintéticos generados con `faker` (nunca datos personales reales); instrucciones para obtener el portal de datos abiertos (datos.gob.ve).
- **Pruebas:** cómo ejecutar la suite de pruebas unitarias, de integración y de seguridad (cifrado, roles, segundo factor).
- **Contribución:** guía para colaborar (flujo de ramas, revisión de PR, convenciones de commits y de código).
- **Licencia y créditos:** licencia del proyecto y créditos a los equipos y estándares utilizados.

### Carpeta docs/
- `SPEC.md` — especificación del proyecto (versión ampliada de la plantilla de la sección 11).
- `SDD.md` — este documento (diseño de la solución).
- `architecture.md` — diagramas y decisiones de diseño (multitenant, hash-chain, IA con supervisión humana, cifrado).
- `user-guide.md` — manual de usuario para el ciudadano y el delegado de protección de datos.

### Otros archivos
- `LICENSE`, `.gitignore`, `.env.example`, `requirements.txt` o `pyproject.toml` (según el runtime), `Dockerfile` y `docker-compose.yml` (si aplica para ejecución local contenerizada).

## 15. Preparación de la presentación en Google NotebookLM
Para preparar la defensa del proyecto con NotebookLM:

1. **Reúne los insumos** del proyecto: este SDD, el SPEC, el README, el código fuente (o fragmentos clave), la descripción del dataset (datos sintéticos y marco legal) y las capturas/demo.
2. **Crea un notebook** en NotebookLM y **sube** esos insumos como fuentes.
3. **Genera la "Guía de estudio"** para estructurar el pitch (problema → solución → impacto → demo).
4. **Genera el "Resumen de audio" (Audio Overview)** para practicar el pitch hablado y afinar el guion.
5. **Haz preguntas al notebook** para ensayar la defensa ante el jurado (ej.: "¿cuál es mi mayor riesgo técnico?", "¿cómo explico el impacto en 30 segundos?").
6. **Genera un "Briefing"** alineado a la rúbrica: viabilidad, impacto, innovación/IA, pitch, ética y escalabilidad.
