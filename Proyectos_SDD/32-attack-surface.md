# SDD — Gestión de superficie de ataque (attack surface)

> Hackathon UNETI IA 2026 · Proyecto #32 · Eje 2 · Ciberseguridad · Complejidad: Media
> Ente público: Inventario de riesgo digital

## 1. Problema
Los organismos públicos venezolanos (ministerios, gobernaciones, alcaldías, entes descentralizados) no conocen el inventario real de sus activos digitales expuestos a Internet: dominios y subdominios abandonados, paneles de administración sin proteger, APIs con versiones vulnerables y credenciales filtradas en foros o repositorios. Esta ceguera operativa les impide medir su superficie de ataque y priorizar qué corregir primero, lo que deja expuestos servicios sensibles y datos de la ciudadanía ante actores maliciosos.

## 2. Objetivos
- Descubrir automáticamente al menos el 90 % de los subdominios y servicios expuestos de un dominio institucional objetivo (por ejemplo `*.gob.ve`) en menos de 24 horas por campaña de escaneo.
- Clasificar cada activo descubierto con una severidad de exposición (Crítico / Alto / Medio / Bajo) basada en señales objetivas (puertos, TLS, cabeceras, firmas de CMS, credenciales), con una precisión validada superior al 85 %.
- Reducir el tiempo medio de detección de un activo nuevo expuesto, de semanas de trabajo manual a menos de 48 horas de escaneo continuo.
- Entregar un panel de inventario que permita al equipo de TI ordenar los hallazgos por riesgo y generar un plan de remediación priorizado por ente.

## 3. Requisitos funcionales (RF)
- RF-01: Descubrimiento de subdominios combinando fuentes pasivas (registros de Certificate Transparency, DNS pasivo) y enumeración activa con diccionarios adaptados a la administración pública venezolana (`intranet`, `portal`, `sistemas`, `gestion`, `tramites`, `presupuesto`).
- RF-02: Escaneo de puertos y detección de servicios para cada activo (HTTP/HTTPS, SSH, RDP, bases de datos, servicios de administración remota), con identificación de versiones de servidor y estado del certificado TLS.
- RF-03: Detección de exposiciones concretas: paneles de administración accesibles (`/admin`, `/wp-admin`, `/phpmyadmin`), directorios listables, archivos de respaldo (`.bak`, `.sql`), y firmas de CMS desactualizados.
- RF-04: Búsqueda de credenciales e información filtrada asociada al dominio objetivo en fuentes públicas (dorks en GitHub, brechas conocidas) y alerta cuando se detecte una coincidencia de correos institucionales.
- RF-05: Panel web de inventario con búsqueda, filtros por severidad/ente/tecnología, línea de tiempo de cambios y exportación del inventario en CSV/JSON para auditoría.
- RF-06: Sistema de notificaciones que alerte por correo o canal interno cuando un activo nuevo crítico aparezca o cambie su nivel de exposición.

## 4. Requisitos no funcionales (RNF)
- RNF-01 (Seguridad/privacidad): los escaneos deben limitarse estrictamente a los dominios autorizados por cada ente (scope explícito), con tasa de peticiones controlada para no causar denegación de servicio; credenciales y datos sensibles solo se almacenan cifrados y en forma de resumen (hash), nunca en texto plano.
- RNF-02 (Escalabilidad): la arquitectura debe soportar el escaneo concurrente de decenas de dominios institucionales y decenas de miles de activos sin degradar la cola de trabajos.
- RNF-03 (Rendimiento): el panel debe responder en menos de 2 segundos para consultas de inventario filtradas y el primer resultado de una campaña debe estar disponible en menos de 5 minutos desde su inicio.
- RNF-04 (Accesibilidad/usabilidad): el panel debe ser usable por personal técnico de TI sin formación avanzada en ciberseguridad, en español, y cumplir pautas básicas de accesibilidad (WCAG 2.1 AA) en contraste y navegación por teclado.

## 5. Historias de usuario
- Como **responsable de TI de un ente público**, quiero obtener automáticamente la lista de mis subdominios y servicios expuestos, para dejar de depender de inventarios manuales desactualizados.
- Como **analista de ciberseguridad**, quiero ver cada activo clasificado por severidad con su evidencia (puerto, versión, captura de cabeceras), para priorizar la remediación de los hallazgos críticos.
- Como **director del ente**, quiero un resumen ejecutivo con el nivel de riesgo digital y su evolución en el tiempo, para justificar presupuesto y acciones correctivas ante la alta dirección.

