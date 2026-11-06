# SDD — Observatorio de transparencia algorítmica

> Hackathon UNETI IA 2026 · Proyecto #13 · Eje 1 · IA Ética · Complejidad: Media
> Ente público: Rendición de cuentas

## 1. Problema
Los algoritmos del Estado venezolano (puntajes de crédito social, asignación de subsidios, priorización de trámites o filtrado de contenido) operan sin que la ciudadanía sepa qué modelos se usan, con qué datos se entrenan ni qué salvaguardas los limitan. Esto afecta a cualquier ciudadano que interactúa con servicios públicos automatizados y, al no existir trazabilidad, erosiona la confianza institucional y dificulta la rendición de cuentas. Importa porque una decisión algorítmica sin explicación pública no puede ser auditada, impugnada ni corregida.

## 2. Objetivos
- Publicar un panel web que catalogue al menos 10 algoritmos del sector público en los primeros 90 días, indicando ente responsable, finalidad, datos de entrada y base legal.
- Permitir que cualquier ciudadano consulte, en lenguaje claro, el porqué de una decisión automatizada en menos de 3 clics desde la portada.
- Generar una ficha de "salvaguardas" por algoritmo (privacidad, sesgo, revisión humana, mecanismo de apelación) verificable por un auditor externo.
- Reducir a menos de 48 horas el tiempo de publicación de una nueva versión de un modelo, mediante un flujo de registro semi-automatizado con validación de metadatos.

## 3. Requisitos funcionales (RF)
- RF-01: El panel debe permitir registrar un algoritmo con los campos obligatorios: nombre, ente responsable, versión, fecha de despliegue, propósito, datos de entrada, técnica (p. ej. regresión logística, LLM, árboles), métricas de desempeño y salvaguardas aplicadas.
- RF-02: El sistema debe ofrecer un buscador con filtros por ente, eje temático (salud, trámites, seguridad, beneficios sociales) y estado de auditoría (sin auditar / en revisión / auditado).
- RF-03: Cada ficha debe mostrar un "resumen ciudadano" redactado en lenguaje llano, distinto del detalle técnico, explicando qué decide el algoritmo y qué puede hacer la persona afectada para apelar.
- RF-04: El panel debe exponer un registro público de cambios (changelog) por algoritmo: qué cambió, cuándo, quién lo aprobó y qué evaluación de impacto se realizó.
- RF-05: Debe existir un formulario de "solicitud de explicación" donde un ciudadano ingrese su número de expediente/trámite y el sistema devuelva la ficha del o los algoritmos que intervinieron en su caso.
- RF-06: El sistema debe generar un informe de transparencia exportable (PDF/CSV) con el inventario completo y su estado de salvaguardas, para uso de la Contraloría o veedurías ciudadanas.

## 4. Requisitos no funcionales (RNF)
- RNF-01: Seguridad/privacidad — el panel no debe exponer datos personales; los formularios de consulta se procesan sin persistir identificadores sensibles y todas las respuestas se sirven sobre HTTPS con cabeceras de seguridad (CSP, HSTS).
- RNF-02: Escalabilidad — la arquitectura debe soportar picos de consulta (p. ej. días de rendición de cuentas) mediante edge caching y una capa de datos que escale horizontalmente sin degradar el servicio.
- RNF-03: Rendimiento — la portada y la búsqueda deben cargar en menos de 2 segundos en conexiones 3G y responder a una búsqueda filtrada en menos de 500 ms (p95).
- RNF-04: Accesibilidad/usabilidad — cumplir WCAG 2.1 AA, incluir versión de alto contraste y contenido legible por lectores de pantalla; el "resumen ciudadano" debe estar escrito para un nivel de lectura de educación media.

## 5. Historias de usuario
- Como ciudadano afectado por una decisión automatizada, quiero consultar qué algoritmo evaluó mi trámite y qué datos usó, para saber si puedo apelar y ante quién.
- Como funcionario de un ente público, quiero registrar y actualizar los algoritmos de mi institución con sus salvaguardas, para cumplir con la obligación de transparencia sin depender de un equipo técnico.
- Como veedor u órgano de control, quiero descargar el inventario completo con estado de auditoría y cambios históricos, para auditar el cumplimiento de las salvaguardas declaradas.

