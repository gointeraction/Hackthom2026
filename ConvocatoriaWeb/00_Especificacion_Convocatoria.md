# 00 · Especificación — Página Web de Convocatoria

**Proyecto:** Landing page de convocatoria — Hackathon UNETI IA
**Evento:** Viernes 13 y sábado 14 de noviembre de 2026 · 9:00 am – 6:00 pm
**Sede:** Edificio Ministerio de Ciencia y Tecnología (MPPCT), Piso 12, Av. Universidad, esquina El Chorro, Caracas
**Versión:** 1.0 · Estado: especificación fuente de verdad (Spec-Driven Development)

> Este documento es el **contrato de desarrollo**: todo el código y el contenido se derivan de aquí. Ante cualquier ambigüedad, este documento manda.

---

## 1. Propósito y objetivos

**Propósito:** informar y convertir visitantes en participantes inscritos del Hackathon UNETI IA.

**Objetivos de negocio:**
1. Alcanzar el cupo completo (**10 equipos de 5 = 50 participantes**).
2. Comunicar con claridad fecha, sede, ejes temáticos, requisitos y dinámica.
3. Capturar inscripciones completas y válidas mediante un formulario.

**Objetivos de producto (KPIs de la página):**
- ≥ 70% de visitantes que leen la sección "Quién puede participar".
- Tasa de conversión del formulario ≥ 30% sobre clics en "Inscríbete".
- Formularios sin errores de validación bloqueantes.
- Carga en < 2,5 s en móvil (3G/4G) y 100/100 de Lighthouse en accesibilidad.

---

## 2. Público objetivo

- **Primario:** estudiantes universitarios/TSU de informática, telecomunicaciones e ingeniería, de UNETI y otras instituciones del país (alcance nacional).
- **Secundario:** autoridades UNETI, patrocinadores y entes públicos interesados.

**Suposiciones de uso:** mayoritariamente **móvil** (inscripción desde el celular), navegación rápida y registro en menos de 2 minutos.

---

## 3. Alcance

**Dentro del alcance (in scope):**
- Página única (one-page) con navegación por anclas.
- Secciones: Hero, Sobre el evento, Ejes temáticos, Quién puede participar, Detalles (fecha/lugar), Agenda, Premios, Inscripción (formulario), FAQ, Contacto, Footer.
- Formulario de inscripción con validación y confirmación.
- Contenido responsive y accesible.

**Fuera del alcance (out of scope) para v1:**
- Panel de administración de inscritos (se usa un backend de formularios externo).
- Autenticación/login de participantes.
- Pasarela de pago (el evento es gratuito).
- Aplicación móvil.

---

## 4. Requisitos funcionales (RF)

| ID | Requisito | Prioridad |
|---|---|---|
| RF-01 | La página muestra un Hero con nombre del evento, lema, fecha, sede y botón de inscripción. | Alta |
| RF-02 | La página expone dos ejes temáticos: **IA Ética** y **Ciberseguridad**. | Alta |
| RF-03 | La página muestra fecha, horario, lugar, modalidad y cupo. | Alta |
| RF-04 | La página presenta una agenda resumida de los 2 días. | Media |
| RF-05 | La página describe premios (1º, 2º, 3º y menciones). | Media |
| RF-06 | La página contiene un formulario de inscripción con los campos definidos en §9. | Alta |
| RF-07 | El formulario valida campos obligatorios, formato de cédula, correo y teléfono. | Alta |
| RF-08 | El formulario muestra confirmación de éxito y mensajes de error por campo. | Alta |
| RF-09 | El formulario exige aceptación de bases/reglas y de tratamiento de datos. | Alta |
| RF-10 | La página incluye una sección de FAQ (mínimo 6 preguntas). | Media |
| RF-11 | La página incluye datos de contacto (correo y redes). | Media |
| RF-12 | La navegación del menú desplaza suavemente a cada sección (anclas). | Media |
| RF-13 | La página permite copiar/compartir el enlace del evento (Open Graph). | Media |

---

## 5. Requisitos no funcionales (RNF)

| ID | Requisito |
|---|---|
| RNF-01 | **Responsive:** óptimo en móvil (360 px), tablet y escritorio (1440 px). |
| RNF-02 | **Rendimiento:** LCP < 2,5 s; imágenes optimizadas (WebP/AVIF, lazy-load). |
| RNF-03 | **Accesibilidad:** contraste AA, foco visible, HTML semántico, ARIA en formulario y acordeón. |
| RNF-04 | **SEO:** title, meta description, Open Graph y JSON-LD del evento. |
| RNF-05 | **Idioma:** 100% español (es-VE). |
| RNF-06 | **Seguridad:** sin datos sensibles en el cliente; el envío usa HTTPS. |
| RNF-07 | **Analítica:** medición de eventos (clic en CTA, envío de formulario) — opcional. |
| RNF-08 | **Marca:** paleta y tipografía alineadas a la identidad del evento (§ documento de diseño). |

---

## 6. Historias de usuario

