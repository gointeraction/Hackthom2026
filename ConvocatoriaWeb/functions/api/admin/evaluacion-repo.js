// /api/admin/evaluacion-repo — evaluación automática del repositorio de un equipo con IA.
// IMPORTANTE: guarda en `evaluaciones_ia`, una tabla SEPARADA de `scores` (jurados).
// No altera ni promedia con las notas humanas.

const MODELO = '@cf/zai-org/glm-4.7-flash';

const SYSTEM = `Eres un evaluador técnico senior de un hackathon de IA Ética y Ciberseguridad.
Analizas el repositorio de un equipo y emites una evaluación ORIENTATIVA (no vinculante) usando estos 6 criterios, en escala 1 a 5:

1. viabilidad — Viabilidad técnica y calidad del MVP (peso 25 %): ¿el código existe, compila, está estructurado y hace lo que promete?
2. impacto — Impacto y relevancia del problema (peso 20 %): ¿atiende un dolor real y prioritario del sector público?
3. innovacion — Innovación y uso de IA (peso 20 %): ¿aplica IA o ciberseguridad de forma ingeniosa y efectiva?
4. pitch — Calidad de la presentación y claridad del proyecto (peso 15 %): ¿el README y la estructura explican bien la propuesta?
5. etica — Ética y responsabilidad de la IA (peso 10 %): ¿resguarda datos, evita sesgos, declara el uso de IA?
6. escalabilidad — Escalabilidad y sostenibilidad (peso 10 %): ¿es desplegable y mantenible en el tiempo?

IMPORTANTE: responde SOLO con un objeto JSON válido, sin texto antes ni después, con este formato exacto:
{"viabilidad":4,"impacto":4,"innovacion":5,"pitch":3,"etica":4,"escalabilidad":3,"justificacion":"máximo 45 palabras","fortalezas":"máximo 30 palabras","riesgos":"máximo 30 palabras"}

Sé estricto pero justo: si el repositorio está vacío o es solo una plantilla, baja las notas. Si no puedes determinar algo, indícalo en "riesgos".`;

async function gh(path, env) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'hackathon-uneti-ia' };
  if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  try {
    const r = await fetch(`https://api.github.com${path}`, { headers });
    if (!r.ok) return { status: r.status, data: null };
    return { status: r.status, data: await r.json() };
  } catch (e) {
    return { status: 0, data: null };
  }
}

function b64decode(s) {
  try {
    return decodeURIComponent(escape(atob(String(s || '').replace(/\s/g, ''))));
  } catch (e) {
    try { return atob(String(s || '').replace(/\s/g, '')); } catch (err) { return ''; }
  }
}

