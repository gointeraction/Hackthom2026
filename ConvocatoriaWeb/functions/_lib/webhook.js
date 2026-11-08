// _lib/webhook.js — notificaciones salientes firmadas (HMAC-SHA256).
export async function hmacSha256Hex(secret, body) {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function sendWebhooks(env, evento, data) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT id, url, secret, eventos FROM webhooks WHERE activo = 1'
    ).all();
    const targets = (results || []).filter((w) =>
      String(w.eventos || '').split(',').map((e) => e.trim()).includes(evento)
    );
    if (targets.length === 0) return;

    const payload = JSON.stringify({ evento, enviado_en: new Date().toISOString(), data });

    await Promise.all(targets.map(async (w) => {
      try {
        const sig = await hmacSha256Hex(w.secret, payload);
        await fetch(w.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Event': evento,
            'X-Webhook-Signature': sig,
          },
          body: payload,
        });
      } catch (e) {
        // best-effort
      }
    }));
  } catch (e) {
    // best-effort
  }
}
