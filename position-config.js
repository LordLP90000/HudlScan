// Position-specific configuration for playbook extraction
// Each position has unique characteristics for how they appear in diagrams

export const POSITION_CONFIG = {
  QB: {
    labels: ['QB', '1'],
    type: 'quarterback',
    primaryRole: 'throwing',
    canRoute: false,
    canBlock: false,
    canRun: true, // QB can run (draw, bootleg, keeper) but NOT a route
    description: 'Quarterback - reads progressions, throws, or runs (draw/bootleg)',
    runPlays: ['Draw', 'Boot', 'Bootleg', 'Keeper', 'Sneak', 'QB Run'],
    whatToExtract: 'No routes. QB may have run play (Draw, Bootleg) listed in col2, but this is NOT a route'
  },

  RB: {
    labels: ['RB', '2'],
    type: 'running_back',
    primaryRole: 'hybrid',
    canRoute: true,
    canBlock: true,
    canRun: true,
    description: 'Running Back - runs routes, blocks, or runs ball',
    commonRoutes: ['Flat', 'Swing', 'Angle', 'Checkdown', 'Shoot', 'Slant', 'Out'],
    blockingIndicators: ['Pass pro', 'Protection', 'Block', 'Lead', 'Seal', 'Pick'],
    whatToExtract: 'Route OR blocking assignment OR run play'
  },

  FB: {
    labels: ['FB', 'A', 'A-back', '2-back'],
    type: 'fullback',
    primaryRole: 'hybrid',
    canRoute: true,
    canBlock: true,
    canRun: true,
    description: 'Fullback/A-back - runs routes, blocks, or runs. POSITION AFFECTS FORMATION',
    commonRoutes: ['Flat', 'Stick', 'Wheel', 'Slant', 'Out', 'Angle'],
    blockingIndicators: ['Lead', 'Seal', 'Kick out', 'Pass pro', 'Block BS', 'Block PS'],
    affectsFormation: true, // FB position determines if A-Near or I-formation
    whatToExtract: 'Route OR blocking. Check if FB split wide (A-Near) or in backfield (I/I-Off)'
  },

  X: {
    labels: ['X', '#1', '1', 'Wide', 'Split End'],
    type: 'wide_receiver',
    primaryRole: 'route',
    canRoute: true,
    canBlock: false,
    canRun: false,
    description: 'X receiver - outside receiver, #1 on field side',
    commonRoutes: ['Go', 'Fade', 'Hitch', 'Slant', 'Out', 'Post', 'Corner', 'Comeback', 'Dig'],
    whatToExtract: 'Route only'
  },

  Y: {
    labels: ['Y', '#2', '2', 'Slot', 'Inside Slot'],
    type: 'slot_receiver',
    primaryRole: 'route',
    canRoute: true,
    canBlock: false,
    canRun: false,
    description: 'Y receiver - slot receiver, #2 inside',
    commonRoutes: ['Stick', 'Slant', 'Out', 'In', 'Hitch', 'Corner', 'Post', 'Dig', 'Sit'],
    whatToExtract: 'Route only'
  },

  Z: {
    labels: ['Z', '#1', '1', 'Flanker', 'Boundary'],
    type: 'wide_receiver',
    primaryRole: 'route',
    canRoute: true,
    canBlock: false,
    canRun: false,
    description: 'Z receiver - outside receiver on boundary side, #1',
    commonRoutes: ['Go', 'Fade', 'Hitch', 'Slant', 'Out', 'Post', 'Corner', 'Comeback', 'Dig'],
    whatToExtract: 'Route only'
  },

  H: {
    labels: ['H', '#3', '3', 'Third'],
    type: 'slot_receiver',
    primaryRole: 'route',
    canRoute: true,
    canBlock: false,
    canRun: false,
    description: 'H receiver - third receiver in trips (3x1 formations)',
    commonRoutes: ['Flat', 'Stick', 'Slant', 'Out', 'Hitch', 'Dig', 'Sit'],
    whatToExtract: 'Route only'
  },

  TE: {
    labels: ['TE', 'Tight End'],
    type: 'tight_end',
    primaryRole: 'hybrid',
    canRoute: true,
    canBlock: true,
    canRun: false,
    description: 'Tight End - runs routes or blocks',
    commonRoutes: ['Stick', 'Flat', 'Out', 'In', 'Slant', 'Corner', 'Seam', 'Sit'],
    blockingIndicators: ['Seal', 'Reach', 'Base', 'Kick out', 'Pass pro', 'Block'],
    whatToExtract: 'Route OR blocking assignment'
  }
};

// Formation types - ONLY these exist in this playbook
export const FORMATIONS = {
  base: ['luzern', 'zug'],
  modifiers: ['I', 'I-Off', 'A-Near'],
  // Combinations: "luzern I", "luzern A-Near", "zug I-Off", etc.
  NOT_FORMATIONS: [
    'Power', 'ISO', 'Trey', 'Ace', 'Trips', 'Far', 'Near', 'Gun', 'Dub',
    '2x2', '3x1', 'Stack', 'Double Stack', 'Empty', 'Trey Div',
    'Field', 'Boundary', 'Single'
  ]
};

