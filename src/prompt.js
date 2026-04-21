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

  return `You are analyzing a football playbook page with multiple play diagrams. Extract plays for position: ${pos}

POSITION LABELS TO FIND: ${labels.join(', ')}

CRITICAL INSTRUCTIONS - READ CAREFULLY:

1) LOOK AT EACH DIAGRAM SEPARATELY
   - Count each distinct play diagram on the page
   - Each diagram shows a play with its own formation name
   - Do NOT combine diagrams that look similar - extract each one

2) IDENTIFY THE FORMATION NAME (col1)
   - Look at the text label above, below, or inside each diagram
   - This is the formation/play name (e.g., "Zug A-Bump", "2x2 Twin", "I-Off Tight")
   - Drop year prefixes like "2026" or "25"
   - Write the EXACT formation name you see in the diagram

3) FIND YOUR POSITION'S ARROW IN EACH DIAGRAM
   - Locate the player labeled ${labels.join(' or ')}
   - TRACE THEIR ARROW with your eyes - what shape does it make?
   - IGNORE text descriptions - only read the visual arrow

4) DETERMINE IF IT'S A ROUTE OR BLOCKING
   - ROUTE: Arrow points to open space with arrowhead
   - BLOCKING: Line goes into a defender or has no arrowhead

5) NAME THE ROUTE (col2) or BLOCKING (col4)

   ROUTE NAMES (use ONLY these):
   - Go = straight vertical arrow
   - Post = up then angles inside
   - Corner = up then angles outside
   - Out = breaks toward sideline
   - In = breaks toward middle
   - Flat = short route to sideline area
   - Slant = diagonal short route
   - Hitch = short stop-and-comeback
   - Stick = short 5yd hitch
   - 5 Out = 5yds up then OUT
   - 10 Dig = 10yds up then IN
   - Shallow Cross = across field shallow
   - Cross = crossing route
   - Wheel = toward flat then up sideline
   - Arrow = short angled route
   - Shoot = sprint to flat
   - Describe exactly what you SEE in the diagram

   BLOCKING descriptions:
   - "Pass protect" = staying in to block
   - "Lead block" = leading through hole
   - "Kick out" = blocking defender outward
   - "Seal" = sealing edge
   - Describe exactly what the blocking line shows

6) FIND THE CONCEPT NAME (col3)
   - Look at page header (top of page)
   - Concept is usually last word: STICK, GLANCE, CROSS, POWER, ZONE, etc.
   - This is SAME for every row on page
   - NEVER write "Multiple" or "Various" - write the actual concept word

OUTPUT FORMAT - Return ONLY JSON:
[
  {"col1": "formation name from diagram", "col2": "route from arrow", "col3": "concept from header", "col4": "" or "blocking description"}
]

Example - if you see 3 diagrams:
[
  {"col1": "Zug A-Bump", "col2": "Go", "col3": "Stick", "col4": ""},
  {"col1": "2x2 Twin", "col2": "5 Out", "col3": "Stick", "col4": ""},
  {"col1": "Power", "col2": "", "col3": "Power", "col4": "Lead block"}
]

Return ONLY the JSON array. No explanations.`;
}
