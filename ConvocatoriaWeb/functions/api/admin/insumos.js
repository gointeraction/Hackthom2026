// /api/admin/insumos — lista consolidada de insumos por equipo logístico.
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT grupo, responsables, insumos FROM logistica ORDER BY grupo ASC').all();
    const equipos = results.map((g) => ({
      grupo: g.grupo,
      responsables: (g.responsables || '').split('\n').map((s) => s.trim()).filter(Boolean),
      insumos: (g.insumos || '').split('\n').map((s) => s.trim()).filter(Boolean),
    }));
    const total = equipos.reduce((a, e) => a + e.insumos.length, 0);
    return Response.json({ ok: true, equipos, total });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer insumos.' }, { status: 500 });
  }
}
