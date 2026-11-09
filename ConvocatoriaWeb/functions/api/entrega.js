// /api/entrega — entrega de proyecto (repositorio GitHub + código de participante/grupo).
import { sendEmail } from '../_lib/mail';
import { sendWebhooks } from '../_lib/webhook';

async function verifyTurnstile(env, token, action, ip) {
  if (!token || !env.TURNSTILE_SECRET) return false;
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token, remoteip: ip || '' }),
    });
    const result = await r.json();
    return result.success === true && result.action === action && result.hostname === 'hackathon-uneti-ia.pages.dev';
  } catch (e) {
    return false;
  }
}

async function checkRepoPublic(url) {
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
        return { ok: true };
      }
      if (r.status === 404) {
        return { ok: false, error: 'El repositorio no existe o es privado. Debe ser PÚBLICO para que el jurado pueda leerlo.' };
      }
      return { ok: true };
    }

    if (host === 'gitlab.com') {
      const path = u.pathname.replace(/^\//, '').replace(/\.git$/, '');
      if (!path) return { ok: false, error: 'URL de repositorio inválida.' };
      const r = await fetch(`https://gitlab.com/api/v4/projects/${encodeURIComponent(path)}`, {
        headers: { 'User-Agent': 'hackathon-uneti-ia' },
      });
      if (r.status === 200) {
        const j = await r.json().catch(() => null);
        if (j && j.visibility && j.visibility !== 'public') {
          return { ok: false, error: 'El repositorio es privado. Debe ser PÚBLICO para que el jurado pueda leerlo.' };
        }
        return { ok: true };
      }
      if (r.status === 404) {
        return { ok: false, error: 'El repositorio no existe o es privado. Debe ser PÚBLICO para que el jurado pueda leerlo.' };
      }
      return { ok: true };
    }

    return { ok: true };
  } catch (e) {
    return { ok: true };
  }
}

export async function onRequestPost({ request, env, waitUntil }) {
  const data = await request.json().catch(() => null);
  if (!data) return Response.json({ ok: false, error: 'Datos inválidos.' }, { status: 400 });
  if (data._gotcha) return Response.json({ ok: true });

  const ip = request.headers.get('CF-Connecting-IP') || '';
  if (!(await verifyTurnstile(env, String(data.turnstile || ''), 'entrega', ip))) {
    return Response.json({ ok: false, error: 'Verificación de seguridad fallida.' }, { status: 403 });
  }

  const codigo = String(data.codigo || '').trim().toUpperCase();
  const repositorio = String(data.repositorio || '').trim();
  const proyecto = String(data.proyecto || '').trim();
  const demo = String(data.demo || '').trim();
  const video = String(data.video || '').trim();
  const deck = String(data.deck || '').trim();
  const tags = String(data.tags || '').trim();
  const descripcion = String(data.descripcion || '').trim();

  if (!codigo || !repositorio) {
    return Response.json({ ok: false, error: 'Código y repositorio son obligatorios.' }, { status: 400 });
  }
  if (!/^https?:\/\/(www\.)?(github\.com|gitlab\.com)\/[\w.-]+\/[\w.-]+/i.test(repositorio)) {
    return Response.json({ ok: false, error: 'URL de repositorio inválida (debe ser github.com o gitlab.com).' }, { status: 400 });
  }

  const reg = await env.DB.prepare('SELECT nombre, apellido, correo, codigo FROM registrations WHERE codigo = ?').bind(codigo).first();
  if (!reg) {
    return Response.json({ ok: false, error: 'Código inválido.' }, { status: 403 });
  }

  // El repositorio debe ser público para que el jurado pueda leerlo.
  const repoCheck = await checkRepoPublic(repositorio);
  if (!repoCheck.ok) {
    return Response.json({ ok: false, error: repoCheck.error }, { status: 400 });
  }

  try {
    await env.DB.prepare(
      'INSERT INTO entregas (codigo, repositorio, proyecto, demo, video, deck, tags, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(codigo) DO UPDATE SET repositorio=excluded.repositorio, proyecto=excluded.proyecto, demo=excluded.demo, video=excluded.video, deck=excluded.deck, tags=excluded.tags, descripcion=excluded.descripcion, updated_at=CURRENT_TIMESTAMP'
    ).bind(codigo, repositorio, proyecto, demo, video, deck, tags, descripcion).run();

    // Notificar a agentes externos (webhook firmado, best-effort)
    const wh = sendWebhooks(env, 'entrega.nueva', {
      codigo, repositorio, proyecto, demo, video, deck, tags, descripcion,
    });
    if (typeof waitUntil === 'function') waitUntil(wh); else wh.catch(() => {});

    try {
      await sendEmail(env, {
        to: reg.correo,
        subject: 'Entrega de proyecto registrada — Hackathon UNETI IA 2026',
        text: `Hola ${reg.nombre},\n\nTu entrega de proyecto (${repositorio}) ha sido registrada correctamente.\n\n— Comité Organizador\nHackathon UNETI IA 2026`,
      });
    } catch (e) {}

    return Response.json({ ok: true, message: 'Entrega registrada correctamente.' });
  } catch (err) {
    return Response.json({ ok: false, error: 'No se pudo registrar la entrega.' }, { status: 500 });
  }
}
