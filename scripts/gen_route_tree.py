"""Regenerate src/lib/server/route-tree-data.js from static/route-tree.png.

Run from the repository root:
    python scripts/gen_route_tree.py
"""

import base64
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SOURCE_PNG = REPO_ROOT / "static" / "route-tree.png"
OUTPUT_JS = REPO_ROOT / "src" / "lib" / "server" / "route-tree-data.js"


def main() -> None:
    b64 = base64.b64encode(SOURCE_PNG.read_bytes()).decode()
    OUTPUT_JS.write_text(
        "// Auto-generated route tree image (base64 PNG).\n"
        "// Regenerate with: python scripts/gen_route_tree.py\n"
        f'export const routeTreeBase64 = "{b64}";\n',
        encoding="utf-8",
    )
    print(f"Wrote {OUTPUT_JS} ({len(b64)} chars)")


if __name__ == "__main__":
    main()
