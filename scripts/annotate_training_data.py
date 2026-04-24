#!/usr/bin/env python3
"""
Interactive training data annotation tool.
Shows each playbook image, lets you specify formation/concept/route.
"""

import json
import sys
from pathlib import Path
import webbrowser
import urllib.parse

# Paths
IMAGES_DIR = Path(r"C:\Users\anton\HudlScanner\training\images")
OUTPUT_FILE = Path(r"C:\Users\anton\HudlScanner\training\annotated_training_data.jsonl")

# Load existing annotations
existing_annotations = []
if OUTPUT_FILE.exists():
    with open(OUTPUT_FILE, 'r') as f:
        for line in f:
            existing_annotations.append(json.loads(line))
    print(f"Loaded {len(existing_annotations)} existing annotations")

# Get already annotated images
annotated_images = {a['image_file'] for a in existing_annotations}

# Get all images
image_files = sorted([f for f in IMAGES_DIR.glob("*.png")])
unannotated = [f for f in image_files if f.name not in annotated_images]

print(f"\n{'='*60}")
print(f"Interactive Training Data Annotation")
print(f"{'='*60}")
print(f"Total images: {len(image_files)}")
print(f"Already annotated: {len(existing_annotations)}")
print(f"Remaining: {len(unannotated)}")
print(f"Output: {OUTPUT_FILE}")
print(f"{'='*60}\n")

if not unannotated:
    print("All images already annotated!")
    sys.exit(0)

# Available concepts for reference
KNOWN_CONCEPTS = [
    "Trey", "Power", "ISO", "Inside Zone", "Outside Zone", "Fold",
    "Smash", "Glance", "Shallow Cross", "Moses", "Cross",
    "Flood", "Quick Hit", "Swing Screen", "Stick", "Spacing", "X Quick Hit"
]

KNOWN_POSITIONS = [
    "regular", "a_near", "a_bump", "a_near_bump", "i_off", "i", "t_flip", "t_wing", "z_flip"
]

for idx, img_path in enumerate(unannotated):
    print(f"\n{'='*60}")
    print(f"[{idx+1}/{len(unannotated)}] {img_path.name}")
    print(f"{'='*60}")

    # Open image in default viewer
    print(f"\nOpening image: {img_path}")
    print(f"Size: {img_path.stat().st_size / 1024:.1f} KB")

    # Open image with default viewer
    image_uri = img_path.absolute().as_uri()
    print(f"Image URI: {image_uri}")
    webbrowser.open(image_uri)

    # Show reference info
    print(f"\n--- REFERENCE ---")
    print(f"Known concepts: {', '.join(KNOWN_CONCEPTS[:10])}...")
    print(f"Known positions: {', '.join(KNOWN_POSITIONS)}")

    # Get user input
    print(f"\n{'-'*60}")
    print("Enter values (press Enter to skip):")
    print("  f=<formation>  - Formation name")
    print("  c=<concept>    - Concept name")
    print("  p=<position>   - A-Back position")
    print("  r=<route>      - A-Back route/action")
    print("  desc=<text>    - Description (optional)")
    print("  s              - Save this annotation")
    print("  skip           - Skip this image")
    print("  q              - Quit")
    print(f"{'-'*60}\n")

    # Build current annotation
    annotation = {
        "image_file": img_path.name,
        "image_path": str(img_path),
        "image_size": img_path.stat().st_size,
        "formation": "",
        "concept": "",
        "position": "",
        "route": "",
        "description": "",
        "confirmed": False
    }

    # Interactive editing
    while True:
        # Display current values
        print(f"Current: F={annotation['formation'] or '-'} C={annotation['concept'] or '-'} P={annotation['position'] or '-'} R={annotation['route'] or '-'}")

        try:
            user_input = input("> ").strip()
        except EOFError:
            user_input = 'q'

        if not user_input:
            continue

        if user_input.lower() == 'q':
            print("\nSaving progress and quitting...")
            with open(OUTPUT_FILE, 'a') as f:
                for ann in existing_annotations:
                    f.write(json.dumps(ann, ensure_ascii=False) + '\n')
            sys.exit(0)
        elif user_input.lower() == 'skip':
            print("Skipped!")
            break
        elif user_input.lower() == 's':
            annotation['confirmed'] = True
            existing_annotations.append(annotation)
            # Append to output file immediately
            with open(OUTPUT_FILE, 'a') as f:
                f.write(json.dumps(annotation, ensure_ascii=False) + '\n')
            print(f"✓ Saved: {img_path.name}")
            print(f"  Formation: {annotation['formation']}")
            print(f"  Concept: {annotation['concept']}")
            print(f"  Position: {annotation['position']}")
            print(f"  Route: {annotation['route']}")
            break
        elif user_input.startswith('f='):
            annotation['formation'] = user_input.split('=', 1)[1].strip()
        elif user_input.startswith('c='):
            annotation['concept'] = user_input.split('=', 1)[1].strip()
        elif user_input.startswith('p='):
            annotation['position'] = user_input.split('=', 1)[1].strip()
        elif user_input.startswith('r='):
            annotation['route'] = user_input.split('=', 1)[1].strip()
        elif user_input.startswith('desc='):
            annotation['description'] = user_input.split('=', 1)[1].strip()
        else:
            print("Unknown command. Try: f=, c=, p=, r=, desc=, s, skip, q")

print(f"\n{'='*60}")
print(f"Annotation session complete!")
print(f"Total annotations: {len(existing_annotations)}")
print(f"{'='*60}")
