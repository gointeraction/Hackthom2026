// /api/jurado/login — acceso de jurados con código enviado por correo.
import { createToken } from '../../_lib/auth';

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  const codigo = String((data && data.codigo) || '').trim().toUpperCase();
  if (!codigo) {
    return Response.json({ ok: false, error: 'Ingresa tu código de jurado.' }, { status: 400 });
  }

  const j = await env.DB.prepare(
    'SELECT id, nombre, organizacion FROM judges WHERE codigo = ? LIMIT 1'
  ).bind(codigo).first();

  if (!j) {
    return Response.json({ ok: false, error: 'Código inválido. Verifica el correo que recibiste.' }, { status: 401 });
  }

  const token = await createToken(`judge:${j.id}`, env.AUTH_SECRET, 60 * 60 * 24 * 30);
  return Response.json(
    { ok: true, nombre: j.nombre, organizacion: j.organizacion || '' },
    { headers: { 'Set-Cookie': `judge_auth=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000` } }
  );
}
