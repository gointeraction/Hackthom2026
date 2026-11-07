// /api/proyectos — galería pública de proyectos entregados.
export async function onRequestGet({ env }) {
  try {
    const { results: entregas } = await env.DB.prepare(
      'SELECT codigo, proyecto, descripcion, repositorio, demo, video, deck, tags FROM entregas ORDER BY id DESC'
    ).all();
    const { results: teams } = await env.DB.prepare('SELECT codigo, nombre, eje, integrantes FROM teams').all();
    const teamByCodigo = {};
    teams.forEach((t) => { if (t.codigo) teamByCodigo[t.codigo] = t; });
    const proyectos = entregas.map((e) => {
      const t = teamByCodigo[e.codigo] || {};
      return {
        proyecto: e.proyecto || '',
        descripcion: e.descripcion || '',
        repositorio: e.repositorio || '',
        demo: e.demo || '',
        video: e.video || '',
        deck: e.deck || '',
        tags: e.tags || '',
        equipo: t.nombre || '',
        eje: t.eje || '',
      };
    });
    return Response.json({ ok: true, proyectos });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer proyectos.' }, { status: 500 });
  }
}
