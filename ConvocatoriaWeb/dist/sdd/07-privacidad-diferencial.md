# SDD — Plataforma de privacidad diferencial para estadísticas públicas

> Hackathon UNETI IA 2026 · Proyecto #7 · Eje 1 · IA Ética · Complejidad: Avanzada
> Ente público: INE / observatorios públicos

## 1. Problema
Las tablas y estadísticas agregadas que publican el INE y los observatorios públicos (censos, registros de salud, movilidad o asistencia social) pueden ser reidentificadas mediante ataques de vinculación o de diferencias, exponiendo datos de ciudadanos concretos. Esto afecta a toda la población cuyos microdatos alimentan esas publicaciones y erosiona la confianza institucional, porque los ciudadanos dejan de reportar información sensible o exigen retirarla, degradando la calidad de la estadística oficial.

## 2. Objetivos
- Liberar al menos 3 consultas agregadas (conteo, media y proporción) sobre un dataset censal simulado con privacidad diferencial ε-diferencial, con ε configurable ≤ 1.0.
- Garantizar que ningún ataque de reidentificación por diferencia o vinculación recupere un registro individual con confianza superior al umbral teórico impuesto por ε.
- Mantener el error relativo medio de las consultas con ruido por debajo del 5 % para cohortes de más de 10 000 registros, medido contra el resultado sin ruido.
- Publicar un presupuesto de privacidad (ε acumulado y gastado por consulta) auditable en un panel de transparencia dirigido al INE y a observatorios.

## 3. Requisitos funcionales (RF)
- RF-01: El sistema debe exponer una API de consulta que acepte consultas de agregación (conteo, suma, media, proporción y cuantiles básicos) sobre columnas numéricas y categóricas predefinidas.
- RF-02: Cada consulta debe aplicar un mecanismo de ruido calibrado (Laplace para conteos/sumas y Gaussiano para medias, o el mecanismo exponencial para modas) con sensibilidad calculada por consulta.
- RF-03: El sistema debe mantener y descontar un presupuesto de privacidad ε global por sesión/usuario, rechazando consultas que excedan el presupuesto restante.
- RF-04: Debe permitir configurar la granularidad de la celda (mínimo de registros k por grupo) para bloquear consultas sobre cohortes demasiado pequeñas y susceptibles de reidentificación directa.
- RF-05: El sistema debe registrar un log inmutable de consultas (fecha, tipo, ε gastado, parámetros) para auditoría institucional.
- RF-06: Debe ofrecer un modo "investigador" que entrega resultados perturbados y un modo "publicación" que genera tablas agregadas ya protegidas con su ε asociado.

## 4. Requisitos no funcionales (RNF)
- RNF-01 (seguridad/privacidad): El motor de privacidad debe implementar privacidad diferencial (ε, δ) con prueba de composición secuencial/paralela documentada; nunca debe devolver microdatos ni resultados sin ruido a usuarios no autorizados.
- RNF-02 (escalabilidad): El sistema debe procesar datasets de al menos 10 millones de registros y 500 columnas sin degradación superior al 20 % en latencia respecto a 1 millón de registros.
- RNF-03 (rendimiento): Las consultas con ruido deben responder en menos de 2 segundos (p95) para agregaciones simples sobre el dataset de referencia.
- RNF-04 (accesibilidad/usabilidad): El panel de transparencia y el visualizador de presupuesto ε deben ser comprensibles para funcionarios no técnicos, con explicaciones en español del significado de ε, δ y del error inducido.

## 5. Historias de usuario
- Como analista del INE, quiero ejecutar una consulta de conteo con ε configurable, para obtener estadísticas útiles sin exponer la identidad de ningún ciudadano.
- Como auditor de un observatorio público, quiero ver el presupuesto de privacidad consumido por cada consulta, para certificar que las publicaciones cumplen el umbral de ε acordado.
- Como responsable de datos, quiero fijar un mínimo de registros por celda (k-anonimato) además del ruido, para bloquear consultas sobre grupos reducidos susceptibles de reidentificación.

