// _lib/correo-jurado.js — correo de acceso para jurados.
import { sendEmail } from './mail';

export function plantillaJurado({ nombre, codigo }) {
  return `Hola ${nombre},

¡Bienvenido/a como JURADO del Hackathon UNETI IA 2026!

Tu código de acceso es:

    ${codigo}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 ACCEDE AL PANEL DE JURADO
https://hackathon-uneti-ia.pages.dev/jurado

Ingresa tu código y podrás evaluar los proyectos de los equipos.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 EVALUACIÓN
Sábado 14 de noviembre de 2026 · 3:30 pm – 6:00 pm

📍 SEDE
Parque Tecnológico + Más Ciencia (IVIC), Caracas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 RÚBRICA (1 a 5 por criterio)

  • Viabilidad técnica / calidad del MVP — 25 %
  • Impacto y relevancia del problema — 20 %
  • Innovación y uso de IA — 20 %
  • Calidad del pitch — 15 %
  • Ética y responsabilidad de la IA — 10 %
  • Escalabilidad / sostenibilidad — 10 %

El puntaje final es la suma ponderada (máximo 5.00).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ GUARDA ESTE CÓDIGO
Es personal e intransferible. No lo compartas.

Si lo pierdes, solicítalo al Comité Organizador.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 CONTACTO
• Telegram: https://t.me/+3u7vzOq8LBFmYzUx

¡Gracias por aportar tu experiencia al talento emergente del país!

— Comité Organizador
Hackathon UNETI IA 2026`;
}

export async function enviarCorreoJurado(env, { nombre, correo, codigo }) {
  if (!correo) return { ok: false, error: 'Sin correo' };
  return sendEmail(env, {
    to: correo,
    subject: 'Tu código de acceso como Jurado — Hackathon UNETI IA 2026',
    text: plantillaJurado({ nombre, codigo }),
  });
}
