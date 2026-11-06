# Metodología de Desarrollo — Specification-Driven Development (SDD)

**Hackathon UNETI IA 2026 · Metodología oficial para todos los proyectos**

> **Principio central:** La especificación es la **fuente única de verdad**. Todo el código se deriva de ella. Si algo no está claro, la especificación manda.

---

## 1. ¿Qué es SDD?

SDD es una metodología donde **primero escribes una especificación precisa y verificable** (qué construir, cómo debe comportarse, cómo se valida) y **después** generas el código a partir de esa especificación. Es ideal cuando trabajas con **agentes de IA**: la especificación es el "contexto" que guía a los agentes para que generen código consistente y alineado.

---

## 2. Ciclo de trabajo (5 fases)

1. **Especificar** — Define el problema, los requisitos funcionales (RF) y no funcionales (RNF), las historias de usuario y los **criterios de aceptación**. Salida: `SPEC.md`.
2. **Diseñar** — A partir de la spec, define la arquitectura, el modelo de datos y los contratos de las APIs/interfaces. Salida: `DESIGN.md`.
3. **Generar** — Usa los agentes de IA (DeepSeek Harness, Antigravity, OpenClaw, Cloudflare) para generar el código **usando la spec y el diseño como contexto**. El agente no improvisa: sigue la spec.
4. **Verificar** — Convierte cada criterio de aceptación en una prueba y ejecútala. Salida: `TESTS.md` + resultados.
5. **Iterar** — Si algo falla o cambia un requisito, **actualiza la spec primero** y vuelve a generar/verificar. Nunca corrijas el código a ciegas.

---

## 3. Regla de oro

**Spec primero, código después.** Todo cambio se refleja primero en la especificación; el código es un derivado de ella.

---

## 4. Artefactos del proyecto

| Artefacto | Contenido |
|---|---|
| `SPEC.md` | Problema, requisitos, historias de usuario, criterios de aceptación |
| `DESIGN.md` | Arquitectura, modelo de datos, contratos de API |
| `TECH.md` | Stack, decisiones técnicas, despliegue |
| `CONTENT.md` | Contenido/copy (si aplica) |
| Código | Generado a partir de los anteriores |
| `TESTS.md` | Mapeo criterio de aceptación → prueba |

---

## 5. Cómo usar los agentes de IA con SDD

1. Escribe un `SPEC.md` claro y completo.
2. Da la spec al agente (DeepSeek Harness / Antigravity / OpenClaw) como contexto.
3. Pide al agente: "genera el código que cumpla esta especificación".
4. Revisa el código contra los criterios de aceptación.
5. Si no cumple, corrige la spec y repite (no corrijas el código a ciegas).

---

## 6. Criterios de aceptación (cómo escribirlos)

Un buen criterio de aceptación es **verificable** y sigue el formato:

> **Dado** [contexto], **cuando** [acción], **entonces** [resultado esperado].

Ejemplos:
- *Dado* un formulario de inscripción, *cuando* el usuario envía un correo inválido, *entonces* se muestra un error y no se guarda.
- *Dado* un detector de phishing, *cuando* recibe una URL maliciosa, *entonces* la clasifica como maliciosa con ≥ 90 % de precisión.

---

## 7. Definition of Done

Un proyecto está "terminado" cuando:
- [ ] `SPEC.md` existe y está actualizado.
- [ ] Todos los criterios de aceptación tienen una prueba que pasa.
- [ ] El código se generó a partir de la spec (trazabilidad spec → código).
- [ ] El equipo puede explicar cada decisión técnica desde la spec.

---

## 8. Plantilla de `SPEC.md`

```markdown
# SPEC — [Nombre del proyecto]

## 1. Problema
[Qué problema resuelve y para quién]

## 2. Objetivos
[Qué debe lograr]

## 3. Requisitos funcionales (RF)
- RF-01: ...

## 4. Requisitos no funcionales (RNF)
- RNF-01: ...

## 5. Historias de usuario
- Como [usuario], quiero [acción], para [beneficio].

## 6. Criterios de aceptación
- Dado ..., cuando ..., entonces ...

## 7. Fuera de alcance
[Qué NO se hará]
```
