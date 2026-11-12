// _lib/correo-confirma-presencial.js — correo de confirmación de asistencia presencial.
export function plantillaConfirmaPresencial({ nombre, codigo }) {
  return `Hola ${nombre},

¡Ya casi comienza el Hackathon UNETI IA 2026!

Estás registrado en la modalidad PRESENCIAL y necesitamos confirmar tu asistencia para la acreditación y la logística del evento.

👉 CONFIRMA AQUÍ
https://hackathon-uneti-ia.pages.dev/datos

Tu código de participante: ${codigo}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿CÓMO CONFIRMAR?

  1. Ingresa tu código de participante.
  2. Verifica que tu nombre sea el correcto.
  3. Completa tu cédula y tu teléfono.
  4. Pulsa "Confirmar mi asistencia".

Solo toma 1 minuto.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚌 SALIDA DEL TRANSPORTE

  📍 Punto de encuentro: sede Mincyt (Av. Universidad)
  🕖 Salida: viernes 13 de noviembre a las 7:00 am
  ⏰ DEBES ESTAR MEDIA HORA ANTES: 6:30 am

  ⚠️ El transporte sale puntual a las 7:00 am.
     Si llegas después, no podremos esperarte.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿POR QUÉ ES IMPORTANTE CONFIRMAR?

  • Tu acreditación en la sede.
  • El control de acceso y seguridad.
  • La logística de comidas y pernocta.
  • Tu cupo en el traslado.
  • Tu certificado de participación.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 VIERNES 13 Y SÁBADO 14 DE NOVIEMBRE DE 2026
📍 Parque Tecnológico + Más Ciencia (IVIC)

⏰ Confirma antes del viernes 13 de noviembre a las 6:00 am.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ Si no confirmas, no podremos garantizar tu acreditación
   ni tu cupo en el traslado.

📲 Mantente informado en el canal oficial de Telegram:
https://t.me/+3u7vzOq8LBFmYzUx

¡Nos vemos en el evento!

— Comité Organizador
Hackathon UNETI IA 2026`;
}

export const ASUNTO_CONFIRMA_PRESENCIAL = 'Confirma tu asistencia presencial — Hackathon UNETI IA 2026';
