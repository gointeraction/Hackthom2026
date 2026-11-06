# Hackathon UNETI IA 2026 — Plataforma de Control y Gestión

Plataforma web completa para el **Hackathon UNETI IA 2026** (Inteligencia Artificial Ética y Ciberseguridad), celebrado los días **13 y 14 de noviembre de 2026** en Caracas (Edificio MPPCT, Piso 12), con participación presencial y remota.

La plataforma cubre el **ciclo completo del evento**: convocatoria, inscripción, preselección, conformación de equipos, entrega de proyectos, evaluación, logística, acreditación, resultados y post-evento — todo integrado con **IA generativa**, **anti-bot**, **correo** y **analítica**.

---

## 1. Arquitectura

### 1.1 Visión general

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLOUDFLARE PAGES                             │
│                                                                     │
│  ┌───────────────┐   ┌───────────────┐   ┌───────────────────────┐  │
│  │  index.html   │   │  admin.html   │   │     remoto.html       │  │
│  │  (público)    │   │  (panel admin)│   │  (panel participante) │  │
│  └──────┬────────┘   └──────┬────────┘   └──────────┬────────────┘  │
│         │      fetch a /api/*      │                  │             │
│         ▼                         ▼                  ▼             │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                  PAGES FUNCTIONS (funciones/                   │  │
│  │        _middleware.js · api/* · api/admin/*                   │  │
│  └───────┬───────────────┬───────────────┬───────────────────────┘  │
│          │               │               │                          │
└──────────┼───────────────┼───────────────┼──────────────────────────┘
           ▼               ▼               ▼
   ┌──────────────┐ ┌──────────────┐ ┌─────────────────────────┐
   │  D1 (SQLite) │ │  Workers AI  │ │  Servicios externos     │
   │  15+ tablas  │ │  glm-4.7     │ │  SendGrid · Turnstile   │
   └──────────────┘ │  -flash      │ │  GitHub API · Analytics │
                    └──────────────┘ └─────────────────────────┘
```

### 1.2 Componentes

| Capa | Tecnología | Descripción |
|---|---|---|
| **Frontend público** | HTML/CSS/JS vanilla | `index.html`: convocatoria, inscripción, chatbot, comunicados |
| **Panel admin** | HTML/CSS/JS vanilla | `admin.html`: gestión completa del evento (26+ secciones) |
| **Panel remoto** | HTML/CSS/JS vanilla | `remoto.html`: panel del participante remoto |
| **Backend** | Cloudflare Pages Functions | API REST bajo `/api/*` y `/api/admin/*` |
| **Middleware** | Pages Functions | Autenticación HMAC + auditoría de mutaciones |
| **Base de datos** | Cloudflare D1 (SQLite) | 15+ tablas |
| **IA** | Workers AI (`@cf/zai-org/glm-4.7-flash`) | Chatbot, mentor virtual, evaluación, agentes |
| **Correo** | SendGrid (API REST) | Confirmaciones, códigos, recordatorios |
| **Anti-bot** | Cloudflare Turnstile | CAPTCHA en formularios y panel |
| **Analítica** | Cloudflare Web Analytics | Tráfico y Core Web Vitals |

### 1.3 Páginas

| Página | URL | Audiencia |
|---|---|---|
| Sitio público | `/` | Visitantes y participantes |
| Panel remoto | `/remoto.html` | Participantes remotos |
| Panel admin | `/admin.html` | Comité organizador (roles) |

---

## 2. Requerimientos

### 2.1 Para desplegar

- **Cuenta de Cloudflare** (gratuita es suficiente).
- **Node.js 18+** y **npm** (para instalar Wrangler).
- **Servicios opcionales**:
  - **SendGrid** (para envío de correos) + remitente verificado.
  - **Turnstile** (para anti-bot) + sitio y secreto.
  - **Web Analytics** (para métricas).

### 2.2 Dependencias

```jsonc
// package.json
{
  "devDependencies": { "wrangler": "^4.x" }
}
```
No hay dependencias de backend en tiempo de ejecución (todo usa la API REST de Cloudflare/Workers).

### 2.3 Secretos (configurar con `wrangler pages secret put`)

| Secreto | Descripción |
|---|---|
| `AUTH_SECRET` | Clave para firmar tokens de sesión admin (HMAC-SHA256) |
| `TURNSTILE_SECRET` | Secreto del widget Turnstile |
| `SENDGRID_API_KEY` | API key de SendGrid para correos |

---

## 3. Modelo de datos (D1)

| Tabla | Propósito |
|---|---|
| `registrations` | Inscritos (individual/grupal) con código de acceso |
| `teams` | Equipos conformados (código de grupo + correo de contacto) |
| `judges` | Jurados |
| `scores` | Puntajes por criterio |
| `sponsors` | Patrocinadores |
| `logistica` | Responsables, insumos y actividades |
| `evaluaciones` | Evaluación IA de propuestas (preselección) |
| `evaluador_config` | Configuración del prompt del evaluador IA |
| `presupuesto` | Ingresos y egresos |
| `auditoria` | Registro de acciones del panel |
| `errores` | Registro de errores del backend |
| `comunicados` | Anuncios públicos |
| `entregas` | Entrega de proyectos (repositorio + demo) |
| `consultas` | Consultas a mentores |
| `asistencia_remota` | Check-in de participantes remotos |

---

## 4. Funcionalidades

### 4.1 Sitio público (`/`)

- **Hero** con parallax, video intro autoplay y **cuenta regresiva**.
- **Ejes temáticos**: IA Ética y Ciberseguridad.
- **Banco de 40 proyectos** con acceso a su documentación.
- **Charlas técnicas** (DeepSeek Harness, Antigravity, Cloudflare, OpenClaw, Agentes IA, Canaima).
- **Metodología SDD** y criterios de evaluación.
- **Inscripción**:
  - Individual (siempre remota).
  - Grupal (exactamente 5 integrantes + propuesta).
  - Genera **código de acceso** (individual o de grupo) al instante.
- **Chatbot "Asistente UNETI IA"** (Workers AI) con animación de "pensando".
- **Comunicados** (tablón de anuncios).
- **Zona de participantes**: consulta de estatus + acceso al panel remoto.
- **Transmisión en vivo** (YouTube), **ubicación/mapa**, **galería**.
- **Patrocinadores** (formulario) y **aviso de privacidad**.

### 4.2 Panel remoto (`/remoto.html`)

Protegido con **Turnstile** (se muestra solo tras validar el código):

- **Mi información** (nombre, código, modalidad).
- **Entrega de proyecto** (repositorio GitHub/GitLab + demo).
- **Consulta a mentores**.
- **Registro de asistencia remota**.
- **Repositorio actual** + **progreso en GitHub** (últimos commits).
- **Mis consultas** (historial con estado).
- **Mentor Virtual**: chat IA contextual que conoce al participante y su proyecto.

### 4.3 Panel administrativo (`/admin.html`)

Agrupado en submenús:

| Grupo | Secciones |
|---|---|
| **Dashboard** | Contadores + export CSV + backup JSON |
| **Inscripciones** | Equipos, Participantes, Jurados, Remotos |
| **Evaluación** | Criterios, Evaluaciones, Evaluación IA, Resultados |
| **Logística y operación** | Itinerario, Logística, Acreditación, Asistencia remota, Entregas, Consultas |
| **Comunicación** | Comunicados, Cartas, Instructivo Remoto |
| **Finanzas** | Presupuesto, Patrocinadores |
| **Sistema** | Auditoría, Errores, Agentes, Biblioteca |

Funciones clave:
- **Evaluación IA**: preselección automática de propuestas (20 → 10 finales).
- **Acreditación**: check-in presencial por grupo.
- **Cartas**: 8 plantillas listas para copiar (patrocinio, jurado, autoridades, mentores, convocatoria, aceptación, agradecimiento, certificado).
- **Envío masivo de códigos** por correo.
- **Biblioteca**: los 40 SDD navegables.

### 4.4 Agentes IA (sección "Agentes")

| Agente | Función |
|---|---|
| 🕐 **Recordatorios** | Envía correo a quienes no han entregado su proyecto |
| 📈 **Monitoreo GitHub** | Revisa actividad reciente de los repositorios entregados |
| 🔀 **Triaje de consultas** | Clasifica consultas pendientes (logística/técnica/urgencia) |
| 📢 **Resumen del evento** | Genera resumen ejecutivo con IA |

---

## 5. Endpoints (API)

### 5.1 Públicos

| Endpoint | Método | Descripción |
|---|---|---|
| `/api/register` | POST | Inscripción individual/grupal (Turnstile) |
| `/api/chat` | POST | Chatbot (Workers AI) |
| `/api/entrega` | POST | Entrega de proyecto (código + Turnstile) |
| `/api/consulta` | POST | Consulta a mentores (código + Turnstile) |
| `/api/asistencia` | POST | Check-in remoto (correo + Turnstile) |
| `/api/estatus` | GET | Consulta de estatus por correo |
| `/api/panel-remoto` | POST | Panel remoto (código + Turnstile) |
| `/api/mentor-remoto` | POST | Mentor Virtual (código + historial) |
| `/api/sponsors` | POST | Registro de patrocinador |
| `/api/comunicados` | GET | Listar comunicados públicos |

### 5.2 Administrativos (protegidos por HMAC)

`/api/admin/login`, `/logout`, `/teams`, `/judges`, `/scores`, `/sponsors`, `/registrations`, `/logistica`, `/acreditar`, `/evaluador`, `/evaluar`, `/seleccion`, `/resultados`, `/resumen`, `/export`, `/backup`, `/presupuesto`, `/auditoria`, `/errores`, `/comunicados`, `/consultas`, `/entregas`, `/asistencia`, `/remotos`, `/agente-recordatorios`, `/agente-github`, `/agente-triaje`, `/agente-resumen`, `/enviar-codigos`.

---

## 6. Seguridad

- **Autenticación**: token firmado con **HMAC-SHA256** (secreto `AUTH_SECRET`), con caducidad de 24h.
- **Roles**: `admin`, `acreditacion`, `jurado`, `logistica` con vistas acotadas.
- **Anti-bot**: Cloudflare **Turnstile** en formularios públicos y en el panel remoto.
- **Auditoría**: registro de todas las mutaciones del panel.
- **Errores**: registro de fallos del backend.
- **Backup**: export JSON de las 15+ tablas.
- **Secrets**: nunca en el código (vía `wrangler secret`).

---

## 7. Usuarios y roles

| Usuario | Contraseña (por defecto) | Rol |
|---|---|---|
| `administrador` | `Auyantepui2026**` | Acceso total |
| `acreditacion` | `Acreditacion2026**` | Solo Acreditación |
| `jurado` | `Jurado2026**` | Solo Evaluaciones |
| `logistica` | `Logistica2026**` | Solo Logística |

> ⚠️ Cambia las contraseñas en `functions/api/admin/login.js` antes de un evento real.

---

## 8. Despliegue

```bash
cd ConvocatoriaWeb
npm install
npx wrangler login

# 1. Crear D1 y actualizar database_id en wrangler.jsonc
npx wrangler d1 create registrations

# 2. Aplicar migraciones
npx wrangler d1 migrations apply registrations --remote

# 3. Configurar secretos
npx wrangler pages secret put AUTH_SECRET
npx wrangler pages secret put TURNSTILE_SECRET
npx wrangler pages secret put SENDGRID_API_KEY

# 4. Desplegar
npx wrangler pages deploy ./dist
```

---

## 9. Migraciones

Las migraciones de D1 están en `ConvocatoriaWeb/migrations/` (0001 a 0017):

- 0001–0010: tablas base (registrations, teams, judges, scores, sponsors, logistica, evaluador_config, evaluaciones).
- 0011: presupuesto.
- 0012: auditoria.
- 0013: comunicados, entregas, consultas, asistencia_remota, teams.codigo.
- 0014: teams.contacto_email.
- 0015: codigo en registrations y consultas.
- 0016: entregas redefinida (codigo único).
- 0017: errores.

---

## 10. Licencia

Proyecto educativo del **Hackathon UNETI IA 2026** · Universidad Nacional Experimental de las Telecomunicaciones e Informática (UNETI).
