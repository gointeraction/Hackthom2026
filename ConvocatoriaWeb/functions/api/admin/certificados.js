// /api/admin/certificados — certificados de ponentes, mentores y jurados con códigos y enlaces.
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const base = url.origin;

  try {
    const { results: pon } = await env.DB.prepare(
      'SELECT id, codigo, ponente, titulo, dia, hora_inicio, hora_fin FROM certificados_ponentes ORDER BY dia ASC, hora_inicio ASC, id ASC'
    ).all();

    const { results: men } = await env.DB.prepare(
      'SELECT id, codigo, nombre, organizacion FROM certificados_mentores ORDER BY id ASC'
    ).all();

    const { results: jud } = await env.DB.prepare(
      'SELECT id, codigo, nombre, organizacion FROM judges WHERE codigo IS NOT NULL AND codigo <> \'\' ORDER BY id ASC'
    ).all();

    const ponentes = (pon || []).map((p) => ({
      id: p.id,
      codigo: p.codigo,
      ponente: p.ponente,
      titulo: p.titulo || '',
      dia: p.dia,
      hora_inicio: p.hora_inicio || '',
      hora_fin: p.hora_fin || '',
      enlace: `${base}/certificado-ponente?codigo=${encodeURIComponent(p.codigo)}`,
    }));

    const mentores = (men || []).map((m) => ({
      id: m.id,
      codigo: m.codigo,
      nombre: m.nombre,
      organizacion: m.organizacion || '',
      enlace: `${base}/certificado-mentor?codigo=${encodeURIComponent(m.codigo)}`,
    }));

    const jurados = (jud || []).map((j) => ({
      id: j.id,
      codigo: j.codigo,
      nombre: j.nombre,
      organizacion: j.organizacion || '',
      enlace: `${base}/certificado-jurado?codigo=${encodeURIComponent(j.codigo)}`,
    }));

    return Response.json({
      ok: true,
      ponentes,
      mentores,
      jurados,
      totalPonentes: ponentes.length,
      totalMentores: mentores.length,
      totalJurados: jurados.length,
      enlaceParticipantes: `${base}/certificado`,
      enlacePonentes: `${base}/certificado-ponente`,
      enlaceMentores: `${base}/certificado-mentor`,
      enlaceJurados: `${base}/certificado-jurado`,
    });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer los certificados.' }, { status: 500 });
  }
}
