# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **The browser no longer parses the stylesheet twice.** `index.html` linked `/style.css` while
  `main.ts` also imported it, so development loaded **422 rules** it did not need — Tailwind's
  preflight included — and kept two identical `Sora` `@font-face` entries, which is why
  `document.fonts.check()` could report `false` while one was still loading. The `<link>` is gone;
  the import is the Vite-idiomatic path (bundled, hashed, hot-reloaded). No flash was introduced:
  every screen starts `display:none` and nothing paints until the JS boots the OS.
- **`!important`: 40 → 32, and the rest are classified.** The 8 in `css/apps/games.css` were
  cargo: they sat next to a comment claiming to "override mobile media query", but a media query
  adds no specificity and their selectors carry an ID, so they already won. Removed and verified at
  a 375px viewport, where those mobile rules are actually live. The 10 in `css/chrome/window.css`
  are the opposite — load-bearing, because they beat the inline geometry `WindowInteractions`
  writes while dragging, and only `!important` beats inline. Both are now documented in place, and
  the full classification is in [`docs/known-issues.md`](docs/known-issues.md).

### Added

- **`docs/known-issues.md`** — every defect found and deliberately deferred, each with the evidence
  it is real and where it lives. Includes the tray toggles still turning Win95 grey when active,
  the dead `.ragdoll-pet-btn` declarations, the dead boot-animation config, and the `win95-*` names
  that outlived the rename.
- **The baseline now covers a phone viewport.** `responsive.css` and `touch.css` only exist below
  768px, so a desktop-only baseline measured none of them — and several `!important`s exist purely
  to out-rank those rules. Without this, removing one would look safe and break only on phones.

### Fixed

- **The Start menu's items were being restyled by Paint's menu bar, and vice versa.** Both
  components used the class `.menu-item`. With equal specificity, whichever partial came last won:
  the in-app menu bar's `padding: 1px 3px` squashed the Start menu's entries, and the Start menu's
  `display: flex; gap: 8px` leaked onto the menu bar's. The Start menu bug was only visible in the
  **modern** theme — in HadOS a higher-specificity theme rule masked it. The menu bar is now
  `.window-menu-item`, and the Start menu's entries render at their intended size.

### Changed

- **The three copies of `.ragdoll-pet-btn` are now one.** The tray buttons (HDR and pet toggles —
  the class name fits neither) were declared in `system/ragdoll.css`, in the tray/clock section
  and in the taskbar-buttons section, disagreeing on gap, hover colour and border; the last one
  silently won. Consolidated into `chrome/tray-buttons.css` in exactly its resolved state, so
  nothing that was rendering changed. Most of those declarations turn out to be dead anyway —
  `button:not(.window-btn)` scores (0,1,1) and beats the class's (0,1,0), so the theme supplies
  the real look. Pruning them is a behaviour change and gets its own commit.
- Duplicate selectors across the stylesheets: **5 → 0**. `chrome/clock.css` held nothing but tray
  button rules and is gone; `explorer-panels.css` and `family-tree-cards.css` are folded into the
  partials they belong to. With the collisions resolved, the manifest order is no longer
  load-bearing for identical selectors.

### Changed

- **`style.css` is no longer a god file.** Its 2507 lines are split into **37 partials** under
  `css/` (`base/`, `boot/`, `chrome/`, `desktop/`, `apps/`, `system/`, `effects/`), and the entry
  is now a 59-line ordered manifest of `@import`s. The split is strictly mechanical: each partial
  is a contiguous run of the original, imported in the original order, so the emitted stylesheet
  is unchanged. Nothing was renamed, merged or reordered.
  - Order is load-bearing and the manifest says so: `.menu-item` and `.ragdoll-pet-btn` are each
    defined in three different sections, and their relative order decides which wins.

### Added

- **`test/e2e/css-baseline.spec.js` — a safety net for stylesheet work.** The unit suite never
  evaluates CSS (jsdom does not load external stylesheets), so `style.css` could be deleted and
  704 tests would still pass. The spec pins three levels: the **CSSOM fingerprint** (every rule
  the browser parsed, in cascade order), the **computed styles** of every chrome surface in both
  themes, and **screenshots**. It is what proved the refactor changed nothing.

### Fixed

- Playwright ran with the default worker count locally, which on a many-core machine starts ~12
  concurrent pages. Each one boots the whole OS with a WebGL wallpaper and a physics pet, and the
  contexts starve each other until the boot itself times out — failing specs unrelated to the
  change under test. Capped at 2 locally (CI already used 1).

