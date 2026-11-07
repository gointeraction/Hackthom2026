// /api/admin/backups — lista los respaldos guardados en R2.
export async function onRequestGet({ env }) {
  try {
    const list = await env.FOTOS.list({ prefix: 'backups/', limit: 50 });
    const backups = (list.objects || []).map((o) => ({
      key: o.key,
      size: o.size,
      uploaded: o.uploaded,
    }));
    return Response.json({ ok: true, backups });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al listar respaldos.' }, { status: 500 });
  }
}
