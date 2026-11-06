// /api/admin/agente-triaje — clasifica las consultas pendientes con IA.
export async function onRequestPost({ env }) {
  const { results } = await env.DB.prepare(
    "SELECT id, codigo, consulta FROM consultas WHERE estado = 'pendiente' ORDER BY id DESC"
  ).all();

  const classified = [];
  for (const c of results) {
    let categoria = 'técnica';
    try {
      const r = await env.AI.run('@cf/zai-org/glm-4.7-flash', {
        messages: [{ role: 'user', content: `Clasifica esta consulta de un hackathon en UNA sola categoría: "logística", "técnica" o "urgencia". Responde SOLO con la palabra, sin puntuación.\n\nConsulta: ${c.consulta}` }],
      });
      const raw = ((r && r.choices && r.choices[0] && r.choices[0].message && r.choices[0].message.content) || (r && r.response) || '').trim().toLowerCase();
      if (raw.includes('logística') || raw.includes('logistica')) categoria = 'logística';
      else if (raw.includes('urgencia')) categoria = 'urgencia';
      else if (raw.includes('técnica') || raw.includes('tecnica')) categoria = 'técnica';
    } catch (e) {}
    classified.push({ id: c.id, codigo: c.codigo, consulta: c.consulta, categoria });
  }

  return Response.json({ ok: true, classified });
}