## 6. Criterios de aceptación
- Dado un algoritmo registrado con todos sus campos obligatorios, cuando un ciudadano abre su ficha, entonces se muestra el resumen ciudadano, la técnica, los datos de entrada y el mecanismo de apelación sin requerir autenticación.
- Dado un buscador con filtros por ente y estado de auditoría, cuando el usuario combina dos filtros, entonces los resultados devuelven solo los algoritmos que cumplen ambas condiciones en menos de 500 ms.
- Dado un número de expediente ingresado en el formulario de explicación, cuando el expediente está asociado a uno o más algoritmos, entonces el sistema devuelve la ficha correspondiente sin revelar datos personales de terceros.
- Dado un informe de transparencia solicitado, cuando el usuario lo descarga, entonces el archivo incluye el inventario completo, versión, fecha y estado de salvaguardas de cada algoritmo, y refleja la última actualización registrada.

## 7. Datos y fuentes sugeridas
- Gacetas y normativa pública venezolana: Ley Orgánica de Procedimientos Administrativos, Ley de Infogobierno, Ley contra la Corrupción y normativa del CNTI/SUDEASEG como base legal declarada de cada algoritmo.
- Portales de datos abiertos y registros de trámites de los entes (SUDEBAN, IVSS, SENIAT, SAIME, CNE) como fuente para documentar qué entes operan sistemas automatizados.
- Inventarios públicos de modelos y buenas prácticas: AI Incident Database (OECD) y "Algorithm Register" de Helsinki/Ámsterdam como referencia de formato de ficha y salvaguardas.
- Documentación técnica de los propios entes (manuales, pliegos de contratación, términos de uso de apps oficiales) para extraer metadatos de modelos, proveedores y versiones.

## 8. Stack tecnológico sugerido
- Frontend: TypeScript + Astro o Next.js (React) con componentes accesibles; Tailwind CSS para diseño responsive y modo alto contraste.
- Backend/API: Cloudflare Workers (o Hono sobre Workers) para endpoints serverless y validación de esquemas con Zod.
- Base de datos: Cloudflare D1 (SQLite relacional) para el inventario, versiones y changelog; R2 para almacenar informes PDF/CSV generados.
- IA: Cloudflare Workers AI para asistir la redacción del "resumen ciudadano" en lenguaje llano a partir de la ficha técnica (con revisión humana obligatoria antes de publicar).
- Autenticación y seguridad: Cloudflare Access para el panel de funcionarios; Turnstile para proteger formularios públicos de consulta; cabeceras de seguridad vía Workers.
- Despliegue: Cloudflare Pages + Workers con CI/CD (GitHub Actions) y pruebas de accesibilidad (axe-core) y de rendimiento (Lighthouse) en el pipeline.

## 9. Ente público y visión de despliegue
El adoptante natural es el órgano de control y rendición de cuentas (Contraloría General de la República en articulación con el CNTI y la SUDEASEG), que publicaría el panel como servicio nacional de transparencia algorítmica. El despliegue inicia con un piloto en 3 entes (uno de trámites, uno de beneficios sociales y uno de seguridad), donde cada ente carga sus algoritmos mediante el panel de funcionarios; tras 90 días se abre al público general con campañas de difusión y veedurías ciudadanas, y el inventario se convierte en insumo oficial para auditorías y para la apelación de decisiones automatizadas.

