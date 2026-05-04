#!/usr/bin/env python3
"""
Extract play information from playbook images using the MOCR model.

This script:
1. Reads playbook images from training/images/
2. Sends them to the local MOCR model (Docker) for OCR
3. Parses the OCR output to extract formation, concept, and routes
4. Saves structured data for ML training
"""

import json
import base64
import re
from pathlib import Path
from typing import List, Dict, Optional
import requests
from tqdm import tqdm

# Configuration
MOCR_URL = "http://localhost:8001/v1/chat/completions"
IMAGES_DIR = Path(r"C:\Users\anton\HudlScanner\training\images")
OUTPUT_DIR = Path(r"C:\Users\anton\HudlScanner\training")
EXTRACTIONS_FILE = OUTPUT_DIR / "ocr_extractions.jsonl"

# Known formations and concepts for parsing
KNOWN_FORMATIONS = ["Luzern", "Zug", "Bern", "Basel", "Genf", "Lugano"]
KNOWN_CONCEPTS = [
    "Power", "ISO", "Fold", "Trey",
    "Smash", "Glance", "Shallow Cross", "Moses", "Cross",
    "Flood", "Quick Hit", "Swing Screen", "Stick", "Spacing",
    "X Quick Hit", "Inside Zone", "Outside Zone"
]

# Position patterns
POSITION_PATTERNS = {
    "A-Near": r"A[ -]?Near",
    "A-Bump": r"A[ -]?Bump",
    "A-Near-Bump": r"A[ -]?Near[ -]?Bump",
    "I-Off": r"I[ -]?Off",
    "T-Flip": r"T[ -]?Flip",
    "T-Wing": r"T[ -]?Wing",
    "Z-Flip": r"Z[ -]?Flip",
}


def encode_image(image_path: Path) -> str:
    """Encode image to base64 string."""
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def ocr_image(image_path: Path, prompt: str = None) -> str:
    """
    Send image to MOCR model and get OCR text.

    Args:
        image_path: Path to the image file
        prompt: Optional custom prompt

    Returns:
        Extracted text from the image
    """
    if prompt is None:
        prompt = "Extract all text from this playbook image. Include formation names, play concepts, route descriptions, and any labels."

    image_b64 = encode_image(image_path)

    payload = {
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{image_b64}"}
                    }
                ]
            }
        ],
        "max_tokens": 2048,
        "temperature": 0.1
    }

    try:
        response = requests.post(MOCR_URL, json=payload, timeout=60)
        response.raise_for_status()
        result = response.json()
        return result["choices"][0]["message"]["content"]
    except requests.exceptions.RequestException as e:
        print(f"Error OCRing {image_path.name}: {e}")
        return ""


def parse_ocr_output(ocr_text: str, image_name: str) -> Dict:
    """
    Parse OCR text to extract structured play information.

    Args:
        ocr_text: Raw OCR output
        image_name: Original image filename

    Returns:
        Dictionary with extracted structured data
    """
    result = {
        "image_name": image_name,
        "raw_text": ocr_text,
        "formations": [],
        "concepts": [],
        "routes": [],
        "positions": []
    }

    # Extract formations
    for formation in KNOWN_FORMATIONS:
        if formation.lower() in ocr_text.lower():
            # Find all occurrences with their context
            pattern = re.compile(rf"{formation}[\s\-A-Za-z{{}}]*", re.IGNORECASE)
            matches = pattern.findall(ocr_text)
            result["formations"].extend(matches)

    # Extract concepts
    for concept in KNOWN_CONCEPTS:
        if concept.lower() in ocr_text.lower():
            result["concepts"].append(concept)

    # Extract positions
    for position_name, pattern in POSITION_PATTERNS.items():
        if re.search(pattern, ocr_text, re.IGNORECASE):
            result["positions"].append(position_name)

    # Try to extract route descriptions (lines with action words)
    route_keywords = ["block", "route", "run", "go", "to", "flat", "out", "in", "corner", "post"]
    lines = ocr_text.split("\n")
    for line in lines:
        if any(keyword in line.lower() for keyword in route_keywords):
            # Clean up the line
            cleaned = re.sub(r"\s+", " ", line.strip())
            if len(cleaned) > 3:
                result["routes"].append(cleaned)

    # Deduplicate
    result["formations"] = list(set(result["formations"]))
    result["concepts"] = list(set(result["concepts"]))
    result["positions"] = list(set(result["positions"]))
    result["routes"] = list(set(result["routes"]))[:10]  # Limit routes

    return result


def process_images(image_paths: List[Path]) -> List[Dict]:
    """Process all images and extract OCR data."""
    results = []

    for img_path in tqdm(image_paths, desc="OCRing images"):
        print(f"\nProcessing: {img_path.name}")

        # OCR the image
        ocr_text = ocr_image(img_path)

        if ocr_text:
            parsed = parse_ocr_output(ocr_text, img_path.name)
            parsed["image_path"] = str(img_path)
            results.append(parsed)

            # Print quick summary
            print(f"  Formations: {parsed['formations']}")
            print(f"  Concepts: {parsed['concepts']}")
            print(f"  Positions: {parsed['positions']}")
        else:
            print(f"  Failed to extract text")

    return results


def save_extractions(extractions: List[Dict], output_path: Path):
    """Save extractions to JSONL file."""
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        for ex in extractions:
            f.write(json.dumps(ex, ensure_ascii=False) + '\n')

    print(f"\nSaved {len(extractions)} extractions to {output_path}")


def main():
    print("="*60)
    print("MOCR Image Extraction Pipeline")
    print("="*60)

    # Check if model is running
    try:
        response = requests.get("http://localhost:8001/health", timeout=5)
        response.raise_for_status()
        health = response.json()
        print(f"\nModel status: {health.get('status', 'unknown')}")
        print(f"Model loaded: {health.get('model_loaded', False)}")
    except requests.exceptions.RequestException:
        print("\nERROR: MOCR model not responding!")
        print("Start the Docker container first:")
        print("  cd docker && docker-compose up -d")
        return

    # Get image files
    image_files = sorted(IMAGES_DIR.glob("*.png")) + sorted(IMAGES_DIR.glob("*.jpg"))
    print(f"\nFound {len(image_files)} images in {IMAGES_DIR}")

    if not image_files:
        print("No images found!")
        return

    # Ask user how many to process
    print(f"\nHow many images to process? (max {len(image_files)})")
    print("Press Enter for all, or enter a number:")
    user_input = input().strip()

    if user_input:
        try:
            limit = int(user_input)
            image_files = image_files[:limit]
        except ValueError:
            pass

    print(f"\nProcessing {len(image_files)} images...")

    # Process images
    extractions = process_images(image_files)

    # Save results
    save_extractions(extractions, EXTRACTIONS_FILE)

    # Summary
    print("\n" + "="*60)
    print("Extraction Summary")
    print("="*60)

    formations_found = set()
    concepts_found = set()
    for ex in extractions:
        formations_found.update(ex["formations"])
        concepts_found.update(ex["concepts"])

    print(f"Images processed: {len(extractions)}")
    print(f"Unique formations found: {sorted(formations_found)}")
    print(f"Unique concepts found: {sorted(concepts_found)}")

    print("\nNext steps:")
    print("1. Review the extractions in:", EXTRACTIONS_FILE)
    print("2. Use this data to build a training dataset")
    print("3. Or use directly with the lookup system")


if __name__ == "__main__":
    main()
