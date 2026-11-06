// /api/admin/evaluador — prompt del agente evaluador y resultados.
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

export async function onRequestGet({ env }) {
  try {
    const cfg = await env.DB.prepare('SELECT prompt FROM evaluador_config WHERE id = 1').first();
    const { results } = await env.DB.prepare('SELECT * FROM evaluaciones ORDER BY puntaje DESC').all();
    return Response.json({
      ok: true,
      prompt: (cfg && cfg.prompt) || DEFAULT_PROMPT,
      evaluaciones: results,
    });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer el evaluador.' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });
  const prompt = String(data.prompt || '');
  try {
    await env.DB.prepare(
      'INSERT INTO evaluador_config (id, prompt) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET prompt = excluded.prompt'
    ).bind(prompt).run();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: 'No se pudo guardar el prompt.' }, { status: 500 });
  }
}
