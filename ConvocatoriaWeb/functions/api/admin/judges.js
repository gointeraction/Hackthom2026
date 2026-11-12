// /api/admin/judges — gestión de jurados invitados (con código de acceso por correo).
import { enviarCorreoJurado } from '../../_lib/correo-jurado';

function generarCodigo() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM judges ORDER BY id ASC').all();
    return Response.json({ ok: true, judges: results });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer los jurados.' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });

  // Reenviar / regenerar código de un jurado existente
  if (data.action === 'codigo') {
    const id = Number(data.id);
    if (!id) return Response.json({ ok: false, error: 'Falta el id.' }, { status: 400 });
    const j = await env.DB.prepare('SELECT * FROM judges WHERE id = ?').bind(id).first();
    if (!j) return Response.json({ ok: false, error: 'Jurado no encontrado.' }, { status: 404 });
    const codigo = j.codigo || generarCodigo();
    await env.DB.prepare('UPDATE judges SET codigo = ? WHERE id = ?').bind(codigo, id).run();
    let enviado = false;
    if (j.correo) {
      const r = await enviarCorreoJurado(env, { nombre: j.nombre, correo: j.correo, codigo });
      enviado = !!r.ok;
    }
    return Response.json({ ok: true, codigo, enviado, correo: j.correo || '' });
  }

  const nombre = String(data.nombre || '').trim();
  const organizacion = String(data.organizacion || '').trim();
  const correo = String(data.correo || '').trim().toLowerCase();
  const telefono = String(data.telefono || '').trim();

  if (!nombre) {
    return Response.json({ ok: false, error: 'El nombre es obligatorio.' }, { status: 400 });
  }

  const { results } = await env.DB.prepare('SELECT COUNT(*) AS c FROM judges').all();
  if (results && results[0] && results[0].c >= 20) {
    return Response.json({ ok: false, error: 'Ya hay 20 jurados registrados.' }, { status: 400 });
  }

  try {
    const codigo = generarCodigo();
    await env.DB.prepare(
      'INSERT INTO judges (nombre, organizacion, correo, telefono, codigo) VALUES (?, ?, ?, ?, ?)'
    ).bind(nombre, organizacion, correo, telefono, codigo).run();

    let enviado = false;
    if (correo) {
      const r = await enviarCorreoJurado(env, { nombre, correo, codigo });
      enviado = !!r.ok;
    }

    return Response.json({ ok: true, codigo, enviado, sinCorreo: !correo, correo });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al guardar el jurado.' }, { status: 500 });
  }
}

export async function onRequestDelete({ request, env }) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ ok: false, error: 'Falta el id.' }, { status: 400 });
  try {
    await env.DB.prepare('DELETE FROM judges WHERE id = ?').bind(id).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al eliminar.' }, { status: 500 });
  }
}
