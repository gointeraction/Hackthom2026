// /api/leaderboard — ranking público por puntaje de jurados.
export async function onRequestGet({ env }) {
  try {
    const { results: rows } = await env.DB.prepare(
      'SELECT team_id, AVG(puntaje) AS promedio, COUNT(*) AS votos FROM scores GROUP BY team_id ORDER BY promedio DESC'
    ).all();
    const { results: teams } = await env.DB.prepare('SELECT id, nombre, eje, proyecto FROM teams').all();
    const teamById = {};
    teams.forEach((t) => { teamById[t.id] = t; });
    const ranking = rows.map((r, i) => {
      const t = teamById[r.team_id] || {};
      return {
        posicion: i + 1,
        equipo: t.nombre || ('Equipo ' + r.team_id),
        eje: t.eje || '',
        proyecto: t.proyecto || '',
        puntaje: Math.round(Number(r.promedio) * 10) / 10,
        votos: r.votos,
      };
    });
    return Response.json({ ok: true, ranking });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer el ranking.' }, { status: 500 });
  }
}
