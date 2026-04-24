#!/usr/bin/env python3
"""
Test A-Back extraction using fine-tuned model.

This script loads a trained model and extracts A-Back information
 from playbook images or text descriptions.
"""

import json
import torch
from transformers import AutoTokenizer, AutoModelForVision2Seq, AutoModelForCausalLM
from pathlib import Path

# Paths
MODEL_PATH = Path(r"C:\Users\anton\HudlScanner\models\aback_finetuned\final")
BASE_MODEL = Path(r"C:\Users\anton\HudlScanner\models\dots.mocr-svg")
TRAINING_DATA = Path(r"C:\Users\anton\HudlScanner\training\aback_training.jsonl")

def load_model(model_path: Path = None, base_model: Path = None):
    """Load the fine-tuned model for inference."""
    model_dir = model_path if model_path and model_path.exists() else base_model

    print(f"Loading model from: {model_dir}")

    tokenizer = AutoTokenizer.from_pretrained(str(model_dir))
    model = AutoModelForVision2Seq.from_pretrained(
        str(model_dir),
        torch_dtype=torch.bfloat16 if torch.cuda.is_available() else torch.float32
    )

    device = "cuda" if torch.cuda.is_available() else "cpu"
    model.to(device)
    model.eval()

    return model, tokenizer, device

def extract_aback_from_text(formation: str, concept: str, model=None, tokenizer=None, device=None):
    """
    Extract A-Back route/action from formation + concept.

    Args:
        formation: Formation name (e.g., "Luzern A-Near")
        concept: Concept name (e.g., "Power")

    Returns:
        Predicted A-Back route/action
    """
    if model is None:
        model, tokenizer, device = load_model()

    # Create input prompt
    prompt = f"Formation: {formation}, Concept: {concept}"

    # Tokenize
    inputs = tokenizer(prompt, return_tensors="pt").to(device)

    # Generate
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_length=64,
            num_beams=4,
            temperature=0.7,
            do_sample=True
        )

    # Decode
    prediction = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return prediction

def lookup_training_data(formation: str, concept: str, training_data: Path = TRAINING_DATA):
    """
    Look up A-Back route from training data (exact match).

    Useful for testing without running inference.
    """
    with open(training_data, 'r', encoding='utf-8') as f:
        for line in f:
            item = json.loads(line)
            if item["formation"].lower() == formation.lower() and item["concept"].lower() == concept.lower():
                return {
                    "route": item["route"],
                    "position": item.get("position", "unknown"),
                    "description": item.get("aback_role", ""),
                    "play_type": item.get("play_type", "")
                }
    return None

def main():
    print("="*60)
    print("A-Back Extraction Test")
    print("="*60)

    # Test cases from your training data
    test_cases = [
        ("Luzern A-Near Right", "Power"),  # Note: includes direction
        ("Zug A-Bump Right", "Power"),
        ("Luzern", "Fold"),
        ("Zug A-Near-Bump", "Stick"),
        ("Luzern A-Bump", "Stick"),
        ("Luzern Right", "Swing Screen"),
        ("Zug", "Spacing"),
    ]

    print("\n" + "="*60)
    print("Testing with training data lookup...")
    print("="*60)

    for formation, concept in test_cases:
        result = lookup_training_data(formation, concept)
        if result:
            print(f"\nFormation: {formation}, Concept: {concept}")
            print(f"  -> Route: {result['route']}")
            print(f"  -> Position: {result['position']}")
            if result['play_type']:
                print(f"  -> Play Type: {result['play_type']}")
        else:
            print(f"\nFormation: {formation}, Concept: {concept}")
            print(f"  -> Not found in training data")

    print("\n" + "="*60)
    print("Summary")
    print("="*60)
    print(f"Training data: {TRAINING_DATA}")
    print(f"Total examples: {sum(1 for _ in open(TRAINING_DATA))}")
    print(f"\nFor model inference, ensure the fine-tuned model is saved at:")
    print(f"  {MODEL_PATH}")
    print(f"\nTo fine-tune the model, run:")
    print(f"  python scripts/train_aback_model.py")

if __name__ == "__main__":
    main()
