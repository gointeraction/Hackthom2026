// /api/jurado/score — guarda la evaluación de un jurado para un equipo.
import { verifyToken } from '../../_lib/auth';

export async function onRequestPost({ request, env }) {
  const cookie = request.headers.get('Cookie') || '';
  const token = (cookie.match(/judge_auth=([^;]+)/) || [])[1] || '';
  const role = await verifyToken(token, env.AUTH_SECRET);
  if (!role || !role.startsWith('judge:')) {
    return Response.json({ ok: false, error: 'No autorizado.' }, { status: 401 });
  }
  const judgeId = Number(role.split(':')[1]);

  const data = await request.json().catch(() => null);
  if (!data) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });

  const team_id = Number(data.team_id);
  const scores = Array.isArray(data.scores) ? data.scores : [];

  if (!team_id || scores.length === 0) {
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
    await env.DB.batch(scores.map((s) => stmt.bind(judgeId, team_id, s.criterio, Number(s.puntaje))));
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al guardar la evaluación.' }, { status: 500 });
  }
}
