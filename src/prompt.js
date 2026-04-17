// Position aliases map
const positionAliases = {
  'QB': 'QB (Quarterback)',
  'RB': '2, RB, Running Back, Tailback, the player labeled 2',
  'FB': 'A, FB, Fullback, A-back, the player labeled A',
  'X': 'X, X-receiver, Split End, SE, WR',
  'Y': 'Y, Y-receiver, Slot',
  'Z': 'Z, Z-receiver, Flanker, FL',
  'H': 'H, H-back, Wing, Sniffer, U',
  'TE': 'T, TE, Tight End, the player labeled T',
  'OL': 'OL, Offensive Line, Line',
  'C': 'C, Center',
  'OT': 'OT, Tackle, Offensive Tackle, LT, RT',
  'OG': 'OG, Guard, Offensive Guard, LG, RG'
};

// Full A-back known playsheet
const fbRouteMap = `
=== COMPLETE A-BACK REFERENCE PLAYSHEET ===
IMPORTANT: The A-back's route/assignment changes based on the FORMATION, even within the same concept.
Use this reference when you recognize a concept+formation combination. The format is:
  Play/Formation → A-back assignment

PASS CONCEPTS — A-back runs a ROUTE (col2 = route, col4 = ""):
  Cross → Delayed Out
  Cross (A-Near / Zug Z-Flip formations) → Cross
  Cross (Zug A-Bump formation) → Go
  Cross (Lu I Off A Cross) → Through Gap Cross
  Boot L Flood → behind OL to Flat
  Fold 3x1 / Spacing → Tab
  2x2 / RPO → Shoot
  Glance (Arrow modifier) → Wheel
  Glance (A Near / Z Flip formations) → delay Flat
  Glance (Zug A Bump formation) → Slant
  Shallow Cross → Shallow Cross
  Smash / Right Flood → Corner
  Stick (default) → delay 5 Out
  Stick (A Near / +Bump formation) → Stick
  Stick (*Bump / I Off / ZG formations) → 5 Out (*Angle Out)
  Stick (Zug A Bump formation) → 10 Dig
  Zug (generic) → 5 Out
  Zug A Bump (in Hitch-type concept) → Hitch
  Zug A Bump (in Go-type concept) → Go

PASS CONCEPTS — A-back BLOCKS (col2 = "", col4 = blocking description):
  A Secure → Block with RT

RUN PLAYS — A-back BLOCKS (col2 = "", col4 = blocking description):
  Power / Trey → Fill the Pulling Gap
  Power A div → Lead Block the Gap
  Power PS → 2nd lead Block
  Trey Div → follow as 3rd Block
  Trey PS → Lead block Rb
  Run → Out Block first color
  ISO → Find PS Hole and Kill
  Inside / Out Zone → Block BS End
  Inside Zone → Block an area
  Zug O Zone Bump → Just Something
  T-Jet Sweep → Block End
  Z-Jet Sweep → Leadblock Z
  Trap → Block PS End
  I (Off) A Trap → Wait on LG, A Power
  Swing Screen → Lead block Rb

SPECIAL — A-back receives the ball:
  A Bump Short Jet → Handoff Bubble

KEY INSIGHT: Within the SAME concept page, different formations produce DIFFERENT routes for the A-back.
Example on a STICK concept page:
  - One diagram might show delay 5 Out
  - Another might show Stick
  - Another might show 5 Out (*Angle Out)
  - Another might show 10 Dig
Do NOT assign the same route to every diagram on the page. Read each formation individually.
=== END REFERENCE ===`;

/**
 * Build the full prompt for Moonshot vision API.
 * @param {string} position - e.g. 'QB', 'FB', 'X', etc.
 * @param {boolean} isPDF - whether the source was a PDF
 * @returns {string} The prompt text
 */
