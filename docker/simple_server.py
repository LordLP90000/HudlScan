#!/usr/bin/env python3
"""Simple OCR server using transformers without vLLM"""
import os
import sys
import json

# Mock flash_attn BEFORE any other imports
class MockFlashAttention:
    def __init__(self, *args, **kwargs):
        pass
    def __call__(self, *args, **kwargs):
        return None
    def __getattr__(self, name):
        return self

_mock = MockFlashAttention()
sys.modules['flash_attn'] = _mock
sys.modules['flash_attn.flash_attn_func'] = _mock
sys.modules['flash_attn.bert_padding'] = _mock
sys.modules['flash_attn.layer_norm'] = _mock
sys.modules['flash_attn.ops'] = _mock
sys.modules['flash_attn.ops.flash_attn_interface'] = _mock

# Patch transformers config loading to disable flash_attn
import json as _json
_original_open = open

def patched_open(*args, **kwargs):
    result = _original_open(*args, **kwargs)
    if isinstance(args[0], str) and 'config.json' in args[0]:
        class PatchedFile:
            def __init__(self, file_obj):
                self.file_obj = file_obj
                self._patched_content = None
            def read(self):
                content = self.file_obj.read()
                try:
                    data = _json.loads(content)
                    if 'vision_config' in data and 'attn_implementation' in data['vision_config']:
                        print(f"Auto-patching flash_attention_2 -> eager in {args[0]}")
                        data['vision_config']['attn_implementation'] = 'eager'
                        return _json.dumps(data)
                except:
                    pass
                return content
            def __enter__(self):
                return self
            def __exit__(self, *args):
                return self.file_obj.__exit__(*args)
            def __getattr__(self, name):
                return getattr(self.file_obj, name)
        return PatchedFile(result)
    return result

import builtins
builtins.open = patched_open

# Disable flash-attn in transformers
os.environ['TRANSFORMERS_USE_FLASH_ATTENTION'] = 'false'

from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from PIL import Image
import base64
from io import BytesIO

app = Flask(__name__)
CORS(app)

MODEL_PATH = os.environ.get('MODEL_PATH', 'rednote-hilab/dots.mocr-svg')
PORT = int(os.environ.get('PORT', 8000))

def load_model():
    try:
        from transformers import AutoTokenizer, AutoModelForCausalLM
        
        print(f"Attempting to load {MODEL_PATH}...")
        try:
            tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH, trust_remote_code=True)
            model = AutoModelForCausalLM.from_pretrained(
                MODEL_PATH,
                trust_remote_code=True,
                dtype=torch.float16,
                device_map="auto",
                attn_implementation="eager"
            )
            return model, tokenizer
        except TypeError:
            # Older transformers version doesn't support attn_implementation
            tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH, trust_remote_code=True)
            model = AutoModelForCausalLM.from_pretrained(
                MODEL_PATH,
                trust_remote_code=True,
                dtype=torch.float16,
                device_map="auto"
            )
            return model, tokenizer
            
    except Exception as e:
        print(f"Error loading model: {e}")
        import traceback
        traceback.print_exc()
        return None, None

print(f"Loading model: {MODEL_PATH}...")
model, tokenizer = load_model()
if model:
    print("Model loaded successfully!")
else:
    print("WARNING: Model failed to load. API will return errors for /v1/chat/completions")

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok" if model else "error", "model_loaded": model is not None})

@app.route('/v1/chat/completions', methods=['POST'])
def chat_completions():
    if not model or not tokenizer:
        return jsonify({"error": "Model not loaded"}), 500

    data = request.json
    messages = data.get('messages', [])

    # Extract image from messages
    image_base64 = None
    prompt_text = ""

    for msg in messages:
        content = msg.get('content', [])
        if isinstance(content, list):
            for item in content:
                if item.get('type') == 'image_url':
                    url = item.get('image_url', {}).get('url', '')
                    if url.startswith('data:image/png;base64,'):
                        image_base64 = url.split(',')[1]
                elif item.get('type') == 'text':
                    prompt_text += item.get('text', '')

    if not image_base64:
        return jsonify({"error": "No image found"}), 400

    # Decode image
    image_data = base64.b64decode(image_base64)
    image = Image.open(BytesIO(image_data))

    # Process with model
    try:
        response = model.chat(
            tokenizer=tokenizer,
            image=image,
            question=prompt_text,
            generation_config=dict(
                max_new_tokens=2048,
                do_sample=False,
            )
        )

        return jsonify({
            "choices": [{
                "message": {
                    "content": response,
                    "role": "assistant"
                }
            }]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print(f"Starting server on port {PORT}...")
    app.run(host='0.0.0.0', port=PORT)
