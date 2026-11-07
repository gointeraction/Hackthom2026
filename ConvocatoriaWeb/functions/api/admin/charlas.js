// /api/admin/charlas — gestión del ciclo de charlas y ponentes.
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM charlas ORDER BY dia ASC, orden ASC, hora_inicio ASC').all();
    return Response.json({ ok: true, charlas: results });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer charlas.' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });

  const id = data.id;
  const titulo = String(data.titulo || '').trim();
  const ponente = String(data.ponente || '').trim();
  const contacto = String(data.contacto || '').trim();
  const curriculum = String(data.curriculum || '').trim();
  const dia = parseInt(data.dia) === 2 ? 2 : 1;
  const hora_inicio = String(data.hora_inicio || '').trim();
  const hora_fin = String(data.hora_fin || '').trim();
  const orden = parseInt(data.orden) || 0;

  if (!titulo) return Response.json({ ok: false, error: 'Falta el título de la charla.' }, { status: 400 });

  try {
    if (id) {
      await env.DB.prepare('UPDATE charlas SET titulo=?, ponente=?, contacto=?, curriculum=?, dia=?, hora_inicio=?, hora_fin=?, orden=? WHERE id=?')
        .bind(titulo, ponente, contacto, curriculum, dia, hora_inicio, hora_fin, orden, id).run();
    } else {
      await env.DB.prepare('INSERT INTO charlas (titulo, ponente, contacto, curriculum, dia, hora_inicio, hora_fin, orden) VALUES (?,?,?,?,?,?,?,?)')
        .bind(titulo, ponente, contacto, curriculum, dia, hora_inicio, hora_fin, orden).run();
    }
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'No se pudo guardar.' }, { status: 500 });
  }
}

export async function onRequestDelete({ request, env }) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return Response.json({ ok: false, error: 'Falta id.' }, { status: 400 });
  try {
    await env.DB.prepare('DELETE FROM charlas WHERE id = ?').bind(id).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al eliminar.' }, { status: 500 });
  }
}
