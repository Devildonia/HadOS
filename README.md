<div align="center">

# 🖥️ Windows App Center

**A high-fidelity Windows 95/98 desktop simulator & modular prototyping lab, built for the modern web.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-%23646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r183-000000.svg?style=flat&logo=three.js&logoColor=white)](https://threejs.org/)
[![PWA](https://img.shields.io/badge/PWA-offline--ready-5A0FC8.svg?style=flat&logo=pwa&logoColor=white)](https://vite-pwa-org.netlify.app/)
[![Tests](https://img.shields.io/badge/tests-464%20passing-brightgreen.svg?style=flat)](#-testing)
[![CI Status](https://github.com/DeViLDoNia/windows-app-center/actions/workflows/ci.yml/badge.svg)](https://github.com/DeViLDoNia/windows-app-center/actions/workflows/ci.yml)

### ▶️ **[Live Demo](https://hades-aka-devildonia.itch.io/windows-app-centre)**

<p align="center">
  <a href="https://hades-aka-devildonia.itch.io/windows-app-centre">
    <img src="docs/screenshots/hero.gif" alt="Windows App Center — dragging the 3D physics ragdoll around the Win95 desktop" width="760">
  </a>
</p>

</div>

---

Windows App Center is a fully functional desktop environment that runs entirely in the browser — but under the retro Win95 chrome sits a deliberately **production-grade architecture**: a process Kernel that spawns **isolated Worker/iframe processes**, mediated **syscalls** behind user-consented **permissions**, an async **IndexedDB/OPFS** file system, a 3D physics engine, and a 626-test suite. It doubles as a **sandbox for developing modular systems** (VFS, Kernel, IPC, Rapier3D, Resource lifecycle) that can be extracted and ported into other projects.

> [!NOTE]
> Audited for stability, security, and performance (July 2026) — all findings remediated with regression tests. Since v1.6.6 the system follows a 6-phase **Web OS** architecture; per-phase design notes live in [`docs/webos-roadmap/`](docs/webos-roadmap/). See the [CHANGELOG](CHANGELOG.md) for the full version history.

## 📋 Table of Contents
- [Why this exists](#-why-this-exists)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Testing](#-testing)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Creating an App](#-creating-an-app)
- [PWA & Offline](#-pwa--offline)
- [Browser Support](#-browser-support)
- [Roadmap](#-roadmap)
- [Known Limitations](#-known-limitations)
- [Contributing](#-contributing)
- [License & Credits](#-license)

---

## 🎯 Why this exists

The "desktop in the browser" space is crowded — so this project leans on **engineering quality** rather than feature count:

- 🧠 **Real OS primitives, not a mockup.** A process `Kernel` that spawns genuinely **isolated processes** (Web Worker / sandboxed iframe) over an authenticated per-process IPC channel — a `while(true)` in an app can't freeze the desktop, and a watchdog kills it. Apps reach the system only through **mediated syscalls** gated by **user-consented capabilities**, and are confined to their own home directory.
- 🦴 **A 3D physics pet.** An interactive ragdoll powered by **Rapier3D + Three.js** with grab physics, procedural animation, and an AI state machine — a differentiator you won't find in most desktop clones.
- 🔬 **Determinism by design.** Zero `Math.random()` in logic paths; seeded PRNG where reproducibility matters. Hot paths are zero-allocation with a fixed-timestep loop.
- ✅ **660 tests** (unit, characterization & Playwright E2E) with coverage gates in CI — rare in this niche.
- 🎨 **Intentional aesthetics.** Pixel-accurate Win95 chrome plus a "Modern" theme, driven by a token-based theme engine — no AI-default look.
- 🧩 **Built to be extended.** Auto-registering apps, a scaffolder (`npm run generate:app`), and a runtime plugin API.

---

## 📸 Screenshots

| Classic Win95 | Modern (Windows UI) |
|:---:|:---:|
| ![Classic Win95 desktop](docs/screenshots/desktop-win95.png) | ![Modern Windows UI desktop](docs/screenshots/desktop-modern.png) |
| **Start Menu** | **Multitasking — Task Manager & MS-DOS Prompt** |
| ![Start Menu](docs/screenshots/start-menu-win95.png) | ![Task Manager and MS-DOS Prompt windows](docs/screenshots/apps-win95.png) |
| **3D Physics Ragdoll** | **Games Arcade (sandboxed)** |
| ![3D physics ragdoll pet on the desktop](docs/screenshots/ragdoll-3d.png) | ![Chapas Prime game running in a sandboxed window](docs/screenshots/games-arcade.png) |

---

## ✨ Features

### 🏢 Desktop Environment
- **Process Kernel** — a real process table (`launch`/`kill`, PID registry, singleton handling) that owns every app's lifecycle, and spawns **isolated processes**: `spawnWorker()` (Web Worker) and `spawnIframe()` (sandboxed iframe over an authenticated `MessagePort`), each tagged with its `kind`.
- **Process isolation + watchdog** — heavy work runs off the main thread, so an app can't freeze the desktop; a `ProcessWatchdog` pings processes and kills unresponsive ones. **Prime Lab** demos it: the UI stays live while a worker crunches primes.
- **App Runtime SDK** — a guest-side SDK (`js/sdk/appRuntime.ts`) so an isolated app speaks the IPC protocol declaratively: it announces readiness, auto-answers pings, routes requests, and calls `syscall(name, args)`.
- **Syscalls + permissions** — processes reach the system only through mediated syscalls (`fs.read`/`fs.list`/`fs.write`/`notify`/`sys.log`), gated by a `PermissionBroker` that asks the user on first use and remembers the decision, and confined to the app's own home dir (`C:\APPS\<id>`).
- **App packaging** — install `.wapp` packages: an `app.json` manifest (id, semver, entry, declared `permissions`) validated and versioned, files laid into the app home, SHA-256 integrity stamp, a local registry, clean updates and uninstall. Declared permissions are the ceiling the broker enforces.
- **Service Container (DI)** — decoupled systems (Kernel, VFS, Window Manager, Audio, Resource Manager) resolved through a typed registry.
- **Virtual File System** — hierarchical directories persisted **asynchronously to IndexedDB** (escaping the ~5–10 MB `localStorage` cap), with binary/large files stored out-of-tree in **OPFS**, debounced writes, quota handling and automatic migration from the legacy `localStorage` tree.
- **Native Window Manager** — drag, resize, minimize, maximize, z-index focus, **Aero-style edge snapping**, and deterministic teardown.
- **Session resume** — the desktop remembers which apps are open and their layout, and restores them on reload.
- **Resource Manager** — owner-scoped registry (WebGL, audio, listeners, timers) with LIFO disposal for leak-free cleanup.
- **Theme Engine** — switch between *Classic Win95* and *Modern* live; all UI is token-driven.
- **Plugin API** — validate and register/unregister third-party apps at runtime through the Kernel.
- **♿ Accessibility** — ARIA roles, Alt+Tab window switcher, focus management, and an `aria-live` screen-reader announcer.

### 🎮 Ragdoll Pets (2D & 3D)
- **3D Physics Ragdoll** — Rapier3D + Three.js, with elastic grab, procedural animation, and AI states (Wander / Idle / Perform).
- **2D Stickman Pet** — Matter.js physics pet that reacts to the mouse, windows, and desktop icons.
- **Workshop** — customize skins, scale, and behavior.

### 🛠️ Built-in Applications
📝 Notepad (VFS save/load, find & replace, multi-window) · 🎨 Paint (tools, color pickers, undo/redo) · 📂 File Explorer · 🌐 Internet Explorer (history + URL safety filter) · 📻 Webamp · ⚙️ Control Panel & Settings (HDR, wallpapers, themes, language) · 🖥️ **MS-DOS Prompt** (VFS-backed shell) · 📊 **Task Manager** (live process monitor) · 🧩 **Plugin Manager**.

### 🕹️ Games Arcade
Sandboxed in isolated iframes and registered with the Kernel: 🎮 Virtual Life Restart Sim · 🐦 Flappy Neon · ⚽ Football Rush · 🔫 Ultimate DOOM · 🧱 Tetris Tryhard · 🔴 Chapas Prime (Three.js) · 🌙 Nocturna (Web Audio rhythm) · 👾 H.I.P. Game Boy (3D WebGL).

### 🌈 Advanced Visuals
- **GLSL Wallpaper Engine** — multi-pass shaders for dynamic backgrounds.
- **HDR Support** — detection and toggling of High Dynamic Range rendering.
- **BIOS & Boot** — realistic startup sequence with BIOS check and splash.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript 5.9 (`strict`, zero `@ts-ignore`) |
| Build / Dev | Vite 5, `vite-plugin-pwa` (Workbox `injectManifest`) |
| 3D / Physics | Three.js r183, Rapier3D (WASM) |
| 2D Physics | Matter.js |
| Audio | Web Audio API (procedural synthesis) |
| Graphics | WebGL2, GLSL shaders |
| Testing | Vitest 4 (+ v8 coverage), Playwright |
| Tooling | ESLint (typescript-eslint), Tailwind (games build only) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) **v18+**
- npm (or yarn)

### Installation
```bash
# 1. Clone
git clone https://github.com/DeViLDoNia/windows-app-center.git
cd windows-app-center

# 2. Install
npm install

# 3. Run the dev server (http://localhost:3000)
npm run dev

# 4. Production build + local preview
npm run build
npm run preview
```

---

## 🎮 Usage

**Opening apps:** double-click a desktop icon or use the **Start Menu**.

**Keyboard shortcuts**
| Shortcut | Action |
|---|---|
| `Alt` + `Tab` | Cycle windows forward |
| `Shift` + `Alt` + `Tab` | Cycle windows backward |
| `Shift` + `F10` | Context menu |

**MS-DOS Prompt commands**
```text
help            Show available commands
ver             Print version info
dir / ls        List the current directory
cd <dir>        Change directory (supports .. and absolute C:\ paths)
type / cat      Print a file's contents
echo <t> > file Write text to a file
mkdir <name>    Create a directory
del / rm <n>    Delete a file or directory
ren <old> <new> Rename
cls / clear     Clear the screen
```
Use `↑` / `↓` to navigate command history.

---

## ✅ Testing

**660 tests across 57 files** — unit, *characterization* (behavior-locking tests for the Kernel, Window Manager, and Audio Manager), regression tests that encode every audit finding, error-path tests (storage quota, denied permissions, crashed processes), and Playwright end-to-end boot/interaction specs. Coverage thresholds are enforced as blocking CI gates.

```bash
npm test              # watch mode
npm run test:run      # single run (verbose)
npm run test:ui       # Vitest UI
npm run test:coverage # coverage report (v8)
npm run test:e2e      # Playwright E2E
npm run typecheck     # tsc --noEmit
npm run lint          # ESLint
```

**CI (GitHub Actions):** runs on every push/PR to `main`, in three blocking jobs — **Code Quality** (`lint` + `typecheck` + `test:coverage`), **E2E** (Playwright), and **Production Build**.

---

## 🏗️ Architecture

```mermaid
graph TD
    User([User Interaction]) --> OS[OS Engine]
    OS --> Services[Service Container]

    subgraph Services
        K[Kernel]
        VFS[Virtual File System]
        WM[Window Manager]
        RM[Resource Manager]
        PkgM[Package Manager]
        PB[Permission Broker]
        SB[Syscall Broker]
    end

    Services --> Apps[In-realm Apps]
    Apps --> Notepad
    Apps --> Paint
    Apps --> Terminal[MS-DOS Prompt]

    K -->|spawnWorker / spawnIframe| Proc[Isolated Processes]
    Proc --> W[Web Worker]
    Proc --> IF[Sandboxed iframe]
    W <-->|IPC| SB
    IF <-->|MessagePort IPC| SB
    SB -->|capability check| PB
    PB -->|consent + grants| VFS
    SB -->|mediated fs.* / notify| VFS
    PkgM -->|installs to C:\APPS\id| VFS
    PkgM -->|declares ceiling| PB

    VFS --> IDB[(IndexedDB · tree)]
    VFS --> OPFS[(OPFS · blobs)]
```

Isolated processes never touch the VFS directly: they issue **syscalls** over their own
authenticated IPC channel, the **Syscall Broker** checks the capability with the
**Permission Broker** (user consent, remembered), and only then does it reach the VFS —
confined to the app's home directory.

### Architecture highlights
- **Kernel** — a `Map<pid, process>` registry with immediate cleanup on `kill()` and automatic `terminate()` propagation to app instances. Singleton apps refocus their running instance instead of duplicating. Processes are tagged `app` (in-realm), `worker` or `iframe`.
- **Process isolation & IPC** — `spawnWorker()`/`spawnIframe()` run code off the Kernel's realm behind a versioned IPC protocol. The host handle (`WorkerProcess`) talks to an injectable transport, so a Worker, a `MessagePort` or a test loopback are interchangeable. iframe processes get a **dedicated, authenticated `MessagePort`** (the host hands the port only to its own iframe; the guest accepts it only from `window.parent`) instead of the global `window` bus.
- **Syscalls, permissions & packaging** — a `SyscallBroker` mediates `fs.*`/`notify`/`sys.log`; a `PermissionBroker` asks the user for consent per capability and persists the grant; a `PackageManager` installs versioned `.wapp` packages whose manifest declares the permission ceiling. Every app is confined to `C:\APPS\<id>`.
- **VFS** — an in-memory tree (synchronous reads) over async **IndexedDB** persistence, with binary blobs in **OPFS** so large files never bloat the serialized tree.
- **Event-driven core** — a zero-allocation event bus where each handler is isolated (one failing listener never breaks the others), plus a reactive, persisted store.
- **Service Container** — a typed DI registry with async resolution (`whenReady`) and HMR-safe `unregister`.
- **Resource Manager** — owner-scoped disposables with LIFO teardown; `Kernel.kill()` and each app's `terminate()` release their WebGL contexts, audio nodes, listeners, and timers deterministically.
- **Determinism** — logic paths avoid `Math.random()`; hot paths use preallocated buffers and a fixed-timestep accumulator with render interpolation.

---

## 📁 Project Structure

```text
windows-app-center/
├─ js/
│  ├─ core/        # Kernel, EventBus, Store, Service Container, Ragdoll3D core…
│  │  ├─ ipc/      # versioned process IPC protocol
│  │  ├─ VFS·VFSStore·VFSBlobStore        # tree + IndexedDB + OPFS blobs
│  │  ├─ WorkerProcess·IframeProcess      # isolated process handles + transports
│  │  ├─ ProcessWatchdog·SyscallBroker    # liveness + mediated system access
│  │  ├─ PermissionBroker·PackageManager  # consent/grants + .wapp install
│  │  └─ SessionManager·ResourceManager   # session resume + leak-free teardown
│  ├─ apps/        # Notepad, Paint, Terminal, PrimeLab, TaskManager… (auto-registered)
│  ├─ sdk/         # guest-side App Runtime SDK (appRuntime, guestBoot)
│  ├─ workers/     # worker-process entries (compute.worker.ts)
│  ├─ ui/          # WindowFactory, WindowInteractions (drag/snap), ShaderWallpaper…
│  ├─ audio/       # AudioManager, procedural synth
│  ├─ services/    # i18n and other cross-cutting services
│  └─ utils.ts     # shared helpers (escapeHTML, eventManager, logger…)
├─ docs/
│  └─ webos-roadmap/  # per-phase design notes (0 → 5)
├─ public/
│  ├─ games/       # sandboxed iframe games
│  ├─ css/themes/  # theme-base / theme-win95 / theme-modern tokens
│  └─ sw.js        # PWA service worker source (Workbox injectManifest)
├─ test/           # Vitest unit/characterization + Playwright E2E
├─ scripts/        # create-app.js scaffolder
├─ process-guest.html  # iframe process guest document (Vite entry)
└─ main.ts         # entry — hydrates the VFS, boots the OS, resumes the session
```

---

## 🧩 Creating an App

Apps **auto-register** — any file in `js/apps/*.ts` that calls `Kernel.registerApp(...)` is picked up automatically (no manual wiring). Scaffold one with:

```bash
npm run generate:app
```

Or write it by hand (see `js/apps/MyTestApp.ts` for the full template):

```ts
import { Kernel } from '../core/Kernel.js';
import { WindowFactory } from '../ui/WindowFactory.js';
import type { IWindowsApp } from '../core/Types.js';

export class MyApp implements IWindowsApp {
  public windowId = '';
  constructor() {
    this.windowId = WindowFactory.create({ title: 'My App', icon: '🧪', width: 400, height: 300 });
    // …render into WindowFactory.getBody(this.windowId)…
  }
  terminate(): void {
    // release listeners/timers, then:
    WindowFactory.destroy(this.windowId);
  }
}

Kernel.registerApp('myapp', MyApp, { name: 'My App', icon: '🧪', singleton: false });
```

**Runtime plugins:** third-party `IAppPlugin` definitions are validated by `PluginManager.validatePlugin` (ID pattern, required metadata, constructor check, duplicate-ID guard) and registered via `Kernel.installPlugin` / removed with `Kernel.uninstallPlugin`.

---

## 📦 PWA & Offline

The app ships as an installable PWA. A Workbox service worker (generated from the real build via `vite-plugin-pwa`'s `injectManifest`) precaches the app shell, so it launches offline after the first visit and can be installed to the desktop/home screen.

---

## 🌍 Browser Support

Best experienced in a recent **Chromium-based browser** (Chrome, Edge, Brave). Requires **WebGL2** for the 3D ragdoll and shader wallpapers. Firefox and Safari run the desktop and 2D features; some heavy 3D/HDR effects and the JS-heap readout in Task Manager are Chromium-only.

---

## 🗺️ Roadmap

The 6-phase **Web OS** roadmap (async VFS → isolated processes → syscalls → permissions →
packaging → session) shipped in **v1.6.6**; design notes per phase live in
[`docs/webos-roadmap/`](docs/webos-roadmap/). What's next:

- **Real zip container** for `.wapp` packages (the manager already takes a parsed package, so a zip loader plugs in) plus **package signing** via SubtleCrypto, and a store/catalog UI.
- **Permissions UI** — review, grant and revoke app capabilities from Settings.
- **Virtual workspaces** — multiple desktops (no compositor needed; just group windows per workspace).
- **Separate-origin guests** — serve third-party apps from a subdomain for defence in depth on top of today's opaque-origin sandbox (it would also isolate each guest's own storage).
- More capabilities: `net.fetch`, `clipboard.*`, `window.open`.

See the [CHANGELOG](CHANGELOG.md) `[Unreleased]` section for the latest.

---

## ⚠️ Known Limitations

- **Persistence** is client-side: the VFS tree lives in **IndexedDB** and binary files in **OPFS** (hundreds of MB, subject to the browser's storage quota), with a `localStorage` fallback where IndexedDB is unavailable. Durability on an abrupt close is best-effort — async writes are flushed on `visibilitychange`, which is more reliable than `beforeunload`.
- **Single-user / client-side only** — no accounts, no server sync.
- **Third-party code isolation** — apps run in a sandboxed iframe with an **opaque origin** (`allow-scripts`, no `allow-same-origin`) and reach the system only through a dedicated, authenticated channel: they cannot touch the host DOM, `localStorage` or IndexedDB. A **separate origin** (subdomain) would still add defence in depth — it would also isolate the guest's *own* storage and cover sandbox escapes — but it is no longer required for third-party isolation. By design, no untrusted code is `eval`'d.
- Fake "hardware" figures in the Task Manager *System* tab are **simulated** (deterministic), not real device telemetry.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue to discuss substantial changes first. Before submitting a PR, make sure `npm run typecheck`, `npm run lint`, and `npm run test:run` pass. New apps should include a matching test file and register via the `js/apps/*` auto-loader.

---

## 📜 License

Licensed under the **MIT License** — see [LICENSE](LICENSE).

## 🙌 Credits

- **Author:** HaDeS (A.K.A. DeViLDoNia) — [GitHub](https://github.com/DeViLDoNia)
- **Physics:** [Rapier.rs](https://rapier.rs/) & [Matter.js](https://brm.io/matter-js/)
- **Rendering:** [Three.js](https://threejs.org/)
- **Aesthetics:** inspired by the golden era of computing (1995–2000).

<div align="center"><sub>© HaDeS 2026 · Built with intention.</sub></div>
