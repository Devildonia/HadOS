# Known issues

Things found while working on HadOS that were **deliberately not fixed at the time**, because
fixing them would have widened the change under review past what its verification covered.

Each entry says what is wrong, the evidence it is real (not a suspicion), and where it lives.
Nothing here is speculative: every claim was measured or read out of the running system.

> Before touching anything under `css/` or `public/css/themes/`, read
> [`test/e2e/css-baseline.spec.js`](../test/e2e/css-baseline.spec.js). The unit suite never
> evaluates CSS — jsdom does not load external stylesheets, so `style.css` could be deleted and
> all 704 tests would still pass. That spec is the only net.

---

## Visual — leftover Windows 95 in the HadOS theme

### 1. ~~The tray toggles turn Windows 95 grey when active~~ — FIXED

`theme-hados.css` now styles `.ragdoll-pet-btn.active` (accent wash plus the underline the taskbar
uses for a running app) and the momentary `:active` press separately. Verified: the toggled-on
state went from `rgb(176,176,176)` with a 2px inset white border to the accent, and nothing else
moved.

### 1b. ~~Disabled text is near-invisible in the modern theme~~ — FIXED

`chrome/controls.css` drew disabled buttons with `color: var(--border-dark)` — a **border** token
used as **text**. It only ever worked by accident: under Windows 95 that token was `#808080`, a
usable grey. `theme-modern` maps it to `#e5e5e5`, so disabled labels rendered near-white on a
`#f9f9f9` button and vanished.

Fixed with tokens that mean what they say: `--control-disabled-color` and
`--control-disabled-text-shadow` (the latter carried the Win95 emboss), defined per theme. Modern
now renders them at `#9a9a9a`. With the root cause gone, the `#808080` that the tray button was
forced to hardcode went too.

### 2. ~~The in-app menu bar is still Win95 underneath~~ — FIXED

`.window-menu` now reads `--border-dark`, `--accent-color` and `--os-font-size` instead of
hardcoding `#808080` and a `#000080` navy hover. Those only ever showed under theme-modern — a
Windows 95 menu bar inside a Fluent window — because theme-hados overrode both.

### 3. The `modern` theme is a Windows 11 clone

Its assets live in `assets/themes/winui/` (`my_pc.webp`, `file_explorer.webp`, `brave.webp`,
`ms-dos.webp`…), its sounds are `*_winui.opus`, and its palette is Fluent's `#0078D7`. This is the
same borrowed-identity problem as the Microsoft logo removed from the Start button and the Windows
flag removed from the wallpaper — we just have not gotten to it.

**Where:** [`public/css/themes/theme-modern.css`](../public/css/themes/theme-modern.css),
`public/assets/themes/winui/`, `ThemeManager.swapIcons`.

### 4. Desktop icons are Microsoft product icons — mostly replaced

The HadOS theme's icons are now HadOS's own: `ms-dos.webp` → `shell_core.webp` (app **Shell Core**),
`task_manager.webp` → `task_pilot.webp` (**Task Pilot**), `iexplorer.webp` → `navea.webp` (**Navea**),
`ragdoll_skins.webp` → `ragdoll_workshop.webp`, plus new marks for My Computer (`mi_pc.webp`), the
Recycle Bin (`eco_bin_empty.webp`, renamed **Eco Bin**), the Games folder (`games.webp`) and the
Plugin Manager (`plugin_manager.webp`). The four orphaned Microsoft icons in `assets/icons/` were
deleted.

Still Microsoft: `Display.webp` and `winamp_icon.webp` in the HadOS set, and the whole `winui/` set
the **modern** theme uses (which is why, under modern, an icon still reads as MS-DOS while its label
now says "Shell Core" — part of the deferred modern-theme work).

**Where:** `ThemeManager.swapIcons` in [`js/core/ThemeManager.ts`](../js/core/ThemeManager.ts).

### 4b. ~~The Recycle Bin has no empty/full state yet~~ — BUILT

