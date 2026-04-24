#!/usr/bin/env python3
"""
Build A-Back/Fullback training data from concept CSV files.
Creates JSONL training data for fine-tuning dots.mocr model.
"""

import csv
import json
from pathlib import Path
from typing import List, Dict, Optional
import re

# Paths
CSV_DIR = Path(r"C:\Users\anton\HudlScanner\for hudlscan")
OUTPUT_DIR = Path(r"C:\Users\anton\HudlScanner\training")
OUTPUT_FILE = OUTPUT_DIR / "aback_training.jsonl"

# Known concepts (must be checked in order - longer first)
KNOWN_CONCEPTS = [
    "Swing Screen",
    "X Quick Hit",
    "Shallow Cross",
    "Outside Zone",
    "Inside Zone",
    "Quick Hit",
    "Stick Fade",
    "Stick",
    "Smash",
    "Spacing",
    "Moses",
    "Glance",
    "Flood",
    "Fold",
    "Cross",
    "Power",
    "ISO",
    "Trey"
]

# A-Back concept descriptions (what the model should output)
CONCEPT_DESCRIPTIONS = {
    # Running concepts
    "Trey": "A-Back seals where pullers left if backside, follows as 3rd blocker if Divide, leads upfield to extend wall if playside",
    "Power": "A-Back is 2nd lead blocker after puller if playside, leads up hole if A-Divide, fills puller's gap if backside",
    "ISO": "A-Back finds the hole and hits first defender hard inside",
    "Inside Zone": "A-Back blocks backside End (under center)",
    "Outside Zone": "A-Back blocks backside End",
    "Fold": "A-Back blocks first defender outside if run, runs Shoot route if RPO or 2x2 pass, runs Comeback to middle if 3x1 pass",

    # Passing concepts
    "Smash": "No A-Back role in this concept",
    "Glance": "No A-Back role in this concept",
    "Shallow Cross": "No A-Back role in this concept",
    "Moses": "No A-Back role in this concept",
    "Cross": "No A-Back role in this concept",
    "Flood": "A-Back blocks D-end inside to secure edge for QB boot (SECURE tag)",
    "Quick Hit": "No A-Back role in this concept",
    "Swing Screen": "A-Back is lead blocker on swing route, blocks for Running Back",
    "Stick": "A-Back runs 5 Out if regular/I-Off, Angle Out if A-Bump, 10 Dig if outside-most, Stick route if A-Near",
    "Spacing": "A-Back runs Comeback route (depth varies by formation)",
    "X Quick Hit": "Quick Hit screen to X receiver (left outside receiver)"
}

def strip_bom(text: str) -> str:
    """Remove BOM character from string."""
    if text.startswith('\ufeff'):
        text = text[1:]
    return text.strip()

def extract_concept(formation_concept: str) -> tuple[str, str]:
    """
    Extract concept and play type from formation+concept string.
    Returns: (concept, play_type)
    """
    fc = strip_bom(formation_concept)

    # Detect play type first
    play_type = None
    if "RPO" in fc.upper():
        play_type = "rpo"
    elif "PASS 3X1" in fc.upper() or "PASS3X1" in fc.upper():
        play_type = "pass_3x1"
    elif "PASS 2X2" in fc.upper() or "PASS2X2" in fc.upper():
        play_type = "pass_2x2"
    elif "RUN" in fc.upper():
        play_type = "run"

    # Remove play type indicators for concept detection
    fc_clean = fc
    for suffix in [" RIGHT RUN", " LEFT RUN", " RUN", " RPO", " PASS 3X1", " PASS3X1", " PASS 2X2", " PASS2X2"]:
        fc_clean = fc_clean.replace(suffix, " ").replace(suffix.lower(), " ").replace(suffix.upper(), " ")

    # Remove Fade and Fix tags
    fc_clean = fc_clean.replace(" FADE", "").replace(" FIX", "").replace(" Fade", "").replace(" Fix", "")

    # Remove formation prefixes
    for prefix in ["LUZERN ", "ZUG ", "LUZERN", "ZUG"]:
        fc_clean = fc_clean.replace(prefix, " ", 1)

    fc_clean = " ".join(fc_clean.split())  # Normalize spaces

    # Check for known concepts (longer first)
    for concept in KNOWN_CONCEPTS:
        if concept.lower() in fc_clean.lower():
            return concept, play_type

    # If no match, return cleaned string as concept
    return fc_clean.strip(), play_type

