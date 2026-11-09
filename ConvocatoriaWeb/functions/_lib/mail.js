// functions/_lib/mail.js — envío de correos vía SendGrid REST API (sin npm).
export async function sendEmail(env, { to, subject, text, html }) {
  if (!env.SENDGRID_API_KEY) {
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
      return { ok: false, error: 'SendGrid ' + res.status + ': ' + String(detalle).slice(0, 300) };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e && e.message) };
  }
}
