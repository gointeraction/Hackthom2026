// /api/estatus — consulta pública del estatus de un participante por correo.
export async function onRequestGet({ request, env }) {
  const correo = (new URL(request.url).searchParams.get('correo') || '').trim().toLowerCase();
  if (!correo) {
    return Response.json({ ok: false, error: 'Ingresa tu correo.' }, { status: 400 });
  }
  const reg = await env.DB.prepare(
    'SELECT nombre, apellido, correo, modalidad, acreditado, codigo FROM registrations WHERE correo = ?'
  ).bind(correo).first();
  if (!reg) {
    return Response.json({ ok: false, error: 'No encontramos tu inscripción.' }, { status: 404 });
  }
  return Response.json({ ok: true, registro: reg });
}
