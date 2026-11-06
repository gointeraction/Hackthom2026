# SDD — IA explicable de apoyo al diagnóstico en salud pública

> Hackathon UNETI IA 2026 · Proyecto #14 · Eje 1 · IA Ética · Complejidad: Avanzada
> Ente público: Institutos de salud / hospitales

## 1. Problema
El personal de salud en hospitales e institutos públicos venezolanos carece de una herramienta que respalde sus decisiones clínicas con evidencia trazable y medible, lo que obliga a decidir bajo presión de tiempo y con información fragmentada. Esta limitación afecta directamente a médicos, residentes y enfermeros en turnos de alta demanda, y aumenta el riesgo de diagnósticos tardíos o no justificables ante auditorías y segundas opiniones. El problema importa porque un error clínico en el sector público tiene consecuencias humanas y legales que no se pueden mitigar sin una base de conocimiento confiable, explicable y auditada.

## 2. Objetivos
- Producir, en menos de 5 segundos, una lista de 3–5 diagnósticos diferenciales sugeridos a partir de los síntomas, signos y resultados de laboratorio ingresados por el personal de salud.
- Adjuntar a cada sugerencia un nivel de confianza (0–100 %) y las fuentes/evidencia clínica que la sustentan, de modo que el 100 % de las recomendaciones sea rastreable.
- Reducir el tiempo de preparación de una hipótesis diagnóstica documentada en al menos un 40 % respecto al proceso manual de búsqueda bibliográfica.
- Garantizar supervisión humana obligatoria: el sistema nunca emite un diagnóstico final, sino insumos que el profesional valida, rechaza o corrige, registrando siempre quién decidió y cuándo.

## 3. Requisitos funcionales (RF)
- RF-01: El sistema debe permitir el ingreso estructurado de datos clínicos del paciente (síntomas, signos vitales, resultados de laboratorio, alergias y antecedentes), desidentificando automáticamente nombre, cédula y fecha de nacimiento.
- RF-02: El sistema debe generar sugerencias diagnósticas priorizadas, cada una con: código CIE-10, nivel de confianza, lista de evidencias que la apoyan y la contradicen, y referencias bibliográficas o de guías clínicas.
- RF-03: El sistema debe ofrecer una explicación en lenguaje claro de por qué se sugiere cada diagnóstico, indicando qué hallazgos del paciente lo respaldan y qué datos faltan para confirmarlo.
- RF-04: El sistema debe exigir la firma digital y el registro de auditoría del profesional que acepta, modifica o descarta cada sugerencia, almacenando fecha, hora, usuario y justificación del criterio clínico.
- RF-05: El sistema debe contar con un umbral de alerta configurable que marque visualmente las sugerencias de baja confianza o con datos insuficientes, impidiendo que se presenten como conclusiones.
- RF-06: El sistema debe permitir exportar un resumen de la evaluación (sugerencias, confianza, evidencias y decisión humana) en formato imprimible o PDF para la historia clínica.

## 4. Requisitos no funcionales (RNF)
- RNF-01: Seguridad/privacidad — cifrado de datos en tránsito (TLS 1.3) y en reposo, cumplimiento de la normativa venezolana de protección de datos de salud y de buenas prácticas tipo HIPAA; la información de identificación personal nunca se envía al modelo de IA.
- RNF-02: Escalabilidad — arquitectura serverless capaz de atender picos simultáneos de múltiples centros de salud sin estado compartido, con degradación controlada si un servicio externo falla.
- RNF-03: Rendimiento — respuesta del motor de sugerencias en menos de 5 segundos para el percentil 95, con cacheo de guías clínicas y bases de conocimiento de consulta frecuente.
- RNF-04: Accesibilidad/usabilidad — interfaz operable en español, con contraste y tipografía legibles, navegable por teclado y compatible con lectores de pantalla (WCAG 2.1 AA), usable por personal no técnico en contextos de turno.

## 5. Historias de usuario
- Como médico de guardia, quiero ingresar los síntomas y resultados de un paciente y recibir sugerencias diagnósticas con evidencia y confianza, para respaldar mi decisión clínica en menos tiempo y con justificación documentada.
- Como auditor de un instituto de salud, quiero consultar el registro de cada sugerencia y de quién la aceptó o descartó, para verificar la trazabilidad y el cumplimiento de los protocolos de supervisión humana.
- Como residente en formación, quiero ver la explicación y las fuentes de cada diagnóstico sugerido, para aprender el razonamiento clínico detrás de la recomendación y mejorar mi criterio.

