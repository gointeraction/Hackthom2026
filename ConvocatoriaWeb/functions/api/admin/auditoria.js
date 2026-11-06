// /api/admin/auditoria — listar el registro de auditoría.
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM auditoria ORDER BY id DESC LIMIT 200').all();
    return Response.json({ ok: true, registros: results });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer auditoría.' }, { status: 500 });
  }
}