A real, restorable recycle bin now exists. `VFS.trashNode` moves a deleted node to a hidden
`C:\HADOS\SYSTEM\RECYCLED` dir (keeping its blobs and recording its origin) instead of destroying
it; `restoreFromTrash` puts it back where it came from (renaming on collision, refusing if the
origin folder is gone); `emptyTrash` purges permanently and frees blobs. Terminal `del`/`rm` route
here; `del /f` still hard-deletes. **System deletes (uninstall, session cleanup) stay on
`deleteNode`** so they never fill the bin. The Eco Bin dialog lists trashed files with Restore and
an Empty button (alongside the existing deleted sticky notes), and the desktop icon flips between
`eco_bin_empty` and `eco_bin_full` on a `vfs:trash-changed` signal — re-applied after a theme swap,
since `swapIcons` resets it. Only the HadOS theme flips; the modern theme keeps its single icon.

Not yet done: no drag-a-file-to-the-bin gesture (only Terminal deletes route to trash today, since
that is the only file-delete UI), and restore appends " (2)" to the whole name rather than before
the extension.

---

## Dead code

### 5. ~~Most of `.ragdoll-pet-btn` never applies~~ — PRUNED

The Windows 95 background, border, font, padding and hover tint are gone; the partial is layout
only. One declaration that *looked* dead was kept because the baseline proved otherwise:
`transition: none` is live under `theme-modern`, which sets no transition of its own. (The
`color: #808080` on `.disabled` was kept for the same reason and has since been removed, once
**1b** fixed the token it was working around.)

### 6. The pet button's mobile padding has never applied

`@media (max-width: 768px) { .ragdoll-pet-btn { padding: 2px 4px } }` is dead. Measured at 375px,
where it would apply: the button computes to `padding: 6px 16px`. A media query adds no
specificity, so this (0,1,0) loses to the theme's `button:not(.window-btn):not(.start-btn)` at
(0,3,2). Reordering the manifest will not rescue it.

Left in place rather than deleted: whether these buttons *should* shrink on a phone is a design
call, and it should be made deliberately rather than resolved by a refactor.

**Where:** [`css/system/ragdoll.css`](../css/system/ragdoll.css).

### 7. ~~Dead boot-animation config~~ — REMOVED

`CONFIG.ANIMATIONS` claimed a 3000ms splash while `BootLoader` ran 4000ms and held the bar at 90%
until the OS reported ready. Nothing read it. Config that disagrees with the code is worse than no
config, so it is gone; the timings are constants at the top of `BootLoader`.

### 7b. ~~Dead Windows 95 strings in all 40 locales~~ — REMOVED

Eight keys nothing read, and every one of them false: `boot.bios_title`
(*"AMIBIOS (C) 1995 American Megatrends, Inc."*), `boot.cpu` (*"CPU: Intel Pentium(R) 133 MHz"*),
`boot.starting` (*"Starting Windows 95..."*), `boot.memory`, `boot.keyboard`, `boot.mouse`,
`boot.press_del` and `system.shutdown_title` (*"Shut Down Windows"*). The POST has reported the
real machine since v1.0.1; these were the strings it used to print, left behind in 40 files.

---

## Naming that outlived the rename

### 8. ~~`win95-*` class names~~ — RENAMED

Now `hados-window`, `hados-btn`, `hados-dialog` and the `hados-notify-in` keyframe, across 37
files. Render-neutral: every screenshot came back pixel-identical.

The storage migration keys (`win95-vfs`, `win95_vfs_root`, `win95-vfs-blobs`) and `ThemeManager`'s
`LEGACY_THEME = 'win95'` deliberately keep the old name. They identify pre-rename installs;
renaming them would strand that data.

### 9. ~~The `sticky.welcome_win95` i18n key~~ — RENAMED

Now `sticky.welcome_hados`, across all 40 locales, `ThemeManager`, `index.html` and the typed key
union in `i18n-keys.ts`.

### 9b. ~~Windows 95 in the page's public identity~~ — FIXED

Found while renaming the key above, and all of it user-facing:

- The **meta description** and the **PWA manifest description** both advertised *"Retro Windows 95
  desktop simulator"*.
- `theme_color` in the manifest was `#c0c0c0` and `background_color` `#008080` — Win95 grey and
  teal, which is what the OS paints around the app **when it is installed**.
- `<meta name="theme-color">` was `#008080` too.
- The Terminal icon's **`aria-label` said "MS-DOS"**: sighted users read "Terminal", screen-reader
  users heard the old name. The Start menu entry said `MS-DOS` outright.
- The Start menu sidebar's markup fallback read **"Windows 95"** (`ThemeManager` overwrites it at
  runtime, so it only showed if the JS was slow or broken).

---

## Build and tooling

### 10. ~~`style.css` is fetched twice in development~~ — FIXED

