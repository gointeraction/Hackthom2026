// /api/admin/api-keys — gestión de API keys para agentes externos.
import { generateApiKey, sha256Hex } from '../../_lib/apikey';

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT id, nombre, permisos, activo, created_at, last_used_at FROM api_keys ORDER BY id DESC'
    ).all();
    return Response.json({ ok: true, keys: results });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al listar API keys.' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });

  const nombre = String(data.nombre || '').trim();
  if (!nombre) return Response.json({ ok: false, error: 'El nombre es obligatorio.' }, { status: 400 });

  try {
    const raw = generateApiKey();
    const hash = await sha256Hex(raw);
    await env.DB.prepare(
      'INSERT INTO api_keys (nombre, key_hash, permisos, activo) VALUES (?, ?, ?, 1)'
    ).bind(nombre, hash, 'read').run();
    return Response.json({ ok: true, key: raw, aviso: 'Guarda esta clave: no se volverá a mostrar.' });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al crear la API key.' }, { status: 500 });
  }
}

export async function onRequestDelete({ request, env }) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ ok: false, error: 'Falta el id.' }, { status: 400 });
  try {
    await env.DB.prepare('DELETE FROM api_keys WHERE id = ?').bind(id).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al eliminar.' }, { status: 500 });
  }
}
