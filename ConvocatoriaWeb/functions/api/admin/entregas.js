// /api/admin/entregas — listar entregas de proyectos.
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      "SELECT e.*, (SELECT nombre || ' ' || apellido FROM registrations WHERE codigo = e.codigo LIMIT 1) AS participante FROM entregas e ORDER BY e.id DESC"
    ).all();
    return Response.json({ ok: true, entregas: results });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error.' }, { status: 500 });
  }
}
