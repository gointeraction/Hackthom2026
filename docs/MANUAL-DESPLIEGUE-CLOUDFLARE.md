# Manual de despliegue en Cloudflare con Wrangler CLI

> Guía paso a paso para desplegar la plataforma del **Hackathon UNETI IA 2026** desde cero usando **Wrangler CLI**.
> Al final tendrás: sitio público, panel admin, panel remoto, base de datos D1, almacenamiento R2, IA (Workers AI) y correos.

---

## Índice

1. [Requisitos previos](#1-requisitos-previos)
2. [Instalar Wrangler](#2-instalar-wrangler)
3. [Iniciar sesión en Cloudflare](#3-iniciar-sesión-en-cloudflare)
4. [Obtener el proyecto](#4-obtener-el-proyecto)
5. [Crear la base de datos D1](#5-crear-la-base-de-datos-d1)
6. [Aplicar las migraciones](#6-aplicar-las-migraciones)
7. [Crear el bucket R2](#7-crear-el-bucket-r2)
8. [Configurar `wrangler.jsonc`](#8-configurar-wranglerjsonc)
9. [Habilitar Workers AI](#9-habilitar-workers-ai)
10. [Configurar Turnstile](#10-configurar-turnstile)
11. [Configurar los secretos](#11-configurar-los-secretos)
12. [Crear el proyecto de Pages](#12-crear-el-proyecto-de-pages)
13. [Desplegar](#13-desplegar)
14. [Verificar el despliegue](#14-verificar-el-despliegue)
15. [Crear el usuario administrador](#15-crear-el-usuario-administrador)
16. [CI/CD con GitHub Actions (opcional)](#16-cicd-con-github-actions-opcional)
17. [Comandos útiles](#17-comandos-útiles)
18. [Solución de problemas](#18-solución-de-problemas)

---

## 1. Requisitos previos

| Requisito | Versión mínima | Verificación |
|---|---|---|
| **Node.js** | 18 LTS o superior | `node -v` |
| **npm** | 9 o superior | `npm -v` |
| **Git** | 2.30 o superior | `git --version` |
| **Cuenta Cloudflare** | Plan gratuito o superior | https://dash.cloudflare.com |
| **Editor de código** | VS Code, Cursor, etc. | — |

> ⚠️ **Workers AI** requiere que el plan de Cloudflare tenga el servicio habilitado (el plan gratuito incluye una cuota diaria).

---

## 2. Instalar Wrangler

### Opción A — Global (recomendada)

```bash
npm install -g wrangler
wrangler --version
```

### Opción B — Sin instalar (usar `npx`)

```bash
npx wrangler --version
```

> En el resto del manual se usa `npx wrangler`. Si lo instalaste global, puedes omitir el `npx`.

---

## 3. Iniciar sesión en Cloudflare

```bash
npx wrangler login
```

Se abrirá el navegador para autorizar. Al terminar:

```bash
npx wrangler whoami
```

Deberías ver tu cuenta y el **Account ID**:

```
┌─────────────────────────────────┬──────────────────────────────────┐
│ Account Name                    │ Account ID                       │
├─────────────────────────────────┼──────────────────────────────────┤
│ Mi Cuenta                       │ 3ffd353a2bc41b0cc9a9628dd72dcdd3 │
└─────────────────────────────────┴──────────────────────────────────┘
```

### Guardar el Account ID

**Windows (PowerShell):**
```powershell
$env:CLOUDFLARE_ACCOUNT_ID = "TU_ACCOUNT_ID"
```

**macOS / Linux:**
```bash
export CLOUDFLARE_ACCOUNT_ID="TU_ACCOUNT_ID"
```

> 💡 Si tienes varias cuentas, el Account ID es obligatorio para todas las operaciones.

---

## 4. Obtener el proyecto

```bash
git clone https://github.com/gointeraction/Hackthom2026.git
cd Hackthom2026/ConvocatoriaWeb
```

### Estructura del proyecto

```
ConvocatoriaWeb/
├── dist/                 ← sitio estático (HTML, CSS, JS, logos)
│   ├── index.html        ← página pública
│   ├── admin.html        ← panel administrativo
│   ├── remoto.html       ← panel de participantes remotos
│   └── certificado.html  ← certificados
├── functions/            ← backend (Cloudflare Pages Functions)
│   ├── _middleware.js    ← autenticación, rate limit, envíos programados
│   ├── _lib/             ← utilidades (auth, mail, webhook, etc.)
│   └── api/              ← endpoints públicos, admin y v1
├── migrations/           ← migraciones D1 (0001 … 0038)
├── wrangler.jsonc        ← configuración de Cloudflare
└── package.json
```

### Instalar dependencias

```bash
npm install
```

---

## 5. Crear la base de datos D1

```bash
npx wrangler d1 create registrations
```

Salida esperada:

```
✅ Successfully created DB 'registrations' in region WEUR
Created your new D1 Database.

[[d1_databases]]
binding = "DB"
database_name = "registrations"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 📌 Guarda el `database_id`

Lo necesitarás en el paso 8.

```bash
npx wrangler d1 list
```

---

## 6. Aplicar las migraciones

Las migraciones crean todas las tablas (inscripciones, equipos, jurados, mentores, tickets, invitados, etc.).

### Primero en local (opcional, para probar)

```bash
npx wrangler d1 migrations apply registrations --local
```

### Luego en producción

```bash
npx wrangler d1 migrations apply registrations --remote
```

Salida esperada:

```
┌──────────────────────────────────┬──────────┐
│ 0001_init.sql                    │ ✅       │
│ 0002_teams.sql                   │ ✅       │
│ …                                │          │
│ 0038_envios_programados.sql      │ ✅       │
└──────────────────────────────────┴──────────┘
```

### Verificar las tablas

```bash
npx wrangler d1 execute registrations --remote --command "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
```

Deberías ver: `registrations`, `teams`, `judges`, `scores`, `entregas`, `mentores`, `tickets`, `invitados`, `usuarios`, `auditoria`, etc.

---

## 7. Crear el bucket R2

Se usa para las fotos de la galería.

```bash
npx wrangler r2 bucket create hackathon-fotos
```

Verificar:

```bash
npx wrangler r2 bucket list
```

---

## 8. Configurar `wrangler.jsonc`

Abre `ConvocatoriaWeb/wrangler.jsonc` y reemplaza el `database_id` por el tuyo:

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "hackathon-uneti-ia",
  "pages_build_output_dir": "./dist",
  "compatibility_date": "2026-01-01",
  "ai": { "binding": "AI" },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "registrations",
      "database_id": "TU_DATABASE_ID_AQUI",
      "migrations_dir": "migrations"
    }
  ],
  "r2_buckets": [
    { "binding": "FOTOS", "bucket_name": "hackathon-fotos" }
  ]
}
```

### Tabla de bindings

| Binding | Tipo | Uso |
|---|---|---|
| `DB` | D1 | Base de datos principal |
| `AI` | Workers AI | Agente Unitron, evaluación IA, triaje |
| `FOTOS` | R2 | Galería de fotos |

> ⚠️ El `name` debe coincidir con el nombre del proyecto de Pages (paso 12).

---

## 9. Habilitar Workers AI

1. Entra al [dashboard de Cloudflare](https://dash.cloudflare.com).
2. Ve a **Workers & Pages → AI**.
3. Acepta los términos del servicio.
4. Verifica que el binding `AI` esté disponible.

> El código usa el modelo `@cf/zai-org/glm-4.7-flash` para Unitron y la evaluación IA.

---

## 10. Configurar Turnstile

Turnstile protege los formularios públicos (inscripción, entrega, consultas, chat).

### 10.1 Crear el widget

1. Dashboard → **Turnstile → Add widget**.
2. **Nombre:** `Hackathon UNETI IA`
3. **Hostnames:** `hackathon-uneti-ia.pages.dev` (y tu dominio propio si lo tienes).
4. **Widget mode:** Managed.
5. Guarda.

Obtendrás:
- **Site Key** (pública): `0x4AAAAAAA...`
- **Secret Key** (privada): `0x4AAAAAAA...`

### 10.2 Actualizar el Site Key en el HTML

Busca `data-sitekey` en los archivos de `dist/` y reemplaza por tu Site Key:

```bash
grep -rl "0x4AAAAAAFvMBBNAnUeH11ix" dist/
```

Archivos afectados: `index.html`, `remoto.html`, `admin.html`.

```html
<div class="cf-turnstile" data-sitekey="TU_SITE_KEY" data-action="register"></div>
```

### 10.3 Guardar el Secret

Lo harás en el paso 11 (`TURNSTILE_SECRET`).

> ⚠️ El backend valida que el `hostname` sea `hackathon-uneti-ia.pages.dev`. Si usas otro dominio, actualiza esa validación en `functions/api/register.js`, `entrega.js`, `consulta.js`, `chat.js`, `encuesta.js`, `sponsors.js`, `asistencia.js` y `panel-remoto.js`.

---

## 11. Configurar los secretos

Los secretos **no** van en el código; se guardan cifrados en Cloudflare.

### 11.1 Generar valores

**AUTH_SECRET** (clave de firma de sesiones y contraseñas):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**BACKUP_SECRET** (para el endpoint de respaldo y el cron de correos):

```bash
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
```

### 11.2 Cargar los secretos

Ejecuta cada comando y pega el valor cuando lo pida:

```bash
npx wrangler pages secret put AUTH_SECRET --project-name hackathon-uneti-ia
npx wrangler pages secret put BACKUP_SECRET --project-name hackathon-uneti-ia
npx wrangler pages secret put TURNSTILE_SECRET --project-name hackathon-uneti-ia
npx wrangler pages secret put SENDGRID_API_KEY --project-name hackathon-uneti-ia
```

### 11.3 Tabla de secretos

| Secreto | Obligatorio | Descripción |
|---|---|---|
| `AUTH_SECRET` | ✅ | Firma HMAC de sesiones admin y hash de contraseñas |
| `TURNSTILE_SECRET` | ✅ | Verificación anti-bot |
| `SENDGRID_API_KEY` | ⚠️ Recomendado | Envío de correos (si falta, los correos se omiten) |
| `BACKUP_SECRET` | ⚠️ Recomendado | Respaldo automático y envíos programados |
| `MAIL_FROM` | ❌ Opcional | Remitente (por defecto `hackathon@uneti.edu.ve`) |

### 11.4 Verificar

```bash
npx wrangler pages secret list --project-name hackathon-uneti-ia
```

---

## 12. Crear el proyecto de Pages

```bash
npx wrangler pages project create hackathon-uneti-ia --production-branch main
```

Salida esperada:

```
✨ Successfully created the 'hackathon-uneti-ia' project.
```

> Si el proyecto ya existe, este paso falla; puedes continuar.

### Configurar el dominio (opcional)

```bash
npx wrangler pages domain add hackathon.tudominio.com --project-name hackathon-uneti-ia
```

---

## 13. Desplegar

```bash
npx wrangler pages deploy ./dist --project-name hackathon-uneti-ia --branch main
```

Salida esperada:

```
✨ Deployment complete! Take a peek over at https://abc12345.hackathon-uneti-ia.pages.dev
```

### ✅ Tu sitio queda en:

```
https://hackathon-uneti-ia.pages.dev
```

| Recurso | URL |
|---|---|
| Página pública | `https://hackathon-uneti-ia.pages.dev/` |
| Panel admin | `https://hackathon-uneti-ia.pages.dev/admin` |
| Panel remoto | `https://hackathon-uneti-ia.pages.dev/remoto` |
| Certificado | `https://hackathon-uneti-ia.pages.dev/certificado?codigo=XXX` |

---

## 14. Verificar el despliegue

### 14.1 Endpoints públicos

```bash
curl https://hackathon-uneti-ia.pages.dev/api/comunicados
curl https://hackathon-uneti-ia.pages.dev/api/charlas
curl https://hackathon-uneti-ia.pages.dev/api/proyectos
```

Cada uno debe responder `{"ok":true,...}`.

### 14.1b API v1 (requiere clave)

```bash
curl -H "Authorization: Bearer hx_sk_TU_CLAVE" \
  https://hackathon-uneti-ia.pages.dev/api/v1/health
```

Sin la clave responde `401 {"ok":false,"error":"API key inválida o ausente."}` — eso confirma que está protegida.

### 14.2 Endpoints protegidos (deben devolver 401)

```bash
curl -i https://hackathon-uneti-ia.pages.dev/api/admin/registrations
```

Debe responder `HTTP 401`.

### 14.3 Base de datos

```bash
npx wrangler d1 execute registrations --remote --command "SELECT COUNT(*) AS total FROM registrations;"
```

---

## 15. Crear el usuario administrador

### 15.1 Generar el hash de la contraseña

La contraseña se guarda como `HMAC-SHA256(AUTH_SECRET, "password:" + contraseña)` en hexadecimal.

```bash
node -e "const c=require('crypto');console.log(c.createHmac('sha256','TU_AUTH_SECRET').update('password:'+'TU_CONTRASEÑA').digest('hex'))"
```

Ejemplo de salida:

```
99475e9251d7fbf25b6ee2cec63d65c62872f32fe04b38c6954ecce0d83c8951
```

### 15.2 Insertar el usuario

```bash
npx wrangler d1 execute registrations --remote --command "INSERT INTO usuarios (username, password_hash, role) VALUES ('administrador', 'EL_HASH_GENERADO', 'admin');"
```

### 15.3 Roles disponibles

| Rol | Acceso |
|---|---|
| `admin` | Todo el panel |
| `acreditacion` | Solo acreditación |
| `jurado` | Equipos, evaluaciones, resultados |
| `logistica` | Logística, insumos, tickets |

### 15.4 Probar el login

Abre `https://hackathon-uneti-ia.pages.dev/admin` e ingresa:
- **Usuario:** `administrador`
- **Contraseña:** la que usaste en el hash

---

## 16. CI/CD con GitHub Actions (opcional)

### 16.1 Agregar los secretos al repositorio

En GitHub → **Settings → Secrets and variables → Actions**, agrega:

| Secreto | Valor |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Token de API con permiso **Cloudflare Pages: Edit** |
| `CLOUDFLARE_ACCOUNT_ID` | Tu Account ID |
| `BACKUP_SECRET` | El mismo valor de Cloudflare |

### 16.2 Crear el token de API

Dashboard → **My Profile → API Tokens → Create Token** → plantilla **Edit Cloudflare Workers** → agrega permiso **Cloudflare Pages: Edit**.

### 16.3 Workflows incluidos

| Workflow | Función | Cron |
|---|---|---|
| `backup.yml` | Respaldo diario de D1 | `0 6 * * *` (06:00 UTC) |
| `instructivo-remoto.yml` | Envío del instructivo a remotos | `0 23 11 11 *` (11 nov · 19:00 VE) |

### 16.4 Despliegue automático (opcional)

Puedes conectar el repositorio a Pages para que despliegue en cada push:
Dashboard → **Pages → Tu proyecto → Settings → Build & deployments → Connect to Git**.

---

## 17. Comandos útiles

### Base de datos

```bash
# Consultar
npx wrangler d1 execute registrations --remote --command "SELECT * FROM registrations LIMIT 5;"

# Exportar respaldo
npx wrangler d1 export registrations --remote --output=backup.sql

# Ver migraciones aplicadas
npx wrangler d1 migrations list registrations --remote
```

### R2

```bash
npx wrangler r2 object list hackathon-fotos
npx wrangler r2 object get hackathon-fotos/foto.jpg --file=foto.jpg
```

### Pages

```bash
# Ver despliegues
npx wrangler pages deployment list --project-name hackathon-uneti-ia

# Ver logs en vivo
npx wrangler pages deployment tail --project-name hackathon-uneti-ia

# Volver a un despliegue anterior
npx wrangler pages deployment create --project-name hackathon-uneti-ia
```

### Secretos

```bash
npx wrangler pages secret list --project-name hackathon-uneti-ia
npx wrangler pages secret put NOMBRE --project-name hackathon-uneti-ia
npx wrangler pages secret delete NOMBRE --project-name hackathon-uneti-ia
```

---

## 18. Solución de problemas

| Error | Causa | Solución |
|---|---|---|
| `Authentication error [code: 10000]` | Sesión expirada | `npx wrangler login` de nuevo |
| `Could not find D1 database` | `database_id` incorrecto | Revisa `wrangler.jsonc` |
| `No migrations to apply` | Ya están aplicadas | Normal |
| `AI binding not found` | Workers AI no habilitado | Actívalo en el dashboard |
| `TURNSTILE_SECRET not set` | Falta el secreto | `wrangler pages secret put` |
| `hostname mismatch` | Dominio distinto al configurado | Actualiza la validación en los endpoints |
| `401 en /api/admin/*` | Sin sesión o rol inválido | Inicia sesión en `/admin` |
| `403 Código inválido` | Código no existe en D1 | Verifica `registrations.codigo` |
| `202 sin correo recibido` | Remitente no verificado en SendGrid | Verifica el dominio en SendGrid |
| `Deployment failed` | Archivo faltante en `dist/` | Revisa el log del deploy |

### Ver logs de una función

```bash
npx wrangler pages deployment tail --project-name hackathon-uneti-ia --format pretty
```

### Revisar errores en el panel

`/admin` → **Sistema → 🐞 Errores** (registra los últimos 200 errores del backend).

---

## Anexo: checklist de despliegue

- [ ] Node.js 18+ instalado
- [ ] Wrangler instalado
- [ ] `wrangler login` completado
- [ ] `CLOUDFLARE_ACCOUNT_ID` configurado
- [ ] Repositorio clonado
- [ ] `npm install` ejecutado
- [ ] D1 creada (`registrations`)
- [ ] `database_id` copiado a `wrangler.jsonc`
- [ ] Migraciones aplicadas (`--remote`)
- [ ] Bucket R2 creado (`hackathon-fotos`)
- [ ] Workers AI habilitado
- [ ] Turnstile creado (sitekey + secret)
- [ ] Sitekey actualizado en `dist/*.html`
- [ ] `AUTH_SECRET` generado y cargado
- [ ] `TURNSTILE_SECRET` cargado
- [ ] `SENDGRID_API_KEY` cargado
- [ ] `BACKUP_SECRET` cargado
- [ ] Proyecto de Pages creado
- [ ] Deploy ejecutado
- [ ] `/api/comunicados` responde 200
- [ ] `/api/admin/*` responde 401 sin sesión
- [ ] Usuario admin creado
- [ ] Login en `/admin` funciona
- [ ] Secrets de GitHub configurados (opcional)

---

## Anexo: resumen de comandos

```bash
# 1. Instalar
npm install -g wrangler

# 2. Login
wrangler login

# 3. Proyecto
git clone https://github.com/gointeraction/Hackthom2026.git
cd Hackthom2026/ConvocatoriaWeb
npm install

# 4. D1
wrangler d1 create registrations
# → copiar database_id a wrangler.jsonc
wrangler d1 migrations apply registrations --remote

# 5. R2
wrangler r2 bucket create hackathon-fotos

# 6. Secretos
wrangler pages secret put AUTH_SECRET --project-name hackathon-uneti-ia
wrangler pages secret put TURNSTILE_SECRET --project-name hackathon-uneti-ia
wrangler pages secret put SENDGRID_API_KEY --project-name hackathon-uneti-ia
wrangler pages secret put BACKUP_SECRET --project-name hackathon-uneti-ia

# 7. Pages
wrangler pages project create hackathon-uneti-ia --production-branch main
wrangler pages deploy ./dist --project-name hackathon-uneti-ia --branch main

# 8. Admin
node -e "const c=require('crypto');console.log(c.createHmac('sha256','AUTH_SECRET').update('password:'+'CONTRASEÑA').digest('hex'))"
wrangler d1 execute registrations --remote --command "INSERT INTO usuarios (username, password_hash, role) VALUES ('administrador','HASH','admin');"
```

---

© 2026 Hackathon UNETI IA · Comité Organizador
