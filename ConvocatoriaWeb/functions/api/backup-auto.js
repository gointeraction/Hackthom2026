// /api/backup-auto — respaldo automático de la D1 a R2 (protegido por secreto).
export async function onRequestPost({ request, env }) {
  const secret = request.headers.get('X-Backup-Secret') || '';
  if (!env.BACKUP_SECRET || secret !== env.BACKUP_SECRET) {
    return Response.json({ ok: false, error: 'No autorizado.' }, { status: 401 });
  }

  const tables = [
    'registrations', 'teams', 'sponsors', 'judges', 'scores', 'logistica',
    'evaluador_config', 'evaluaciones', 'presupuesto', 'auditoria', 'consultas',
    'asistencia_remota', 'comunicados', 'entregas', 'errores', 'usuarios',
    'fotos', 'charlas', 'encuestas',
  ];

  const dump = { exported_at: new Date().toISOString(), tables: {} };
  for (const t of tables) {
    try {
      const { results } = await env.DB.prepare('SELECT * FROM ' + t).all();
      dump.tables[t] = results;
    } catch (e) {
      dump.tables[t] = null;
    }
  }

  try {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const key = 'backups/d1-' + stamp + '.json';
    await env.FOTOS.put(key, JSON.stringify(dump), {
      httpMetadata: { contentType: 'application/json' },
    });
    return Response.json({ ok: true, key, tables: Object.keys(dump.tables).length });
  } catch (err) {
    return Response.json({ ok: false, error: 'No se pudo guardar el respaldo.' }, { status: 500 });
  }
}