## 6. Criterios de aceptación
- Dado un paciente con fiebre, tos y disnea ingresados en el formulario, cuando el médico solicita sugerencias, entonces el sistema muestra al menos 3 diagnósticos diferenciales con confianza y evidencia, y ninguno se presenta como diagnóstico definitivo.
- Dado que el profesional acepta una sugerencia, cuando intenta cerrar la evaluación sin firma ni justificación, entonces el sistema bloquea el cierre y solicita la firma digital y el motivo del criterio clínico.
- Dado un dato clínico insuficiente o contradictorio, cuando la confianza calculada queda por debajo del umbral configurado, entonces la sugerencia se marca como "baja confianza" y se listan explícitamente los datos faltantes.
- Dado un auditor que consulta el historial, cuando abre el registro de una evaluación, entonces puede ver fecha, hora, usuario, sugerencias, evidencias y la decisión humana final con su justificación.

## 7. Datos y fuentes sugeridas
- MIMIC-IV / MIMIC-III (PhysioNet): registros clínicos desidentificados de UCI para entrenar y validar razonamiento diagnóstico.
- PubMed / PubMed Central (NCBI): artículos revisados por pares para fundamentar la evidencia citada por el sistema.
- Guías de práctica clínica de la OMS/OPS (Organización Panamericana de la Salud) y del Ministerio del Poder Popular para la Salud de Venezuela.
- CIE-10 / CIE-11 (OMS): catálogo oficial de códigos diagnósticos para estandarizar las sugerencias.
- MalaCards / Monarch Initiative / DisGeNET: bases de datos de enfermedades, fenotipos y asociaciones gen- enfermedad para el enriquecimiento del grafo de conocimiento clínico.
- SNOMED CT y LOINC: terminología clínica y codificación de pruebas de laboratorio para interoperabilidad semántica.

## 8. Stack tecnológico sugerido
- Frontend: React + TypeScript con Vite; componentes accesibles (Radix UI / shadcn) y PWA para uso en intranet hospitalaria.
- Backend/API: Cloudflare Workers (serverless) con TypeScript, exponiendo endpoints REST autenticados.
- IA/Inferencia: Cloudflare Workers AI con modelos de lenguaje y embeddings (por ejemplo, Llama y modelos de embedding) para generación de explicaciones y recuperación semántica; búsqueda sobre evidencias con Cloudflare Vectorize.
- Almacenamiento: Cloudflare D1 (SQLite) para datos operativos desidentificados, R2 para documentos/guías y KV para cacheo; firma digital y auditoría con registro inmutable (append-only).
- Autenticación/autorización: Cloudflare Access + JWT con roles (médico, residente, auditor, administrador).
- Seguridad/despliegue: Cloudflare Tunnel para acceso interno, WAF y TLS 1.3; observabilidad con métricas y logs de Workers.

## 9. Ente público y visión de despliegue
Lo adopta un instituto de salud u hospital público venezolano, comenzando por un piloto en el servicio de emergencia y consulta externa de una unidad hospitalaria, con respaldo del Ministerio del Poder Popular para la Salud. Se despliega como aplicación web interna (intranet) a la que accede el personal con credenciales institucionales, sin exponer datos de pacientes a internet. El despliegue es progresivo: primero una base de conocimiento de enfermedades priorizadas y guías locales, luego integración con el sistema de laboratorio y, finalmente, auditoría centralizada para todos los centros adscritos, siempre con validación clínica y supervisión humana obligatoria.

## 10. Definition of Done
- [ ] El sistema genera sugerencias con evidencia, confianza y explicación, y bloquea el cierre de evaluación sin firma y justificación del profesional.
- [ ] Los datos de identificación personal se desidentifican antes de cualquier llamada al modelo y no se persisten junto a los datos clínicos.
- [ ] Existe registro de auditoría inmutable de cada sugerencia y de la decisión humana (quién, cuándo y por qué).
- [ ] El despliegue serverless responde en menos de 5 segundos (p95) y pasa pruebas de carga con múltiples centros concurrentes.
- [ ] La interfaz cumple accesibilidad WCAG 2.1 AA y está validada por al menos dos profesionales clínicos en un piloto real.
- [ ] La documentación incluye el modelo de datos, el flujo de supervisión humana y la guía de despliegue en Cloudflare.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — IA explicable de apoyo al diagnóstico en salud pública
## Problema
El personal de salud de institutos públicos necesita apoyo clínico confiable y justificable. Sin una herramienta que aporte evidencia, confianza y explicación, las decisiones se toman bajo presión y con información fragmentada, aumentando el riesgo de diagnósticos tardíos o no auditables.

## RF / RNF
RF-01: Ingreso estructurado de datos clínicos con desidentificación automática.
RF-02: Sugerencias diagnósticas con CIE-10, confianza, evidencias a favor/en contra y referencias.
RF-03: Explicación en lenguaje claro de cada sugerencia (hallazgos que la apoyan y datos faltantes).
RF-04: Firma digital y registro de auditoría de la decisión humana (aceptar/modificar/descartar).
RF-05: Umbral de alerta para sugerencias de baja confianza o datos insuficientes.
RF-06: Exportación del resumen de evaluación a PDF para la historia clínica.

