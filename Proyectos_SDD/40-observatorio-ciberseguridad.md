# SDD — Observatorio nacional de ciberseguridad

> Hackathon UNETI IA 2026 · Proyecto #40 · Eje 2 · Ciberseguridad · Complejidad: Media
> Ente público: Gobernanza del riesgo ciber

## 1. Problema
En Venezuela no existe una fuente pública, consolidada y actualizada que muestre el panorama nacional de amenazas cibernéticas, por lo que decisores, medios y ciudadanía toman decisiones a ciegas frente a incidentes de phishing, ransomware, fraude digital y vulnerabilidades críticas. Afecta directamente a organismos públicos, empresas y ciudadanos, que no pueden dimensionar el riesgo ni priorizar acciones preventivas, y debilita la capacidad de gobernanza del riesgo ciber a nivel país.

## 2. Objetivos
- Publicar un panel público de métricas que muestre al menos 5 indicadores clave (incidentes por mes, tipo de amenaza predominante, sector más afectado, severidad promedio y tendencia interanual).
- Centralizar incidentes y alertas en un repositorio consultable con filtros por fecha, tipo, sector y severidad, accesible sin registro.
- Reducir el tiempo de consulta del panorama de amenazas de "semanas/días de búsqueda manual" a "minutos" mediante una interfaz unificada.
- Entregar un resumen ejecutivo descargable (PDF/CSV) orientado a decisores de gobernanza del riesgo ciber.

## 3. Requisitos funcionales (RF)
- RF-01: El sistema debe mostrar un dashboard con indicadores agregados (incidentes, alertas, severidad, sectores y tendencia) calculados sobre los datos ingresados.
- RF-02: El sistema debe permitir registrar incidentes y alertas con campos normalizados: fecha, tipo de amenaza, sector afectado, severidad, fuente y descripción.
- RF-03: El sistema debe ofrecer filtrado y búsqueda por fecha, tipo de amenaza, sector y nivel de severidad, con resultados actualizados en tiempo real.
- RF-04: El sistema debe generar un resumen ejecutivo exportable en PDF y un dataset descargable en CSV para decisores y analistas.
- RF-05: El sistema debe publicar una vista ciudadana simplificada (lenguaje claro, sin tecnicismos) con alertas activas y recomendaciones básicas de prevención.
- RF-06: El sistema debe integrar un flujo de ingesta (manual y/o automatizado vía API) para alimentar el repositorio desde fuentes como CSIRT/CERT, medios y reportes públicos.

## 4. Requisitos no funcionales (RNF)
- RNF-01: Seguridad/privacidad — No se publicarán datos personales ni identificadores directos de víctimas; toda ingesta se validará y sanitizará contra inyección, y el acceso de escritura requerirá autenticación y roles (editor público vs. analista interno).
- RNF-02: Escalabilidad — El panel debe soportar picos de tráfico (por ejemplo, durante un incidente nacional de alto impacto) con al menos 10.000 visitas concurrentes, apoyándose en caché en el borde (CDN).
- RNF-03: Rendimiento — El dashboard debe cargar en menos de 2,5 segundos en conexiones 4G y servir los indicadores agregados en menos de 500 ms mediante caché y consultas precalculadas.
- RNF-04: Accesibilidad/usabilidad — Cumplir lineamientos WCAG 2.1 nivel AA (contraste, navegación por teclado, textos alternativos) y ofrecer contenido en español claro, adaptado tanto a decisores técnicos como a ciudadanía general.

## 5. Historias de usuario
- Como decisor de un organismo público, quiero ver un resumen ejecutivo con métricas y tendencias del panorama de amenazas, para priorizar inversiones y políticas de ciberseguridad.
- Como ciudadano, quiero consultar alertas activas en lenguaje claro y saber qué hacer ante una amenaza, para protegerme de fraudes y phishing.
- Como analista de ciberseguridad, quiero registrar y filtrar incidentes por tipo, sector y severidad, para alimentar el observatorio con datos verificables.

## 6. Criterios de aceptación
- Dado un incidente registrado con todos sus campos obligatorios, cuando se guarda, entonces aparece en el listado filtrable y se refleja en los indicadores agregados en menos de 1 minuto.
- Dado un usuario sin sesión, cuando abre la vista ciudadana, entonces puede leer las alertas activas y las recomendaciones sin necesidad de autenticarse.
- Dado un decisor que solicita exportar el resumen, cuando pulsa "Descargar PDF", entonces recibe un documento con las métricas del período seleccionado y la fecha de corte claramente indicada.
- Dado un intento de ingreso con datos malformados o con campos vacíos, cuando se envía el formulario, entonces el sistema rechaza el registro y muestra un mensaje de validación sin guardar datos incompletos.

## 7. Datos y fuentes sugeridas
- Reportes y avisos públicos de CSIRT/CERT nacionales y regionales (CSIRT América Latina, OEA/CICTE, LACNIC-CSIRT).
- Boletines de proveedores de seguridad: CISA KEV (Known Exploited Vulnerabilities), NVD (NIST), FIRST.org, MITRE ATT&CK.
- Datos abiertos y estadísticas de incidentes de organismos públicos venezolanos y de la región (si están publicados).
- Medios especializados y reportes de fraude digital (phishing, suplantación de identidad, ransomware) de organismos bancarios y de telecomunicaciones.
- Datasets de amenazas: AlienVault OTX, Abuse.ch (URLhaus, ThreatFox), Have I Been Pwned (solo como referencia de brechas, sin exponer datos personales).

