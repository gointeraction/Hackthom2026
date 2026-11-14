// /api/admin/resultados — sumariza las evaluaciones del jurado y ordena por puntaje ponderado.
// Los equipos con `oculto = 1` no aparecen en los resultados.
export async function onRequestGet({ env }) {
  try {
    const { results: scores } = await env.DB.prepare('SELECT * FROM scores').all();
    const { results: teams } = await env.DB.prepare('SELECT id, nombre, oculto FROM teams').all();

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

    const infoById = new Map();
    for (const t of teams) infoById.set(t.id, { nombre: t.nombre, oculto: Number(t.oculto) === 1 });

    const resultados = [];

    for (const [teamId, criterios] of teamMap.entries()) {
      const info = infoById.get(teamId);
      if (info && info.oculto) continue; // equipo oculto: no se muestra

      let weighted = 0;
      let totalPts = 0;
      let sumaPuntajes = 0;
      let nCriterios = 0;

      for (const [crit, w] of Object.entries(WEIGHTS)) {
        const pts = criterios[crit];
        if (pts && pts.length) {
          const avg = pts.reduce((a, b) => a + b, 0) / pts.length;
          weighted += avg * w;
          totalPts += pts.length;
          sumaPuntajes += avg;
          nCriterios++;
        }
      }

      resultados.push({
        team_id: teamId,
        nombre: (info && info.nombre) || ('Equipo ' + teamId),
        puntaje: Math.round(weighted * 100) / 100,
        evaluaciones: totalPts,
        criterios_evaluados: nCriterios,
        promedio_simple: nCriterios ? Math.round((sumaPuntajes / nCriterios) * 100) / 100 : 0,
      });
    }

    resultados.sort((a, b) => b.puntaje - a.puntaje);
    return Response.json({ ok: true, resultados });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al calcular resultados.' }, { status: 500 });
  }
}
