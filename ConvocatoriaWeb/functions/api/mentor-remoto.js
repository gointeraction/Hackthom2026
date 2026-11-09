// /api/mentor-remoto — Unitron Mentor: agente de apoyo para equipos remotos (Workers AI + contexto del participante).
import { logError } from '../_lib/log';

const BASE = `Eres "Unitron Mentor", el mentor virtual del Hackathon UNETI IA 2026 (IA Ética y Ciberseguridad). El evento es los días viernes 13 y sábado 14 de noviembre de 2026, con desarrollo continuo de 48 horas y pernocta, en el Parque Tecnológico + Más Ciencia (IVIC), Caracas. El traslado sale de la sede Mincyt (Av. Universidad) el viernes 13 a las 7:00 am y regresa el sábado 14 a las 6:00 pm. La modalidad es presencial, con participantes remotos conectados en línea.

Horario clave:
- Viernes 13: 7:00 am salida Mincyt → IVIC; 8:00–9:00 acreditación; 9:00 apertura; 9:30–12:30 charlas (DeepSeek Harness, Antigravity, Cloudflare, Ciberseguridad); 12:30 almuerzo; 13:30 conformación de equipos; 14:00–18:00 desarrollo; 18:00 cena; 19:00–7:00 desarrollo continuo con pernocta.
- Sábado 14: 7:00–8:30 desayuno; 9:00 repaso; 9:30–10:40 charlas (Agentes IA, Ciberseguridad); 11:00 refrigerio; 11:30–13:00 desarrollo final; 13:00 almuerzo; 14:00–15:30 preparación de pitch; 15:30–17:30 presentaciones ante el jurado; 17:30 premiación y clausura; 18:00 traslado IVIC → Mincyt.

Tu rol es apoyar a los equipos remotos con:
1) Dudas de logística y del evento: agenda, horarios, entrega de proyectos, acreditación, asistencia remota, criterios de evaluación, instructivo.
2) Orientación técnica: IA ética, ciberseguridad, pitch, repositorio GitHub (debe ser público), demo.
3) Recomendaciones según su proyecto (si han entregado repositorio).

Los participantes remotos entregan su proyecto en https://hackathon-uneti-ia.pages.dev/remoto usando su código, y pueden actualizar su entrega cuantas veces quieran.

Reglas: responde en español, claro y breve (máx 150 palabras). Sé empático y motivador. Si no sabes algo, dilo con honestidad; no inventes datos.`;

function repararTexto(s) {
  if (!s) return s;
  if (/[ÃÂ]/.test(s)) {
    try {
      const bytes = new Uint8Array([...s].map((c) => c.charCodeAt(0) & 0xff));
      const dec = new TextDecoder('utf-8').decode(bytes);
      if (dec && dec !== s && !/[ÃÂ]/.test(dec)) return dec;
    } catch (e) {}
  }
  return s;
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) {
    return Response.json({ error: 'Solicitud inválida.' }, { status: 400 });
  }

  const codigo = String(data.codigo || '').trim().toUpperCase();
  const mensaje = String(data.mensaje || '').trim();
  const historial = Array.isArray(data.historial) ? data.historial.slice(-8) : [];

  if (!codigo || !mensaje) {
    return Response.json({ error: 'Código y mensaje son obligatorios.' }, { status: 400 });
  }

  // Contexto del participante (aporte personalizado)
  let contexto = '';
  try {
    const reg = await env.DB.prepare(
      'SELECT nombre, apellido, modalidad, anio FROM registrations WHERE codigo = ? LIMIT 1'
    ).bind(codigo).first();
    const entrega = await env.DB.prepare(
      'SELECT repositorio, proyecto, demo FROM entregas WHERE codigo = ?'
    ).bind(codigo).first();
    if (reg) {
      contexto += `Participante: ${reg.nombre} ${reg.apellido}. Año: ${reg.anio || '—'}. Modalidad: ${reg.modalidad || 'remota'}.\n`;
    }
    if (entrega) {
      contexto += `Proyecto entregado: ${entrega.proyecto || '—'}. Repositorio: ${entrega.repositorio}. Demo: ${entrega.demo || '—'}.\n`;
    }
  } catch (e) {}

  const system = BASE + (contexto ? `\n\nContexto del participante:\n${contexto}` : '');

  const messages = [
    { role: 'system', content: system },
    ...historial.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: mensaje },
  ];

  try {
    const result = await env.AI.run('@cf/zai-org/glm-4.7-flash', { messages });
    const raw =
      (result && result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) ||
      (result && result.response) ||
      '';
    const text = repararTexto(String(raw)).trim();
    if (!text) {
      return Response.json({ ok: false, error: 'Unitron no pudo generar una respuesta. Inténtalo de nuevo.' }, { status: 502 });
    }
    return Response.json({ ok: true, reply: text });
  } catch (err) {
    await logError(env, 'mentor-remoto', err);
    return Response.json({ ok: false, error: 'El mentor no está disponible. Inténtalo de nuevo.' }, { status: 500 });
  }
}