## [1.0.1] - 2026-07-15

The release where HadOS stops wearing Windows. The Start button, the window chrome, the taskbar,
the wallpaper and the boot screen were all still Microsoft's — by logo, by palette, or by
pretending to be a 1995 Pentium. All four are now the system's own.

### Added

- **A wallpaper of our own.** `SHADER_HADOS` raymarches the HadOS mark: two uprights and a
  crossbar as rounded boxes unioned into one extruded solid, lit with a key light, a fresnel edge
  and a specular highlight to echo the bevels of the logo, drifting slowly over a dark blue pool.
  Like the Windows 95 flag it replaces, the mark is *drawn* rather than blitted — a few KB of
  GLSL, resolution independent and animated for free. It costs 72 march steps against three
  boxes, well under `SHADER_MODERN`'s 40 layers of noise.

### Fixed

- **The Programs flyout vanished from the Start menu.** The rounded corners were done with
  `overflow: hidden`, but `.submenu` is positioned at `left: 100%` — outside the menu's box — so
  it was clipped away entirely. The sidebar now rounds its own corners instead. Regression from
  the HadOS chrome, reported from a screenshot.

### Changed — the Windows 95 chrome is gone

- **HadOS is now the system's own interface**, replacing the Windows 95 theme entirely. Dark
  surfaces, the blue of the HadOS mark, rounded geometry, acrylic blur, soft elevation, Sora on
  titles and labels. It covers windows, title bars and their buttons, the taskbar, the Start menu
  and submenus, dialogs, in-app menu bars and dropdowns, buttons, inputs and scrollbars.
  `theme-win95.css` is deleted and `theme-base.css`'s defaults are HadOS's, so even a failed
  theme load lands on a coherent look instead of Win95 grey.
- **The Start button wears the HadOS mark** (`pwa_icon_512.png`). It was an inline SVG of four
  coloured squares — Microsoft's logo, in Microsoft's colours — in the classic theme, and the
  Windows 11 start glyph in the modern one.
- An install saved on `win95` is **migrated to `hados`** on boot, and a stale `theme-win95` class
  is stripped from the body. The theme toggle now swaps `hados` ⇄ `modern`.

### Fixed

- **The taskbar ignored its theme.** `DesktopManager.init()` defaulted the taskbar colour to Win95
  grey and pinned it as an inline custom property on `<body>` — which beats any stylesheet — and
  saved it, so every install ended up overriding its own theme with a colour nobody chose. Init
  now only honours a real user choice, and drops the old auto-written default.
- `#taskbar`, `.win95-window.maximized` and `#start-menu` hardcoded the 32px Win95 taskbar height,
  silently ignoring `--taskbar-height`. The modern theme had been asking for 48px and getting 32px.
- `style.css` redeclared the Win95 palette in `:root` and, loading last, quietly won over
  `theme-base.css`.
- The splash screen and `<body>` drew their black from `--os-text-color`, which worked only
  because Win95's text happened to be black. On a light-text theme the splash would have turned
  white; both now state black outright.
- In-app menus and the pet's toolbar label hardcoded Win95 greys and black text. Measured against
  the new surfaces, the Notepad dropdowns sat at a **1.54:1** contrast ratio and the pet label at
  **1.35:1**; menu labels on the accent blue came to 2.94:1 and now use the deeper blue for 5:1.

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

### Fixed

- The POST printed `Video Mode: 0x0` in embedded and headless browsers, and on a cold boot in
  general: `screen.width`/`height` can be 0 before the window is attached to a display. It now
  falls back to the viewport and **labels it as such** — a window size is not a display
  resolution — or says `Unknown` when even that is unmeasurable.

### Known limitations

- `navigator.deviceMemory` is deliberately coarse: the spec rounds it down to a power of two and
  permits clamping (8 GB is the usual ceiling) to resist fingerprinting. What you see is
  therefore **browser-dependent** — some report the machine's true size, others clamp — and
  Firefox and Safari do not implement it at all, in which case the POST says `Not reported`. We
  print what the browser offers and never extrapolate.
- There is no clock-speed API in any browser, so the old `Speed: 133 MHz` line was removed rather
  than faked.
- The GPU name comes from `WEBGL_debug_renderer_info`, which privacy modes may mask.
- `navigator.connection.effectiveType` is a coarse latency bucket, so a fast wired desktop is
  commonly reported as `4G`. That is the API's vocabulary, not a measurement error.

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
