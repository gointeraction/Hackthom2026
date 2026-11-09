// /api/admin/presenciales — listado de participantes presenciales con su código.
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      "SELECT * FROM registrations WHERE modalidad = 'presencial' ORDER BY id ASC"
    ).all();

    const { results: teams } = await env.DB.prepare('SELECT id, nombre, integrantes FROM teams').all();
    const teamByMember = new Map();
    for (const t of teams) {
      let arr = [];
      try { arr = JSON.parse(t.integrantes || '[]'); } catch (e) {}
      (arr || []).forEach((n) => teamByMember.set(String(n).trim().toLowerCase(), t.nombre));
    }

    const grupos = new Map();
    for (const r of results) {
      const code = r.codigo || ('i_' + r.id);
      if (!grupos.has(code)) {
        grupos.set(code, {
          codigo: code,
          group_id: r.group_id,
          notificado: r.notificado,
          acreditados: 0,
          integrantes: [],
        });
      }
      const g = grupos.get(code);
      g.integrantes.push(r);
      if (r.acreditado) g.acreditados++;
    }

    const rows = [...grupos.values()].map((g) => {
      const m = g.integrantes;
      return {
        codigo: g.codigo,
        tipo: g.group_id ? 'Grupo' : 'Individual',
        nombre: g.group_id ? `Grupo (${m.length} integrantes)` : `${m[0].nombre} ${m[0].apellido}`,
        correo: m[0].correo || '',
        anio: m[0].anio || '',
        integrantes: m.length,
        notificado: g.notificado ? 1 : 0,
        acreditados: g.acreditados,
      };
    });

    const personas = results.map((r) => {
      const full = `${r.nombre || ''} ${r.apellido || ''}`.trim();
      return {
        id: r.id,
        nombre: full,
        correo: r.correo || '',
        anio: r.anio || '',
        codigo: r.codigo || '',
        es_grupo: !!r.group_id,
        acreditado: r.acreditado ? 1 : 0,
        equipo: teamByMember.get(full.toLowerCase()) || null,
      };
    });

    return Response.json({ ok: true, presenciales: rows, personas, total: rows.length });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer presenciales.' }, { status: 500 });
  }
}