// Concepts/plays - these go in col3
export const CONCEPTS = [
  'Stick', 'Cross', 'Glance', 'Spacing', 'Smash', 'Shallow Cross', 'Moses',
  'Power', 'ISO', 'Trey Div'
];

// Route names - these go in col2
export const ROUTES = [
  'Flat', 'Wheel', 'Slant', 'Out', 'In', 'Go', 'Post', 'Corner', 'Shoot',
  '5 Out', 'Dig', 'Hitch', 'Curl', 'Stick', 'Comeback', 'Fade', 'Seam',
  'Swing', 'Angle', 'Checkdown', 'Sit', 'Quick Out', 'Deep Cross', 'Shallow Cross'
];

// Things to IGNORE
export const IGNORE_LIST = {
  blockingSchemes: ['CUP', 'FULL LOU', 'FULL RAY', 'RAY', 'LOU', 'BOOT'],
  defensive: ['vs Over', 'vs Cover 2', 'vs Man', 'vs Zone'],
  nonRoutes: ['bump over', 'Bump', 'A-T', 'alert', 'progression'],
  yearPrefix: ['2026', '2025', '2024'],
  distributionLabels: ['2x2', '3x1', 'Trips Side', 'Single Side', 'Stack Side']
};

// Get config for a position
export function getPositionConfig(position) {
  const upper = position.toUpperCase();
  // Handle special cases
  if (upper === 'FB' || upper === 'A' || upper === 'A-BACK' || upper === '2-BACK') {
    return POSITION_CONFIG.FB;
  }
  return POSITION_CONFIG[upper] || null;
}

// Get all position labels for AI to find in diagram
export function getPositionLabels(position) {
  const config = getPositionConfig(position);
  return config ? config.labels : [position];
}

// Generate position-specific prompt
export function getPositionPrompt(position) {
  const config = getPositionConfig(position);
  if (!config) return `Position: ${position}`;

  let prompt = `\n=== POSITION: ${position} ===\n`;
  prompt += `${config.description}\n`;
  prompt += `Looking for: ${config.labels.join(', ')}\n`;

  if (config.affectsFormation) {
    prompt += `\n⚠️ ${position} POSITION DETERMINES FORMATION:\n`;
    prompt += `  - In backfield behind QB → "I" or "I-Off" modifier (2x2 look)\n`;
    prompt += `  - Split out to side (near/short side) → "A-Near" modifier (3x1 look)\n`;
  }

  if (config.canRun && !config.canRoute) {
    // QB case - can run but not route
    prompt += `\n${position} can run plays: ${config.runPlays.join(', ')}\n`;
    prompt += `Note: These are RUN PLAYS, not routes. List in col2 if shown.\n`;
  } else if (config.canRoute && config.canBlock) {
    prompt += `\nCheck ${position} assignment:\n`;
    prompt += `  ROUTE: Arrow to open field → ${config.commonRoutes.join(', ')}\n`;
    prompt += `  BLOCKING: Line into defender → ${config.blockingIndicators.join(', ')}\n`;
  } else if (config.canRoute) {
    prompt += `\n${position} runs routes: ${config.commonRoutes.join(', ')}\n`;
  }

  return prompt;
}

// Normalize name (luzern/Lucerne/LU → luzern, etc.)
export function normalizeName(name, type) {
  if (!name) return '';

  let normalized = name.toLowerCase().trim();

  // luzern variants
  if (normalized.includes('luz') || normalized.includes('lucerne')) {
    if (type === 'formation') {
      normalized = normalized.replace(/lucerne/gi, 'luzern').replace(/lu[^a-z]/gi, 'luzern ').replace(/^lu$/gi, 'luzern');
    }
  }

  // Capitalize
  const parts = normalized.split(/\s+/);
  return parts.map(p => {
    if (p === 'i' || p === 'i-off') return p.toUpperCase();
    if (p.includes('-near')) return 'A-Near';
    if (p === 'a-back') return 'A-back';
    return p.charAt(0).toUpperCase() + p.slice(1);
  }).join(' ');
}

// Validate formation
export function isValidFormation(name) {
  if (!name) return false;
  const n = name.toLowerCase();

  // Must have base formation
  const hasBase = FORMATIONS.base.some(f => n.includes(f.toLowerCase()));
  if (!hasBase) return false;

  // Check no invalid terms
  const hasInvalid = FORMATIONS.NOT_FORMATIONS.some(nf =>
    n.includes(nf.toLowerCase()) && nf !== 'Near' // Near is only invalid alone
  );

  return !hasInvalid;
}

export default {
  POSITION_CONFIG,
  FORMATIONS,
  CONCEPTS,
  ROUTES,
  IGNORE_LIST,
  getPositionConfig,
  getPositionLabels,
  getPositionPrompt,
  normalizeName,
  isValidFormation
};
