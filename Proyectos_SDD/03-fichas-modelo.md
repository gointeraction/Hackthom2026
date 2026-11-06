# SDD — Generador de "Fichas de modelo" con validez regulatoria

> Hackathon UNETI IA 2026 · Proyecto #3 · Eje 1 · IA Ética · Complejidad: Media
> Ente público: Compras públicas / ente rector

## 1. Problema
Las entidades de compras públicas licitan y fiscalizan sistemas basados en modelos de IA sin contar con documentación estandarizada que declare su uso previsto, límites, métricas y sesgos. Esto afecta a licitantes, proveedores y auditores, que hoy evalúan soluciones de IA con criterios dispares y sin evidencia comparable, lo que aumenta el riesgo de contratar sistemas opacos, sesgados o inadecuados para el fin público.

## 2. Objetivos
- Generar automáticamente una ficha de modelo (model card) de cumplimiento en menos de 60 segundos a partir de metadatos, métricas y declaraciones del proveedor.
- Cubrir al menos 4 dimensiones obligatorias por ficha: uso previsto, límites, métricas de desempeño y análisis de sesgos.
- Reducir a cero la dependencia de plantillas manuales en Word/PDF, centralizando la documentación en un formato estructurado y versionable.
- Permitir que un auditor sin conocimientos técnicos profundos valide el 100% de los campos obligatorios de una ficha en una sola vista.

## 3. Requisitos funcionales (RF)
- RF-01: El sistema debe permitir cargar los datos de un modelo (nombre, versión, proveedor, fecha, tipo de tarea y conjunto de entrenamiento) mediante formulario o archivo JSON/YAML.
- RF-02: El sistema debe autogenerar una ficha de modelo en Markdown y HTML que incluya secciones de uso previsto, casos fuera de alcance, métricas (exactitud, F1, etc.) y matriz de sesgos.
- RF-03: El sistema debe validar los campos obligatorios y advertir cuando un proveedor no declara una métrica o un límite requerido para licitar.
- RF-04: El sistema debe registrar un historial de versiones por ficha para que la fiscalización pueda comparar cambios entre la oferta y el despliegue.
- RF-05: El sistema debe exportar la ficha a PDF con membrete institucional del ente rector y un identificador único (ID) por modelo.
- RF-06: El sistema debe permitir clasificar cada modelo según nivel de riesgo (bajo/medio/alto) en función de reglas de IA ética configurables.

## 4. Requisitos no funcionales (RNF)
- RNF-01: Seguridad/privacidad — los datos de los modelos y proveedores deben cifrarse en reposo y en tránsito, con control de acceso por roles (licitante, rector, auditor) y sin exponer datos sensibles de terceros.
- RNF-02: Escalabilidad — la plataforma debe soportar al menos 500 fichas concurrentes y crecer a miles sin degradar la generación, usando almacenamiento y cómputo serverless.
- RNF-03: Rendimiento — la generación de una ficha debe completarse en menos de 60 segundos y la interfaz debe responder en menos de 2 segundos en condiciones normales.
- RNF-04: Accesibilidad/usabilidad — la interfaz debe cumplir lineamientos WCAG 2.1 AA (contraste, navegación por teclado, textos alternativos) y ser usable por personal no técnico de compras públicas.

## 5. Historias de usuario
- Como proveedor licitante, quiero ingresar los datos de mi modelo en un formulario guiado, para obtener una ficha de cumplimiento estandarizada que adjunte a mi oferta sin depender de formatos propios.
- Como funcionario del ente rector, quiero revisar y comparar fichas de distintos proveedores lado a lado, para detectar omisiones de métricas o sesgos antes de adjudicar.
- Como auditor de fiscalización, quiero consultar el historial de versiones de una ficha, para verificar que el modelo desplegado coincide con el modelo ofertado.

