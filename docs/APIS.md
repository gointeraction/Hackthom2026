# Hackathon UNETI IA 2026 — Referencia completa de las APIs

> Documentación exhaustiva de **todos** los endpoints de la plataforma.
>
> - **Base URL:** `https://hackathon-uneti-ia.pages.dev`
> - **API de agentes:** `https://hackathon-uneti-ia.pages.dev/api/v1`
> - **Última actualización:** 2026-11-08 · Migraciones `0028`

---

## Índice

1. [Convenciones](#1-convenciones)
2. [API pública](#2-api-pública)
3. [API administrativa](#3-api-administrativa)
4. [API v1 para agentes](#4-api-v1-para-agentes)
5. [Webhooks](#5-webhooks)
6. [Códigos de error](#6-códigos-de-error)

---

## 1. Convenciones

### 1.1 Tipos de autenticación

| Tipo | Dónde | Cómo |
|---|---|---|
| **Ninguna** | Endpoints públicos de lectura | — |
| **Turnstile** | Escrituras públicas | Token `cf-turnstile-response` en el body (`turnstile`) |
| **Código** | Panel remoto | Código de participante (8 caracteres) |
| **Sesión admin** | `/api/admin/*` | Cookie `admin_auth` (HMAC-SHA256) |
| **API key** | `/api/v1/*` | `Authorization: Bearer hx_sk_…` |
| **Secreto** | `/api/backup-auto` | Header `X-Backup-Secret` |

### 1.2 Formato de respuesta

```json
{ "ok": true, ... }
```

Error:

```json
{ "ok": false, "error": "Mensaje legible." }
```

### 1.3 Rate limiting

| Ámbito | Límite |
|---|---|
| Escrituras públicas (`register`, `entrega`, `consulta`, `chat`, `encuesta`, `sponsors`, `asistencia`, `mentor-remoto`) | **20 req/min por IP** |
| API v1 | **120 req/min por clave** |

Al exceder: `429` → `{ "ok": false, "error": "Demasiadas solicitudes…" }`

---

## 2. API pública

### 2.1 `POST /api/register` — Inscripción

**Auth:** Turnstile (acción `inscripcion`)

**Body (individual):**
```json
{
  "tipo": "individual",
  "nombre": "Mayra",
  "apellido": "Inca",
  "correo": "mayra@ejemplo.com",
  "nacimiento": "1999-03-30",
  "anio": "2do año",
  "conducta": true,
  "imagen": true,
  "turnstile": "<token>"
}
```

**Body (grupal):**
```json
{
  "tipo": "grupal",
  "propuesta": "Descripción del proyecto (mín. 10 caracteres)",
  "miembros": [
    { "nombre": "…", "apellido": "…", "correo": "…", "nacimiento": "…", "anio": "…" }
  ],
  "conducta": true,
  "imagen": true,
  "turnstile": "<token>"
}
```

**Respuesta 200:**
```json
{ "ok": true, "message": "Inscripción registrada correctamente.", "codigo": "CED8EE8A" }
```

**Errores:** `400` (datos), `403` (Turnstile), `409` (correo duplicado), `429` (rate limit).

---

### 2.2 `POST /api/entrega` — Entrega de proyecto

**Auth:** Turnstile (acción `entrega`) + código válido

**Body:**
```json
{
  "codigo": "CED8EE8A",
  "repositorio": "https://github.com/usuario/repo",
  "proyecto": "Mi Proyecto",
  "demo": "https://demo.ejemplo.com",
  "video": "https://youtube.com/watch?v=...",
  "deck": "https://docs.google.com/...",
  "tags": "Python, Cloudflare, Workers AI",
  "descripcion": "Detector de deepfakes para comunicados oficiales",
  "turnstile": "<token>"
}
```

**Validaciones:**
- `codigo` y `repositorio` obligatorios.
- `repositorio` debe ser `github.com` o `gitlab.com`.
- El código debe existir en `registrations`.

**Respuesta 200:**
```json
{ "ok": true, "message": "Entrega registrada correctamente." }
```

> ℹ️ Dispara el webhook `entrega.nueva`.

**Errores:** `400`, `403` (Turnstile/código), `429`.

---

### 2.3 `POST /api/consulta` — Consulta a mentores

**Auth:** Turnstile (acción `consulta`) + código

**Body:**
```json
{ "codigo": "CED8EE8A", "consulta": "¿Cómo configuro Cloudflare?", "turnstile": "<token>" }
```

**Respuesta 200:**
```json
{ "ok": true, "message": "Consulta registrada." }
```

---

### 2.4 `POST /api/chat` — Chatbot Unitron

**Auth:** Turnstile (acción `chat`)

**Body:**
```json
{
  "mensaje": "¿Qué es DeepSeek Harness?",
  "historial": [ { "role": "user", "content": "…" }, { "role": "assistant", "content": "…" } ],
  "turnstile": "<token>"
}
```

**Respuesta 200:**
```json
{ "ok": true, "respuesta": "DeepSeek Harness es…" }
```

---

### 2.5 `POST /api/mentor-remoto` — Mentor virtual

**Auth:** código de participante

**Body:**
```json
{
  "codigo": "CED8EE8A",
  "mensaje": "¿Cómo entrego mi proyecto?",
  "historial": []
}
```

**Respuesta 200:**
```json
{ "ok": true, "respuesta": "…" }
```

---

### 2.6 `POST /api/asistencia` — Asistencia remota

**Auth:** código

**Body:**
```json
{ "codigo": "CED8EE8A", "dia": 1 }
```

**Respuesta 200:**
```json
{ "ok": true, "message": "Asistencia registrada." }
```

---

### 2.7 `POST /api/sponsors` — Interés de patrocinio

**Auth:** Turnstile (acción `patrocinio`)

**Body:**
```json
{
  "empresa": "ACME",
  "contacto": "Juan Pérez",
  "correo": "juan@acme.com",
  "telefono": "0412-1234567",
  "tipo": ["Oro"],
  "detalle": "Queremos apoyar…",
  "turnstile": "<token>"
}
```

**Respuesta 200:**
```json
{ "ok": true, "message": "Solicitud enviada." }
```

---

### 2.8 `POST /api/encuesta` — Encuesta NPS

**Auth:** ninguna

**Body:**
```json
{ "puntaje": 9, "codigo": "CED8EE8A", "comentario": "Excelente evento" }
```

**Validaciones:** `puntaje` entre 1 y 10.

**Respuesta 200:**
```json
{ "ok": true, "message": "¡Gracias por tu feedback!" }
```

---

### 2.9 `GET /api/comunicados` — Comunicados

**Auth:** ninguna

```json
{
  "ok": true,
  "comunicados": [
    { "id": 1, "titulo": "…", "contenido": "…", "created_at": "2026-11-07 13:00:27" }
  ]
}
```

---

### 2.10 `GET /api/charlas` — Charlas y ponentes

**Auth:** ninguna

```json
{
  "ok": true,
  "charlas": [
    {
      "id": 1, "titulo": "DeepSeek Harness", "ponente": "Jorge Barrero",
      "contacto": null, "curriculum": null,
      "dia": 1, "hora_inicio": "09:30", "hora_fin": "10:00", "orden": 1
    }
  ]
}
```

---

### 2.11 `GET /api/proyectos` — Galería pública

**Auth:** ninguna

```json
{
  "ok": true,
  "proyectos": [
    {
      "proyecto": "Mi Proyecto", "descripcion": "…",
      "repositorio": "https://github.com/usuario/repo",
      "demo": "…", "video": "…", "deck": "…", "tags": "Python, Cloudflare",
      "equipo": "Equipo Alpha", "eje": "Ciberseguridad"
    }
  ]
}
```

---

### 2.12 `GET /api/leaderboard` — Ranking

**Auth:** ninguna

```json
{
  "ok": true,
  "ranking": [
    { "posicion": 1, "equipo": "Equipo Alpha", "eje": "Ciberseguridad", "proyecto": "…", "puntaje": 9.4, "votos": 3 }
  ]
}
```

---

### 2.13 `GET /api/estatus?correo=` — Estatus de inscripción

**Auth:** ninguna

**Query:** `correo`

```json
{
  "ok": true,
  "registro": {
    "nombre": "Mayra", "apellido": "Inca", "correo": "m***@gmail.com",
    "modalidad": "remoto", "acreditado": 0, "codigo": "CED8EE8A"
  }
}
```

**Errores:** `400` (sin correo), `404` (no encontrado).

---

### 2.14 `GET /api/fotos` — Galería

**Auth:** ninguna

```json
{ "ok": true, "fotos": [ { "key": "fotos/123.jpg", "caption": "…" } ] }
```

---

### 2.15 `GET /api/foto?key=` — Foto individual

**Auth:** ninguna · Devuelve la imagen (`image/*`) desde R2.

**Errores:** `400` (sin key), `404`.

---

### 2.16 `POST /api/panel-remoto` — Datos del panel remoto

**Auth:** Turnstile (acción `panel`) + código

**Body:**
```json
{ "codigo": "CED8EE8A", "turnstile": "<token>" }
```

**Respuesta 200:** datos del participante, equipo, entrega, consultas, asistencia y progreso GitHub.

---

### 2.17 `GET /api/certificado?codigo=` — Datos del certificado

**Auth:** ninguna

```json
{ "ok": true, "nombre": "Mayra Inca", "modalidad": "remoto", "codigo": "CED8EE8A" }
```

**Errores:** `400` (sin código), `404`.

---

### 2.18 `POST /api/backup-auto` — Respaldo automático

**Auth:** header `X-Backup-Secret`

**Respuesta 200:**
```json
{ "ok": true, "key": "backups/d1-2026-11-08T12-00-00-000Z.json", "tables": 19 }
```

**Errores:** `401` (secreto inválido), `500`.

---

## 3. API administrativa

> Todos requieren **sesión admin** (cookie `admin_auth`). Sin sesión → `401`.
> Cada mutación se registra en `auditoria`.

### 3.1 Autenticación

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/admin/login` | Iniciar sesión |
| `GET` | `/api/admin/logout` | Cerrar sesión |

### 3.2 Inscripciones

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/admin/registrations` | Listar inscripciones |
| `POST` | `/api/admin/registrations` | Actualizar inscripción |
| `GET` | `/api/admin/teams` | Listar equipos |
| `POST` | `/api/admin/teams` | Crear/actualizar equipo |
| `GET` | `/api/admin/remotos` | Participantes remotos |
| `POST` | `/api/admin/acreditar` | Acreditar participante |
| `POST` | `/api/admin/enviar-codigos` | Enviar códigos por correo |
| `GET` / `POST` / `DELETE` | `/api/admin/judges` | Jurados (con teléfono) |
| `GET` / `POST` / `DELETE` | `/api/admin/usuarios` | Usuarios del panel |

### 3.3 Evaluación

| Método | Ruta | Descripción |
|---|---|---|
| `GET` / `POST` | `/api/admin/scores` | Puntajes de jurados |
| `GET` / `POST` | `/api/admin/evaluador` | Configuración del evaluador IA |
| `POST` | `/api/admin/evaluar` | Evaluación IA |
| `POST` | `/api/admin/seleccion` | Preselección |
| `GET` | `/api/admin/resultados` | Resultados |
| `GET` | `/api/admin/resumen` | Resumen ejecutivo |
| `POST` | `/api/admin/agente-triaje-proyectos` | Triaje de proyectos |
| `GET` | `/api/admin/encuestas` | Resultados NPS |

### 3.4 Logística

| Método | Ruta | Descripción |
|---|---|---|
| `GET` / `POST` | `/api/admin/logistica` | Logística |
| `GET` | `/api/admin/insumos` | Insumos por grupo |
| `GET` | `/api/admin/asistencia` | Asistencia |
| `GET` | `/api/admin/entregas` | Entregas |
| `GET` / `POST` | `/api/admin/consultas` | Consultas |
| `GET` / `POST` | `/api/admin/presupuesto` | Presupuesto |

### 3.5 Comunicación

| Método | Ruta | Descripción |
|---|---|---|
| `GET` / `POST` / `DELETE` | `/api/admin/comunicados` | Comunicados |
| `GET` / `POST` / `DELETE` | `/api/admin/charlas` | Charlas y ponentes |
| `GET` / `POST` / `DELETE` | `/api/admin/fotos` | Galería |
| `GET` / `POST` | `/api/admin/sponsors` | Patrocinadores |

### 3.6 Agentes IA (Unitron)

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/admin/agente-recordatorios` | Recordatorios por correo |
| `POST` | `/api/admin/agente-github` | Monitoreo de repositorios |
| `POST` | `/api/admin/agente-triaje` | Triaje de consultas |
| `POST` | `/api/admin/agente-triaje-proyectos` | Triaje de proyectos |
| `POST` | `/api/admin/agente-resumen` | Resumen del evento |

### 3.7 Sistema

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/admin/auditoria` | Auditoría |
| `GET` | `/api/admin/errores` | Errores |
| `GET` | `/api/admin/backup` | Backup JSON |
| `GET` | `/api/admin/backups` | Listar respaldos en R2 |
| `POST` | `/api/admin/backup-now` | Generar respaldo |
| `GET` | `/api/admin/export` | Exportar datos |
| `GET` / `POST` / `DELETE` | `/api/admin/api-keys` | API keys |
| `GET` / `POST` / `DELETE` | `/api/admin/webhooks` | Webhooks |

---

## 4. API v1 para agentes

**Base:** `/api/v1` · **Auth:** `Authorization: Bearer hx_sk_…` · **Límite:** 120 req/min

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/v1/health` | Verificación |
| `GET` | `/api/v1/stats` | Conteos + `entregas_con_repositorio` + `por_modalidad` |
| `GET` | `/api/v1/registrations` | Inscripciones (emails enmascarados) |
| `GET` | `/api/v1/teams` | Equipos |
| `GET` | `/api/v1/entregas` | Entregas + `participante`, `equipo`, `eje`, `repositorio` |
| `GET` | `/api/v1/charlas` | Charlas |
| `GET` | `/api/v1/comunicados` | Comunicados |
| `GET` | `/api/v1/evaluaciones` | Evaluaciones IA |
| `GET` | `/api/v1/scores` | Puntajes |
| `GET` | `/api/v1/encuestas` | Encuestas |
| `GET` | `/api/v1/judges` | Jurados |
| `GET` | `/api/v1/sponsors` | Patrocinadores |
| `GET` | `/api/v1/logistica` | Logística |
| `GET` | `/api/v1/presupuesto` | Presupuesto |
| `GET` | `/api/v1/consultas` | Consultas |
| `GET` | `/api/v1/asistencia_remota` | Asistencia remota |

**Paginación:** `?limit=` (1–500, def. 100) y `?offset=` (def. 0).

> 📘 Detalle completo en [`API.md`](./API.md).

---

## 5. Webhooks

| Evento | Cuándo |
|---|---|
| `entrega.nueva` | Al registrar/actualizar una entrega |

**Headers:**
```http
X-Webhook-Event: entrega.nueva
X-Webhook-Signature: <hmac-sha256-hex>
```

**Payload:**
```json
{
  "evento": "entrega.nueva",
  "enviado_en": "2026-11-14T16:00:00.000Z",
  "data": {
    "codigo": "ABC123",
    "repositorio": "https://github.com/usuario/repo",
    "proyecto": "Mi Proyecto",
    "demo": "…",
    "video": "…",
    "deck": "…",
    "tags": "…",
    "descripcion": "…"
  }
}
```

**Verificación (Node.js):**
```js
const expected = crypto.createHmac('sha256', SECRETO).update(rawBody).digest('hex');
crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(req.headers['x-webhook-signature']));
```

**Verificación (Python):**
```python
expected = hmac.new(b'SECRETO', raw_body, hashlib.sha256).hexdigest()
hmac.compare_digest(expected, request.headers['X-Webhook-Signature'])
```

> ⚠️ La firma se calcula sobre el **cuerpo crudo**.

---

## 6. Códigos de error

| Código | Significado |
|---|---|
| `400` | Datos inválidos o faltantes |
| `401` | No autorizado (sesión/API key) |
| `403` | Turnstile o código inválido |
| `404` | Recurso no encontrado |
| `409` | Conflicto (correo duplicado) |
| `429` | Demasiadas solicitudes |
| `500` | Error interno |

---

## 7. Resumen de conteo

| Categoría | Endpoints |
|---|---|
| Públicos | **18** |
| Admin | **39** |
| API v1 | **16 recursos** |
| Webhooks | **1 evento** |
| **Total** | **74** |

---

© 2026 Hackathon UNETI IA · Comité Organizador
