# AI phase 3 — grounded generation (HN Scout + Doc Explorer)

The last two simulated features join the real substrate. Both ride the SAME
imported Gemma model the Messenger uses (`AiService.chat`, `ai:chat` capability,
WebGPU) — no new model, no new download. Without a model, both keep their
pre-phase-3 behaviour with its honest labels plus a hint pointing at the
Messenger's import button. The shared prompt/retrieval helpers live in
[`js/ai/grounded.ts`](../../js/ai/grounded.ts), pure and pinned by
`test/AiGrounded.test.ts`.

## HN Scout — real summaries, of the right thing

A browser cannot read the linked article (arbitrary origins, no CORS) — so the
real summary is of what a browser CAN read: **the thread's own comments**, from
the same official Firebase API as the stories. The panel is titled "Discussion
summary" because that is what it is.

- `story.kids` → top `MAX_COMMENTS` (6) comment items fetched in parallel;
  deleted/dead filtered; HTML stripped (`stripHtml` — DOMParser with a
  boundary-space trick so `<p>a</p><p>b</p>` doesn't glue into "ab").
- `buildHnSummaryPrompt` caps each comment at 380 chars and the whole context
  at ~2400 — Gemma runs with maxTokens 1280 (prompt + reply), and a silently
  overflowing prompt truncates the REPLY mid-sentence.
- The header badge is the mode contract: **`On-device AI`** (accent) with a
  model, **`Simulated summaries`** (grey) without. The panel header, console
  lines and the registry description all agree with it.

## Doc Explorer — the answer becomes real, the retrieval stays honest

Retrieval is exactly what it always was — keyword overlap, and it keeps saying
so. What changes with a model: the top `DOC_CONTEXT_LINES` (6) retrieved lines
ride into Gemma as context (`buildDocAnswerPrompt`) under a strict instruction:
answer ONLY from the provided lines, cite them as `[línea N]`, admit absence.
The answer streams into the bubble; **the source-line box stays** — provenance
matters more, not less, with a generator in the loop.

`topKLines` is the old scoring extracted pure: fraction of query words present,
ties broken by document order, zero-score lines dropped. Pinned by tests so the
ranking cannot drift silently.

## Consent

Both apps call `AiService.chat` under the existing **`ai:chat`** capability —
the broker grants per `(app, capability)`, so `hnscout` and `docexplorer` each
get their own consent prompt on first use, and the Messenger's grant does not
bleed into them.

## Testing

`test/AiGrounded.test.ts` (13): HTML stripping (tags, entities, whitespace,
markup neutralisation), summary prompt framing + comment caps + empty-thread
honesty, retrieval ranking/ties/K/stop-words, answer prompt citations + empty
retrieval. The apps' own specs still pin the no-model behaviour (simulated
panel, keyword answer), which is now the fallback path.

## Level B — real embeddings (same phase, second landing)

The Doc Explorer's retrieval itself became real: **`Xenova/all-MiniLM-L6-v2`**
(q8, ~23 MB — verified live: no QDQ trouble on this ort, unlike whisper's q8)
runs in the same `asr-runtime` worker (one transformers.js stack, one process),
behind a new **`ai:embed`** capability whose consent names the download.

- **Indexing**: on document load, every line becomes a 384-dim unit vector
  (`AiService.embed`, `embed:texts` over the process IPC, `MAX_EMBED_TEXTS` 512
  cap). Denied consent or any failure keeps the honest keyword mode.
- **Search**: the query is embedded and lines are ranked by TRUE cosine
  (`semanticTopK` — rows are L2-normalised so cosine is a dot product). The log
  figures are finally measurements: *"Best match: line #5 (cosine 0.46 — real
  embedding similarity)"*. Verified live with a zero-keyword-overlap query
  ("boats sailing at night" → "Sailors navigate stormy seas guided by the
  northern stars").
- **The canvas earns its keep**: `pca3` (power iteration + deflation, pure,
  deterministic) projects the real vectors to 3D and the points sit at their
  actual projected positions. The caption switches between
  `Visualización del índice (decorativa)` and
  `Proyección PCA de los embeddings (real)` — and the retake flushed out that
  the locales still carried the pre-audit **"LiteRT Local Vector Space"** lie
  in all 40 languages; both keys are honest now.
- Grounded answers (level A) consume the semantic retrieval when it exists:
  real ranking in, cited generation out.

Found along the way: **Notapad saves to `C:\DOCUMENTS`, which the Doc Explorer
did not list** — the OS's own save location was invisible to its document
reader. Fixed.

## What still is NOT real (and says so)

- HN Scout without a model: canned keyword-matched text, labelled.
- Doc Explorer without `ai:embed` consent: keyword overlap, labelled.
- The Media Player's RAG chat tab: still keyword search over the transcript.
