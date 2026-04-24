# Docker Container Fix Summary

## Problems Identified

### 1. Model Loading Failure
**Error:** `No module named 'flash_attn'`
- The model config hardcoded `"attn_implementation": "flash_attention_2"` in the vision encoder
- Flash-attn is a compiled CUDA package that takes 5-10 minutes to build from source
- Initial mock patches failed because they weren't intercepting the import chain early enough

### 2. Port & Network - Actually Working
- Port binding was correct (8001:8000 externally to internally)
- The `/health` endpoint returned 200 but showed `"status": "error"` because model was None
- The localhost issue wasn't connectivity—it was that the model never loaded, so `/v1/chat/completions` returned 500

## Solutions Implemented

### 1. In-Memory Config Patching (simple_server.py)
Wrapped Python's built-in `open()` function to intercept `config.json` reads:
```python
def patched_open(*args, **kwargs):
    result = _original_open(*args, **kwargs)
    if isinstance(args[0], str) and 'config.json' in args[0]:
        class PatchedFile:
            def read(self):
                content = self.file_obj.read()
                try:
                    data = json.loads(content)
                    if 'vision_config' in data and 'attn_implementation' in data['vision_config']:
                        print(f"Auto-patching flash_attention_2 -> eager")
                        data['vision_config']['attn_implementation'] = 'eager'
                        return json.dumps(data)
                except:
                    pass
                return content
```
- Patches before transformers parses the config
- Works even with read-only mounted volumes
- Replaces `flash_attention_2` with `eager` (slower but doesn't require CUDA-compiled packages)

### 2. Explicit Attention Implementation Parameter
```python
model = AutoModelForCausalLM.from_pretrained(
    MODEL_PATH,
    trust_remote_code=True,
    dtype=torch.float16,
    device_map="auto",
    attn_implementation="eager"  # Force non-flash attention
)
```

### 3. Environment Variables
```dockerfile
ENV TRANSFORMERS_USE_FLASH_ATTENTION=false
```
- Tells transformers to skip flash-attn optimization (though config patching is the real solution)

### 4. Entrypoint Fix
- Changed from `echo` commands (which failed with "python: not found") to `printf` 
- Ensures Python 3 path is correct: `python3` instead of `python`

## Current Status

✅ Model loads successfully (~40 seconds)  
✅ Server runs on http://localhost:8001  
✅ `/health` endpoint returns `{"status": "ok", "model_loaded": true}`  
✅ Container stays healthy (passes health checks)

## How to Call the Model for ML Inference

### Endpoint
```
POST http://localhost:8001/v1/chat/completions
```

### Request Format
```json
{
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "What is in this image?"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/png;base64,<BASE64_PNG_DATA>"
          }
        }
      ]
    }
  ]
}
```

### Response Format
```json
{
  "choices": [
    {
      "message": {
        "content": "<OCR_RESULT_TEXT>",
        "role": "assistant"
      }
    }
  ]
}
```

### Python Example
```python
import requests
import base64
from pathlib import Path

# Read and encode image
image_path = "path/to/image.png"
with open(image_path, "rb") as f:
    image_b64 = base64.b64encode(f.read()).decode()

# Call model
response = requests.post(
    "http://localhost:8001/v1/chat/completions",
    json={
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Extract all text from this image"},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{image_b64}"}
                    }
                ]
            }
        ]
    }
)

result = response.json()
text = result["choices"][0]["message"]["content"]
print(text)
```

### cURL Example
```bash
# Encode image to base64 first
BASE64_IMG=$(base64 < image.png | tr -d '\n')

# Call endpoint
curl -X POST http://localhost:8001/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d "{
    \"messages\": [
      {
        \"role\": \"user\",
        \"content\": [
          {\"type\": \"text\", \"text\": \"What text is in this image?\"},
          {\"type\": \"image_url\", \"image_url\": {\"url\": \"data:image/png;base64,$BASE64_IMG\"}}
        ]
      }
    ]
  }"
```

## Files Modified

1. **Dockerfile** — Added environment variables, config patcher placeholder, entrypoint script
2. **simple_server.py** — Added patched `open()` hook, lazy model loading, improved error handling
3. **.env** — Already configured with `MODEL_PATH=/models/dots.mocr-svg`
4. **docker-compose.yml** — Already configured with GPU support and volume mounts

## What's Next for Production

1. **Replace Flask with Gunicorn** — Current dev server not suitable for production
   ```dockerfile
   RUN pip install gunicorn
   CMD ["gunicorn", "-w", "1", "-b", "0.0.0.0:8000", "simple_server:app"]
   ```

2. **Add model caching layer** — Cache OCR results for duplicate images to reduce inference time

3. **Add request validation** — Check image format, size limits, timeout handling

4. **Monitor GPU memory** — The model uses ~8-12GB VRAM; add monitoring and graceful OOM handling

5. **Add logging** — Structured logs for debugging inference issues in production

6. **Use tagged base image** — Pin `vllm/vllm-openai:v0.17.1` to avoid unexpected updates

7. **Consider quantization** — Reduce model size with `bitsandbytes` or `bnb` for faster inference
