// /api/fotos — lista pública de fotos de la galería.
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT key, caption FROM fotos ORDER BY id DESC').all();
    return Response.json({ ok: true, fotos: results });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error.' }, { status: 500 });
  }
}
