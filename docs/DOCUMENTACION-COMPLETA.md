# Hackathon UNETI IA 2026 — Documentación completa

> Plataforma oficial del **Hackathon UNETI IA 2026** (Inteligencia Artificial Ética y Ciberseguridad).
> **13 y 14 de noviembre de 2026** · Parque Tecnológico + Más Ciencia (IVIC) · Caracas, Venezuela.

---

## Índice

1. [Introducción](#1-introducción)
2. [Arquitectura](#2-arquitectura)
3. [Páginas y accesos](#3-páginas-y-accesos)
4. [Experiencia pública](#4-experiencia-pública)
5. [Panel administrativo](#5-panel-administrativo)
6. [Panel remoto del participante](#6-panel-remoto-del-participante)
7. [Unitron — Agentes IA](#7-unitron--agentes-ia)
8. [API v1 para agentes externos](#8-api-v1-para-agentes-externos)
9. [Webhooks](#9-webhooks)
10. [Seguridad](#10-seguridad)
11. [Operación y respaldos](#11-operación-y-respaldos)
12. [Base de datos](#12-base-de-datos)
13. [Changelog](#13-changelog)

---

## 1. Introducción

El Hackathon UNETI IA 2026 es un evento de **dos días** (viernes 13 y sábado 14 de noviembre de 2026) con **desarrollo continuo y pernocta** en el **Parque Tecnológico + Más Ciencia (IVIC)**.

| Dato | Valor |
|---|---|
| **Fechas** | 13 y 14 de noviembre de 2026 |
| **Sede** | Parque Tecnológico + Más Ciencia (IVIC) |
| **Salida** | Viernes 13 · 7:00 am desde Mincyt (Av. Universidad) |
| **Regreso** | Sábado 14 · 6:00 pm IVIC → Mincyt |
| **Modalidades** | Presencial y remota |
| **Ejes** | IA Ética y Responsable · Ciberseguridad |
| **Equipos** | 10 equipos de 5 integrantes |
| **Proyectos** | 40 ideas (20 por eje) |

### Patrocinadores oficiales
- Parque Tecnológico + Más Ciencia
- CAVECOM-E · Dirección Nacional de IA y Ciberseguridad
- FONACIT

---

## 2. Arquitectura

| Componente | Tecnología |
|---|---|
| **Hosting** | Cloudflare Pages |
| **Backend** | Pages Functions (`functions/`) |
| **Base de datos** | Cloudflare D1 (SQLite) |
| **Almacenamiento** | Cloudflare R2 (fotos y respaldos) |
| **IA** | Cloudflare Workers AI |
| **Correo** | SendGrid REST API |
| **Anti-bot** | Cloudflare Turnstile |
| **Auth admin** | Cookie `admin_auth` firmada con HMAC-SHA256 |

### Estructura del proyecto

```
ConvocatoriaWeb/
├── dist/                  # Sitio estático (index, admin, remoto, certificado)
│   ├── index.html         # Página pública
│   ├── admin.html         # Panel administrativo
│   ├── remoto.html        # Panel del participante remoto
│   ├── certificado.html   # Certificado imprimible
│   ├── manifest.json      # PWA
│   └── sw.js              # Service Worker (offline)
├── functions/
│   ├── _middleware.js     # Auth admin + rate limiting
│   ├── _lib/              # Utilidades (auth, mail, ratelimit, apikey, webhook)
│   └── api/               # Endpoints públicos y admin
├── migrations/            # Migraciones D1 (0001–0028)
└── wrangler.jsonc
```

---

## 3. Páginas y accesos

| Página | URL | Descripción |
|---|---|---|
| **Pública** | `/` | Convocatoria, agenda, proyectos, ranking, inscripción |
| **Admin** | `/admin` | Panel interno (roles) |
| **Remoto** | `/remoto` | Panel del participante remoto (código) |
| **Certificado** | `/certificado?codigo=XXX` | Certificado imprimible |

### Roles del panel admin

| Rol | Acceso |
|---|---|
| **admin** | Todo el panel |
| **acreditacion** | Inscripciones, acreditación, asistencia |
| **jurado** | Equipos, evaluaciones, resultados |
| **logistica** | Logística, insumos, itinerario |

### Usuarios por defecto

| Usuario | Contraseña | Rol |
|---|---|---|
| `administrador` | `Auyantepui2026**` | admin |
| `acreditacion` | `Acreditacion2026**` | acreditacion |
| `jurado` | `Jurado2026**` | jurado |
| `logistica` | `Logistica2026**` | logistica |
| `cavecome` | `Cavecome2026**` | admin |
| `parquetecnologico` | `ParqueTec2026**` | admin |
| `uneti` | `Uneti2026**` | admin |

---

## 4. Experiencia pública

### Secciones de la página principal

| # | Sección | Contenido |
|---|---|---|
| 1 | **Hero** | Título, countdown, CTA, logo, partículas |
| 2 | **Stats** | 40 proyectos · 2 días · 10 equipos · 50 participantes |
| 3 | **Video** | Video introductorio |
| 4 | **Sobre el evento** | Qué es, facts |
| 5 | **Ejes** | IA Ética · Ciberseguridad (bento) |
| 6 | **Banco de proyectos** | 40 ideas (20 + 20) |
| 7 | **Agenda** | Día 1 y Día 2 (timeline) |
| 8 | **Charlas** | 6 ponencias con ponente |
| 9 | **Premios** | 1º, 2º, 3º (bento) |
| 10 | **Proyectos entregados** | Galería pública dinámica |
| 11 | **Ranking** | Posiciones en vivo |
| 12 | **Patrocinadores** | Logos oficiales |
| 13 | **FAQ** | Preguntas frecuentes |
| 14 | **Encuesta** | Feedback NPS |
| 15 | **Contacto** | Correo, Telegram |
| 16 | **Chat Unitron** | Asistente IA flotante |

### Efectos visuales
- Gradiente animado en el hero (Bebas Neue)
- Partículas flotantes
- Tilt 3D en tarjetas
- Glow + border-beam al hover
- Contadores animados
- Scroll reveal escalonado
- Glass header
- PWA offline-first

---

## 5. Panel administrativo

### Grupos y módulos

| Grupo | Módulos |
|---|---|
| **General** | Dashboard |
| **Inscripciones** | Equipos, Participantes, Jurados, Remotos |
| **Evaluación** | Criterios, Evaluaciones, Evaluación IA, Resultados, Triaje proyectos, Encuestas |
| **Logística** | Itinerario, Logística, Insumos, Acreditación, Asistencia, Entregas, Consultas |
| **Comunicación** | Comunicados, Cartas, Instructivo Remoto, Instructivo Presencial, Metodología, Charlas, Galería |
| **Finanzas** | Presupuesto, Patrocinadores |
| **Sistema** | Auditoría, Errores, Backups, API agentes, Accesos, Agentes, Biblioteca |

### Módulos destacados

- **Dashboard**: KPIs y backup JSON.
- **Participantes**: búsqueda con contador.
- **Evaluación IA**: preselección automática con Workers AI.
- **Triaje de proyectos**: estado + recomendación + validación GitHub.
- **Encuestas**: resultados NPS (total y promedio).
- **Backups**: lista de respaldos en R2 + generación manual.
- **API agentes**: claves de solo lectura + webhooks + documentación.
- **Instructivos**: remoto y presencial (con botón copiar).

---

## 6. Panel remoto del participante

Acceso con **código de participante** (8 caracteres).

| Función | Descripción |
|---|---|
| **Entrega de proyecto** | Repositorio + demo + video + deck + tecnologías + descripción |
| **Consultas a mentores** | Envío y seguimiento |
| **Mentor Virtual (Unitron)** | Chat con IA + contexto del participante |
| **Asistencia remota** | Registro diario |
| **Progreso GitHub** | Actividad del repositorio |

---

## 7. Unitron — Agentes IA

**Unitron** es el sistema de agentes IA de la plataforma.

| Agente | Función |
|---|---|
| **Unitron Asistente** | Chatbot público (tecnologías, proyectos) |
| **Unitron Mentor** | Mentor virtual para equipos remotos |
| **🕐 Recordatorios** | Correos a equipos sin entrega |
| **📈 Monitoreo GitHub** | Actividad de repositorios |
| **🔀 Triaje de consultas** | Clasificación (logística/técnica/urgencia) |
| **🔀 Triaje de proyectos** | Estado + recomendación + validación |
| **📢 Resumen del evento** | Resumen ejecutivo |

---

## 8. API v1 para agentes externos

**Base URL:** `https://hackathon-uneti-ia.pages.dev/api/v1`

### 8.1 Autenticación

```http
Authorization: Bearer hx_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Las claves se crean en **Panel admin → Sistema → 🔑 API agentes**.

### 8.2 Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/v1/health` | Verificación de conexión |
| `GET` | `/api/v1/stats` | Conteos + `entregas_con_repositorio` + `por_modalidad` |
| `GET` | `/api/v1/registrations` | Inscripciones (emails enmascarados) |
| `GET` | `/api/v1/teams` | Equipos |
| `GET` | `/api/v1/entregas` | Entregas (incluye `participante`, `equipo`, `eje`, `repositorio`) |
| `GET` | `/api/v1/charlas` | Charlas y ponentes |
| `GET` | `/api/v1/comunicados` | Comunicados |
| `GET` | `/api/v1/evaluaciones` | Evaluaciones IA |
| `GET` | `/api/v1/scores` | Puntajes de jurados |
| `GET` | `/api/v1/encuestas` | Encuestas de feedback |
| `GET` | `/api/v1/judges` | Jurados |
| `GET` | `/api/v1/sponsors` | Patrocinadores |
| `GET` | `/api/v1/logistica` | Logística |
| `GET` | `/api/v1/presupuesto` | Presupuesto |
| `GET` | `/api/v1/consultas` | Consultas |
| `GET` | `/api/v1/asistencia_remota` | Asistencia remota |

### 8.3 Paginación

`?limit=` (1–500, por defecto 100) y `?offset=` (por defecto 0).

### 8.4 Ejemplos

```bash
curl -H "Authorization: Bearer hx_sk_TU_CLAVE" \
  https://hackathon-uneti-ia.pages.dev/api/v1/stats
```

```js
const res = await fetch('https://hackathon-uneti-ia.pages.dev/api/v1/entregas', {
  headers: { Authorization: 'Bearer hx_sk_TU_CLAVE' },
});
const data = await res.json();
```

```python
import requests
r = requests.get(
    'https://hackathon-uneti-ia.pages.dev/api/v1/entregas',
    headers={'Authorization': 'Bearer hx_sk_TU_CLAVE'},
)
print(r.json())
```

### 8.5 Respuesta — `/entregas`

```json
{
  "ok": true,
  "recurso": "entregas",
  "total": 1,
  "limit": 100,
  "offset": 0,
  "data": [
    {
      "codigo": "ABC123",
      "repositorio": "https://github.com/usuario/repo",
      "proyecto": "Mi Proyecto",
      "demo": "https://demo.ejemplo.com",
      "video": "https://youtube.com/watch?v=...",
      "deck": "https://docs.google.com/...",
      "tags": "Python, Cloudflare, Workers AI",
      "descripcion": "Detector de deepfakes para comunicados oficiales",
      "participante": "Mayra Inca",
      "modalidad": "remoto",
      "equipo": "Equipo Alpha",
      "eje": "Ciberseguridad"
    }
  ]
}
```

### 8.6 Gestión de claves (admin)

| Acción | Endpoint | Método |
|---|---|---|
| Listar | `/api/admin/api-keys` | `GET` |
| Crear | `/api/admin/api-keys` | `POST { "nombre": "Agente" }` |
| Revocar | `/api/admin/api-keys?id=N` | `DELETE` |

---

## 9. Webhooks

La plataforma notifica al agente cuando ocurre un evento.

### 9.1 Eventos

| Evento | Cuándo |
|---|---|
| `entrega.nueva` | Cuando se registra o actualiza una entrega |

### 9.2 Formato

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
    "demo": "...",
    "video": "...",
    "deck": "...",
    "tags": "...",
    "descripcion": "..."
  }
}
```

### 9.3 Verificación de la firma

**Node.js**
```js
import crypto from 'node:crypto';
const expected = crypto.createHmac('sha256', SECRETO).update(rawBody).digest('hex');
crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(req.headers['x-webhook-signature']));
```

**Python**
```python
import hmac, hashlib
expected = hmac.new(b'SECRETO', raw_body, hashlib.sha256).hexdigest()
hmac.compare_digest(expected, request.headers['X-Webhook-Signature'])
```

> ⚠️ La firma se calcula sobre el **cuerpo crudo**, no sobre el JSON re-serializado.

### 9.4 Gestión (admin)

| Acción | Endpoint | Método |
|---|---|---|
| Listar | `/api/admin/webhooks` | `GET` |
| Crear | `/api/admin/webhooks` | `POST { "url": "...", "nombre": "..." }` |
| Eliminar | `/api/admin/webhooks?id=N` | `DELETE` |

---

## 10. Seguridad

| Medida | Detalle |
|---|---|
| **Auth admin** | Cookie HMAC-SHA256 (`AUTH_SECRET`) |
| **Roles** | admin, acreditacion, jurado, logistica |
| **Contraseñas** | Hash SHA-256 + salt |
| **Turnstile** | En inscripción, entrega, consulta, patrocinio |
| **Rate limiting** | 20 req/min por IP en escrituras públicas |
| **API keys** | Hash SHA-256, solo lectura, 120 req/min |
| **Webhooks** | Firma HMAC-SHA256 + secreto único |
| **Auditoría** | Registro de mutaciones admin |
| **Datos sensibles** | Emails enmascarados en la API; tablas sensibles excluidas |
| **Cumplimiento** | Código de Conducta + cesión de imagen + aviso de privacidad |

---

## 11. Operación y respaldos

### 11.1 Respaldos

| Método | Detalle |
|---|---|
| **Manual (admin)** | Sistema → 💾 Backups → "Generar respaldo ahora" |
| **Por secreto** | `POST /api/backup-auto` con `X-Backup-Secret` |
| **Automático (GitHub Actions)** | `.github/workflows/backup.yml` (diario 6:00 UTC) |
| **Almacenamiento** | R2 (`backups/d1-*.json`) |

### 11.2 Restauración

```bash
npx wrangler d1 execute registrations --remote --file=backup.sql
```

### 11.3 Staging

```bash
npx wrangler pages deploy ./dist --branch=staging
```

### 11.4 Correo (SendGrid)

> ⚠️ El remitente `hackathon@uneti.edu.ve` debe verificarse en SendGrid (SPF/DKIM) para que los correos salgan.

---

## 12. Base de datos

Migraciones aplicadas: **0028**.

| Tabla | Contenido |
|---|---|
| `registrations` | Inscripciones + consentimientos |
| `teams` | Equipos |
| `entregas` | Entregas de proyecto |
| `charlas` | Charlas y ponentes (con currículum) |
| `comunicados` | Anuncios |
| `evaluaciones` | Evaluaciones IA |
| `scores` | Puntajes de jurados |
| `encuestas` | Feedback NPS |
| `judges` | Jurados (con teléfono) |
| `sponsors` | Patrocinadores |
| `logistica` | Logística |
| `presupuesto` | Presupuesto |
| `consultas` | Consultas |
| `asistencia_remota` | Asistencia |
| `usuarios` | Usuarios admin |
| `auditoria` | Auditoría |
| `errores` | Errores |
| `fotos` | Galería |
| `api_keys` | Claves de API |
| `webhooks` | Webhooks |
| `rate_limits` | Rate limiting |

---

## 13. Changelog

| Versión | Fecha | Cambios |
|---|---|---|
| `1.0` | 2026-11-07 | Lanzamiento inicial de la plataforma |
| `1.1` | 2026-11-07 | Unitron, UX world-class, triaje de proyectos, FONACIT |
| `1.2` | 2026-11-08 | Fase 2+3: entrega estructurada, galería, ranking, PWA, certificados, encuesta |
| `1.3` | 2026-11-08 | Fase 1: backups automáticos, rate limiting |
| `1.4` | 2026-11-08 | API v1 para agentes externos + webhooks |
| `1.5` | 2026-11-08 | Instructivo presencial, documentación completa |

---

© 2026 Hackathon UNETI IA · Comité Organizador
