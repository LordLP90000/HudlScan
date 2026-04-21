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

// Real routes from the playbook route tree
const ROUTES = [
  'Flat', 'Wheel', 'Angle', 'Tab', 'Flank', 'Stick', 'Shoot', 'Hitch',
  'Post', 'Corner', 'Seam', 'Out', 'In', '10 Dig', 'Shallow Cross',
  'delay Flank', 'Cross Flat', 'Go', 'Flare', 'Bubble', 'Swing',
  'Comeback', 'Deep Cross', 'Sit', 'Slant', '3-Step Slant', '1-Step Slant'
];

// OLine protections - NOT for skill positions
const OLINE_PROTECTIONS = ['Cup', 'Ray', 'Lou', 'Full Cup', 'Full Lou', 'Full Ray', 'Big-on-Big', 'Half-Slide'];

// Receiver distribution labels - NOT formations
const DISTRIBUTIONS = ['2x2', '3x1', 'Trips Side', 'Single Side', 'Field', 'Boundary', 'Field wide', 'Field slot', 'Boundary inside', 'Boundary outside'];

// Actual formations from the playbook
const BASE_FORMATIONS = ['ZUG', 'LUZERN'];

// Formation modifiers found in the playbook
const FORMATION_MODIFIERS = ['A-BUMP', 'A-NEAR-BUMP', 'T-WING', 'Z-FLIP', 'T-FLIP', 'I-OFF', 'A-SHORT-DIVIDE', 'A-DIVIDE'];

// Play concepts from the playbook
const CONCEPTS = [
  'POWER', 'ISO', 'SMASH', 'GLANCE', 'SPACING', 'TREY',
  'GLANCE ARROW', 'SPACING vs OVER', 'PASS GAME'
];

/**
 * Build the prompt for AI vision API to extract plays from playbook diagrams.
 * @param {string} position - e.g. 'QB', 'FB', 'X', etc.
 * @param {boolean} isPDF - whether the source was a PDF
 * @returns {string} The prompt text
 */
export function buildPrompt(position, isPDF = false) {
  const pos = position || 'QB';
  // @ts-ignore - positionLabels indexing
  const labels = positionLabels[pos] || [pos];

  return `You are analyzing a football playbook page with MULTIPLE play diagrams. Extract plays for position: ${pos}

POSITION LABEL TO FIND: ${labels.join(' or ')}

*** CRITICAL: col1 MUST BE THE EXACT FORMATION/PLAY NAME FROM THE DIAGRAM ***

Read the label UNDER or BESIDE each diagram. Write EXACTLY what is written.
- Remove year prefix "2026"
- Keep formation modifiers: "ZUG A-BUMP", "LUZERN T-WING", "ZUG I-OFF"
- Include directional modifiers: "POWER RIGHT", "ISO LEFT"
- Keep concept modifiers: "GLANCE ARROW vs OVER", "SPACING vs OVER"

*** NEVER PUT THESE IN col1 - THEY ARE NOT FORMATIONS ***

RECEIVER DISTRIBUTIONS (these describe receiver alignment, NOT the formation):
${DISTRIBUTIONS.join(', ')}

ROUTES (go in col2, NEVER col1):
${ROUTES.join(', ')}

OLINE PROTECTIONS (these are for OFFENSIVE LINE only, NOT ${pos}):
${OLINE_PROTECTIONS.join(', ')}

STEP 1 - FORMATION/PLAY (col1)
Read EXACT label from diagram:
- Base formations: ZUG, LUZERN
- With modifiers: ZUG A-BUMP, LUZERN T-WING, ZUG Z-FLIP, LUZERN I-OFF, etc.
- With divide: LUZERN A-DIVIDE, LUZERN A-SHORT-DIVIDE
- Remove "2026" prefix

STEP 2 - ROUTE (col2)
Look at the ARROW from ${labels.join(' or ')}.
${pos === 'FB' || pos === 'RB' ? `If blocking (no arrow): "Lead", "Seal", "Kick out", "Fill gap", "Pass pro", "2nd lead"` : ''}

STEP 3 - CONCEPT (col3)
Page header concept: ${CONCEPTS.join(', ')}

STEP 4 - BLOCKING (col4)
${pos === 'FB' || pos === 'RB' || pos === 'TE' ?
  `If blocking: Lead, Seal, Kick out, Fill gap, 2nd lead, Pass pro` :
  `${pos} does not block - leave blank`}

IGNORE OLine protections - these are NOT ${pos} responsibilities.

OUTPUT FORMAT:
[
  {"col1": "ZUG A-BUMP", "col2": "Hitch", "col3": "SMASH", "col4": ""},
  {"col1": "LUZERN T-WING POWER RIGHT", "col2": "Lead", "col3": "POWER", "col4": "Kick out"}
]

Return ONLY the JSON array. No explanations.`;
}