def detect_aback_position(formation: str) -> str:
    """Detect A-Back position from formation string."""
    fc = strip_bom(formation).lower()

    if "a-near-bump" in fc or "a near bump" in fc:
        return "a_near_bump"
    if "a-near" in fc or "a near" in fc:
        return "a_near"
    if "a-bump" in fc or "a bump" in fc:
        return "a_bump"
    if "i-off" in fc or "i off" in fc:
        return "i_off"
    if "t-flip" in fc or "t flip" in fc:
        return "t_flip"
    if "t-wing" in fc or "t wing" in fc:
        return "t_wing"
    if "z-flip" in fc or "z flip" in fc:
        return "z_flip"
    if " i " in fc or fc.startswith("i ") or fc.endswith(" i"):
        return "i"

    return "regular"

def extract_formation(formation_concept: str, concept: str) -> str:
    """Extract formation name (remove concept and tags)."""
    fc = strip_bom(formation_concept)

    # Remove concept
    fc = fc.replace(concept, "")
    fc = fc.replace(concept.lower(), "")
    fc = fc.replace(concept.upper(), "")

    # Remove tags
    for tag in ["Fade", "Fix", "Right Run", "Left Run", "Run", "RPO", "Pass 3x1", "Pass 2x2"]:
        fc = fc.replace(tag, "").replace(tag.lower(), "")

    # Clean up
    fc = " ".join(fc.split())
    return fc if fc else "Unknown"

def parse_csv_file(csv_path: Path) -> List[Dict]:
    """Parse a single CSV file and return training examples."""
    examples = []

    with open(csv_path, 'r', encoding='utf-8-sig') as f:  # utf-8-sig handles BOM
        reader = csv.reader(f)
        for row in reader:
            if len(row) < 2:
                continue

            formation_concept = row[0].strip()
            route = row[1].strip() if len(row) > 1 else ""

            if not formation_concept or not route:
                continue

            # Extract components
            concept, play_type = extract_concept(formation_concept)
            position = detect_aback_position(formation_concept)
            formation = extract_formation(formation_concept, concept)

            # Get description
            description = CONCEPT_DESCRIPTIONS.get(concept, f"A-Back executes {concept}")

            example = {
                "formation": formation,
                "concept": concept,
                "position": position,
                "route": route,
            }

            if play_type:
                example["play_type"] = play_type

            # Include description as separate field for reference
            example["aback_role"] = description

            examples.append(example)

    return examples

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Find all concept CSV files
    csv_files = list(CSV_DIR.glob("*.csv"))
    # Exclude templates and old data files
    exclude_names = {"templates", "plays_extracted.json", "Playsheet"}
    csv_files = [f for f in csv_files
                 if f.parent.name != "templates"
                 and not any(excl in f.name for excl in exclude_names)]

    all_examples = []

    for csv_path in sorted(csv_files):
        print(f"Processing {csv_path.name}...")
        try:
            examples = parse_csv_file(csv_path)
            all_examples.extend(examples)
            print(f"  Found {len(examples)} examples")
        except Exception as e:
            print(f"  Error: {e}")

    # Write JSONL output
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        for ex in all_examples:
            f.write(json.dumps(ex, ensure_ascii=False) + '\n')

    print(f"\n{'='*50}")
    print(f"Total training examples: {len(all_examples)}")
    print(f"Output: {OUTPUT_FILE}")

    # Statistics
    concepts = {}
    positions = {}
    for ex in all_examples:
        c = ex["concept"]
        concepts[c] = concepts.get(c, 0) + 1
        p = ex["position"]
        positions[p] = positions.get(p, 0) + 1

    print(f"\n{'='*50}")
    print("Examples by concept:")
    for concept, count in sorted(concepts.items()):
        print(f"  {concept}: {count}")

    print(f"\n{'='*50}")
    print("Examples by A-Back position:")
    for pos, count in sorted(positions.items()):
        print(f"  {pos}: {count}")

    print(f"\n{'='*50}")
    print("Sample training entries:")
    for i, ex in enumerate(all_examples[:5]):
        print(f"\n--- Example {i+1} ---")
        print(json.dumps(ex, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
