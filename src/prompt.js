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
  'delay Flank', 'Cross Flat', 'Go', 'Flare', 'Bubble', 'Swing'
];

// OLine protections - NOT for skill positions
const OLINE_PROTECTIONS = ['Cup', 'Ray', 'Lou', 'Full Cup', 'Full Lou', 'Full Ray', 'Big-on-Big', 'Half-Slide'];

// Concepts - go in col3
const CONCEPTS = [
  'POWER', 'ISO', 'Counter', 'Zone', 'Gap', 'Duo', 'Draw', 'Sweep', 'Trap', 'Boot',
  'Moses', 'Cross', 'Smash', 'Stick', 'Glance', 'Spacing', 'Shallow Cross',
  'Follow Cup', 'Hitches Cup', 'Sail', 'Foot cup', 'Snag', 'Dust Cup', 'A Bluff',
  'Sail Lou', 'Mesh', 'Drive Lou', 'Pa Cup', 'Zug A Bump Moses'
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

*** CRITICAL: col1 MUST BE FORMATION NAME FROM THE DIAGRAM ***

Look at EACH diagram's label/title. Write EXACTLY what it says.
- If it says "Zug Bump" → col1: "Zug Bump"
- If it says "Lu I Off" → col1: "Lu I Off"
- If it says "POWER" → col1: "POWER"
- If it says "Moses" → col1: "Moses"

*** NEVER PUT ROUTES IN col1 - THESE ARE ROUTES ONLY ***
${ROUTES.join(', ')}

*** NEVER PUT OLINE PROTECTIONS IN col1 - THESE ARE FOR OFFENSIVE LINE ONLY ***
${OLINE_PROTECTIONS.join(', ')}

These protections are what the OLINE does, NOT ${pos}. Ignore them for ${pos} assignments.

STEP 1 - FORMATION/PLAY (col1)
Read the label UNDER or BESIDE each diagram. Use EXACTLY what is written.
- Include modifiers: "Zug Bump", "Lu I Off", "Side formation"
- Year prefixes like "2026" should be removed
- If the label is a protection (Cup, Ray, Lou), look at PAGE HEADER for actual play

STEP 2 - ROUTE (col2)
Look at the ARROW drawn from the ${labels.join(' or ')} player.
${pos === 'FB' || pos === 'RB' ? `If blocking (no arrow): "Lead", "Seal", "Kick out", "Fill gap", "Pass pro"` : ''}

Common ${pos} routes from the playbook:
${pos === 'FB' || pos === 'RB' ? 'Flat, Wheel, Angle, Flare, Bubble, Swing, Shoot' :
  pos === 'TE' ? 'Stick, Flat, Out, In, Corner, Seam' :
  pos.match(/^(X|Z|Y)$/) ? 'Go, Post, Corner, Out, In, Hitch, Fade, Comeback, Dig' :
  'Flat, Wheel, Angle, Stick, Shoot'}

STEP 3 - CONCEPT (col3)
Page header concept: ${CONCEPTS.join(', ')}

STEP 4 - BLOCKING (col4)
${pos === 'FB' || pos === 'RB' || pos === 'TE' ?
  `If ${pos} is blocking: Lead, Seal, Kick out, Fill gap, Pass pro` :
  `${pos} does not block - leave blank`}

IGNORE OLine protections (${OLINE_PROTECTIONS.join(', ')}) - these are NOT ${pos} responsibilities.

OUTPUT FORMAT:
[
  {"col1": "Zug Bump", "col2": "Hitch", "col3": "Zug A Bump Moses", "col4": ""},
  {"col1": "POWER", "col2": "Lead", "col3": "POWER", "col4": "Kick out"}
]

Return ONLY the JSON array. No explanations.`;
}
