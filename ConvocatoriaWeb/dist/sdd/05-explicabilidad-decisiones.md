# SDD — Sistema de explicabilidad de decisiones administrativas

> Hackathon UNETI IA 2026 · Proyecto #5 · Eje 1 · IA Ética · Complejidad: Avanzada
> Ente público: Ventanilla única de trámites

## 1. Problema
El ciudadano recibe un rechazo de su trámite o beneficio sin entender el motivo, porque la decisión fue tomada por un modelo de IA cuya lógica es opaca. Esto afecta a solicitantes de subsidios, permisos y licencias en la Ventanilla única, erosiona la confianza en el Estado y vulnera el derecho a explicación reconocido en marcos de IA ética.

## 2. Objetivos
- Traducir al menos el 95 % de las decisiones de rechazo del modelo a explicaciones en lenguaje ciudadano, sin tecnicismos ni jerga algorítmica.
- Reducir el tiempo promedio de comprensión del motivo de rechazo de "sin explicación" a menos de 2 minutos por trámite.
- Citar para cada explicación los requisitos o documentos específicos que incidieron en la decisión, con trazabilidad auditable.
- Permitir que el ciudadano inicie una apelación o subsanación directamente desde la explicación, midiendo al menos un 30 % de reenvíos correctos.

## 3. Requisitos funcionales (RF)
- RF-01: El motor debe consumir la salida del modelo de decisión (clase predicha, puntuaciones y características principales) y generar una explicación en español llano, estructurada por "qué se decidió", "por qué" y "qué hacer ahora".
- RF-02: Debe aplicar técnicas de explicabilidad local (SHAP/LIME) sobre el modelo de rechazo para identificar las 3–5 variables de mayor peso en cada caso individual.
- RF-03: Debe mapear cada variable técnica (ej. `ingreso_per_cápita`, `edad_del_solicitante`, `documento_faltante`) a una frase comprensible ("su ingreso declarado supera el límite del beneficio").
- RF-04: Debe exponer un endpoint o interfaz que permita al funcionario de la Ventanilla única consultar la explicación completa de cualquier caso, incluyendo el desglose de puntuaciones.
- RF-05: Debe registrar de forma inmutable un identificador de explicación por trámite, que permita auditar qué modelo, qué versión y qué variables generaron cada explicación.
- RF-06: Debe ofrecer acciones de seguimiento enlazadas (subsanar documento, apelar, agendar cita) según el tipo de rechazo detectado.

## 4. Requisitos no funcionales (RNF)
- RNF-01 (seguridad/privacidad): Las explicaciones no deben exponer datos personales de terceros ni variables sensibles crudas; todo dato identificable debe anonimizarse antes de mostrarse y el acceso debe estar autenticado por cédula/identificador ciudadano.
- RNF-02 (escalabilidad): El servicio debe soportar picos de carga en jornadas de cierre de convocatorias, escalando horizontalmente a miles de explicaciones concurrentes sin degradar el tiempo de respuesta.
- RNF-03 (rendimiento): La generación de una explicación completa debe completarse en menos de 5 segundos en el percentil 95, incluso con decenas de miles de casos históricos.
- RNF-04 (accesibilidad/usabilidad): Las explicaciones deben cumplir WCAG 2.1 AA, estar disponibles en lectura fácil y ser legibles en dispositivos móviles de gama baja usados por la población objetivo.

## 5. Historias de usuario
- Como ciudadano solicitante de un beneficio, quiero recibir una explicación clara del rechazo, para entender qué documento o requisito incumplí y poder corregirlo.
- Como funcionario de la Ventanilla única, quiero consultar el desglose de variables que influyó en la decisión, para responder con precisión las dudas del ciudadano en ventanilla.
- Como auditor del ente público, quiero verificar la trazabilidad entre el modelo, sus variables y la explicación entregada, para garantizar el cumplimiento del derecho a explicación.

## 6. Criterios de aceptación
- Dado un trámite rechazado por ingreso superior al límite, cuando el ciudadano abre su notificación, entonces ve una frase que nombra explícitamente el ingreso declarado y el límite del beneficio, sin mostrar el monto exacto de terceros.
- Dado un caso con un documento faltante, cuando el motor procesa la decisión, entonces la explicación lista ese documento y enlaza la acción de subsanación correspondiente.
- Dado un caso con múltiples causas de rechazo, cuando se genera la explicación, entonces las causas aparecen ordenadas por su peso relativo en la decisión, de mayor a menor.
- Dado un auditor que consulta el registro, cuando solicita la explicación de un caso, entonces recupera el identificador, la versión del modelo y las variables usadas sin necesidad de acceso al código del modelo.

## 7. Datos y fuentes sugeridas
- Datos anonimizados de trámites y resoluciones de la Ventanilla única (categoría, requisitos, resultado, motivo codificado) como base de entrenamiento del mapeo variable→lenguaje.
- Reglamentos y bases legales de cada beneficio (subsidios, permisos, licencias) para generar frases de motivo verificables y citables.
- SHAP/LIME sobre el modelo de decisión ya desplegado, para extraer importancias locales por caso.
- Corpus público en español de "lenguaje claro" o lectura fácil (ej. guías de la Red de Lenguaje Claro) para validar legibilidad de las frases.
- Registro histórico de apelaciones y subsanaciones, para medir si las explicaciones mejoran la tasa de corrección.

