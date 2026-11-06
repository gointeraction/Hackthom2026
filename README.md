# Hackathon UNETI IA 2026 — Plataforma

Plataforma web completa del **Hackathon UNETI IA 2026** (IA Ética y Ciberseguridad, 13 y 14 de noviembre, Caracas).

- **Sitio público** (convocatoria, inscripción, chatbot, comunicados, panel remoto).
- **Panel de administración** (participantes, equipos, evaluación, logística, presupuesto, agentes IA, biblioteca).
- **Backend** en Cloudflare Pages Functions + D1 + Workers AI + SendGrid + Turnstile.

## 📁 Estructura

```
HackatonUNETI/
├── ConvocatoriaWeb/          ← Proyecto Cloudflare Pages (desplegable)
│   ├── dist/                 ← Sitio estático (index.html, admin.html, remoto.html, sdd/)
│   ├── functions/            ← Pages Functions (API + middleware)
│   ├── migrations/           ← Migraciones de D1
│   ├── wrangler.jsonc        ← Configuración de Wrangler
│   └── package.json
├── Proyectos_SDD/            ← 40 documentos SDD (biblioteca de proyectos)
└── *.md                      ← Documentación del evento
```

## 🚀 Desplegar en cualquier cuenta de Cloudflare

### 1. Prerrequisitos
- Node.js 18+.
- Cuenta de Cloudflare.

### 2. Instalar y autenticar
```bash
cd ConvocatoriaWeb
npm install
npx wrangler login
```

### 3. Crear la base de datos D1
```bash
npx wrangler d1 create registrations
```
Copia el `database_id` que devuelve y **reemplázalo** en `wrangler.jsonc`:
```jsonc
"d1_databases": [{
  "binding": "DB",
  "database_name": "registrations",
  "database_id": "PON_AQUI_EL_NUEVO_ID",
  "migrations_dir": "migrations"
}]
```

### 4. Aplicar migraciones
```bash
npx wrangler d1 migrations apply registrations --remote
```

### 5. Configurar secretos
```bash
npx wrangler pages secret put AUTH_SECRET
npx wrangler pages secret put TURNSTILE_SECRET
npx wrangler pages secret put SENDGRID_API_KEY
```
*(Cada comando te pedirá el valor por stdin.)*

- `AUTH_SECRET`: cualquier cadena aleatoria (para firmar los tokens de sesión admin).
- `TURNSTILE_SECRET`: el secreto del widget Turnstile (si usas anti-bot).
- `SENDGRID_API_KEY`: la API key de SendGrid (para correos; opcional si no envías correo).

### 6. Desplegar
```bash
npx wrangler pages deploy ./dist
```

## 🔑 Usuarios del panel admin
| Usuario | Contraseña | Rol |
|---|---|---|
| `administrador` | `Auyantepui2026**` | Total |
| `acreditacion` | `Acreditacion2026**` | Acreditación |
| `jurado` | `Jurado2026**` | Evaluaciones |
| `logistica` | `Logistica2026**` | Logística |

> ⚠️ Cambia estas contraseñas en `functions/api/admin/login.js` antes de un evento real.

## 🤖 Integraciones
- **Workers AI** (modelo `@cf/zai-org/glm-4.7-flash`): chatbot, mentor virtual, evaluación IA y agentes.
- **SendGrid**: envío de correos (confirmación, códigos, recordatorios).
- **Turnstile**: anti-bot en formularios.

## 📄 Licencia
Proyecto educativo del Hackathon UNETI IA 2026.
