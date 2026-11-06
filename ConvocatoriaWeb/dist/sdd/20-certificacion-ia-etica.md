# SDD — Plataforma de certificación en IA ética para servidores públicos

> Hackathon UNETI IA 2026 · Proyecto #20 · Eje 1 · IA Ética · Complejidad: Media
> Ente público: MPPCT / CNTI

## 1. Problema
Los funcionarios del Ministerio del Poder Popular para Ciencia y Tecnología (MPPCT) y del Centro Nacional de Tecnologías de Información (CNTI) que toman decisiones sobre sistemas de IA carecen de formación formal en ética aplicada, lo que eleva el riesgo de adoptar soluciones sesgadas, opacas o no auditables. Esta brecha afecta directamente a la administración pública venezolana, porque esas decisiones condicionan cómo la IA impacta a la ciudadanía en trámites, salud, educación y seguridad. Importa porque, sin una base ética común y verificable, la adopción de IA en el Estado puede reproducir discriminación y erosionar la confianza institucional.

## 2. Objetivos
- Certificar al menos el 80 % de los funcionarios decisores del MPPCT y CNTI en un programa de ética de IA durante el primer año de despliegue.
- Reducir en un 50 % las respuestas incorrectas sobre principios de IA ética en la evaluación diagnóstica vs. la evaluación final.
- Aplicar un sistema de evaluación continua con al menos 4 evaluaciones periódicas por participante y renovación anual de la certificación.
- Generar reportes de desempeño por dependencia para identificar brechas formativas y dirigir refuerzos.

## 3. Requisitos funcionales (RF)
- RF-01: El sistema debe registrar funcionarios con su dependencia (MPPCT/CNTI), cargo, correo institucional y nivel de responsabilidad decisoria sobre IA.
- RF-02: El sistema debe ofrecer un itinerario formativo en ética de IA con módulos obligatorios: principios éticos, sesgo y equidad algorítmica, transparencia y explicabilidad, privacidad, rendición de cuentas y marco normativo venezolano e internacional.
- RF-03: El sistema debe aplicar una evaluación diagnóstica inicial y evaluaciones periódicas con preguntas de opción múltiple y casos prácticos de decisión ética.
- RF-04: El sistema debe emitir una certificación digital verificable (con código único) cuando el funcionario supere el umbral de aprobación (≥ 70 %), y notificar su vencimiento anual.
- RF-05: El sistema debe generar dashboards de progreso por dependencia y por participante para los coordinadores de formación.
- RF-06: El sistema debe permitir cargar y versionar casos de estudio reales (anónimos) del contexto público venezolano para las evaluaciones.

## 4. Requisitos no funcionales (RNF)
- RNF-01 (seguridad/privacidad): Los datos personales de los funcionarios deben almacenarse cifrados y tratarse conforme a la normativa venezolana de protección de datos; los casos de estudio deben anonimizarse antes de su publicación.
- RNF-02 (escalabilidad): La plataforma debe soportar el alta simultánea de al menos 2 000 funcionarios y crecer por dependencia sin degradar el servicio.
- RNF-03 (rendimiento): Las evaluaciones deben calificarse en menos de 2 segundos y la carga de los módulos formativos debe completarse en menos de 3 segundos en conexiones institucionales típicas.
- RNF-04 (accesibilidad/usabilidad): La interfaz debe cumplir criterios WCAG 2.1 nivel AA, ser responsive y usable desde dispositivos de oficina de bajo presupuesto, incluyendo navegación por teclado y contraste suficiente.

## 5. Historias de usuario
- Como funcionario decisor del CNTI, quiero completar módulos de ética de IA con casos prácticos de mi área, para aplicar criterios éticos en las licitaciones y proyectos que autorizo.
- Como coordinador de formación del MPPCT, quiero ver el avance y los resultados por dependencia, para programar refuerzos donde se detecten brechas.
- Como funcionario certificado, quiero descargar y verificar mi certificación digital, para acreditar mi competencia ética ante auditorías y procesos internos.

