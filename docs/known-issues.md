# Known issues

Things found while working on HadOS that were **deliberately not fixed at the time**, because
fixing them would have widened the change under review past what its verification covered.

Each entry says what is wrong, the evidence it is real (not a suspicion), and where it lives.
Nothing here is speculative: every claim was measured or read out of the running system.

> Before touching anything under `css/` or `public/css/themes/`, read
> [`test/e2e/css-baseline.spec.ts`](../test/e2e/css-baseline.spec.ts). The unit suite never
> evaluates CSS — jsdom does not load external stylesheets, so `style.css` could be deleted and
> all 1031 tests would still pass. That spec is the only net.

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

### 3. ~~The `modern` theme is a Windows 11 clone~~ — RESKINNED

Its palette was Fluent's `#0078D7` and its icons were Microsoft's product art. Both are gone:

- **The palette is its own.** `theme-modern.css` is now a metallic cyber-emerald glass theme
  (`--accent-color: #00e68a`) rather than a Fluent tribute. The `--control-disabled-*` tokens that
  fixed **1b** were carried across and re-tuned for the new palette, so disabled text stays legible.
- **The icons are ours.** `ThemeManager.swapIcons` used to carry *two* full icon maps, and that
  duplication was the bug behind **4**: rename batches landed on the `hados` map and missed the
  `modern` one, so an icon still read "MS-DOS" while its label already said "Shell Core". There is
  now **one** map, worn by both themes — a theme is a skin (palette, chrome, sounds) for the same
  apps, so the apps keep their own icons. Every `.webp` under `assets/themes/winui/` was deleted.

**The `winui` sound set stays** (`audio/*.opus`) — deliberately. Only the artwork was borrowed
identity; the sounds are part of what makes the theme feel different, which is the point of a theme.

**Where:** [`public/css/themes/theme-modern.css`](../public/css/themes/theme-modern.css),
`ThemeManager.swapIcons` in [`js/core/ThemeManager.ts`](../js/core/ThemeManager.ts).

### 4. Desktop icons are Microsoft product icons — mostly replaced

