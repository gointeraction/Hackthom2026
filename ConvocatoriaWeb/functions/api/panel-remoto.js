// /api/panel-remoto — panel del participante remoto (protegido con Turnstile).
async function verifyTurnstile(env, token, action, ip) {
  if (!token || !env.TURNSTILE_SECRET) return false;
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token, remoteip: ip || '' }),
    });
    const result = await r.json();
    return result.success === true && result.action === action && result.hostname === 'hackathon-uneti-ia.pages.dev';
  } catch (e) {
    return false;
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) {
    return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });
  }

  const ip = request.headers.get('CF-Connecting-IP') || '';
  if (!(await verifyTurnstile(env, String(data.turnstile || ''), 'panel', ip))) {
    return Response.json({ ok: false, error: 'Verificación de seguridad fallida. Recarga e inténtalo de nuevo.' }, { status: 403 });
  }

  const codigo = String(data.codigo || '').trim().toUpperCase();
  if (!codigo) {
    return Response.json({ ok: false, error: 'Ingresa tu código.' }, { status: 400 });
  }

  const reg = await env.DB.prepare(
    'SELECT nombre, apellido, correo, modalidad, codigo FROM registrations WHERE codigo = ?'
  ).bind(codigo).first();
  if (!reg) {
    return Response.json({ ok: false, error: 'Código no encontrado.' }, { status: 404 });
  }

  const { results: consultas } = await env.DB.prepare(
    'SELECT consulta, estado, created_at FROM consultas WHERE codigo = ? ORDER BY id DESC'
  ).bind(codigo).all();

  const entrega = await env.DB.prepare(
    'SELECT repositorio, proyecto, demo, updated_at FROM entregas WHERE codigo = ?'
  ).bind(codigo).first();

  // Progreso en GitHub
  let repoInfo = null;
  let commits = [];
  if (entrega && entrega.repositorio) {
    const m = entrega.repositorio.match(/github\.com\/([\w.-]+)\/([\w.-]+)/i);
    if (m) {
      repoInfo = { owner: m[1], repo: m[2], url: entrega.repositorio };
      try {
        const r = await fetch(`https://api.github.com/repos/${m[1]}/${m[2]}/commits?per_page=10`, {
          headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'hackathon-uneti-ia' },
        });
        if (r.ok) {
          const list = await r.json();
          commits = list.map((c) => ({
            sha: (c.sha || '').slice(0, 7),
            message: (c.commit && c.commit.message) || '',
            date: (c.commit && c.commit.author && c.commit.author.date) || '',
            author: (c.commit && c.commit.author && c.commit.author.name) || '',
          }));
        }
      } catch (e) {}
    }
  }

  return Response.json({ ok: true, registro: reg, consultas, entrega, repoInfo, commits });
}
