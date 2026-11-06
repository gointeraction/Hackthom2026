// /api/admin/acreditar — marcar/desmarcar a un participante como acreditado (check-in presencial).
export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) {
    return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });
  }

  const id = Number(data.id);
  const acreditado = data.acreditado ? 1 : 0;

  if (!id) {
    return Response.json({ ok: false, error: 'Falta el id.' }, { status: 400 });
  }

  try {
    await env.DB.prepare('UPDATE registrations SET acreditado = ? WHERE id = ?').bind(acreditado, id).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'No se pudo actualizar.' }, { status: 500 });
  }
}
