// /api/certificado — datos para el certificado de participación por código.
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const codigo = String(url.searchParams.get('codigo') || '').trim().toUpperCase();
  if (!codigo) return Response.json({ ok: false, error: 'Falta el código.' }, { status: 400 });
  try {
    const reg = await env.DB.prepare('SELECT nombre, apellido, modalidad FROM registrations WHERE codigo = ?').bind(codigo).first();
    if (!reg) return Response.json({ ok: false, error: 'Código no encontrado.' }, { status: 404 });
    return Response.json({
      ok: true,
      nombre: ((reg.nombre || '') + ' ' + (reg.apellido || '')).trim(),
      modalidad: reg.modalidad || '',
      codigo,
    });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error.' }, { status: 500 });
  }
}
