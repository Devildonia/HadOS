# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **"This PC" and a real, unified explorer.** "My Computer" no longer opens the old
  Access-Denied gag — it opens FileX at a **This PC** drive root showing one honest
  drive, **HadOS (C:)**, whose capacity is the REAL storage quota/usage from
  `navigator.storage.estimate()` (the browser sandbox cannot see the machine's
  physical disks, so there is exactly one true drive rather than fake ones). Drilling
  into the drive lands at `C:\`; Back returns to This PC.
- **Games folds into the explorer.** The Games icon is now a shortcut that opens FileX
  at `C:\GAMES` — same window, navigated in place — instead of a bespoke window. Opening
  a game still launches its folder window, and its "Back to games" now loops back into
  FileX at `C:\GAMES`. The old `win-games-folder` is functionally retired (no path
  reaches it; its markup/registration remain as dead scaffolding to remove later).
- **Explorer folder names are localized.** Documents, Desktop and Games (and the desktop
  shortcuts) show a translated label in all 40 languages, updating live when the language
  changes — while the folder's real name stays canonical, so a translated label never
  breaks a path. Brand/proper names (HADOS, game titles) are left untranslated. VFS nodes
  gained an optional `i18nKey`; the labels come from `i18n.t` at render time.

### Changed

- **VFS tidy.** Removed the stale `C:\HADOS\DESKTOP\GAMES` duplicate of `C:\GAMES`;
  the DESKTOP shortcuts "My Computer" and "Games" now use a new `explorer` action type
  that opens FileX at a path. System paths (`C:\HADOS\SYSTEM`, `C:\APPS`, `C:\DOCUMENTS`)
  were left untouched, so the recycle bin and permissions are unaffected. Existing
  installs keep their persisted tree; the cleanup is in the default only.

- **A draggable, magnetic taskbar.** Grab an empty part of the bar and drag it loose;
  it snaps to whichever of the four desktop edges the cursor is nearest, turning
  horizontal (top/bottom) or vertical (left/right, icons stacked) to match, with a
  drop-preview ghost showing where it will land. The chosen edge persists.
  `data-edge` on `#taskbar` is the single source of truth: it drives the bar's own
  position/orientation AND the `--work-*` insets that `.hados-window.maximized` and
  window-snapping read, so a moved bar never gets overlapped by a maximized or snapped
  window, on any edge. (`js/ui/TaskbarDock.ts`.)

### Changed

- **The taskbar cluster is centred**, Windows 11-style: the start button and running
  apps sit in the middle, the tray and clock in the trailing corner. In the main theme
  the start button is now a round icon button (no "Start" label), and the HDR and pet
  tray toggles became round icon buttons to match. The layout is global; the circular
  restyle is HadOS-only, so the Modern theme keeps its own buttons. Dropping the tray
  labels also fixed the toggles being clipped off when the bar docks vertically (the
  tray no longer forces a fixed height there).

## [1.1.0] - 2026-07-17

HadOS learns to run AI in the browser, and Pinta uses it to cut a subject out of a photo — on
device, with the model downloaded once and cached, gated behind user consent like any other
capability.

### Added

- **On-device AI, end to end.** A reusable substrate every later AI feature builds on: an
  `ai-runtime` Kernel worker that owns the inference runtime and the loaded models off the main
  thread; an `ai:infer` capability the PermissionBroker prompts for on first use; `ai.loadModel` /
  `ai.infer` syscalls for isolated apps; and `AiModelCache`, which downloads a model once into its
  own OPFS subdirectory (→ IndexedDB → memory), verifies it against a pinned size and SHA-256, and
  serves it on every later boot. The whole thing runs behind one `IInferenceRuntime` seam, so
  `LiteRtRuntime` (`@litertjs/core`) is the only file that knows LiteRT exists and the substrate is
  testable against a fake with no GPU or download.
- **Pinta: remove background (🪄).** Runs DeepLab v3 in the AI process and clears everything the
  model calls background, leaving the subject on transparency — undoable, so ↩️ brings it back.
  Verified in-browser on a real photo: ~34 ms on WebGPU, a spatially coherent cutout.
