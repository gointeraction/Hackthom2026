// _lib/apikey.js — emisión y verificación de API keys para agentes externos.
export async function sha256Hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function generateApiKey() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
  return 'hx_sk_' + hex;
}

export async function verifyApiKey(env, request) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  try {
    const hash = await sha256Hex(token);
    const row = await env.DB.prepare(
      'SELECT id, nombre, permisos, activo FROM api_keys WHERE key_hash = ? AND activo = 1'
    ).bind(hash).first();
    if (!row) return null;
    try {
      await env.DB.prepare('UPDATE api_keys SET last_used_at = CURRENT_TIMESTAMP WHERE id = ?').bind(row.id).run();
    } catch (e) {}
    return row;
  } catch (e) {
    return null;
  }
}

export function maskEmail(e) {
  if (!e) return '';
  const s = String(e);
  const at = s.indexOf('@');
  if (at < 1) return '***';
  return s[0] + '***' + s.slice(at);
}
