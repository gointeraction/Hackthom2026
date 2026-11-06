# SDD — Escáner de vulnerabilidades de aplicaciones del Estado

> Hackathon UNETI IA 2026 · Proyecto #30 · Eje 2 · Ciberseguridad · Complejidad: Media
> Ente público: Desarrollo gubernamental

## 1. Problema
El software público venezolano —portales de trámites, sistemas de registro y aplicaciones ministeriales— acumula vulnerabilidades conocidas (CVEs) en el código propio y en las dependencias de terceros, y los equipos no cuentan con una herramienta unificada para detectarlas a tiempo. Esto afecta a ciudadanos cuyos datos personales quedan expuestos y a los organismos públicos que pierden confianza y pueden sufrir incidentes con impacto legal y reputacional. Detectar estas fallas de forma temprana y continua es crítico porque un solo CVE explotable en una librería obsoleta puede comprometer un sistema completo.

## 2. Objetivos
- Escanear automáticamente el **100 %** de los repositorios de una organización gubernamental inscrita, combinando SAST (código fuente) y DAST (aplicación en ejecución) en un único flujo.
- Verificar y priorizar **al menos el 95 %** de las dependencias declaradas (package.json, requirements.txt, pom.xml, etc.) contra bases CVE como NVD y OSV, con severidad CVSS y factor EPSS.
- Reducir el tiempo medio de detección de una vulnerabilidad de "meses" a **menos de 24 horas** desde la publicación del CVE, integrando el escáner en CI/CD.
- Entregar un reporte consolidado y accionable (hallazgo → severidad → evidencia → recomendación de remediación) que cualquier responsable técnico pueda consumir sin ser experto en seguridad.

## 3. Requisitos funcionales (RF)
- RF-01: El sistema debe admitir el ingreso de proyectos mediante URL de repositorio Git (HTTP/SSH) o mediante un archivo SBOM en formato CycloneDX/SPDX.
- RF-02: El motor SAST debe analizar el código fuente con reglas configurables (p. ej. Semgrep) para detectar fallas tipo OWASP Top 10: inyección SQL, XSS, deserialización insegura y manejo incorrecto de secretos.
- RF-03: El motor DAST debe ejecutar un escaneo pasivo y activo sobre la aplicación desplegada (mediante la API de OWASP ZAP) y correlacionar los hallazgos con las rutas/endpoints del sitio.
- RF-04: El sistema debe construir el inventario de dependencias (SBOM) a partir de los manifiestos del proyecto y consultarlo contra NVD, OSV y GHSA para verificar CVEs, mostrando CVSS v3/v4, vector de ataque y estado de la corrección disponible.
- RF-05: El sistema debe emitir un informe por proyecto y uno consolidado por organización, exportable en PDF/JSON, con severidad crítica/alta/media/baja, evidencia reproducible y recomendación de remediación priorizada.
- RF-06: El sistema debe exponer una API REST autenticada (con token de servicio) para disparar escaneos y consultar resultados desde pipelines de CI/CD (GitLab/GitHub Actions).

## 4. Requisitos no funcionales (RNF)
- RNF-01 — Seguridad/privacidad: Las credenciales de repositorios y los tokens de integración deben almacenarse cifrados (KMS/secret manager) y nunca persistirse en logs; todo el tráfico de la API y del panel debe ir sobre TLS 1.2+.
- RNF-02 — Escalabilidad: El sistema debe soportar el escaneo concurrente de **al menos 50 repositorios** mediante una cola de trabajos (message queue) y autoescalado de workers; el catálogo de CVEs debe permitir actualización incremental sin detener el servicio.
- RNF-03 — Rendimiento: Un escaneo SAST de un repositorio de hasta 10 000 líneas debe completarse en **menos de 5 minutos**; la verificación de dependencias de un proyecto mediano (≤ 500 paquetes) en **menos de 2 minutos**; el panel debe responder en **< 1 s** para consultas de listado.
- RNF-04 — Accesibilidad/usabilidad: El panel de resultados debe cumplir WCAG 2.1 AA (contraste, navegación por teclado, etiquetas ARIA) y mostrar los hallazgos con un semáforo de severidad y filtros claros, de modo que un responsable no técnico pueda interpretar el riesgo.

## 5. Historias de usuario
- Como **analista de seguridad de un ministerio**, quiero ejecutar un escaneo SAST/DAST sobre un portal de trámites y ver los hallazgos con su severidad, para priorizar qué vulnerabilidades corregir primero.
- Como **desarrollador/a de una aplicación gubernamental**, quiero que el escáner se ejecute automáticamente en cada merge request, para detectar una dependencia con un CVE crítico antes de que llegue a producción.
- Como **director/a de tecnología del ente público**, quiero un reporte consolidado con el inventario de vulnerabilidades y su tendencia en el tiempo, para reportar el estado de riesgo y justificar inversiones de remediación.

