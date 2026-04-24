#!/usr/bin/env python3
"""Convert extracted plays JSON to training JSONL format for dots.mocr"""

import json
import re
from pathlib import Path

# Input/output paths
INPUT_JSON = Path(r"C:\Users\anton\HudlScanner\for hudlscan\plays_extracted.json")
OUTPUT_JSONL = Path(r"C:\Users\anton\HudlScanner\training\plays_training.jsonl")

def extract_notes(text):
    """Extract notes from parentheses like (*Angle Out) or (+Bump)"""
    notes = []
    # Find content in parentheses
    for match in re.finditer(r'\(([^\)]+)\)', text):
        notes.append(match.group(1).strip())
    # Remove parentheses from text
    clean_text = re.sub(r'\s*\([^\)]+\)\s*', ' ', text).strip()
    return clean_text, ' '.join(notes) if notes else ''

def expand_formation(formation_text, route_text):
    """
    Expand formation field that may contain slashes.
    Returns list of (formation, route, notes) tuples.
    """
    formation_clean, notes = extract_notes(formation_text)

    # Split by slash - multiple formations share same route
    formations = [f.strip() for f in formation_clean.split('/')]

    results = []
    for formation in formations:
        formation = formation.strip()
        route = route_text.strip()
        if formation and route:
            results.append({
                "formation": formation,
                "route": route,
                "notes": notes
            })
    return results

def process_row(row_data):
    """Process a single row with 4 columns into training entries"""
    entries = []

    # Process col1 + col2 (first pair)
    if row_data.get("col1") and row_data.get("col2"):
        for entry in expand_formation(row_data["col1"], row_data["col2"]):
            entries.append(entry)

    # Process col3 + col4 (second pair)
    if row_data.get("col3") and row_data.get("col4"):
        for entry in expand_formation(row_data["col3"], row_data["col4"]):
            entries.append(entry)

    return entries

def main():
    # Load input JSON
    with open(INPUT_JSON, 'r', encoding='utf-8') as f:
        data = json.load(f)

    all_entries = []

    # Process each row
    for row_data in data:
        entries = process_row(row_data)
        all_entries.extend(entries)

    # Write JSONL (one JSON object per line)
    OUTPUT_JSONL.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_JSONL, 'w', encoding='utf-8') as f:
        for entry in all_entries:
            # Skip empty notes
            if not entry.get("notes"):
                entry.pop("notes", None)
            f.write(json.dumps(entry, ensure_ascii=False) + '\n')

    print(f"Converted {len(data)} rows into {len(all_entries)} training entries")
    print(f"Output: {OUTPUT_JSONL}")

    # Show sample entries
    print("\nSample entries:")
    for i, entry in enumerate(all_entries[:5]):
        print(f"  {i+1}. {entry}")

if __name__ == "__main__":
    main()
