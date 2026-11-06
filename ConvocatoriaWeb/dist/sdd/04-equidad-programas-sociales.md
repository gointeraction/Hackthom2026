# SDD — Motor de equidad para programas sociales y becas

> Hackathon UNETI IA 2026 · Proyecto #4 · Eje 1 · IA Ética · Complejidad: Media
> Ente público: Ministerios sociales y de educación

## 1. Problema
Los sistemas de asignación automatizada de subsidios y becas entrenados sobre datos históricos pueden heredar y amplificar sesgos (género, territorio, nivel socioeconómico, condición de discapacidad), dejando fuera a personas elegibles de grupos históricamente subrepresentados. Esto afecta directamente a estudiantes y hogares en situación de vulnerabilidad que dependen de una beca o subsidio para continuar su formación o cubrir necesidades básicas. El problema importa porque una decisión injusta no solo daña a una persona: erosiona la confianza pública en los programas sociales y puede ser jurídicamente impugnable en Venezuela.

## 2. Objetivos
- Medir la disparidad de impacto (disparate impact) entre al menos 3 grupos protegidos (sexo, entidad federal/territorio y quintil de ingreso) sobre el criterio de asignación, con una métrica cuantificable (ratio de disparidad y diferencia de oportunidad igualada).
- Reducir el sesgo del modelo de asignación hasta que ningún grupo protegido presente un disparate impact ratio fuera del umbral aceptado (por defecto 0.8–1.25), sin caer por debajo de un 90% de precisión global.
- Generar un reporte de auditoría explicable por cada lote de asignación, exportable en formato abierto (CSV/JSON), que justifique qué variable causó cada ajuste.
- Proveer un panel de monitoreo para el ente público que permita simular escenarios "antes/después" del ajuste de fairness y comparar la distribución de beneficios por grupo.

## 3. Requisitos funcionales (RF)
- RF-01: El sistema debe calcular métricas de fairness (disparate impact ratio, equal opportunity difference, statistical parity difference) sobre el resultado de un modelo de asignación de becas/subsidios, segmentando por sexo, entidad federal y quintil de ingreso.
- RF-02: El sistema debe aplicar una corrección de sesgo (umbral ajustado por grupo o re-ponderación de muestras) y devolver una lista de beneficiarios reordenada/recalificada con su puntaje original y ajustado.
- RF-03: El sistema debe emitir un reporte de auditoría por lote que indique, para cada grupo protegido, la métrica antes y después del ajuste, y qué variables contribuyeron al cambio.
- RF-04: El sistema debe exponer una API REST (o endpoint de Worker) que reciba un lote de solicitudes en formato JSON/CSV y devuelva la clasificación ajustada más el reporte de fairness.
- RF-05: El sistema debe bloquear (flag) automáticamente cualquier lote cuyo disparate impact ratio exceda el umbral configurado, marcándolo para revisión humana antes de su publicación.

## 4. Requisitos no funcionales (RNF)
- RNF-01: Seguridad/privacidad — Los datos personales deben tratarse con seudonimización (sin nombres ni cédulas en los logs); el acceso al panel de auditoría requiere autenticación con roles (analista vs. decisor) y toda transmisión usa HTTPS/TLS.
- RNF-02: Escalabilidad — El pipeline debe procesar lotes de al menos 50 000 solicitudes por corrida sin degradación lineal, aprovechando ejecución serverless autoescalable.
- RNF-03: Rendimiento — El cálculo de métricas y el reajuste de un lote de 10 000 registros debe completarse en menos de 60 segundos; el reporte debe generarse en menos de 10 segundos adicionales.
- RNF-04: Accesibilidad/usabilidad — El panel debe cumplir contraste AA y ser operable por personal no técnico del ministerio, con visualizaciones claras (gráficos de barras por grupo) y textos en español.

## 5. Historias de usuario
- Como analista de datos del Ministerio de Educación, quiero subir un lote de postulaciones a becas y obtener automáticamente el reporte de disparidad por sexo y territorio, para detectar sesgos antes de publicar resultados.
- Como directivo del Ministerio de Desarrollo Social, quiero comparar la distribución de subsidios "antes" y "después" del ajuste de fairness en un panel, para aprobar una asignación que sea equitativa y defendible públicamente.
- Como persona revisora, quiero ver qué criterios específicos causaron el reajuste de un grupo, para auditar y justificar la decisión final ante la contraloría o la ciudadanía.

