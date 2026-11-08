# Parámetros de análisis de proyectos — Hackathon UNETI IA 2026

> Documento oficial de evaluación de los proyectos participantes.
> **Evento:** 13 y 14 de noviembre de 2026 · Parque Tecnológico + Más Ciencia (IVIC).
> **Versión:** 1.0 · Migraciones `0028`.

---

## Índice

1. [Objetivo y alcance](#1-objetivo-y-alcance)
2. [Rúbrica oficial](#2-rúbrica-oficial)
3. [Escala de puntuación](#3-escala-de-puntuación)
4. [Descriptores por criterio y nivel](#4-descriptores-por-criterio-y-nivel)
5. [Fórmula de cálculo](#5-fórmula-de-cálculo)
6. [Evaluación por jurados](#6-evaluación-por-jurados)
7. [Evaluación por IA (Unitron)](#7-evaluación-por-ia-unitron)
8. [Triaje de proyectos](#8-triaje-de-proyectos)
9. [Preselección y estados](#9-preselección-y-estados)
10. [Desempates y descalificaciones](#10-desempates-y-descalificaciones)
11. [Ejemplo completo](#11-ejemplo-completo)
12. [Anexo: configuración](#12-anexo-configuración)

---

## 1. Objetivo y alcance

El análisis de proyectos busca **seleccionar, ordenar y reconocer** las mejores soluciones desarrolladas durante el hackathon, con criterios **objetivos, transparentes y reproducibles**.

### Qué se evalúa
- La **propuesta** (antes del evento, para preselección de grupos).
- El **proyecto entregado** (repositorio + demo + pitch).

### Quién evalúa
1. **Jurados** (evaluación humana, presencial).
2. **Unitron IA** (evaluación automática de propuestas).
3. **Comité** (validación final y desempates).

### Ejes del evento
| Eje | Código |
|---|---|
| IA Ética y Responsable | `etica` |
| Ciberseguridad | `seguridad` |

---

## 2. Rúbrica oficial

Cada proyecto se puntúa en **6 criterios** con pesos que suman **100 %**.

| # | Criterio | Clave | Peso | Qué se evalúa |
|---|---|---|---|---|
| 1 | **Viabilidad técnica / calidad del MVP** | `viabilidad` | **25 %** | Que funcione, arquitectura, robustez, uso correcto de datos. |
| 2 | **Impacto y relevancia del problema** | `impacto` | **20 %** | Magnitud y claridad del problema abordado. |
| 3 | **Innovación y uso de IA** | `innovacion` | **20 %** | Aplicación efectiva y creativa de Inteligencia Artificial. |
| 4 | **Calidad del pitch** | `pitch` | **15 %** | Claridad, storytelling y defensa de las decisiones técnicas. |
| 5 | **Ética y responsabilidad de la IA** | `etica` | **10 %** | Privacidad, sesgos, transparencia y uso responsable. |
| 6 | **Escalabilidad / sostenibilidad** | `escalabilidad` | **10 %** | Potencial de crecimiento y continuidad. |
| | **Total** | | **100 %** | |

> 📌 La rúbrica es **la misma** para participantes presenciales y remotos.

---

## 3. Escala de puntuación

Cada criterio se puntúa de **1 a 5** (números enteros).

| Nivel | Etiqueta | Significado |
|---|---|---|
| **1** | Insuficiente | No cumple o es apenas un esbozo. |
| **2** | Básico | Cumple parcialmente, con fallas importantes. |
| **3** | Aceptable | Cumple lo esencial, sin destacar. |
| **4** | Bueno | Cumple bien, con detalles menores. |
| **5** | Excelente | Cumple plenamente y destaca. |

**Puntaje final:** entre **1.0** y **5.0**.

---

## 4. Descriptores por criterio y nivel

### 4.1 Viabilidad técnica / calidad del MVP (25 %)

| Nivel | Descriptor |
|---|---|
| **1** | No funciona o no hay MVP demostrable. |
| **2** | Funciona parcialmente; errores bloqueantes; arquitectura improvisada. |
| **3** | MVP funcional básico; cubre el flujo principal; deuda técnica evidente. |
| **4** | MVP sólido; flujo completo; arquitectura clara; manejo de errores. |
| **5** | MVP robusto y pulido; arquitectura escalable; calidad de código alta; datos correctos. |

### 4.2 Impacto y relevancia del problema (20 %)

| Nivel | Descriptor |
|---|---|
| **1** | Problema irrelevante o no identificado. |
| **2** | Problema vago o de impacto limitado. |
| **3** | Problema real, pero poco acotado o sin evidencia. |
| **4** | Problema relevante y bien contextualizado. |
| **5** | Problema crítico, bien evidenciado, con beneficiarios claros y alto impacto público. |

### 4.3 Innovación y uso de IA (20 %)

| Nivel | Descriptor |
|---|---|
| **1** | Sin uso de IA o uso meramente decorativo. |
| **2** | IA aplicada de forma superficial (prompt simple). |
| **3** | IA aplicada correctamente a una tarea concreta. |
| **4** | IA integrada con criterio; solución creativa. |
| **5** | IA diferencial: enfoque novedoso, técnicamente ambicioso y bien resuelto. |

### 4.4 Calidad del pitch (15 %)

| Nivel | Descriptor |
|---|---|
| **1** | No se entiende la propuesta; sin demo. |
| **2** | Explicación confusa; no defiende decisiones. |
| **3** | Pitch claro pero genérico. |
| **4** | Pitch claro, estructurado y con demo convincente. |
| **5** | Pitch memorable: storytelling, demo impecable y defensa técnica sólida. |

### 4.5 Ética y responsabilidad de la IA (10 %)

| Nivel | Descriptor |
|---|---|
| **1** | Ignora riesgos éticos; expone datos sin control. |
| **2** | Menciona la ética sin aplicarla. |
| **3** | Considera privacidad y sesgos de forma básica. |
| **4** | Aplica medidas concretas (anonimización, transparencia, consentimiento). |
| **5** | Ética integrada por diseño: privacidad, mitigación de sesgos, explicabilidad y auditoría. |

### 4.6 Escalabilidad / sostenibilidad (10 %)

| Nivel | Descriptor |
|---|---|
| **1** | Solución no replicable. |
| **2** | Difícil de escalar; depende de condiciones frágiles. |
| **3** | Escalable con esfuerzo considerable. |
| **4** | Arquitectura y modelo permiten crecimiento razonable. |
| **5** | Diseñada para escalar: bajo costo operativo, mantenible y con ruta de continuidad clara. |

---

## 5. Fórmula de cálculo

### 5.1 Puntaje ponderado (jurados)

```
puntaje_final = Σ (promedio_criterio × peso)
```

Donde:

| Criterio | Peso |
|---|---|
| `viabilidad` | 0.25 |
| `impacto` | 0.20 |
| `innovacion` | 0.20 |
| `pitch` | 0.15 |
| `etica` | 0.10 |
| `escalabilidad` | 0.10 |

El `promedio_criterio` es el promedio de las puntuaciones de **todos los jurados** para ese criterio.

**Rango:** `1.00` – `5.00` (se redondea a 2 decimales).

### 5.2 Puntaje IA (propuestas)

El motor IA asigna un **puntaje de 0 a 100** por propuesta (escala distinta, solo para preselección).

---

## 6. Evaluación por jurados

### 6.1 Proceso

1. Se selecciona un **jurado** y un **equipo**.
2. El jurado puntúa los **6 criterios** (1–5).
3. Se guarda en la tabla `scores` (único por `judge_id + team_id + criterio`).
4. Se calcula el **promedio por criterio** y el **ponderado**.

### 6.2 Reglas

- Cada jurado puede evaluar a todos los equipos.
- Si un jurado reevalúa, se **actualiza** (no se duplica).
- El puntaje final usa el **promedio** de todos los jurados.
- El jurado puede evaluar **a ciegas** (sin ver la identidad del equipo).

### 6.3 Fecha de evaluación
**Sábado 14 de noviembre · 3:30 pm – 6:00 pm** (presentaciones).

---

## 7. Evaluación por IA (Unitron)

### 7.1 Parámetros del motor

| Parámetro | Valor |
|---|---|
| **Modelo** | `@cf/zai-org/glm-4.7-flash` (Workers AI) |
| **Entrada** | Propuestas de grupos (`registrations.propuesta`) |
| **Salida** | `[{ "indice": N, "puntaje": 0–100, "justificacion": "…" }]` |
| **Justificación** | Máximo **30 palabras** |
| **Formato** | JSON estricto (sin texto adicional) |

### 7.2 Criterios que usa el prompt

El prompt del agente incluye los **mismos 6 criterios y pesos**:

```
- Viabilidad técnica / calidad del MVP: 25%
- Impacto y relevancia del problema: 20%
- Innovación y uso de IA: 20%
- Calidad del pitch (claridad de la idea): 15%
- Ética y responsabilidad de la IA: 10%
- Escalabilidad / sostenibilidad: 10%
```

### 7.3 Prompt del sistema (editable)

> Eres un especialista en evaluación de proyectos de hackathon de Inteligencia Artificial Ética y Ciberseguridad, orientados al sector público venezolano.
>
> Evalúa cada propuesta de desarrollo según estos criterios y pesos:
> - Viabilidad técnica / calidad del MVP: 25%
> - Impacto y relevancia del problema: 20%
> - Innovación y uso de IA: 20%
> - Calidad del pitch (claridad de la idea): 15%
> - Ética y responsabilidad de la IA: 10%
> - Escalabilidad / sostenibilidad: 10%
>
> Para cada propuesta asigna una puntuación total de 0 a 100 y una justificación breve (máximo 30 palabras) que destaque fortalezas y riesgos.
>
> IMPORTANTE: responde SOLO con un arreglo JSON válido…

> ⚙️ El prompt se puede personalizar desde **Panel admin → Evaluación → Evaluación IA** (tabla `evaluador_config`).

---

## 8. Triaje de proyectos

Antes de la evaluación final, el agente **🔀 Triaje de proyectos** clasifica automáticamente cada entrega.

### 8.1 Estados

| Estado | Condición | Recomendación |
|---|---|---|
| ✅ **Completo** | Repo + demo + propuesta + repo público | **Pasa** |
| ⚠️ **Incompleto** | Falta demo o propuesta | **Revisar** |
| 🔍 **Revisar** | Repositorio privado | **Revisar** |
| ❌ **Inválido** | Sin repositorio, o repo no existe (404) | **Rechazar** |

### 8.2 Validaciones técnicas

| Validación | Regla |
|---|---|
| **Repositorio** | Debe ser `github.com` o `gitlab.com` |
| **Existencia** | Se consulta la API de GitHub (máx. 30 repos por ejecución) |
| **Visibilidad** | Público (si es privado → Revisar) |
| **Completitud** | Repo + demo + propuesta |

### 8.3 Datos que reporta

- Código, proyecto, participante, modalidad.
- Estado, recomendación, faltantes.
- Estado del repositorio (existe / privado / lenguaje).
- Puntaje IA (si existe evaluación previa).

---

## 9. Preselección y estados

### 9.1 Estados de una evaluación

| Estado | Significado |
|---|---|
| `pendiente` | Evaluado pero sin decisión. |
| `preseleccionado` | Pasa a la siguiente ronda. |
| `final` | Seleccionado como finalista. |

### 9.2 Flujo

```
Inscripción grupal
   ↓
Evaluación IA (0–100)
   ↓
Preselección (20 grupos → 10 equipos)
   ↓
Evaluación de jurados (1–5 ponderado)
   ↓
Resultados y premiación (1º, 2º, 3º)
```

### 9.3 Criterios de preselección
1. Completitud de la propuesta.
2. Puntaje IA.
3. Viabilidad técnica declarada.
4. Pertinencia al eje.

---

## 10. Desempates y descalificaciones

### 10.1 Desempate (en orden)

1. Mayor puntaje en **Viabilidad técnica** (25 %).
2. Mayor puntaje en **Impacto** (20 %).
3. Mayor puntaje en **Innovación** (20 %).
4. Mayor puntaje en **Pitch** (15 %).
5. Decisión del **comité organizador**.

### 10.2 Descalificación automática

| Causa | Consecuencia |
|---|---|
| Repositorio inexistente o privado sin acceso | ❌ Inválido |
| Sin entrega al cierre | ❌ Sin evaluación |
| Plagio comprobado | ❌ Descalificado |
| Incumplimiento del Código de Conducta | ❌ Descalificado |
| Uso de datos personales sin consentimiento | ❌ Descalificado |

---

## 11. Ejemplo completo

### Datos del equipo «Equipo Alpha»

| Criterio | Peso | Jurado A | Jurado B | Promedio |
|---|---|---|---|---|
| Viabilidad | 0.25 | 4 | 5 | **4.5** |
| Impacto | 0.20 | 4 | 4 | **4.0** |
| Innovación | 0.20 | 5 | 4 | **4.5** |
| Pitch | 0.15 | 3 | 4 | **3.5** |
| Ética | 0.10 | 4 | 4 | **4.0** |
| Escalabilidad | 0.10 | 3 | 4 | **3.5** |

### Cálculo

```
puntaje = (4.5 × 0.25) + (4.0 × 0.20) + (4.5 × 0.20)
        + (3.5 × 0.15) + (4.0 × 0.10) + (3.5 × 0.10)

        = 1.125 + 0.800 + 0.900 + 0.525 + 0.400 + 0.350
        = 4.10
```

**Puntaje final: 4.10 / 5.00**

### Preselección IA

| Métrica | Valor |
|---|---|
| Puntaje IA | 87 / 100 |
| Estado | `preseleccionado` |
| Observación | «MVP claro y bien acotado; falta demo del flujo secundario.» |

---

## 12. Anexo: configuración

### 12.1 Constantes de la rúbrica

```json
{
  "criterios": [
    { "key": "viabilidad",    "label": "Viabilidad técnica / MVP",      "peso": 25 },
    { "key": "impacto",       "label": "Impacto y relevancia",          "peso": 20 },
    { "key": "innovacion",    "label": "Innovación y uso de IA",        "peso": 20 },
    { "key": "pitch",         "label": "Calidad del pitch",             "peso": 15 },
    { "key": "etica",         "label": "Ética y responsabilidad",       "peso": 10 },
    { "key": "escalabilidad", "label": "Escalabilidad / sostenibilidad","peso": 10 }
  ],
  "escala": { "min": 1, "max": 5 },
  "total_max": 5.0
}
```

### 12.2 Tablas implicadas

| Tabla | Uso |
|---|---|
| `scores` | Puntajes de jurados (`judge_id`, `team_id`, `criterio`, `puntaje`) |
| `evaluaciones` | Puntajes IA (`group_id`, `puntaje`, `justificacion`, `estado`) |
| `entregas` | Proyectos entregados (repo, demo, descripción) |
| `evaluador_config` | Prompt personalizado del agente IA |

### 12.3 Endpoints relacionados

| Endpoint | Función |
|---|---|
| `GET /api/admin/scores` | Leer puntajes |
| `POST /api/admin/scores` | Guardar puntajes |
| `POST /api/admin/evaluar` | Ejecutar evaluación IA |
| `POST /api/admin/seleccion` | Cambiar estado |
| `GET /api/admin/resultados` | Ranking ponderado |
| `POST /api/admin/agente-triaje-proyectos` | Triaje de proyectos |
| `GET /api/v1/scores` | Puntajes (API externa) |
| `GET /api/v1/evaluaciones` | Evaluaciones IA (API externa) |

---

© 2026 Hackathon UNETI IA · Comité Organizador
