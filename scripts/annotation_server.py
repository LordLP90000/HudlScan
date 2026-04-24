#!/usr/bin/env python3
"""
Annotation server with dots.mocr model inference.
"""

import json
import os
import sys
from pathlib import Path
from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.parse
import torch
from PIL import Image
from io import BytesIO

# Paths
TRAINING_DIR = Path(r"C:\Users\anton\HudlScanner\training")
IMAGES_DIR = TRAINING_DIR / "images"
ANNOTATIONS_FILE = TRAINING_DIR / "annotations.jsonl"
MODEL_DIR = Path(r"C:\Users\anton\HudlScanner\models\dots.mocr-svg")

# Model components (lazy loaded)
_processor = None
_model = None
_device = None


def load_model():
    """Load the dots.mocr model using transformers."""
    global _processor, _model, _device

    if _model is not None:
        return _processor, _model, _device

    print("Loading dots.mocr model...", flush=True)

    _device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {_device}", flush=True)

    from transformers import AutoProcessor, AutoModelForCausalLM

    # Load processor and model with trust_remote_code
    _processor = AutoProcessor.from_pretrained(
        str(MODEL_DIR),
        trust_remote_code=True
    )

    _model = AutoModelForCausalLM.from_pretrained(
        str(MODEL_DIR),
        trust_remote_code=True,
        torch_dtype=torch.bfloat16 if _device == "cuda" else torch.float32
    ).to(_device).eval()

    print("Model loaded!", flush=True)
    return _processor, _model, _device


def run_inference(image_path):
    """Run model inference on an image."""
    try:
        processor, model, device = load_model()

        # Load image
        image = Image.open(image_path).convert("RGB")

        # Prompt for extraction
        prompt = """Analyze this football playbook image. Extract:
1. Formation name
2. Concept/Play type
3. Any position modifiers
4. Routes shown

Return as: Formation: X, Concept: Y, Position: Z, Route: W"""

        # Process inputs
        inputs = processor(
            text=prompt,
            images=image,
            return_tensors="pt"
        ).to(device)

        # Generate
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=200,
                do_sample=False,
                temperature=0.0
            )

        # Decode response
        response = processor.decode(outputs[0], skip_special_tokens=True)

        # Parse response to extract fields
        formation = ""
        concept = ""
        position = "regular"
        route = ""

        # Simple parsing
        if "Formation:" in response:
            formation = response.split("Formation:")[1].split(",")[0].split("\n")[0].strip()
        if "Concept:" in response:
            concept = response.split("Concept:")[1].split(",")[0].split("\n")[0].strip()
        if "Position:" in response:
            position = response.split("Position:")[1].split(",")[0].split("\n")[0].strip()
        if "Route:" in response:
            route = response.split("Route:")[1].split("\n")[0].strip()

        return {
            "formation": formation,
            "concept": concept,
            "position": position,
            "route": route,
            "raw_response": response
        }

    except Exception as e:
        import traceback
        return {
            "error": str(e),
            "traceback": traceback.format_exc(),
            "formation": "",
            "concept": "",
            "position": "",
            "route": ""
        }


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(TRAINING_DIR), **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)

        # Serve main page
        if parsed.path == '/' or parsed.path == '/annotate.html':
            self.send_response(200)
            self.send_header('Content-Type', 'text/html')
            self.end_headers()
            with open(TRAINING_DIR / "annotate.html", 'rb') as f:
                self.wfile.write(f.read())
            return

        # Image list
        if parsed.path == '/images-list.json':
            images = sorted([f.name for f in IMAGES_DIR.glob("*.png")])
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(images).encode())
            return

        # Download annotations
        if parsed.path == '/download':
            if ANNOTATIONS_FILE.exists():
                with open(ANNOTATIONS_FILE, 'rb') as f:
                    data = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'application/jsonl')
                self.send_header('Content-Disposition', 'attachment; filename="training_data.jsonl"')
                self.end_headers()
                self.wfile.write(data)
            else:
                self.send_response(404)
                self.end_headers()
            return

        # Default - serve static files
        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)

        # Predict endpoint - run model
        if parsed.path == '/predict':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)

            image_name = data.get('image', '')
            image_path = IMAGES_DIR / image_name

            if not image_path.exists():
                self.send_response(404)
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Image not found"}).encode())
                return

            print(f"Running inference on {image_name}...", flush=True)
            result = run_inference(image_path)
            print(f"Result: {result}", flush=True)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
            return

        # Save endpoint
        if parsed.path == '/save':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)

            # Append to JSONL
            with open(ANNOTATIONS_FILE, 'a') as f:
                f.write(json.dumps(data) + '\n')

            print(f"Saved annotation for {data.get('image')}", flush=True)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"saved": True}).encode())
            return


def main():
    print("="*50)
    print("A-Back Annotation Server")
    print("="*50)
    print(f"Training dir: {TRAINING_DIR}")
    print(f"Images: {len(list(IMAGES_DIR.glob('*.png')))}")
    print("Open: http://localhost:8888/annotate.html")
    print("="*50)

    # Start model loading in background
    import threading
    threading.Thread(target=load_model, daemon=True).start()

    server = HTTPServer(('localhost', 8888), Handler)
    server.serve_forever()


if __name__ == "__main__":
    main()
