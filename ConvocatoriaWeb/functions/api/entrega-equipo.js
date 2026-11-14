// /api/entrega-equipo — entrega de enlaces por equipo (GitHub + presentación en Drive).
// GET  → lista de equipos con su estado de entrega.
// POST { team_id, repositorio, deck, demo, video, descripcion } → guarda/actualiza la entrega.

async function repoEsPublico(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '').toLowerCase();

    if (host === 'github.com') {
      const parts = u.pathname.split('/').filter(Boolean);
      if (parts.length < 2) return { ok: false, error: 'URL de repositorio inválida.' };
      const repo = parts[1].replace(/\.git$/, '');
      const r = await fetch(`https://api.github.com/repos/${parts[0]}/${repo}`, {
        headers: { 'User-Agent': 'hackathon-uneti-ia', Accept: 'application/vnd.github+json' },
      });
      if (r.status === 200) {
        const j = await r.json().catch(() => null);
        if (j && j.private === true) {
          return { ok: false, error: 'El repositorio es privado. Debe ser PÚBLICO para que el jurado pueda leerlo.' };
        }
        return { ok: true, normalizado: `https://github.com/${parts[0]}/${repo}` };
      }
      if (r.status === 404) {
        return { ok: false, error: 'El repositorio no existe o es privado. Debe ser PÚBLICO.' };
      }
      return { ok: true };
    }

    if (host === 'gitlab.com') {
      const parts = u.pathname.split('/').filter(Boolean);
      if (parts.length < 2) return { ok: false, error: 'URL de repositorio inválida.' };
      return { ok: true };
    }

    return { ok: false, error: 'Solo se aceptan repositorios de github.com o gitlab.com.' };
  } catch (e) {
    return { ok: false, error: 'URL de repositorio inválida.' };
  }
}

function urlValida(v) {
  try {
    const u = new URL(v);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch (e) {
    return false;
  }
}

export async function onRequestGet({ env }) {
  try {
    const { results: teams } = await env.DB.prepare(
      "SELECT id, nombre, codigo, eje, modalidad FROM teams WHERE origen = 'eval-temprana' ORDER BY id ASC"
    ).all();

    const { results: entregas } = await env.DB.prepare(
      'SELECT codigo, repositorio, deck, demo, video, descripcion, updated_at FROM entregas'
    ).all();

    const porCodigo = new Map();
    for (const e of entregas || []) porCodigo.set(String(e.codigo || '').toUpperCase(), e);

    const lista = (teams || []).map((t) => {
      const e = porCodigo.get(String(t.codigo || '').toUpperCase()) || null;
      return {
        id: t.id,
        nombre: t.nombre,
        codigo: t.codigo,
        eje: t.eje || '',
        entregado: !!(e && e.repositorio),
        repositorio: e ? e.repositorio || '' : '',
        deck: e ? e.deck || '' : '',
        demo: e ? e.demo || '' : '',
        video: e ? e.video || '' : '',
        descripcion: e ? e.descripcion || '' : '',
        actualizado: e ? e.updated_at || '' : '',
      };
    });

    return Response.json({ ok: true, equipos: lista, total: lista.length });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer los equipos.' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });

  const teamId = Number(data.team_id);
  if (!teamId) return Response.json({ ok: false, error: 'Selecciona tu equipo.' }, { status: 400 });

  const repositorio = String(data.repositorio || '').trim();
  const deck = String(data.deck || '').trim();
  const demo = String(data.demo || '').trim();
  const video = String(data.video || '').trim();
  const descripcion = String(data.descripcion || '').trim();

  if (!repositorio) return Response.json({ ok: false, error: 'El enlace de GitHub es obligatorio.' }, { status: 400 });
  if (!urlValida(repositorio)) return Response.json({ ok: false, error: 'El enlace de GitHub no es válido.' }, { status: 400 });
  if (!deck) return Response.json({ ok: false, error: 'El enlace de la presentación (Drive) es obligatorio.' }, { status: 400 });
  if (!urlValida(deck)) return Response.json({ ok: false, error: 'El enlace de la presentación no es válido.' }, { status: 400 });
  if (demo && !urlValida(demo)) return Response.json({ ok: false, error: 'El enlace de demo no es válido.' }, { status: 400 });
  if (video && !urlValida(video)) return Response.json({ ok: false, error: 'El enlace del video no es válido.' }, { status: 400 });

  const repo = await repoEsPublico(repositorio);
  if (!repo.ok) return Response.json({ ok: false, error: repo.error }, { status: 400 });

  const finalRepo = repo.normalizado || repositorio;

  try {
    const team = await env.DB.prepare('SELECT id, nombre, codigo FROM teams WHERE id = ?').bind(teamId).first();
    if (!team) return Response.json({ ok: false, error: 'Equipo no encontrado.' }, { status: 404 });
    if (!team.codigo) return Response.json({ ok: false, error: 'Este equipo no tiene código asignado.' }, { status: 400 });

    const existe = await env.DB.prepare('SELECT id FROM entregas WHERE codigo = ? LIMIT 1').bind(team.codigo).first();

    if (existe) {
      await env.DB.prepare(
        'UPDATE entregas SET repositorio = ?, deck = ?, demo = ?, video = ?, descripcion = ?, proyecto = ?, updated_at = CURRENT_TIMESTAMP WHERE codigo = ?'
      ).bind(finalRepo, deck, demo, video, descripcion, team.nombre, team.codigo).run();
    } else {
      await env.DB.prepare(
        'INSERT INTO entregas (codigo, repositorio, deck, demo, video, descripcion, proyecto, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
      ).bind(team.codigo, finalRepo, deck, demo, video, descripcion, team.nombre).run();
    }

    return Response.json({
      ok: true,
      equipo: team.nombre,
      codigo: team.codigo,
      repositorio: finalRepo,
      deck,
      actualizado: !existe,
    });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al guardar la entrega.' }, { status: 500 });
  }
}
