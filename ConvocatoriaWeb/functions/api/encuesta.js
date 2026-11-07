// /api/encuesta — encuesta de feedback (NPS) del evento.
export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });

  const puntaje = parseInt(data.puntaje, 10);
  if (!(puntaje >= 1 && puntaje <= 10)) {
    return Response.json({ ok: false, error: 'El puntaje debe estar entre 1 y 10.' }, { status: 400 });
  }
  const codigo = String(data.codigo || '').trim().toUpperCase().slice(0, 20);
  const comentario = String(data.comentario || '').trim().slice(0, 1000);

  try {
    await env.DB.prepare('INSERT INTO encuestas (codigo, puntaje, comentario) VALUES (?, ?, ?)')
      .bind(codigo, puntaje, comentario).run();
    return Response.json({ ok: true, message: '¡Gracias por tu feedback!' });
  } catch (err) {
    return Response.json({ ok: false, error: 'No se pudo guardar.' }, { status: 500 });
  }
}
