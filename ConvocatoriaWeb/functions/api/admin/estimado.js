// /api/admin/estimado — detalle del estimado de personas del evento.
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM estimado_personas ORDER BY orden ASC, id ASC'
    ).all();
    return Response.json({ ok: true, estimado: results });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer el estimado.' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });

  if (data.action === 'update') {
    const id = Number(data.id);
    if (!id) return Response.json({ ok: false, error: 'Falta el id.' }, { status: 400 });
    const central = Math.max(0, Number(data.central) || 0);
    await env.DB.prepare('UPDATE estimado_personas SET central = ? WHERE id = ?').bind(central, id).run();
    return Response.json({ ok: true });
  }

  if (data.action === 'add') {
    const grupo = String(data.grupo || '').trim();
    const rol = String(data.rol || '').trim();
    if (!grupo || !rol) return Response.json({ ok: false, error: 'Grupo y rol son obligatorios.' }, { status: 400 });
    const central = Math.max(0, Number(data.central) || 0);
    const orden = Number(data.orden) || 999;
    await env.DB.prepare(
      'INSERT INTO estimado_personas (grupo, rol, minimo, maximo, central, nota, orden) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(grupo, rol, central, central, central, String(data.nota || '').trim(), orden).run();
    return Response.json({ ok: true });
  }

  return Response.json({ ok: false, error: 'Acción inválida.' }, { status: 400 });
}

export async function onRequestDelete({ request, env }) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return Response.json({ ok: false, error: 'Falta el id.' }, { status: 400 });
  try {
    await env.DB.prepare('DELETE FROM estimado_personas WHERE id = ?').bind(id).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al eliminar.' }, { status: 500 });
  }
}
