// Position labels - how each position is labeled on play diagrams
const positionLabels = {
  'QB': ['QB', '1'],
  'RB': ['2', 'RB', 'Running Back', '2-back'],
  'FB': ['A', 'FB', 'Fullback', 'A-back'],
  'X': ['X', '#1', '1', 'Wide', 'Split End', 'SE', 'WR'],
  'Y': ['Y', '#2', '2', 'Slot', 'Inside Slot'],
  'Z': ['Z', '#1', 'Flanker', 'Boundary'],
  'TE': ['T', 'TE', 'Tight End']
};

// Real routes from the playbook route tree (exported for reference)
export const ROUTES = [
  'Flat', 'Wheel', 'Angle', 'Tab', 'Flank', 'Stick', 'Shoot', 'Hitch',
  'Post', 'Corner', 'Seam', 'Out', 'In', '10 Dig', 'Shallow Cross',
  'delay Flank', 'Cross Flat', 'Go', 'Flare', 'Bubble', 'Swing',
  'Comeback', 'Deep Cross', 'Sit', 'Slant', '3-Step Slant', '1-Step Slant'
];

// OLine protections - NOT for skill positions (exported for reference)
export const OLINE_PROTECTIONS = ['Cup', 'Ray', 'Lou', 'Full Cup', 'Full Lou', 'Full Ray', 'Big-on-Big', 'Half-Slide'];

// Receiver distribution labels - NOT formations (exported for reference)
export const DISTRIBUTIONS = ['2x2', '3x1', 'Trips Side', 'Single Side', 'Field', 'Boundary', 'Field wide', 'Field slot', 'Boundary inside', 'Boundary outside'];

// Actual formations from the playbook
export const BASE_FORMATIONS = ['ZUG', 'LUZERN'];

// Formation modifiers found in the playbook
export const FORMATION_MODIFIERS = ['A-BUMP', 'A-NEAR-BUMP', 'T-WING', 'Z-FLIP', 'T-FLIP', 'I-OFF', 'A-SHORT-DIVIDE', 'A-DIVIDE'];

// Play concepts from the playbook (exported for reference)
export const CONCEPTS = [
  'POWER', 'ISO', 'SMASH', 'GLANCE', 'SPACING', 'TREY', 'MOSES',
  'GLANCE ARROW', 'SPACING vs OVER', 'SHALLOW CROSS', 'PASS GAME',
  'INSIDE ZONE', 'OUTSIDE ZONE'
];

/**
 * Build the prompt for AI vision API to extract plays from playbook diagrams.
 * @param {string} position - e.g. 'QB', 'FB', 'X', etc.
 * @returns {string} The prompt text
 */
export function buildPrompt(position) {
  const pos = position || 'QB';
  // @ts-expect-error - positionLabels indexing
  const labels = positionLabels[pos] || [pos];

  return `You are analyzing a football playbook page. Extract plays for position labeled: ${labels.join(' or ')}

*** IGNORE THE ROUTE TREE IMAGE ***
The FIRST image you see is a route tree legend REFERENCE only. DO NOT extract it.
Only extract plays from the SECOND image (the actual playbook page).

*** CRITICAL: COUNT ALL DIAGRAMS FIRST ***
STEP 1: Count how many play diagrams are on this page. Look at the entire page and count EVERY diagram box.
STEP 2: You MUST output exactly that many JSON entries. No exceptions. No skipping.

If you see 20 diagrams, output 20 entries. If you see 50 diagrams, output 50 entries.

*** FOR EACH DIAGRAM - WORK SYSTEMATICALLY ***
Start at top-left, go row by row, left to right:
1. Find the diagram
2. SEARCH THOROUGHLY for position label (${labels.join(' or ')}) - it's ALWAYS there, look carefully
3. Trace the line/arrow from that position ONLY - ignore other positions' routes
4. Read the route/blocking for YOUR position only
5. Read formation text UNDER the diagram
6. Write JSON entry
7. Move to NEXT diagram

DO NOT STOP early. DO NOT skip diagrams. DO NOT group diagrams together.

*** CRITICAL: ONLY EXTRACT YOUR POSITION'S ROUTE ***
If looking for FB (A), ignore what QB (1), RB (2), X, Y, Z are doing.
Only trace the arrow from the A/FB label.
If you cannot find the label after thorough search, write "No route found" in col2 - but still output the entry!

*** WHAT TO EXTRACT FOR col1 (Formation/Play) ***
- Base formation: ZUG or LUZERN
- Modifiers: A-BUMP, A-NEAR-BUMP, T-WING, I-OFF, Z-FLIP, T-FLIP, A-DIVIDE, A-SHORT-DIVIDE
- Play concept: SMASH, GLANCE, SPACING, TREY, MOSES, POWER, ISO, GLANCE ARROW, SHALLOW CROSS, INSIDE ZONE, OUTSIDE ZONE
- ALWAYS remove "2026" prefix if present
- Example: "2026 ZUG A-BUMP SMASH" → "ZUG A-BUMP SMASH"
- Example: "ZUG A-BUMP SMASH" or "LUZERN I-OFF TREY"

*** NEVER EXTRACT THESE AS FORMATIONS ***
- Receiver distributions: 2x2, 3x1, Trips Side, Single Side, Field, Boundary
- Protection calls: LOU, RAY, Cup, Full Cup, Full Lou, Full Ray, Big-on-Big, Half-Slide
- Position labels alone: "A", "2", "X", "Y", "Z", "T"
- Empty or partial: "Formation", "Bump-over", just "ZUG"

*** ROUTES - col2 (extract EXACTLY what arrow shows) ***
Flat, Wheel, Angle, Tab, Flank, Stick, Shoot, Hitch, Post, Corner, Seam, Out, In, 10 Dig, Shallow Cross, Go, Flare, Bubble, Swing, Comeback, Deep Cross, Sit, Slant

If not a route, describe the blocking exactly. NO made-up blocking terms.

*** col3 (Concept) ***
Extract the play concept written on/near the diagram: SMASH, GLANCE, SPACING, TREY, MOSES, POWER, ISO, etc.

OUTPUT FORMAT:
- ONE JSON entry per diagram on the page
- If 40 diagrams → 40 JSON entries
- If 6 diagrams → 6 JSON entries
- NO repeats, NO omissions
- If position label not found after thorough search: col2 = "No route found"

Example (if page has 4 diagrams):
[
  {"col1": "ZUG A-BUMP SMASH", "col2": "Hitch", "col3": "SMASH"},
  {"col1": "ZUG A-BUMP GLANCE", "col2": "Flat", "col3": "GLANCE"},
  {"col1": "LUZERN A-NEAR-BUMP SPACING", "col2": "Corner", "col3": "SPACING"},
  {"col1": "ZUG T-WING POWER", "col2": "Lead", "col3": "POWER"}
]

Return ONLY the JSON array. Count = number of diagrams on page.`;
}
