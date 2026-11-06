// /api/admin/enviar-codigos — envía a cada inscrito su código + instrucciones por correo.
import { sendEmail } from '../../_lib/mail';

export async function onRequestPost({ env }) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT nombre, apellido, correo, codigo, group_id FROM registrations ORDER BY id ASC'
    ).all();

    if (results.length === 0) {
      return Response.json({ ok: false, error: 'No hay inscritos todavía.' }, { status: 400 });
    }

    let enviados = 0;
    let fallos = 0;

    for (const r of results) {
      const esIndividual = !r.group_id;
      const tipo = esIndividual ? 'participante' : 'grupo';
      const modalidad = esIndividual ? 'Remota' : 'Grupal (presencial sujeta a preselección)';

      const text = `Hola ${r.nombre},\n\nTu inscripción al Hackathon UNETI IA 2026 está confirmada.\n\nTu código de ${tipo}: ${r.codigo || '—'}\n\nModalidad: ${modalidad}\n\nInstrucciones:\n- Consulta tu estatus, entrega tu proyecto y envía consultas en la zona de participantes del sitio web.\n- Presencial: asiste a la sede (Edificio MPPCT, Piso 12, Av. Universidad, Caracas) los días 13 y 14 de noviembre, de 9:00 am a 6:00 pm.\n- Remoto: sigue la transmisión en vivo en YouTube (@UNETIEducativo) y la agenda remota.\n- Lleva/ten a mano tu código: lo usarás para las consultas a mentores y para identificarte.\n\n— Comité Organizador\nHackathon UNETI IA 2026`;

      try {
        const r2 = await sendEmail(env, {
          to: r.correo,
          subject: 'Tu código de acceso — Hackathon UNETI IA 2026',
          text,
        });
        if (r2 && r2.ok) enviados++; else fallos++;
      } catch (e) {
        fallos++;
      }
    }

    return Response.json({ ok: true, message: `Correos enviados: ${enviados} (fallos: ${fallos}).`, enviados, fallos });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al enviar los correos.' }, { status: 500 });
  }
}
