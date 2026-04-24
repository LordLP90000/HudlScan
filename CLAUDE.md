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
- **Training:** ML pipeline for position-specific concept extraction

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

# Hardware Configuration

- **GPU:** NVIDIA GeForce RTX 4050 Laptop GPU, 6GB VRAM
- **Current PyTorch:** CPU-only (needs CUDA version for GPU training)
- **Install CUDA PyTorch:**
  ```bash
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124
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

# ML Training Pipeline (A-Back/Fullback)

## File Locations

| What | Location |
|------|----------|
| Concept CSV files | `for hudlscan/*.csv` (12 concept files) |
| Position templates | `for hudlscan/templates/*.csv` (RB, QB, OL, WR, TE) |
| Training images | `training/images/*.png` (17 images) |
| Training data | `training/aback_training.jsonl` (69 examples) |
| Base model | `models/dots.mocr-svg/` |
| Fine-tuned output | `models/aback_finetuned/final/` |
| Scripts | `scripts/build_aback_training.py`, `scripts/train_aback_model.py`, `scripts/test_aback_extraction.py` |
| HF Space | https://lordlp9000-mocr-inference.hf.space |
| Requirements | `requirements-ml.txt` |

## CSV File Format

Each concept has its own CSV file with two columns:
- **Column 1:** Formation + Concept (e.g., "Luzern A-Near Power Right")
- **Column 2:** A-Back Route/Action (e.g., "Lead Block Rb")

**Concept CSV files:**
- `Power.csv`, `ISO.csv`, `Fold.csv`
- `Smash.csv`, `Glance.csv`, `Shallow Cross.csv`
- `Moses.csv`, `Cross.csv`, `Flood.csv`
- `X Quick Hit.csv`, `Swing Screen.csv`
- `Stick.csv`, `Spacing.csv`

## A-Back Position Patterns

| Position | Formation Pattern | Description |
|----------|-------------------|-------------|
| regular | (no modifier) | Default position (next to RT) |
| a_near | A-Near, A Near | Flipped to left side (next to LT) |
| a_bump | A-Bump, A Bump | Bumped position |
| a_near_bump | A-Near-Bump | A-Near + Bump combined |
| i_off | I-Off, I Off | I-Off formation |
| i | Luzern I (not I-Off) | I formation |
| t_flip | T-Flip, T Flip | T-Flip formation |
| t_wing | T-Wing, T Wing | T-Wing formation |
| z_flip | Z-Flip, Z Flip | Z-Flip formation |

## Training Workflow

### 1. Build Training Data from CSVs

```bash
python scripts/build_aback_training.py
```

Creates `training/aback_training.jsonl` with 69 A-Back examples.

**Output format:**
```json
{"formation": "Luzern A-Near", "concept": "Power", "position": "a_near", "route": "Lead Block Rb", "aback_role": "..."}
{"formation": "Zug A-Bump", "concept": "Stick", "position": "a_bump", "route": "Angle Out", "aback_role": "..."}
```

### 2. Fine-Tune the Model

```bash
# First install dependencies
pip install -r requirements-ml.txt

# Run training (requires GPU or patience for CPU)
python scripts/train_aback_model.py
```

**Training settings:**
- Batch size: 2 (adjust for GPU memory)
- Epochs: 10
- Learning rate: 5e-5
- Train/eval split: 90/10

### 3. Test Extraction

```bash
python scripts/test_aback_extraction.py
```

Tests lookup against training data or model inference.

---

# Concept Rules Reference

## Running Concepts

### Trey
- **Backside A-Back:** Seals where pullers left
- **With Divide:** Follows as 3rd blocker
- **Playside A-Back:** Leads upfield to extend wall

### Power
- **Playside/motioned:** 2nd lead blocker after puller
- **A-Divide:** Leads up the hole
- **Backside:** Fills pulling Guard's gap

### ISO
- **A-Back:** Finds hole, hits first defender hard inside

### Inside Zone
- **A-Back (under center):** Blocks backside End

### Fold
- **Run:** A-Back goes outside, blocks first defender
- **RPO / 2x2 Pass:** A-Back runs "Shoot" route (shallow flat)
- **3x1 Pass:** A-Back runs Comeback to middle of field

### Outside Zone
- **A-Back:** Blocks backside End

## Passing Concepts

### Smash, Glance, Shallow Cross, Moses, Cross
- **A-Back:** No role (RB handles routes)

### Flood
- **A-Back (SECURE tag):** Blocks D-end inside to secure edge for QB boot

### Quick Hit
- **A-Back:** No role (RB stays in box)

### Swing Screen
- **A-Back:** Lead blocker on swing route, blocks for RB

### Stick
- **Regular / I-Off:** 5 Out route
- **A-Bump:** Angle Out route
- **Outside-most player:** 10 Dig route
- **A-Near:** Stick route

### Spacing
- **A-Back:** Comeback route (depth varies by formation)

### X Quick Hit
- **Screen to X receiver** (left outside receiver)
- **Z Quick Hit:** Screen to Z receiver (right outside receiver)

## Special Modifiers

- **Divide:** Position-specific (A-Divide = A-Back, T-Divide = TE, etc.)
- **Fix:** Trips formation - A-Back crosses to block CB instead of Slot
- **Fade:** TE fakes 5 Out, runs Fade route
- **Side:** Positional knowledge from formation (not extracted separately)

---

# Position Templates

Templates for future data collection (A-Back complete, others to be filled):

| Position | Template File | Status |
|----------|--------------|--------|
| A-Back | (using concept CSVs) | ✅ Complete (69 examples) |
| RB | `templates/RB_template.csv` | ⏳ To be filled |
| QB | `templates/QB_template.csv` | ⏳ To be filled |
| OL | `templates/OL_template.csv` | ⏳ To be filled |
| WR | `templates/WR_template.csv` | ⏳ To be filled |
| TE | `templates/TE_template.csv` | ⏳ To be filled |

---

# Quick Status Checks

```bash
# Check if Docker model is responding
curl http://localhost:8001/health

# Build training data
python scripts/build_aback_training.py

# Test extraction
python scripts/test_aback_extraction.py

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