## 6. Criterios de aceptación
- Dado un lote con disparate impact ratio de 0.62 en el grupo "mujeres", cuando se ejecuta la corrección, entonces el ratio resultante queda dentro de [0.8, 1.25] y la precisión global no baja de 90%.
- Dado un reporte de auditoría generado, cuando un revisor lo abre, entonces puede ver por cada grupo protegido la métrica antes, la métrica después y las variables que más contribuyeron al ajuste.
- Dado un lote cuyo sesgo no puede corregirse sin violar el umbral de precisión, cuando el sistema lo procesa, entonces lo marca como "requiere revisión humana" y no publica resultados automáticamente.
- Dado un analista con rol "analista" autenticado, cuando intenta aprobar una asignación, entonces el sistema deniega la acción por falta de rol "decisor".

## 7. Datos y fuentes sugeridas
- Datos abiertos del Ministerio del Poder Popular para la Educación y del Ministerio de Educación Universitaria: estadísticas de matrícula, becas y deserción por entidad federal.
- Instituto Nacional de Estadística (INE) Venezuela: Encuesta de Hogares por Muestreo (ENCOVI y equivalentes) para construir quintiles de ingreso y variables socioeconómicas por entidad.
- Sistema de Protección Social / Patria: criterios públicos de asignación del Carnet de la Patria y subsidios (si el acceso está disponible y autorizado).
- Datasets internacionales de referencia para benchmarking de fairness: `fairlearn` sample datasets, `UCI Adult (Census Income)` y `COMPAS` (solo como referencia metodológica, no como datos de producción).
- Registros administrativos anonimizados del ente (históricos de asignación de becas y subsidios), previa autorización y con protocolo de privacidad.

## 8. Stack tecnológico sugerido
- Lenguajes: Python 3.12 (para el motor de fairness) y TypeScript (para el panel y la API serverless).
- Librerías de fairness/ML: `scikit-learn` (modelo de asignación base), `fairlearn` (métricas y mitigación: `ExponentiatedGradient`, `ThresholdOptimizer`), `pandas` y `numpy` (procesamiento de lotes).
- Backend serverless: Cloudflare Workers (API REST de ingesta y reporte), Workers AI (opcional, para explicaciones en lenguaje natural del reporte), D1 (SQLite) para metadatos de lotes y R2 para almacenar lotes crudos y reportes.
- Frontend: React + TypeScript desplegado en Cloudflare Pages, con gráficos (Recharts) para el panel de auditoría.
- Seguridad/despliegue: Cloudflare Access para autenticación por roles, Turnstile opcional en el formulario de carga, y CI/CD con GitHub Actions + Wrangler.

## 9. Ente público y visión de despliegue
El sistema es adoptado por los Ministerios sociales y de educación como una **capa intermedia de fairness** que se integra entre la base de postulaciones y el motor de asignación existente: no reemplaza el modelo actual, sino que audita y corrige su salida antes de publicar resultados. Se despliega como una aplicación serverless en la infraestructura del ente (o en la nube Cloudflare), exponiendo una API interna para los sistemas de becas y subsidios y un panel web para analistas y directivos. El despliegue incluye una fase piloto con datos históricos anonimizados, validación con el equipo jurídico del ente y capacitación del personal en la lectura de los reportes de equidad.

## 10. Definition of Done
- [ ] El motor calcula las 3 métricas de fairness (disparate impact, equal opportunity difference, statistical parity) para sexo, entidad federal y quintil de ingreso, con pruebas unitarias que cubren cada grupo.
- [ ] La corrección de sesgo devuelve una lista de beneficiarios con puntaje original y ajustado, y el reporte de auditoría se genera en CSV y JSON.
- [ ] La API serverless acepta un lote de 10 000 registros en menos de 60 segundos y el panel muestra la comparación antes/después.
- [ ] La autenticación por roles (analista vs. decisor) está implementada y verificada con pruebas de integración.
- [ ] El repositorio incluye `README.md`, `SPEC.md`, un ejemplo reproducible con datos sintéticos y documentación de cómo interpretar cada métrica de fairness.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Motor de equidad para programas sociales y becas
## Problema
La asignación automatizada de subsidios y becas puede reproducir sesgos históricos contra grupos protegidos (sexo, territorio, ingreso), perjudicando a personas elegibles y erosionando la confianza en los programas sociales.

