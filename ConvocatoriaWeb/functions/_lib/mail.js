// functions/_lib/mail.js — envío de correos vía SendGrid REST API (sin npm) + registro en emails_log.

async function registrar(env, { to, subject, tipo, estado, error, referencia }) {
  try {
    if (!env.DB) return;
    await env.DB.prepare(
      'INSERT INTO emails_log (destinatario, asunto, tipo, estado, error, referencia) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(
      String(to || ''),
      String(subject || '').slice(0, 300),
      String(tipo || 'general'),
      String(estado || 'desconocido'),
      error ? String(error).slice(0, 400) : null,
      referencia ? String(referencia).slice(0, 120) : null
    ).run();
  } catch (e) {}
}

export async function sendEmail(env, { to, subject, text, html, tipo, referencia }) {
  if (!env.SENDGRID_API_KEY) {
    await registrar(env, { to, subject, tipo, estado: 'sin_config', error: 'SendGrid no configurado', referencia });
    return { ok: false, error: 'SendGrid no configurado.' };
  }

  const payload = {
    personalizations: [{ to: [{ email: to }], subject }],
    from: { email: 'hackathon@uneti.edu.ve', name: 'Hackathon UNETI IA' },
    content: [{ type: 'text/plain', value: text || html || '' }],
  };
  if (html) payload.content.push({ type: 'text/html', value: html });

  try {
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + env.SENDGRID_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const detalle = await res.text().catch(() => '');
      const err = 'SendGrid ' + res.status + ': ' + String(detalle).slice(0, 300);
      await registrar(env, { to, subject, tipo, estado: 'fallido', error: err, referencia });
      return { ok: false, error: err };
    }
    await registrar(env, { to, subject, tipo, estado: 'enviado', referencia });
    return { ok: true };
  } catch (e) {
    const err = String(e && e.message);
    await registrar(env, { to, subject, tipo, estado: 'fallido', error: err, referencia });
    return { ok: false, error: err };
  }
}
