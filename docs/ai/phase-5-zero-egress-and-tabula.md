# AI phase 5 — zero egress, multi-doc, radar, and Tabula

Second harvest from surveying the agent-app ecosystem: four features, each an
existing pattern rebuilt under HadOS's rules (on-device, consented, labelled).
The headline: with this phase, **HadOS is fully zero-egress** — no feature
sends user data anywhere, ever.

## 🔒 Voxcribe — on-device dictation (the zero-egress milestone)

Dictation was the LAST feature where data left the machine (the browser's
SpeechRecognition ships audio to its vendor's servers — audit A1 made that
honest; this phase makes it optional). A new engine selector:

- **🔒 Whisper (local, default when available)** — push-to-talk: record
  (`mic:record`), stop, transcribe on-device (`ai:transcribe`). No live interim
  text — Whisper works on the finished clip; the honest trade.
- **☁️ Navegador** — the old engine, kept for live streaming dictation, still
  behind `speech:cloud` which says the audio may leave.

The selector labels carry the data-flow truth in the option text itself.

## 📚 Doc Query — multi-document with `file:line` provenance

"📚 Todos los documentos" indexes every listed file (DOCUMENTS, NOTES,
PODCASTS) into one corpus; each line keeps `{file, line}` provenance and the
source box cites `[archivo:línea]`. Both search modes (keyword and semantic)
share the corpus; the 512-line semantic cap logs honestly when it bites.

## 📡 Nova — Radar (the "always-on agent", scoped honestly)

Comma-separated topics; while Nova is open, the front page is re-checked every
5 minutes and **new** stories matching a topic raise an OS notification
(titles are remote text; `NotificationManager` escapes messages). Deliberately
**keyword matching, not a model call**: a watchlist must be cheap and
predictable, and it says so. The seen-ids set caps at 500; the tooltip states
the scope — a browser OS has no background daemons, and pretending otherwise
would be the old theatre.

## 📊 Tabula — CSV analysis where the numbers must be real (new app)

The "data analysis agent" pattern, tamed: **an LLM doing arithmetic is a
hallucination with confidence**, so the division of labour is absolute:

- `tabula/csv.ts` (pure, pinned by tests): an RFC-4180-shaped parser (quoted
  fields, doubled quotes, CRLF, Excel BOM, `,`/`;`/tab auto-detection, EU
  decimal commas and thousands separators) and per-column statistics — numeric
  detection at ≥80% parseable, count/missing/min/max/mean/sum, or
  distinct/top for text.
- The stats table is labelled *"calculadas en código — números reales, no
  generados"*.
- The **🧠 Narrar** button (AI mode only) hands Gemma the precomputed figures
  under a prompt that **forbids inventing or recalculating** — narration of
  real numbers, never generation of fake ones. The output is signed
  *"narración generada on-device sobre cifras calculadas en código"*.

## Testing

`Tabula.test.ts` (parser edge cases, EU numerals, numeric-vs-text detection,
the forbid-inventing prompt, app honest states); `radarMatches` ranking in the
Nova spec; the existing suites cover the Voxcribe and Doc Query fallbacks.

## The zero-egress statement (as of this phase)

Every capability in the broker either processes data locally or names exactly
what leaves: `ai:infer`, `ai:chat`, `ai:transcribe`, `ai:embed`, `mic:record`
— all local; `speech:cloud` — the one opt-in exception, clearly labelled and
no longer the default for anything.
