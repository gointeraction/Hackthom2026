// /api/consulta — envío de consultas a mentores.
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
  if (!data) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });
  if (data._gotcha) return Response.json({ ok: true });

  const ip = request.headers.get('CF-Connecting-IP') || '';
  if (!(await verifyTurnstile(env, String(data.turnstile || ''), 'consulta', ip))) {
    return Response.json({ ok: false, error: 'Verificación de seguridad fallida.' }, { status: 403 });
  }

  const codigo = String(data.codigo || '').trim().toUpperCase();
  const consulta = String(data.consulta || '').trim();

  if (!codigo || !consulta) {
    return Response.json({ ok: false, error: 'Código y consulta son obligatorios.' }, { status: 400 });
  }

  const reg = await env.DB.prepare('SELECT nombre, apellido FROM registrations WHERE codigo = ?').bind(codigo).first();
  if (!reg) {
    return Response.json({ ok: false, error: 'Código inválido. Verifica tu código de participante o grupo.' }, { status: 403 });
  }
  const nombre = String(data.nombre || '').trim() || `${reg.nombre} ${reg.apellido}`;

  try {
    await env.DB.prepare('INSERT INTO consultas (codigo, nombre, consulta) VALUES (?, ?, ?)')
      .bind(codigo, nombre, consulta).run();
    return Response.json({ ok: true, message: 'Consulta enviada. Un mentor te responderá.' });
  } catch (err) {
    return Response.json({ ok: false, error: 'No se pudo enviar la consulta.' }, { status: 500 });
  }
}
