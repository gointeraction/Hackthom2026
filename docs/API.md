# API v1 — Hackathon UNETI IA 2026

API de **solo lectura** para conectar agentes externos a la base de datos del Hackathon UNETI IA 2026 de forma segura.

- **Base URL:** `https://hackathon-uneti-ia.pages.dev/api/v1`
- **Autenticación:** API key con `Bearer`
- **Límite:** 120 solicitudes/minuto por clave
- **Permisos:** solo lectura

---

## 1. Autenticación

Cada solicitud debe incluir la clave en el encabezado `Authorization`:

```http
Authorization: Bearer hx_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Las claves se crean desde el panel admin:

> **Panel admin → Sistema → 🔑 API agentes → Generar clave**

> ⚠️ La clave se muestra **una sola vez**. Guárdala en un gestor de secretos.

Las claves se almacenan **hasheadas (SHA-256)**; nunca se guarda la clave en claro.

---

## 2. Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/v1/health` | Verificación de conexión. |
| `GET` | `/api/v1/stats` | Conteos por tabla y por modalidad. |
| `GET` | `/api/v1/registrations` | Inscripciones (emails enmascarados). |
| `GET` | `/api/v1/teams` | Equipos. |
| `GET` | `/api/v1/entregas` | Entregas de proyecto (incluye `participante`). |
| `GET` | `/api/v1/charlas` | Charlas y ponentes. |
| `GET` | `/api/v1/comunicados` | Comunicados. |
| `GET` | `/api/v1/evaluaciones` | Evaluaciones IA. |
| `GET` | `/api/v1/scores` | Puntajes de jurados. |
| `GET` | `/api/v1/encuestas` | Encuestas de feedback. |
| `GET` | `/api/v1/judges` | Jurados. |
| `GET` | `/api/v1/sponsors` | Patrocinadores. |
| `GET` | `/api/v1/logistica` | Logística. |
| `GET` | `/api/v1/presupuesto` | Presupuesto. |
| `GET` | `/api/v1/consultas` | Consultas. |
| `GET` | `/api/v1/asistencia_remota` | Asistencia remota. |

---

## 3. Paginación

Los listados aceptan:

| Parámetro | Valor por defecto | Rango |
|---|---|---|
| `limit` | `100` | 1 – 500 |
| `offset` | `0` | ≥ 0 |

La respuesta incluye `total`, `limit` y `offset`.

```http
GET /api/v1/registrations?limit=50&offset=100
```

---

## 4. Ejemplos

### 4.1 curl

```bash
curl -H "Authorization: Bearer hx_sk_TU_CLAVE" \
  https://hackathon-uneti-ia.pages.dev/api/v1/stats
```

### 4.2 JavaScript

```js
const res = await fetch(
  'https://hackathon-uneti-ia.pages.dev/api/v1/registrations?limit=50',
  { headers: { Authorization: 'Bearer hx_sk_TU_CLAVE' } }
);
const data = await res.json();
```

### 4.3 Python

```python
import requests

r = requests.get(
    'https://hackathon-uneti-ia.pages.dev/api/v1/stats',
    headers={'Authorization': 'Bearer hx_sk_TU_CLAVE'},
)
print(r.json())
```

---

## 5. Ejemplos de respuesta

### 5.1 `GET /api/v1/stats`

```json
{
  "ok": true,
  "counts": {
    "registrations": 43,
    "teams": 0,
    "entregas": 0,
    "charlas": 6,
    "comunicados": 1,
    "evaluaciones": 0,
    "scores": 0,
    "encuestas": 0,
    "judges": 0,
    "sponsors": 1,
    "logistica": 12,
    "presupuesto": 0,
    "consultas": 0,
    "asistencia_remota": 0
  },
  "por_modalidad": [
    { "modalidad": null, "c": 14 },
    { "modalidad": "remoto", "c": 29 }
  ],
  "entregas_con_repositorio": 0
}
```

### 5.2 `GET /api/v1/registrations?limit=1`

```json
{
  "ok": true,
  "recurso": "registrations",
  "total": 43,
  "limit": 1,
  "offset": 0,
  "data": [
    {
      "id": 46,
      "nombre": "Mayra",
      "apellido": "Inca",
      "correo": "m***@gmail.com",
      "nacimiento": "1999-03-30",
      "anio": "2do año",
      "created_at": "2026-11-08 00:02:21",
      "group_id": null,
      "validated": 0,
      "propuesta": null,
      "modalidad": "remoto",
      "acreditado": 0,
      "codigo": "CED8EE8A",
      "conducta": 1,
      "imagen": 1
    }
  ]
}
```

---

### 5.3 `GET /api/v1/entregas`

Cada entrega incluye el **participante** y su modalidad, cruzados automáticamente por `codigo`.

