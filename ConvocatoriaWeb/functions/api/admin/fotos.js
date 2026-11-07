// /api/admin/fotos — subir, listar y eliminar fotos de la galería (R2 + D1).
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM fotos ORDER BY id DESC').all();
    return Response.json({ ok: true, fotos: results });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer fotos.' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  const formData = await request.formData().catch(() => null);
  if (!formData) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });

  const file = formData.get('file');
  const caption = String(formData.get('caption') || '').trim();

  if (!file || typeof file === 'string' || !file.name) {
    return Response.json({ ok: false, error: 'Selecciona una imagen.' }, { status: 400 });
  }
  const tipos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!tipos.includes(file.type)) {
    return Response.json({ ok: false, error: 'Formato no soportado (usa JPG, PNG, WebP o GIF).' }, { status: 400 });
  }

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const key = `foto-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  try {
    const bytes = await file.arrayBuffer();
    await env.FOTOS.put(key, bytes, { httpMetadata: { contentType: file.type } });
    await env.DB.prepare('INSERT INTO fotos (key, caption, content_type) VALUES (?, ?, ?)')
      .bind(key, caption, file.type).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'No se pudo subir la foto.' }, { status: 500 });
  }
}

export async function onRequestDelete({ request, env }) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return Response.json({ ok: false, error: 'Falta id.' }, { status: 400 });

  try {
    const foto = await env.DB.prepare('SELECT key FROM fotos WHERE id = ?').bind(id).first();
    if (foto) {
      await env.FOTOS.delete(foto.key);
      await env.DB.prepare('DELETE FROM fotos WHERE id = ?').bind(id).run();
    }
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al eliminar.' }, { status: 500 });
  }
}
