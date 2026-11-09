// /api/admin/teams — CRUD básico de equipos (lee y agrega)
import { sendEmail } from '../../_lib/mail';

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM teams ORDER BY id ASC').all();
    const teams = results.map((t) => ({
      ...t,
      integrantes: JSON.parse(t.integrantes || '[]'),
    }));
    return Response.json({ ok: true, teams });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer los equipos.' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) {
    return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });
  }

  const nombre = String(data.nombre || '').trim();
  const mentor = String(data.mentor || '').trim();
  const eje = String(data.eje || '').trim();
  const proyecto = String(data.proyecto || '').trim();
  const contacto_email = String(data.contacto_email || '').trim().toLowerCase();
  const integrantes = Array.isArray(data.integrantes)
    ? data.integrantes.map((n) => String(n).trim()).filter(Boolean)
    : [];

  if (!nombre || !mentor || !eje) {
    return Response.json({ ok: false, error: 'Nombre, mentor y eje son obligatorios.' }, { status: 400 });
  }
  if (integrantes.length === 0) {
    return Response.json({ ok: false, error: 'Debes indicar al menos un integrante.' }, { status: 400 });
  }

  try {
    const codigo = crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
    const result = await env.DB.prepare(
      'INSERT INTO teams (nombre, mentor, eje, proyecto, integrantes, codigo, contacto_email, origen, modalidad) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(nombre, mentor, eje, proyecto, JSON.stringify(integrantes), codigo, contacto_email, 'comite', 'presencial').run();
    const teamId = (result.meta && result.meta.last_row_id) ? result.meta.last_row_id : null;

    if (contacto_email) {
      try {
        await sendEmail(env, {
          to: contacto_email,
          subject: 'Código de grupo — Hackathon UNETI IA 2026',
          text: `Hola ${nombre},\n\nTu equipo "${nombre}" ha sido conformado.\n\nNúmero de grupo: ${teamId || '—'}\nCódigo de grupo: ${codigo}\n\nUsa estos datos para entregar tu proyecto en la zona de participantes.\n\n— Comité Organizador\nHackathon UNETI IA 2026`,
        });
      } catch (e) {}
    }

    return Response.json({ ok: true, codigo });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al guardar el equipo.' }, { status: 500 });
  }
}
