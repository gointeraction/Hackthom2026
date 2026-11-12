// /api/admin/enviar-confirma-presencial — correo de confirmación de asistencia a presenciales.
import { sendEmail } from '../../_lib/mail';
import { plantillaConfirmaPresencial, ASUNTO_CONFIRMA_PRESENCIAL } from '../../_lib/correo-confirma-presencial';

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      "SELECT COUNT(*) AS c FROM registrations WHERE modalidad = 'presencial' AND correo IS NOT NULL AND correo <> ''"
    ).all();
    return Response.json({ ok: true, total: (results && results[0] && results[0].c) || 0 });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al contar presenciales.' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => ({}));

  // Envío de prueba a una dirección concreta (usa un participante real como muestra)
  if (data.test) {
    const to = String(data.test).trim();
    if (!to) return Response.json({ ok: false, error: 'Falta la dirección de prueba.' }, { status: 400 });

    let nombre = 'Participante';
    let codigo = 'ABCD1234';
    try {
      const s = await env.DB.prepare(
        "SELECT nombre, apellido, codigo FROM registrations WHERE modalidad = 'presencial' ORDER BY id ASC LIMIT 1"
      ).first();
      if (s) {
        nombre = `${s.nombre || ''} ${s.apellido || ''}`.trim() || nombre;
        codigo = s.codigo || codigo;
      }
    } catch (e) {}

    const res = await sendEmail(env, {
      to,
      subject: '[PRUEBA] ' + ASUNTO_CONFIRMA_PRESENCIAL,
      text: plantillaConfirmaPresencial({ nombre, codigo }),
      tipo: 'confirma-presencial-prueba',
      referencia: to,
    });

    return Response.json({ ok: !!res.ok, enviado: !!res.ok, to, nombre, codigo, error: res.error || null });
  }

  // Envío masivo a todos los presenciales
  let lista = [];
  try {
    const { results } = await env.DB.prepare(
      "SELECT id, nombre, apellido, correo, codigo FROM registrations WHERE modalidad = 'presencial' AND correo IS NOT NULL AND correo <> '' ORDER BY id ASC"
    ).all();
    lista = results || [];
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer presenciales.' }, { status: 500 });
  }

  if (data.dryRun === true) {
    return Response.json({ ok: true, dryRun: true, total: lista.length });
  }

  let sent = 0;
  let failed = 0;
  const errores = [];

  for (let i = 0; i < lista.length; i += 8) {
    const lote = lista.slice(i, i + 8);
    await Promise.all(lote.map(async (r) => {
      const nombre = `${r.nombre || ''} ${r.apellido || ''}`.trim() || 'Participante';
      try {
        const res = await sendEmail(env, {
          to: r.correo,
          subject: ASUNTO_CONFIRMA_PRESENCIAL,
          text: plantillaConfirmaPresencial({ nombre, codigo: r.codigo || '' }),
          tipo: 'confirma-presencial',
          referencia: r.codigo || r.correo,
        });
        if (res.ok) sent++;
        else { failed++; errores.push({ correo: r.correo, error: res.error || 'send_failed' }); }
      } catch (e) {
        failed++;
        errores.push({ correo: r.correo, error: String(e && e.message) });
      }
    }));
  }

  return Response.json({ ok: true, total: lista.length, sent, failed, errores: errores.slice(0, 10) });
}
