// /api/admin/acreditar-personal — acredita/desacredita jurados y mentores en sede.
export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });

  const tabla = data.tipo === 'mentor' ? 'mentores'
    : data.tipo === 'jurado' ? 'judges'
    : data.tipo === 'invitado' ? 'invitados'
    : null;
  if (!tabla) return Response.json({ ok: false, error: 'Tipo inválido.' }, { status: 400 });

  const id = Number(data.id);
  const acreditado = data.acreditado ? 1 : 0;
  if (!id) return Response.json({ ok: false, error: 'Falta el id.' }, { status: 400 });

  try {
    await env.DB.prepare(`UPDATE ${tabla} SET acreditado = ? WHERE id = ?`).bind(acreditado, id).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al actualizar.' }, { status: 500 });
  }
}
