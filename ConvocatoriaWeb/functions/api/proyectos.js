// /api/proyectos — galería pública de proyectos entregados (sin repositorio).
export async function onRequestGet({ env }) {
  try {
    const { results: entregas } = await env.DB.prepare(
      'SELECT codigo, proyecto, descripcion, demo, video, deck, tags, updated_at FROM entregas ORDER BY id DESC'
    ).all();
    const { results: teams } = await env.DB.prepare('SELECT codigo, nombre, eje, integrantes FROM teams').all();
    const teamByCodigo = {};
    teams.forEach((t) => { if (t.codigo) teamByCodigo[t.codigo] = t; });

    const proyectos = (entregas || []).map((e) => {
      const t = teamByCodigo[e.codigo] || {};
      let integrantes = [];
      try { integrantes = JSON.parse(t.integrantes || '[]'); } catch (err) {}
      return {
        proyecto: e.proyecto || t.nombre || 'Proyecto sin nombre',
        equipo: t.nombre || '',
        descripcion: e.descripcion || '',
        demo: e.demo || '',
        video: e.video || '',
        deck: e.deck || '',
        tags: e.tags || '',
        eje: t.eje || '',
        integrantes: Array.isArray(integrantes) ? integrantes : [],
        actualizado: e.updated_at || '',
      };
    });

    return Response.json({ ok: true, proyectos });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer proyectos.' }, { status: 500 });
  }
}
