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

### 1b. Disabled text is near-invisible in the modern theme

**Evidence:** measured — removing `.ragdoll-pet-btn.disabled { color: #808080 }` made
`#hdr-toggle` compute to `color: rgb(229,229,229)` under `theme-modern`, on a `#f9f9f9` button.

`chrome/controls.css` styles disabled buttons with `color: var(--border-dark)` — a **border** token
used as **text**. Under Win95 that token was `#808080`, which passed for grey disabled text by
accident; `theme-modern` maps it to `#e5e5e5` and the label disappears. `theme-hados` is unaffected
(it sets its own `button:disabled` colour).

This is why the tray button still hardcodes `color: #808080`: it is the only thing keeping that
label readable in modern. The real fix is a proper disabled-text token, which is part of the
modern-theme work.

**Where:** [`css/chrome/controls.css`](../css/chrome/controls.css),
[`public/css/themes/theme-modern.css`](../public/css/themes/theme-modern.css) (`--border-dark`).

### 2. The in-app menu bar is still Win95 underneath

`.window-menu` hardcodes `border-bottom: 1px solid #808080` and its items hover to `#000080` navy.
The HadOS theme overrides both, so this only shows if the theme fails to load — but the modern
theme does *not* override them, so Paint's menu bar there is genuinely Win95 navy.

**Where:** [`css/chrome/window-menu.css`](../css/chrome/window-menu.css).

### 3. The `modern` theme is a Windows 11 clone

Its assets live in `assets/themes/winui/` (`my_pc.webp`, `file_explorer.webp`, `brave.webp`,
`ms-dos.webp`…), its sounds are `*_winui.opus`, and its palette is Fluent's `#0078D7`. This is the
same borrowed-identity problem as the Microsoft logo removed from the Start button and the Windows
flag removed from the wallpaper — we just have not gotten to it.

**Where:** [`public/css/themes/theme-modern.css`](../public/css/themes/theme-modern.css),
`public/assets/themes/winui/`, `ThemeManager.swapIcons`.

### 4. Desktop icons are Microsoft product icons

`ms-dos.webp`, `iexplorer.webp`, `task_manager.webp`, `Display.webp` in the HadOS icon set, plus
the whole `winui/` set for modern. Being replaced gradually, by decision.

**Where:** `ThemeManager.swapIcons` in [`js/core/ThemeManager.ts`](../js/core/ThemeManager.ts).

---

## Dead code

### 5. ~~Most of `.ragdoll-pet-btn` never applies~~ — PRUNED

The Windows 95 background, border, font, padding and hover tint are gone; the partial is layout
only. Two declarations that *looked* dead were kept because the baseline proved they are not:
`transition: none` is live under `theme-modern` (which sets no transition of its own), and
`color: #808080` on `.disabled` is the only thing keeping that label readable there — see **1b**.

### 6. The pet button's mobile padding has never applied

`@media (max-width: 768px) { .ragdoll-pet-btn { padding: 2px 4px } }` is dead: a media query adds
no specificity, and `chrome/tray-buttons.css` sets `padding` on the same selector further down the
manifest. Left exactly where it is — moving it after that partial would silently *revive* a mobile
padding that has not been in effect for a long time. Decide it on purpose.

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

### 8. `win95-*` class names

`.win95-window` (16 uses), `.win95-btn` (63), `.win95-dialog` (4), the `win95-notify-in` keyframe.
Internal names with no user-visible effect, which is why they survived the rebrand. A rename is a
wide, mechanical diff across JS, CSS and tests — cheap to do, easy to review, worth its own commit.

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

### 11. `!important`: 32 left, classified

Down from 40 — the 8 in `css/apps/games.css` were redundant (their selectors carry an ID and
already out-ranked the mobile rule they were fighting) and are gone, verified at a 375px viewport.
What remains, and why:

| Where | Count | Verdict |
|---|---|---|
| `css/chrome/window.css` | 10 | **Necessary.** `.win95-window.maximized` beats the inline `left/top/width/height` that `WindowInteractions` writes while dragging. Only `!important` beats inline. |
| `css/apps/paint.css` | 9 | **Fixable.** `.paint-tool-btn` (0,1,0) loses to `button:not(.window-btn)` (0,1,1) in `chrome/controls.css`. Scoping to `.paint-toolbar .paint-tool-btn` (0,2,0) would win without it — but no baseline covers Paint's toolbar yet. |
| `theme-modern.css` | 7 | Not examined. |
| `css/effects/glitch.css` | 6 | Not examined. |
| `css/responsive.css`, `desktop/folder-items.css`, `apps/task-manager.css` | 6 | Not examined. |

The lesson from the games.css ones: `!important` next to a comment saying "override mobile media
query" was cargo — a media query adds no specificity, so an ID selector already beat it. Check the
specificity before assuming an `!important` is doing work.

### 12. The shader palette is hand-synced

`SHADER_HADOS`'s `BLUE_DEEP` / `BLUE_MID` / `BLUE_LIGHT` are GLSL literals that duplicate the
`--hados-blue-*` tokens in `theme-hados.css`. Change the palette and both must move together;
nothing enforces it.

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
