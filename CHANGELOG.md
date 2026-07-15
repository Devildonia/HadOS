# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **The POST screen reports the real machine.** A new `HardwareProbe` reads what the browser is
  willing to disclose about the PC actually running HadOS — CPU architecture and logical
  processors, memory, GPU, native resolution with DPR and colour depth, storage quota and usage,
  network, pointer and host platform — and the boot screen prints that instead of a hardcoded
  1995 Pentium. The probe is capped at 1.5s, never rejects, and degrades each field to
  `Unknown` / `Not reported` rather than inventing a value.
- **A splash progress bar that measures something.** It was a blind 4s CSS animation that always
  reached 100%. `BootLoader` now drives it, and it holds at 90% until the boot work running
  alongside the splash (VFS hydration, `initOS`, session restore) signals ready — so a slow
  restore keeps the splash up instead of revealing a half-built desktop. A hard 12s cap means a
  stuck signal can never trap the user. Exposed to assistive tech via `role="progressbar"`.
- **`loading HadOS` wordmark** on the splash, in the self-hosted **Sora** brand face, with `Had`
  in white against the blue `OS`.

### Changed

- **Boot and shutdown sounds** are now `HadOS_startup.opus` / `HadOS_shutdown.opus`; the
  `w95_*.opus` files are gone.
- **The boot screen is HadOS's own.** It no longer prints `AMIBIOS (C) 1995 American Megatrends,
  Inc.` or `Starting Windows...` — with real hardware reported underneath, attributing the screen
  to a vendor who did not write it is the same problem as the Microsoft strings removed in 1.0.0.
- The splash progress bar grew from a 4px hairline to a glowing 10px track with a live percentage
  readout.

### Known limitations

- `navigator.deviceMemory` is **capped at 8 GB by the specification** (anti-fingerprinting), so a
  32 GB machine honestly reports 8 GB. It is Chromium-only; Firefox and Safari report nothing and
  the POST says so.
- There is no clock-speed API in any browser, so the old `Speed: 133 MHz` line was removed rather
  than faked.
- The GPU name comes from `WEBGL_debug_renderer_info`, which privacy modes may mask.

## [1.0.0] - 2026-07-15

First HadOS release. The project continues the work previously shipped as **Windows App
Center**, which reached v1.6.7 and is archived — with its full history and changelog — at
[Devildonia/windows-app-center](https://github.com/Devildonia/windows-app-center). HadOS starts
from a clean history at 1.0.0; the version reset reflects the new name, not a loss of maturity.

### Added — inherited architecture

Everything below was built and audited across the v1.6.x line and carries over intact, with
667 tests (every past audit finding encoded as a regression test) and per-phase design notes in
[`docs/webos-roadmap/`](docs/webos-roadmap/):

- **Async file system** — a virtual FS whose tree persists to **IndexedDB** and whose binary
  files live out-of-tree in **OPFS**, with synchronous in-memory reads, debounced writes, quota
  handling and schema validation.
- **Isolated processes** — the Kernel spawns Web Worker and sandboxed-iframe processes on a true
  **opaque origin**, each on a dedicated, authenticated `MessagePort`, with a versioned IPC
  protocol, a guest-side App Runtime SDK and a watchdog that kills unresponsive processes. Heavy
  work cannot freeze the desktop.
- **Mediated syscalls** — processes reach the system only through `fs.*`/`notify`/`sys.log`
  calls brokered by the host.
- **Capabilities with user consent** — a permission broker prompts on first use, remembers and
  persists the decision, and confines each app to its own home directory.
- **App packaging** — versioned `.wapp` install/update/uninstall with an `app.json` manifest
  whose declared permissions form the ceiling the broker enforces, a SHA-256 integrity stamp and
  a local registry.
- **Session resume + window snapping**, a 3D physics ragdoll pet (Rapier3D + Three.js), a games
  arcade in sandboxed iframes, 40-language i18n and PWA/offline support.

### Changed — the rename

- Rebranded from *Windows App Center* to **HadOS** across the product: window titles, boot
  screen, PWA manifest, package metadata, README and the brand strings in all 40 locales.
- The simulated-OS chrome is now HadOS's own: the Start menu reads **HadOS** / **HadOS UI**
  instead of *Windows 95* / *Windows UI*, and the shell is **Terminal** (localised per language)
  rather than *MS-DOS Prompt*.
- The terminal no longer prints `Microsoft(R) Windows 95` / `(C)Copyright Microsoft Corp
  1981-1995` — those were another vendor's copyright strings sitting in our banner. It now
  identifies as HadOS under its own MIT licence.