## 6. Criterios de aceptación
- Dado un funcionario registrado con correo institucional válido, cuando completa todos los módulos obligatorios y obtiene ≥ 70 % en la evaluación, entonces el sistema emite su certificación con código único verificable.
- Dado un funcionario cuyo certificado está por vencer, cuando faltan 30 días para el vencimiento, entonces el sistema le envía una notificación automática para la renovación.
- Dado un coordinador con permisos de su dependencia, cuando consulta el dashboard, entonces visualiza el porcentaje de avance y el promedio de resultados por módulo sin ver datos de otras dependencias.
- Dado un caso de estudio real, cuando se intenta publicar sin anonimizar, entonces el sistema bloquea la publicación y exige la anonimización previa.

## 7. Datos y fuentes sugeridas
- Recomendación de la UNESCO sobre la Ética de la Inteligencia Artificial (2021): principios y guías de aplicación.
- Principios de IA de la OCDE (2019) y marco de evaluación de impacto algorítmico.
- Ley de Infogobierno (Venezuela) y normativa del CNTI sobre interoperabilidad y datos abiertos gubernamentales.
- Casos públicos de IA en el sector público latinoamericano (documentos CEPAL sobre gobernanza de datos e IA).
- Datasets para ejercicios de sesgo: COMPAS (análisis crítico de sesgo en justicia), Adult Income (UCI) y Gender Shades (NIST) como material didáctico de detección de sesgo.

## 8. Stack tecnológico sugerido
- Frontend: React + TypeScript con Next.js, desplegado en Cloudflare Pages.
- Backend: API serverless en Cloudflare Workers (TypeScript) con Cloudflare D1 (base de datos SQL) y KV para sesiones y caché.
- IA: Workers AI para el análisis de respuestas abiertas y generación de casos de práctica; Vectorize para emparejar preguntas con contenidos del temario.
- Autenticación: Cloudflare Access con identidad institucional (SSO) para el acceso restringido de funcionarios.
- Certificación verificable: generación de código único (UUID + hash SHA-256) validable en un endpoint público; almacenamiento de artefactos en R2.

## 9. Ente público y visión de despliegue
El MPPCT adopta la plataforma como política de formación institucional obligatoria y el CNTI la opera técnicamente sobre infraestructura nacional con acceso vía Cloudflare Zero Trust. El despliegue comienza como piloto con una cohorte de decisores de ambas instituciones, se valida la tasa de aprobación y la usabilidad, y luego se escala a todas las dependencias. La certificación se integra al expediente del funcionario y su renovación anual garantiza una competencia ética vigente ante el avance de la IA.

## 10. Definition of Done
- [ ] Los 6 módulos obligatorios están publicados con contenido revisado por un comité de ética del MPPCT/CNTI.
- [ ] La evaluación diagnóstica, las evaluaciones periódicas y la certificación con código verificable funcionan de extremo a extremo.
- [ ] El dashboard por dependencia respeta el aislamiento de datos entre dependencias.
- [ ] La plataforma pasa pruebas de accesibilidad WCAG 2.1 AA y una prueba piloto con al menos 50 funcionarios.
- [ ] Existe documentación de operación y un plan de renovación anual de certificaciones.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Plataforma de certificación en IA ética para servidores públicos
## Problema
Funcionarios decisores del MPPCT/CNTI carecen de formación ética en IA, aumentando el riesgo de adopciones sesgadas u opacas en el Estado.

## RF / RNF
- RF-01: Registro de funcionarios con dependencia y nivel decisorio.
- RF-02: Itinerario formativo en ética de IA con 6 módulos obligatorios.
- RF-03: Evaluación diagnóstica y evaluaciones periódicas con casos prácticos.
- RF-04: Certificación digital verificable con renovación anual.
- RF-05: Dashboards de progreso por dependencia.
- RNF-01: Seguridad y privacidad (cifrado y anonimización de casos).
- RNF-02: Escalabilidad (≥ 2 000 funcionarios).
- RNF-03: Rendimiento (calificación < 2 s).
- RNF-04: Accesibilidad WCAG 2.1 AA y usabilidad.

## Historias de usuario
- Como funcionario decisor, quiero completar módulos con casos prácticos, para aplicar criterios éticos en mis decisiones.
- Como coordinador de formación, quiero ver avances por dependencia, para programar refuerzos.
- Como funcionario certificado, quiero verificar mi certificación, para acreditar mi competencia ética.

