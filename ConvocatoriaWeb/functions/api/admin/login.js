// /api/admin/login — valida credenciales contra D1 y emite token firmado (HMAC).
import { createToken, hashPassword } from '../../_lib/auth';

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) {
    return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });
  }

  const username = String(data.username || '').trim().toLowerCase();
  const pass = String(data.password || '');

  if (!username || !pass) {
    return Response.json({ ok: false, error: 'Credenciales incorrectas.' }, { status: 401 });
  }

  const hash = await hashPassword(pass, env.AUTH_SECRET);
  const account = await env.DB.prepare(
    'SELECT role FROM usuarios WHERE username = ? AND password_hash = ?'
  ).bind(username, hash).first();

  if (account) {
    const token = await createToken(account.role, env.AUTH_SECRET);
    return Response.json(
      { ok: true, role: account.role },
      {
        headers: {
          'Set-Cookie': `admin_auth=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
        },
      }
    );
  }

  return Response.json({ ok: false, error: 'Credenciales incorrectas.' }, { status: 401 });
}
