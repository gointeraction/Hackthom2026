// /api/admin/comunicados — gestionar comunicados.
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM comunicados ORDER BY id DESC').all();
    return Response.json({ ok: true, comunicados: results });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error.' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });
  const titulo = String(data.titulo || '').trim();
  const contenido = String(data.contenido || '').trim();
  if (!titulo || !contenido) {
    return Response.json({ ok: false, error: 'Título y contenido son obligatorios.' }, { status: 400 });
  }
  try {
    await env.DB.prepare('INSERT INTO comunicados (titulo, contenido) VALUES (?, ?)').bind(titulo, contenido).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al guardar.' }, { status: 500 });
  }
}

export async function onRequestDelete({ request, env }) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return Response.json({ ok: false, error: 'Falta id.' }, { status: 400 });
  try {
    await env.DB.prepare('DELETE FROM comunicados WHERE id = ?').bind(id).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al eliminar.' }, { status: 500 });
  }
}
