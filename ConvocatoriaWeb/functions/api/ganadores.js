// /api/ganadores — ganadores oficiales del Hackathon UNETI IA 2026.
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT tipo, puesto, team_id, equipo, proyecto, puntaje, nota FROM ganadores ORDER BY orden ASC, id ASC'
    ).all();

    const lista = results || [];
    const puestos = lista.filter((g) => g.tipo === 'puesto');
    const reconocimientos = lista.filter((g) => g.tipo === 'reconocimiento');

    return Response.json({
      ok: true,
      definido: puestos.length > 0,
      puestos,
      reconocimientos,
      todos: lista,
    });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer los ganadores.' }, { status: 500 });
  }
}
