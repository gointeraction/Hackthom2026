// /api/admin/certificados — lista de certificados de ponentes con sus códigos y enlaces.
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const base = url.origin;

  try {
    const { results } = await env.DB.prepare(
      'SELECT id, codigo, ponente, titulo, dia, hora_inicio, hora_fin, creado_en FROM certificados_ponentes ORDER BY dia ASC, hora_inicio ASC, id ASC'
    ).all();

    const ponentes = (results || []).map((p) => ({
      id: p.id,
      codigo: p.codigo,
      ponente: p.ponente,
      titulo: p.titulo || '',
      dia: p.dia,
      hora_inicio: p.hora_inicio || '',
      hora_fin: p.hora_fin || '',
      enlace: `${base}/certificado-ponente?codigo=${encodeURIComponent(p.codigo)}`,
      creado_en: p.creado_en || '',
    }));

    return Response.json({
      ok: true,
      ponentes,
      total: ponentes.length,
      enlaceParticipantes: `${base}/certificado`,
    });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer los certificados.' }, { status: 500 });
  }
}
