## Project Configuration

- **Language**: TypeScript
- **Package Manager**: npm
- **Add-ons**: prettier, eslint, vitest, playwright, tailwindcss, sveltekit-adapter, mcp

---

# HudlScanner Project

**Purpose:** Extract American football plays from playbook images using OCR/vision models.

## Architecture

- **Frontend:** SvelteKit (TypeScript) running on http://localhost:5174
- **OCR Models:**
  - Primary: Anthropic Claude API (fallback when local unavailable)
  - Local: `rednote-hilab/dots.mocr-svg` via Docker vLLM
  - Backup: Moonshot API, DeepSeek API
- **Training:** 134 PNG images in `for hudlscan/` folders for fine-tuning

---

# Environment Setup

## API Keys (.env.local)

The `.env.local` file contains API keys. **Never commit this file** — it's in `.gitignore`.

Required environment variables:
```env
# Local model toggle
USE_LOCAL_MOCR=false                    # Set to true when Docker model is running
LOCAL_MOCR_URL=http://127.0.0.1:8001    # Note: port 8001 (not 8000 due to conflict)
LOCAL_MOCR_MODEL=rednote-hilab/dots.mocr-svg

# API keys (for fallback/cloud extraction)
ANTHROPIC_API_KEY=sk-ant-...
MOONSHOT_API_KEY=sk-afE...
DEEPSEEK_API_KEY=sk-0ac...
```

## Server-Side Environment Loading

**IMPORTANT:** SvelteKit does NOT auto-load `.env.local` for server-side code.

The fix is in `src/hooks.server.ts` which loads dotenv manually. If API keys aren't found in server routes, check this file exists and dotenv is installed:
```bash
npm install dotenv
```

---

# Docker / Local Model Setup

## Container Info

- **Container name:** `hudlmcr-inference`
- **Config location:** `docker/docker-compose.yml`
- **Model:** rednote-hilab/dots.mocr-svg (~6GB safetensors format)
- **Base image:** vllm/vllm-openai:v0.17.1

## Common Docker Commands

```bash
# From docker/ directory
cd docker

# Build and start
docker-compose up -d --build

# View logs (wait for "Uvicorn running on http://0.0.0.0:8000")
docker-compose logs -f

# Check status
docker-compose ps

# Stop
docker-compose stop

# Full teardown
docker-compose down
```

## GPU Configuration

- **GPU:** RTX 4050 Laptop 6GB
- **Usable VRAM:** ~4.94GB free
- **Settings in entrypoint.sh:**
  - `--gpu-memory-utilization 0.55` (reduced from 0.85 due to OOM)
  - `--max-model-len 4096`
  - `--enforce-eager` (disables CUDA graph optimization)
  - `VLLM_ATTENTION_BACKEND=FLASHINFER` (avoids FlashAttention hang)

## Known Issues

| Issue | Solution |
|-------|----------|
| Port 8000 in use | Changed to 8001 in docker-compose.yml |
| GPU memory insufficient | Reduced gpu-memory-utilization to 0.55 |
| FlashAttention hang | Set VLLM_ATTENTION_BACKEND=FLASHINFER |
| Model slow download | Use huggingface_hub Python library directly |

---

# Training Data Workflow

## File Locations

| What | Location |
|------|----------|
| Training images | `for hudlscan/*.png` (134 files) |
| Scripts | `scripts/*.py` |
| Database | `hudlscanner.db` |
| n8n workflow | `n8n/hudlscanner-extract-workflow.json` |
| Docker config | `docker/` |
| Training output | `training_data.jsonl` |

## Training Process

1. **Generate ground truth** using Claude API via HudlScanner app
2. **Create training dataset:**
   ```bash
   python scripts/create_training_dataset.py training/images training/extractions training_data.jsonl
   ```
3. **Fine-tune model:**
   ```bash
   python scripts/finetune_dots_mocr.py training_data.jsonl ./hudlmcr-playbook-final
   ```
4. **Switch to trained model** by updating `docker/.env`:
   ```bash
   MODEL_PATH=/models/hudlmcr-playbook-final
   ```

---

# Quick Status Checks

```bash
# Check if Docker model is responding
curl http://localhost:8001/health

# Check database stats
python scripts/db_queries.py stats

# View Docker logs
cd docker && docker-compose logs -f
```

---

# Svelte MCP Server

You have access to comprehensive Svelte 5 and SvelteKit documentation via MCP.

## Available Svelte MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.

### 2. get-documentation

Retrieves full documentation content for specific sections. After calling list-sections, fetch ALL relevant sections for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues. Use this whenever writing Svelte code before sending to the user.

### 4. playground-link

Generates a Svelte Playground link. Ask user before calling this.
