// /api/admin/export — exporta datos a CSV (con BOM para Excel).
const WEIGHTS = { viabilidad: 0.25, impacto: 0.20, innovacion: 0.20, pitch: 0.15, etica: 0.10, escalabilidad: 0.10 };

function toCSV(rows) {
  if (!rows || rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const esc = (v) => {
    const s = String(v == null ? '' : v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const lines = [headers.join(',')];
  for (const r of rows) lines.push(headers.map((h) => esc(r[h])).join(','));
  return lines.join('\n');
}

export async function onRequestGet({ request, env }) {
  const tipo = new URL(request.url).searchParams.get('tipo') || 'inscritos';
  const nombres = {
    inscritos: 'inscritos',
    patrocinadores: 'patrocinadores',
    equipos: 'equipos',
    jurados: 'jurados',
    puntajes: 'puntajes',
    resultados: 'resultados',
  };
  if (!nombres[tipo]) {
    return Response.json({ ok: false, error: 'Tipo inválido.' }, { status: 400 });
  }

  let rows = [];

  if (tipo === 'resultados') {
    const { results: scores } = await env.DB.prepare('SELECT * FROM scores').all();
    const { results: teams } = await env.DB.prepare('SELECT * FROM teams').all();
    const teamMap = new Map();
    for (const s of scores) {
      if (!teamMap.has(s.team_id)) teamMap.set(s.team_id, {});
      const c = teamMap.get(s.team_id);
      (c[s.criterio] = c[s.criterio] || []).push(s.puntaje);
    }
    const names = new Map(teams.map((t) => [t.id, t.nombre]));
    for (const [tid, criterios] of teamMap.entries()) {
      let weighted = 0;
      for (const [crit, w] of Object.entries(WEIGHTS)) {
        const pts = criterios[crit];
        if (pts && pts.length) weighted += (pts.reduce((a, b) => a + b, 0) / pts.length) * w;
      }
      rows.push({ equipo: names.get(tid) || ('Equipo ' + tid), puntaje: Math.round(weighted * 100) / 100 });
    }
    rows.sort((a, b) => b.puntaje - a.puntaje);
  } else {
    const sql = {
      inscritos: 'SELECT nombre, apellido, correo, nacimiento, anio, group_id, modalidad, acreditado, propuesta FROM registrations ORDER BY id DESC',
      patrocinadores: 'SELECT empresa, contacto, correo, telefono, tipo, detalle, created_at FROM sponsors ORDER BY id DESC',
      equipos: 'SELECT nombre, mentor, eje, proyecto, integrantes FROM teams ORDER BY id',
      jurados: 'SELECT nombre, organizacion, correo FROM judges ORDER BY id',
      puntajes: 'SELECT judge_id, team_id, criterio, puntaje FROM scores ORDER BY team_id, criterio',
    }[tipo];
    const { results } = await env.DB.prepare(sql).all();
    rows = results;
    if (tipo === 'equipos') {
      rows = rows.map((t) => ({ ...t, integrantes: (JSON.parse(t.integrantes || '[]')).join(' | ') }));
    }
    if (tipo === 'patrocinadores') {
      rows = rows.map((s) => ({ ...s, tipo: (JSON.parse(s.tipo || '[]')).join(' | ') }));
    }
  }

  const csv = '\ufeff' + toCSV(rows);
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${nombres[tipo]}.csv"`,
    },
  });
}
