// /api/admin/encuestas — resultados de la encuesta de feedback.
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM encuestas ORDER BY id DESC').all();
    const total = results.length;
    const promedio = total ? Math.round((results.reduce((s, r) => s + Number(r.puntaje), 0) / total) * 10) / 10 : 0;
    return Response.json({ ok: true, total, promedio, encuestas: results });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer encuestas.' }, { status: 500 });
  }
}