## 6. Criterios de aceptación
- Dado un modelo con todos los campos obligatorios completos, cuando el proveedor confirma la generación, entonces el sistema produce una ficha en Markdown y HTML con las 4 dimensiones (uso, límites, métricas, sesgos) en menos de 60 segundos.
- Dado un modelo al que le falta una métrica obligatoria, cuando el proveedor intenta generar la ficha, entonces el sistema bloquea la exportación y muestra una advertencia que indica exactamente qué campo falta.
- Dado un auditor con permiso de solo lectura, cuando consulta una ficha, entonces puede ver el historial de versiones y descargar la ficha en PDF, pero no puede editar el contenido.
- Dado un modelo clasificado como riesgo alto, cuando se genera la ficha, entonces el sistema muestra una marca de "riesgo alto" visible y requiere una justificación adicional antes de la exportación.

## 7. Datos y fuentes sugeridas
- Model Cards for Model Reporting (Google, 2019) — esquema base de secciones y transparencia.
- Hugging Face Model Cards — ejemplos reales de fichas en Markdown con metadatos YAML.
- AI Risk Management Framework (NIST AI RMF 1.0) — criterios de riesgo y gobernanza aplicables a compras públicas.
- ISO/IEC 42001 (sistemas de gestión de IA) y borradores del EU AI Act — clasificación por nivel de riesgo y obligaciones de documentación.
- Dataset Cards y Datasheets for Datasets (Gebru et al., 2021) — para documentar conjuntos de entrenamiento y sesgos.
- Repositorio público del ente rector: pliegos de licitación históricos de compra de software y sistemas de IA (fuente interna a integrar).

## 8. Stack tecnológico sugerido
- Lenguajes: TypeScript (frontend y Workers), Python (motor de plantillas Jinja2 y validación de métricas).
- Frontend: React + Vite, con componentes accesibles (WAI-ARIA) y diseño responsive.
- Backend: Cloudflare Workers + Workers AI para generación y resumen de texto; Durable Objects para el control de versiones por ficha.
- Almacenamiento: Cloudflare R2 para PDFs y archivos adjuntos; D1 (SQLite) para fichas y metadatos; KV para caché de plantillas.
- Plantillas y exportación: Jinja2 para Markdown/HTML y WeasyPrint o Playwright para la generación de PDF con membrete.
- Seguridad: Cloudflare Access para autenticación por roles y Cloudflare Turnstile en formularios públicos.

## 9. Ente público y visión de despliegue
Lo adopta el ente rector de compras públicas como herramienta oficial de precalificación y fiscalización. El despliegue se haría como aplicación web alojada en Cloudflare (Workers + Pages), integrada al portal de licitaciones del ente rector: los proveedores cargan sus modelos durante la fase de oferta, los evaluadores comparan fichas en la mesa técnica y los auditores consultan el historial durante la ejecución del contrato. La primera fase pilota con un número reducido de licitaciones, y luego se escala a todo el sistema nacional de compras.

## 10. Definition of Done
- [ ] La ficha generada contiene las 4 dimensiones obligatorias (uso, límites, métricas, sesgos) y un identificador único por modelo.
- [ ] La validación bloquea la exportación cuando falta un campo obligatorio y el mensaje indica el campo exacto.
- [ ] El historial de versiones permite comparar dos versiones de la misma ficha y ver los cambios.
- [ ] La exportación a PDF funciona con membrete institucional y sin errores de maquetación.
- [ ] El proyecto incluye pruebas automatizadas (unitarias y de interfaz) que cubren la generación, validación y exportación, con un README que explica el despliegue.

