// _lib/instructivo-remoto.js — plantilla y envío del instructivo del panel remoto.
import { sendEmail } from './mail';

export function plantillaInstructivoRemoto({ nombre, codigo }) {
  return `Hola ${nombre},

¡Ya está disponible tu panel remoto del Hackathon UNETI IA 2026!

Desde aquí podrás reportar tu proyecto, actualizar tus avances, consultar a los mentores y hablar con Unitron (tu mentor virtual IA).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 ACCEDE AQUÍ
https://hackathon-uneti-ia.pages.dev/remoto

Tu código de participante: ${codigo}

⚠️ Guarda este código. Es tu llave de acceso y lo usarás durante todo el evento.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎥 TRANSMISIÓN EN VIVO

Sigue el evento en directo por YouTube:
https://www.youtube.com/watch?v=oNbL-NB3aXo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 1. REPORTA TU PROYECTO

Al entrar con tu código verás el formulario "Entrega de proyecto".
Completa estos campos:

  • Repositorio GitHub/GitLab (OBLIGATORIO)
    Ejemplo: https://github.com/usuario/mi-proyecto
    ⚠️ El repositorio DEBE SER PÚBLICO. Si es privado, el sistema lo rechazará y no podrás entregar.

  • Nombre del proyecto (opcional)
  • Enlace de demo (opcional)
  • Video demo (opcional, YouTube o similar)
  • Presentación / deck (opcional)
  • Tecnologías usadas (ej. React, Cloudflare, Python)
  • Descripción breve: ¿qué problema resuelve tu proyecto?

Pulsa "Enviar entrega" y recibirás confirmación por correo.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔄 2. ACTUALIZA TUS AVANCES

Puedes volver a enviar el formulario LAS VECES QUE NECESITES.
El sistema guarda SIEMPRE la última versión.

Recomendación: actualiza tu entrega al menos 2 veces:
  • Al inicio: repositorio y descripción inicial.
  • Antes del pitch: demo, video y descripción final.

Así el jurado verá tu avance real.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💬 3. CONSULTA A MENTORES

¿Tienes una duda técnica o de negocio?
Usa el formulario "Consulta a mentores". Un mentor revisará tu consulta y te responderá a la brevedad.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 4. HABLA CON UNITRON (MENTOR VIRTUAL IA)

En tu panel encontrarás el chat "Unitron · Mentor Virtual".

Pregúntale lo que necesites:
  • Logística del evento
  • Dudas sobre el proyecto
  • Cómo enfocar tu pitch
  • Criterios de evaluación

Está disponible 24/7 durante el evento.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 5. REGISTRA TU ASISTENCIA

El día del evento, marca tu asistencia desde el panel remoto con el formulario "Registro de asistencia remota".

Esto es obligatorio para optar a los premios.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 FECHAS CLAVE

  • Inicio del evento: viernes 13 de noviembre
  • Desarrollo continuo: 48 horas (participación en línea)
  • Pitch ante el jurado: sábado 14 de noviembre · 3:30 pm
  • Premiación y clausura: sábado 14 de noviembre · 5:30 pm

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 RECOMENDACIONES

  • El repositorio DEBE ser público (GitHub o GitLab). Si es privado, el sistema no lo aceptará.
  • Incluye un README con: qué hace, cómo se instala y cómo se usa.
  • Sube tu demo o video para que el jurado pueda verlo funcionando.
  • Actualiza la descripción antes del pitch.
  • Si usas IA, explica cómo la aplicaste y qué medidas éticas tomaste.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 CONTACTO
• Telegram: https://t.me/+3u7vzOq8LBFmYzUx

¡Éxitos en el hackathon!

— Comité Organizador
Hackathon UNETI IA 2026`;
}

export async function enviarInstructivoRemoto(env, { dryRun = false } = {}) {
  const { results } = await env.DB.prepare(
    "SELECT id, nombre, apellido, correo, codigo FROM registrations WHERE modalidad = 'remoto' AND correo IS NOT NULL AND correo <> '' ORDER BY id ASC"
  ).all();

  const lista = results || [];

  if (dryRun) {
    return { ok: true, dryRun: true, total: lista.length, destinatarios: lista.map((r) => r.correo) };
  }

  let sent = 0;
  let failed = 0;
  const errores = [];

  for (let i = 0; i < lista.length; i += 10) {
    const lote = lista.slice(i, i + 10);
    await Promise.all(lote.map(async (r) => {
      const nombre = `${r.nombre || ''} ${r.apellido || ''}`.trim() || 'Participante';
      try {
        const res = await sendEmail(env, {
          to: r.correo,
          subject: 'Hackathon UNETI IA 2026 Participantes Remotos - Instrucciones',
          text: plantillaInstructivoRemoto({ nombre, codigo: r.codigo || '' }),
          tipo: 'instructivo-remoto',
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

  return { ok: true, total: lista.length, sent, failed, errores: errores.slice(0, 20) };
}
