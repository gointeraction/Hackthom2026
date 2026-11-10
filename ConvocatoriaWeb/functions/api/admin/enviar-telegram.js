// /api/admin/enviar-telegram — envía el comunicado del canal de Telegram a todos los inscritos.
import { sendEmail } from '../../_lib/mail';
import { plantillaTelegram } from '../../_lib/correo-telegram';

const ASUNTO = '📲 Únete al canal oficial de Telegram — Hackathon UNETI IA 2026';

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      "SELECT COUNT(*) AS c FROM registrations WHERE correo IS NOT NULL AND correo <> ''"
    ).all();
    return Response.json({ ok: true, total: (results && results[0] && results[0].c) || 0 });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al contar inscritos.' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => ({}));

  let lista = [];
  try {
    const filtroMod = String(data.modalidad || '').trim();
    let sql = "SELECT id, nombre, apellido, correo, codigo, modalidad FROM registrations WHERE correo IS NOT NULL AND correo <> ''";
    const params = [];
    if (filtroMod === 'remoto' || filtroMod === 'presencial') {
      sql += ' AND modalidad = ?';
      params.push(filtroMod);
    }
    sql += ' ORDER BY id ASC';
    const { results } = await env.DB.prepare(sql).bind(...params).all();
    lista = results || [];
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer inscritos.' }, { status: 500 });
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
          subject: ASUNTO,
          text: plantillaTelegram({ nombre }),
          tipo: 'comunicado-telegram',
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
