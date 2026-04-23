#!/usr/bin/env python3
"""
Create training dataset from verified playbook extractions.
Bootstraps training data from your existing Claude API extractions.

Usage: python scripts/create_training_dataset.py <images_dir> <extractions_dir>
"""

import json
import sys
from pathlib import Path


def create_dataset(images_dir: Path, extractions_dir: Path, output_file: Path):
    """
    Create training dataset from images and verified extractions.

    Args:
        images_dir: Directory containing playbook images
        extractions_dir: Directory containing JSON extractions (same filenames)
        output_file: Output JSONL file for training
    """
    images_dir = Path(images_dir)
    extractions_dir = Path(extractions_dir)

    if not images_dir.exists():
        print(f"Error: Images directory not found: {images_dir}", file=sys.stderr)
        sys.exit(1)

    if not extractions_dir.exists():
        print(f"Error: Extractions directory not found: {extractions_dir}", file=sys.stderr)
        sys.exit(1)

    dataset = []
    matched = 0
    missing = 0

    print(f"Scanning {images_dir}...", file=sys.stderr)

    for image_file in images_dir.glob("*.png"):
        json_file = extractions_dir / f"{image_file.stem}.json"

        if json_file.exists():
            try:
                with open(json_file) as f:
                    plays = json.load(f)

                if isinstance(plays, list) and len(plays) > 0:
                    dataset.append({
                        "image": str(image_file.absolute()),
                        "plays": plays
                    })
                    matched += 1
                else:
                    print(f"Warning: Empty or invalid JSON in {json_file}", file=sys.stderr)
            except json.JSONDecodeError as e:
                print(f"Warning: Invalid JSON in {json_file}: {e}", file=sys.stderr)
        else:
            missing += 1

    # Write as JSONL
    with open(output_file, "w") as f:
        for item in dataset:
            f.write(json.dumps(item) + "\n")

    print(f"\nDataset created: {output_file}", file=sys.stderr)
    print(f"  Matched pairs: {matched}", file=sys.stderr)
    print(f"  Missing extractions: {missing}", file=sys.stderr)

    if matched < 50:
        print(f"\n⚠ Warning: Only {matched} training examples. Recommend 50-100 for best results.", file=sys.stderr)


def main():
    if len(sys.argv) < 3:
        print(f"Usage: {sys.argv[0]} <images_dir> <extractions_dir> [output_file]", file=sys.stderr)
        sys.exit(1)

    images_dir = Path(sys.argv[1])
    extractions_dir = Path(sys.argv[2])
    output_file = Path(sys.argv[3]) if len(sys.argv) > 3 else Path("training_data.jsonl")

    create_dataset(images_dir, extractions_dir, output_file)


if __name__ == "__main__":
    main()
