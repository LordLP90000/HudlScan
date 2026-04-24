#!/usr/bin/env python3
"""
Build A-Back/Fullback training data from concept CSV files.
Creates JSONL training data for fine-tuning dots.mocr model.

Each training example:
{
    "formation": "Luzern A-Near",
    "concept": "Power",
    "route": "Lead Block Rb",
    "description": "A-Back leads upfield to extend the wall"  # Optional explanation
}
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

# Concept rules for A-Back (used to generate descriptions)
CONCEPT_RULES = {
    "Trey": {
        "default": "A-Back leads upfield to extend the wall",
        "backside": "A-Back seals where pullers left",
        "divide": "A-Back follows as 3rd blocker"
    },
    "Power": {
        "default": "A-Back is 2nd lead blocker after puller",
        "playside": "A-Back leads upfield to extend the wall",
        "a_divide": "A-Back leads up the hole",
        "backside": "A-Back fills pulling Guard's gap"
    },
    "ISO": {
        "default": "A-Back finds the hole and hits first defender hard inside"
    },
    "Inside Zone": {
        "default": "A-Back blocks backside End (under center)"
    },
    "Fold": {
        "run": "A-Back goes outside, blocks first defender",
        "rpo": "A-Back runs Shoot route (shallow flat)",
        "pass_3x1": "A-Back runs Comeback to middle of field",
        "pass_2x2": "A-Back runs Shoot route (shallow flat)"
    },
    "Outside Zone": {
        "default": "A-Back blocks backside End (no read for QB)"
    },
    "Smash": {
        "default": "No A-Back role (RB runs Hitch middle)"
    },
    "Glance": {
        "default": "No A-Back role (RB runs Flat)"
    },
    "Shallow Cross": {
        "default": "No A-Back role (RB runs Swing)"
    },
    "Moses": {
        "default": "No A-Back role (RB in pass protection)"
    },
    "Cross": {
        "default": "No A-Back role (RB in pass protection)"
    },
    "Flood": {
        "default": "SECURE tag: A-Back blocks D-end to secure edge for QB boot"
    },
    "Quick Hit": {
        "default": "No A-Back role (RB stays in box)"
    },
    "Swing Screen": {
        "default": "A-Back is LEAD BLOCKER on swing route, blocks for RB"
    },
    "Stick": {
        "regular": "A-Back runs 5 Out route",
        "i_off": "A-Back runs 5 Out route",
        "a_bump": "A-Back runs Angle Out route",
        "outside_most": "A-Back runs 10 Dig route",
        "a_near": "A-Back runs Stick route"
    },
    "Spacing": {
        "default": "A-Back runs Comeback route (depth varies by formation)"
    }
}

# A-Back position patterns
POSITION_PATTERNS = {
    "a_near": ["A-Near", "A Near"],
    "a_bump": ["A-Bump", "A Bump"],
    "i_off": ["I-Off", "I Off", "I Off A"],
    "i": [" I "],
    "t_flip": ["T-Flip", "T Flip"],
    "t_wing": ["T-Wing", "T Wing"],
    "z_flip": ["Z-Flip", "Z Flip"],
    "zug_bump": ["Zug A-Bump", "Zug A Bump"],
    "zug": ["Zug"],
    "luzern": ["Luzern"]
}

PLAY_TYPE_PATTERNS = {
    "run": ["Run", "Right Run"],
    "rpo": ["RPO"],
    "pass_3x1": ["Pass 3x1", "Pass3x1"],
    "pass_2x2": ["Pass 2x2", "Pass2x2"]
}

def detect_aback_position(formation: str) -> str:
    """
    Detect A-Back position from formation string.
    Returns: 'regular', 'a_near', 'a_bump', 'i_off', 'i', 't_flip', 't_wing', 'z_flip', or 'unknown'
    """
    formation_lower = formation.lower()

    if "a-near" in formation_lower or "a near" in formation_lower:
        return "a_near"
    if "a-bump" in formation_lower or "a bump" in formation_lower:
        return "a_bump"
    if "i-off" in formation_lower or "i off" in formation_lower:
        return "i_off"
    if "t-flip" in formation_lower or "t flip" in formation_lower:
        return "t_flip"
    if "t-wing" in formation_lower or "t wing" in formation_lower:
        return "t_wing"
    if "z-flip" in formation_lower or "z flip" in formation_lower:
        return "z_flip"

    # Check for I formation (not I-Off)
    if " luzern i " in formation_lower or formation_lower.startswith("luzern i ") or " luzern i," in formation_lower:
        return "i"

    # Default to regular if no modifier found
    return "regular"

def detect_play_type(formation_concept: str) -> Optional[str]:
    """Detect play type (Run/RPO/Pass) from formation+concept string."""
    fc_lower = formation_concept.lower()

    for play_type, patterns in PLAY_TYPE_PATTERNS.items():
        for pattern in patterns:
            if pattern.lower() in fc_lower:
                return play_type
    return None

def extract_concept(formation_concept: str) -> str:
    """
    Extract concept name from formation+concept string.
    Examples:
    - "Luzern Power" -> "Power"
    - "Zug A-Near-Bump X Quick Hit Fix" -> "X Quick Hit"
    - "Luzern Fold Right Run" -> "Fold"
    - "Luzern Stick Fade" -> "Stick"
    """
    # Known concepts (longer first to avoid partial matches)
    concepts = [
        "X Quick Hit", "Quick Hit", "Swing Screen",
        "Shallow Cross", "Outside Zone", "Inside Zone",
        "Stick Fade"
    ]

    # Remove formation prefixes
    fc = formation_concept
    for prefix in ["Luzern ", "Zug ", "Luzern", "Zug"]:
        fc = fc.replace(prefix, "", 1)

    # Check for known concepts
    for concept in sorted(concepts, key=len, reverse=True):
        if concept.lower() in fc.lower():
            return concept

    # Check for play type suffixes and remove them
    for suffix in ["Right Run", "Left Run", " Run", " RPO", " Pass 3x1", " Pass 2x2", " Fade", " Fix"]:
        fc = fc.replace(suffix, "")

    # Remaining should be the concept
    return fc.strip()

def get_concept_rules(concept: str, position: str = "regular", play_type: Optional[str] = None) -> str:
    """Get A-Back rule description for a concept."""
    concept_key = concept
    # Normalize concept name
    if "Quick Hit" in concept:
        concept_key = "Quick Hit"
    elif "Swing Screen" in concept:
        concept_key = "Swing Screen"

    if concept_key not in CONCEPT_RULES:
        return f"A-Back executes {concept}"

    rules = CONCEPT_RULES[concept_key]

    # Handle special cases
    if concept_key == "Fold" and play_type:
        if play_type in rules:
            return rules[play_type]

    if concept_key == "Stick":
        # Stick rules depend on position
        if position == "a_bump":
            return rules["a_bump"]
        elif position == "a_near":
            return rules["a_near"]
        elif position == "outside_most":
            return rules["outside_most"]
        else:
            return rules["regular"]

    # Check for position-specific rules
    if position == "backside" and "backside" in rules:
        return rules["backside"]
    if position == "playside" and "playside" in rules:
        return rules["playside"]

    return rules.get("default", f"A-Back executes {concept}")

def parse_csv_file(csv_path: Path) -> List[Dict]:
    """Parse a single CSV file and return training examples."""
    examples = []

    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        for row in reader:
            if len(row) < 2:
                continue

            formation_concept = row[0].strip()
            route = row[1].strip() if len(row) > 1 else ""

            if not formation_concept or not route:
                continue

            # Extract components
            concept = extract_concept(formation_concept)
            position = detect_aback_position(formation_concept)
            play_type = detect_play_type(formation_concept)

            # Get formation name (remove concept and suffixes)
            formation = formation_concept
            for suffix in [f" {concept}", f" {concept} Fade", f" {concept} Fix", " Right Run", " Left Run",
                           " Run", " RPO", " Pass 3x1", " Pass 2x2", " Fix"]:
                formation = formation.replace(suffix, "")
            formation = formation.strip()

            example = {
                "formation": formation,
                "concept": concept,
                "position": position,
                "route": route,
                "play_type": play_type,
                "description": get_concept_rules(concept, position, play_type)
            }
            examples.append(example)

    return examples

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Find all concept CSV files (excluding templates and extracted data)
    csv_files = [
        "Power.csv", "ISO.csv", "Fold.csv",
        "Smash.csv", "Glance.csv", "Shallow Cross.csv",  # May not exist
        "Moses.csv", "Cross.csv", "Flood.csv",
        "X Quick Hit.csv", "Swing Screen.csv",
        "Stick.csv", "Spacing.csv"
    ]

    all_examples = []

    for csv_name in csv_files:
        csv_path = CSV_DIR / csv_name
        if not csv_path.exists():
            print(f"Skipping {csv_name} (not found)")
            continue

        print(f"Processing {csv_name}...")
        examples = parse_csv_file(csv_path)
        all_examples.extend(examples)
        print(f"  Found {len(examples)} examples")

    # Write JSONL output
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        for ex in all_examples:
            # Remove None values
            clean_ex = {k: v for k, v in ex.items() if v is not None}
            f.write(json.dumps(clean_ex, ensure_ascii=False) + '\n')

    print(f"\nTotal training examples: {len(all_examples)}")
    print(f"Output: {OUTPUT_FILE}")

    # Show statistics
    print("\n=== Statistics ===")
    concepts = {}
    for ex in all_examples:
        c = ex["concept"]
        concepts[c] = concepts.get(c, 0) + 1

    print("\nExamples by concept:")
    for concept, count in sorted(concepts.items()):
        print(f"  {concept}: {count}")

    print("\n=== Sample Training Entries ===")
    for i, ex in enumerate(all_examples[:3]):
        print(f"\nExample {i+1}:")
        print(json.dumps(ex, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
