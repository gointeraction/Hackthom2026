// /api/admin/mentores — gestión de mentores presenciales.
import { sendEmail } from '../../_lib/mail';

function plantillaMentor({ nombre, equipo, eje }) {
  return `Hola ${nombre},

¡Gracias por acompañarnos como mentor del Hackathon UNETI IA 2026!

🏆 EQUIPO ASIGNADO
${equipo || 'Por asignar'}

🎯 EJE
${eje || 'Por definir'}

📅 DISPONIBILIDAD
Viernes 13 y sábado 14 de noviembre de 2026
Sede: Parque Tecnológico + Más Ciencia (IVIC)

💬 CANAL
Los equipos te contactarán en el evento. Para coordinación general usa el canal de Telegram.

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

    if (correo) {
      let equipo = '';
      let ejeEquipo = eje;
      if (team_id) {
        const t = await env.DB.prepare('SELECT nombre, eje FROM teams WHERE id = ?').bind(team_id).first();
        if (t) { equipo = t.nombre || ''; ejeEquipo = t.eje || eje; }
      }
      sendEmail(env, {
        to: correo,
        subject: 'Asignación como mentor — Hackathon UNETI IA 2026',
        text: plantillaMentor({ nombre, equipo, eje: ejeEquipo }),
      }).catch(() => {});
    }

    return Response.json({ ok: true });
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