## 6. Criterios de aceptación
- Dado un dominio institucional autorizado, cuando se ejecute una campaña de descubrimiento, entonces el sistema devuelve en menos de 24 horas un inventario con subdominios, direcciones IP, puertos abiertos y tecnologías detectadas.
- Dado un activo con un panel de administración accesible sin autenticación, cuando se complete el análisis, entonces el activo queda marcado con severidad Crítico y genera una notificación inmediata.
- Dado un cambio en el inventario (activo nuevo, puerto nuevo o servicio cambiado), cuando se compare con la línea de tiempo, entonces el sistema registra la diferencia y la refleja en el panel en menos de 10 minutos.
- Dado un usuario sin formación avanzada, cuando use el panel con filtros de severidad y búsqueda, entonces encuentra un hallazgo específico y lo exporta sin documentación adicional.

## 7. Datos y fuentes sugeridas
- **Certificate Transparency**: crt.sh y flujos CertStream para descubrir subdominios históricos y recién emitidos de dominios `.gob.ve`.
- **Motores de superficie de ataque**: Shodan, Censys y FOFA para enriquecer IP, puertos, banners y versiones de servicio (con API keys de uso académico).
- **Filtraciones y credenciales**: Have I Been Pwned (HIBP) y Dehashed para detectar correos institucionales en brechas; consultas siempre sobre datos anonimizados.
- **Vulnerabilidades y priorización**: NVD/CVE y el catálogo CISA Known Exploited Vulnerabilities (KEV) para mapear versiones a CVEs explotados activamente.
- **Inteligencia OSINT**: dorks en GitHub y buscadores para localizar credenciales, claves API o archivos de configuración expuestos del dominio objetivo.
- **Marcos de referencia**: OWASP (ASVS, Top 10), NIST SP 800-171 y guías de superficie de ataque del MITRE ATT&CK (técnicas de Reconnaissance).
- **Dominios de práctica**: los portales oficiales del Estado venezolano (`.gob.ve`, `.mil.ve`, `.edu.ve`) como alcance de demostración, siempre con autorización previa.

## 8. Stack tecnológico sugerido
- **Lenguajes**: Python 3.12 (orquestación, análisis, notificaciones) y Go (microservicios de escaneo concurrente de alto rendimiento).
- **Herramientas de descubrimiento**: Subfinder, Amass y masscan para subdominios y puertos; Nuclei (ProjectDiscovery) con plantillas para paneles y exposiciones; Nmap con scripts NSE para detección de servicios.
- **Backend/API**: FastAPI (Python) para exponer el inventario como API REST documentada con OpenAPI.
- **Plataforma Cloudflare**: Cloudflare Workers para la API pública y el panel, D1 (SQLite) para el inventario y la línea de tiempo, R2 para almacenar evidencias (capturas de cabeceras), Workers AI para clasificación asistida por LLM de los hallazgos, Cloudflare Access y Turnstile para proteger el acceso y el formulario de ingreso.
- **Frontend**: React + Vite con Tailwind CSS para el panel, con gráficos de severidad y evolución temporal.
- **CI/CD y despliegue**: GitHub Actions para pruebas y Wrangler para desplegar en Cloudflare; contenedores para los workers de escaneo.

## 9. Ente público y visión de despliegue
El sistema es adoptado por un ente rector o una oficina de ciberseguridad del Estado (por ejemplo, un equipo de seguridad de la administración pública) que lo opera como servicio centralizado: cada organismo autoriza su dominio y recibe acceso a su propio inventario. Se despliega como SaaS multi-ente con un arrendatario por organismo, usando Cloudflare para la entrega y la protección del panel, mientras los workers de escaneo corren en una red controlada. La adopción comienza con un piloto sobre 3–5 dominios institucionales, se valida con el equipo de TI, y luego se escala por fases a más entes, integrando el panel a los flujos de remediación existentes.

## 10. Definition of Done
- [ ] El sistema descubre subdominios, IP, puertos y tecnologías de un dominio autorizado y persiste el inventario con su línea de tiempo.
- [ ] Cada activo recibe una severidad calculada con evidencia trazable (fuente de la señal y fecha de observación).
- [ ] El panel permite filtrar, buscar, exportar y visualizar la evolución del riesgo por ente.
- [ ] Las notificaciones se disparan ante hallazgos críticos nuevos y cambios relevantes del inventario.
- [ ] La documentación de despliegue y uso está escrita en español y permite a un estudiante reproducir el piloto en menos de un día.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Gestión de superficie de ataque (attack surface)

## Problema
Los organismos públicos venezolanos desconocen sus activos digitales expuestos a Internet (subdominios abandonados, paneles sin proteger, APIs vulnerables, credenciales filtradas), lo que impide priorizar la remediación de su superficie de ataque.

