// /api/admin/scores — evaluaciones de jurados
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM scores ORDER BY team_id, criterio ASC').all();
    return Response.json({ ok: true, scores: results });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer las evaluaciones.' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });

  const judge_id = Number(data.judge_id);
  const team_id = Number(data.team_id);
  const scores = Array.isArray(data.scores) ? data.scores : [];

  if (!judge_id || !team_id || scores.length === 0) {
    return Response.json({ ok: false, error: 'Datos incompletos.' }, { status: 400 });
  }

  const valid = scores.every((s) => {
    const p = Number(s.puntaje);
    return s.criterio && p >= 1 && p <= 5;
  });
  if (!valid) {
    return Response.json({ ok: false, error: 'Las puntuaciones deben estar entre 1 y 5.' }, { status: 400 });
  }

  try {
    const stmt = env.DB.prepare(
      'INSERT INTO scores (judge_id, team_id, criterio, puntaje) VALUES (?, ?, ?, ?) ' +
      'ON CONFLICT(judge_id, team_id, criterio) DO UPDATE SET puntaje = excluded.puntaje'
    );
    const statements = scores.map((s) => stmt.bind(judge_id, team_id, s.criterio, Number(s.puntaje)));
    await env.DB.batch(statements);
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al guardar la evaluación.' }, { status: 500 });
  }
}