## 8. Stack tecnológico sugerido
- Backend de explicabilidad en Python con FastAPI; `shap` y `lime` para importancias locales; `scikit-learn` o el modelo existente vía contenedor de inferencia.
- Base de datos PostgreSQL para el registro inmutable de explicaciones (id, hash del modelo, variables, timestamp).
- Cola y ejecución serverless en Cloudflare Workers + Queues para escalar la generación de explicaciones bajo demanda, con Workers AI para resumir motivos en lectura fácil.
- Frontend en React/TypeScript desplegado en Cloudflare Pages, con componentes accesibles (ARIA) y soporte móvil.
- Almacenamiento de artefactos del modelo versionados en Cloudflare R2, con D1/KV para cachear plantillas de frase y caché de explicaciones frecuentes.
- Firma de integridad con hash SHA-256 sobre cada explicación generada para la auditabilidad exigida.

## 9. Ente público y visión de despliegue
Lo adopta la Ventanilla única de trámites como capa de explicabilidad que envuelve su modelo de decisión existente, sin reemplazarlo. Se despliega primero en un programa piloto (un beneficio de alta demanda) expuesto a ciudadanos reales, luego se generaliza a los demás trámites tras validar con funcionarios y auditores. La infraestructura corre en el borde (Cloudflare) para minimizar latencia y costos, manteniendo los datos sensibles dentro del perímetro del ente.

## 10. Definition of Done
- [ ] El motor genera explicaciones en español llano para los tipos de rechazo del piloto, con "qué/por qué/qué hacer" verificados.
- [ ] Las variables SHAP/LIME se mapean a frases ciudadanas y se ordenan por peso, con pruebas unitarias por categoría de trámite.
- [ ] El registro inmutable guarda id, versión del modelo, variables y hash de integridad para cada explicación.
- [ ] Las explicaciones cumplen WCAG 2.1 AA y se validan en lectura fácil con usuarios representativos.
- [ ] Se documenta la API, se entrega el SPEC.md y se demuestra el flujo completo (rechazo → explicación → subsanación/apelación) ante el jurado.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Sistema de explicabilidad de decisiones administrativas
## Problema
El ciudadano no entiende por qué un trámite o beneficio fue rechazado por el modelo de IA de la Ventanilla única, lo que vulnera su derecho a explicación y erosiona la confianza en el Estado.

## RF / RNF
- RF-01: Generar explicación en español llano con estructura "qué se decidió / por qué / qué hacer ahora".
- RF-02: Aplicar SHAP/LIME para identificar las 3–5 variables de mayor peso por caso.
- RF-03: Mapear variables técnicas a frases ciudadanas verificables.
- RF-04: Exponer desglose de puntuaciones para funcionarios autorizados.
- RF-05: Registrar trazabilidad inmutable (id, versión del modelo, variables, hash).
- RF-06: Enlazar acciones de subsanación, apelación o cita según el tipo de rechazo.
- RNF-01: Anonimizar datos sensibles y autenticar el acceso.
- RNF-02: Escalar a miles de explicaciones concurrentes en picos de convocatoria.
- RNF-03: Responder en menos de 5 segundos en el percentil 95.
- RNF-04: Cumplir WCAG 2.1 AA y ofrecer lectura fácil en móviles de gama baja.

## Historias de usuario
- Como ciudadano, quiero entender por qué me rechazaron, para corregir mi solicitud.
- Como funcionario, quiero ver el desglose de variables, para responder dudas en ventanilla.
- Como auditor, quiero verificar la trazabilidad, para garantizar el derecho a explicación.

## Criterios de aceptación
- Dado un rechazo por ingreso superior al límite, cuando el ciudadano abre la notificación, entonces ve una frase que nombra el ingreso y el límite sin exponer datos de terceros.
- Dado un documento faltante, cuando se procesa la decisión, entonces la explicación lista el documento y enlaza la subsanación.
- Dado un caso con varias causas, cuando se genera la explicación, entonces las causas aparecen ordenadas por peso.
- Dado un auditor, cuando consulta el registro, entonces recupera id, versión del modelo y variables sin acceder al código.

## Fuera de alcance
- Reentrenar o modificar el modelo de decisión subyacente.
- Exponer el código fuente o los pesos internos del modelo al ciudadano.
- Tomar decisiones automáticas de revocación o aprobación de beneficios.
- Sustituir los canales formales de apelación por el flujo digital.
```

## 12. Elevator Pitch
El Sistema de explicabilidad de decisiones administrativas traduce los rechazos del modelo de IA de la Ventanilla única de trámites a un lenguaje claro que cualquier ciudadano entiende: qué se decidió, por qué y qué hacer para corregirlo. En lugar de un "rechazado" sin explicación, cada solicitante de subsidios, permisos y licencias recibe, en menos de 5 segundos, las 3–5 razones concretas de su caso con el documento o requisito que incumplió y un enlace directo para subsanar o apelar. Para la Ventanilla única, cada explicación queda registrada de forma inmutable y auditable, cumpliendo el derecho a explicación y recuperando la confianza ciudadana sin reemplazar el modelo de decisión existente.

## 13. Impacto en el organismo público
- **Eficiencia operativa**: reduce el tiempo de atención en ventanilla, porque funcionarios y ciudadanos parten de una explicación clara en lugar de descifrar la decisión del modelo; se pasa de "sin explicación" a menos de 2 minutos por trámite.
- **Transparencia**: cada rechazo expone de forma trazable qué variables, requisitos y documentos incidieron, con un identificador inmutable que permite auditar modelo, versión y variables usadas.
- **Confianza ciudadana**: sustituye la opacidad algorítmica por lenguaje claro y lectura fácil (WCAG 2.1 AA), devolviendo al ciudadano el control para corregir su solicitud y reduciendo la fricción con el Estado.
- **Ahorro de recursos**: al enlazar la subsanación o apelación directamente desde la explicación, se reduce la carga de consultas presenciales y los reenvíos erróneos, apuntando a al menos un 30 % de reenvíos correctos.
- **Cumplimiento normativo**: garantiza el derecho a explicación reconocido en marcos de IA ética, dejando evidencia auditable que protege al ente ante auditorías y reclamos.

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
