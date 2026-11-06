// /api/admin/usuarios — gestión de usuarios y privilegios (roles).
import { hashPassword } from '../../_lib/auth';

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT id, username, role, nombre, created_at FROM usuarios ORDER BY id').all();
    return Response.json({ ok: true, usuarios: results });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer usuarios.' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });

  const username = String(data.username || '').trim().toLowerCase();
  const password = String(data.password || '');
  const role = String(data.role || '');
  const nombre = String(data.nombre || '').trim();

  const roles = ['admin', 'acreditacion', 'jurado', 'logistica'];
  if (!username || !password || !roles.includes(role)) {
    return Response.json({ ok: false, error: 'Usuario, contraseña y rol válido son obligatorios.' }, { status: 400 });
  }
  if (!/^[a-z0-9._-]{3,30}$/.test(username)) {
    return Response.json({ ok: false, error: 'Usuario inválido (3-30 caracteres: letras, números, . _ -).' }, { status: 400 });
  }
  if (password.length < 6) {
    return Response.json({ ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' }, { status: 400 });
  }

  const hash = await hashPassword(password, env.AUTH_SECRET);
  try {
    await env.DB.prepare('INSERT INTO usuarios (username, password_hash, role, nombre) VALUES (?, ?, ?, ?)')
      .bind(username, hash, role, nombre).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'El usuario ya existe.' }, { status: 409 });
  }
}

export async function onRequestDelete({ request, env }) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return Response.json({ ok: false, error: 'Falta id.' }, { status: 400 });

  const target = await env.DB.prepare('SELECT role FROM usuarios WHERE id = ?').bind(id).first();
  if (!target) return Response.json({ ok: false, error: 'Usuario no encontrado.' }, { status: 404 });

  const admins = await env.DB.prepare("SELECT COUNT(*) AS c FROM usuarios WHERE role = 'admin'").first();
  if (target.role === 'admin' && admins && admins.c <= 1) {
    return Response.json({ ok: false, error: 'No puedes eliminar el último administrador.' }, { status: 400 });
  }

  try {
    await env.DB.prepare('DELETE FROM usuarios WHERE id = ?').bind(id).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al eliminar.' }, { status: 500 });
  }
}
