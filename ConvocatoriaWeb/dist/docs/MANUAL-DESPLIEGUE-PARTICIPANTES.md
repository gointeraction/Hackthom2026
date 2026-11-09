# Manual de despliegue para participantes — Cloudflare + Wrangler CLI

> Guía para que **tú mismo** crees tu cuenta en Cloudflare y despliegues tu proyecto del **Hackathon UNETI IA 2026** usando la arquitectura de Cloudflare.
>
> **Regla de oro del evento:** *spec primero, código después*. Antes de escribir una línea de código (o de pedírsela a una IA), **debes especificar tu proyecto y declarar cómo usarás la IA**.

---

## Índice

1. [Paso 0 — Especifica tu proyecto ANTES de programar](#paso-0--especifica-tu-proyecto-antes-de-programar)
2. [Paso 1 — Crea tu cuenta en Cloudflare](#paso-1--crea-tu-cuenta-en-cloudflare)
3. [Paso 2 — Instala Wrangler](#paso-2--instala-wrangler)
4. [Paso 3 — Crea tu proyecto](#paso-3--crea-tu-proyecto)
5. [Paso 4 — Elige tu arquitectura Cloudflare](#paso-4--elige-tu-arquitectura-cloudflare)
6. [Paso 5 — Base de datos D1](#paso-5--base-de-datos-d1)
7. [Paso 6 — Workers AI](#paso-6--workers-ai)
8. [Paso 7 — KV, R2 y otros servicios](#paso-7--kv-r2-y-otros-servicios)
9. [Paso 8 — Secretos](#paso-8--secretos)
10. [Paso 9 — Desarrollo local](#paso-9--desarrollo-local)
11. [Paso 10 — Despliega](#paso-10--despliega)
12. [Paso 11 — Verifica](#paso-11--verifica)
13. [Paso 12 — Entrega](#paso-12--entrega)
14. [Límites del plan gratuito](#límites-del-plan-gratuito)
15. [Solución de problemas](#solución-de-problemas)

---

## Paso 0 — Especifica tu proyecto ANTES de programar

> 🛑 **No empieces a programar todavía.** El jurado evalúa la **claridad de tu especificación** y la **ética de tu uso de IA**.

### 0.1 Crea tu `SPEC.md`

En la raíz de tu proyecto, crea un archivo `SPEC.md` con esta plantilla:

```markdown
# SPEC — [Nombre de tu proyecto]

## 1. Problema
¿Qué problema real del sector público venezolano resuelve?
(2–3 párrafos, con datos o evidencia)

## 2. Usuarios
¿Quiénes lo usarán? (funcionarios, ciudadanos, instituciones)

## 3. Alcance del MVP
¿Qué SÍ hará en las 48 horas?
¿Qué NO hará? (fuera de alcance)

## 4. Requisitos funcionales
- RF1: ...
- RF2: ...
- RF3: ...

## 5. Criterios de aceptación
- CA1: Dado [contexto], cuando [acción], entonces [resultado medible]
- CA2: ...

## 6. Arquitectura
- Frontend: ...
- Backend: ...
- Base de datos: ...
- IA: ...
- Servicios Cloudflare usados: ...

## 7. Modelo de datos
(tablas y campos principales)

## 8. Uso de IA (obligatorio)
- **¿Qué modelo usas?** (ej. `@cf/zai-org/glm-4.7-flash`, Llama, etc.)
- **¿Para qué lo usas?** (clasificación, generación, resumen, detección…)
- **¿Qué datos le envías?** (¿hay datos personales?)
- **¿Cómo mitigas sesgos?**
- **¿Cómo explicas sus decisiones al usuario?**
- **¿Qué hace la IA y qué hace el humano?**

## 9. Ética y privacidad
- Datos personales tratados:
- Consentimiento:
- Retención:
- Riesgos identificados y mitigación:

## 10. Métricas de éxito
¿Cómo sabrás que funciona?
```

### 0.2 Declara tu uso de IA

> ⚠️ **Obligatorio.** El jurado evalúa el criterio **"Innovación y uso de IA" (20%)** y **"Ética y responsabilidad de la IA" (10%)**.

Responde en tu `SPEC.md`:

| Pregunta | Tu respuesta |
|---|---|
| ¿Usas IA en tu solución? | Sí / No |
| ¿Qué modelo y por qué? | |
| ¿Qué problema resuelve la IA? | |
| ¿Qué datos procesa? | |
| ¿Cómo evitas sesgos? | |
| ¿Cómo explicas las decisiones? | |
| ¿Qué decides tú y qué decide la IA? | |
| ¿Usaste IA para programar? | Sí / No |
| ¿Qué herramientas? | (DeepSeek Harness, Antigravity, Copilot, Claude…) |

### 0.3 Regla de oro

```
1. Escribes la especificación
2. Defines los criterios de aceptación
3. La IA genera el código a partir de la spec
4. Verificas contra los criterios
5. Si falla → actualizas la spec y regeneras
```

> ❌ **No** pidas código a la IA sin spec.
> ✅ **Sí** usa la spec como contexto de la IA.

---

## Paso 1 — Crea tu cuenta en Cloudflare

1. Ve a **https://dash.cloudflare.com/sign-up**
2. Regístrate con tu correo (puedes usar el de la universidad).
3. Verifica tu correo.
4. Entra al dashboard.

### 1.1 Plan gratuito

El plan **Free** incluye:

| Servicio | Límite gratuito |
|---|---|
| **Workers** | 100.000 requests/día |
| **Pages** | Ilimitado (sitios estáticos) |
| **D1** | 5 GB de almacenamiento |
| **KV** | 100.000 lecturas/día · 1.000 escrituras/día |
| **R2** | 10 GB de almacenamiento |
| **Workers AI** | 10.000 neurons/día (suficiente para un MVP) |
| **Vectorize** | 30.000 vectores |

> 💡 **No necesitas tarjeta de crédito** para el plan gratuito.

---

## Paso 2 — Instala Wrangler

### Requisitos

```bash
node -v   # 18 o superior
npm -v    # 9 o superior
```

### Instalar

```bash
npm install -g wrangler
wrangler --version
```

### Iniciar sesión

```bash
wrangler login
```

Se abre el navegador → autoriza → listo.

```bash
wrangler whoami
```

Deberías ver tu correo y tu **Account ID**.

---

## Paso 3 — Crea tu proyecto

### Opción A — Página web (Pages + Functions) ⭐ recomendada

```bash
npm create cloudflare@latest mi-proyecto -- --framework=react
```

O sin framework:

```bash
npm create cloudflare@latest mi-proyecto -- --type=web-app
```

Estructura:

```
mi-proyecto/
├── src/            ← tu código
├── functions/      ← backend (API)
├── public/         ← assets estáticos
├── wrangler.jsonc  ← configuración
└── package.json
```

### Opción B — API / Worker

```bash
npm create cloudflare@latest mi-api -- --type=hello-world
```

Genera:

```
mi-api/
├── src/index.ts
├── wrangler.jsonc
└── package.json
```

### Opción C — Proyecto vacío

```bash
npm create cloudflare@latest mi-proyecto -- --type=hello-world
```

### Entrar al proyecto

```bash
cd mi-proyecto
npm install
```

---

## Paso 4 — Elige tu arquitectura Cloudflare

### 4.1 Comparativa rápida

| Necesitas | Usa | Binding |
|---|---|---|
| Página web / SPA | **Pages** | — |
| API / lógica en el edge | **Workers** | — |
| Base de datos SQL | **D1** | `DB` |
| Datos clave-valor / caché | **KV** | `KV` |
| Archivos (imágenes, PDFs) | **R2** | `BUCKET` |
| IA generativa | **Workers AI** | `AI` |
| Búsqueda semántica | **Vectorize** | `VECTORIZE` |
| Tareas asíncronas | **Queues** | `QUEUE` |
| Estado en tiempo real | **Durable Objects** | `DO` |

### 4.2 Arquitectura recomendada para el hackathon

```
┌─────────────────────────────────────────────┐
│  Frontend (Pages)                           │
│  HTML + CSS + JS                            │
└──────────────────┬──────────────────────────┘
                   │ fetch
┌──────────────────▼──────────────────────────┐
│  API (Pages Functions / Workers)            │
│  /api/*                                     │
└──────────────────┬──────────────────────────┘
                   │ bindings
     ┌─────────────┼─────────────┐
     ▼             ▼             ▼
   ┌────┐       ┌────┐       ┌──────┐
   │ D1 │       │ KV │       │  AI  │
   └────┘       └────┘       └──────┘
```

### 4.3 Ejemplo mínimo de Worker

`src/index.js`:

```js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return Response.json({ ok: true, time: new Date().toISOString() });
    }

    return new Response('Hola desde Cloudflare Workers 👋', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  },
};
```

`wrangler.jsonc`:

```jsonc
{
  "name": "mi-api",
  "main": "src/index.js",
  "compatibility_date": "2026-01-01"
}
```

---

## Paso 5 — Base de datos D1

### 5.1 Crear la base

```bash
wrangler d1 create mi-db
```

Copia el `database_id` que aparece.

### 5.2 Configurar el binding

En `wrangler.jsonc`:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "mi-db",
      "database_id": "TU_DATABASE_ID"
    }
  ]
}
```

### 5.3 Crear las tablas

Crea `schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS reportes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  creado_en TEXT DEFAULT CURRENT_TIMESTAMP
);
```

Aplícalo:

```bash
# Local
wrangler d1 execute mi-db --local --file=schema.sql

# Producción
wrangler d1 execute mi-db --remote --file=schema.sql
```

### 5.4 Usar D1 en tu Worker

```js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/reportes' && request.method === 'GET') {
      const { results } = await env.DB.prepare(
        'SELECT * FROM reportes ORDER BY id DESC LIMIT 50'
      ).all();
      return Response.json({ ok: true, reportes: results });
    }

    if (url.pathname === '/api/reportes' && request.method === 'POST') {
      const body = await request.json();
      await env.DB.prepare(
        'INSERT INTO reportes (titulo, descripcion) VALUES (?, ?)'
      ).bind(body.titulo, body.descripcion || '').run();
      return Response.json({ ok: true });
    }

    return new Response('No encontrado', { status: 404 });
  },
};
```

---

## Paso 6 — Workers AI

### 6.1 Habilitar

1. Dashboard → **Workers & Pages → AI**
2. Acepta los términos.

### 6.2 Configurar el binding

```jsonc
{
  "ai": { "binding": "AI" }
}
```

### 6.3 Usar un modelo

```js
export default {
  async fetch(request, env) {
    const { prompt } = await request.json();

    const result = await env.AI.run('@cf/zai-org/glm-4.7-flash', {
      messages: [
        { role: 'system', content: 'Eres un asistente útil. Responde en español.' },
        { role: 'user', content: prompt },
      ],
    });

    const texto =
      result?.choices?.[0]?.message?.content ||
      result?.response ||
      '';

    return Response.json({ ok: true, respuesta: texto });
  },
};
```

### 6.4 Modelos recomendados

| Modelo | Uso |
|---|---|
| `@cf/zai-org/glm-4.7-flash` | Chat general, rápido |
| `@cf/meta/llama-3.1-8b-instruct` | Instrucciones, análisis |
| `@cf/qwen/qwen2.5-coder-32b-instruct` | Generación de código |
| `@cf/baai/bge-small-en-v1.5` | Embeddings (con Vectorize) |
| `@cf/openai/whisper` | Transcripción de audio |

### 6.5 ⚠️ Reglas de IA del hackathon

- **Declara** en tu `SPEC.md` qué modelo usas y para qué.
- **No envíes datos personales** reales al modelo.
- **Explica** al usuario cuándo la respuesta viene de una IA.
- **No** uses IA para tomar decisiones que afecten derechos sin revisión humana.
- **Verifica** las respuestas: los modelos pueden alucinar.

---

## Paso 7 — KV, R2 y otros servicios

### 7.1 KV (clave-valor)

```bash
wrangler kv namespace create MI_KV
```

```jsonc
{
  "kv_namespaces": [
    { "binding": "KV", "id": "TU_KV_ID" }
  ]
}
```

```js
await env.KV.put('clave', 'valor', { expirationTtl: 3600 });
const valor = await env.KV.get('clave');
```

### 7.2 R2 (archivos)

```bash
wrangler r2 bucket create mi-bucket
```

```jsonc
{
  "r2_buckets": [
    { "binding": "BUCKET", "bucket_name": "mi-bucket" }
  ]
}
```

```js
await env.BUCKET.put('foto.jpg', request.body);
const obj = await env.BUCKET.get('foto.jpg');
```

### 7.3 Queues (tareas asíncronas)

```bash
wrangler queues create mi-cola
```

```jsonc
{
  "queues": {
    "producers": [{ "binding": "COLA", "queue": "mi-cola" }],
    "consumers": [{ "queue": "mi-cola", "max_batch_size": 10 }]
  }
}
```

---

## Paso 8 — Secretos

Nunca pongas claves en el código. Usa secretos:

```bash
wrangler secret put API_KEY
```

Para Pages:

```bash
wrangler pages secret put API_KEY --project-name mi-proyecto
```

Usar en el código:

```js
const key = env.API_KEY;
```

---

## Paso 9 — Desarrollo local

```bash
npm run dev
# o
wrangler dev
```

Abre `http://localhost:8787`.

> 💡 `wrangler dev` emula los bindings (D1, KV, R2, AI) en local.

### Ver logs

```bash
wrangler tail
```

---

## Paso 10 — Despliega

### Worker

```bash
wrangler deploy
```

Salida:

```
✨ Deployed! https://mi-api.TU-SUBDOMINIO.workers.dev
```

### Pages

```bash
npm run build        # si aplica
wrangler pages deploy dist --project-name mi-proyecto
```

Salida:

```
✨ Deployment complete! https://mi-proyecto.pages.dev
```

### Dominio propio (opcional)

```bash
wrangler pages domain add mi-dominio.com --project-name mi-proyecto
```

---

## Paso 11 — Verifica

### 11.1 Endpoints

```bash
curl https://mi-proyecto.pages.dev/api/health
curl https://mi-proyecto.pages.dev/
```

### 11.2 Base de datos

```bash
wrangler d1 execute mi-db --remote --command "SELECT COUNT(*) FROM reportes;"
```

### 11.3 Logs en vivo

```bash
wrangler tail
```

### 11.4 Desde el navegador

- Abre la URL en incógnito.
- Prueba en móvil.
- Verifica que no haya errores en la consola (F12).

---

## Paso 12 — Entrega

### 12.1 Sube tu código a GitHub

```bash
git init
git add .
git commit -m "MVP del proyecto"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/mi-proyecto.git
git push -u origin main
```

> ⚠️ **El repositorio debe ser PÚBLICO.** Si es privado, el jurado no puede leerlo y el sistema lo rechaza.

### 12.2 Verifica que sea público

Abre `https://github.com/TU-USUARIO/mi-proyecto` en una ventana de incógnito.
Si puedes verlo sin iniciar sesión → **es público** ✅

### 12.3 Incluye un README

```markdown
# [Nombre del proyecto]

## Qué hace
## Cómo se instala
## Cómo se usa
## Arquitectura Cloudflare usada
## Uso de IA
## Enlaces
- Demo: https://...
- Video: https://...
```

### 12.4 Registra tu entrega

Entra a **https://hackathon-uneti-ia.pages.dev/remoto** con tu código y completa el formulario:

| Campo | Obligatorio |
|---|---|
| Repositorio (público) | ✅ |
| Nombre del proyecto | |
| Demo | |
| Video | |
| Deck | |
| Tecnologías | |
| Descripción | |

> 💡 Puedes actualizar tu entrega cuantas veces quieras. Se guarda la última.

### 12.5 Checklist de entrega

- [ ] `SPEC.md` completo
- [ ] Declaración de uso de IA
- [ ] Repositorio **público**
- [ ] README con instalación y uso
- [ ] Proyecto desplegado y funcionando
- [ ] Demo accesible
- [ ] Video demostrativo
- [ ] Entrega registrada en `/remoto`
- [ ] Criterios de aceptación verificados

---

## Límites del plan gratuito

| Servicio | Límite | Si lo superas |
|---|---|---|
| Workers requests | 100k/día | Espera al día siguiente |
| Workers CPU | 10 ms/invocación | Optimiza el código |
| D1 storage | 5 GB | Limpia datos |
| D1 reads | 5M/día | Cachea con KV |
| KV writes | 1.000/día | Agrupa escrituras |
| R2 storage | 10 GB | Comprime archivos |
| Workers AI | 10k neurons/día | Usa modelos más pequeños |
| Vectorize | 30k vectores | Reduce dimensiones |

> 💡 Para un MVP de hackathon, estos límites son **más que suficientes**.

---

## Solución de problemas

| Error | Causa | Solución |
|---|---|---|
| `wrangler: command not found` | No instalado | `npm install -g wrangler` |
| `Not logged in` | Sesión expirada | `wrangler login` |
| `Could not find D1 database` | `database_id` incorrecto | Revisa `wrangler.jsonc` |
| `No such binding: DB` | Binding no configurado | Agrega `d1_databases` |
| `AI binding not found` | Workers AI no habilitado | Actívalo en el dashboard |
| `SyntaxError` en deploy | Código inválido | `wrangler dev` para ver el error |
| `Error 1101` (Worker threw) | Excepción no capturada | Envuelve en `try/catch` |
| `Error 1015` (rate limited) | Demasiadas peticiones | Espera o cachea |
| `Pages deploy failed` | Falta carpeta `dist` | `npm run build` primero |
| `CORS error` | Falta cabecera | Agrega `Access-Control-Allow-Origin` |

### Ver logs de error

```bash
wrangler tail --format pretty
```

### Probar el Worker en local

```bash
wrangler dev --remote
```

---

## Anexo: comandos esenciales

```bash
# Instalación
npm install -g wrangler
wrangler login

# Proyecto
npm create cloudflare@latest mi-proyecto
cd mi-proyecto
npm install

# Base de datos
wrangler d1 create mi-db
wrangler d1 execute mi-db --remote --file=schema.sql

# KV
wrangler kv namespace create MI_KV

# R2
wrangler r2 bucket create mi-bucket

# Secretos
wrangler secret put API_KEY

# Desarrollo
wrangler dev

# Deploy
wrangler deploy
wrangler pages deploy dist --project-name mi-proyecto

# Diagnóstico
wrangler whoami
wrangler tail
wrangler d1 list
```

---

## Anexo: enlaces útiles

| Recurso | URL |
|---|---|
| Dashboard | https://dash.cloudflare.com |
| Documentación Workers | https://developers.cloudflare.com/workers/ |
| Documentación Pages | https://developers.cloudflare.com/pages/ |
| Workers AI (modelos) | https://developers.cloudflare.com/workers-ai/models/ |
| D1 | https://developers.cloudflare.com/d1/ |
| Wrangler | https://developers.cloudflare.com/workers/wrangler/ |
| Ejemplos | https://developers.cloudflare.com/workers/examples/ |

---

© 2026 Hackathon UNETI IA · Comité Organizador
