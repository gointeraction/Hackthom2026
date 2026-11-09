# Correo: Instructivo del panel remoto

> Plantilla lista para enviar a los participantes remotos.
> Reemplaza **[Nombre]** y **[CÓDIGO]** antes de enviar.

---

## Asunto

```
Tu panel remoto está listo — reporta tu proyecto y avances · Hackathon UNETI IA 2026
```

---

## Cuerpo del correo

```
Hola [Nombre],

¡Ya está disponible tu panel remoto del Hackathon UNETI IA 2026!

Desde aquí podrás reportar tu proyecto, actualizar tus avances,
consultar a los mentores y hablar con Unitron (tu mentor virtual IA).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 ACCEDE AQUÍ
https://hackathon-uneti-ia.pages.dev/remoto

Tu código de participante: [CÓDIGO]

⚠️ Guarda este código. Es tu llave de acceso y lo usarás
   durante todo el evento.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 1. REPORTA TU PROYECTO

Al entrar con tu código verás el formulario "Entrega de proyecto".
Completa estos campos:

  • Repositorio GitHub/GitLab (OBLIGATORIO)
    Ejemplo: https://github.com/usuario/mi-proyecto
    ⚠️ El repositorio debe ser PÚBLICO o tener acceso para el jurado.

  • Nombre del proyecto (opcional)
  • Enlace de demo (opcional)
  • Video demo (opcional, YouTube o similar)
  • Presentación / deck (opcional)
  • Tecnologías usadas (ej. React, Cloudflare, Python)
  • Descripción breve: ¿qué problema resuelve tu proyecto?

Pulsa "Enviar entrega" y recibirás confirmación por correo.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔄 2. ACTUALIZA TUS AVANCES

Puedes volver a enviar el formulario LAS VECES QUE NECESITES.
El sistema guarda SIEMPRE la última versión.

Recomendación: actualiza tu entrega al menos 2 veces:
  • Al inicio: repositorio y descripción inicial.
  • Antes del pitch: demo, video y descripción final.

Así el jurado verá tu avance real.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💬 3. CONSULTA A MENTORES

¿Tienes una duda técnica o de negocio?
Usa el formulario "Consulta a mentores".

Un mentor revisará tu consulta y te responderá a la brevedad.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 4. HABLA CON UNITRON (MENTOR VIRTUAL IA)

En tu panel encontrarás el chat "Unitron · Mentor Virtual".

Pregúntale lo que necesites:
  • Logística del evento
  • Dudas sobre el proyecto
  • Cómo enfocar tu pitch
  • Criterios de evaluación

Está disponible 24/7 durante el evento.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 5. REGISTRA TU ASISTENCIA

El día del evento, marca tu asistencia desde el panel remoto
con el formulario "Registro de asistencia remota".

Esto es obligatorio para optar a los premios.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 FECHAS CLAVE

  • Cierre de inscripciones: miércoles 11 de noviembre · 4:00 pm
  • Inicio del evento: viernes 13 de noviembre
  • Desarrollo continuo: 48 horas con pernocta
  • Pitch ante el jurado: sábado 14 de noviembre · 3:30 pm
  • Premiación y clausura: sábado 14 de noviembre · 5:30 pm

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 RECOMENDACIONES

  • Asegúrate de que tu repositorio sea accesible (público).
  • Incluye un README con: qué hace, cómo se instala y cómo se usa.
  • Sube tu demo o video para que el jurado pueda verlo funcionando.
  • Actualiza la descripción antes del pitch.
  • Si usas IA, explica cómo la aplicaste y qué medidas éticas tomaste.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 CONTACTO

• Telegram: https://t.me/+3u7vzOq8LBFmYzUx

¡Éxitos en el hackathon!

— Comité Organizador
Hackathon UNETI IA 2026
```

---

## Versión corta (recordatorio)

```
Asunto: Recuerda reportar tu proyecto en el panel remoto

Hola [Nombre],

Este es un recordatorio para que reportes tu proyecto y avances
en el panel remoto del Hackathon UNETI IA 2026.

🔗 https://hackathon-uneti-ia.pages.dev/remoto
🔑 Código: [CÓDIGO]

Solo necesitas:
1. Entrar con tu código.
2. Completar el repositorio (GitHub/GitLab).
3. Actualizar tu demo o descripción cuando tengas avances.

Cualquier duda, escríbenos por Telegram:
https://t.me/+3u7vzOq8LBFmYzUx

— Comité Organizador
Hackathon UNETI IA 2026
```

---

## Anexo: campos del formulario

| Campo | Obligatorio | Formato | Ejemplo |
|---|---|---|---|
| **Repositorio** | ✅ Sí | URL de GitHub o GitLab | `https://github.com/usuario/repo` |
| **Nombre del proyecto** | ❌ No | Texto | `SOC Nacional IA` |
| **Enlace de demo** | ❌ No | URL | `https://demo.mi-proyecto.com` |
| **Video demo** | ❌ No | URL | `https://youtube.com/watch?v=...` |
| **Presentación / deck** | ❌ No | URL | `https://docs.google.com/...` |
| **Tecnologías** | ❌ No | Texto separado por comas | `React, Cloudflare, Python` |
| **Descripción** | ❌ No | Texto breve | `Detecta phishing con IA` |

> El repositorio debe ser `github.com` o `gitlab.com`; otro dominio es rechazado.

---

## Anexo: validaciones del sistema

| Validación | Regla |
|---|---|
| Código | Debe existir en `registrations` |
| Repositorio | `https://github.com/...` o `https://gitlab.com/...` |
| Turnstile | Verificación anti-bot obligatoria |
| Actualización | Upsert por código (última versión prevalece) |
| Correo | Se envía confirmación automática |
| Webhook | Se notifica a agentes externos (`entrega.nueva`) |

---

© 2026 Hackathon UNETI IA · Comité Organizador
