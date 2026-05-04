#!/usr/bin/env python3
"""Quick test of the OCR endpoint."""
import base64
import requests
from pathlib import Path

IMAGES_DIR = Path(r"C:\Users\anton\HudlScanner\training\images")
MOCR_URL = "http://localhost:8001/v1/chat/completions"

# Get first image
image_files = list(IMAGES_DIR.glob("*.png"))[:1]
if not image_files:
    print("No images found")
    exit(1)

img_path = image_files[0]
print(f"Testing with: {img_path.name}")

# Encode image
with open(img_path, "rb") as f:
    image_b64 = base64.b64encode(f.read()).decode("utf-8")

# Send request
payload = {
    "messages": [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What text is in this image?"},
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{image_b64}"}
                }
            ]
        }
    ]
}

print("Sending request...")
response = requests.post(MOCR_URL, json=payload, timeout=60)

print(f"Status: {response.status_code}")
print(f"Response: {response.text[:2000]}")
