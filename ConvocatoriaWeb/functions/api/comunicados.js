// /api/comunicados — listar comunicados públicos.
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM comunicados ORDER BY id DESC').all();
    return Response.json({ ok: true, comunicados: results });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer comunicados.' }, { status: 500 });
  }
}
