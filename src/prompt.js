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

*** VISUAL OBSERVATION PROCESS - DO THIS FOR EACH DIAGRAM ***

For EVERY diagram on the page:
1. Look for the position label (${labels.join(' or ')}) in the diagram
2. Trace the arrow/line coming from that position
3. Read what that arrow/line shows (route or blocking)
4. Read the formation name written UNDER or BESIDE the diagram
5. Move to the next diagram and repeat

*** CRITICAL: EACH DIAGRAM IS DIFFERENT ***
- Diagram 1 might show "A" running a Hitch route
- Diagram 2 might show "A" blocking inside
- Diagram 3 might show "A" running a Flat route
- Extract EXACTLY what each diagram shows - NO patterns, NO assumptions!

*** VALID ROUTES (use ONLY these) ***
Flat, Wheel, Angle, Tab, Flank, Stick, Shoot, Hitch, Post, Corner, Seam, Out, In, 10 Dig, Shallow Cross, Go, Flare, Bubble, Swing, Comeback, Deep Cross, Sit, Slant

If the arrow shows something NOT in this list, describe it exactly. DO NOT make up names.

*** FORMATION NAMES ***
- Must start with ZUG or LUZERN
- Include modifiers: A-BUMP, A-NEAR-BUMP, T-WING, I-OFF, Z-FLIP, T-FLIP, A-DIVIDE, A-SHORT-DIVIDE
- Include the play concept if written on diagram: "ZUG A-BUMP SMASH" not just "ZUG A-BUMP"
- Remove "2026" prefix

OUTPUT FORMAT (one entry per diagram):
[
  {"col1": "formation from diagram 1", "col2": "route/blocking from diagram 1", "col3": "concept from diagram 1"},
  {"col1": "formation from diagram 2", "col2": "route/blocking from diagram 2", "col3": "concept from diagram 2"},
  {"col1": "formation from diagram 3", "col2": "route/blocking from diagram 3", "col3": "concept from diagram 3"}
]

Return ONLY the JSON array.`;
}
