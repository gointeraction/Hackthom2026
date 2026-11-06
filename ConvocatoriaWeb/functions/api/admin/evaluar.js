// /api/admin/evaluar — ejecuta el agente evaluador sobre las propuestas de los grupos.
const DEFAULT_PROMPT = `Eres un especialista en evaluación de proyectos de hackathon de Inteligencia Artificial Ética y Ciberseguridad, orientados al sector público venezolano.

Evalúa cada propuesta de desarrollo según estos criterios y pesos:
- Viabilidad técnica / calidad del MVP: 25%
- Impacto y relevancia del problema: 20%
- Innovación y uso de IA: 20%
- Calidad del pitch (claridad de la idea): 15%
- Ética y responsabilidad de la IA: 10%
- Escalabilidad / sostenibilidad: 10%

Para cada propuesta asigna una puntuación total de 0 a 100 y una justificación breve (máximo 30 palabras) que destaque fortalezas y riesgos.

IMPORTANTE: responde SOLO con un arreglo JSON válido, sin texto antes ni después, con este formato exacto:
[{"indice":1,"puntaje":85,"justificacion":"..."}]
El campo "indice" debe coincidir con el número de propuesta que recibiste.`;

export async function onRequestPost({ env }) {
  const { results } = await env.DB.prepare(
    'SELECT group_id, MAX(propuesta) AS propuesta FROM registrations WHERE group_id IS NOT NULL AND propuesta IS NOT NULL AND propuesta != \'\' GROUP BY group_id'
  ).all();

  if (!results || results.length === 0) {
    return Response.json({ ok: false, error: 'No hay propuestas de grupos para evaluar.' }, { status: 400 });
  }

  const cfg = await env.DB.prepare('SELECT prompt FROM evaluador_config WHERE id = 1').first();
  const prompt = (cfg && cfg.prompt) || DEFAULT_PROMPT;

  const user = results.map((r, i) => `Propuesta ${i + 1}:\n${r.propuesta}`).join('\n\n');

  let content = '';
  try {
    const result = await env.AI.run('@cf/zai-org/glm-4.7-flash', {
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: user },
      ],
    });
    content = (result && (result.choices?.[0]?.message?.content || result.response)) || '';
  } catch (e) {
    return Response.json({ ok: false, error: 'El agente evaluador falló.' }, { status: 500 });
  }

  let arr = [];
  const m = content.match(/\[[\s\S]*\]/);
  if (m) {
    try { arr = JSON.parse(m[0]); } catch (e) {}
  }
  if (!Array.isArray(arr) || arr.length === 0) {
    return Response.json({ ok: false, error: 'No se pudo interpretar la respuesta del agente.', raw: content.slice(0, 2000) }, { status: 500 });
  }

  const stmt = env.DB.prepare(
    'INSERT INTO evaluaciones (group_id, propuesta, puntaje, justificacion, estado) VALUES (?, ?, ?, ?, \'pendiente\') ' +
    'ON CONFLICT(group_id) DO UPDATE SET puntaje=excluded.puntaje, justificacion=excluded.justificacion, propuesta=excluded.propuesta'
  );
  const statements = [];
  for (const item of arr) {
    const idx = Number(item.indice);
    if (idx >= 1 && idx <= results.length) {
      const g = results[idx - 1];
      statements.push(stmt.bind(g.group_id, g.propuesta, Number(item.puntaje) || 0, String(item.justificacion || '')));
    }
  }

  if (statements.length === 0) {
    return Response.json({ ok: false, error: 'No se obtuvieron evaluaciones válidas.', raw: content.slice(0, 2000) }, { status: 500 });
  }

  await env.DB.batch(statements);
  return Response.json({ ok: true, evaluadas: statements.length });
}