## 6. Criterios de aceptación
- Dado un dataset censal simulado de N registros, cuando un atacante ejecuta dos consultas que difieren en un único individuo, entonces la diferencia entre los resultados con ruido no le permite distinguir con ventaja mayor a e^ε la presencia de ese individuo.
- Dado un presupuesto ε=1.0, cuando se ejecutan 4 consultas de ε=0.25 cada una, entonces la quinta consulta es rechazada y el panel refleja ε gastado=1.0 y ε restante=0.0.
- Dado un grupo con menos de k registros, cuando se solicita una agregación sobre él, entonces el sistema devuelve un error de "celda insuficiente" sin revelar el valor real.
- Dado un conteo real de 25 430 en una cohorte grande, cuando se ejecuta con ε=0.5, entonces el valor devuelto se mantiene dentro del intervalo esperado [real ± 3·sensibilidad/ε] en al menos el 95 % de las ejecuciones.

## 7. Datos y fuentes sugeridas
- INE Venezuela — Censo Nacional de Población y Vivienda (tablas agregadas y microdatos anonimizados publicados por el ente): <https://www.ine.gob.ve>.
- Datos censales de referencia con estructura demográfica (edad, sexo, municipio, nivel educativo, ocupación) para simular el caso venezolano: <https://microdata.worldbank.org> e <https://www.ipums.org> (IPUMS International).
- Registros abiertos de observatorios públicos de salud y movilidad como casos de uso adicionales: <https://www.data.gov> y <https://data.humdata.org>.
- Datos sintéticos generados localmente con librerías como SDV (Synthetic Data Vault) para reproducir distribuciones sin exponer personas reales.

