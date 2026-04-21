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

  return `Extract plays for position: ${pos} from this playbook page.

POSITION LABEL: ${labels.join(' or ')}

CRITICAL: Each diagram is UNIQUE. Read EVERY diagram separately.

For EACH diagram on the page:
1. Find the formation name written UNDER or BESIDE it
2. Find the route (arrow) for ${labels.join(' or ')}
3. Find the play concept (SMASH, GLANCE, POWER, ISO, etc.)

FORMATION RULES:
- MUST start with ZUG or LUZERN
- Include modifiers: A-BUMP, T-WING, I-OFF, Z-FLIP, etc.
- Include play concept if written: "ZUG A-BUMP SMASH" not just "ZUG A-BUMP"
- Remove "2026" prefix

ROUTE RULES - ONLY use these routes from the playbook:
Flat, Wheel, Angle, Tab, Flank, Stick, Shoot, Hitch, Post, Corner, Seam, Out, In, 10 Dig, Shallow Cross, Go, Flare, Bubble, Swing, Comeback, Deep Cross, Sit, Slant
DO NOT make up route names like "mesh", "slot fade", etc.

OUTPUT - Each diagram gets one entry:
[
  {"col1": "ZUG A-BUMP SMASH vs OVER", "col2": "Hitch", "col3": "SMASH"},
  {"col1": "ZUG A-BUMP GLANCE vs OVER", "col2": "Corner", "col3": "GLANCE"},
  {"col1": "ZUG A-BUMP SPACING vs OVER", "col2": "Slant", "col3": "SPACING"},
  {"col1": "LUZERN T-WING POWER RIGHT", "col2": "Flat", "col3": "POWER"}
]

NOTE: If you see 6 diagrams, output 6 DIFFERENT entries with 6 DIFFERENT play concepts.
Do NOT repeat the same formation name!

Return ONLY the JSON array.`;
}
