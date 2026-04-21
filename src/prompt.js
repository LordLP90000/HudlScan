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

*** CRITICAL: col1 MUST BE A FORMATION/PLAY NAME ***

col1 = Formation/Play name ONLY. These are actual formations with players arranged in specific positions:
Zug, Luzern, I-Off, 2x2, 3x1, Trips, Twins, Trey, Power, Zone, ISO, Gap, Duo, Counter, Draw, Sweep, Trap, Boot

*** NEVER PUT THESE IN col1 (THESE ARE ROUTES/BLOCKING/PROTECTIONS, NOT FORMATIONS) ***

ROUTES (go in col2, NEVER col1):
Go, Post, Corner, Out, In, Flat, Slant, Hitch, Stick, Wheel, Comeback, Seam, Cross, Dig, Curl, Arrow, Shoot, Shallow, Fade

PROTECTION SCHEMES (OLINE protections, NOT routes or formations):
Cup, Ray, Lou, Full Cup, Full Lou, Big-on-Big
These are what the OFFENSIVE LINE does, NOT ${pos}. Ignore these for ${pos} assignments.

MODIFIERS (must be combined with a formation, NEVER alone):
If you see ONLY a modifier word like "Bump", "Over", "Under", "Tight", "Slot" - you MUST find the base formation from the PAGE HEADER or NEARBY DIAGRAMS.
- Do NOT just write "Bump" alone
- Do NOT just write "Bump-Over" as a lazy shortcut
- FIND the actual formation: "Zug Bump", "2x2 Over", "I-Off Tight", etc.

If the label under a diagram is ONLY a route/modifier/protection word from the lists above, look at the PAGE HEADER or surrounding diagrams to find the ACTUAL formation name.

EXAMPLES OF CORRECT vs WRONG:
✓ col1: "Zug Bump", col2: "Go" (correct - formation with modifier)
✓ col1: "Power Trey", col2: "Lead block" (correct - formation name)
✓ col1: "I-Off Tight", col2: "Flat" (correct - formation name)
✗ col1: "Shoot", col2: "Go" (WRONG - Shoot is a route)
✗ col1: "Wheel", col2: "Flat" (WRONG - Wheel is a route)
✗ col1: "Cup", col2: "Pass protect" (WRONG - Cup is a protection)
✗ col1: "Bump", col2: "Go" (WRONG - Bump is a modifier, not a formation)

STEP 1 - FIND THE FORMATION NAME (col1)
Look UNDER/BESIDE each diagram. Find the ACTUAL formation name.
- Include modifiers WITH the formation: "Zug Bump", "2x2 Bump Over", "I-Off Over"
- If label is ONLY a route/protection/modifier, use the page header concept as the formation
- Drop year prefixes like "2026"

STEP 2 - FIND THE ROUTE FROM THE ARROW (col2)
Look at the ARROW drawn from the ${labels.join(' or ')} player.
- Go = straight up
- Post = up then angles inside
- Corner = up then angles outside
- Out = breaks toward sideline
- In = breaks toward middle
- Flat = short to sideline
- Slant = diagonal
- Hitch = up then stop
- Stick = short hitch
- 5 Out = 5yds up then out
- 10 Dig = 10yds up then in
- Cross = across field
- Wheel = to flat then up
- Comeback = up then back
- Seam = vertical seam
- Shoot = sprint to flat
- Fade = fade to sideline

STEP 3 - FIND THE CONCEPT (col3)
Page header concept: Stick, Glance, Cross, Mesh, Power, Zone, Trey, ISO, Smash, Sail, Boot, RPO

STEP 4 - BLOCKING (col4, if ${pos} is blocking)
${pos} blocking assignments (these are what ${pos} actually does):
- "Lead block" - leading through a hole
- "Pass protect" - staying in to block
- "Kick out" - blocking defender outward
- "Seal" - sealing the edge
- "Fill gap" - filling a pulling gap

IGNORE OLine protections (Cup, Ray, Lou, etc.) - these are NOT ${pos} responsibilities.

OUTPUT FORMAT:
[
  {"col1": "Zug Bump", "col2": "Go", "col3": "Stick", "col4": ""},
  {"col1": "Power Trey", "col2": "", "col3": "Power", "col4": "Lead block"}
]

Return ONLY the JSON array. No explanations.`;
}