## 8. Stack tecnológico sugerido
- Lenguaje principal: Python 3.12 con FastAPI para la API de consultas.
- Privacidad diferencial: OpenDP (<https://opendp.org>) o Google Differential Privacy (<https://github.com/google/differential-privacy>) como motor de ruido calibrado y composición de ε.
- Procesamiento de datos: Polars o DuckDB para agregaciones rápidas sobre datasets grandes.
- Backend/almacenamiento: SQLite o PostgreSQL para metadatos y log de auditoría; MinIO para versionado de datasets.
- Frontend de transparencia: React + TypeScript con visualizaciones del presupuesto ε (gráficos con Recharts).
- Despliegue en la nube: Cloudflare Workers para la capa de borde de la API, Cloudflare Pages para el panel, Cloudflare R2 para datasets, y Cloudflare Access para autenticación del personal del INE.
- Contenedores: Docker + Docker Compose para el entorno local de desarrollo y pruebas del hackathon.

## 9. Ente público y visión de despliegue
El INE adopta el motor de consultas como una capa segura frente a sus almacenes de microdatos censales, mientras que los observatorios públicos lo integran para publicar sus tableros de indicadores sin exponer registros individuales. El despliegue se implementa como una API interna (cloud on-premise o en la nube venezolana) a la que los analistas acceden por roles, con el panel de transparencia disponible al público para que cualquier ciudadano o ente contralor verifique el presupuesto de privacidad consumido en cada publicación.

## 10. Definition of Done
- [ ] La API expone conteo, media y proporción con mecanismos Laplace/Gaussiano implementados y su sensibilidad documentada por consulta.
- [ ] El presupuesto de privacidad ε se descuenta por consulta, se compone correctamente y rechaza excedentes, con evidencia de pruebas unitarias.
- [ ] Un experimento de reidentificación (ataque de diferencia) demuestra que la ventaja del atacante respeta la garantía ε prometida.
- [ ] El panel de transparencia muestra ε gastado/restante y el error inducido por consulta, en español.
- [ ] Se entrega documentación de despliegue, un dataset simulado reproducible y una demo funcional grabada o en vivo para el jurado.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Plataforma de privacidad diferencial para estadísticas públicas

## Problema
Las estadísticas agregadas del INE y observatorios pueden reidentificar ciudadanos
mediante ataques de vinculación o diferencia. Se requiere un sistema de consultas
con ruido calibrado que garantice privacidad sin destruir la utilidad estadística.

## RF / RNF
- RF-01: API de consultas agregadas (conteo, suma, media, proporción, cuantiles).
- RF-02: Mecanismos de ruido calibrado (Laplace, Gaussiano, exponencial) con sensibilidad por consulta.
- RF-03: Presupuesto de privacidad ε global con composición y rechazo de excedentes.
- RF-04: Mínimo de registros por celda (k) para bloquear cohortes pequeñas.
- RF-05: Log de auditoría inmutable de consultas y ε gastado.
- RF-06: Modos "investigador" (resultados perturbados) y "publicación" (tablas protegidas).
- RNF-01: Privacidad diferencial (ε, δ) con prueba de composición documentada.
- RNF-02: Escalabilidad a 10M+ registros.
- RNF-03: Latencia p95 < 2 s en agregaciones simples.
- RNF-04: Panel de transparencia comprensible para personal no técnico.

## Historias de usuario
- Como analista del INE, quiero consultar con ε configurable, para obtener estadísticas sin reidentificar ciudadanos.
- Como auditor, quiero ver el ε consumido, para certificar el cumplimiento del umbral.
- Como responsable de datos, quiero fijar un mínimo de registros por celda, para bloquear grupos reducidos.

## Criterios de aceptación
- Dado dos consultas que difieren en un individuo, cuando se comparan los resultados con ruido,
  entonces la ventaja del atacante no supera e^ε.
- Dado ε=1.0 y 4 consultas de 0.25, cuando se solicita una quinta consulta, entonces se rechaza.
- Dado un grupo con menos de k registros, cuando se consulta, entonces se devuelve "celda insuficiente".
- Dado un conteo real conocido, cuando se consulta con ε fijo, entonces el valor cae en el intervalo
  teórico esperado en ≥ 95 % de las ejecuciones.

## Fuera de alcance
- Anonimización perfecta o imposibilidad absoluta de reidentificación (no existe garantía absoluta).
- Exposición de microdatos crudos a usuarios finales.
- Cifrado homomórfico o cómputo multiparte (se asume un servidor confiable que aplica el ruido).
- Cumplimiento legal integral de la LOPD venezolana u otros marcos normativos (se documenta, no se certifica).
- Integración en producción con los sistemas internos reales del INE durante el hackathon.
```

## 12. Elevator Pitch
El INE y los observatorios públicos publican estadísticas agregadas (censos, salud, movilidad) que hoy pueden reidentificar ciudadanos mediante ataques de vinculación o de diferencias. Nuestra plataforma añade una capa de privacidad diferencial con ruido calibrado (ε configurable ≤ 1.0) a cada consulta agregada, manteniendo la utilidad estadística por debajo del 5 % de error para cohortes grandes. Los analistas del INE consultan sin exponer registros individuales, mientras un panel de transparencia público hace auditable el presupuesto de privacidad consumido en cada publicación. Resultado: estadística oficial útil, ciudadanos protegidos y confianza institucional restaurada.

## 13. Impacto en el organismo público
- **Eficiencia**: automatiza la protección de consultas y tablas agregadas, reduciendo la revisión manual de anonimización antes de cada publicación del INE.
- **Transparencia**: el panel de presupuesto ε (gastado/restante por consulta) queda disponible para ciudadanos y entes contralores, certificando el umbral acordado.
- **Confianza ciudadana**: al impedir la reidentificación por diferencia o vinculación, los ciudadanos siguen reportando información sensible sin temor, preservando la calidad de la estadística oficial.
- **Ahorro de recursos**: evita retrabajos y bloqueos por reclamos de privacidad, liberando al personal estadístico para análisis en lugar de saneamiento de datos.
- **Cumplimiento normativo**: documenta la garantía (ε, δ) con prueba de composición y auditoría inmutable, alineando las publicaciones a buenas prácticas de protección de datos (la LOPD venezolana se referencia, no se certifica).

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
