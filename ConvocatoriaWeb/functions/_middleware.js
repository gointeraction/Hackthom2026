// _middleware.js — protege los endpoints admin y registra auditoría.
import { verifyToken } from './_lib/auth';
import { checkRateLimit } from './_lib/ratelimit';
import { enviarInstructivoRemoto } from './_lib/instructivo-remoto';

// Ejecuta envíos programados cuando llega la hora (se dispara con la primera visita).
async function procesarEnviosProgramados(env) {
  const ahora = new Date().toISOString();
  let pend = null;
  try {
    pend = await env.DB.prepare(
      'SELECT id, clave FROM envios_programados WHERE ejecutado = 0 AND ejecutar_at <= ? ORDER BY ejecutar_at ASC LIMIT 1'
    ).bind(ahora).first();
  } catch (e) {
    return;
  }
  if (!pend) return;

  const claim = await env.DB.prepare(
    'UPDATE envios_programados SET ejecutado = 1, ejecutado_at = ? WHERE id = ? AND ejecutado = 0'
  ).bind(ahora, pend.id).run();
  if (!claim.meta || claim.meta.changes === 0) return;

  try {
    let resultado = '';
    if (pend.clave === 'instructivo-remoto') {
      const r = await enviarInstructivoRemoto(env, {});
      resultado = JSON.stringify({ total: r.total, sent: r.sent, failed: r.failed });
    }
    await env.DB.prepare('UPDATE envios_programados SET resultado = ? WHERE id = ?').bind(resultado, pend.id).run();
  } catch (e) {
    try {
      await env.DB.prepare('UPDATE envios_programados SET ejecutado = 0, ejecutado_at = NULL WHERE id = ?').bind(pend.id).run();
    } catch (e2) {}
  }
}

export async function onRequest(ctx) {
  const path = new URL(ctx.request.url).pathname;

  // Envíos programados: se ejecutan en segundo plano con la primera visita tras la hora.
  if (ctx.request.method === 'GET' && !path.startsWith('/api/')) {
    try {
      ctx.waitUntil(procesarEnviosProgramados(ctx.env).catch(() => {}));
    } catch (e) {}
  }

  // Rate limiting para escrituras públicas (anti-abuso)
  const publicWrites = ['/api/register', '/api/entrega', '/api/consulta', '/api/chat', '/api/encuesta', '/api/sponsors', '/api/asistencia', '/api/mentor-remoto', '/api/datos-participante'];
  if (publicWrites.includes(path) && ctx.request.method === 'POST') {
    const ip = ctx.request.headers.get('CF-Connecting-IP') || 'unknown';
    const allowed = await checkRateLimit(ctx.env, ip, path, 20, 60);
    if (!allowed) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Demasiadas solicitudes. Espera un minuto e inténtalo de nuevo.' }),
        { status: 429, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }
  }

  // Acceso exclusivo de jurados (cookie judge_auth)
  const isJudgeApi = path.startsWith('/api/jurado/') && path !== '/api/jurado/login' && path !== '/api/jurado/logout';
  if (isJudgeApi) {
    const cookie = ctx.request.headers.get('Cookie') || '';
    const token = (cookie.match(/judge_auth=([^;]+)/) || [])[1] || '';
    const role = await verifyToken(token, ctx.env.AUTH_SECRET);
    if (!role || !role.startsWith('judge:')) {
      return new Response(
        JSON.stringify({ ok: false, error: 'No autorizado.' }),
        { status: 401, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }
    return ctx.next();
  }

  const isLogin = path === '/api/admin/login';
  const isProtectedApi = path.startsWith('/api/admin/') && !isLogin;

  if (!isProtectedApi) {
    return ctx.next();
  }

  const cookie = ctx.request.headers.get('Cookie') || '';
  const token = (cookie.match(/admin_auth=([^;]+)/) || [])[1] || '';
  const role = await verifyToken(token, ctx.env.AUTH_SECRET);

  const rolesValidos = ['admin', 'acreditacion', 'jurado', 'logistica'];
  if (!role || !rolesValidos.includes(role)) {
    return new Response(
      JSON.stringify({ ok: false, error: 'No autorizado.' }),
      { status: 401, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }

  // Auditoría: registrar mutaciones (no GET, excepto login/logout)
  if (ctx.request.method !== 'GET' && path !== '/api/admin/login' && path !== '/api/admin/logout') {
    try {
      await ctx.env.DB.prepare('INSERT INTO auditoria (rol, metodo, ruta) VALUES (?, ?, ?)')
        .bind(role, ctx.request.method, path).run();
    } catch (e) {}
  }

  return ctx.next();
}
