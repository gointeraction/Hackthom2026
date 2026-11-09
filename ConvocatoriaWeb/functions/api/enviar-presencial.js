// /api/enviar-presencial — envía la plantilla de instrucciones presenciales (protegido).
import { sendEmail } from '../_lib/mail';

function plantilla({ nombre, codigo }) {
  return `Hola ${nombre},

¡Es un gusto confirmarte que participas de forma PRESENCIAL en el Hackathon UNETI IA 2026!

Tu código de participante es: ${codigo}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 FECHAS
Viernes 13 y sábado 14 de noviembre de 2026

📍 SEDE
Parque Tecnológico + Más Ciencia (IVIC)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ PUNTO DE ENCUENTRO — VIERNES 13 DE NOVIEMBRE

Debes estar en la sede del Mincyt (Av. Universidad, Caracas) a las 7:00 am EN PUNTO.

El traslado al IVIC sale puntualmente a esa hora. Te recomendamos llegar 15 minutos antes.

Al finalizar el evento (sábado 14, 6:00 pm), el traslado te regresa a la sede del Mincyt.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎒 QUÉ DEBES LLEVAR

• Cédula de identidad
• Laptop y cargador (opcional — contamos con equipos)
• Ropa cómoda y abrigo ligero (hay pernocta)
• Artículos de higiene personal y una muda de ropa
• Medicamentos personales (si aplica)
• Botella de agua reutilizable
• Extensión eléctrica y adaptadores (recomendado)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🩺 SALUD E INDICACIONES ESPECIALES

Por favor, infórmanos CON TIEMPO (antes del evento) acerca de:

• ALERGIAS O INTOLERANCIAS ALIMENTARIAS
  Para ajustar el menú de cena, desayuno y refrigerios.

• MEDICAMENTOS
  Si debes tomar algún medicamento durante el evento, indícanos el NOMBRE y los HORARIOS.

• REFRIGERACIÓN
  Si requieres refrigerar algún medicamento, avísanos para asignarte un espacio.

Escríbenos por Telegram: https://t.me/+3u7vzOq8LBFmYzUx
Asunto: "Salud — [Tu nombre / código]"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ ACREDITACIÓN

Viernes 13, de 8:00 a 9:00 am, en el punto de acreditación del IVIC.
Presenta tu código de participante y tu cédula.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌙 PERNOCTA

La pernocta se realiza en las instalaciones del IVIC.
El comité provee cena, desayuno, hidratación y acompañamiento.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 DINÁMICA DEL EVENTO

• Apertura y bienvenida (9:00 am)
• Charlas técnicas (DeepSeek Harness, Antigravity, Cloudflare, Ciberseguridad, Agentes IA)
• Conformación de equipos y desarrollo
• Desarrollo continuo durante la pernocta
• Pitch ante el jurado (sábado 14, 3:30 pm)
• Premiación y clausura (5:30 pm)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ REGLAS DE CONVIVENCIA

• Trato respetuoso e inclusivo entre todos.
• Prohibido el consumo de alcohol y sustancias ilícitas.
• Uso responsable de las instalaciones y equipos.
• El incumplimiento del Código de Conducta puede implicar la descalificación.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 CONTACTO

• Telegram: https://t.me/+3u7vzOq8LBFmYzUx
• Telegram: https://t.me/+3u7vzOq8LBFmYzUx

¡Nos vemos el viernes 13 a las 7:00 am en el Mincyt!

— Comité Organizador
Hackathon UNETI IA 2026`;
}

export async function onRequestPost({ request, env }) {
  const secret = request.headers.get('X-Backup-Secret') || '';
  if (!env.BACKUP_SECRET || secret !== env.BACKUP_SECRET) {
    return Response.json({ ok: false, error: 'No autorizado.' }, { status: 401 });
  }

  const data = await request.json().catch(() => ({}));
  const to = String(data.to || '').trim().toLowerCase();
  if (!to) return Response.json({ ok: false, error: 'Falta el destinatario.' }, { status: 400 });

  const reg = await env.DB.prepare(
    'SELECT nombre, apellido, codigo FROM registrations WHERE correo = ?'
  ).bind(to).first();

  const nombre = reg ? `${reg.nombre} ${reg.apellido || ''}`.trim() : 'Participante';
  const codigo = reg ? reg.codigo : 'DEMO-0001';

  const r = await sendEmail(env, {
    to,
    subject: 'Instrucciones de participación presencial — Hackathon UNETI IA 2026',
    text: plantilla({ nombre, codigo }),
  });

  return Response.json({ ok: r.ok, to, nombre, codigo, error: r.error || null });
}
