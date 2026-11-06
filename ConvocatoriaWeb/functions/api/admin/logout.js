// /api/admin/logout — cierra la sesión (expira la cookie).
export async function onRequestGet() {
  return Response.json(
    { ok: true },
    { headers: { 'Set-Cookie': 'admin_auth=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0' } }
  );
}