## RF / RNF
- RF-01: Calcular disparate impact ratio, equal opportunity difference y statistical parity por sexo, entidad federal y quintil de ingreso.
- RF-02: Aplicar corrección de sesgo y devolver beneficiarios con puntaje original y ajustado.
- RF-03: Generar reporte de auditoría por lote (CSV/JSON) con métricas antes/después y variables explicativas.
- RF-04: Exponer API para ingesta de lotes y entrega de resultados.
- RF-05: Bloquear lotes que excedan el umbral de disparate impact para revisión humana.
- RNF-01: Seudonimización de datos personales y acceso por roles con TLS.
- RNF-02: Escalar a lotes de 50 000+ solicitudes sin degradación lineal.
- RNF-03: Procesar 10 000 registros en menos de 60 segundos.
- RNF-04: Panel accesible (contraste AA) y operable por personal no técnico.

## Historias de usuario
- Como analista del Ministerio de Educación, quiero subir un lote de becas y obtener el reporte de disparidad, para detectar sesgos antes de publicar.
- Como directivo del Ministerio de Desarrollo Social, quiero comparar la distribución antes/después del ajuste, para aprobar una asignación equitativa.
- Como revisor, quiero ver qué criterios causaron el reajuste de un grupo, para auditar y justificar la decisión.

## Criterios de aceptación
- Dado un disparate impact ratio de 0.62, cuando se corrige, entonces queda en [0.8, 1.25] sin bajar de 90% de precisión.
- Dado un reporte generado, cuando se abre, entonces muestra métricas antes/después y variables contribuyentes por grupo.
- Dado un lote no corregible sin violar el umbral, cuando se procesa, entonces se marca "requiere revisión humana".
- Dado un usuario con rol "analista", cuando intenta aprobar, entonces el sistema deniega la acción.

## Fuera de alcance
- No se construye el modelo predictivo de asignación original (solo se audita y corrige su salida).
- No se reemplazan los sistemas legados de postulación ni la base de datos maestra del ente.
- No se toman decisiones finales de forma autónoma: la aprobación siempre requiere un rol "decisor" humano.
- No se publican datos personales: los resultados se entregan seudonimizados y agregados por grupo.
```

## 12. Elevator Pitch
"Motor de equidad para programas sociales y becas" es una capa intermedia de fairness que se inserta entre las postulaciones y el motor de asignación de los Ministerios sociales y de educación. Audita y corrige los sesgos de sexo, territorio e ingreso antes de publicar resultados, devolviendo una lista de beneficiarios reajustada con un reporte explicable en CSV/JSON. En 30 segundos, el analista del ministerio sube un lote, el sistema detecta si algún grupo queda por debajo del umbral de disparidad (0.8–1.25) y lo corrige sin sacrificar la precisión, dejando una decisión defendible y auditable ante la ciudadanía. Su valor diferencial no es predecir a quién dar la beca, sino garantizar que la decisión final sea equitativa, explicable y jurídicamente sólida.

## 13. Impacto en el organismo público
- **Eficiencia:** automatiza el cálculo de fairness y el reajuste de lotes de hasta 50 000 solicitudes, reduciendo el tiempo de revisión manual y el riesgo de error en cada convocatoria de becas y subsidios.
- **Transparencia:** cada lote genera un reporte de auditoría en formatos abiertos (CSV/JSON) que justifica qué variables causaron cada ajuste, permitiendo rendir cuentas de forma trazable.
- **Confianza ciudadana:** al corregir sesgos de sexo, territorio e ingreso antes de publicar, se evita excluir a grupos históricamente subrepresentados y se protege la legitimidad de los programas sociales.
- **Ahorro de recursos:** la capa de fairness reutiliza el modelo de asignación existente en lugar de reemplazarlo, evitando reconstruir sistemas legados y concentrando el gasto en auditoría y monitoreo.
- **Cumplimiento normativo:** la seudonimización de datos, el acceso por roles (analista vs. decisor) y el bloqueo automático de lotes sesgados reducen el riesgo de impugnaciones jurídicas en Venezuela.

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
