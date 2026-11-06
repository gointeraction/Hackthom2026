// /api/admin/consultas — listar y actualizar consultas de mentoría.
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM consultas ORDER BY id DESC').all();
    return Response.json({ ok: true, consultas: results });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error.' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });
  const id = Number(data.id);
  const estado = String(data.estado || 'respondida');
  if (!id || !['pendiente', 'respondida'].includes(estado)) {
    return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });
  }
  try {
    await env.DB.prepare('UPDATE consultas SET estado = ? WHERE id = ?').bind(estado, id).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error.' }, { status: 500 });
  }
}