- **US-01** Como estudiante, quiero ver de un vistazo la fecha, el lugar y el tema, para decidir si me interesa.
- **US-02** Como estudiante, quiero saber quién puede participar y los requisitos, para no inscribirme en vano.
- **US-03** Como estudiante sin equipo, quiero indicar que me asignen a un equipo, para poder participar igualmente.
- **US-04** Como estudiante, quiero inscribirme desde el celular en menos de 2 minutos y recibir confirmación.
- **US-05** Como estudiante, quiero resolver dudas rápidamente sin escribir un correo (FAQ).
- **US-06** Como organizador, quiero recibir inscripciones válidas y estructuradas, para armar los 10 equipos.

---

## 7. Criterios de aceptación

### 7.1 Página
- [ ] Todas las secciones del mapa (§8) están presentes y accesibles por ancla.
- [ ] En móvil no hay scroll horizontal; el texto no se desborda.
- [ ] El Hero comunica en ≤ 10 segundos: **qué es, cuándo, dónde y cómo inscribirse**.

### 7.2 Formulario
- [ ] Campos obligatorios marcados y validados antes del envío.
- [ ] Cédula acepta formato `V-12345678` / `E-12345678` (7–8 dígitos).
- [ ] Correo con formato válido; teléfono con formato venezolano (opcionalmente).
- [ ] Los checkboxes de bases y datos son obligatorios; sin ellos no se envía.
- [ ] Al enviar correctamente, se muestra mensaje de éxito y se limpia el formulario.
- [ ] Al fallar, el usuario ve qué campos corregir sin perder lo ya escrito.

---

## 8. Mapa de secciones (orden de la página)

1. **Header / Nav** — logo + enlaces ancla + botón "Inscríbete".
2. **Hero** — titular, subtítulo, fecha/sede, CTA principal.
3. **Sobre el evento** — qué es, para qué.
4. **Ejes temáticos** — 2 tarjetas (IA Ética, Ciberseguridad).
5. **Quién puede participar** — perfil y requisitos.
6. **Detalles** — fecha, horario, lugar, modalidad, cupo.
7. **Agenda** — resumen de los 2 días.
8. **Premios** — 1º, 2º, 3º y menciones.
9. **Inscripción** — formulario (ancla `#inscripcion`).
10. **FAQ** — acordeón.
11. **Contacto** — correo y redes.
12. **Footer** — créditos UNETI + organizadores.

---

## 9. Formulario de inscripción (campos y validación)

| # | Campo | Tipo | Obligatorio | Validación |
|---|---|---|---|---|
| 1 | Nombre completo | texto | Sí | 3–100 caracteres, ≥ 2 palabras |
| 2 | Cédula | texto | Sí | `[VEJ]-?\d{6,8}` |
| 3 | Correo electrónico | email | Sí | formato RFC básico |
| 4 | Teléfono | tel | Sí | 10–11 dígitos (formato `0412...`/`0212...`) |
| 5 | Universidad / institución | texto | Sí | texto libre |
| 6 | Carrera | texto | Sí | texto libre |
| 7 | Nivel académico | select | Sí | TSU / Pregrado / Postgrado |
| 8 | ¿Tienes equipo? | radio | Sí | Sí / No |
| 8a | (si Sí) Nombre del equipo | texto | Sí* | 2–60 caracteres |
| 8b | (si Sí) Integrantes | textarea | No | lista libre |
| 8c | (si No) Asignarme a un equipo | checkbox | No | booleano |
| 9 | Eje de interés | select | Sí | IA Ética / Ciberseguridad / Indiferente |
| 10 | Nivel de experiencia | select | Sí | Principiante / Intermedio / Avanzado |
| 11 | Restricciones alimentarias | textarea | No | texto libre |
| 12 | Acepto bases y reglas | checkbox | Sí | debe estar marcado |
| 13 | Acepto tratamiento de datos | checkbox | Sí | debe estar marcado |
| 14 | Anti-spam (honeypot) | oculto | No | debe quedar vacío |

\* Campos condicionales (8a) solo se muestran/requieren si "¿Tienes equipo?" = Sí.

**Mensajes:**
- Éxito: *"¡Inscripción recibida! Te enviaremos la confirmación por correo."*
- Error genérico: *"No se pudo enviar el formulario. Revisa los campos marcados e inténtalo de nuevo."*

---

## 10. Definition of Done (checklist de entrega)

- [ ] Secciones, contenido y campos coinciden 1:1 con esta especificación.
- [ ] Validaciones del §9 implementadas y probadas en móvil y escritorio.
- [ ] Accesibilidad AA y HTML semántico verificados (lighthouse ≥ 90 accesibilidad).
- [ ] Open Graph y JSON-LD presentes y correctos.
- [ ] Formulario conectado a un backend y probado de extremo a extremo.

---

## 11. Documentos relacionados

| Doc | Contenido |
|---|---|
| `01_Contenido_Convocatoria.md` | Texto final (copy) de todas las secciones. |
| `02_Diseno_UX_Convocatoria.md` | Estructura visual, componentes y sistema de diseño. |
| `03_Tecnica_Convocatoria.md` | Stack, modelo de datos, integración y despliegue. |
