// /api/verificar?codigo=XXX — verificación pública de un certificado.
// Devuelve el titular, el tipo de certificado, los talleres del evento y el itinerario.

const ITINERARIO = [
  { dia: 1, fecha: 'Viernes 13 de noviembre', hora: '19:00–21:00', fase: 'Fase 0 y 1 · Especificación (SDD) y Desglose de Valor', titulo: 'Definir el problema y la especificación' },
  { dia: 1, fecha: 'Viernes 13 de noviembre', hora: '21:00–01:00', fase: 'Fase 2 · Sprint Nocturno I (Estructura Core)', titulo: 'Levantar la estructura core' },
  { dia: 2, fecha: 'Sábado 14 de noviembre', hora: '01:00–04:30', fase: 'Fase 2 · Sprint Nocturno II (Lógica Crítica y Relevo)', titulo: 'Núcleo del MVP con rotación de descanso' },
  { dia: 2, fecha: 'Sábado 14 de noviembre', hora: '04:30–07:00', fase: 'Fase 2 · Sprint Nocturno III (Integración y Pulido)', titulo: 'Integrar y depurar antes del amanecer' },
  { dia: 2, fecha: 'Sábado 14 de noviembre', hora: '07:00–09:00', fase: 'Hito Crítico · CODE FREEZE Nocturno + Desayuno', titulo: 'Congelar el código y recuperar al equipo' },
  { dia: 2, fecha: 'Sábado 14 de noviembre', hora: '09:00–09:30', fase: 'Repaso general y bienvenida', titulo: 'Repaso general del día' },
  { dia: 2, fecha: 'Sábado 14 de noviembre', hora: '09:30–11:30', fase: 'Fase 3 · Formación Final, Validación y Evidencias', titulo: 'Validar y grabar evidencias' },
  { dia: 2, fecha: 'Sábado 14 de noviembre', hora: '11:30–13:00', fase: 'Fase 4 · Desarrollo Final y Arquitectura de Narrativa', titulo: 'Últimos ajustes y guion del pitch' },
  { dia: 2, fecha: 'Sábado 14 de noviembre', hora: '13:00–14:45', fase: 'Fase 4 · Almuerzo y Ensayos con Cronómetro', titulo: 'Ensayar contra el reloj' },
  { dia: 2, fecha: 'Sábado 14 de noviembre', hora: '14:45–15:30', fase: 'Hito Final · Carga en Panel Remoto y Preparación de Pitch', titulo: 'Entrega oficial y preparación final' },
  { dia: 2, fecha: 'Sábado 14 de noviembre', hora: '15:30–17:30', fase: '🎤 Defensas ante el jurado', titulo: 'Presentaciones en vivo' },
  { dia: 2, fecha: 'Sábado 14 de noviembre', hora: '17:30–18:30', fase: '🏆 Premiación y clausura', titulo: 'Resultados y cierre' },
];

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const codigo = String(url.searchParams.get('codigo') || '').trim().toUpperCase();

  if (!codigo) {
    return Response.json({ ok: false, valido: false, error: 'Falta el código.' }, { status: 400 });
  }

  try {
    // 1) Talleres / charlas del evento
    const { results: charlas } = await env.DB.prepare(
      'SELECT titulo, ponente, dia, hora_inicio, hora_fin FROM charlas ORDER BY dia ASC, hora_inicio ASC'
    ).all();

    const talleres = (charlas || []).map((c) => ({
      titulo: c.titulo,
      ponente: c.ponente,
      dia: c.dia,
      hora: c.hora_inicio ? c.hora_inicio + (c.hora_fin ? '–' + c.hora_fin : '') : '',
    }));

    // 2) Resolver el titular del código
    let titular = null;

    const pon = await env.DB.prepare(
      'SELECT ponente AS nombre, titulo AS detalle, dia, hora_inicio, hora_fin FROM certificados_ponentes WHERE codigo = ? LIMIT 1'
    ).bind(codigo).first();
    if (pon) {
      titular = {
        tipo: 'ponente',
        etiqueta: 'Ponente',
        nombre: pon.nombre,
        detalle: pon.detalle || '',
        extra: pon.hora_inicio ? ('Día ' + pon.dia + ' · ' + pon.hora_inicio + (pon.hora_fin ? '–' + pon.hora_fin : '')) : '',
        emoji: '🎤',
      };
    }

    if (!titular) {
      const men = await env.DB.prepare(
        'SELECT nombre, organizacion FROM certificados_mentores WHERE codigo = ? LIMIT 1'
      ).bind(codigo).first();
      if (men) {
        titular = {
          tipo: 'mentor', etiqueta: 'Mentor', nombre: men.nombre,
          detalle: '', extra: men.organizacion || '', emoji: '🧑‍🏫',
        };
      }
    }

    if (!titular) {
      const jud = await env.DB.prepare(
        'SELECT nombre, organizacion FROM judges WHERE codigo = ? LIMIT 1'
      ).bind(codigo).first();
      if (jud) {
        titular = {
          tipo: 'jurado', etiqueta: 'Miembro del jurado', nombre: jud.nombre,
          detalle: '', extra: jud.organizacion || '', emoji: '⚖️',
        };
      }
    }

    if (!titular) {
      const par = await env.DB.prepare(
        'SELECT nombre, modalidad, created_at FROM registrations WHERE codigo = ? LIMIT 1'
      ).bind(codigo).first();
      if (par) {
        const mod = String(par.modalidad || '').toLowerCase();
        titular = {
          tipo: 'participante',
          etiqueta: 'Participante',
          nombre: par.nombre,
          detalle: mod === 'remoto' ? 'Participación en línea (48 horas)' : 'Participación presencial',
          extra: par.created_at || '',
          emoji: '🎓',
        };
      }
    }

    if (!titular) {
      return Response.json({
        ok: true,
        valido: false,
        codigo,
        error: 'No encontramos un certificado con este código.',
        talleres,
        itinerario: ITINERARIO,
      });
    }

    return Response.json({
      ok: true,
      valido: true,
      codigo,
      titular,
      talleres,
      itinerario: ITINERARIO,
      verificadoEn: new Date().toISOString(),
      evento: {
        nombre: 'Hackathon UNETI IA 2026',
        fechas: '13 y 14 de noviembre de 2026',
        sede: 'Parque Tecnológico + Más Ciencia · Caracas',
        ejes: ['Inteligencia Artificial Ética', 'Ciberseguridad'],
      },
    });
  } catch (err) {
    return Response.json({ ok: false, valido: false, error: 'Error al verificar el código.' }, { status: 500 });
  }
}
