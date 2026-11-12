// /api/datos-participante — captura de cédula y teléfono faltantes (participantes presenciales).
// GET  ?codigo=XXXX  → devuelve los datos del participante (nombre para confirmar)
// POST { codigo, cedula, telefono } → guarda los datos faltantes

const SOLO_DIGITOS = (s) => String(s || '').replace(/\D+/g, '');

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const codigo = String(url.searchParams.get('codigo') || '').trim().toUpperCase();
  if (!codigo) return Response.json({ ok: false, error: 'Ingresa tu código.' }, { status: 400 });

  try {
    const r = await env.DB.prepare(
      'SELECT nombre, apellido, anio, modalidad, cedula, telefono FROM registrations WHERE codigo = ? LIMIT 1'
    ).bind(codigo).first();

    if (!r) {
      return Response.json({ ok: false, error: 'Código no encontrado. Verifica e intenta de nuevo.' }, { status: 404 });
    }

    return Response.json({
      ok: true,
      nombre: r.nombre || '',
      apellido: r.apellido || '',
      anio: r.anio || '',
      modalidad: r.modalidad || '',
      cedula: r.cedula || '',
      telefono: r.telefono || '',
    });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al consultar el código.' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });

  const codigo = String(data.codigo || '').trim().toUpperCase();
  const cedula = SOLO_DIGITOS(data.cedula);
  const telefono = SOLO_DIGITOS(data.telefono);

  if (!codigo) return Response.json({ ok: false, error: 'Ingresa tu código.' }, { status: 400 });
  if (cedula.length < 5 || cedula.length > 10) {
    return Response.json({ ok: false, error: 'La cédula debe tener entre 5 y 10 dígitos.' }, { status: 400 });
  }
  if (telefono.length < 7 || telefono.length > 15) {
    return Response.json({ ok: false, error: 'El teléfono debe tener entre 7 y 15 dígitos.' }, { status: 400 });
  }

  try {
    const r = await env.DB.prepare(
      'SELECT id, modalidad FROM registrations WHERE codigo = ? LIMIT 1'
    ).bind(codigo).first();

    if (!r) {
      return Response.json({ ok: false, error: 'Código no encontrado.' }, { status: 404 });
    }

    await env.DB.prepare(
      'UPDATE registrations SET cedula = ?, telefono = ? WHERE id = ?'
    ).bind(cedula, telefono, r.id).run();

    return Response.json({ ok: true, message: 'Datos guardados correctamente.' });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al guardar los datos.' }, { status: 500 });
  }
}
