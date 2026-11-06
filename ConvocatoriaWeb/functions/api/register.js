// /api/register — inscripción individual o grupal (2 a 5 integrantes).
import { sendEmail } from '../_lib/mail';

function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

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
  if (!data) {
    return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });
  }

  if (data._gotcha) {
    return Response.json({ ok: true });
  }

  const ip = request.headers.get('CF-Connecting-IP') || '';
  const token = String(data.turnstile || '');
  if (!(await verifyTurnstile(env, token, 'inscripcion', ip))) {
    return Response.json({ ok: false, error: 'Verificación de seguridad fallida. Recarga la página e inténtalo de nuevo.' }, { status: 403 });
  }

  const tipo = data.tipo === 'grupal' ? 'grupal' : 'individual';
  const propuesta = tipo === 'grupal' ? String(data.propuesta || '').trim() : '';

  let miembros = [];
  if (tipo === 'grupal') {
    miembros = Array.isArray(data.miembros) ? data.miembros : [];
  } else {
    miembros = [data];
  }

  // Normalizar y validar cada integrante
  const limpios = [];
  for (const m of miembros) {
    const nombre = String(m.nombre || '').trim();
    const apellido = String(m.apellido || '').trim();
    const correo = String(m.correo || '').trim().toLowerCase();
    const nacimiento = String(m.nacimiento || '').trim();
    const anio = String(m.anio || '').trim();

    if (!nombre || !apellido || !correo || !validEmail(correo)) {
      return Response.json(
        { ok: false, error: 'Revisa que todos los integrantes tengan nombre, apellido y correo válido.' },
        { status: 400 }
      );
    }
    limpios.push({ nombre, apellido, correo, nacimiento, anio });
  }

  if (tipo === 'grupal' && limpios.length !== 5) {
    return Response.json({ ok: false, error: 'El grupo debe tener exactamente 5 integrantes.' }, { status: 400 });
  }
  if (tipo === 'grupal' && propuesta.length < 10) {
    return Response.json({ ok: false, error: 'Describe la propuesta de desarrollo de tu equipo.' }, { status: 400 });
  }
  if (tipo === 'individual' && limpios.length !== 1) {
    return Response.json({ ok: false, error: 'Registro individual inválido.' }, { status: 400 });
  }

  // Evitar correos duplicados
  for (const m of limpios) {
    const existing = await env.DB.prepare('SELECT id FROM registrations WHERE correo = ?').bind(m.correo).first();
    if (existing) {
      return Response.json({ ok: false, error: `El correo ${m.correo} ya está registrado.` }, { status: 409 });
    }
  }

  const group_id = tipo === 'grupal' ? crypto.randomUUID() : null;
  const codigo = crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();

  try {
    const mod = tipo === 'individual' ? 'remoto' : null;
    for (let i = 0; i < limpios.length; i++) {
      const m = limpios[i];
      const token = crypto.randomUUID();
      const prop = (tipo === 'grupal' && i === 0) ? propuesta : null;
      await env.DB.prepare(
        'INSERT INTO registrations (nombre, apellido, correo, nacimiento, anio, group_id, validated, validation_token, propuesta, modalidad, codigo) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)'
      ).bind(m.nombre, m.apellido, m.correo, m.nacimiento, m.anio, group_id, token, prop, mod, codigo).run();
    }
    // Enviar correos de confirmación (best-effort)
    try {
      const subject = tipo === 'individual'
        ? 'Inscripción confirmada — Hackathon UNETI IA 2026'
        : 'Inscripción de grupo recibida — Hackathon UNETI IA 2026';
      await Promise.all(limpios.map((m) => sendEmail(env, {
        to: m.correo,
        subject,
        text: `Hola ${m.nombre},\n\nTu inscripción al Hackathon UNETI IA 2026 ha sido registrada correctamente.\n\nCódigo de ${tipo === 'individual' ? 'participante' : 'grupo'}: ${codigo}\n\nModalidad: ${tipo === 'individual' ? 'remota' : 'grupal (sujeta a preselección por propuesta)'}.\n\nPronto recibirás el instructivo, la agenda y los criterios de selección.\n\n— Comité Organizador\nHackathon UNETI IA 2026`,
      })));
    } catch (e) {
      // no bloqueamos la inscripción por un fallo en el correo
    }

    return Response.json({ ok: true, message: 'Inscripción registrada correctamente.', codigo });
  } catch (err) {
    return Response.json({ ok: false, error: 'No se pudo guardar la inscripción.' }, { status: 500 });
  }
}
