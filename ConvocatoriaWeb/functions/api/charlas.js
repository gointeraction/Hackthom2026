// /api/charlas — lista pública del ciclo de ponencias.
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT titulo, ponente, dia, hora_inicio, hora_fin FROM charlas ORDER BY dia ASC, orden ASC, hora_inicio ASC').all();
    return Response.json({ ok: true, charlas: results });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error.' }, { status: 500 });
  }
}
