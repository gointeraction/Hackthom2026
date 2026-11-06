// /api/admin/asistencia — listar asistencia remota.
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT a.id, a.created_at, r.nombre, r.apellido, r.correo FROM asistencia_remota a JOIN registrations r ON r.id = a.registro_id ORDER BY a.id DESC'
    ).all();
    return Response.json({ ok: true, asistencias: results });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error.' }, { status: 500 });
  }
}
