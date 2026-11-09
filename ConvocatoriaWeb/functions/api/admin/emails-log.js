// /api/admin/emails-log — registro de correos enviados (con filtros) y exportación CSV.
function csvCell(v) {
  const s = String(v == null ? '' : v);
  return '"' + s.replace(/"/g, '""') + '"';
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const q = String(url.searchParams.get('q') || '').trim();
  const tipo = String(url.searchParams.get('tipo') || '').trim();
  const estado = String(url.searchParams.get('estado') || '').trim();
  const esCsv = url.searchParams.get('format') === 'csv';
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || (esCsv ? 5000 : 300)), 1), 5000);

  let sql = 'SELECT id, destinatario, asunto, tipo, estado, error, referencia, creado_en FROM emails_log WHERE 1=1';
  const params = [];
  if (q) {
    sql += ' AND (destinatario LIKE ? OR asunto LIKE ? OR referencia LIKE ?)';
    const like = '%' + q + '%';
    params.push(like, like, like);
  }
  if (tipo) { sql += ' AND tipo = ?'; params.push(tipo); }
  if (estado) { sql += ' AND estado = ?'; params.push(estado); }
  sql += ' ORDER BY id DESC LIMIT ?';
  params.push(limit);

  try {
    const { results } = await env.DB.prepare(sql).bind(...params).all();

    if (esCsv) {
      const filas = ['"Fecha","Destinatario","Asunto","Tipo","Estado","Error","Referencia"'];
      (results || []).forEach((e) => {
        filas.push([
          csvCell(String(e.creado_en || '').replace('T', ' ').slice(0, 19)),
          csvCell(e.destinatario),
          csvCell(e.asunto),
          csvCell(e.tipo),
          csvCell(e.estado),
          csvCell(e.error || ''),
          csvCell(e.referencia || ''),
        ].join(','));
      });
      return new Response('\uFEFF' + filas.join('\r\n'), {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="correos-hackathon-2026.csv"',
        },
      });
    }

    const { results: porTipo } = await env.DB.prepare(
      'SELECT tipo, COUNT(*) AS c FROM emails_log GROUP BY tipo ORDER BY c DESC'
    ).all();

    const { results: porEstado } = await env.DB.prepare(
      'SELECT estado, COUNT(*) AS c FROM emails_log GROUP BY estado ORDER BY c DESC'
    ).all();

    const { results: totalRow } = await env.DB.prepare('SELECT COUNT(*) AS c FROM emails_log').all();

    return Response.json({
      ok: true,
      emails: results || [],
      porTipo: porTipo || [],
      porEstado: porEstado || [],
      total: (totalRow && totalRow[0] && totalRow[0].c) || 0,
    });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer el registro de correos.' }, { status: 500 });
  }
}
