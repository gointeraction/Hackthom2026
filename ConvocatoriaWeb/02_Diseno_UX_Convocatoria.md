# 02 · Diseño UX — Página Web de Convocatoria

**Uso:** define la estructura visual, los componentes y el sistema de diseño para implementar la página. El código debe seguir este documento.

---

## 1. Principios de diseño

1. **Claridad primero:** en 10 segundos debe quedar claro *qué es, cuándo, dónde y cómo inscribirse*.
2. **Móvil primero:** el registro ocurre mayormente desde el celular; se diseña para 360 px y se escala.
3. **Tecnológico y confiable:** estética institucional-educativa con acentos tecnológicos (cian), sin recargar.
4. **Accesible por defecto:** contraste AA, foco visible, semántica y ARIA correctos.

---

## 2. Layout general

- **Ancho máximo del contenido:** 1120 px, centrado.
- **Estructura:** one-page con scroll vertical y anclas.
- **Ritmo visual:** secciones alternan fondo claro y fondo suave para separar bloques.

---

## 3. Wireframe por sección (textual)

**1) Header (sticky)**
- Izquierda: logo/marca "Hackathon UNETI IA".
- Derecha (escritorio): enlaces ancla + botón "Inscríbete".
- Móvil: menú hamburguesa que despliega enlaces.

**2) Hero (fondo oscuro con gradiente)**
- Eyebrow → H1 → subtítulo → pills (fecha/sede/cupo) → 2 botones.
- Composición centrada, texto blanco sobre gradiente azul.

**3) Sobre el evento** — 1 columna de texto (máx. 65 caracteres/línea).

**4) Ejes temáticos** — 2 tarjetas lado a lado (1 columna en móvil).

**5) Quién puede participar** — lista con viñetas + nota destacada.

**6) Detalles** — tabla o tarjetas de datos (fecha, horario, modalidad, lugar, cupo).

**7) Agenda** — 2 bloques (Día 1 / Día 2) tipo timeline.

**8) Premios** — 3 tarjetas (1º/2º/3º) + línea de menciones.

**9) Inscripción** — formulario en tarjeta centrada (máx. 640 px).

**10) FAQ** — acordeón (una pregunta abierta a la vez).

**11) Contacto** — correo + redes, centrado.

**12) Footer** — fondo oscuro, texto institucional y enlaces.

---

## 4. Componentes

| Componente | Especificación |
|---|---|
| **Botón primario** | Fondo cian `#00B4D8`, texto blanco, radio 8 px, padding 12×24 px, hover oscurece 8%. |
| **Botón secundario** | Borde 2 px cian, fondo transparente, texto cian. |
| **Tarjeta (eje/premio)** | Radio 12 px, sombra `0 2px 8px rgba(0,0,0,.08)`, padding 24 px. |
| **Pills de datos** | Fondo rgba blanco 12%, borde 1 px, radio 999 px, icono + texto. |
| **Timeline agenda** | Línea vertical con puntos; cada ítem: hora (negrita) + actividad. |
| **Acordeón FAQ** | Botón (pregunta) + panel (respuesta); `aria-expanded` y `aria-controls`. |
| **Formulario** | Inputs con label visible, texto de ayuda, mensajes de error bajo cada campo. |

---

## 5. Sistema de diseño (tokens)

### 5.1 Color
| Token | Valor | Uso |
|---|---|---|
| `--primary` | `#0B2545` | Fondo hero, footer, textos de encabezado |
| `--primary-2` | `#13315C` | Gradiente hero |
| `--accent` | `#00B4D8` | Botones, enlaces, resaltes |
| `--accent-2` | `#06D6A0` | Eje "IA Ética" (verde confianza) |
| `--security` | `#F72585` | Eje "Ciberseguridad" (acento alerta) |
| `--bg` | `#F8FAFC` | Fondo claro |
| `--surface` | `#FFFFFF` | Tarjetas |
| `--text` | `#0F172A` | Texto principal |
| `--text-soft` | `#475569` | Texto secundario |
| `--success` | `#16A34A` | Éxito |
| `--error` | `#DC2626` | Errores de validación |

### 5.2 Tipografía
- **Títulos:** "Space Grotesk" (fallback: "Inter", sans-serif).
- **Cuerpo:** "Inter" (fallback: system-ui).
- **Escala:** H1 `2.5–3rem` · H2 `1.75–2rem` · H3 `1.25–1.5rem` · Cuerpo `1–1.125rem` · Nota `0.875rem`.

### 5.3 Espaciado
- Escala base de 4 px: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`.
- Separación entre secciones: `64–96 px` (móvil `48 px`).

### 5.4 Radio y sombra
- Tarjetas: 12 px · Botones/pills: 8 px / 999 px · Sombra suave para tarjetas.

---

## 6. Responsive (breakpoints)

| Rango | Comportamiento |
|---|---|
| < 640 px (móvil) | 1 columna, menú hamburguesa, botones a ancho completo, hero apilado. |
| 640–1024 px (tablet) | 2 columnas para tarjetas de ejes y premios. |
| ≥ 1024 px (escritorio) | Navegación completa visible, 3 columnas en premios. |

---

## 7. Accesibilidad

- Contraste AA: texto ≥ 4.5:1, texto grande ≥ 3:1 (verificar con herramienta).
- Foco visible en todos los interactivos (`:focus-visible`, outline 2 px).
- HTML semántico: `<header> <nav> <main> <section> <footer>`, un solo `<h1>`.
- Formulario: `<label for>` por campo, `aria-invalid` y `aria-describedby` para errores, `required` y `aria-required`.
- Acordeón: botones con `aria-expanded` y paneles con `aria-controls`/`role="region"`.
- Imágenes decorativas con `alt=""`; informativas con `alt` descriptivo.

---

## 8. Interacciones y estados

- **Nav sticky** con sombra al hacer scroll.
- **Anclas** con scroll suave (`scroll-behavior: smooth`) y offset por header fijo.
- **Formulario:** estados por campo — normal, focus, error (borde rojo + mensaje), éxito.
- **Envío:** botón en estado "Enviando…" (deshabilitado) mientras procesa; luego mensaje de éxito/error.
- **Acordeón:** solo una pregunta abierta a la vez.