## 11. Plantilla SPEC.md (lista para copiar)
```markdown
# SPEC — Generador de "Fichas de modelo" con validez regulatoria

## Problema
Las compras públicas carecen de documentación estandarizada de los modelos de IA que licitan y fiscalizan.

## RF / RNF
- RF-01: Cargar datos del modelo por formulario o JSON/YAML.
- RF-02: Autogenerar ficha en Markdown/HTML con uso, límites, métricas y sesgos.
- RF-03: Validar campos obligatorios y advertir omisiones.
- RF-04: Registrar historial de versiones por ficha.
- RF-05: Exportar a PDF con identificador único.
- RF-06: Clasificar nivel de riesgo del modelo.
- RNF-01: Cifrado en reposo/tránsito y control de acceso por roles.
- RNF-02: Soporte para 500+ fichas concurrentes.
- RNF-03: Generación < 60 s y UI < 2 s.
- RNF-04: WCAG 2.1 AA y usabilidad para personal no técnico.

## Historias de usuario
- Como proveedor licitante, quiero ingresar los datos de mi modelo en un formulario guiado, para obtener una ficha estandarizada que adjuntar a mi oferta.
- Como funcionario del ente rector, quiero comparar fichas de proveedores lado a lado, para detectar omisiones antes de adjudicar.
- Como auditor, quiero consultar el historial de versiones, para verificar que el modelo desplegado coincide con el ofertado.

## Criterios de aceptación
- Dado un modelo completo, cuando se confirma la generación, entonces se produce la ficha con las 4 dimensiones en menos de 60 segundos.
- Dado un modelo sin una métrica obligatoria, cuando intenta exportar, entonces el sistema bloquea y señala el campo faltante.
- Dado un auditor de solo lectura, cuando consulta una ficha, entonces ve el historial y descarga PDF sin poder editar.
- Dado un modelo de riesgo alto, cuando se genera la ficha, entonces se muestra la marca de riesgo y se exige justificación adicional.

## Fuera de alcance
- Entrenamiento o evaluación automática de modelos (solo documentación y validación de lo declarado).
- Auditoría forense del código o de los datos de entrenamiento del proveedor.
- Firma electrónica o trámite legal de adjudicación de contratos.
- Integración con sistemas de pago o tesorería del ente público.
```

## 12. Elevator Pitch
El ente rector de compras públicas licita y fiscaliza sistemas de IA sin documentación estandarizada, por lo que hoy evalúa ofertas con criterios dispares y asume el riesgo de contratar soluciones opacas o sesgadas. Este proyecto genera, en menos de 60 segundos, una ficha de modelo con validez regulatoria que declara uso previsto, límites, métricas y sesgos a partir de los datos del proveedor. La plataforma permite a licitantes adjuntar fichas comparables, a evaluadores contrastarlas lado a lado y a auditores rastrear el historial de versiones entre la oferta y el despliegue. El valor diferencial es convertir un proceso manual en Word/PDF en una documentación estructurada, versionable y validable de forma automática, lista para integrarse al portal de licitaciones.

## 13. Impacto en el organismo público
- **Eficiencia**: automatiza la generación y validación de fichas, reduciendo de minutos a segundos la documentación por modelo y eliminando la dependencia de plantillas manuales en Word/PDF.
- **Transparencia**: estandariza las 4 dimensiones obligatorias (uso previsto, límites, métricas y sesgos) para que todas las ofertas sean comparables bajo los mismos criterios.
- **Confianza ciudadana**: al exigir evidencia comparable y clasificar el riesgo de cada modelo, el ente rector reduce la probabilidad de adjudicar sistemas opacos o inadecuados para el fin público.
- **Ahorro de recursos**: la validación automática de campos obligatorios y la vista única para auditores sin perfil técnico disminuyen el esfuerzo de revisión en la mesa técnica y en fiscalización.
- **Cumplimiento normativo**: alinea la documentación con referencias como NIST AI RMF, ISO/IEC 42001 y el EU AI Act, y habilita la trazabilidad de versiones para verificar que el modelo desplegado coincide con el ofertado.

## 14. README y documentación del proyecto
El repositorio debe incluir, como mínimo:

### README.md (raíz)
- **Título y descripción** clara del proyecto (qué hace y qué problema resuelve): generador de fichas de modelo con validez regulatoria para compras públicas.
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