## Criterios de aceptación
- Dado un funcionario que completa los módulos y aprueba con ≥ 70 %, cuando finaliza la evaluación, entonces recibe su certificación verificable.
- Dado un certificado por vencer, cuando faltan 30 días, entonces se notifica la renovación.
- Dado un caso real sin anonimizar, cuando se intenta publicar, entonces el sistema lo bloquea.

## Fuera de alcance
- Asesoría jurídica vinculante o dictámenes legales sobre cada proyecto de IA.
- Auditoría técnica del código o de los modelos de IA desplegados por terceros.
- Acreditación universitaria formal (título de grado o posgrado).
- Sustitución de los marcos regulatorios vigentes sobre protección de datos.
```

## 12. Elevator Pitch
Los funcionarios del MPPCT y del CNTI toman decisiones sobre IA sin una formación ética común, y eso puede trasladar sesgos y opacidad a trámites, salud, educación y seguridad del Estado. Esta plataforma los certifica mediante un itinerario de ética de IA —principios, sesgo, transparencia, privacidad y rendición de cuentas— con evaluaciones continuas y una certificación digital verificable con código único. Para el MPPCT/CNTI es la forma de convertir la ética en una competencia medible y auditable de su personal, no en una intención abstracta. En 30 segundos: más de 2 000 funcionarios decisores, una base ética común verificable y renovación anual para mantener la confianza institucional ante el avance de la IA.

## 13. Impacto en el organismo público
- **Eficiencia:** un itinerario formativo estandarizado y evaluaciones automatizadas (< 2 s por calificación) reducen el tiempo y el costo de formar y acreditar a miles de decisores del MPPCT/CNTI frente a capacitaciones presenciales puntuales.
- **Transparencia:** la certificación digital verificable con código único y los dashboards por dependencia hacen visible y auditable quién está acreditado y dónde existen brechas formativas.
- **Confianza ciudadana:** una administración pública cuyos decisores acreditan criterios éticos en IA reduce el riesgo de adopciones sesgadas u opacas y refuerza la legitimidad institucional.
- **Ahorro de recursos:** la renovación anual con notificación a 30 días y el aislamiento de datos por dependencia evitan duplicar esfuerzos de formación y centralizan la gobernanza del conocimiento ético.
- **Cumplimiento normativo:** la plataforma se alinea con la Recomendación de la UNESCO, los principios de la OCDE y el marco venezolano (Ley de Infogobierno y normativa CNTI), apoyando la debida diligencia ética exigible al Estado.

## 14. README y documentación del proyecto
El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción**: Plataforma de certificación en IA ética para servidores públicos; forma, evalúa y certifica a funcionarios decisores del MPPCT/CNTI para reducir adopciones de IA sesgadas u opacas.
- **Badges**: build, tests, cobertura y licencia.
- **Características**: registro de funcionarios por dependencia, itinerario de 6 módulos, evaluación diagnóstica y periódicas, certificación verificable con renovación anual, dashboards por dependencia y carga versionada de casos anónimos.
- **Arquitectura**: diagrama de componentes (React/Next.js → Cloudflare Pages; API en Cloudflare Workers; D1/KV/R2; Workers AI y Vectorize; autenticación con Cloudflare Access) y flujo de datos (registro → formación → evaluación → certificación → renovación).
- **Instalación y ejecución**: prerrequisitos (Node.js, cuenta Cloudflare, Wrangler), pasos de despliegue y variables de entorno.
- **Uso**: ejemplos de endpoints/API (registro, evaluación, verificación de certificado por código único), capturas de los dashboards.
- **Datos y datasets**: fuentes (UNESCO, OCDE, Ley de Infogobierno, CEPAL) y datasets didácticos (COMPAS, Adult Income, Gender Shades), formato y cómo obtenerlos.
- **Pruebas**: cómo correrlas (unitarias, de integración y de accesibilidad WCAG 2.1 AA).
- **Contribución**: guía para colaborar (ramas, commits, revisión de contenido por comité de ética).
- **Licencia y créditos**.

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