The HadOS theme's icons are now HadOS's own, across two batches: `shell_core` (**Shell Core**),
`task_pilot` (**Task Pilot**), `navea` (**Navea**), `ragdoll_workshop`, `mi_pc`, `eco_bin_*`
(**Eco Bin**), `games`, `plugin_manager`, then `notapad` (**Notapad**), `pinta` (**Pinta**), `filex`
(**FileX**, which also dropped the "Windows Explorer" registry name), and `prime_lab`. The renames
reach the app registry, window titles (including Notepad's dynamic `updateTitle`), `aria-label`s and
the Start menu. Every orphaned Microsoft icon in `assets/icons/` was deleted.

The `winui/` set the **modern** theme used is gone — see **3**. With one shared icon map, the
"an icon reads MS-DOS while its label says Shell Core" divergence cannot come back: there is no
second map for a rename to miss.

Still Microsoft: `Display.webp` and `winamp_icon.webp` in the HadOS set. Both are used by both
themes now, so replacing them is a single change rather than two.

**Where:** `ThemeManager.swapIcons` in [`js/core/ThemeManager.ts`](../js/core/ThemeManager.ts).

### 4c. ~~The VFS default desktop shortcuts still carry the old names~~ — RENAMED, WITH MIGRATION

`DEFAULT_FS` in [`js/core/vfs/VFSCoreTree.ts`](../js/core/vfs/VFSCoreTree.ts) now seeds
`C:\DESKTOP` with *Mi PC*, *Eco Bin*, *Notapad*, *Pinta* and *FileX*. The reason this was deferred
was that changing the default tree only reaches fresh installs, so `VFS.migrateDesktopShortcuts()`
does the other half: on hydrate it renames the five legacy shortcut nodes in an existing persisted
tree, skipping any whose new name is already taken. It runs beside `migrateSystemDirName()`, on the
same "rename the data, do not reset it" principle as the `C:\WINDOWS → C:\HADOS` move.

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

Both remaining gaps are now closed. **Drag-to-bin works**: dropping a desktop icon onto the Eco Bin
trashes its VFS node and removes the icon. Two traps were worth recording, because the first attempt
hit both — the icon's visible `<span>` carries `data-i18n`, so using it as a VFS key matched in
whichever locale happened to agree with the tree and failed silently in the other 39 (the icons now
declare `data-vfs-name` explicitly); and desktop icons are static markup in `index.html`, not
rendered from the VFS, so nothing removes the element unless the handler does it — otherwise the
file is both trashed and still on screen. Only icons carrying `data-vfs-name` are eligible: the rest
of the desktop (Display, Ragdoll Workshop…) is chrome with no file behind it.

**Restore is extension-aware**: `uniqueKey` splits on the last dot, so a collision yields
`a (2).txt`, not `a.txt (2)`. Dotfiles (`.gitignore`) and double extensions (`archive.tar.gz`)
fall out correctly — the split only applies when the dot is neither first nor last.

---

## Dead code

### 5. ~~Most of `.ragdoll-pet-btn` never applies~~ — PRUNED

The Windows 95 background, border, font, padding and hover tint are gone; the partial is layout
only. One declaration that *looked* dead was kept because the baseline proved otherwise:
`transition: none` is live under `theme-modern`, which sets no transition of its own. (The
`color: #808080` on `.disabled` was kept for the same reason and has since been removed, once
**1b** fixed the token it was working around.)

### 6. ~~The pet button's mobile padding has never applied~~ — APPLIES NOW

The rule is scoped through `#system-tray`, which is what it takes to land:
`#system-tray button.ragdoll-pet-btn:not(.window-btn)` at (1,1,2) beats theme-hados's
`body.theme-hados #system-tray .ragdoll-pet-btn` at (1,1,1). A media query contributes no
specificity of its own, which is what made both earlier attempts fail — (0,1,0) originally, then
(0,2,2) — each losing to that ID and computing `padding: 0` with nothing to show for it.

Worth keeping: this entry's own earlier diagnosis was **wrong**. It blamed the theme's generic
`button:not(.window-btn):not(.start-btn)` and reported a computed `6px 16px`. The real winner was
the `#system-tray` rule and the real computed value was `0`. The baseline settled it —
`computed-mobile-*.txt` records that value, so the fix could be checked rather than argued.

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

### 13. ~~README screenshots predate the HadOS chrome~~ — RETAKEN

The whole set (plus the hero GIF) was reshot on the HadOS chrome via
[`scripts/capture-screenshots.ts`](../scripts/capture-screenshots.ts), which drives a real
Playwright Chromium against the dev server — the in-app preview browser cannot do it (its
screenshots hang). Two lessons encoded in the script: wait for `#splash-screen` to hide (the
desktop reports ready *behind* it), and clear the centering `transform` before positioning a
window by inline style. The retake also caught the sticky note advertising **v1.0.5** on a
v1.0.6 build — the version was hardcoded in all 40 locales; it now interpolates `{version}`
from `CONFIG` (single source of truth), so a bump can never strand it again.

Still true: the **modern** theme's screenshot shows its Windows-style wallpaper and `winui/`
icons — the borrowed-identity problem of issue **3**, now visible in the README gallery until
that theme gets its own assets.

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

- **The dev service worker serves a stale `public/ai-runtime.js`.** The AI worker is a prebuilt
  artifact in `public/`, so the registered SW caches it like any other asset — rebuilding it with
  `npm run build:ai-worker` while a tab is open keeps spawning the OLD bundle, and the symptom is
  whatever bug you just fixed appearing to still be there. Hard-reload, or spawn with a cache
  buster while iterating. Production is unaffected: Workbox revisions precached files per build.

- **The e2e CI job is non-blocking (`continue-on-error: true`) — the GitHub runners have no GPU.**
  It runs on `windows-latest` to match the committed `…-chromium-win32.*` snapshots (Playwright looks
  snapshots up by platform; on `ubuntu-latest` it looked for a nonexistent `…-linux.*` set). But the
  runners have no GPU, so the WebGL shader and 3D ragdoll render under SwiftShader (software) — slow
  enough that the OS-boot specs hit the 30s test timeout and retry, and the two pixel screenshots
  (`desktop-hados.png`, `start-menu-and-window-hados.png`) also differ by font anti-aliasing. This is
  a deferred infra limitation, not a product failure, so the job is marked `continue-on-error: true`:
  it still runs and its result is visible, but it does not gate the run. The blocking jobs (Code
  Quality — lint/typecheck/unit tests with coverage — and Production Build) catch real regressions,
  and the full css-baseline (text + screenshots) runs locally on Windows where it is reliable. To
  make e2e enforceable in CI, run it on a GPU-enabled runner (or a container with a matching snapshot
  set and generous boot timeouts) and drop `continue-on-error`.

- **A removed background is invisible on Pinta's white canvas.** "Quitar fondo" clears alpha, and
  the CSS `background: white` under the bitmap shows straight through — so on a photo whose
  background was already pale, nothing appears to happen, even though the saved PNG really is
  transparent. Every real image editor answers this with a checkerboard behind the canvas. Not done
  here because `#paint-canvas` is transparent from the moment it opens, so a checkerboard would
  become the app's default look and would rewrite the css-baseline screenshots — a bigger change
  than the cutout warranted.
- **Pinta's cutout keeps every recognised class, not "the subject".** DeepLab labels 21 PASCAL VOC
  classes and `subjectMask` keeps everything that is not background — so a cat on a sofa keeps the
  sofa too (measured: 47.7% sofa + 11.6% cat). Correct by its own definition, surprising as a
  product. Keeping only the largest connected class, or letting the user choose, would need a UI.

## Latent

- **~~`no-explicit-any` is enabled as a warning~~ — PROMOTED TO ERROR.** The 215
  annotations are gone; the rule is `error` alongside `no-floating-promises` and
  `no-misused-promises`. `js/` and `main.ts` now lint at **zero errors, zero
  warnings**, so any output at all is a regression rather than background noise.

  Two things fell out of that sweep and were rolled back, because they were rewrites
  wearing a retyping's clothes: `NotificationManager` had its markup, CSS class names
  and per-type `DURATION_MS` durations replaced (which also silently dropped the
  dismissal timer from `destroy()`'s cleanup), and `TouchManager.makeDraggable` was
  widened to `HTMLElement | string` against the `windowId: string` that all four of
  its call sites actually pass, losing the `destroyDraggable()` de-dupe on the way.
  Both files were reverted and only the genuine typing re-applied. The lesson worth
  keeping: **a type-only sweep should not change a single runtime value.** If a diff
  in one touches markup, selectors or constants, it is a different change and needs
  its own verification — `css-baseline.spec.ts` in particular.

- **~~The consent dialog's focus trap assumes the dialog stays in the DOM~~ — FIXED.**
  A `MutationObserver` on `document.body` now watches for the overlay disappearing by
  any route that is not `finish()`, and denies rather than leaving the promise
  pending. Together with `Escape`, the backdrop click and the `Tab` cycle, every exit
  from the dialog now settles the capability check. The observer is disconnected in
  `finish()`, so it does not outlive the prompt.

- **~~`VFSBlobStore`'s memory fallback refuses rather than evicts~~ — IT EVICTS, AND
  SAYS SO.** The blocker recorded here was that eviction needs a policy for which blob
  is safe to drop. The answer turned out not to be a smarter policy but an honest one:
  least-recently-used (`get` re-inserts on read, so `Map` order is real recency), and
  **every eviction is announced**. `VFSBlobStore.onEvict()` hands the dropped id to the
  VFS, which removes the node that pointed at it and warns the user by name.

  That announcement is the whole point. Evicting silently would have left the tree
  holding a `blobRef` resolving to nothing — a file that lists normally and opens
  empty, which is M-13's dishonesty moved from the write to the read rather than
  fixed. A blob larger than the entire budget is still refused outright (evicting
  everything else could not make it fit), and that refusal happens *before* the map is
  touched, so a failed overwrite leaves the previous content intact.

  Still true, and inherent: this backend is RAM. Nothing stored here survives a
  reload, which is why the first fall-through now logs a warning saying exactly that.

- **The CSP does not apply to workers — at all.** HadOS ships its CSP as a `<meta>`
  tag, and per spec a `<meta>` CSP governs only the document: workers spawned from a
  URL get their policy from their own HTTP response headers, of which the static
  hosting sends none. Found empirically during the Whisper work: onnxruntime's
  loader fetched its wasm from jsDelivr from inside the `asr-runtime` worker while
  the page's `connect-src`/`script-src` plainly forbid that host (a Blob worker, by
  contrast, inherits the creator's policy — which is how the difference surfaced).
  We self-host the ort wasm anyway (`scripts/copy-ort-wasm.ts` + `wasmPaths`), but
  the fence itself is illusory for every worker process until the CSP moves to a
  real `Content-Security-Policy` response header, which needs control over the
  hosting (itch.io zip uploads offer none).

- **`base: './'` and root-absolute asset paths disagree** — mostly closed, one gap left.
  `vite.config.js` sets `base: './'` so the app can be served from a subdirectory, but assets were
  referenced root-absolute and would have 404'd together under a subpath.

  Everything loaded **from code** now goes through `Utils.getAssetUrl()`
  ([`js/utils/url.ts`](../js/utils/url.ts)): the ort/genai/litert wasm directories, the ragdoll
  audio, `DesktopManager`'s sound preloads and `ThemeManager`'s icon markup. It resolves against
  `document.baseURI` on the main thread and derives a base from `self.location` inside a worker —
  the awkward case flagged here originally, since `BASE_URL` is `'./'` in a build, which a worker
  sitting at `/assets/` resolves wrongly. The worker branch is a heuristic (it looks for `/assets/`
  in its own URL), so it is the part to distrust first if a subpath deploy ever misbehaves.

  **Still root-absolute: the three `<link href="/css/themes/…">` tags in `index.html`.** They are
  static markup, not code, so `getAssetUrl` cannot reach them; making them base-relative means
  either letting Vite process them or injecting them at boot. Untested under a subpath either way —
  nothing here has actually been deployed to one yet, so treat the whole item as "should now work"
  rather than "verified".
