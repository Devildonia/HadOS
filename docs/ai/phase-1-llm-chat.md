# AI phase 1 — real on-device chat (MediaPipe LLM Inference / Gemma)

Phase 0 built the substrate and gave Pinta real segmentation. Phase 1 gives the
Messenger **real conversations**: a persona-conditioned LLM generating every reply
on the user's own GPU, replacing the scripted canned answers the v1.0.6 audit made
us label honestly. The honest label now reads the other way — and it is true.

## The engine

[`@mediapipe/tasks-genai`](https://www.npmjs.com/package/@mediapipe/tasks-genai)
(`LlmInference`) — the LLM branch of the same LiteRT family the tensor substrate
uses. It runs Gemma bundles (`.task` / `.litertlm`) over **WebGPU**; there is no
usable CPU path for an LLM, so no WebGPU means an honest "not available" message,
never a fake reply.

Verified against the installed `genai.d.ts` (v0.10.29):

- `FilesetResolver.forGenAiTasks(basePath)` — wasm assets, copied to
  `public/wasm/genai/` by `scripts/copy-genai-wasm.ts` (gitignored, regenerated on
  `predev`/`build`, same shape as the LiteRT copy step).
- `LlmInference.createFromOptions(fileset, { baseOptions: { modelAssetBuffer },
  maxTokens, topK, temperature })` — `modelAssetBuffer` takes a `Uint8Array`.
- `generateResponse(prompt, (delta, done) => …)` — the listener receives **newly
  generated deltas**, not cumulative text, and only ONE generation may be in
  flight per instance (the runtime serializes).

## The model is imported, never downloaded

Gemma is license-gated, so HadOS does not (and must not) fetch it. The user
downloads a bundle themselves — accepting Google's license where they got it —
and imports the file:

- Recommended: **Gemma 3 1B int4** (`gemma3-1b-it-int4.task`, ~550 MB) from the
  [litert-community space on Hugging Face](https://huggingface.co/litert-community)
  or Kaggle Models.
- Messenger → sidebar → **"Importar modelo IA (.task)"** → pick the file.

The import computes a SHA-256, stores the bytes in the OPFS model cache
(`AiModelCache.put`) and records `{id, label, bytes, sha256}` in
`localStorage['hados-ai-chat-models']`. The id **is** the hash prefix
(`chat-<sha256[:16]>`), so re-importing the same file lands on the same entry
instead of storing 550 MB twice.

### Why this does not weaken the registry boundary

The download registry (`js/ai/models.ts`) exists to deny apps a URL-shaped
download primitive. Imported models never had a URL: `AiModelCache.get(id)` is
**read-only**, and on a miss the only outcome is an error telling the user to
import again. The worker verifies size + SHA-256 against the values recorded at
import **before compiling** — the same verify-before-write discipline downloads
get, pointed at disk instead of network.

## Data flow

```
Messenger (host app)
  └─ AiService.chat('messenger', {persona, history}, onToken)
       ├─ PermissionBroker.check('ai:chat')        ← consent, remembered
       ├─ buildGemmaPrompt(persona, history)       ← host-side, pure, tested
       ├─ chat:load {id, bytes, sha256}  ──────────► ai-runtime worker
       │                                              ├─ AiModelCache.get(id)  (OPFS)
       │                                              ├─ verify size + sha256
       │                                              └─ GenAiRuntime.loadModel (WebGPU)
       └─ chat:generate {requestId, prompt} ───────►  generateResponse
             ◄─ chat:token {requestId, delta, done} ── streamed deltas
```

Same process as the tensor path (`ai-runtime`), same watchdog, same IPC protocol.
The main thread never holds the model bytes.

## The prompt template

Gemma has a fixed turn grammar and **no system role**, so `buildGemmaPrompt`
folds the persona into the first user turn and ends with an open `model` turn.
Two properties are pinned by tests:

- **Injection defence** — `<start_of_turn>`/`<end_of_turn>` are stripped from
  user text and personas, so a message cannot close its own turn and speak as
  the model.
- **Window** — only the newest `MAX_HISTORY_TURNS` (12) turns ride along,
  keeping the prompt inside the 1280-token budget.

## Consent

A new capability, **`ai:chat`** — separate from `ai:infer` because the honest
consent text differs: *"generate chat replies with the imported AI model,
entirely on your device (nothing is sent anywhere)"*. Importing the file is not
gated (the file picker is itself the user's explicit act); generating is.

## What the Messenger shows

The sidebar pill is the honesty contract:

- `🧠 IA local: <file>` — replies are generated on-device (with a ✕ to delete
  the model: cache bytes + registry entry).
- `Respuestas con guion (sin IA)` + import button — the pre-phase-1 scripted
  behaviour, still available, still labelled.
- Model imported but no WebGPU — says exactly that.

Generation errors surface in the bubble as `⚠️ IA local: …`. There is no silent
fallback from real AI to script — the audit taught us what silent fallbacks cost.

## Testing

`test/AiChat.test.ts` (fake `IChatRuntime`, no model): template + injection +
truncation; handlers' verify-before-compile (size, hash, cache miss, WebGPU
missing); once-only compile; delta streaming over the real IPC loopback;
`AiModelCache.put/get` round-trip and id validation; registry
register/replace/default-by-recency; `AiService.chat` consent denial before any
work, and the full grant → verify → compile → stream path.

## Known limits (v1)

- **~550 MB in RAM twice, briefly**: `file.arrayBuffer()` at import and
  `new Uint8Array(bytes)` at compile. Streaming both (OPFS
  `file.stream().getReader()` satisfies `modelAssetBuffer`) is the obvious next
  step if it hurts on 8 GB machines.
- One chat model loaded at a time (a second Gemma would double GPU memory).
- The other simulated features (HN summaries, Media Player / Doc Explorer Q&A)
  still say "simulated" — wiring them to `AiService.chat` is phase 2, and their
  labels flip only when it lands.
