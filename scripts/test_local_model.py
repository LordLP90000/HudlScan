#!/usr/bin/env python3
"""
Test script for local dots.mocr inference server.
Usage: python scripts/test_local_model.py <image_path> [position]
"""

import base64
import json
import sys
import time
from pathlib import Path

import requests


def encode_image_to_base64(image_path: str) -> str:
    """Convert image file to base64 string."""
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def extract_plays(image_base64: str, position: str = "QB", server_url: str = "http://127.0.0.1:8000"):
    """
    Call local dots.mocr server to extract plays from image.

    Args:
        image_base64: Base64-encoded image data
        position: Position to extract (QB, RB, FB, X, Y, Z, TE)
        server_url: URL of local inference server

    Returns:
        List of extracted play dictionaries
    """
    # Build prompt (simplified version - adjust as needed)
    prompt = f"""You are analyzing a football playbook page. Extract plays for position labeled: {position}

*** CRITICAL: COUNT ALL DIAGRAMS FIRST ***
STEP 1: Count how many play diagrams are on this page.
STEP 2: You MUST output exactly that many JSON entries.

*** OUTPUT FORMAT ***
Each entry must have:
- col1: Formation/Play name (e.g., "ZUG A-BUMP SMASH")
- col2: Route/blocking for {position} (e.g., "Hitch", "Flat", "Lead block")
- col3: Concept name (e.g., "SMASH", "GLANCE", "POWER")

Return ONLY a JSON array.
Example: [{"col1": "ZUG A-BUMP SMASH", "col2": "Hitch", "col3": "SMASH"}]"""

    start_time = time.time()

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
            "max_tokens": 4000,
            "temperature": 0
        },
        timeout=120
    )

    elapsed = time.time() - start_time

    if response.status_code != 200:
        print(f"Error: HTTP {response.status_code}", file=sys.stderr)
        print(response.text, file=sys.stderr)
        return []

    result = response.json()
    text_content = result.get("choices", [{}])[0].get("message", {}).get("content", "")

    # Parse JSON from response
    try:
        # Try direct parse
        plays = json.loads(text_content)
        if isinstance(plays, list):
            print(f"✓ Extracted {len(plays)} plays in {elapsed:.1f}s", file=sys.stderr)
            return plays
    except json.JSONDecodeError:
        pass

    # Try to extract JSON from text
    try:
        start = text_content.find('[')
        if start != -1:
            end = text_content.rfind(']') + 1
            plays = json.loads(text_content[start:end])
            if isinstance(plays, list):
                print(f"✓ Extracted {len(plays)} plays in {elapsed:.1f}s (extracted from text)", file=sys.stderr)
                return plays
    except json.JSONDecodeError:
        pass

    print(f"✗ Failed to parse response as JSON", file=sys.stderr)
    print(f"Raw response: {text_content[:500]}...", file=sys.stderr)
    return []


def main():
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <image_path> [position]", file=sys.stderr)
        print(f"  position: QB, RB, FB, X, Y, Z, or TE (default: QB)", file=sys.stderr)
        sys.exit(1)

    image_path = sys.argv[1]
    position = sys.argv[2] if len(sys.argv) > 2 else "QB"

    if not Path(image_path).exists():
        print(f"Error: Image not found: {image_path}", file=sys.stderr)
        sys.exit(1)

    # Check server is running
    try:
        requests.get("http://127.0.0.1:8000/health", timeout=5)
    except requests.exceptions.RequestException:
        print("Error: Local inference server not reachable at http://127.0.0.1:8000", file=sys.stderr)
        print("Start the server with: cd docker && docker-compose up -d", file=sys.stderr)
        sys.exit(1)

    image_base64 = encode_image_to_base64(image_path)
    plays = extract_plays(image_base64, position)

    print(json.dumps(plays, indent=2))


if __name__ == "__main__":
    main()
