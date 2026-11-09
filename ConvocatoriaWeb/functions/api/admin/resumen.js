// /api/admin/resumen — contadores generales para el dashboard.
export async function onRequestGet({ env }) {
  const c = async (sql) => {
    const r = await env.DB.prepare(sql).first();
    return r ? (r.c || 0) : 0;
  };
  try {
    const inscritos = await c('SELECT COUNT(*) AS c FROM registrations');
    const individuales = await c('SELECT COUNT(*) AS c FROM registrations WHERE group_id IS NULL');
    const grupos = await c('SELECT COUNT(DISTINCT group_id) AS c FROM registrations WHERE group_id IS NOT NULL');
    const presenciales = await c("SELECT COUNT(*) AS c FROM registrations WHERE modalidad = 'presencial'");
    const remotos = await c("SELECT COUNT(*) AS c FROM registrations WHERE modalidad = 'remoto'");
    const individuales_presenciales = await c("SELECT COUNT(*) AS c FROM registrations WHERE group_id IS NULL AND modalidad = 'presencial'");
    const individuales_remotos = await c("SELECT COUNT(*) AS c FROM registrations WHERE group_id IS NULL AND modalidad = 'remoto'");
    const patrocinadores = await c('SELECT COUNT(*) AS c FROM sponsors');
    const equipos = await c('SELECT COUNT(*) AS c FROM teams');
    const jurados = await c('SELECT COUNT(*) AS c FROM judges');
    const evaluaciones = await c('SELECT COUNT(DISTINCT team_id) AS c FROM scores');
    const preseleccionados = await c("SELECT COUNT(*) AS c FROM evaluaciones WHERE estado='preseleccionado'");
    const finales = await c("SELECT COUNT(*) AS c FROM evaluaciones WHERE estado='final'");
    return Response.json({ ok: true, inscritos, individuales, grupos, presenciales, remotos, individuales_presenciales, individuales_remotos, patrocinadores, equipos, jurados, evaluaciones, preseleccionados, finales });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al calcular resumen.' }, { status: 500 });
  }
}