The `<link>` in `index.html` is gone; `main.ts` imports the stylesheet, which is the Vite-idiomatic
path (bundled, hashed, hot-reloaded). The browser was parsing **422 rules** it did not need,
Tailwind's preflight among them, and holding two identical `Sora` `@font-face` entries — which is
why `document.fonts.check()` could report `false` while one copy was still loading.

No flash was introduced: every screen starts `display:none` and nothing paints until the JS boots
the OS. Verified — computed styles, interactive states and all screenshots unchanged, with the
CSSOM diff showing 422 rules removed and **0 added**.

### 11. ~~`!important`~~ — 40 → 10, and the 10 are the correct tool

Every remaining one is in `css/chrome/window.css`, on `.hados-window.maximized`, and they are
**load-bearing**: dragging writes `left/top/width/height` inline via `WindowInteractions`, inline
outranks every selector, and `!important` is the only thing that beats inline. Documented in place
so nobody "cleans them up". (`theme-hados.css` keeps 2 more for the same rule.)

How the other 30 went:

| Where | Was | Verdict |
|---|---|---|
| `css/apps/paint.css` | 9 | Forced by a rule of ours scoring (1,2,2) — see the `:not(#id)` lesson below. Dissolved once that was fixed. |
| `css/apps/games.css` | 8 | Cargo. Their selectors carry an ID and already out-ranked the mobile rule they claimed to fight. |
| `css/effects/glitch.css` | 6 | **The whole file was dead** — `.glitch-active` and its three keyframes were referenced by nothing outside it. Deleted. |
| `css/responsive.css` | 2 | Cargo. They mirror `desktop/desktop.css` at the same specificity and are imported after it, so they already won. |
| `css/desktop/folder-items.css` | 2 | **The whole file was dead** — `.folder-item` exists nowhere in the product. Deleted. |
| `css/apps/task-manager.css` | 2 | Cargo. `.tm-table tr.active` and `tr:hover` both score (0,2,1), and `.active` comes later. |

`theme-modern.css`'s 7 are unexamined; they belong to the modern-theme work.

Three lessons, all learned the hard way here:

- **Check the specificity before assuming an `!important` is doing work.** More than half were
  cargo, several sitting under comments confidently explaining what they overrode.
- **`:not(#id)` hands a rule an ID's full weight.** `theme-hados`'s button rule scored (1,2,2)
  purely because it excluded the Start button by ID, which made it unbeatable and *forced* Paint's
  nine. A `.start-btn` class dropped it to (0,3,2) and they dissolved.
- **An `!important` can be a fossil of dead code.** Two whole files were unreachable; their
  `!important`s had nothing to fight because nothing rendered them.

### 12. ~~The shader palette is hand-synced~~ — FIXED

`buildHadosShader()` injects the palette from the live CSS custom properties at compile time — the
shader is rebuilt on every theme change anyway, which is exactly when the palette could have moved.
The theme is now the single source of truth; the GLSL literals are gone.

Proved rather than asserted: the baseline moves `--hados-blue` to red and checks the rendered
pixels follow, which they could not do while the shader carried its own copy.

**Where:** [`js/ui/ThemeShaders.ts`](../js/ui/ThemeShaders.ts).

### 13. README screenshots predate the HadOS chrome

They still show the retired Windows 95 theme. Marked with a warning in the README rather than
quietly left to mislead. They need retaking — Playwright can do it; the in-app preview browser
cannot (its screenshots hang).

---

## Environment quirks (not bugs — do not "fix")

- **The preview browser reports the tab as hidden** (`document.hidden === true`; it renders
  offscreen), so `os_engine`'s performance guard stops the wallpaper shader. Starting it by hand
  works. Its `screen.width/height` are also `0`, which is what the POST's viewport fallback exists
  for.
- **Playwright's local workers are capped at 2** in `playwright.config.js`. Every spec boots the
  whole OS with a WebGL wallpaper; at the default (~half the CPU count) the contexts starve each
  other until boot times out, failing specs unrelated to the change under test.
- **The BIOS disappearing does not mean the desktop is up.** The splash sits between them for at
  least 4s (`SPLASH_MIN_MS`), longer if the OS is slow to report ready. Any e2e step that waits for
  `#boot-screen` to hide and then expects `#desktop` needs an explicit timeout: the default 5s wins
  that race often enough to look fine locally and flake under load.
