// Position labels - how each position is labeled on play diagrams
const positionLabels = {
  'QB': ['QB', '1'],
  'RB': ['2', 'RB', 'Running Back', 'Tailback'],
  'FB': ['A', 'FB', 'Fullback', 'A-back'],
  'X': ['X', 'X-receiver', 'Split End', 'SE', 'WR'],
  'Y': ['Y', 'Y-receiver', 'Slot'],
  'Z': ['Z', 'Z-receiver', 'Flanker', 'FL'],
  'H': ['H', 'H-back', 'Wing', 'Sniffer', 'U'],
  'TE': ['T', 'TE', 'Tight End']
};

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

*** CRITICAL DISTINCTION - WHAT TO READ vs IGNORE ***

READ THIS (short labels, 1-5 words):
- Play name UNDER each diagram
- Page header concept

IGNORE THIS (long descriptions):
- Explanatory paragraphs
- Bullet points with notes
- Route descriptions in text

*** IMPORTANT: MODIFIERS vs FORMATIONS ***

Words like "Bump", "Bump Over", "Over", "Under" are MODIFIERS, NOT standalone plays.
- "Bump" by itself is NOT a play
- "Bump Over" by itself is NOT a play
- These words MODIFY a formation: "Zug Bump", "2x2 Bump Over", "I-Off Over"
- If the label is ONLY "Bump" or "Bump Over", look at the surrounding context or page header to find the base formation

ALWAYS extract the FULL name including modifiers:
- "Zug A-Bump" ✓ (correct)
- "Bump" alone ✗ (wrong - this is a modifier, not a formation)
- "2x2 Twin Bump Over" ✓ (correct)

YOUR TASK: For EACH diagram, extract:
1. col1 = Full play name from diagram label (e.g., "Zug A-Bump", "2x2 Twin")
2. col2 = Route from visual ARROW only (NEVER from text description)
3. col3 = Concept from page header (e.g., "Stick", "Glance", "Power")
4. col4 = Blocking description (if blocking, not route)

STEP 1 - FIND PLAY NAME (col1)
Look UNDER/BESIDE each diagram for a short label.
- Include ALL modifiers: "Zug A-Bump", "2x2 Bump Over", "I-Off Tight"
- If label is JUST a modifier like "Bump", look at page header or nearby diagrams for the base formation
- Drop year prefixes like "2026"
- Use this EXACT text for col1

STEP 2 - FIND PAGE CONCEPT (col3)
Look at page header for the concept word:
Stick, Glance, Cross, Mesh, Power, Zone, Trey, ISO, Smash, Sail, Boot, RPO
This is SAME for every row on the page

STEP 3 - FIND YOUR POSITION'S ARROW
Locate player: ${labels.join(' or ')}
Look at the ARROW drawn from that player
IGNORE any text describing what they do

STEP 4 - NAME THE ROUTE FROM ARROW SHAPE (col2) or BLOCKING (col4)

Route names - based ONLY on arrow shape:
- Straight UP = "Go"
- Up then angles INSIDE = "Post"
- Up then angles OUTSIDE = "Corner"
- Breaks OUT = "Out"
- Breaks IN = "In"
- Short to sideline = "Flat"
- DIAGONAL = "Slant"
- Up then STOP = "Hitch"
- 5yds up then OUT = "5 Out"
- 10yds up then IN = "10 Dig"
- Across field = "Cross"
- To flat then UP = "Wheel"

Blocking - when arrow goes INTO defender (no arrowhead):
- col2 = "" (empty)
- col4 = "Lead block" / "Pass protect" / "Kick out" / "Seal"

OUTPUT FORMAT (one row per diagram, DO NOT combine):
[
  {"col1": "Zug A-Bump", "col2": "Go", "col3": "Stick", "col4": ""},
  {"col1": "2x2 Twin", "col2": "5 Out", "col3": "Stick", "col4": ""},
  {"col1": "Power Trey", "col2": "", "col3": "Power", "col4": "Lead block"}
]

Return ONLY the JSON array. No explanations.`;
}
