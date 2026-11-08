// /api/v1/* — API de solo lectura para agentes externos (API key + rate limit).
import { verifyApiKey, maskEmail } from '../../_lib/apikey';
import { checkRateLimit } from '../../_lib/ratelimit';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...CORS },
  });
}

const TABLES = [
  'registrations', 'teams', 'entregas', 'charlas', 'comunicados', 'evaluaciones',
  'scores', 'encuestas', 'judges', 'sponsors', 'logistica', 'presupuesto',
  'consultas', 'asistencia_remota',
];

const SENSITIVE = ['password_hash', 'validation_token', 'key_hash'];

function sanitize(rows) {
  return rows.map((r) => {
    const out = { ...r };
    SENSITIVE.forEach((k) => { if (k in out) delete out[k]; });
    ['correo', 'email', 'contacto_email'].forEach((k) => {
      if (out[k]) out[k] = maskEmail(out[k]);
    });
    return out;
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestGet({ request, env, params }) {
  const key = await verifyApiKey(env, request);
  if (!key) return json({ ok: false, error: 'API key inválida o ausente.' }, 401);

  const allowed = await checkRateLimit(env, 'key:' + key.id, 'v1', 120, 60);
  if (!allowed) return json({ ok: false, error: 'Límite de solicitudes excedido (120/min).' }, 429);

  const raw = params.path;
  const path = (Array.isArray(raw) ? raw.join('/') : (raw || '')).toLowerCase();
  const url = new URL(request.url);
  const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '100', 10) || 100, 1), 500);
  const offset = Math.max(parseInt(url.searchParams.get('offset') || '0', 10) || 0, 0);

  try {
    if (path === '' || path === 'health') {
      return json({ ok: true, api: 'Hackathon UNETI IA 2026', version: 'v1', key: key.nombre, endpoints: ['stats', ...TABLES] });
    }

    if (path === 'stats') {
      const counts = {};
      for (const t of TABLES) {
        try {
          const row = await env.DB.prepare('SELECT COUNT(*) AS c FROM ' + t).first();
          counts[t] = row ? row.c : 0;
        } catch (e) { counts[t] = null; }
      }
      const regs = await env.DB.prepare(
        "SELECT modalidad, COUNT(*) AS c FROM registrations GROUP BY modalidad"
      ).all().catch(() => ({ results: [] }));
      return json({ ok: true, counts, por_modalidad: regs.results || [] });
    }

    if (!TABLES.includes(path)) {
      return json({ ok: false, error: 'Recurso no encontrado.', disponibles: ['stats', ...TABLES] }, 404);
    }

    // Entregas: incluye el participante (cruce por código)
    if (path === 'entregas') {
      const { results } = await env.DB.prepare(
        'SELECT * FROM entregas ORDER BY id DESC LIMIT ? OFFSET ?'
      ).bind(limit, offset).all();

      const codes = [...new Set((results || []).map((e) => e.codigo).filter(Boolean))];
      const regMap = {};
      if (codes.length) {
        const ph = codes.map(() => '?').join(',');
        const { results: regs } = await env.DB.prepare(
          'SELECT codigo, nombre, apellido, modalidad FROM registrations WHERE codigo IN (' + ph + ')'
        ).bind(...codes).all();
        (regs || []).forEach((r) => { if (r.codigo && !regMap[r.codigo]) regMap[r.codigo] = r; });
      }

      const data = (results || []).map((e) => {
        const r = regMap[e.codigo] || {};
        return {
          ...e,
          participante: ((r.nombre || '') + ' ' + (r.apellido || '')).trim(),
          modalidad: r.modalidad || '',
        };
      });

      const total = await env.DB.prepare('SELECT COUNT(*) AS c FROM entregas').first();
      return json({ ok: true, recurso: 'entregas', total: total ? total.c : null, limit, offset, data: sanitize(data) });
    }

    const { results } = await env.DB.prepare(
      'SELECT * FROM ' + path + ' ORDER BY id DESC LIMIT ? OFFSET ?'
    ).bind(limit, offset).all();

    const total = await env.DB.prepare('SELECT COUNT(*) AS c FROM ' + path).first();
    return json({ ok: true, recurso: path, total: total ? total.c : null, limit, offset, data: sanitize(results || []) });
  } catch (err) {
    return json({ ok: false, error: 'Error interno al consultar.' }, 500);
  }
}