export function buildPrompt(position, isPDF = false) {
  const pos = position || 'QB';
  const aliases = positionAliases[pos] || pos;
  const routeReference = (pos === 'FB') ? fbRouteMap : '';

  return `You are analyzing a football playbook ${isPDF ? 'PDF' : 'image'}. There are likely MULTIPLE play diagrams shown on this page.

I play the ${pos} position. In these playbook diagrams, my position is labeled as: ${aliases}.

CRITICAL RULE #1: The page has a CONCEPT NAME in the header (e.g. "STICK", "GLANCE", "MESH", "CROSS", "POWER"). This is NOT the route! The concept is the overall play design. Each player runs a DIFFERENT route within that concept. You must read the actual arrows to determine each player's individual route.

CRITICAL RULE #2 — col3 MUST be the ACTUAL CONCEPT name. NEVER write "MULTIPLE PLAYS", "VARIOUS", "RUN PLAY", or any description.
IMPORTANT — how to parse play titles/headers:
A play title like "2026 LUZERN A-BUMP GLANCE" breaks down as:
  - "2026" = year (drop this)
  - "LUZERN" = FORMATION (this goes in col1, NOT col3)
  - "A-BUMP" = FORMATION VARIANT (this goes in col1)
  - "GLANCE" = CONCEPT (this goes in col3)

TERMINOLOGY YOU MUST KNOW:
- FORMATIONS (go in col1): Luzern, Zug, I-Off, A-Near, A-Bump, Z-Flip, T-Wing, 3x1, 2x2, Trips, Twins, etc.
- PROTECTION SCHEMES (NOT concepts): Ray, Lou, Cup — these are OLine protection calls. They may appear in the play name but they are NOT the concept. If a play is "STICK LOU", the concept is "STICK", not "LOU".
- CONCEPTS (go in col3): Stick, Glance, Cross, Mesh, Power, Trey, Zone, ISO, Smash, Sail, Flood, Shallow Cross, Boot, Trap, Sweep, Snag, Drive, Moses, Follow, Hitches, Pa, etc.

So for header "2026 ZUG A-BUMP GLANCE":
  col1 = "ZUG A-BUMP" (formation — drop only "2026")
  col3 = "GLANCE" (concept — the LAST football term that is a play concept)

CRITICAL RULE #3 — BLOCKING vs ROUTE DETECTION:
A player is BLOCKING if:
- Their line goes INTO a defender symbol (circle/square), not to an open space on the field
- Their line is very short and stays near the line of scrimmage hitting a defender
- They have a blocking notation (like "kick out", "lead", "pass pro", "seal", "base block")
- On RUN plays: linemen, fullbacks, tight ends often block — look for lines crashing into defenders
- There is NO arrow/arrowhead at the end of their line (just a line into a body)

A player is RUNNING A ROUTE if:
- Their line has an ARROW pointing to open space on the field (not into a defender)
- The arrow travels away from the line of scrimmage to a receiving area
- The path curves, breaks, or extends downfield

When the player BLOCKS:
- col2 = "" (empty string — no route)
- col4 = Description of block (e.g. "Pass protect", "Lead block on LB", "Kick out DE", "Seal edge", "Check release")

When the player RUNS A ROUTE:
- col2 = The specific route name
- col4 = "" (empty string — no blocking)

ROUTE VOCABULARY — these are the ONLY valid route names to use:
Post, Corner, Seam, Out, In, Flat, Wheel, Angle, Tab, Flank, Stick, Shoot, Hitch, 10 Dig, Shallow Cross, 5 Out, Go, Cross, Drag, Curl/Comeback, Arrow, Shallow Flat, Cross Flat, delay Flank, delay 5 Out, Delayed Out, delay Flat, Slant, Through Gap Cross
You can add modifiers: "delay" (hesitation before running), numbers (depth like "5" or "10"), or alternate in parentheses like "5 Out (*Angle Out)".
For blocking assignments, describe the block (e.g. "Fill the Pulling Gap", "Lead Block the Gap", "Block BS End", "Block with RT", "Leadblock Z").
${routeReference}

STEP 1 — PARSE THE PAGE HEADER:
- The page header contains: [year] [formation] [concept] (e.g. "2026 LUZERN A-BUMP GLANCE")
- The CONCEPT is typically the LAST word/term in the header (GLANCE, STICK, CROSS, POWER, etc.)
- Everything between the year and the concept is the FORMATION (LUZERN A-BUMP, ZUG Z-FLIP, etc.)
- Drop the year "2026" from col1. Keep the formation words in col1.
- The concept goes in col3. It is the SAME concept for every row on this page.
- FORMATIONS are NOT concepts: Luzern, Zug, I-Off, A-Near, A-Bump, Z-Flip, T-Wing are formations.
- PROTECTION SCHEMES are NOT concepts: Ray, Lou, Cup are OLine protections. If you see "STICK LOU", concept = "STICK".
- The concept name is NOT the route. For example, in a "STICK" concept, different receivers run different routes — one might run a Stick, another a 5 Out, another a 10 Dig, another a Flat, etc.

STEP 2 — READ EACH PLAY DIAGRAM CAREFULLY:
- Each diagram has a label/title (usually below or above it) — this is the formation/play name
- Find the player labeled ${aliases} in EACH diagram
- FIRST: Check if this concept+formation combination appears in the REFERENCE PLAYSHEET above. If it does, USE THE KNOWN ASSIGNMENT — it is correct.
- If NOT in the reference, then determine if the player is BLOCKING or RUNNING A ROUTE (see Rule #3 above)
- REMEMBER: Even within the SAME concept page, different formations have DIFFERENT A-back assignments. Do NOT copy the same route for every diagram.
- If BLOCKING: note what they block and leave route empty
- If RUNNING A ROUTE: CAREFULLY trace the LINE and ARROW drawn from that specific player:
  * What DIRECTION does the arrow go? (up, out, in, back?)
  * How FAR does it go before breaking? (5 yards? 10 yards?)
  * Does it BREAK/TURN at any point? (straight, angle, curl back?)
  * Is there a DELAY before the route starts? (does the player pause or chip first?)
- Based on the arrow shape, determine the SPECIFIC route name from the ROUTE VOCABULARY above.
  Route identification guide:
  * "Stick" = short 5-6yd hitch, catch and turn
  * "5 Out" = 5 yards upfield then break OUT toward sideline
  * "delay 5 Out" = hesitate/chip first, then 5 Out
  * "10 Dig" = 10 yards upfield then break IN across the field
  * "Flat" = short route to the flat area (2-3 yards deep toward sideline)
  * "Shallow Flat" = very shallow route toward flat
  * "Cross Flat" = cross then flatten out
  * "Shoot" = sprint flat to sideline quickly
  * "Hitch" = short stop route, turn back to QB
  * "Out" = break out toward sideline
  * "In" = break in toward middle
  * "Shallow Cross" = run across the field underneath at shallow depth
  * "Wheel" = start toward flat then turn upfield along sideline
  * "Angle" = step one direction then break the other at an angle
  * "Tab" = inside route breaking back outside
  * "Flank" = route toward the flank
  * "delay Flank" = hesitate first, then flank route
  * "Seam" = vertical up the seam
  * "Go" = straight vertical deep route
  * "Post" = upfield then break inside at ~45° toward goalpost
  * "Corner" = upfield then break outside at ~45° toward corner
  * "Arrow" = short angled route toward sideline
  * "Curl/Comeback" = run upfield then turn back toward QB
- IMPORTANT: Do NOT just write the concept name as the route. Each player has their OWN specific route within the concept.

STEP 3 — GROUP PLAYS WITH IDENTICAL ${pos} ASSIGNMENTS:
- Compare the ${pos}'s assignment (route OR block) across ALL diagrams on the page
- If multiple plays show the EXACT SAME route for ${pos}, combine them into one row
- If multiple plays show the EXACT SAME blocking assignment, combine them into one row
- Do NOT group a blocking play with a route play — they must be separate rows
- In col1, list the formation/play names — ONLY drop the year prefix (e.g. "2026"). KEEP everything else including team/formation names like "LUZERN", "ZUG", etc.
- Example: "2026 LUZERN I-OFF STICK" → "LUZERN I-OFF STICK"
- Example: "2026 ZUG A-BUMP STICK" → "ZUG A-BUMP STICK"
- If multiple plays share the same assignment, join their names with " / "
- If a play has a DIFFERENT assignment, it gets its own row
- If a variant has a different route noted (like * indicating an alternate), include the alternate in parentheses: "5 Out (*Angle Out)"

STEP 4 — OUTPUT:
1. col1 = Formation/play name (drop only the year "2026", keep everything else)
2. col2 = The ${pos}'s SPECIFIC route from the arrow (empty "" if blocking)
3. col3 = The concept name from the page header. ALWAYS fill this in — NEVER "MULTIPLE PLAYS". Write the actual concept word.
4. col4 = Blocking assignment description (empty "" if running a route)

Return ONLY a JSON array:
[
  {
    "col1": "formation/play name without year",
    "col2": "route or empty if blocking",
    "col3": "concept name from page header NEVER MULTIPLE PLAYS",
    "col4": "blocking description or empty if route"
  }
]

Return ONLY the JSON array, no other text.`;
}
