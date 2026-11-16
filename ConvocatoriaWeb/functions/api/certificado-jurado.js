// /api/certificado-jurado — datos del certificado de jurado por código.
// Reutiliza el código del jurado (tabla `judges`).
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const codigo = String(url.searchParams.get('codigo') || '').trim().toUpperCase();

  if (!codigo) {
    return Response.json({ ok: false, error: 'Ingresa tu código de jurado.' }, { status: 400 });
  }

  try {
    const r = await env.DB.prepare(
      'SELECT codigo, nombre, organizacion FROM judges WHERE codigo = ? LIMIT 1'
    ).bind(codigo).first();

    if (!r) {
      return Response.json({ ok: false, error: 'Código no válido. Verifícalo e intenta de nuevo.' }, { status: 404 });
    }

    return Response.json({
      ok: true,
      codigo: r.codigo,
      nombre: r.nombre,
      organizacion: r.organizacion || '',
    });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al consultar el código.' }, { status: 500 });
  }
}
