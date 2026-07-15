# Fase 5 — Sesión y compositor de ventanas

**Estado:** Etapa 5.0 implementada y verificada · **Objetivo (roadmap):** compositor de
ventanas desacoplado del DOM de cada app + persistencia de sesión (reanudar al recargar).

---

## 1. Decisión de alcance: el compositor de *surfaces* no se implementa (y por qué)

El roadmap planteaba un compositor donde *"las apps dibujan en su surface y el window server
compone"*, habilitando snapping, workspaces y multi-monitor.

**Valoración:** en este sistema las apps **son DOM** (`WindowFactory` crea un
`div.win95-window` y la app renderiza dentro). Desacoplarlas en surfaces
(OffscreenCanvas/bitmaps compuestos por un window server) exigiría **reescribir el render de
todas las apps** y perder todo lo que el DOM ya da gratis (texto seleccionable,
accesibilidad, inputs nativos, CSS). El coste es una reescritura completa y el beneficio para
apps DOM es **negativo**.

Lo valioso que el compositor *habilitaba* se puede entregar sin él, porque el navegador ya
**es** el compositor: el DOM + CSS componen las ventanas. Por eso la Fase 5 entrega las
**capacidades** (snapping, sesión) en lugar de la **arquitectura de surfaces**.

> Un compositor de surfaces solo tendría sentido si las apps fueran remotas/no-DOM (p. ej.
> apps nativas por streaming). No es el caso.

## 2. Persistencia de sesión (`js/core/SessionManager.ts`)

Reanudar la sesión al recargar: qué apps estaban abiertas y con qué layout.

- **`capture()`**: recorre la tabla de procesos del Kernel y registra, por cada proceso
  `kind:'app'` con ventana: `appId`, geometría (`left/top/width/height`) y si está minimizada.
  Los procesos `worker`/`iframe` **se omiten**: son hijos que su app relanza al arrancar.
- **`save()`** (debounced 500 ms) / **`saveNow()`**: persiste en
  `C:\WINDOWS\SYSTEM\session.json`. Disparadores: `kernel:process-started/stopped`, `mouseup`
  (fin de arrastre/resize), `visibilitychange → hidden` y `beforeunload`.
- **`restore()`**: relanza cada app vía `Kernel.launch(appId)` y re-aplica la geometría a la
  ventana recién creada (los window id son generados, así que se restaura por `appId`, no por
  id). Tolera apps que ya no existen (las salta sin abortar). Un flag `restoring` evita que el
  replay se auto-sobrescriba.
- Boot: `main.ts` llama `SessionManager.init()` + `await restore()` tras `initOS`.

## 3. Snapping de ventanas (`js/ui/WindowInteractions.applySnap`)

Al soltar un arrastre cerca de un borde del **área de trabajo** (`#desktop`, que excluye la
taskbar; fallback al viewport):

| Borde | Resultado |
|---|---|
| Superior | Maximizar al área de trabajo |
| Izquierdo | Mitad izquierda |
| Derecho | Mitad derecha |

Umbral de 12 px. El borde superior gana en las esquinas. Se apoya en la delegación global de
drag introducida al corregir la auditoría (un único `mousemove`/`mouseup`).

## 4. Verificación
- Tests: `SessionManager.test.js` (8) — captura, omisión de procesos hijo, persistencia,
  restauración con geometría, no-op sin sesión, sesión corrupta/versión errónea, app que ya no
  existe, `clear()`. `WindowSnap.test.js` (6) — mitades, maximizar, sin snap, prioridad del
  borde superior, uso del área de trabajo (no del viewport).
- Navegador: se abren Notepad+Paint con un layout concreto → **se recarga la página** → ambas
  apps se relanzan solas con la geometría exacta restaurada. Snapping real: arrastre al borde
  izquierdo → 640×720 en (0,0); al superior → 1280×720; soltar en el centro → sin cambios.

## 5. Pendiente
- **Workspaces virtuales** (varios escritorios; mostrar/ocultar ventanas por workspace) — ya
  no requiere compositor, basta agrupar ventanas por workspace.
- Preview visual del snap durante el arrastre; snapping por teclado (Win+flechas).
- Multi-usuario/perfiles sobre la VFS namespaced (`C:\USERS\<user>`).
