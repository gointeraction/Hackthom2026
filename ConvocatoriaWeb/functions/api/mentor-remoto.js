// /api/mentor-remoto — Unitron Mentor: agente de apoyo para equipos remotos (Workers AI + contexto del participante).
import { logError } from '../_lib/log';

const BASE = `Eres "Unitron Mentor", el mentor virtual del Hackathon UNETI IA 2026 (IA Ética y Ciberseguridad). El evento es los días 13 y 14 de noviembre de 2026, presencial en Caracas (Edificio MPPCT, Piso 12, Av. Universidad) y con transmisión remota por YouTube (@UNETIEducativo). Los remotos participan conectados en línea.

Tu rol es apoyar a los equipos remotos con:
1) Dudas de logística y del evento: agenda, horarios, entrega de proyectos, acreditación, asistencia remota, criterios de evaluación, instructivo.
2) Orientación técnica: IA ética, ciberseguridad, pitch, repositorio GitHub, demo.
3) Recomendaciones según su proyecto (si han entregado repositorio).

Reglas: responde en español, claro y breve (máx 150 palabras). Sé empático y motivador. Si no sabes algo, dilo con honestidad; no inventes datos.`;

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
    const text =
      (result && result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) ||
      (result && result.response) ||
      '';
    return Response.json({ ok: true, reply: text });
  } catch (err) {
    await logError(env, 'mentor-remoto', err);
    return Response.json({ ok: false, error: 'El mentor no está disponible. Inténtalo de nuevo.' }, { status: 500 });
  }
}
