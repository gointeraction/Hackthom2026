// _lib/ratelimit.js — limitador simple por IP y endpoint (ventana fija en D1).
export async function checkRateLimit(env, ip, endpoint, limit = 20, windowSec = 60) {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % windowSec);
  try {
    await env.DB.prepare(
      'INSERT INTO rate_limits (ip, endpoint, window_start, count) VALUES (?, ?, ?, 1) ON CONFLICT(ip, endpoint, window_start) DO UPDATE SET count = count + 1'
    ).bind(ip, endpoint, windowStart).run();
    const row = await env.DB.prepare(
      'SELECT count FROM rate_limits WHERE ip = ? AND endpoint = ? AND window_start = ?'
    ).bind(ip, endpoint, windowStart).first();
    return !row || row.count <= limit;
  } catch (e) {
    return true; // fail-open: no bloquear por un fallo del limitador
  }
}
