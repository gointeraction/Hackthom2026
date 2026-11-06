// /api/admin/agente-resumen — genera un resumen ejecutivo del estado del evento con IA.
export async function onRequestPost({ env }) {
  const c = async (sql) => { const r = await env.DB.prepare(sql).first(); return r ? (r.c || 0) : 0; };
  const inscritos = await c('SELECT COUNT(*) AS c FROM registrations');
  const conCodigo = await c('SELECT COUNT(DISTINCT codigo) AS c FROM registrations WHERE codigo IS NOT NULL');
  const entregas = await c('SELECT COUNT(*) AS c FROM entregas');
  const consultas = await c('SELECT COUNT(*) AS c FROM consultas');
  const consultasPend = await c("SELECT COUNT(*) AS c FROM consultas WHERE estado='pendiente'");
  const asistencia = await c('SELECT COUNT(*) AS c FROM asistencia_remota');
  const acreditados = await c('SELECT COUNT(*) AS c FROM registrations WHERE acreditado = 1');

  const datos = `Inscritos totales: ${inscritos}. Participantes/grupos con código: ${conCodigo}. Proyectos entregados: ${entregas}. Consultas totales: ${consultas} (${consultasPend} pendientes). Asistencias remotas registradas: ${asistencia}. Acreditados presenciales: ${acreditados}.`;

  let resumen = '';
  try {
    const r = await env.AI.run('@cf/zai-org/glm-4.7-flash', {
      messages: [
        { role: 'system', content: 'Eres un asistente del comité organizador del Hackathon UNETI IA 2026. Genera un resumen ejecutivo breve (máx 120 palabras) del estado del evento a partir de estos datos. Usa español, tono profesional y enumera los puntos clave.' },
        { role: 'user', content: datos },
      ],
    });
    resumen = (r && r.choices && r.choices[0] && r.choices[0].message && r.choices[0].message.content) || (r && r.response) || '';
  } catch (e) {}

  return Response.json({ ok: true, resumen, datos });
}