RNF-01: Seguridad/privacidad — cifrado en tránsito y reposo; nunca enviar datos de identificación al modelo.
RNF-02: Escalabilidad — arquitectura serverless con degradación controlada ante fallos externos.
RNF-03: Rendimiento — respuesta del motor en < 5 s (p95).
RNF-04: Accesibilidad/usabilidad — WCAG 2.1 AA, español, operable por personal no técnico.

## Historias de usuario
- Como médico de guardia, quiero recibir sugerencias con evidencia y confianza, para decidir con respaldo y rapidez.
- Como auditor, quiero consultar el registro de cada sugerencia y de quién decidió, para verificar trazabilidad y supervisión humana.
- Como residente, quiero ver la explicación y las fuentes, para aprender el razonamiento clínico.

## Criterios de aceptación
- Dado un cuadro clínico ingresado, cuando se solicitan sugerencias, entonces se muestran al menos 3 diagnósticos diferenciales con confianza y evidencia, sin presentarse como definitivos.
- Dado que el profesional acepta una sugerencia, cuando intenta cerrar sin firma ni justificación, entonces el cierre se bloquea.
- Dado un dato insuficiente, cuando la confianza queda bajo el umbral, entonces la sugerencia se marca "baja confianza" con los datos faltantes listados.
- Dado un auditor, cuando consulta el registro, entonces ve usuario, fecha, hora, evidencias y decisión final justificada.

## Fuera de alcance
- No emite diagnósticos definitivos ni prescribe medicamentos; solo sugiere hipótesis con supervisión humana.
- No sustituye al profesional ni automatiza la decisión clínica.
- No gestiona la historia clínica completa, citas ni facturación.
- No procesa imágenes diagnósticas (radiografías, TAC) en esta versión.
```

## 12. Elevator Pitch
El personal de salud de hospitales e institutos públicos venezolanos decide hoy bajo presión de tiempo y con información fragmentada, lo que aumenta el riesgo de diagnósticos tardíos o no justificables. Presentamos una IA explicable de apoyo al diagnóstico que, en menos de 5 segundos, convierte síntomas, signos y resultados de laboratorio en una lista de 3 a 5 diagnósticos diferenciales, cada uno con nivel de confianza, evidencia trazable y explicación en lenguaje claro. A diferencia de un diagnóstico automático, el sistema exige la firma digital y la decisión del profesional, dejando un registro auditable de quién decidió y por qué. Para un instituto de salud u hospital público venezolano, esto significa decisiones más rápidas, transparentes y defendibles ante auditorías, sin sustituir jamás el criterio clínico humano.

## 13. Impacto en el organismo público
- **Eficiencia:** reduce en al menos un 40 % el tiempo de preparación de una hipótesis diagnóstica documentada y entrega sugerencias en menos de 5 segundos, agilizando los turnos de emergencia y consulta externa.
- **Transparencia:** el 100 % de las recomendaciones es rastreable, con evidencia a favor y en contra, referencias a guías clínicas y explicación de por qué se sugiere cada diagnóstico.
- **Confianza ciudadana:** la supervisión humana obligatoria y el registro de quién acepta, modifica o descarta cada sugerencia fortalecen la rendición de cuentas y la trazabilidad de la atención pública.
- **Ahorro de recursos:** al estandarizar la búsqueda bibliográfica y el razonamiento clínico sobre una base de conocimiento auditable, se reduce el esfuerzo manual y se optimiza el uso del tiempo del personal clínico.
- **Cumplimiento normativo:** cifrado en tránsito y reposo, desidentificación automática de datos de identificación y auditoría inmutable respaldan la normativa venezolana de protección de datos de salud y las buenas prácticas tipo HIPAA.

## 14. README y documentación del proyecto
El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción** clara del proyecto (qué hace y qué problema resuelve): IA explicable de apoyo al diagnóstico en salud pública que genera sugerencias diagnósticas con evidencia y confianza, manteniendo siempre la supervisión humana.
- **Badges** (build, tests, licencia, cobertura).
- **Características** principales (lista de funcionalidades): ingreso estructurado y desidentificación automática, sugerencias con CIE-10/confianza/evidencia, explicación en lenguaje claro, firma digital y auditoría, umbral de baja confianza y exportación a PDF.
- **Arquitectura** (diagrama de componentes y flujo de datos): frontend React accesible → API serverless (Cloudflare Workers) → Workers AI/Vectorize para inferencia y recuperación semántica → D1/R2/KV para datos, guías y cacheo, con Cloudflare Access + JWT para roles.
- **Instalación y ejecución** (prerrequisitos, pasos, variables de entorno).
- **Uso** (ejemplos, endpoints/API, capturas).
- **Datos y datasets** (fuentes, formato, cómo obtenerlos): MIMIC-IV/MIMIC-III, PubMed, guías OMS/OPS y del MPPS, CIE-10/CIE-11, SNOMED CT/LOINC.
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
