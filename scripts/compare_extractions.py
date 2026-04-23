#!/usr/bin/env python3
"""
Compare extractions from Claude API vs local dots.mocr model.

Usage: python scripts/compare_extractions.py <test_images_dir> [position]
"""

import json
import sys
from pathlib import Path

import requests
import base64
import time


def encode_image(image_path: str) -> str:
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def extract_with_local(image_base64: str, position: str, server_url: str = "http://127.0.0.1:8000"):
    """Extract with local dots.mocr server."""
    prompt = f"Extract plays for position {position}. Return JSON array with col1, col2, col3."

    response = requests.post(
        f"{server_url}/v1/chat/completions",
        headers={"Content-Type": "application/json"},
        json={
            "model": "rednote-hilab/dots.mocr-svg",
            "messages": [{
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{image_base64}"}}
                ]
            }],
            "max_tokens": 4000
        },
        timeout=60
    )

    if response.status_code != 200:
        return None

    text = response.json().get("choices", [{}])[0].get("message", {}).get("content", "")

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Try to extract JSON
        start = text.find('[')
        if start != -1:
            end = text.rfind(']') + 1
            return json.loads(text[start:end])
        return None


def compare_plays(plays1, plays2):
    """Compare two lists of plays."""
    if not isinstance(plays1, list) or not isinstance(plays2, list):
        return None

    count1 = len(plays1)
    count2 = len(plays2)

    # Simple comparison: count and content similarity
    matches = 0
    for p1 in plays1:
        for p2 in plays2:
            if (p1.get("col1") == p2.get("col1") and
                p1.get("col2") == p2.get("col2") and
                p1.get("col3") == p2.get("col3")):
                matches += 1
                break

    return {
        "count1": count1,
        "count2": count2,
        "matches": matches,
        "accuracy": matches / max(count1, count2) if max(count1, count2) > 0 else 0
    }


def main():
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <test_images_dir> [position]", file=sys.stderr)
        sys.exit(1)

    images_dir = Path(sys.argv[1])
    position = sys.argv[2] if len(sys.argv) > 2 else "QB"

    results = []

    for image_file in sorted(images_dir.glob("*.png"))[:10]:  # Test first 10
        print(f"\nTesting: {image_file.name}", file=sys.stderr)

        image_base64 = encode_image(str(image_file))

        # Extract with local model
        local_plays = extract_with_local(image_base64, position)

        if local_plays:
            print(f"  Local: {len(local_plays)} plays", file=sys.stderr)

            # Load reference (Claude) if exists
            ref_file = image_file.parent / "reference" / f"{image_file.stem}.json"
            if ref_file.exists():
                with open(ref_file) as f:
                    ref_plays = json.load(f)

                comparison = compare_plays(ref_plays, local_plays)
                if comparison:
                    print(f"  Reference: {comparison['count1']} plays", file=sys.stderr)
                    print(f"  Matches: {comparison['matches']}/{comparison['count1']}", file=sys.stderr)
                    print(f"  Accuracy: {comparison['accuracy']:.1%}", file=sys.stderr)

                    results.append({
                        "image": image_file.name,
                        **comparison
                    })
            else:
                print(f"  No reference file for comparison", file=sys.stderr)
        else:
            print(f"  Local extraction failed", file=sys.stderr)

    # Summary
    if results:
        print(f"\n=== Summary ===", file=sys.stderr)
        avg_accuracy = sum(r["accuracy"] for r in results) / len(results)
        print(f"Images tested: {len(results)}", file=sys.stderr)
        print(f"Average accuracy: {avg_accuracy:.1%}", file=sys.stderr)


if __name__ == "__main__":
    main()
