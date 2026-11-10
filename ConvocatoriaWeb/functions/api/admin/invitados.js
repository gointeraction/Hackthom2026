// /api/admin/invitados — gestión de invitados (nombre, apellido, teléfono, correo, organización).
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM invitados ORDER BY id DESC').all();
    return Response.json({ ok: true, invitados: results });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer invitados.' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });

  // Actualizar invitado existente
  if (data.action === 'update') {
    const id = Number(data.id);
    if (!id) return Response.json({ ok: false, error: 'Falta el id.' }, { status: 400 });
    const nombre = String(data.nombre || '').trim();
    const apellido = String(data.apellido || '').trim();
    const organizacion = String(data.organizacion || '').trim();
    const correo = String(data.correo || '').trim().toLowerCase();
    const telefono = String(data.telefono || '').trim();
    if (!nombre) return Response.json({ ok: false, error: 'El nombre es obligatorio.' }, { status: 400 });
    try {
      await env.DB.prepare(
        'UPDATE invitados SET nombre = ?, apellido = ?, organizacion = ?, correo = ?, telefono = ? WHERE id = ?'
      ).bind(nombre, apellido, organizacion, correo, telefono, id).run();
      return Response.json({ ok: true });
    } catch (err) {
      return Response.json({ ok: false, error: 'Error al actualizar el invitado.' }, { status: 500 });
    }
  }

  const nombre = String(data.nombre || '').trim();
  const apellido = String(data.apellido || '').trim();
  const organizacion = String(data.organizacion || '').trim();
  const correo = String(data.correo || '').trim().toLowerCase();
  const telefono = String(data.telefono || '').trim();
  if (!nombre) return Response.json({ ok: false, error: 'El nombre es obligatorio.' }, { status: 400 });

  try {
    await env.DB.prepare(
      'INSERT INTO invitados (nombre, apellido, organizacion, correo, telefono, acreditado) VALUES (?, ?, ?, ?, ?, 0)'
    ).bind(nombre, apellido, organizacion, correo, telefono).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al guardar el invitado.' }, { status: 500 });
  }
}

export async function onRequestDelete({ request, env }) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return Response.json({ ok: false, error: 'Falta el id.' }, { status: 400 });
  try {
    await env.DB.prepare('DELETE FROM invitados WHERE id = ?').bind(id).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al eliminar.' }, { status: 500 });
  }
}
