// /api/inscritos — contador público de inscritos (se refresca en vivo).
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      "SELECT COUNT(*) AS total, " +
      "SUM(CASE WHEN modalidad = 'presencial' THEN 1 ELSE 0 END) AS presenciales, " +
      "SUM(CASE WHEN modalidad = 'remoto' THEN 1 ELSE 0 END) AS remotos " +
      'FROM registrations'
    ).all();

    const r = (results && results[0]) || {};

    let grupos = 0;
    try {
      const g = await env.DB.prepare('SELECT COUNT(*) AS c FROM teams').all();
      grupos = (g && g.results && g.results[0] && g.results[0].c) || 0;
    } catch (e) {}

    return Response.json(
      {
        ok: true,
        total: r.total || 0,
        presenciales: r.presenciales || 0,
        remotos: r.remotos || 0,
        grupos,
        actualizado: new Date().toISOString(),
      },
      { headers: { 'Cache-Control': 'public, max-age=10' } }
    );
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer el contador.' }, { status: 500 });
  }
}