- **Pinta can finally open images (📂).** A file picker and drag-and-drop onto the canvas — the app
  had no way to load a bitmap before, which "remove background" needed to do anything real.
- **The model itself.** DeepLab v3 (2.65 MB, 21 PASCAL VOC classes), pinned by size and SHA-256 to
  an immutable versioned URL; its LiteRT wasm runtime (~36 MB, one build loaded per browser) is
  self-hosted from `node_modules` at build time, gitignored, and kept out of the PWA precache so a
  visitor who never touches AI never downloads it.
- **`scripts/sync-locales.js`** — fills any key missing from a locale with the English value and
  aligns key order to `en.json` for clean diffs.

### Changed

- **System dialogs are localized.** My Computer, Recycle Bin, shutdown, debug and encryption
  dialogs were hardcoded English; they now resolve through `i18n.t`, with strings across all 40
  locales (English fallback where untranslated — no regression, since they were English-only
  before). `AppPackage`'s `KNOWN_PERMISSIONS` gained `ai:infer` so a manifest can declare it.
- **Refactors.** `utils.ts` (566 lines) became a barrel over ten focused modules and `Notepad.ts`
  (717) split its dialogs/files/actions/templates out, with the public surface unchanged; the
  Ragdoll workshop's 309-line inline HTML moved to a template module; `TaskManager` named its magic
  numbers, split `refreshUI`, and skips rebuilding the process table when nothing changed.

### Fixed

- **Pinta's active tool was invisible under HadOS.** The selected tool was styled inline
  (`#e0e0e0` + a Win95 border), which no stylesheet can override, so once the theme gave the
  buttons light text it went light-on-light — contrast 1.12. It now carries a `.tool-active` class
  the themes paint, readable at 11.59 and marked three ways.
- Dead code out: `SystemBridge`'s fake `familyData`, `destroyAudioBridge`, a legacy AudioManager
  fallback, and an unused ragdoll bootstrap in `GenericApps`.

### Known issues

- The e2e CI job cannot pass on `ubuntu-latest`: every committed Playwright snapshot is `win32`,
  and the default snapshot path includes the platform. Predates this release. See
  `docs/known-issues.md`.
- A removed background is invisible against Pinta's white CSS canvas (the saved PNG is genuinely
  transparent); and the cutout keeps every recognised class, so a cat on a sofa keeps the sofa.

## [1.0.3] - 2026-07-16

The desktop stops being Microsoft's. Eight apps carry HadOS icons and names — Shell Core, Task
Pilot, Navea, Eco Bin, Notapad, FileX, Pinta — the recycle bin actually recycles, and the whole
test suite moved to TypeScript.

### Changed

- **Four more apps get HadOS icons and names:** Notepad → **Notapad** (`notapad.webp`), File
  Explorer → **FileX** (`filex.webp`, which also retired the *"Windows Explorer"* registry name),
  Paint → **Pinta** (`pinta.webp`), and Prime Lab's icon → `prime_lab.webp` (name unchanged). Brand
  names, identical across all 40 locales, reaching the app registry, window titles — including
  Notepad's dynamic `updateTitle`, which rebuilds the title as you type and had to be caught
  separately — the `aria-label`s, the desktop labels and the Start menu. A stray *"Windows Explorer"*
  in the Start menu markup went too.

### Added

- **A real recycle bin.** Deleting a file no longer destroys it: `VFS.trashNode` moves it to a
  hidden `C:\HADOS\SYSTEM\RECYCLED` dir, keeping its blobs and remembering where it came from.
  `restoreFromTrash` returns it to its origin (renaming on collision, refusing if that folder is
  gone); `emptyTrash` purges permanently and frees the blobs. Terminal `del`/`rm` route here — the
  output reads *"Moved to Eco Bin"* — while `del /f` still hard-deletes. Crucially, **system deletes
  (app uninstall, session cleanup) stay on `deleteNode`** and never fill the bin. The Eco Bin dialog
  lists trashed files with Restore and an Empty button (next to the deleted sticky notes it already
  showed), and the desktop icon flips between `eco_bin_empty` and `eco_bin_full` as the bin fills
  and empties — surviving a theme swap. 14 new tests.

