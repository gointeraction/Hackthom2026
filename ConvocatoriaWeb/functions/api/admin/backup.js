// /api/admin/backup — respaldo completo de la base en JSON.
export async function onRequestGet({ env }) {
  const tables = ['registrations', 'teams', 'judges', 'scores', 'sponsors', 'logistica', 'evaluaciones', 'evaluador_config', 'presupuesto', 'auditoria'];
  const data = {};
  try {
    for (const t of tables) {
      const { results } = await env.DB.prepare(`SELECT * FROM ${t}`).all();
      data[t] = results;
    }
    const fecha = new Date().toISOString().slice(0, 10);
    return new Response(JSON.stringify({ exportado: new Date().toISOString(), tablas: data }, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="backup-hackathon-uneti-ia-${fecha}.json"`,
      },
    });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al generar el respaldo.' }, { status: 500 });
  }
}
