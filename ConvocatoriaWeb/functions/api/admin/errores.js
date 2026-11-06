// /api/admin/errores — listar errores registrados.
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM errores ORDER BY id DESC LIMIT 200').all();
    return Response.json({ ok: true, errores: results });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error.' }, { status: 500 });
  }
}