## 6. Criterios de aceptación
- Dado un repositorio con una dependencia `lodash@4.17.15` (CVE-2021-23337, inyección de comandos), cuando se ejecuta el escaneo de dependencias, entonces el informe debe marcar la dependencia como **crítica** e indicar la versión corregida (≥ 4.17.21).
- Dado un endpoint con un formulario vulnerable a XSS reflejado, cuando DAST ejecuta el escaneo activo, entonces el hallazgo debe aparecer asociado a la URL exacta y con la evidencia del payload de prueba.
- Dado un commit que introduce una clave secreta hardcodeada (API key) en el código, cuando el pipeline ejecuta SAST, entonces el build debe fallar (gate de bloqueo) y notificar al autor del commit.
- Dado un reporte de organización con 20 repositorios escaneados, cuando el usuario lo exporta a PDF, entonces debe incluir un resumen ejecutivo con conteos por severidad y la lista de CVEs con su CVSS y enlace a NVD.

## 7. Datos y fuentes sugeridas
- **NVD (National Vulnerability Database)** — API de CVEs y feeds JSON: `https://nvd.nist.gov/vuln/data-feeds` y `https://services.nvd.nist.gov/rest/json/cves/2.0`.
- **OSV.dev** — base abierta de vulnerabilidades por ecosistema (npm, PyPI, Maven, Go) con API pública: `https://api.osv.dev/v1/query`.
- **GitHub Advisory Database (GHSA)** — avisos de seguridad de dependencias: `https://github.com/advisories`.
- **FIRST EPSS** — puntaje de explotabilidad para priorizar CVEs: `https://www.first.org/epss/data_stats`.
- **OWASP Top 10 (2021)** y **OWASP Benchmark** — referencia de categorías de fallas y corpus de prueba para validar la precisión del SAST.
- **Registro de reglas de Semgrep** (`https://semgrep.dev/explore`) y reglas de OWASP ZAP (ZAP Baseline scan) como punto de partida de detección.
- **CVE-Search / cve.circl.lu** — espejo local consultable de CVE para escenarios sin conectividad directa a NVD.
- **Dependencias de ejemplo**: SBOMs públicos (p. ej. de proyectos en `osv.dev` o `https://github.com/CycloneDX/bom-examples`) para construir casos de prueba.

## 8. Stack tecnológico sugerido
- **Lenguaje principal**: Python 3.12 (backend de orquestación y análisis) con TypeScript para el panel web.
- **Backend/Framework**: FastAPI para la API REST; Celery + Redis como cola de trabajos y autoescalado de escaneos.
- **Motores de escaneo**: Semgrep (SAST), OWASP ZAP vía API/`zap-baseline` (DAST), y OSV-Scanner, Trivy o Grype para dependencias y SBOM (generación con `syft`).
- **Base de datos y caché**: PostgreSQL (proyectos, hallazgos, historial) y Redis (cola + caché de resultados).
- **Frontend**: React + Next.js con un dashboard de semáforo de severidad y gráficos de tendencia (Recharts).
- **Plataforma Cloudflare (despliegue y servicios)**: Cloudflare Workers para webhooks de CI/CD y tareas programadas, Cloudflare D1/KV para catálogo y caché de CVEs, Cloudflare Queues para encolar escaneos, Cloudflare Pages para el panel y Cloudflare Access para el control de acceso del ente público.
- **IA (eje Hackathon UNETI IA 2026)**: Workers AI (modelo de texto) para resumir cada CVE en lenguaje claro y sugerir pasos de remediación automáticamente; embeddings (Vectorize) para agrupar hallazgos similares y reducir duplicados/ruido.

## 9. Ente público y visión de despliegue
El sistema lo adopta un organismo de **desarrollo gubernamental** (p. ej. el área de tecnología de un ministerio o la UNETI como ente rector de TIC del Estado). Se despliega como un **servicio central de escaneo** al que se conectan los repositorios de las distintas instituciones: el panel y la API corren sobre Cloudflare (Pages + Workers + D1/KV), mientras que los workers de escaneo (Semgrep/ZAP/OSV-Scanner) se ejecutan en contenedores on-premise o en la nube privada del ente, protegiendo así los repositorios internos que no deben salir a internet. Cada institución recibe un espacio de trabajo aislado con su propio token de servicio, y los reportes consolidados alimentan la toma de decisiones del equipo directivo y las auditorías de seguridad del Estado.

