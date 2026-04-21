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

*** DIAGRAM-BY-DIAGRAM EXTRACTION - NO LAZINESS ***

For EACH diagram individually:
1. Find position label (${labels.join(' or ')})
2. Trace the line/arrow from that position
3. Read the route/blocking that line shows
4. Read the formation text UNDER the diagram
5. Write what you see - move to next diagram

WARNING: Every diagram shows a DIFFERENT play. Do NOT repeat the same formation.
- Diagram 1: "ZUG A-BUMP SMASH"
- Diagram 2: "ZUG A-BUMP GLANCE"
- Diagram 3: "LUZERN A-NEAR-BUMP SPACING"
- These are THREE different formations - extract each one!

*** WHAT TO EXTRACT FOR col1 (Formation/Play) ***
- Base formation: ZUG or LUZERN
- Modifiers: A-BUMP, A-NEAR-BUMP, T-WING, I-OFF, Z-FLIP, T-FLIP, A-DIVIDE, A-SHORT-DIVIDE
- Play concept: SMASH, GLANCE, SPACING, TREY, MOSES, POWER, ISO, GLANCE ARROW, SHALLOW CROSS, INSIDE ZONE, OUTSIDE ZONE
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

OUTPUT (one JSON entry per diagram - no repeats):
[
  {"col1": "ZUG A-BUMP SMASH", "col2": "Hitch", "col3": "SMASH"},
  {"col1": "ZUG A-BUMP GLANCE", "col2": "Flat", "col3": "GLANCE"},
  {"col1": "LUZERN A-NEAR-BUMP SPACING", "col2": "Corner", "col3": "SPACING"}
]

Return ONLY the JSON array.`;
}
