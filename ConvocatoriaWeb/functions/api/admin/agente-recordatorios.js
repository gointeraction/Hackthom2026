// /api/admin/agente-recordatorios — envía recordatorios a quienes no han entregado su proyecto.
import { sendEmail } from '../../_lib/mail';

export async function onRequestPost({ env }) {
  const { results } = await env.DB.prepare(
    'SELECT codigo, nombre, correo FROM registrations WHERE codigo IS NOT NULL ORDER BY id'
  ).all();
  const seen = new Map();
  for (const r of results) if (!seen.has(r.codigo)) seen.set(r.codigo, r);

  const { results: entregas } = await env.DB.prepare('SELECT codigo FROM entregas').all();
  const entregados = new Set(entregas.map((e) => e.codigo));

  let enviados = 0;
  let fallos = 0;
  for (const [codigo, r] of seen.entries()) {
    if (entregados.has(codigo)) continue;
    const text = `Hola ${r.nombre},\n\nTe recordamos que aún no has entregado tu proyecto (repositorio GitHub) en el Hackathon UNETI IA 2026.\n\nIngresa a tu panel remoto y entrega tu repositorio antes de la fecha límite.\n\n— Comité Organizador\nHackathon UNETI IA 2026`;
    try {
      const r2 = await sendEmail(env, { to: r.correo, subject: 'Recordatorio: entrega tu proyecto — Hackathon UNETI IA 2026', text });
      if (r2 && r2.ok) enviados++; else fallos++;
    } catch (e) { fallos++; }
  }

  return Response.json({ ok: true, message: `Recordatorios enviados: ${enviados} (fallos: ${fallos}).`, enviados, fallos });
}