## 10. Definition of Done
- [ ] El código fuente del escáner está versionado en Git, con pruebas unitarias e integración (cobertura ≥ 70 %) y un `README` de instalación en español.
- [ ] Un escaneo de extremo a extremo funciona sobre un repositorio de demostración con al menos un CVE y una falla de código conocidos, y el reporte los documenta con evidencia.
- [ ] La verificación de CVEs consulta NVD/OSV y muestra CVSS, EPSS y enlace público por hallazgo; los resultados se actualizan de forma incremental.
- [ ] La API está autenticada y documentada (OpenAPI), con un webhook funcional que dispara escaneos desde un pipeline de CI/CD de ejemplo.
- [ ] El panel web cumple WCAG 2.1 AA, permite exportar a PDF/JSON y fue validado por al menos un usuario del ente público.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Escáner de vulnerabilidades de aplicaciones del Estado

## Problema
El software público venezolano acumula CVEs sin detectar en el código y en sus dependencias.

## RF / RNF
- RF-01: Ingreso de proyectos por repositorio Git o SBOM (CycloneDX/SPDX).
- RF-02: SAST con Semgrep (OWASP Top 10).
- RF-03: DAST con OWASP ZAP sobre la app desplegada.
- RF-04: Verificación de dependencias contra NVD/OSV/GHSA con CVSS y EPSS.
- RF-05: Reporte consolidado exportable en PDF/JSON.
- RF-06: API REST autenticada para CI/CD.
- RNF-01: Seguridad — secretos cifrados, TLS, sin credenciales en logs.
- RNF-02: Escalabilidad — cola de trabajos, ≥ 50 repos concurrentes.
- RNF-03: Rendimiento — SAST < 5 min / dependencias < 2 min.
- RNF-04: Accesibilidad — panel WCAG 2.1 AA.

## Historias de usuario
- Como analista de seguridad, quiero escanear un portal y ver severidades, para priorizar correcciones.
- Como desarrollador/a, quiero escaneo automático en cada merge request, para frenar CVEs antes de producción.
- Como director/a de tecnología, quiero un reporte consolidado con tendencia, para reportar el riesgo.

## Criterios de aceptación
- Dado `lodash@4.17.15`, cuando se escanean dependencias, entonces se marca CVE-2021-23337 como crítico con versión corregida.
- Dado un endpoint con XSS reflejado, cuando DAST escanea, entonces aparece el hallazgo con URL y payload de evidencia.
- Dado un commit con secreto hardcodeado, cuando SAST corre en CI, entonces el build falla y notifica al autor.
- Dado un reporte de organización, cuando se exporta a PDF, entonces incluye resumen por severidad y enlaces NVD.

## Fuera de alcance
- Explotación activa de vulnerabilidades o pruebas destructivas sobre sistemas productivos del Estado.
- Corrección automática de código (auto-fix) sin aprobación humana.
- Gestión de identidades de los ciudadanos (el sistema no almacena datos personales de usuarios finales).
- Pentesting de infraestructura física, redes o hardware ajeno a las aplicaciones objetivo.
```

## 12. Elevator Pitch
El Estado venezolano publica portales de trámites, registros y aplicaciones ministeriales que arrastran CVEs sin detectar, exponiendo datos de la ciudadanía y la reputación de los organismos. Nuestro **Escáner de vulnerabilidades de aplicaciones del Estado** es un servicio central que combina SAST, DAST y verificación de dependencias en un único flujo, y entrega a cada organismo de desarrollo gubernamental un reporte accionable con severidad, evidencia y remediación priorizada. Se integra al CI/CD para detectar fallas en menos de 24 horas —no en meses— y usa IA para traducir cada CVE a lenguaje claro y agrupar hallazgos duplicados. Es la herramienta unificada que le faltaba al ente rector de TIC para blindar el software público antes de que un solo CVE comprometa un sistema completo.

## 13. Impacto en el organismo público
- **Eficiencia operativa**: un único flujo unificado (SAST + DAST + dependencias) evita que los equipos usen herramientas dispersas, y reduce el tiempo medio de detección de una vulnerabilidad de "meses" a menos de 24 horas.
- **Confianza ciudadana**: al detectar y corregir fallas antes de que expongan datos personales, el organismo protege a la ciudadanía y recupera credibilidad en sus servicios digitales.
- **Transparencia y rendición de cuentas**: los reportes consolidados por organización (exportables en PDF/JSON) alimentan las auditorías de seguridad del Estado y la toma de decisiones del equipo directivo.
- **Ahorro de recursos**: la priorización por CVSS + EPSS y la remediación sugerida por IA enfocan el esfuerzo del personal en los hallazgos de mayor riesgo, evitando incidentes costosos de remediación tardía.
- **Cumplimiento normativo y de seguridad**: el cifrado de credenciales, el TLS 1.2+, la API autenticada y el panel accesible (WCAG 2.1 AA) alinean al ente con buenas prácticas exigibles en el sector público.

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
