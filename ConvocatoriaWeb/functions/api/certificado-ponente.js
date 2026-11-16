// /api/certificado-ponente — datos del certificado de ponente por código.
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const codigo = String(url.searchParams.get('codigo') || '').trim().toUpperCase();

  if (!codigo) {
    return Response.json({ ok: false, error: 'Ingresa tu código de ponente.' }, { status: 400 });
  }

  try {
    const r = await env.DB.prepare(
      'SELECT codigo, ponente, titulo, dia, hora_inicio, hora_fin FROM certificados_ponentes WHERE codigo = ? LIMIT 1'
    ).bind(codigo).first();

    if (!r) {
      return Response.json({ ok: false, error: 'Código no válido. Verifícalo e intenta de nuevo.' }, { status: 404 });
    }

    return Response.json({
      ok: true,
      codigo: r.codigo,
      nombre: r.ponente,
      ponente: r.ponente,
      titulo: r.titulo || '',
      dia: r.dia || null,
      hora_inicio: r.hora_inicio || '',
      hora_fin: r.hora_fin || '',
    });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al consultar el código.' }, { status: 500 });
  }
}
