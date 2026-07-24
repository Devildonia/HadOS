# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.10] - 2026-07-24

A polish release closing the v1.0.9 RC audit (GO, 9.7/10). No new features — a
sweep of window-chrome and app-identity fixes plus the audit's one doc finding.

### Fixed

- **Task Pilot / Display Properties left zombie taskbar buttons and refused to
  reopen**: both were "proxy" apps that launched a separate `settings` process and
  then tried to kill themselves — but the self-kill searched for their own process
  *before* the kernel had registered it (registration happens after the constructor
  returns), so they never died. The result was a process whose `windowId`
  (`win-taskmanager-proxy`) named a window that never existed: a phantom taskbar
  button that could not be closed, and a singleton that refused to relaunch. They
  are now thin **Settings subclasses** (opening on the taskmanager/display category)
  with a real window, so closing kills the right process and reopening just works.
- **Task Pilot / Display Properties now show their own name and icon**, in the
  taskbar and the window title bar (`📊 Task Pilot`, `🖥️ Display Properties`) —
  the proxy launched Settings, so the window used to read a generic `⚙️ Settings`.
  Settings gained optional `windowTitle`/`windowIcon` params for this.
- **Windows could not be resized**: `WindowFactory` set up dragging but never
  called `makeResizable`, so `resizable: true` windows had no resize grip at all
  (the comment "added by makeResizable if needed" described a call that did not
  exist). Windows are now resizable by default; `resizable: false` opts out.
  `makeResizable` was also missing from the `IWindowManager` interface.
- 6 regression tests (`test/ProxyAppsAndResize.test.ts`) pin the real-window
  lifecycle and the resize-by-default behaviour.
- **The Games shortcut opened FileX twice, at two different addresses**: the
  desktop icon (and Start-Menu item) both wired an `ondblclick` opening the real
  explorer at `C:\GAMES` *and* a `data-launch="games-folder"` that spawned a
  second bespoke `win-games-folder` window at `C:\HADOS\DESKTOP\GAMES`. Games now
  live at a single address: the icon and menu use a declarative
  `data-explorer-path="C:\GAMES"` handled by `EventDelegation`, opening the one
  FileX explorer and nothing else. "Back to games" and the per-game folders route
  to the same `C:\GAMES` explorer, so navigation loops back into FileX.
- **Resizing a FileX window showed two colours and stretched to full screen**:
  the explorer body was `display:block`, so its content did not fill the flex
  window — enlarging revealed the window background below the content (the "two
  colours") and shrank oddly. `.window-body.explorer-window` is now a flex column
  whose content area grows/scrolls (`flex:1 1 auto; min-height:0; overflow-y:auto`),
  so it tracks the window at any size.
- Regression tests: `test/EventDelegation-explorer.test.ts` pins the single-window
  Games behaviour (desktop double-click and Start-Menu click open FileX once,
  never the legacy `games-folder` app).
- **Windows showed a generic/old icon in their titlebar instead of the app's
  own**: the taskbar button already used the app's registered icon (an
  `assets/icons/*.webp` for most apps), but each window's titlebar hardcoded a
  separate emoji passed to `WindowFactory.create` — so e.g. Ragdoll Workshop
  showed 🎭 in the titlebar while its taskbar button showed the real workshop
  icon. The Kernel now stamps every launched window's titlebar with the app's
  **registered** icon (the registry metadata is the single source of truth), so
  the titlebar and taskbar always agree. The icon lives in its own `<i class="window-icon">`
  element — kept out of the title `<span>` so apps that retitle their window
  (FileExplorer's path, Notepad's filename) no longer risk clobbering it — and an
  asset path renders as a 16px `<img>`, an emoji as text, the same rule the
  taskbar uses.
- Regression tests: `test/WindowFactory.test.ts` (icon stays out of the title
  span; `setTitleIcon` renders asset paths as `<img>`) and `test/Kernel.test.ts`
  (launch stamps the registered icon; no-op when the app registers none).
- **Most apps launched with an emoji in the titlebar instead of their own
  icon**: the previous fix made the titlebar honour the *registered* icon, but
  most apps still *registered* an emoji (💬, 🎨, 📝, …) even though a bespoke
  `assets/icons/*.webp` existed and was already used by their desktop icon and
  taskbar-theme mapping. Registration icons are now the real assets for Pinta,
  Notapad, FileX, Shell Core, Tavern Chat, Voxcribe, Doc Query, Media Player,
  Nova, Plugin Manager, Prime Lab and the Games shortcut — so titlebar, taskbar
  and desktop icon all show one identity. (Tabula and Hada keep emoji: no bespoke
  asset exists for them yet.)
