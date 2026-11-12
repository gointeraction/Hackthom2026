// /api/admin/grupos-logistica — responsables por grupo de logística.
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM grupos_logistica ORDER BY grupo ASC, id ASC'
    ).all();
    return Response.json({ ok: true, grupos: results });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer grupos.' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });

  // Actualizar responsable existente
  if (data.action === 'update') {
    const id = Number(data.id);
    if (!id) return Response.json({ ok: false, error: 'Falta el id.' }, { status: 400 });
    const grupo = String(data.grupo || '').trim();
    const responsable = String(data.responsable || '').trim();
    const cedula = String(data.cedula || '').replace(/\D+/g, '');
    const correo = String(data.correo || '').trim().toLowerCase();
    const telefono = String(data.telefono || '').trim();
    const nota = String(data.nota || '').trim();
    if (!grupo || !responsable) {
      return Response.json({ ok: false, error: 'Grupo y responsable son obligatorios.' }, { status: 400 });
    }
    try {
      await env.DB.prepare(
        'UPDATE grupos_logistica SET grupo = ?, responsable = ?, cedula = ?, correo = ?, telefono = ?, nota = ? WHERE id = ?'
      ).bind(grupo, responsable, cedula, correo, telefono, nota, id).run();
      return Response.json({ ok: true });
    } catch (err) {
      return Response.json({ ok: false, error: 'Error al actualizar.' }, { status: 500 });
    }
  }

  const grupo = String(data.grupo || '').trim();
  const responsable = String(data.responsable || '').trim();
  const cedula = String(data.cedula || '').replace(/\D+/g, '');
  const correo = String(data.correo || '').trim().toLowerCase();
  const telefono = String(data.telefono || '').trim();
  const nota = String(data.nota || '').trim();

  if (!grupo || !responsable) {
    return Response.json({ ok: false, error: 'Grupo y responsable son obligatorios.' }, { status: 400 });
  }

  try {
    await env.DB.prepare(
      'INSERT INTO grupos_logistica (grupo, responsable, cedula, correo, telefono, nota) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(grupo, responsable, cedula, correo, telefono, nota).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al guardar.' }, { status: 500 });
  }
}

export async function onRequestDelete({ request, env }) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return Response.json({ ok: false, error: 'Falta el id.' }, { status: 400 });
  try {
    await env.DB.prepare('DELETE FROM grupos_logistica WHERE id = ?').bind(id).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al eliminar.' }, { status: 500 });
  }
}