### Changed

- **The HadOS desktop icons are its own now, and four apps are renamed.** `ms-dos.webp` →
  `shell_core.webp` with the app renamed **Shell Core**; `task_manager.webp` → `task_pilot.webp`,
  **Task Pilot**; `iexplorer.webp` → `navea.webp`, **Navea**; `ragdoll_skins.webp` →
  `ragdoll_workshop.webp`. My Computer, the Recycle Bin (now **Eco Bin**), the Games folder and the
  Plugin Manager also gained real icons in place of emoji. The names are brand names — identical in
  all 40 locales, like *Winamp* — and cover the app registry, window titles, `aria-label`s and the
  Start menu. The four orphaned Microsoft icons in `assets/icons/` were deleted. The **modern** theme
  is unchanged, so under it an icon can still read as MS-DOS while its label says "Shell Core";
  that is part of the deferred modern-theme work.

### Fixed

- **A latent flake in the desktop screenshot baseline.** It captured the taskbar clock, which ticks
  each minute, so a run crossing a minute boundary from the baseline differed by ~750px. The clock
  is now masked in the full-page screenshots.

### Removed

- **Two entirely dead stylesheet partials.** `css/effects/glitch.css` (133 lines: `.glitch-active`
  and three keyframes) and `css/desktop/folder-items.css` — neither class exists anywhere in the
  product: not in the markup, not in the JS, not in another stylesheet. They only ever referenced
  themselves. The `glitch` matches elsewhere are inside sandboxed game bundles, which load their
  own stylesheet from their own iframe and never see ours.
- **`!important` is down to 10**, from 40 at the start of this work. All ten are on
  `.hados-window.maximized` and are the correct tool: dragging writes `left/top/width/height`
  inline, inline beats every selector, and `!important` is the only thing that beats inline. The
  rest went as cargo (`responsive.css` and `task-manager.css` mirrored selectors that already won
  on order) or with the dead files that carried them.

## [1.0.2] - 2026-07-16

A cleanup release. The stylesheet was one 2507-line file that no test could see; it is now 34
partials behind a Playwright baseline that pins the parsed CSSOM, the computed styles of every
chrome surface in two themes and at two viewports, and the rendered pixels.

That baseline is the point. Refactoring CSS here used to be unfalsifiable — jsdom does not load
stylesheets, so `style.css` could be deleted outright and all 704 unit tests would still pass.
Every change below was accepted or rejected on what it measured, and the measurements repeatedly
disagreed with the reasoning: a "safe" split silently emitted a stylesheet with none of the OS in
it, two duplicate selectors turned out to be two live bugs, and `!important`s that looked
load-bearing were cargo while others were the only correct tool.

### Changed

- **`.win95-window` / `.win95-btn` / `.win95-dialog` are now `.hados-*`**, across 37 files, along
  with the `win95-notify-in` keyframe. Render-neutral — every screenshot came back
  pixel-identical. The storage migration keys (`win95-vfs`, `win95_vfs_root`, `win95-vfs-blobs`)
  and `ThemeManager`'s `LEGACY_THEME` keep the old name on purpose: they identify pre-rename
  installs, and renaming them would strand that data.
- **The wallpaper takes its palette from the theme.** `SHADER_HADOS`'s blues were GLSL literals
  hand-copied from the `--hados-blue-*` tokens, so editing the stylesheet quietly left the
  wallpaper on the old colour. `buildHadosShader()` now injects them from the live custom
  properties at compile time — the shader is rebuilt on every theme change anyway. The baseline
  proves the wiring by moving a token and watching the pixels follow.
