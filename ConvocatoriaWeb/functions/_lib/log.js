// functions/_lib/log.js — registro de errores en la tabla "errores".
export async function logError(env, endpoint, err) {
  try {
    const mensaje = String((err && err.message) || err || '').slice(0, 500);
    await env.DB.prepare('INSERT INTO errores (endpoint, mensaje) VALUES (?, ?)').bind(endpoint, mensaje).run();
  } catch (e) {}
}
