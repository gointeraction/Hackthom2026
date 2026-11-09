// /api/enviar-instructivo-remoto — envío programado del instructivo a participantes remotos.
// Protegido por X-Backup-Secret (usado por el cron de GitHub Actions).
import { enviarInstructivoRemoto } from '../_lib/instructivo-remoto';

export async function onRequestPost({ request, env }) {
  const secret = request.headers.get('X-Backup-Secret') || '';
  if (!env.BACKUP_SECRET || secret !== env.BACKUP_SECRET) {
    return Response.json({ ok: false, error: 'No autorizado.' }, { status: 401 });
  }

  const data = await request.json().catch(() => ({}));
  try {
    const res = await enviarInstructivoRemoto(env, { dryRun: data.dryRun === true });
    return Response.json(res);
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al enviar el instructivo.' }, { status: 500 });
  }
}
