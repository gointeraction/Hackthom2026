// /api/sponsors — registra el interés de patrocinio
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

  const empresa = String(data.empresa || '').trim();
  const contacto = String(data.contacto || '').trim();
  const correo = String(data.correo || '').trim().toLowerCase();
  const telefono = String(data.telefono || '').trim();
  const detalle = String(data.detalle || '').trim();
  const tipo = Array.isArray(data.tipo) ? data.tipo.map((t) => String(t).trim()).filter(Boolean) : [];

  if (!empresa || !contacto || !correo) {
    return Response.json({ ok: false, error: 'Faltan campos obligatorios.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return Response.json({ ok: false, error: 'Correo electrónico inválido.' }, { status: 400 });
  }
  if (tipo.length === 0) {
    return Response.json({ ok: false, error: 'Indica al menos un tipo de apoyo.' }, { status: 400 });
  }

  // Honeypot anti-spam
  if (data._gotcha) {
    return Response.json({ ok: true });
  }

  const ip = request.headers.get('CF-Connecting-IP') || '';
  const token = String(data.turnstile || '');
  if (!(await verifyTurnstile(env, token, 'patrocinio', ip))) {
    return Response.json({ ok: false, error: 'Verificación de seguridad fallida. Recarga la página e inténtalo de nuevo.' }, { status: 403 });
  }

  try {
    await env.DB.prepare(
      'INSERT INTO sponsors (empresa, contacto, correo, telefono, tipo, detalle) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(empresa, contacto, correo, telefono, JSON.stringify(tipo), detalle).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'No se pudo guardar la solicitud.' }, { status: 500 });
  }
}