## 8. Stack tecnológico sugerido
- Frontend: React + TypeScript con Vite; visualización con Recharts o Apache ECharts; estilos con Tailwind CSS.
- Backend/API: Cloudflare Workers (o Node.js + Hono) con API REST; base de datos Cloudflare D1 (SQLite) para incidentes y alertas.
- Caché y distribución: Cloudflare CDN + Workers KV para agregados precalculados y descarga de archivos.
- IA: Workers AI (modelo de texto) para resumir incidentes en lenguaje ciudadano y clasificar severidad/tipo de amenaza a partir de descripciones.
- Autenticación y despliegue: Cloudflare Access para editores internos; CI/CD con GitHub Actions + Wrangler.
- Exportación: generación de PDF en el borde (p. ej., pdf-lib) y CSV como stream descargable.

## 9. Ente público y visión de despliegue
Lo adopta el ente público de "Gobernanza del riesgo ciber", que actuará como propietario del dato y validador editorial de los incidentes publicados. El observatorio se implementa como una aplicación web pública desplegada sobre la infraestructura Cloudflare (Workers + D1 + CDN) para garantizar disponibilidad y resistencia ante picos de tráfico. Un equipo reducido de analistas alimenta y cura los datos mediante un panel autenticado, mientras la ciudadanía consume una vista pública de solo lectura; la adopción se mide por la cantidad de organismos que citan el panel como fuente oficial y por el tráfico ciudadano sostenido.

## 10. Definition of Done
- [ ] El dashboard público muestra al menos 5 indicadores agregados calculados sobre datos reales de prueba.
- [ ] El registro, filtrado y exportación (PDF y CSV) de incidentes funcionan de extremo a extremo sin errores.
- [ ] La vista ciudadana es pública, sin autenticación, y presenta alertas activas con lenguaje claro.
- [ ] Se aplicaron controles de seguridad (sanitización de ingesta, autenticación para edición, ausencia de datos personales publicados) y una prueba básica de carga con ≥10.000 visitas simuladas.
- [ ] El código está versionado, documentado (README con instrucciones de despliegue) y desplegado en una URL accesible públicamente.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Observatorio nacional de ciberseguridad
## Problema
No hay visibilidad pública del panorama de amenazas cibernéticas del país; decisores y ciudadanía no pueden dimensionar el riesgo ni actuar con información.

## RF / RNF
RF: dashboard de métricas; registro y filtrado de incidentes/alertas; exportación PDF/CSV; vista ciudadana pública; ingesta por API.
RNF: privacidad (sin datos personales), escalabilidad (≥10k visitas concurrentes), rendimiento (<2,5s de carga), accesibilidad WCAG 2.1 AA.

## Historias de usuario
- Como decisor, quiero un resumen ejecutivo para priorizar inversiones.
- Como ciudadano, quiero alertas claras y recomendaciones para protegerme.
- Como analista, quiero registrar y filtrar incidentes para alimentar el observatorio.

## Criterios de aceptación
- Un incidente guardado aparece en el listado y en los indicadores en menos de 1 minuto.
- La vista ciudadana es accesible sin autenticación.
- La exportación PDF incluye métricas y fecha de corte.
- Datos malformados se rechazan con mensaje de validación.

## Fuera de alcance
- Atribución forense de ataques o investigación criminal.
- Publicación de datos personales de víctimas o de infraestructura crítica no pública.
- Respuesta a incidentes en tiempo real (SOC operativo) y mitigación activa de amenazas.
- Cifrado/análisis de malware ejecutable dentro de la plataforma.
```

## 12. Elevator Pitch
El Observatorio nacional de ciberseguridad centraliza en un panel público y actualizado el panorama de amenazas cibernéticas del país — phishing, ransomware, fraude digital y vulnerabilidades críticas — que hoy en Venezuela nadie consolida en una única fuente. Está dirigido al ente público de "Gobernanza del riesgo ciber", que lo adopta como propietario del dato y validador editorial, y ofrece tanto una vista ciudadana en lenguaje claro como resúmenes ejecutivos descargables (PDF/CSV) para decisores. Su valor diferencial es transformar semanas de búsqueda manual en minutos, permitiendo a los organismos priorizar inversiones y políticas de ciberseguridad, y a la ciudadanía protegerse de fraudes y phishing.

## 13. Impacto en el organismo público
- **Eficiencia:** reduce el tiempo de consulta del panorama de amenazas de "semanas/días de búsqueda manual" a "minutos" mediante una interfaz unificada y resúmenes ejecutivos descargables.
- **Transparencia:** publica un panel abierto, sin registro, con métricas agregadas y una vista ciudadana en lenguaje claro, fortaleciendo la rendición de cuentas sobre el estado de la ciberseguridad nacional.
- **Confianza ciudadana:** acerca alertas activas y recomendaciones básicas de prevención a la ciudadanía general, ayudando a mitigar phishing y fraude digital.
- **Ahorro de recursos:** centraliza incidentes y alertas en un repositorio único con ingesta manual y automatizada vía API, evitando búsquedas dispersas y trabajo editorial duplicado.
- **Cumplimiento normativo y seguridad:** garantiza privacidad (sin datos personales publicados), sanitización de ingesta, roles de edición autenticados y accesibilidad WCAG 2.1 nivel AA.

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
