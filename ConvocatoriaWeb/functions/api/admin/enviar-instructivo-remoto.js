// /api/admin/enviar-instructivo-remoto — envío manual desde el panel (protegido por sesión admin).
import { enviarInstructivoRemoto } from '../../_lib/instructivo-remoto';

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => ({}));
  try {
    const res = await enviarInstructivoRemoto(env, { dryRun: data.dryRun === true });
    return Response.json(res);
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al enviar el instructivo.' }, { status: 500 });
  }
}
