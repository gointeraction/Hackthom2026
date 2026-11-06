# 03 · Especificación Técnica — Página Web de Convocatoria

**Uso:** define la implementación: stack, estructura, modelo de datos, integración del formulario, SEO y despliegue. Se deriva de los documentos `00` y `01`.

---

## 1. Stack recomendado

| Capa | Elección | Justificación |
|---|---|---|
| Marcado | HTML5 semántico | Accesible, sin dependencias |
| Estilos | CSS vanilla o Tailwind | Rápido de mantener; tokens del doc 02 |
| Interacción | JavaScript vanilla (ES2020) | Validación, menú, acordeón, anclas |
| Formulario | **Formspree** o **Netlify Forms** | Envío sin backend propio |
| Despliegue | Netlify / Cloudflare Pages / Vercel / GitHub Pages | Estático y gratuito |

> **Alternativa simple:** si no hay tiempo, incrustar un **Google Forms** mantiene la captura, pero pierde control visual y validaciones propias. La opción recomendada es formulario nativo + Formspree.

---

## 2. Estructura de archivos

```
convocatoria/
├── index.html            # Página única
├── css/
│   └── styles.css        # Tokens y estilos (doc 02)
├── js/
│   └── main.js           # Validación, menú, acordeón, envío
├── assets/
│   ├── img/              # logo, og-image, fotos
│   └── favicon.svg
├── robots.txt
└── (opcional) sitemap.xml
```

---

## 3. Modelo de datos del formulario

```json
{
  "nombre": "string",
  "cedula": "string",
  "correo": "string",
  "telefono": "string",
  "universidad": "string",
  "carrera": "string",
  "nivel": "TSU | Pregrado | Postgrado",
  "tieneEquipo": "boolean",
  "nombreEquipo": "string | null",
  "integrantes": "string | null",
  "asignarEquipo": "boolean",
  "eje": "IA_Etica | Ciberseguridad | Indiferente",
  "experiencia": "Principiante | Intermedio | Avanzado",
  "restricciones": "string | null",
  "aceptaBases": "boolean",
  "aceptaDatos": "boolean",
  "_gotcha": ""            // honeypot anti-spam (debe quedar vacío)
}
```

---

## 4. Validaciones (regex)

| Campo | Regla | Regex / lógica |
|---|---|---|
| Nombre | 3–100 chars, ≥ 2 palabras | `str.trim().split(/\s+/).length >= 2` |
| Cédula | `V/E/J` + 6–8 dígitos | `/^[VEJ]-?\d{6,8}$/i` |
| Correo | formato básico | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| Teléfono | 10–11 dígitos | `/^0(212|412|414|416|424|426)\d{7}$/` |
| Checkboxes | obligatorios | deben estar `checked` |
| Honeypot | vacío | si tiene valor, descartar en silencio |

---

## 5. Integración del formulario

**Opción A — Formspree (recomendada):**
1. Crear formulario en formspree.io y obtener el endpoint `https://formspree.io/f/XXXX`.
2. Enviar por `fetch` con `Accept: application/json`.
3. Al responder `200`, mostrar mensaje de éxito; si no, error.

**Opción B — Netlify Forms:**
1. Añadir `data-netlify="true"` (o `netlify`) al `<form>`.
2. Añadir `<input type="hidden" name="form-name" value="inscripcion">`.
3. El envío lo gestiona Netlify sin JavaScript.

**Opción C — Google Forms (fallback rápido):** incrustar el `<iframe>` del formulario.

---

## 6. SEO y compartición

**Head mínimo:**
```html
<title>Hackathon UNETI IA 2026 · IA Ética y Ciberseguridad</title>
<meta name="description" content="Participa el 13 y 14 de noviembre en Caracas...">
<meta property="og:type" content="website">
<meta property="og:title" content="Hackathon UNETI IA 2026">
<meta property="og:description" content="Dos días · IA Ética y Ciberseguridad.">
<meta property="og:image" content="https://.../og-image.png">
<meta name="viewport" content="width=device-width, initial-scale=1">
```

**JSON-LD (Event):**
```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Hackathon UNETI IA 2026",
  "startDate": "2026-11-13T09:00:00-04:00",
  "endDate": "2026-11-14T18:00:00-04:00",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "eventStatus": "https://schema.org/EventScheduled",
  "location": {
    "@type": "Place",
    "name": "Edificio Ministerio de Ciencia y Tecnología, Piso 12",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Avenida Universidad, esquina El Chorro",
      "addressLocality": "Caracas",
      "addressCountry": "VE"
    }
  },
  "isAccessibleForFree": true
}
```

---

## 7. Despliegue

1. Subir el repositorio a GitHub/GitLab.
2. Conectar a **Netlify** o **Cloudflare Pages** (deploy automático por push).
3. Configurar dominio (ej. `hackathon.uneti.edu.ve` o subdominio gratuito).
4. Verificar HTTPS y probar el formulario en producción.

---

## 8. Definition of Done (técnico)

- [ ] `index.html` semántico con las 12 secciones y anclas.
- [ ] Tokens CSS del doc 02 implementados (colores, tipografía, espaciado).
- [ ] Validaciones del §4 funcionando y con mensajes accesibles.
- [ ] Formulario conectado (Formspree/Netlify) y probado de extremo a extremo.
- [ ] Lighthouse: accesibilidad ≥ 90, rendimiento ≥ 90, SEO ≥ 90.
- [ ] Open Graph y JSON-LD presentes; página compartida muestra título e imagen correctos.
- [ ] Responsive verificado en 360 px, 768 px y 1440 px.
