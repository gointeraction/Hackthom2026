// /api/admin/login — valida credenciales y emite un token firmado (HMAC).
import { createToken } from '../../_lib/auth';

const USERS = {
  administrador: { password: 'Auyantepui2026**', role: 'admin' },
  acreditacion: { password: 'Acreditacion2026**', role: 'acreditacion' },
  jurado: { password: 'Jurado2026**', role: 'jurado' },
  logistica: { password: 'Logistica2026**', role: 'logistica' },
};

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) {
    return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });
  }

  const user = String(data.username || '').trim();
  const pass = String(data.password || '');
  const account = USERS[user];

  if (account && account.password === pass) {
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
