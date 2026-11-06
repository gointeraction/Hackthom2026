// /api/admin/logistica — responsables, insumos y actividades por grupo logístico.
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM logistica ORDER BY grupo ASC').all();
    return Response.json({ ok: true, grupos: results });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer logística.' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) {
    return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });
  }

  const grupo = String(data.grupo || '').trim();
  const responsables = String(data.responsables || '');
  const insumos = String(data.insumos || '');
  const actividades = String(data.actividades || '');

  if (!grupo) {
    return Response.json({ ok: false, error: 'Falta el grupo.' }, { status: 400 });
  }

  try {
    await env.DB.prepare(
      'INSERT INTO logistica (grupo, responsables, insumos, actividades) VALUES (?, ?, ?, ?) ' +
      'ON CONFLICT(grupo) DO UPDATE SET responsables=excluded.responsables, insumos=excluded.insumos, actividades=excluded.actividades'
    ).bind(grupo, responsables, insumos, actividades).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'No se pudo guardar.' }, { status: 500 });
  }
}
