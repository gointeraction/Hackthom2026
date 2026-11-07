// _middleware.js — protege los endpoints admin y registra auditoría.
import { verifyToken } from './_lib/auth';
import { checkRateLimit } from './_lib/ratelimit';

export async function onRequest(ctx) {
  const path = new URL(ctx.request.url).pathname;

  // Rate limiting para escrituras públicas (anti-abuso)
  const publicWrites = ['/api/register', '/api/entrega', '/api/consulta', '/api/chat', '/api/encuesta', '/api/sponsors', '/api/asistencia', '/api/mentor-remoto'];
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
