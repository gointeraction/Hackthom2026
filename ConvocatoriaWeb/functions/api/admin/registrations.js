// /api/admin/registrations — listar participantes y asignar modalidad a grupos.
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM registrations ORDER BY id DESC').all();
    return Response.json({ ok: true, registrations: results });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer inscritos.' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) {
    return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });
  }

  const group_id = String(data.group_id || '');
  const modalidad = String(data.modalidad || '');

  if (!group_id) {
    return Response.json({ ok: false, error: 'Falta el grupo.' }, { status: 400 });
  }
  if (!['presencial', 'remoto', ''].includes(modalidad)) {
    return Response.json({ ok: false, error: 'Modalidad inválida.' }, { status: 400 });
  }

  try {
    await env.DB.prepare('UPDATE registrations SET modalidad = ? WHERE group_id = ?')
      .bind(modalidad || null, group_id).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'No se pudo actualizar la modalidad.' }, { status: 500 });
  }
}
