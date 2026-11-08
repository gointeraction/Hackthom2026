// /api/admin/webhooks — gestión de webhooks para agentes externos.
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT id, nombre, url, eventos, activo, created_at FROM webhooks ORDER BY id DESC'
    ).all();
    return Response.json({ ok: true, webhooks: results });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al listar webhooks.' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });

  const url = String(data.url || '').trim();
  const nombre = String(data.nombre || '').trim();
  if (!/^https:\/\//i.test(url)) {
    return Response.json({ ok: false, error: 'La URL debe ser HTTPS.' }, { status: 400 });
  }

  const bytes = crypto.getRandomValues(new Uint8Array(24));
  const secret = 'whsec_' + [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');

  try {
    await env.DB.prepare(
      'INSERT INTO webhooks (nombre, url, secret, eventos, activo) VALUES (?, ?, ?, ?, 1)'
    ).bind(nombre, url, secret, 'entrega.nueva').run();
    return Response.json({ ok: true, secret, aviso: 'Guarda el secreto para verificar las firmas.' });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al crear el webhook.' }, { status: 500 });
  }
}

export async function onRequestDelete({ request, env }) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return Response.json({ ok: false, error: 'Falta el id.' }, { status: 400 });
  try {
    await env.DB.prepare('DELETE FROM webhooks WHERE id = ?').bind(id).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al eliminar.' }, { status: 500 });
  }
}
