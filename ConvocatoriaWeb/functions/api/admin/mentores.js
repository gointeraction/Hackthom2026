// /api/admin/mentores — gestión de mentores presenciales (correo con su rol al crearlos).
import { sendEmail } from '../../_lib/mail';

function plantillaMentor({ nombre, equipo, eje }) {
  return `Hola ${nombre},

¡Bienvenido/a como MENTOR del Hackathon UNETI IA 2026!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎓 TU ROL: MENTOR

Acompañarás a los equipos durante las 48 horas de desarrollo,
orientándolos en IA ética, ciberseguridad, pitch y repositorio.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏆 EQUIPO ASIGNADO
${equipo || 'Por asignar'}

🎯 EJE
${eje || 'Por definir'}

📅 FECHAS
Viernes 13 y sábado 14 de noviembre de 2026 (desarrollo continuo con pernocta)

📍 SEDE
Parque Tecnológico + Más Ciencia (IVIC), Caracas
Traslado desde Mincyt (Av. Universidad) el viernes 13 a las 7:00 am.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧭 TU FUNCIÓN COMO MENTOR

  • Orientar técnicamente a tu equipo.
  • Ayudar a aterrizar el MVP.
  • Revisar que el repositorio sea PÚBLICO.
  • Preparar el pitch.
  • Motivar y desbloquear al equipo.

⚠️ Importante: la evaluación la realiza el JURADO, no el mentor.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💬 CANAL
Los equipos te contactarán en el evento. Para coordinación general
usa el canal de Telegram.

📞 CONTACTO
• Telegram: https://t.me/+3u7vzOq8LBFmYzUx

¡Gracias por tu compromiso!

— Comité Organizador
Hackathon UNETI IA 2026`;
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT m.*, t.nombre AS equipo_nombre FROM mentores m LEFT JOIN teams t ON t.id = m.team_id ORDER BY m.id DESC'
    ).all();
    return Response.json({ ok: true, mentores: results });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer mentores.' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });

  // Reenviar el correo con su rol
  if (data.action === 'reenviar') {
    const id = Number(data.id);
    if (!id) return Response.json({ ok: false, error: 'Falta el id.' }, { status: 400 });
    const m = await env.DB.prepare(
      'SELECT m.*, t.nombre AS equipo_nombre, t.eje AS equipo_eje FROM mentores m LEFT JOIN teams t ON t.id = m.team_id WHERE m.id = ?'
    ).bind(id).first();
    if (!m) return Response.json({ ok: false, error: 'Mentor no encontrado.' }, { status: 404 });
    if (!m.correo) return Response.json({ ok: false, error: 'El mentor no tiene correo registrado.', enviado: false }, { status: 400 });

    let enviado = false;
    try {
      const r = await sendEmail(env, {
        to: m.correo,
        subject: 'Tu rol como MENTOR — Hackathon UNETI IA 2026',
        text: plantillaMentor({ nombre: m.nombre, equipo: m.equipo_nombre || '', eje: m.equipo_eje || m.eje || '' }),
        tipo: 'mentor',
        referencia: 'mentor:' + m.id,
      });
      enviado = !!r.ok;
    } catch (e) {
      enviado = false;
    }
    return Response.json({ ok: true, enviado });
  }

  const nombre = String(data.nombre || '').trim();
  const organizacion = String(data.organizacion || '').trim();
  const correo = String(data.correo || '').trim().toLowerCase();
  const telefono = String(data.telefono || '').trim();
  const eje = String(data.eje || '').trim();
  const team_id = data.team_id ? Number(data.team_id) : null;

  if (!nombre) return Response.json({ ok: false, error: 'El nombre es obligatorio.' }, { status: 400 });

  try {
    await env.DB.prepare(
      'INSERT INTO mentores (nombre, organizacion, correo, telefono, eje, team_id, activo) VALUES (?, ?, ?, ?, ?, ?, 1)'
    ).bind(nombre, organizacion, correo, telefono, eje, team_id).run();

    let enviado = false;
    let equipo = '';
    let ejeEquipo = eje;

    if (team_id) {
      const t = await env.DB.prepare('SELECT nombre, eje FROM teams WHERE id = ?').bind(team_id).first();
      if (t) { equipo = t.nombre || ''; ejeEquipo = t.eje || eje; }
    }

    if (correo) {
      try {
        const r = await sendEmail(env, {
          to: correo,
          subject: 'Tu rol como MENTOR — Hackathon UNETI IA 2026',
          text: plantillaMentor({ nombre, equipo, eje: ejeEquipo }),
          tipo: 'mentor',
          referencia: correo,
        });
        enviado = !!r.ok;
      } catch (e) {
        enviado = false;
      }
    }

    return Response.json({ ok: true, enviado, sinCorreo: !correo });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al guardar el mentor.' }, { status: 500 });
  }
}

export async function onRequestDelete({ request, env }) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return Response.json({ ok: false, error: 'Falta el id.' }, { status: 400 });
  try {
    await env.DB.prepare('DELETE FROM mentores WHERE id = ?').bind(id).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al eliminar.' }, { status: 500 });
  }
}