## RF / RNF
- RF-01: Descubrimiento de subdominios (CT, DNS pasivo y enumeración activa).
- RF-02: Escaneo de puertos y detección de servicios y versiones.
- RF-03: Detección de paneles de administración, backups y firmas de CMS expuestos.
- RF-04: Búsqueda de credenciales filtradas asociadas al dominio.
- RF-05: Panel de inventario con filtros, severidad, línea de tiempo y exportación.
- RF-06: Notificaciones ante hallazgos críticos y cambios.
- RNF-01: Seguridad/privacidad (scope autorizado, tasa controlada, datos cifrados/hasheados).
- RNF-02: Escalabilidad (decenas de dominios y miles de activos concurrentes).
- RNF-03: Rendimiento (panel < 2 s, primeros resultados < 5 min).
- RNF-04: Accesibilidad/usabilidad (español, WCAG 2.1 AA, usable sin formación avanzada).

## Historias de usuario
- Como responsable de TI, quiero el inventario automático de subdominios y servicios, para no depender de listas manuales.
- Como analista de ciberseguridad, quiero activos clasificados por severidad con evidencia, para priorizar remediación.
- Como director del ente, quiero un resumen ejecutivo del riesgo y su evolución, para justificar acciones correctivas.

## Criterios de aceptación
- Dado un dominio autorizado, cuando se lanza una campaña, entonces el inventario (subdominios, IP, puertos, tecnologías) está disponible en menos de 24 horas.
- Dado un panel de administración accesible sin autenticación, cuando se analiza, entonces se marca como Crítico y notifica al instante.
- Dado un cambio de inventario, cuando se compara con la línea de tiempo, entonces la diferencia se refleja en menos de 10 minutos.
- Dado un usuario sin formación avanzada, cuando filtra y busca, entonces localiza y exporta un hallazgo sin ayuda.

## Fuera de alcance
- Explotación activa de vulnerabilidades o pruebas de intrusión (pentest) contra los activos.
- Acceso, descarga o difusión de credenciales en texto plano.
- Escaneo de dominios que no cuenten con autorización explícita del ente titular.
- Remediación automática o cambios en la infraestructura objetivo (solo se recomienda y prioriza).
- Cobertura de dispositivos internos no expuestos a Internet (la red interna queda fuera del alcance).
```

## 12. Elevator Pitch
La administración pública venezolana no conoce el inventario real de sus activos digitales expuestos a Internet: subdominios abandonados, paneles de administración sin proteger, APIs con versiones vulnerables y credenciales filtradas. "Gestión de superficie de ataque" resuelve esa ceguera operativa descubriendo y clasificando automáticamente, en menos de 24 horas por campaña, la superficie expuesta de cada dominio institucional (por ejemplo `*.gob.ve`), con una severidad por activo y evidencia trazable. Está diseñado para el ente rector de ciberseguridad del Estado, que lo opera como un SaaS multi-ente: cada organismo autoriza su dominio y consulta su propio panel priorizado. El valor diferencial es pasar de inventarios manuales desactualizados a una vista continua y priorizada del riesgo, para remediar primero lo que más expone a la ciudadanía.

## 13. Impacto en el organismo público
- **Eficiencia operativa**: automatiza el descubrimiento y la clasificación de activos, reduciendo la detección de un activo nuevo de semanas de trabajo manual a menos de 48 horas de escaneo continuo.
- **Transparencia y control**: entrega un inventario auditable (exportable en CSV/JSON) con línea de tiempo de cambios, para que el ente rector rinda cuentas del estado de la superficie digital de cada organismo.
- **Confianza ciudadana**: al priorizar paneles, APIs y credenciales expuestas, reduce la exposición de servicios sensibles y de datos de la ciudadanía ante actores maliciosos.
- **Ahorro de recursos**: concentra el escaneo en una plataforma centralizada multi-ente, evitando que cada organismo duplique herramientas, infraestructura y personal especializado en ciberseguridad.
- **Cumplimiento normativo y de marcos**: facilita la alineación con OWASP, NIST SP 800-171 y MITRE ATT&CK, y aporta resúmenes ejecutivos de riesgo para justificar presupuesto y acciones correctivas ante la alta dirección.

## 14. README y documentación del proyecto
El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción** clara del proyecto: "Gestión de superficie de ataque (attack surface)" — descubre y clasifica los activos digitales expuestos de un dominio institucional para priorizar la remediación.
- **Badges** (build, tests, licencia, cobertura).
- **Características** principales: descubrimiento de subdominios, escaneo de puertos/servicios, detección de exposiciones, búsqueda de credenciales filtradas, panel de inventario con severidad y notificaciones.
- **Arquitectura** (diagrama de componentes y flujo de datos: workers de escaneo → API FastAPI/Cloudflare Workers → D1 → panel React).
- **Instalación y ejecución** (prerrequisitos, pasos, variables de entorno).
- **Uso** (ejemplos, endpoints/API, capturas).
- **Datos y datasets** (fuentes: Certificate Transparency, Shodan/Censys/FOFA, HIBP, NVD/CVE; formato y cómo obtenerlos).
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
