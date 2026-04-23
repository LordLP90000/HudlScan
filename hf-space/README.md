---
title: MOCR Inference
emoji: 🏈
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
license: mit
---

# dots.mocr SVG Inference Server

Football play diagram OCR using the dots.mocr model.

## API Usage

Send POST requests to `/v1/chat/completions` with base64-encoded images.

```bash
curl -X POST https://LordLP9000-mocr-inference.hf.space/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "rednote-hilab/dots.mocr-svg",
    "messages": [{
      "role": "user",
      "content": [
        {"type": "text", "text": "Extract football plays from this image"},
        {"type": "image_url", "image_url": {"url": "data:image/png;base64,..."}}
      ]
    }],
    "max_tokens": 4000
  }'
```
