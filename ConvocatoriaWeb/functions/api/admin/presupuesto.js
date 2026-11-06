// /api/admin/presupuesto — seguimiento de ingresos y egresos.
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM presupuesto ORDER BY id DESC').all();
    const sum = (tipo) => results.filter((r) => r.tipo === tipo).reduce((a, r) => a + (Number(r.monto) || 0), 0);
    const totalIngresos = sum('ingreso');
    const totalEgresos = sum('egreso');
    return Response.json({ ok: true, items: results, totalIngresos, totalEgresos, balance: totalIngresos - totalEgresos });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer presupuesto.' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });

  const concepto = String(data.concepto || '').trim();
  const tipo = String(data.tipo || '');
  const monto = Number(data.monto);
  const categoria = String(data.categoria || '').trim();

  if (!concepto || !['ingreso', 'egreso'].includes(tipo) || !monto) {
    return Response.json({ ok: false, error: 'Concepto, tipo y monto son obligatorios.' }, { status: 400 });
  }

  try {
    await env.DB.prepare('INSERT INTO presupuesto (concepto, tipo, monto, categoria) VALUES (?, ?, ?, ?)')
      .bind(concepto, tipo, monto, categoria).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'No se pudo guardar.' }, { status: 500 });
  }
}
