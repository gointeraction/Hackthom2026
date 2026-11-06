// /api/admin/resultados — sumariza las evaluaciones del jurado y ordena por puntaje ponderado.
export async function onRequestGet({ env }) {
  try {
    const { results: scores } = await env.DB.prepare('SELECT * FROM scores').all();
    const { results: teams } = await env.DB.prepare('SELECT * FROM teams').all();

    const WEIGHTS = {
      viabilidad: 0.25,
      impacto: 0.20,
      innovacion: 0.20,
      pitch: 0.15,
      etica: 0.10,
      escalabilidad: 0.10,
    };

    const teamMap = new Map();
    for (const s of scores) {
      if (!teamMap.has(s.team_id)) teamMap.set(s.team_id, {});
      const c = teamMap.get(s.team_id);
      (c[s.criterio] = c[s.criterio] || []).push(s.puntaje);
    }

    const names = new Map(teams.map((t) => [t.id, t.nombre]));
    const resultados = [];

    for (const [teamId, criterios] of teamMap.entries()) {
      let weighted = 0;
      let totalPts = 0;
      for (const [crit, w] of Object.entries(WEIGHTS)) {
        const pts = criterios[crit];
        if (pts && pts.length) {
          const avg = pts.reduce((a, b) => a + b, 0) / pts.length;
          weighted += avg * w;
          totalPts += pts.length;
        }
      }
      resultados.push({
        team_id: teamId,
        nombre: names.get(teamId) || ('Equipo ' + teamId),
        puntaje: Math.round(weighted * 100) / 100,
        evaluaciones: totalPts,
      });
    }

    resultados.sort((a, b) => b.puntaje - a.puntaje);
    return Response.json({ ok: true, resultados });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al calcular resultados.' }, { status: 500 });
  }
}
