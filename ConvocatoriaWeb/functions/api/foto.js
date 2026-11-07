// /api/foto — sirve la imagen desde R2 por su clave.
export async function onRequestGet({ request, env }) {
  const key = new URL(request.url).searchParams.get('key');
  if (!key) return new Response('Falta key', { status: 400 });

  const obj = await env.FOTOS.get(key);
  if (!obj) return new Response('No encontrado', { status: 404 });

  const headers = new Headers();
  headers.set('Content-Type', (obj.httpMetadata && obj.httpMetadata.contentType) || 'image/jpeg');
  headers.set('Cache-Control', 'public, max-age=86400');
  return new Response(obj.body, { headers });
}