- **Pinta's window read "untitled - Paint"**: the title used the generic
  translated word `paint.title` ("Paint"/"Malování"/…) instead of the brand
  `app.paint` ("Pinta"). It now shows the brand, matching the desktop label.
- **Taskbar name mismatched the window for three apps**: the registry `name`
  said "HadOS Messenger" / "Doc Explorer" / "HN Scout" while the window and
  desktop label read "Tavern Chat" / "Doc Query" / "Nova". Aligned the registry
  names to the brands.

### Documentation

- **`guestBoot.ts` header described the old iframe-isolation model** (the RC
  audit's only finding): it still said the guest was "paired with an iframe that
  has `allow-same-origin`" and that true opaque-origin isolation "would require a
  separate origin", contradicting the shipped code. Rewritten to the real model —
  a classic IIFE (`process-guest.js`) in a `sandbox="allow-scripts"` opaque-origin
  iframe; the blocker was ES-module CORS from a null origin, never the CSP.

## [1.0.9] - 2026-07-23

The AI-features harvest (phases 4–6) meets architecture-debt payoff. Three
long-standing structural items land — the god-bridge split, the unified event
system, and real opaque-origin iframe isolation — alongside the three phase-6 AI
features, the v1.0.8 audit remediation (M1/M2), and the regression the event
refactor surfaced in review.

### Added

- **🧚 Hada can operate the OS (AI phase 6)** — the tool-use pattern, tamed: one
  Gemma call decides intent-or-conversation; the persona offers the Kernel's live
  app registry as an allowlist and one strict JSON shape, and `parseIntent` is the
  boundary — malformed JSON, unknown actions or out-of-list apps degrade to plain
  speech (**a wrong guess can only produce words, never actions**; never eval).
  "Hada, abre Pinta" now actually opens Pinta, with spoken confirmation. Design
  notes in `docs/ai/phase-6-hands-pen-and-ear.md`.
- **📝 Notapad AI menu** — Summarize / Rewrite / Translate / Suggest title over
  the selection or the note, streamed into a dialog where **only the user's click
  applies anything** (Reemplazar / Insertar / Descartar). Source capped to the
  token budget with honest truncation notice; multi-window safe.
- **🎼 Voxcribe Melody Lab** — Gemma composes in a constrained notation
  (note+octave:duration), validated token by token and played by the local Web
  Audio synth. Real generation with its taste honestly labelled ("el gusto
  musical de un modelo de 1B"). The tab system became a table loop on the way.
- 15 new tests (`AiPhase6.test.ts`): the intent security boundary, writing prompt
  contracts, melody parsing (A4=440, accidentals, caps, invalid-token skipping).

### Fixed

- **AI runtimes are now governed by idle eviction** (audit M1): a loaded Gemma is
  ~550 MB of GPU memory and Whisper ~140 MB of wasm heap, and nothing ever released
  them. `AiService` now tracks last use and in-flight work per runtime and shuts an
  idle process down after 10 minutes (sweeping every 60 s) — never under an
  in-flight request, so a slow generation cannot be killed mid-sentence. The model
  bytes stay cached (OPFS / Cache API), so the next use pays a recompile, not a
  redownload, and the respawn is transparent to callers. 3 new tests pin the
  contract (evict + transparent respawn, no premature eviction, in-flight safety).
- **The capability vocabulary has a single source of truth** (audit M2): the list
  drifted between `PermissionBroker` and `AppPackage.KNOWN_PERMISSIONS` twice
  (v1.0.4: `ai:infer`; v1.0.8: the five AI/mic capabilities) — once more than a
  list should ever drift. New `core/capabilities.ts` declares every capability
  once, with its consent label and whether packaged apps may declare it; both
  consumers now DERIVE from it. Manifests declaring a host-only capability get a
  truthful error ("permission not available to packaged apps") instead of
  "unknown permission". 6 new tests pin the derivation.
- **Orphaned `window` listeners after the event unification** (regression caught in
  review of the refactor below): moving the dispatches to `EventBus`-only left
  several **listeners** still on `window.addEventListener` for the migrated events,
  which silently received nothing — a language switch that never re-translated
  FileExplorer/Paint/Settings nor re-swapped ThemeManager's icons, a session that
  never recorded apps opening/closing (SessionManager), a Task Manager that never
  refreshed its process list (Settings), and a Plugin Manager that never refreshed
  on uninstall. All six listeners migrated to `EventBus.on` with proper
  unsubscription; verified live that the bus delivers `languagechanged` and
  `kernel:process-started` to fresh subscribers.

### Changed (architecture debt)

- **God-bridge modularised**: `SystemBridge` no longer owns everything — dialog
  concerns move to `core/bridges/DialogBridge.ts` and desktop/wallpaper concerns
  to `core/bridges/DesktopBridge.ts`, with `SystemBridge` delegating. Neither new
  module touches `window.*`, shrinking the global coupling.
- **Event system unified on the EventBus**: the Kernel and system events
  (`kernel:process-started/stopped`, `kernel:plugin-uninstalled`, `themechanged`,
  `languagechanged`, `vfs:trash-changed`, `taskbar:edge-changed`) are now typed in
  `Types.ts` and emitted **only** through the `EventBus`; the parallel
  `window.dispatchEvent(CustomEvent)` dispatches in `Kernel`, `ProcessManager`,
  `VFSTrash`, `ThemeManager`, `i18n` and `TaskbarDock` are gone. The EventBus is
  the single source of truth for internal communication.
- **Real opaque-origin isolation for iframe processes**: `WindowFactory` now
  defaults to `sandbox="allow-scripts allow-popups"` — `allow-same-origin` is
  dropped, so iframe processes and games run on a genuinely opaque origin and
  cannot reach the host's storage or DOM.

## [1.0.8] - 2026-07-23

The zero-egress release. Two new apps and four upgraded ones, all harvested from
surveying the agent-app ecosystem and rebuilt under HadOS's rules — on-device,
consented, labelled. **Hada** gives the OS a voice (mic → Whisper → Gemma → speech,
never leaving the machine); **Tabula** analyses CSVs with code-computed numbers the
model may only narrate; Nova gains front-page briefings and a watchlist radar;
Tavern Chat gains model-compressed long-term memory; Doc Query goes multi-document
with `file:line` citations; and Voxcribe's dictation defaults to on-device Whisper —
making HadOS **fully zero-egress**: the one cloud path left is opt-in, labelled, and
default for nothing. The test suite crosses 1000 (1007).

### Added

- **🧚 Hada — an on-device voice assistant (AI phase 4, new app)**: push-to-talk
  through the whole substrate — microphone (`MediaRecorder`) → Whisper
  (`ai:transcribe`) → Gemma (`ai:chat`) → browser speech synthesis, with a new
  **`mic:record`** capability (*"nothing is sent anywhere"*) gating the capture
  before the browser's own mic prompt. The requirements panel names exactly which
  pieces are missing (no Gemma → a CTA to import it in Tavern Chat) and the mic
  stays disabled until the stack is real — a contract pinned by tests. Voice
  sessions are ephemeral by design. Design notes in
  `docs/ai/phase-4-voice-briefing-memory.md`.
- **🗞️ Nova front-page briefing**: one on-device digest of the whole front page —
  headlines and metrics only (the persona is told it has NOT read the articles;
  twelve threads' comments cannot fit the token budget). The button only exists in
  AI mode: a scripted digest would be the theatre the audit banned.
- **🧠 Tavern Chat long-term memory**: conversations past 24 messages fold their
  tail — compressed by Gemma itself — into a bounded memory note that conditions
  the persona, so the 12-turn prompt window stops being an amnesia horizon. The
  visible history is untouched; a 🧠 badge's tooltip shows the exact note the
  character remembers; clearing the chat clears the memory. Compression runs
  after the reply, fire-and-forget, with a folded-count marker so the same
  messages are never re-compressed.
- 11 new tests (briefing/memory prompt builders in `AiGrounded.test.ts`, Hada's
  honest-state contract in `HadOSVoiceAssistant.test.ts`).
- **🔒 Zero egress (AI phase 5)** — Voxcribe's dictation gains an engine selector
  with **on-device Whisper as the default**: record, stop, transcribed locally
  (`mic:record` + `ai:transcribe`). The browser's cloud engine stays as the
  option for live dictation, still behind `speech:cloud`. With this, **no HadOS
  feature sends user data anywhere** — the cloud path is opt-in, labelled, and
  default for nothing. Design notes in `docs/ai/phase-5-zero-egress-and-tabula.md`.
- **📊 Tabula (new app)** — CSV analysis where the numbers must be real: an
  RFC-4180-shaped parser (quotes, CRLF, Excel BOM, `,`/`;`/tab auto-detection,
  EU decimal commas) and per-column statistics computed **in code**, labelled as
  such. The 🧠 Narrar button (AI mode only) hands Gemma the precomputed figures
  under a prompt that forbids inventing or recalculating — an LLM doing
  arithmetic is a hallucination with confidence, so it is never asked to.
- **📚 Doc Query multi-document** — "Todos los documentos" indexes every listed
  file into one corpus with per-line `{file, line}` provenance; answers cite
  `[archivo:línea]`; the 512-line semantic cap logs honestly when it bites.
  (Also fixed on the way: the file list now includes `C:\DOCUMENTS`, where
  Notapad actually saves.)
- **📡 Nova Radar** — comma-separated watch topics; while Nova is open, the
  front page is swept every 5 minutes and NEW matching stories raise an OS
  notification. Keyword matching by design (a watchlist must be cheap and
  predictable), scope stated honestly: a browser OS has no background daemons.
- 15 new tests (`Tabula.test.ts` parser/stats/prompt + app states, `radarMatches`).

## [1.0.7] - 2026-07-23

The release where the AI stopped being theatre. It opens with the full remediation of
the v1.0.6 audit (A1–A8) — honest labels, real security hygiene, no fake AI claims
anywhere — and then earns those labels back the hard way: a complete **on-device AI
substrate** lands across three engines and four consented capabilities. The Messenger
holds real conversations (Gemma via MediaPipe LLM Inference), the Media Player really
transcribes local files (Whisper), HN Scout really summarises discussions, and the
Doc Explorer gains true semantic search (MiniLM embeddings) with a vector canvas that
finally shows real structure. Every feature states its mode in its own UI; every
fallback is labelled. Plus: new README gallery shot on the HadOS chrome, and the
version number gets a single source of truth.

### Added

- **Real on-device chat (AI phase 1)** — the Messenger's scripted replies can now be
  replaced by a real LLM: **MediaPipe LLM Inference** (`@mediapipe/tasks-genai`, the
  LiteRT-LM family) running a **user-imported Gemma bundle** (`.task`/`.litertlm`,
  e.g. Gemma 3 1B int4, ~550 MB) over WebGPU, inside the same isolated `ai-runtime`
  process as the tensor substrate. Design notes in `docs/ai/phase-1-llm-chat.md`.
  - **Import, never download**: Gemma is license-gated, so the user downloads the
    bundle themselves and imports it in the Messenger sidebar. The import hashes the
    file (SHA-256, which becomes the model id), stores the bytes in the OPFS model
    cache, and the worker re-verifies size + hash **before every compile** — the
    registry's no-URL-across-the-boundary rule is preserved because this path has no
    URL at all.
  - **`AiService.chat(appId, {persona, history}, onToken)`** with real streaming:
    `chat:token` deltas ride the process IPC, routed by requestId.
  - **Gemma prompt template** (`js/ai/chatPrompt.ts`): persona folded into the first
    user turn (Gemma has no system role), 12-turn window, and turn-grammar markers
    stripped from user text so a message cannot close its turn and speak as the model.
  - **`ai:chat` capability** in the PermissionBroker: *"generate chat replies with
    the imported AI model, entirely on your device (nothing is sent anywhere)"*.
  - **Messenger honesty pill**: shows `🧠 IA local: <model>` when replies are real,
    `Respuestas con guion (sin IA)` + an import button when they are not, and an
    exact message when a model exists but WebGPU does not. Personas (including
    user-imported characters) condition the model; generation errors surface as
    errors — no silent fallback to the script.
  - 18 new tests (`test/AiChat.test.ts`): template + injection defence, handler
    verify-before-compile, delta streaming over the IPC loopback, cache round-trip,
    registry recency, and the consent gate.
- **Real transcription in the Media Player (AI phase 2)** — local files are now
  transcribed **for real, on-device** with Whisper (`onnx-community/whisper-base`,
  q4, ~140 MB — the only quantisation the pinned onnxruntime accepts) via `@huggingface/transformers` in a new `asr-runtime` module-worker
  process; the timestamps drive the karaoke highlight and click-to-seek. Design
  notes in `docs/ai/phase-2-whisper-transcription.md`.
  - **The simulated transcript is deleted, not relabelled**: YouTube's transcript
    panel now states the truth — a cross-origin embed's audio is unreachable from
    the browser, so no in-browser player can transcribe it. Real transcription is
    a local-files feature by nature.
  - **`ai:transcribe` capability**: consent names the one-time ~140 MB download
    (Whisper is Apache-2.0 — downloadable, unlike license-gated Gemma). The model
    name is pinned in code; CSP allows the HF Hub hosts; onnxruntime's wasm is
    self-hosted (`scripts/copy-ort-wasm.ts`), never its CDN.
  - `AiService.transcribe(appId, samples, {language?}, onProgress)` with per-file
    download and run progress; `js/ai/audioDecode.ts` resamples any decodable
    media to Whisper's 16 kHz mono contract on the main thread.
  - 7 new tests (`test/AiAsr.test.ts`) plus updated Media Player specs asserting
    the honest YouTube state.
- **Grounded generation in HN Scout and Doc Explorer (AI phase 3)** — the last two
  simulated features join the substrate, riding the SAME imported Gemma model as
  the Messenger (no new download). Design notes in
  `docs/ai/phase-3-grounded-generation.md`.
  - **HN Scout summarises the discussion for real**: the linked article is
    unreachable from a browser, but the thread's comments come from the official
    API — Gemma summarises them on-device, streamed into the panel. The header
    badge is the mode contract: `On-device AI` with a model, `Simulated summaries`
    without (plus an import hint in the demo console).
  - **Doc Explorer answers become generated and grounded**: keyword retrieval
    stays (and keeps saying so), but the top lines ride into Gemma under a strict
    only-from-context instruction with `[línea N]` citations; the source-line box
    stays for provenance. Without a model, the quoting fallback remains, labelled.
  - Shared pure helpers in `js/ai/grounded.ts` (HTML stripping of untrusted
    comments, token-budget caps, top-K retrieval) pinned by 13 new tests
    (`test/AiGrounded.test.ts`). Both apps consent separately: `ai:chat` is
    granted per app, so the Messenger's grant does not bleed into them.
- **Real semantic search in the Doc Explorer (AI phase 3, level B)** — retrieval
  itself becomes real: `Xenova/all-MiniLM-L6-v2` (q8, ~23 MB) embeds every line
  into a 384-dim unit vector in the same `asr-runtime` worker, behind a new
  **`ai:embed`** capability. Queries are ranked by TRUE cosine similarity — the
  logged figures are measurements now — verified live with a zero-keyword-overlap
  query. The vector-space canvas stops being decorative: `pca3` (pure power
  iteration, deterministic) projects the real embeddings to 3D and the caption
  switches to *"Proyección PCA de los embeddings (real)"*. Denied consent or any
  failure keeps the honest keyword mode. 11 new tests (`test/AiEmbed.test.ts`).
  - Flushed out along the way: the canvas caption in all 40 locales still said
    **"LiteRT Local Vector Space"** — a pre-audit lie the A4 remediation missed
    because it only fixed the code fallback; both label keys are honest in every
    language now. And **Notapad saves to `C:\DOCUMENTS`, which the Doc Explorer
    did not list** — the OS's own save location was invisible to its own document
    reader. Fixed.

- **Five apps documented** (shipped in 1.0.6 without a CHANGELOG entry — audit A8):
  - **AudioStudio** — scripted podcasts via browser `speechSynthesis`, plus voice
    dictation via `webkitSpeechRecognition`.
  - **Hacker News Scout** — live top stories from the official Firebase API, with a
    *simulated* summary panel (canned text picked by title keywords).
  - **Messenger** — chat with scripted characters (canned replies, no AI).
  - **Media Player** — local files and YouTube, with a *simulated* transcript built
    from the video title and a keyword-match "chat".
  - **Doc Explorer** — indexes a VFS document into lines and answers queries by
    word-overlap scoring (keyword search, no embeddings).
- **`speech:cloud` capability in the PermissionBroker** (audit A1): dictation now asks
  for consent before starting, warning that the browser's speech recognition may send
  audio to the browser vendor's servers.

### Changed

- **Honest labels replace AI theatre** (audit A4): every `[LiteRT]`/"Whisper"/"RAG"
  label in the five apps now says what actually happens — `Simulated summaries` badge
  in HN Scout, `[Demo]` transcript logs in Media Player, `[Index]`/`[Search]` keyword
  logs in Doc Explorer, honest app descriptions in the registry.
- **No more silent mock fallback** (audit A3): when Hacker News is unreachable the app
  shows a real error state with a Retry button; demo data is opt-in behind a button
  labelled "Show demo data (fake)" and every demo title is stamped `[DEMO]`.
- **YouTube without external scripts** (audit A3): the Media Player no longer injects
  `https://www.youtube.com/iframe_api` (blocked by `script-src 'self'`). The embed is
  a plain `enablejsapi=1` iframe driven directly via the postMessage widget protocol
  (seek commands out, `infoDelivery` currentTime in), origin-checked both ways.
- **CSP `connect-src` now allows the real endpoints** (audit A3):
  `https://hacker-news.firebaseio.com` and `https://noembed.com`. The unofficial
  `translate.googleapis.com` title-translation call was removed instead of allowed.

### Fixed

- **XSS: all remote/stored strings escaped before `innerHTML`** (audit A2): story
  titles/authors/URLs in HN Scout (plus an http/https protocol allowlist on hrefs),
  contact names/avatars and message text in Messenger, filenames/transcript lines/chat
  input in Media Player, filenames and query/answer text in Doc Explorer.
- **Blob URL leak in Media Player** (audit A5): the object URL of a local file is
  tracked and revoked on media change and on window close.
- **Unguarded `new URL()` in HN Scout** (audit A6): story URLs parse inside try/catch
  with a safe `#` fallback; YouTube IDs must match `[\w-]{11}` before being embedded.
- **Listener-killing `innerHTML +=` replaced with `insertAdjacentHTML`** (audit A7) in
  HN Scout logs, Media Player chat and Doc Explorer feeds; the duplicated
  `#mp-chat-citation` id became a class.
- **Paint/FileExplorer 1.0.6 shims reviewed** (audit A8): verified they are honest
  delegation to live state (`Paint` getters return `PaintCore`'s real undo/redo arrays;
  `FileExplorer.history` backs the actual Back button) — no masked regressions.

- **The version number now has a single source of truth in the UI too**: the sticky
  note advertised *v1.0.5* on a v1.0.6 build because the release number was hardcoded
  in all 40 locale files (plus the `<title>`, the service-worker cache name and the
  default README.txt seed). Locales now carry a `{version}` placeholder and `i18n.t()`
  always interpolates it from `CONFIG.APP.VERSION` (which reads `package.json`), so a
  version bump can never strand the UI again. The ThemeManager test derives its
  expectation the same way.

### Documentation

- **README fully refreshed for the public release**: current feature set (magnetic
  taskbar, This PC explorer, glass material, 40-language i18n, the five media/demo apps
  with their honesty labels), the `kernel/`/`vfs/` module splits in the structure tree,
  932-test figures, and **new screenshots and hero GIF taken on the HadOS chrome**
  (retiring the Windows 95-era set flagged in known-issues #13).
- **`scripts/capture-screenshots.ts`**: a Playwright-driven capture tool for the README
  shots and hero video (`npx tsx scripts/capture-screenshots.ts [step…|--gif]`) against
  a running dev server, so the gallery can be retaken in one command after UI changes.

## [1.0.6] - 2026-07-19

Complete TypeScript migration for configuration files, tests, utility scripts, and service worker, along with test suite corrections and regression fixes.

### Added
- **ESLint TS Config:** Ported `eslint.config.js` to `eslint.config.ts`, utilizing `jiti` for loading TS config in ESLint.
- **Service Worker in TS:** Ported `sw.js` to `sw.ts` with typed ServiceWorker global scope constraints.
- **Developer Tools in TS:** Migrated developer utility scripts in `scripts/` (`copy-litert-wasm.js`, `create-app.js`, `generate-i18n-types.js`, `populate-ragdoll-locales.js`, `sync-locales.js`) to `.ts` and set up execution using `tsx`.
- **E2E Tests in TS:** Renamed Playwright test specs to `.ts` and updated visual snapshots to target `test/e2e/css-baseline.spec.ts-snapshots`.

### Fixed
- **Test Compatibility & Regression Fixes:**
  - Reverted unauthorized changes in `js/ai/segmentation.ts` that broke unit tests.
  - Added compatibility getters and proxies on `Paint` to preserve legacy test coverage.
  - Restored array-backed `history` and `navigateTo` relative parsing in `FileExplorer` to satisfy vitest spec expectations.

## [1.0.5] - 2026-07-18

The desktop grows a real file system and a movable bar. "My Computer" becomes a genuine
explorer with a **This PC** drive root, the Games folder folds into it, folder names are
localized in all 40 languages, and the whole thing gets the macOS-style glass. The taskbar
detaches, snaps magnetically to any edge, and centers its cluster Windows 11-style.

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

## [1.0.4] - 2026-07-17

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
