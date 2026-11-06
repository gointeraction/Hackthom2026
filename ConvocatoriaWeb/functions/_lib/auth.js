// functions/_lib/auth.js — autenticación: tokens HMAC y hash de contraseñas.
const enc = new TextEncoder();

export async function hmacHex(secret, data) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Hash de contraseña: HMAC-SHA256 de "password:<contraseña>" con clave AUTH_SECRET.
export async function hashPassword(password, secret) {
  return await hmacHex(secret, 'password:' + password);
}

export async function createToken(role, secret, ttlSeconds = 86400) {
  const expiry = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${role}.${expiry}`;
  const sig = await hmacHex(secret, payload);
  return `${payload}.${sig}`;
}

export async function verifyToken(token, secret) {
  if (!token || !secret) return null;
  const parts = String(token).split('.');
  if (parts.length !== 3) return null;
  const [role, expiry, sig] = parts;
  const payload = `${role}.${expiry}`;
  const expected = await hmacHex(secret, payload);
  if (expected !== sig) return null;
  if (Date.now() / 1000 > Number(expiry)) return null;
  return role;
}