## 10. Definition of Done
- [ ] El panel despliega en producción al menos 10 fichas de algoritmos reales con todos los campos obligatorios completos.
- [ ] La búsqueda con filtros combinados responde en <500 ms (p95) y la portada carga en <2 s en 3G.
- [ ] Todo contenido público pasa pruebas WCAG 2.1 AA y el resumen ciudadano es revisado por una persona no técnica antes de publicarse.
- [ ] El formulario de explicación devuelve fichas por expediente sin exponer datos personales de terceros.
- [ ] El informe de transparencia exportable (PDF/CSV) refleja el inventario y estado de salvaguardas de la última actualización.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Observatorio de transparencia algorítmica
## Problema
Los algoritmos del Estado operan sin visibilidad pública, impidiendo a la ciudadanía auditar decisiones automatizadas.
## RF / RNF
- RF-01: Registro de algoritmos con campos obligatorios (ente, versión, propósito, datos, técnica, salvaguardas).
- RF-02: Buscador con filtros por ente, eje y estado de auditoría.
- RF-03: Resumen ciudadano en lenguaje llano por algoritmo.
- RF-04: Changelog público con aprobación y evaluación de impacto.
- RF-05: Formulario de explicación por número de expediente.
- RF-06: Informe de transparencia exportable (PDF/CSV).
- RNF-01: Privacidad (sin datos personales, HTTPS, CSP/HSTS).
- RNF-02: Escalabilidad (edge caching, datos horizontales).
- RNF-03: Rendimiento (portada <2 s, búsqueda <500 ms p95).
- RNF-04: Accesibilidad WCAG 2.1 AA y alto contraste.
## Historias de usuario
- Como ciudadano afectado, quiero saber qué algoritmo evaluó mi trámite, para poder apelar.
- Como funcionario, quiero registrar y actualizar algoritmos, para cumplir transparencia sin equipo técnico.
- Como veedor, quiero descargar el inventario auditado, para fiscalizar salvaguardas.
## Criterios de aceptación
- Dado un algoritmo registrado, cuando se abre su ficha, entonces se muestra resumen, técnica, datos y apelación sin autenticación.
- Dada una búsqueda con dos filtros, cuando se consulta, entonces devuelve solo resultados que cumplen ambas condiciones en <500 ms.
- Dado un expediente asociado, cuando se consulta, entonces devuelve las fichas sin exponer datos de terceros.
## Fuera de alcance
- No reconstruir ni exponer el código fuente interno de los modelos del Estado.
- No publicar conjuntos de datos con información personal identificable.
- No ejecutar ni evaluar en vivo los algoritmos catalogados; solo documentar su uso declarado.
- No sustituir los canales formales de apelación administrativa o judicial.
```

## 12. Elevator Pitch
El Observatorio de transparencia algorítmica es un panel web público que cataloga los algoritmos que usa el Estado venezolano —subsidios, trámites, filtrado de contenido— indicando qué modelo se usa, con qué datos se entrena y qué salvaguardas lo limitan. Está pensado para la Contraloría General de la República, en articulación con el CNTI y la SUDEASEG, que lo publicaría como servicio nacional de rendición de cuentas algorítmica. Su valor diferencial es permitir que cualquier ciudadano entienda, en menos de 3 clics y en lenguaje claro, por qué una decisión automatizada le afecta y cómo apelarla, devolviendo trazabilidad y confianza institucional donde hoy no existen.

## 13. Impacto en el organismo público
- **Transparencia:** un inventario público con fichas por algoritmo y "resumen ciudadano" permite a la Contraloría y a los órganos de control documentar y comunicar qué modelos operan en el Estado y bajo qué salvaguardas.
- **Eficiencia:** el flujo de registro semi-automatizado reduce a menos de 48 horas la publicación de nuevas versiones de modelos, sin depender de un equipo técnico por cada ente.
- **Confianza ciudadana:** al ofrecer explicación, changelog y mecanismo de apelación por decisión automatizada, se restablece la confianza institucional y se facilita la impugnación y corrección de decisiones.
- **Ahorro de recursos:** el informe de transparencia exportable (PDF/CSV) con inventario y estado de salvaguardas automatiza el insumo para auditorías y veedurías ciudadanas.
- **Cumplimiento normativo:** cada ficha vincula la base legal declarada (Ley de Infogobierno, Ley Orgánica de Procedimientos Administrativos, normativa CNTI/SUDEASEG), apuntalando la rendición de cuentas exigida por ley.

## 14. README y documentación del proyecto
El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción** clara del proyecto: "Observatorio de transparencia algorítmica" — panel web público que cataloga los algoritmos del sector público (ente responsable, finalidad, datos de entrada, técnica, métricas y salvaguardas) para que la ciudadanía pueda consultar y apelar decisiones automatizadas.
- **Badges** (build, tests, licencia, cobertura).
- **Características** principales (lista de funcionalidades): registro de algoritmos, buscador con filtros, resumen ciudadano, changelog, formulario de explicación por expediente e informe exportable.
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
