// /api/admin/sponsors — listar patrocinadores registrados
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM sponsors ORDER BY id DESC').all();
    const sponsors = results.map((s) => ({
      ...s,
      tipo: JSON.parse(s.tipo || '[]'),
    }));
    return Response.json({ ok: true, sponsors });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer patrocinadores.' }, { status: 500 });
  }
}
