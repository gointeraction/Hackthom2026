// /api/qr?data=<url>&size=300 — genera un PNG de código QR (proxy con caché).
export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const data = String(url.searchParams.get('data') || '').trim();
  const size = String(url.searchParams.get('size') || '300').replace(/[^0-9]/g, '') || '300';

  if (!data) {
    return new Response('Falta el parámetro data.', { status: 400 });
  }
  if (data.length > 400) {
    return new Response('El contenido del QR es demasiado largo.', { status: 400 });
  }

  const destino = 'https://api.qrserver.com/v1/create-qr-code/?size=' + size + 'x' + size +
    '&margin=0&ecc=M&format=png&data=' + encodeURIComponent(data);

  try {
    const r = await fetch(destino, { cf: { cacheEverything: true, cacheTtl: 2592000 } });
    if (!r.ok) {
      return new Response('No se pudo generar el QR (' + r.status + ').', { status: 502 });
    }
    const buf = await r.arrayBuffer();
    return new Response(buf, {
      headers: {
        'content-type': 'image/png',
        'cache-control': 'public, max-age=2592000, immutable',
        'access-control-allow-origin': '*',
      },
    });
  } catch (err) {
    return new Response('Error al generar el QR.', { status: 502 });
  }
}
