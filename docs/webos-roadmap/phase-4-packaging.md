# Fase 4 — Empaquetado de apps

**Estado:** Etapa 4.0 implementada y verificada · **Objetivo:** formato de paquete con
manifest, instalación/actualización/desinstalación versionada, registro local persistido e
integridad — sobre la semilla de `installPlugin`/`uninstallPlugin`.

---

## 1. Formato de paquete (`.wapp`)

Un paquete es un **manifest + sus archivos**. Se representa como un envelope ya parseado
(`AppPackage`), de modo que **el contenedor es intercambiable**: hoy es un envelope JSON;
un cargador de zip se enchufa después sin tocar el `PackageManager`, que solo ve
`AppPackage`.

```ts
interface AppManifest {
  id: string;            // ^[a-z0-9-]+$  — también el nombre de su home dir
  name: string;
  version: string;       // semver x.y.z
  entry: string;         // archivo de entrada dentro del paquete
  icon?: string; description?: string;
  permissions?: string[]; // capacidades que la app PUEDE pedir (el techo)
}
interface AppPackage { manifest: AppManifest; files: Record<string, string>; }
```

`validateManifest`/`validatePackage` comprueban id, semver, entry presente en `files`, y que
las `permissions` sean capacidades conocidas. `compareVersions` decide install vs update.

**Seguridad de rutas (auditoría M2):** toda clave de `files` y el `entry` deben ser rutas
**relativas seguras** (`Utils.isSafeRelativePath`): sin segmentos `..`, sin prefijo de unidad
(`C:`) y sin separador inicial. Se rechaza en la frontera (`validatePackage`) y se re-comprueba
al escribir (`writeFiles`), en vez de confiar en cómo la VFS resuelve los paths.

## 2. PackageManager (`js/core/PackageManager.ts`)

- **install(pkg)**: valida → si ya existe, exige versión **estrictamente mayor** (rechaza
  reinstalar/downgrade) y borra los archivos viejos (**update limpio**) → escribe los
  archivos (incluidas rutas anidadas) en el **home de la app** `C:\APPS\<id>` → sella la
  **integridad SHA-256** (SubtleCrypto; fallback FNV-1a donde no exista) → registra y
  persiste → aplica el techo de permisos del manifest.
- **uninstall(id)**: borra el home, la entrada del registro, el techo declarado y **todas las
  concesiones de permisos** de la app.
- **list/get**: catálogo local. **init()**: carga el registro desde la VFS y re-aplica los
  techos (llamado en `Kernel.init`).
- Registro persistido en `C:\WINDOWS\SYSTEM\packages.json`.

## 3. Integración con Fase 3 (el punto clave)

El manifest declara el **techo**; el usuario consiente en **runtime**:

```
PermissionBroker.check(appId, cap)
   ├─ ¿la app declaró un techo y `cap` NO está en él?  → denegado SIN preguntar
   ├─ ¿hay decisión guardada?                          → aplicarla
   └─ si no                                            → preguntar (modal), recordar, persistir
```

Los archivos de la app y sus procesos comparten el mismo namespace: `C:\APPS\<id>` es a la
vez el home del paquete y el `fsRoot` al que se confinan sus syscalls `fs.*`.

## 4. Verificación
- Tests: `PackageManager.test.js` (12) — manifest válido/inválido, semver, integridad estable
  y sensible al contenido, install, entry ausente, rechazo de reinstalar/downgrade, update
  limpio (archivos obsoletos eliminados), uninstall completo, persistencia del registro con
  re-aplicación del techo, y techo aplicado (declarada pregunta / no declarada se rechaza sin
  preguntar).
- Navegador: install (integridad SHA-256 de 64 hex), archivos anidados en el home, reinstalar
  rechazado, update a 1.1.0 con archivo obsoleto eliminado, registro persistido, un **proceso
  iframe vivo** de la app instalada escribe en su home con la capability declarada, una
  capability **no declarada se rechaza sin prompt**, y uninstall deja todo limpio.

## 5. Alcance de la integridad (auditoría O1)

El hash SHA-256 sellado al instalar es un **detector de cambios**, no una garantía de autoría.
`PackageManager.verify(id, pkg)` re-hashea un paquete y lo compara con el sello registrado, útil
para detectar manipulación/corrupción antes de reinstalar. Lo que **no** hace todavía:
- no prueba **quién** produjo el paquete → hace falta **firma** (SubtleCrypto);
- no hay verificación **al lanzar**, porque los paquetes aún no se ejecutan desde el registro
  (no existe un loader que cargue el `entry`).

## 6. Pendiente
- **Contenedor zip** real (`.wapp` = zip) — cargador que produzca un `AppPackage`.
- **Firma** con SubtleCrypto (verificar autoría, no solo integridad) y catálogo remoto.
- **Loader de paquetes** que lance el `entry` en un proceso iframe y verifique la integridad ahí.
- UI de tienda/gestor de paquetes (sobre el Plugin Manager existente) y de permisos.
