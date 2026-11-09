// /api/admin/remotos — vista general de participantes remotos (estatus, aporte, consultas).
export async function onRequestGet({ env }) {
  try {
    const { results: registrations } = await env.DB.prepare(
      "SELECT * FROM registrations WHERE modalidad = 'remoto' ORDER BY id ASC"
    ).all();
    const { results: entregas } = await env.DB.prepare('SELECT * FROM entregas').all();
    const { results: consultas } = await env.DB.prepare('SELECT * FROM consultas ORDER BY id DESC').all();
    const { results: asistencia } = await env.DB.prepare(
      'SELECT a.registro_id, r.codigo FROM asistencia_remota a JOIN registrations r ON r.id = a.registro_id'
    ).all();

    // Agrupar por código (individual = código propio; grupo = código compartido)
    const grupos = new Map();
    for (const r of registrations) {
      const code = r.codigo || (r.group_id ? 'g_' + r.group_id : 'i_' + r.id);
      if (!grupos.has(code)) {
        grupos.set(code, { codigo: code, esLegacy: !r.codigo, group_id: r.group_id, integrantes: [] });
      }
      grupos.get(code).integrantes.push(r);
    }

    const rows = [];
    for (const [code, g] of grupos.entries()) {
      const miembros = g.integrantes;
      const esIndividual = !g.group_id;
      const nombre = esIndividual
        ? `${miembros[0].nombre} ${miembros[0].apellido}`
        : `Grupo (${miembros.length} integrantes)`;
      const correo = miembros[0].correo;
      const entrega = entregas.find((e) => e.codigo === code) || null;
      const cons = consultas.filter((c) => c.codigo === code);
      const consPendientes = cons.filter((c) => c.estado === 'pendiente').length;
      const asis = asistencia.filter((a) => a.codigo === code).length;
      const acreditados = miembros.filter((m) => m.acreditado).length;

      rows.push({
        codigo: code,
        legacy: g.esLegacy,
        tipo: esIndividual ? 'Individual' : 'Grupo',
        nombre,
        correo,
        integrantes: miembros.length,
        modalidad: 'Remota',
        entrega: entrega ? entrega.repositorio : null,
        proyecto: entrega ? entrega.proyecto : null,
        demo: entrega ? entrega.demo : null,
        consultas: cons.length,
        consultas_pendientes: consPendientes,
        asistencia: asis,
        acreditados,
        ultima_consulta: cons.length ? cons[0].consulta : null,
        ultima_consulta_estado: cons.length ? cons[0].estado : null,
      });
    }

    rows.sort((a, b) => (a.legacy === b.legacy ? a.codigo.localeCompare(b.codigo) : a.legacy ? -1 : 1));

    return Response.json({ ok: true, remotos: rows, total: rows.length });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer participantes.' }, { status: 500 });
  }
}
