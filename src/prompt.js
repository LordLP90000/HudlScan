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

  return `*** IMPORTANT: YOU ARE ANALYZING VISUAL DIAGRAMS ONLY ***
*** DO NOT READ ANY TEXT FROM THE PAGE ***
*** IGNORE ALL WORDS, LABELS, CAPTIONS, EXPLANATIONS ***

Your task: Look at the PLAY DIAGRAMS (drawn rectangles with arrows) and extract plays for position: ${pos}

STEP 1 - IGNORE ALL TEXT
DO NOT READ:
- Page headers
- Diagram labels/captions
- Explanatory text
- Formation names written as text
- Route descriptions written as text
- Any words anywhere on the page

ONLY LOOK AT:
- The drawn rectangles representing players
- The ARROWS drawn from each player
- The visual diagram itself

STEP 2 - FIND YOUR POSITION IN EACH DIAGRAM
Find the player labeled: ${labels.join(' or ')}
There will be MULTIPLE diagrams on this page. Look at EACH ONE SEPARATELY.

STEP 3 - READ THE ARROW SHAPE (NOT TEXT!)
For the ${pos} player in EACH diagram:
1. Look at the ARROW drawn from that player
2. What SHAPE does it make?
3. Where does it POINT?

STEP 4 - NAME WHAT YOU SEE (col2 = route, col4 = blocking)

Based ONLY on the ARROW SHAPE:
- Arrow goes STRAIGHT UP = "Go"
- Arrow goes UP then angles INSIDE = "Post"
- Arrow goes UP then angles OUTSIDE = "Corner"
- Arrow goes OUT to sideline = "Out"
- Arrow goes IN to middle = "In"
- Arrow goes SHORT to sideline area = "Flat"
- Arrow goes DIAGONAL = "Slant"
- Arrow goes UP then STOPS = "Hitch"
- Arrow goes 5 yards UP then OUT = "5 Out"
- Arrow goes 10 yards UP then IN = "10 Dig"
- Arrow goes ACROSS field = "Cross"
- Arrow goes toward FLAT then UP sideline = "Wheel"
- Arrow has NO arrowhead, goes into defender = BLOCKING

If BLOCKING:
- col2 = "" (empty)
- col4 = describe the block ("Lead", "Pass protect", "Kick out", "Seal")

If ROUTE:
- col2 = the route name from arrow shape
- col4 = "" (empty)

STEP 5 - FIND FORMATION (col1) - FROM DIAGRAM ONLY
Look at how players are ARRANGED in the diagram:
- 2 receivers left, 2 right = "2x2"
- 3 receivers one side = "Trips" or "3x1"
- Tight end on line = "Tight"
- Spread wide = "Spread"
- Describe the VISUAL formation, not text labels

STEP 6 - FIND CONCEPT (col3)
Look for the play CONCEPT in the page header. Common concepts:
Stick, Glance, Cross, Mesh, Power, Zone, Trey, ISO, Smash, Sail, Boot, RPO
Write the EXACT concept word from header.

OUTPUT - JSON ARRAY ONLY:
[
  {"col1": "formation from diagram layout", "col2": "route from arrow shape", "col3": "concept from header", "col4": "" or "blocking"},
  {"col1": "...", "col2": "...", "col3": "...", "col4": ""}
]

ONE ROW PER DIAGRAM. Do NOT combine diagrams.

Return ONLY JSON. No explanations.`;
}
