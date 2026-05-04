#!/usr/bin/env python3
"""Simple OCR server for dots.mocr model using proper vision-language API."""
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

# Global model variables
model = None
tokenizer = None
processor = None

def load_model():
    """Load the dots.mocr model with proper vision support."""
    global model, tokenizer, processor

    try:
        from transformers import AutoModelForCausalLM, AutoProcessor

        print(f"Loading model from: {MODEL_PATH}")

        # Load the model - use AutoModelForCausalLM with trust_remote_code
        # Model has bfloat16 weights but we'll use float16 for CPU compatibility
        # and explicitly cast inputs to match
        model = AutoModelForCausalLM.from_pretrained(
            MODEL_PATH,
            trust_remote_code=True,
            # Don't specify torch_dtype - let transformers use the config's default
            # Then we'll handle dtype mismatches in the inputs
            device_map="cpu",
        )

        # Get the actual model dtype after loading
        model_dtype = next(model.parameters()).dtype
        print(f"Model loaded with dtype: {model_dtype}")

        # Load the processor which handles both images and text
        processor = AutoProcessor.from_pretrained(
            MODEL_PATH,
            trust_remote_code=True
        )

        # Get tokenizer from processor
        tokenizer = processor.tokenizer

        print("Model loaded successfully!")
        print(f"Model type: {type(model).__name__}")
        print(f"Has vision tower: {hasattr(model, 'vision_tower')}")

        return True

    except Exception as e:
        print(f"Error loading model: {e}")
        import traceback
        traceback.print_exc()
        return False

print("="*60)
print("Dots.MOCR OCR Server")
print("="*60)

if load_model():
    print("Ready to process images!")
else:
    print("WARNING: Model failed to load.")

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok" if model else "error",
        "model_loaded": model is not None
    })

@app.route('/v1/chat/completions', methods=['POST'])
def chat_completions():
    """OpenAI-compatible chat completions endpoint."""
    if not model or not processor:
        return jsonify({"error": "Model not loaded"}), 500

    data = request.json
    messages = data.get('messages', [])

    # Extract image and text from messages
    image = None
    prompt_text = ""

    for msg in messages:
        content = msg.get('content', [])
        if isinstance(content, list):
            for item in content:
                if item.get('type') == 'image_url':
                    url = item.get('image_url', {}).get('url', '')
                    if 'data:image' in url:
                        image_data = url.split(',', 1)[1]
                        image_bytes = base64.b64decode(image_data)
                        image = Image.open(BytesIO(image_bytes)).convert('RGB')
                elif item.get('type') == 'text':
                    prompt_text += item.get('text', '')

    if image is None:
        return jsonify({"error": "No image found in request"}), 400

    if not prompt_text:
        prompt_text = "Extract all text from this image."

    try:
        # Prepare inputs using the processor
        # For Qwen2-VL style models, we need to use the apply_chat_template format
        # or prepare inputs manually with image placeholders

        # Create a message format for the processor
        # The DotsVLProcessor expects messages in a specific format
        messages_for_processor = [
            {
                "role": "user",
                "content": [
                    {"type": "image", "image": image},
                    {"type": "text", "text": prompt_text}
                ]
            }
        ]

        # Prepare inputs
        text = processor.apply_chat_template(
            messages_for_processor,
            tokenize=False,
            add_generation_prompt=True
        )

        # Process inputs
        inputs = processor(
            text=[text],
            images=[image],
            return_tensors="pt"
        )

        # Get the model's dtype
        model_dtype = next(model.parameters()).dtype

        # Cast all inputs to match model dtype to avoid dtype mismatch errors
        for key in list(inputs.keys()):
            if isinstance(inputs[key], torch.Tensor):
                if inputs[key].dtype.is_floating_point and inputs[key].dtype != model_dtype:
                    inputs[key] = inputs[key].to(model_dtype)
                # Move to device
                inputs[key] = inputs[key].to(model.device)
            elif isinstance(inputs[key], list) and len(inputs[key]) > 0:
                # Handle nested tensors (common in vision models)
                for i, item in enumerate(inputs[key]):
                    if isinstance(item, torch.Tensor):
                        if item.dtype.is_floating_point and item.dtype != model_dtype:
                            inputs[key][i] = item.to(model_dtype)
                        inputs[key][i] = inputs[key][i].to(model.device)

        # Generate response
        with torch.no_grad():
            generated_ids = model.generate(
                **inputs,
                max_new_tokens=2048,
                do_sample=False,
            )

        # Extract only the generated tokens (not the input)
        input_ids = inputs['input_ids']
        generated_ids = [
            ids[len(input_ids[i]):]
            for i, ids in enumerate(generated_ids)
        ]

        # Decode
        response_text = tokenizer.batch_decode(
            generated_ids,
            skip_special_tokens=True
        )[0]

        return jsonify({
            "choices": [{
                "message": {
                    "content": response_text,
                    "role": "assistant"
                }
            }],
            "model": "dots.mocr-svg"
        })

    except Exception as e:
        print(f"Error during inference: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "message": "Dots.MOCR OCR Server",
        "endpoints": {
            "/health": "Health check",
            "/v1/chat/completions": "OCR endpoint (OpenAI-compatible)"
        }
    })

if __name__ == '__main__':
    print(f"Starting server on port {PORT}...")
    print(f"Model path: {MODEL_PATH}")
    if model:
        print(f"Device: {next(model.parameters()).device}")
    app.run(host='0.0.0.0', port=PORT)