- **`!important` in `css/`: 31 → 22.** Paint's nine are gone. They were unavoidable while
  `theme-hados`'s button rule scored **(1,2,2)** — because it excluded the Start button with
  `:not(#start-button)`, which hands a rule an ID's full weight. Swapping that for a `.start-btn`
  class drops it to (0,3,2), and scoping Paint's tools to their window wins outright.

### Fixed

- **Disabled text was invisible in the modern theme.** `chrome/controls.css` coloured it with
  `var(--border-dark)` — a *border* token used as *text*, which only ever worked because Win95
  happened to map it to a usable grey. Modern maps it to `#e5e5e5`: near-white on a near-white
  button. There are now `--control-disabled-color` / `--control-disabled-text-shadow` tokens per
  theme, and modern renders at `#9a9a9a`.
- **The in-app menu bar was still Windows 95 under the modern theme** — a `#808080` rule and a
  `#000080` navy hover, hardcoded. `theme-hados` overrode both, which is why nobody saw it. Now
  tokenised.
- **A latent race in the e2e suite.** `settle()` and `boot.spec` waited for the BIOS to hide and
  then expected the desktop with the default 5s timeout — but the splash sits between them for at
  least 4s, so it was a coin flip under parallel load. Reproduced at 2-in-3 before the fix, 4/4
  clean after.

### Removed

- **Eight dead Windows 95 strings from all 40 locales.** Nothing read them and every one was false:
  `boot.bios_title` (*"AMIBIOS (C) 1995 American Megatrends, Inc."*), `boot.cpu` (*"CPU: Intel
  Pentium(R) 133 MHz"*), `boot.starting` (*"Starting Windows 95..."*), `boot.memory`,
  `boot.keyboard`, `boot.mouse`, `boot.press_del` and `system.shutdown_title` (*"Shut Down
  Windows"*). The POST has reported the real machine since v1.0.1; these were what it used to
  print. Two i18n tests used `boot.memory` as a vehicle for testing `{param}` interpolation and now
  ride on a key the product actually uses.
- **`CONFIG.ANIMATIONS`.** Nothing read it, and its numbers had drifted: it claimed a 3000ms splash
  while `BootLoader` ran 4000ms and held the bar at 90% until the OS reported ready. Config that
  disagrees with the code is worse than no config.

### Fixed

- **Windows 95 was still in the product's public identity.** The meta description and the PWA
  manifest both advertised *"Retro Windows 95 desktop simulator"*; the manifest's `theme_color` was
  `#c0c0c0` and `background_color` `#008080` — the greys and teal the OS paints around the app
  **when it is installed**; the Terminal icon's `aria-label` still said *"MS-DOS"*, so screen-reader
  users heard the old name while everyone else read "Terminal"; and the Start menu sidebar's markup
  fallback read *"Windows 95"*.
- **`sticky.welcome_win95` → `sticky.welcome_hados`**, across 40 locales, `ThemeManager`,
  `index.html` and the typed key union.

- **The tray toggles turned Windows 95 grey when switched on.** Enabling the pet or HDR painted the
  button `#b0b0b0` with an inset white border, on a dark taskbar: `.ragdoll-pet-btn.active` scores
  (0,2,0) and outranked the (0,1,1) rule that supplies the button's normal look. The theme now owns
  that state — an accent wash plus the same underline the taskbar uses for a running app — and
  distinguishes the momentary `:active` press from being toggled on.
- **A disabled button no longer lights up on hover.** The theme's hover rule excludes
  `:disabled`, but the Windows 95 one did not, so hovering the HDR toggle on a display without HDR
  still tinted it.

### Changed

- **`.ragdoll-pet-btn` is layout only now.** The Win95 background, border, font, padding and hover
  tint are gone — none of them ever reached the element, because `button:not(.window-btn)` outranks
  the class. Two declarations that looked equally dead were kept, because the baseline proved they
  are not: `transition: none` is live under the modern theme, and `color: #808080` on `.disabled`
  is the only thing keeping that label readable there — modern styles disabled text with
  `var(--border-dark)`, a *border* token that maps to `#e5e5e5`. Recorded in
  [`docs/known-issues.md`](docs/known-issues.md).

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
