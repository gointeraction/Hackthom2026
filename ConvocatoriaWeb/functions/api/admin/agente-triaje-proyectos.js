// /api/admin/agente-triaje-proyectos — clasifica y valida los proyectos entregados.
export async function onRequestPost({ env }) {
  try {
    const { results: entregas } = await env.DB.prepare('SELECT * FROM entregas ORDER BY id DESC').all();
    const { results: regs } = await env.DB.prepare(
      'SELECT codigo, group_id, nombre, apellido, email, propuesta, modalidad FROM registrations'
    ).all();
    const { results: evals } = await env.DB.prepare('SELECT * FROM evaluaciones').all();

    const regByCodigo = {};
    regs.forEach((r) => { if (r.codigo) regByCodigo[r.codigo] = r; });
    const evalByGroup = {};
    evals.forEach((e) => { if (e.group_id != null) evalByGroup[e.group_id] = e; });

    const resultados = [];
    let githubChecked = 0;

    for (const e of entregas) {
      const reg = regByCodigo[e.codigo] || {};
      const evaluacion = (reg.group_id != null ? evalByGroup[reg.group_id] : null) || null;

      const tieneRepo = !!(e.repositorio && e.repositorio.trim());
      const tieneDemo = !!(e.demo && e.demo.trim());
      const tienePropuesta = !!(reg.propuesta && reg.propuesta.trim());

      const faltantes = [];
      if (!tieneRepo) faltantes.push('repositorio');
      if (!tieneDemo) faltantes.push('demo');
      if (!tienePropuesta) faltantes.push('propuesta');

      let estado = 'Completo';
      let recomendacion = 'Pasa';
      if (!tieneRepo) { estado = 'Inválido'; recomendacion = 'Rechazar'; }
      else if (faltantes.length > 0) { estado = 'Incompleto'; recomendacion = 'Revisar'; }

      let github = null;
      if (tieneRepo && githubChecked < 30) {
        const m = e.repositorio.match(/github\.com\/([^\/\s]+)\/([^\/\s]+)/i);
        if (m) {
          githubChecked++;
          try {
            const ghRes = await fetch(`https://api.github.com/repos/${m[1]}/${m[2].replace(/\.git$/i, '')}`, {
              headers: { 'User-Agent': 'HackathonUNETI', 'Accept': 'application/vnd.github+json' },
            });
            if (ghRes.ok) {
              const repo = await ghRes.json();
              github = {
                existe: true,
                privado: !!repo.private,
                lenguaje: repo.language || '',
                actualizado: repo.updated_at || '',
              };
              if (repo.private && estado === 'Completo') { estado = 'Revisar'; recomendacion = 'Revisar'; }
            } else if (ghRes.status === 404) {
              github = { existe: false };
              estado = 'Inválido';
              recomendacion = 'Rechazar';
            }
          } catch (err) {
            github = { error: true };
          }
        }
      }

      const puntajeIA = evaluacion && evaluacion.puntaje != null ? Number(evaluacion.puntaje) : null;

      resultados.push({
        codigo: e.codigo || '',
        proyecto: e.proyecto || '',
        repositorio: e.repositorio || '',
        demo: e.demo || '',
        participante: reg.nombre ? (reg.nombre + ' ' + (reg.apellido || '')).trim() : '',
        modalidad: reg.modalidad || '',
        estado,
        recomendacion,
        faltantes,
        github,
        puntajeIA,
      });
    }

    const resumen = {
      total: resultados.length,
      completos: resultados.filter((r) => r.estado === 'Completo').length,
      incompletos: resultados.filter((r) => r.estado === 'Incompleto').length,
      invalidos: resultados.filter((r) => r.estado === 'Inválido').length,
      revisar: resultados.filter((r) => r.estado === 'Revisar').length,
    };

    return Response.json({ ok: true, resumen, resultados });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al triajar proyectos.' }, { status: 500 });
  }
}
