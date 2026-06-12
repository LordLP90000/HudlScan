# HudlScanner

Extract American football plays from playbook images using vision-language models. Upload playbook pages (PNG/PDF), pick a position, and get a structured, editable play table you can export to Excel.

## Stack

- **Frontend/API:** SvelteKit (Svelte 5, TypeScript, Tailwind CSS), deployed on Vercel
- **Extraction models:** Local dots.mocr (Docker/vLLM) with cloud fallbacks (Anthropic Claude → Moonshot Kimi → DeepSeek)
- **ML pipeline:** Python scripts for building training data and fine-tuning position-specific models

## Getting started

```sh
npm install
cp .env.example .env.local   # then fill in your API keys
npm run dev
```

The app runs at http://localhost:5173 (or 5174). At least one extraction backend must be configured in `.env.local`:

| Variable            | Purpose                                    |
| ------------------- | ------------------------------------------ |
| `USE_LOCAL_MOCR`    | `true` to use the local Docker model first |
| `LOCAL_MOCR_URL`    | Local vLLM server URL (default `:8000`)    |
| `ANTHROPIC_API_KEY` | Claude (primary cloud fallback)            |
| `MOONSHOT_API_KEY`  | Moonshot Kimi (secondary fallback)         |
| `DEEPSEEK_API_KEY`  | DeepSeek (tertiary fallback)               |
| `ALLOWED_ORIGINS`   | Comma-separated CORS allowlist for the API |

## Commands

```sh
npm run dev        # dev server
npm run build      # production build
npm run preview    # preview production build
npm run check      # svelte-check (type checking)
npm run lint       # prettier + eslint
npm run format     # prettier --write
npm run test:unit  # vitest unit tests
npm run test:e2e   # playwright e2e tests (run `npx playwright install` once first)
npm run test       # unit + e2e
```

## Project layout

| Path                                | Purpose                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------- |
| `src/routes/`                       | Pages (`/`, `/upload`, `/editor`, marketing pages)                        |
| `src/routes/api/extract-plays/`     | Extraction API endpoint                                                   |
| `src/lib/components/`               | UI components                                                             |
| `src/lib/prompt.js`                 | Vision prompt builder + playbook vocabulary                               |
| `src/lib/server/extraction/`        | Provider chain, response parsing, request schema                          |
| `src/lib/server/route-tree-data.js` | Base64 route tree legend (regenerate: `python scripts/gen_route_tree.py`) |
| `scripts/`                          | Python ML pipeline (training data, fine-tuning, annotation)               |
| `training/`                         | Training images and JSONL datasets                                        |
| `docker/`                           | Local dots.mocr inference server (vLLM)                                   |
| `hf-space/`                         | Hugging Face Spaces inference server                                      |
| `docs/`                             | Setup guides, design docs, mockups                                        |

## Docs

- [docs/QUICK_START.md](docs/QUICK_START.md) — quick start guide
- [docs/BACKEND_SETUP_GUIDE.md](docs/BACKEND_SETUP_GUIDE.md) — backend setup
- [docs/LOCAL_AI_SETUP.md](docs/LOCAL_AI_SETUP.md) — local model via Docker
- [CLAUDE.md](CLAUDE.md) — full project reference (training pipeline, concept rules, hardware)
