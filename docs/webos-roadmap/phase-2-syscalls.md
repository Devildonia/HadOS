# Fase 2 — Syscalls sobre el canal por proceso

**Estado:** Etapa 2.0 implementada y verificada · **Objetivo:** dar a los procesos
aislados (Worker/iframe) acceso **mediado** a los servicios del sistema (VFS, notificaciones,
log) mediante *syscalls* sobre su canal IPC dedicado, en lugar de acceso directo.

---

## 1. IPC full-duplex

Fase 1 tenía IPC en una dirección por rol (el host pedía, el guest respondía). Fase 2 lo
hace **full-duplex**: el guest también puede pedir al host (los syscalls van guest→host).

- `WorkerProcess` (host): además de `request()` (host→guest), ahora enruta **requests
  entrantes** del proceso a handlers (`onRequest(type, fn)`) y responde. Distingue
  `type==='response'` (respuesta a una petición propia → resuelve su `pending`) de una
  petición entrante (→ despacha y responde).
- `AppRuntime` (guest, SDK): además de servir handlers, ahora hace **peticiones salientes**
  (`request()` / `syscall(name, args)`) con id/pending propios.

Los espacios de id son por-endpoint; una `response` solo la casa el emisor original de la
petición, así que host y guest pueden pedirse mutuamente sin colisión.

## 2. Broker de syscalls (`js/core/SyscallBroker.ts`)

`attachSyscalls(proc, ctx)` registra en el `WorkerProcess` los handlers de syscalls que
ejecutan contra los servicios reales del host:

| Syscall | Efecto |
|---|---|
| `sys.log` | `Utils.Logger.log` con prefijo de pid/appId |
| `notify` | `Notify[level](message)` |
| `fs.read` | `VFS.readFileAsync(path)` |
| `fs.list` | `VFS.listDir(path)` |
| `fs.write` | `VFS.writeFileAsync(path, name, content)` |

**Guardas (Fase 2):**
- **Capacidades**: `ctx.allowed: Set<string>` — el proceso solo puede invocar los syscalls
  concedidos; el resto → `permission denied`. *(Fase 3 lo sustituye por consentimiento.)*
- **Confinamiento fs**: `ctx.fsRoot` — los paths de `fs.*` deben quedar dentro de la raíz;
  fuera → `fs access denied`. *(Fase 3 lo cambia al home por app.)*
- **Anti-traversal (auditoría M2)**: `assertInRoot` **rechaza explícitamente** cualquier path
  con segmentos `..` antes de comparar, y compara paths normalizados. Antes, un path como
  `<fsRoot>\..\..\WINDOWS` **pasaba** el prefijo y solo fallaba por accidente (`VFS.resolve`
  trata `..` como nombre literal, no como "subir"): defensa por accidente, no por diseño.
- **Allow-list de `notify.level` (auditoría B2)**: solo `info`/`success`/`warn`/`error`; un
  `level` arbitrario indexaba el servicio y alcanzaba miembros del prototipo.

El Kernel adjunta el broker en `spawnProcess` (Worker e iframe) con un set de syscalls por
defecto (`DEFAULT_SYSCALLS`) y `fsRoot` configurable por `spawnWorker/spawnIframe`.

## 3. Verificación
- Tests: `Syscall.test.js` (6) — sobre un `MessageChannel` real: `sys.log`/`fs.write`/`fs.read`
  funcionan; syscall no concedido → denegado; escritura fuera de `fsRoot` → denegada; ambas
  direcciones sin colisión de id.
- Navegador: un **iframe** aislado ejecuta `fs.write` mediado (el archivo aparece en la VFS
  real), y un intento de escribir en `C:\WINDOWS\SYSTEM` es denegado por el confinamiento.

## 4. Pendiente (Fase 3 — permisos/capabilities)
- Sustituir el `Set` estático de capacidades por un **broker de permisos** con consentimiento
  del usuario en el primer uso, concesiones persistidas en la VFS.
- **Namespacing por app** (home dir por app) en vez de un `fsRoot` fijo, con rutas compartidas
  explícitas.
- Más syscalls con contrato versionado: `window.open`, `net.fetch`, `clipboard.*`.
