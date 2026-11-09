// /api/jurado/logout — cierra la sesión del jurado.
export async function onRequestPost() {
  return Response.json({ ok: true }, { headers: { 'Set-Cookie': 'judge_auth=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0' } });
}
