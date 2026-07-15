# Fase 3 — Permisos, consentimiento y home por app

**Estado:** Etapa 3.0 implementada · **Objetivo:** sustituir el `Set` estático de
capacidades del `SyscallBroker` (Fase 2) por un **broker de permisos con consentimiento
del usuario** y dar a cada app su **directorio home** en la VFS.

---

## 1. PermissionBroker (`js/core/PermissionBroker.ts`)

Media las capacidades de cada proceso con consentimiento:

- **Capacidades** (no syscalls sueltos): `fs:read`, `fs:write`, `notify`, `net`. El
  `SyscallBroker` mapea syscall→capability (`fs.read`/`fs.list`→`fs:read`,
  `fs.write`→`fs:write`, `notify`→`notify`; `sys.log` es libre, sin consentimiento).
- **`check(appId, capability)`**: si hay una decisión guardada para `(app, capability)` la
  aplica; si no, **pregunta al usuario** una vez, recuerda la decisión y la devuelve.
- **Consentimiento persistido** en la VFS (`C:\WINDOWS\SYSTEM\permissions.json`); se recarga
  al arrancar (`PermissionBroker.init()` en `Kernel.init`).
- **Prompt inyectable** (`setPrompt`): en la app es un modal Allow/Deny; en tests se
  inyecta un decisor automático. Un prompt que lanza excepción = `denied`. El modal **escapa**
  el `appId` (auditoría B1).
- **Dedupe de consentimiento (auditoría M1)**: `check()` cachea la promesa **en vuelo** por
  `(appId, capability)`. Sin esto, un proceso que lanza N syscalls de la misma capacidad antes
  de que el usuario responda abría **N modales apilados** y ninguno registraba la decisión hasta
  que el primero resolvía. Ahora N llamadas concurrentes comparten un único diálogo.
- `peek`/`set` para leer/fijar decisiones (UI de ajustes, tests).

## 2. Home dir por app (namespacing VFS)

`Kernel.spawnProcess` calcula y crea el home del proceso: `C:\APPS\<appId>` (idempotente).
El `fsRoot` del `SyscallBroker` pasa a ser ese home, así que por defecto los `fs.*` de un
proceso quedan **confinados a su propio directorio**, no a un `C:\DOCUMENTS` compartido.
Rutas compartidas explícitas serían una concesión futura.

## 3. Flujo de un syscall (Fase 2 + 3)

```
guest.syscall('fs.write', {path, name, content})
      → host WorkerProcess.onRequest('fs.write')
      → SyscallBroker: cap = 'fs:write'
            → PermissionBroker.check(appId, 'fs:write')   ← consentimiento (prompt 1ª vez)
            → HANDLERS['fs.write']: assertInRoot(path, fsRoot=home)  ← confinamiento
            → VFS.writeFileAsync(...)
      → respuesta por el canal
```

Doble control: **consentimiento** (qué capacidades) + **confinamiento** (dónde).

## 4. Verificación
- Tests: `PermissionBroker.test.js` (5) y `Syscall.test.js` (8) — consentimiento pedido una
  vez y recordado, denegación, persistencia con recarga, scoping por app, `sys.log` libre,
  confinamiento a `fsRoot`, IPC bidireccional.
- Navegador: un iframe pide consentimiento en el primer `fs.write`, al conceder escribe en su
  home (`C:\APPS\echo-iframe`), la 2ª escritura no vuelve a preguntar, escribir fuera del home
  se deniega, y la concesión persiste en `C:\WINDOWS\SYSTEM\permissions.json`.

## 5. Pendiente
- **Manifest de app** (`app.json`: id, versión, icono, `permissions: [...]`) para declarar
  capacidades por adelantado (encaja con Fase 4 — paquetes).
- UI de gestión de permisos (revocar/conceder desde Settings).
- Rutas compartidas explícitas entre apps; más capacidades (`net`, `clipboard`, `window.open`).
