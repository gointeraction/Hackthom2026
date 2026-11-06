// /api/admin/agente-github — monitorea la actividad reciente de los repositorios entregados.
export async function onRequestPost({ env }) {
  const { results: entregas } = await env.DB.prepare('SELECT codigo, repositorio FROM entregas').all();
  const report = [];

  for (const e of entregas) {
    const m = e.repositorio.match(/github\.com\/([\w.-]+)\/([\w.-]+)/i);
    if (!m) {
      report.push({ codigo: e.codigo, repo: e.repositorio, estado: 'no-github', last_commit: null });
      continue;
    }
    try {
      const r = await fetch(`https://api.github.com/repos/${m[1]}/${m[2]}/commits?per_page=5`, {
        headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'hackathon-uneti-ia' },
      });
      if (r.ok) {
        const data = await r.json();
        const last = (data[0] && data[0].commit && data[0].commit.author && data[0].commit.author.date) || null;
        report.push({ codigo: e.codigo, repo: e.repositorio, estado: last ? 'activo' : 'sin-commits', last_commit: last });
      } else {
        report.push({ codigo: e.codigo, repo: e.repositorio, estado: 'privado-o-no-encontrado', last_commit: null });
      }
    } catch (err) {
      report.push({ codigo: e.codigo, repo: e.repositorio, estado: 'error', last_commit: null });
    }
  }

  return Response.json({ ok: true, report });
}
