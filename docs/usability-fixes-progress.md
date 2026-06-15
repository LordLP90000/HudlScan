# Usability Fixes — Progress Tracker

Tracks implementation of the measures from the **Usability-Bericht (Modul 322)** for
Hudl Playbook AI. Work is split into batches; this file is updated after each batch
is completed and committed.

**Decided brand name:** `Hudl Playbook AI` (applied everywhere)
**Single source of truth for file/accuracy specs:** [src/lib/config.ts](../src/lib/config.ts)

---

## Batch 1 — Consistency foundation

| # | Measure | Status | Files |
| - | ------- | ------ | ----- |
| Setup | Central config (file size, formats, accuracy) | ✅ Done | `src/lib/config.ts` |
| M4 | Consistent file specs everywhere (no 10 vs 50 MB, unified formats) | ✅ Done | `FileDropzone.svelte`, `upload/+page.svelte`, `how-it-works/+page.svelte`, `+page.svelte` |
| M2 | Consistent brand name (`Hudl Playbook AI`) | ✅ Done | `+page.svelte` (title + footer) |

## Batch 2 — Credibility & trust

| # | Measure | Status | Files |
| - | ------- | ------ | ----- |
| M1 | Credible homepage metrics + single accuracy claim | ✅ Done | `+page.svelte`, `how-it-works/+page.svelte`, `upload/+page.svelte` |
| M5a | Debug panel only in DEV | ✅ Done | `upload/+page.svelte` |
| M5b | Privacy notice + replace "coming soon" legal links | ✅ Done | `+page.svelte`, new `privacy/+page.svelte`, `upload/+page.svelte` |

## Batch 3 — Clarity & flow (from user test)

| # | Measure | Status | Files |
| - | ------- | ------ | ----- |
| M3 | Explain abbreviations (legend/tooltips) | ⏳ Pending | `editor/+page.svelte`, `PlaysTable.svelte` |
| + | Make "Select position" step more prominent | ⏳ Pending | `upload/+page.svelte`, `PositionSelector.svelte` |
| + | Clear "Upload another" action on results | ⏳ Pending | `editor/+page.svelte` |

## Batch 4 — Verification

| # | Task | Status |
| - | ---- | ------ |
| V | `npm run dev` starts clean + `npm run build` passes | ⏳ Pending |

---

## Change log

_(updated after each batch)_

- **Batch 1 — Consistency foundation:** Added `src/lib/config.ts` as the single source
  of truth for max file size (50 MB), supported formats (PDF, PNG, JPG, WEBP) and the
  accuracy claim. Wired `FileDropzone`, the upload page, the homepage step text and the
  how-it-works "supported files" chips to it (removes the 10 MB vs 50 MB and format-list
  contradictions). Unified the homepage `<title>` and footer brand to `Hudl Playbook AI`.
- **Batch 2 — Credibility & trust:** Replaced the broken-looking animated "0K+ / 0%"
  homepage stats with honest, config-driven figures (accuracy, ~2 min per playbook,
  0 manual entry) and routed every accuracy mention through `ACCURACY_CLAIM` so the
  homepage, how-it-works and upload pages can no longer contradict each other. Gated the
  upload debug panel behind SvelteKit's `dev` flag so it is hidden in production. Added a
  real `privacy/+page.svelte` (plain-language data-handling notice), replaced the footer
  "coming soon" legal placeholders with a working Privacy link (+ Terms marked "planned"),
  and added a short data-handling hint with a privacy link beneath the upload dropzone.
