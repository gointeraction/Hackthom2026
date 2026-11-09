// /api/admin/tickets — asignación y entrega de tickets de comida.

const FUENTES = {
  participante: async (env) => {
    const { results } = await env.DB.prepare(
      "SELECT id, nombre, apellido, codigo FROM registrations WHERE modalidad = 'presencial'"
    ).all();
    return results.map((r) => ({
      ref: 'reg:' + r.id,
      nombre: `${r.nombre || ''} ${r.apellido || ''}`.trim(),
      codigo: r.codigo || '',
    }));
  },
  jurado: async (env) => {
    const { results } = await env.DB.prepare('SELECT id, nombre FROM judges').all();
    return results.map((r) => ({ ref: 'judge:' + r.id, nombre: r.nombre, codigo: '' }));
  },
  ponente: async (env) => {
    const { results } = await env.DB.prepare(
      "SELECT DISTINCT ponente FROM charlas WHERE ponente IS NOT NULL AND ponente <> ''"
    ).all();
    return results.map((r) => ({ ref: 'ponente:' + r.ponente, nombre: r.ponente, codigo: '' }));
  },
  mentor: async (env) => {
    const { results } = await env.DB.prepare('SELECT id, nombre FROM mentores').all();
    return results.map((r) => ({ ref: 'mentor:' + r.id, nombre: r.nombre, codigo: '' }));
  },
  logistica: async (env) => {
    const { results } = await env.DB.prepare('SELECT id, nombre, rol FROM personal_logistica').all();
    return results.map((r) => ({ ref: 'log:' + r.id, nombre: r.nombre, codigo: r.rol || '' }));
  },
};

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM tickets ORDER BY persona_tipo, nombre, dia, comida'
    ).all();
    const { results: log } = await env.DB.prepare('SELECT * FROM personal_logistica ORDER BY id DESC').all();
    return Response.json({ ok: true, tickets: results, logistica: log });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer tickets.' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });

  if (data.action === 'generar') {
    const tipos = Array.isArray(data.tipos) && data.tipos.length ? data.tipos : Object.keys(FUENTES);
    const comidas = Array.isArray(data.comidas) ? data.comidas : [];
    if (comidas.length === 0) {
      return Response.json({ ok: false, error: 'Selecciona al menos una comida.' }, { status: 400 });
    }
    let creados = 0;
    let personas = 0;
    for (const tipo of tipos) {
      if (!FUENTES[tipo]) continue;
      const lista = await FUENTES[tipo](env);
      personas += lista.length;
      for (const p of lista) {
        for (const c of comidas) {
          const parts = String(c).split('|');
          const dia = parts[0];
          const comida = parts[1];
          if (!dia || !comida) continue;
          try {
            const r = await env.DB.prepare(
              'INSERT OR IGNORE INTO tickets (ref, persona_tipo, nombre, codigo, dia, comida) VALUES (?, ?, ?, ?, ?, ?)'
            ).bind(p.ref, tipo, p.nombre, p.codigo, dia, comida).run();
            if (r.meta && r.meta.changes > 0) creados++;
          } catch (e) {}
        }
      }
    }
    return Response.json({ ok: true, creados, personas });
  }

  if (data.action === 'entregar') {
    const id = Number(data.id);
    if (!id) return Response.json({ ok: false, error: 'Falta el id.' }, { status: 400 });
    const entregado = data.entregado ? 1 : 0;
    await env.DB.prepare(
      'UPDATE tickets SET entregado = ?, entregado_at = ? WHERE id = ?'
    ).bind(entregado, entregado ? new Date().toISOString() : null, id).run();
    return Response.json({ ok: true });
  }

  if (data.action === 'add-logistica') {
    const nombre = String(data.nombre || '').trim();
    if (!nombre) return Response.json({ ok: false, error: 'Falta el nombre.' }, { status: 400 });
    await env.DB.prepare(
      'INSERT INTO personal_logistica (nombre, rol, correo, telefono) VALUES (?, ?, ?, ?)'
    ).bind(nombre, String(data.rol || '').trim(), String(data.correo || '').trim(), String(data.telefono || '').trim()).run();
    return Response.json({ ok: true });
  }

  if (data.action === 'reset') {
    await env.DB.prepare('DELETE FROM tickets').run();
    return Response.json({ ok: true });
  }

  return Response.json({ ok: false, error: 'Acción inválida.' }, { status: 400 });
}

export async function onRequestDelete({ request, env }) {
  const url = new URL(request.url);
  const logId = url.searchParams.get('log');
  const ticketId = url.searchParams.get('ticket');
  try {
    if (logId) await env.DB.prepare('DELETE FROM personal_logistica WHERE id = ?').bind(logId).run();
    if (ticketId) await env.DB.prepare('DELETE FROM tickets WHERE id = ?').bind(ticketId).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al eliminar.' }, { status: 500 });
  }
}