```json
{
  "ok": true,
  "recurso": "entregas",
  "total": 1,
  "limit": 100,
  "offset": 0,
  "data": [
    {
      "id": 1,
      "codigo": "ABC123",
      "proyecto": "Mi Proyecto",
      "descripcion": "Detector de deepfakes para comunicados oficiales",
      "repositorio": "https://github.com/usuario/repo",
      "demo": "https://demo.ejemplo.com",
      "video": "https://youtube.com/watch?v=...",
      "deck": "https://docs.google.com/...",
      "tags": "Python, Cloudflare, Workers AI",
      "participante": "Mayra Inca",
      "modalidad": "remoto",
      "equipo": "Equipo Alpha",
      "eje": "Ciberseguridad",
      "created_at": "2026-11-14 16:00:00",
      "updated_at": "2026-11-14 16:00:00"
    }
  ]
}
```

> 💡 El campo **`repositorio`** es la URL de GitHub/GitLab del participante.

---

## 6. Seguridad

| Medida | Detalle |
|---|---|
| **Solo lectura** | No existen endpoints de escritura. |
| **Claves hasheadas** | Se guarda `SHA-256`, nunca la clave en claro. |
| **Rate limiting** | 120 solicitudes/minuto por clave → `429`. |
| **Emails enmascarados** | `m***@gmail.com`. |
| **Tablas sensibles excluidas** | `usuarios`, `auditoria`, `errores`, `api_keys`. |
| **Campos sensibles eliminados** | `password_hash`, `validation_token`, `key_hash`. |
| **Último uso** | Se registra `last_used_at` por clave. |
| **Revocación inmediata** | Se elimina la clave desde el panel. |

---

## 7. Códigos de error

| Código | Significado |
|---|---|
| `401` | API key ausente o inválida. |
| `404` | Recurso no encontrado. |
| `429` | Límite de solicitudes excedido. |
| `500` | Error interno. |

Formato de error:

```json
{ "ok": false, "error": "API key inválida o ausente." }
```

---

## 8. Gestión de claves

| Acción | Endpoint (admin) | Método |
|---|---|---|
| Listar claves | `/api/admin/api-keys` | `GET` |
| Crear clave | `/api/admin/api-keys` | `POST` `{ "nombre": "Agente X" }` |
| Revocar clave | `/api/admin/api-keys?id=N` | `DELETE` |

> Estos endpoints requieren sesión de administrador (cookie `admin_auth`).

---

## 9. Webhooks

Además de consultar la API, tu agente puede **recibir notificaciones** cuando ocurre un evento.

### 9.1 Configuración

1. Panel admin → **Sistema → 🔑 API agentes → 🔔 Webhooks**.
2. Ingresa el nombre y la **URL HTTPS** de tu endpoint.
3. Copia el **secreto** (`whsec_…`) que se muestra una sola vez.

### 9.2 Eventos

| Evento | Cuándo se dispara |
|---|---|
| `entrega.nueva` | Cuando un participante registra o actualiza su entrega. |

### 9.3 Formato del payload

```http
POST https://tu-agente.com/webhook
Content-Type: application/json
X-Webhook-Event: entrega.nueva
X-Webhook-Signature: <hmac-sha256-hex>
```

```json
{
  "evento": "entrega.nueva",
  "enviado_en": "2026-11-14T16:00:00.000Z",
  "data": {
    "codigo": "ABC123",
    "repositorio": "https://github.com/usuario/repo",
    "proyecto": "Mi Proyecto",
    "demo": "https://demo.ejemplo.com",
    "video": "https://youtube.com/watch?v=...",
    "deck": "https://docs.google.com/...",
    "tags": "Python, Cloudflare, Workers AI",
    "descripcion": "Detector de deepfakes para comunicados oficiales"
  }
}
```

### 9.4 Verificación de la firma (Node.js)

```js
import crypto from 'node:crypto';

const raw = req.rawBody; // body CRUDO, sin parsear
const expected = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET)
  .update(raw)
  .digest('hex');

if (crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(req.headers['x-webhook-signature']))) {
  // firma válida
}
```

### 9.5 Verificación de la firma (Python)

```python
import hmac, hashlib

expected = hmac.new(
    b'WEBHOOK_SECRET',
    raw_body,
    hashlib.sha256,
).hexdigest()

if hmac.compare_digest(expected, request.headers['X-Webhook-Signature']):
    # firma válida
```

> ⚠️ La firma se calcula sobre el **cuerpo crudo** del request, no sobre el JSON re-serializado.

---

## 10. Changelog

| Versión | Fecha | Cambios |
|---|---|---|
| `v1` | 2026-11-08 | Versión inicial: solo lectura, API keys con hash, rate limit 120/min. |
