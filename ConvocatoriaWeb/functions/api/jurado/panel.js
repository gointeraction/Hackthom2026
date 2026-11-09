// /api/jurado/panel — datos del jurado: equipos, entregas y sus puntajes.
import { verifyToken } from '../../_lib/auth';

export const CRITERIOS = [
  { id: 'viabilidad', nombre: 'Viabilidad técnica / calidad del MVP', peso: 0.25 },
  { id: 'impacto', nombre: 'Impacto y relevancia del problema', peso: 0.20 },
  { id: 'innovacion', nombre: 'Innovación y uso de IA', peso: 0.20 },
  { id: 'pitch', nombre: 'Calidad del pitch', peso: 0.15 },
  { id: 'etica', nombre: 'Ética y responsabilidad de la IA', peso: 0.10 },
  { id: 'escalabilidad', nombre: 'Escalabilidad / sostenibilidad', peso: 0.10 },
];

export async function onRequestGet({ request, env }) {
  const cookie = request.headers.get('Cookie') || '';
  const token = (cookie.match(/judge_auth=([^;]+)/) || [])[1] || '';
  const role = await verifyToken(token, env.AUTH_SECRET);
  if (!role || !role.startsWith('judge:')) {
    return Response.json({ ok: false, error: 'No autorizado.' }, { status: 401 });
  }
  const judgeId = Number(role.split(':')[1]);

  const j = await env.DB.prepare(
    'SELECT id, nombre, organizacion, correo FROM judges WHERE id = ?'
  ).bind(judgeId).first();
  if (!j) {
    return Response.json({ ok: false, error: 'Jurado no encontrado.' }, { status: 404 });
  }

  const { results: teams } = await env.DB.prepare(
    'SELECT id, nombre, eje, integrantes, modalidad, origen FROM teams ORDER BY id ASC'
  ).all();

  const { results: scores } = await env.DB.prepare(
    'SELECT team_id, criterio, puntaje FROM scores WHERE judge_id = ?'
  ).bind(judgeId).all();

  const { results: entregas } = await env.DB.prepare(
    'SELECT codigo, repositorio, proyecto, demo, video, deck, tags, descripcion, updated_at FROM entregas ORDER BY updated_at DESC'
  ).all();

  return Response.json({
    ok: true,
    judge: j,
    teams: teams || [],
    scores: scores || [],
    entregas: entregas || [],
    criterios: CRITERIOS,
  });
}
