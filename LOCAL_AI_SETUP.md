# HudlScanner Local AI Setup

Complete local AI inference and fine-tuning setup for HudlScanner using dots.mocr.

---

## Quick Start Checklist

- [ ] Docker Desktop installed and running
- [ ] n8n installed locally (optional, for workflow automation)
- [ ] GPU with 6GB+ VRAM available (12GB+ recommended for training)
- [ ] Python 3.12 installed (for local development/testing)

---

## Quick Start

### 1. Start Docker Inference Server

```bash
cd docker

# First time - build image
docker-compose build

# Start server
docker-compose up -d

# View logs
docker-compose logs -f hudlmcr-inference

# Verify it's running
curl http://localhost:8000/health
```

### 2. Enable Local MOCR in HudlScanner

The `.env.local` file is already configured with:
```
USE_LOCAL_MOCR=true
LOCAL_MOCR_URL=http://127.0.0.1:8000
```

Just restart your HudlScanner dev server:
```bash
npm run dev
```

### 3. Test with Sample Image

```bash
# Using Python test script
python scripts/test_local_model.py path/to/playbook.png QB

# Or test directly via curl
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "rednote-hilab/dots.mocr-svg",
    "messages": [{
      "role": "user",
      "content": [
        {"type": "text", "text": "Extract plays as JSON array with col1, col2, col3"},
        {"type": "image_url", "image_url": {"url": "data:image/png;base64,BASE64_IMAGE_HERE"}}
      ]
    }],
    "max_tokens": 4000
  }'
```

---

## Directory Structure

```
HudlScanner/
├── docker/
│   ├── Dockerfile                    # vLLM server with dots.mocr
│   ├── docker-compose.yml            # Docker compose config
│   └── .env                          # Docker environment variables
├── scripts/
│   ├── init_db.py                    # Initialize SQLite database
│   ├── db_queries.py                 # Database CLI operations
│   ├── test_local_model.py           # Test inference server
│   ├── create_training_dataset.py    # Create training data from images+JSON
│   ├── finetune_dots_mocr.py        # Fine-tune model (GPU required)
│   └── compare_extractions.py        # Compare local vs Claude outputs
├── n8n/
│   └── hudlscanner-extract-workflow.json  # n8n automation workflow
├── src/routes/api/extract-plays/
│   └── +server.ts                    # Modified to include local MOCR API
└── .env.local                        # Local MOCR configuration
```

---

## Training Pipeline

### 1. Initialize Database

```bash
# Create database
python scripts/init_db.py hudlscanner.db

# Add route tree reference (optional)
python scripts/init_db.py hudlscanner.db route-tree.png
```

### 2. Create Training Dataset

Organize your files:
```bash
training/
├── images/              # Playbook PNG files
└── extractions/         # Corresponding JSON files (verified extractions)
```

Create the dataset:
```bash
python scripts/create_training_dataset.py training/images training/extractions training_data.jsonl
```

### 3. Fine-Tune Model (Desktop with 12GB+ VRAM recommended)

```bash
# Auto-detects GPU and adjusts settings
python scripts/finetune_dots_mocr.py training_data.jsonl ./hudlmcr-playbook-final

# After training completes, update docker/.env:
# MODEL_PATH=/models/hudlmcr-playbook-final

# Copy model to Docker mount
mkdir -p docker/trained-model
cp -r hudlmcr-playbook-final docker/trained-model/

# Restart Docker with trained model
cd docker
docker-compose down
docker-compose up -d --build
```

---

## Database Operations

```bash
# Get statistics
python scripts/db_queries.py stats

# Add an image
python scripts/db_queries.py add-image playbook.png /path/to/playbook.png QB

# List unverified images
python scripts/db_queries.py unverified QB 20

# Export training data
python scripts/db_queries.py export-training training_data.jsonl
```

---

## GPU-Specific Settings

### Desktop (12GB VRAM) - Recommended for Training
- Batch size: 2
- Gradient accumulation: 4
- Training time: ~2-3 hours for 100 examples

### Laptop (6GB VRAM) - Inference Only
- Batch size: 1
- Gradient accumulation: 16
- Training: Not recommended (6-8 hours, may OOM)

The `finetune_dots_mocr.py` script auto-detects your GPU and adjusts settings accordingly.

---

## Troubleshooting

### Docker Issues

**Problem**: `docker: command not found`
- Install Docker Desktop for Windows

**Problem**: `could not select device driver nvidia`
- Enable WSL 2 backend in Docker Desktop
- Install NVIDIA WSL drivers

**Problem**: Out of memory
- Edit `docker/docker-compose.yml`: reduce `gpu-memory-utilization` to 0.7

### Model Issues

**Problem**: Model downloads every restart
- Volume `model-cache` should persist. Check: `docker volume ls`

**Problem**: Poor extraction accuracy
- Ensure training data has 50+ verified examples
- Increase training epochs to 5

### Server Issues

**Problem**: Server not reachable at http://127.0.0.1:8000
```bash
# Check Docker container status
docker ps

# Check logs
cd docker && docker-compose logs -f
```

---

## n8n Workflow (Optional)

1. Start n8n: `n8n start`
2. Import workflow: `n8n/hudlscanner-extract-workflow.json`
3. Activate workflow
4. Webhook URL: `http://localhost:5678/webhook/extract-play`

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `USE_LOCAL_MOCR` | `true` | Enable local inference |
| `LOCAL_MOCR_URL` | `http://127.0.0.1:8000` | Inference server URL |
| `LOCAL_MOCR_MODEL` | `rednote-hilab/dots.mocr-svg` | Model identifier |
| `MODEL_PATH` (docker) | `rednote-hilab/dots.mocr-svg` | Docker model path |

---

## API Fallback Chain

The HudlScanner API tries providers in this order:

1. **Local dots.mocr** (if `USE_LOCAL_MOCR=true`) - No cost, fastest
2. **Claude Sonnet 4.6** (if `ANTHROPIC_API_KEY` set) - Best quality
3. **Moonshot Kimi** (if `MOONSHOT_API_KEY` set)
4. **DeepSeek** (if `DEEPSEEK_API_KEY` set)

---

Generated for HudlScanner Local AI Setup
Date: 2026-04-23
