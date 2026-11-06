// /api/admin/seleccion — actualizar el estado de selección de un grupo evaluado.
export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });

  const group_id = String(data.group_id || '');
  const estado = String(data.estado || 'pendiente');

  if (!group_id) return Response.json({ ok: false, error: 'Falta el grupo.' }, { status: 400 });
  if (!['pendiente', 'preseleccionado', 'final'].includes(estado)) {
    return Response.json({ ok: false, error: 'Estado inválido.' }, { status: 400 });
  }

  try {
    await env.DB.prepare('UPDATE evaluaciones SET estado = ? WHERE group_id = ?').bind(estado, group_id).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'No se pudo actualizar.' }, { status: 500 });
  }
}