// Respaldo sin API (no consume rate limit de la API de GitHub)
async function repoFallback(owner, name) {
  const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; hackathon-uneti-ia)' };

  let readme = '';
  for (const f of ['README.md', 'readme.md', 'Readme.md', 'README.rst', 'README.txt']) {
    try {
      const r = await fetch(`https://raw.githubusercontent.com/${owner}/${name}/HEAD/${f}`, { headers: UA });
      if (r.ok) { readme = await r.text(); break; }
    } catch (e) {}
  }

  let html = '';
  try {
    const r = await fetch(`https://github.com/${owner}/${name}`, { headers: UA });
    if (r.ok) html = await r.text();
  } catch (e) {}

  if (!html && !readme) return { ok: false };

  let desc = '';
  const dm = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  if (dm) desc = dm[1];

  let lang = '';
  const lm = html.match(/itemprop="programmingLanguage">([^<]+)</i);
  if (lm) lang = lm[1].trim();

  let rama = '';
  const bm = html.match(/"defaultBranch":"([^"]+)"/i) || html.match(/refName":"([^"]+)"/i);
  if (bm) rama = bm[1];

  const files = new Set();
  const re = new RegExp(`href="/${owner}/${name}/(?:blob|tree)/[^/"]+/([^"#?]+)"`, 'gi');
  let mm;
  while ((mm = re.exec(html))) {
    try { files.add(decodeURIComponent(mm[1])); } catch (e) { files.add(mm[1]); }
  }

  return { ok: true, readme, desc, lang, rama, files: [...files].slice(0, 200) };
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM evaluaciones_ia ORDER BY puntaje DESC, id ASC'
    ).all();
    return Response.json({ ok: true, evaluaciones: results || [] });
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer evaluaciones IA.' }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => ({}));
  const teamId = Number(data.team_id);
  const evaluarTodos = data.todos === true;

  let equipos = [];
  try {
    if (evaluarTodos) {
      const { results } = await env.DB.prepare(
        "SELECT t.id, t.nombre, t.codigo, e.repositorio FROM teams t JOIN entregas e ON e.codigo = t.codigo WHERE e.repositorio IS NOT NULL AND e.repositorio <> '' ORDER BY t.id ASC"
      ).all();
      equipos = results || [];
    } else {
      if (!teamId) return Response.json({ ok: false, error: 'Selecciona un equipo.' }, { status: 400 });
      const t = await env.DB.prepare(
        'SELECT t.id, t.nombre, t.codigo, e.repositorio FROM teams t LEFT JOIN entregas e ON e.codigo = t.codigo WHERE t.id = ?'
      ).bind(teamId).first();
      if (!t) return Response.json({ ok: false, error: 'Equipo no encontrado.' }, { status: 404 });
      if (!t.repositorio) return Response.json({ ok: false, error: 'Este equipo aún no ha cargado su repositorio de GitHub.' }, { status: 400 });
      equipos = [t];
    }
  } catch (err) {
    return Response.json({ ok: false, error: 'Error al leer los equipos.' }, { status: 500 });
  }

  if (!equipos.length) {
    return Response.json({ ok: false, error: 'No hay equipos con repositorio cargado.' }, { status: 400 });
  }

  const salida = [];
  const errores = [];

  for (const eq of equipos) {
    const m = String(eq.repositorio || '').match(/github\.com\/([\w.-]+)\/([\w.-]+)/i);
    if (!m) { errores.push({ equipo: eq.nombre, error: 'El enlace no es de GitHub.' }); continue; }
    const owner = m[1];
    const name = m[2].replace(/\.git$/, '').replace(/[?#].*$/, '');

    const metaR = await gh(`/repos/${owner}/${name}`, env);

    let desc = '';
    let lang = '';
    let rama = '';
    let readme = '';
    let files = [];
    let fuente = 'api';

    if (metaR.data) {
      const meta = metaR.data;
      desc = meta.description || '';
      lang = meta.language || '';
      rama = meta.default_branch || '';
      const [readmeR, treeR] = await Promise.all([
        gh(`/repos/${owner}/${name}/readme`, env),
        gh(`/repos/${owner}/${name}/git/trees/${rama || 'main'}?recursive=1`, env),
      ]);
      if (readmeR.data) readme = b64decode(readmeR.data.content);
      if (treeR.data && treeR.data.tree) files = treeR.data.tree.filter((x) => x.type === 'blob').map((x) => x.path);
    } else {
      // Respaldo sin API
      fuente = 'html';
      const fb = await repoFallback(owner, name);
      if (!fb.ok) {
        errores.push({ equipo: eq.nombre, error: 'No se pudo leer el repositorio (¿es público?).' });
        continue;
      }
      desc = fb.desc;
      lang = fb.lang;
      rama = fb.rama;
      readme = fb.readme;
      files = fb.files;
    }

    const resumen = [
      `Equipo: ${eq.nombre}`,
      `Repositorio: ${owner}/${name}`,
      `Descripción: ${desc || '(sin descripción)'}`,
      `Lenguaje principal: ${lang || '(no detectado)'}`,
      `Rama: ${rama || '(no detectada)'}`,
      `Total de archivos detectados: ${files.length}`,
      ``,
      `Archivos (primeros 120):`,
      files.slice(0, 120).join('\n') || '(sin archivos)',
      ``,
      `README (recortado a 7000 caracteres):`,
      (readme || '(sin README)').slice(0, 7000),
    ].join('\n');

    let content = '';
    try {
      const result = await env.AI.run(MODELO, {
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: resumen },
        ],
      });
      content = (result && (result.choices?.[0]?.message?.content || result.response)) || '';
    } catch (e) {
      errores.push({ equipo: eq.nombre, error: 'El modelo de IA falló.' });
      continue;
    }

    let obj = null;
    const mm = content.match(/\{[\s\S]*\}/);
    if (mm) { try { obj = JSON.parse(mm[0]); } catch (e) {} }
    if (!obj) { errores.push({ equipo: eq.nombre, error: 'No se pudo interpretar la respuesta de la IA.' }); continue; }

    const num = (v) => {
      const n = Number(v);
      return isFinite(n) ? Math.max(1, Math.min(5, Math.round(n * 10) / 10)) : 3;
    };

    const viabilidad = num(obj.viabilidad);
    const impacto = num(obj.impacto);
    const innovacion = num(obj.innovacion);
    const pitch = num(obj.pitch);
    const etica = num(obj.etica);
    const escalabilidad = num(obj.escalabilidad);

    const puntaje = Math.round((viabilidad * 0.25 + impacto * 0.20 + innovacion * 0.20 + pitch * 0.15 + etica * 0.10 + escalabilidad * 0.10) * 100) / 100;

    try {
      await env.DB.prepare(
        'INSERT INTO evaluaciones_ia (team_id, equipo, codigo, repositorio, puntaje, viabilidad, impacto, innovacion, pitch, etica, escalabilidad, justificacion, fortalezas, riesgos, modelo) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ' +
        'ON CONFLICT(team_id) DO UPDATE SET equipo=excluded.equipo, codigo=excluded.codigo, repositorio=excluded.repositorio, puntaje=excluded.puntaje, viabilidad=excluded.viabilidad, impacto=excluded.impacto, innovacion=excluded.innovacion, pitch=excluded.pitch, etica=excluded.etica, escalabilidad=excluded.escalabilidad, justificacion=excluded.justificacion, fortalezas=excluded.fortalezas, riesgos=excluded.riesgos, modelo=excluded.modelo, creado_en=CURRENT_TIMESTAMP'
      ).bind(
        eq.id, eq.nombre, eq.codigo || '', eq.repositorio,
        puntaje, viabilidad, impacto, innovacion, pitch, etica, escalabilidad,
        String(obj.justificacion || ''), String(obj.fortalezas || ''), String(obj.riesgos || ''), MODELO
      ).run();
    } catch (e) {
      errores.push({ equipo: eq.nombre, error: 'No se pudo guardar la evaluación.' });
      continue;
    }

    salida.push({
      team_id: eq.id,
      equipo: eq.nombre,
      codigo: eq.codigo,
      repositorio: eq.repositorio,
      puntaje, viabilidad, impacto, innovacion, pitch, etica, escalabilidad,
      justificacion: obj.justificacion || '',
      fortalezas: obj.fortalezas || '',
      riesgos: obj.riesgos || '',
      archivos: files.length,
      fuente,
    });
  }

  return Response.json({
    ok: salida.length > 0,
    evaluadas: salida.length,
    resultados: salida,
    errores,
    nota: 'Esta evaluación es orientativa y NO se suma al promedio de los jurados.',
  });
}
