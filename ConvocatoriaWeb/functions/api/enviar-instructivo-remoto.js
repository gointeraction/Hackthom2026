// /api/enviar-instructivo-remoto — envío programado del instructivo a participantes remotos.
// Protegido por X-Backup-Secret (usado por el cron de GitHub Actions).
import { enviarInstructivoRemoto, plantillaInstructivoRemoto } from '../_lib/instructivo-remoto';
import { sendEmail } from '../_lib/mail';

const ASUNTO = 'Tu panel remoto está listo — reporta tu proyecto y avances · Hackathon UNETI IA 2026';

export async function onRequestPost({ request, env }) {
  const secret = request.headers.get('X-Backup-Secret') || '';
  if (!env.BACKUP_SECRET || secret !== env.BACKUP_SECRET) {
    return Response.json({ ok: false, error: 'No autorizado.' }, { status: 401 });
  }

  const data = await request.json().catch(() => ({}));

  // Envío de prueba a una dirección concreta (usa un remoto real como muestra)
  if (data.test) {
    const to = String(data.test).trim();
    if (!to) return Response.json({ ok: false, error: 'Falta la dirección de prueba.' }, { status: 400 });

    let nombre = 'Participante';
    let codigo = 'ABCD1234';
    try {
      const s = await env.DB.prepare(
        "SELECT nombre, apellido, codigo FROM registrations WHERE modalidad = 'remoto' ORDER BY id ASC LIMIT 1"
      ).first();
      if (s) {
        nombre = `${s.nombre || ''} ${s.apellido || ''}`.trim() || nombre;
        codigo = s.codigo || codigo;
      }
    } catch (e) {}

    const res = await sendEmail(env, {
      to,
      subject: '[PRUEBA] ' + ASUNTO,
      text: plantillaInstructivoRemoto({ nombre, codigo }),
      tipo: 'instructivo-remoto-prueba',
      referencia: to,
    });

    return Response.json({ ok: !!res.ok, enviado: !!res.ok, to, nombre, codigo, error: res.error || null });
  }

  try {
    const res = await enviarInstructivoRemoto(env, { dryRun: data.dryRun === true });
    return Response.json(res);
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al enviar el instructivo.' }, { status: 500 });
  }
}
