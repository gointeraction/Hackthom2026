// /api/asistencia — registro de asistencia remota (check-in).
import { sendEmail } from '../_lib/mail';

async function verifyTurnstile(env, token, action, ip) {
  if (!token || !env.TURNSTILE_SECRET) return false;
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token, remoteip: ip || '' }),
    });
    const result = await r.json();
    return result.success === true && result.action === action && result.hostname === 'hackathon-uneti-ia.pages.dev';
  } catch (e) {
    return false;
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });

  const ip = request.headers.get('CF-Connecting-IP') || '';
  if (!(await verifyTurnstile(env, String(data.turnstile || ''), 'asistencia', ip))) {
    return Response.json({ ok: false, error: 'Verificación de seguridad fallida.' }, { status: 403 });
  }

  const correo = String(data.correo || '').trim().toLowerCase();
  if (!correo) {
    return Response.json({ ok: false, error: 'Ingresa tu correo.' }, { status: 400 });
  }

  const reg = await env.DB.prepare('SELECT id, nombre FROM registrations WHERE correo = ?').bind(correo).first();
  if (!reg) {
    return Response.json({ ok: false, error: 'No encontramos tu inscripción con ese correo.' }, { status: 404 });
  }

  try {
    await env.DB.prepare('INSERT INTO asistencia_remota (registro_id) VALUES (?)').bind(reg.id).run();
    try {
      await sendEmail(env, {
        to: correo,
        subject: 'Asistencia registrada — Hackathon UNETI IA 2026',
        text: `Hola ${reg.nombre},\n\nTu asistencia al Hackathon UNETI IA 2026 ha sido registrada correctamente.\n\n— Comité Organizador\nHackathon UNETI IA 2026`,
      });
    } catch (e) {}
    return Response.json({ ok: true, message: 'Asistencia registrada. ¡Bienvenido!' });
  } catch (err) {
    return Response.json({ ok: false, error: 'No se pudo registrar la asistencia.' }, { status: 500 });
  }
}
