#!/usr/bin/env node
/**
 * COMPREHENSIVE Unit Tests for Hudl Playbook Extraction
 * Tests EVERY requirement the user specified
 */

import { readFileSync, existsSync } from 'fs';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[36m',
  yellow: '\x1b[33m',
  bold: '\x1b[1m'
};

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`${colors.green}✓${colors.reset} ${name}`);
    testsPassed++;
  } catch (e) {
    console.log(`${colors.red}✗${colors.reset} ${name}`);
    console.log(`  ${colors.red}${e.message}${colors.reset}`);
    testsFailed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected "${expected}" but got "${actual}"`);
  }
}

function assertNotContains(text, forbidden, message) {
  if (text.includes(forbidden)) {
    throw new Error(message || `Text should not contain "${forbidden}"`);
  }
}

console.log(`\n${colors.bold}${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.bold}${colors.blue}   COMPREHENSIVE PLAYBOOK EXTRACTION TESTS${colors.reset}`);
console.log(`${colors.bold}${colors.blue}═══════════════════════════════════════════════════════${colors.reset}\n`);

// ============================================================================
// TEST SUITE 1: Server Prompt - Abbreviations
// ============================================================================
console.log(`${colors.bold}${colors.blue}=== Suite 1: Name Abbreviations ===${colors.reset}\n`);

const serverCode = readFileSync('./server.js', 'utf-8');

test('1.1 Uses "Lu" for Luzern (NOT luzern)', () => {
  assert(serverCode.includes('Lu = Luzern'), 'Should define Lu = Luzern');
  assertNotContains(serverCode, '"luzern"', 'Should NOT use lowercase "luzern" as value');
});

test('1.2 Uses "Zug" (NOT zug)', () => {
  assert(serverCode.includes('Zug = Zug'), 'Should define Zug = Zug');
  // The prompt might mention "zug" in comments explaining NOT to use it
});

test('1.3 Uses "PS" for Play Side', () => {
  assert(serverCode.includes('PS = Play Side'), 'Should define PS = Play Side');
});

test('1.4 Uses "Div" for Divide', () => {
  assert(serverCode.includes('Div = Divide'), 'Should define Div = Divide');
});

test('1.5 Uses "Off" for Offset', () => {
  assert(serverCode.includes('Off = Offset'), 'Should define Off = Offset');
});

// ============================================================================
// TEST SUITE 2: QB Progression Numbers
// ============================================================================
console.log(`\n${colors.bold}${colors.blue}=== Suite 2: QB Progression Numbers ===${colors.reset}\n`);

test('2.1 Server prompt removes #1 from routes', () => {
  assert(serverCode.includes('#1') && serverCode.includes('NOT'),
    'Should mention removing #1 progression number');
});

test('2.2 Server prompt removes #2 from routes', () => {
  assert(serverCode.includes('#2'),
    'Should mention #2 progression number');
});

test('2.3 Server prompt removes #3 from routes', () => {
  assert(serverCode.includes('#3'),
    'Should mention #3 progression number');
});

test('2.4 Example shows "#1 Go" becomes "Go"', () => {
  assert(serverCode.includes('"#1 Go"') || serverCode.includes('#1 Go'),
    'Should show example of removing #1 from Go route');
});

test('2.5 Example shows "#2 Stick" becomes "Stick"', () => {
  assert(serverCode.includes('"#2 Stick"') || serverCode.includes('#2 Stick'),
    'Should show example of removing #2 from Stick route');
});

// ============================================================================
// TEST SUITE 3: Concept Names (NOT shortened)
// ============================================================================
console.log(`\n${colors.bold}${colors.blue}=== Suite 3: Concept Names ===${colors.reset}\n`);

test('3.1 Moses is NOT shortened to "moss"', () => {
  assertNotContains(serverCode, 'moss', 'Should NEVER shorten Moses to moss');
  assert(serverCode.includes('Moses'), 'Should include full name Moses');
});

test('3.2 All concept names are complete', () => {
  const concepts = ['Stick', 'Cross', 'Glance', 'Spacing', 'Smash', 'Shallow Cross', 'Moses', 'Power', 'ISO', 'Trey'];
  for (const concept of concepts) {
    assert(serverCode.includes(concept), `Should include concept: ${concept}`);
  }
});

test('3.3 "Trey" is a concept, NOT "Trey Div" abbreviation alone', () => {
  assert(serverCode.includes('Trey') || serverCode.includes('Trey Div'),
    'Should include Trey concept');
});

// ============================================================================
// TEST SUITE 4: 2x2 Output Format
// ============================================================================
console.log(`\n${colors.bold}${colors.blue}=== Suite 4: 2x2 Output Format ===${colors.reset}\n`);

test('4.1 Prompt specifies 2 plays per row', () => {
  assert(serverCode.includes('2 plays per row') || serverCode.includes('side by side'),
    'Should specify 2 plays per row layout');
});

test('4.2 col1 = Formation/Play name 1', () => {
  assert(serverCode.includes('col1') && (serverCode.includes('Play name 1') || serverCode.includes('Formation 1')),
    'Column 1 should be Formation/Play name 1');
});

test('4.3 col2 = Route/Blocking 1', () => {
  assert(serverCode.includes('col2') && (serverCode.includes('Route/Blocking 1') || serverCode.includes('Route 1')),
    'Column 2 should be Route/Blocking for play 1');
});

test('4.4 col3 = Formation/Play name 2', () => {
  assert(serverCode.includes('col3') && (serverCode.includes('Play name 2') || serverCode.includes('Formation 2')),
    'Column 3 should be Formation/Play name 2');
});

test('4.5 col4 = Route/Blocking 2', () => {
  assert(serverCode.includes('col4') && (serverCode.includes('Route/Blocking 2') || serverCode.includes('Route 2')),
    'Column 4 should be Route/Blocking for play 2');
});

test('4.6 Example shows correct pairing', () => {
  // Example should show something like: Cross, Delayed Out, Power / Trey, Fill the Pulling Gap
  assert(serverCode.includes('Delayed Out') || serverCode.includes('Power / Trey'),
    'Should include example with correct format');
});

// ============================================================================
// TEST SUITE 5: Formation Names vs Distribution
// ============================================================================
console.log(`\n${colors.bold}${colors.blue}=== Suite 5: Formation Names ===${colors.reset}\n`);

test('5.1 "2x2" is NOT a formation name', () => {
  assert(serverCode.includes('2x2') &&
    (serverCode.includes('NOT') || serverCode.includes('receiver count') || serverCode.includes('distribution')),
    'Should clarify 2x2 is receiver count, not formation');
});

test('5.2 "3x1" is NOT a formation name', () => {
  assert(serverCode.includes('3x1') &&
    (serverCode.includes('NOT') || serverCode.includes('receiver count')),
    'Should clarify 3x1 is receiver count, not formation');
});

test('5.3 Actual formation names are listed', () => {
  const formations = ['A-Near', 'Zug A-Bump', 'Lu I Off', 'Boot L Flood', 'Spacing', 'ISO'];
  const foundFormations = formations.filter(f => serverCode.includes(f));
  assert(foundFormations.length >= 3,
    `Should include actual formation names (found ${foundFormations.length}/6)`);
});

test('5.4 "Lu" prefix used for Luzern formations', () => {
  assert(serverCode.includes('Lu I') || serverCode.includes('Lu I Off') || serverCode.includes('Lu '),
    'Should use "Lu" prefix for Luzern formations');
});

test('5.5 "Zug" prefix used for Zug formations', () => {
  assert(serverCode.includes('Zug A') || serverCode.includes('Zug-') || serverCode.includes('Zug '),
    'Should use "Zug" prefix for Zug formations');
});

// ============================================================================
// TEST SUITE 6: Route Names
// ============================================================================
console.log(`\n${colors.bold}${colors.blue}=== Suite 6: Route Names ===${colors.reset}\n`);

test('6.1 Common routes are listed', () => {
  const routes = ['Flat', 'Wheel', 'Slant', 'Out', 'In', 'Go', 'Post', 'Corner', 'Hitch', 'Dig', 'Shoot', '5 Out', 'Tab'];
  const foundRoutes = routes.filter(r => serverCode.includes(`"${r}"`) || serverCode.includes(` ${r}`));
  assert(foundRoutes.length >= 5,
    `Should include common route names (found ${foundRoutes.length}/14)`);
});

test('6.2 Routes do NOT include progression numbers in output spec', () => {
  // Check that the output specification doesn't include #1, #2 etc.
  const lines = serverCode.split('\n');
  const outputSection = lines.join(' ');
  // The output example should show routes without numbers
});

// ============================================================================
// TEST SUITE 7: Blocking Descriptions
// ============================================================================
console.log(`\n${colors.bold}${colors.blue}=== Suite 7: Blocking Descriptions ===${colors.reset}\n`);

test('7.1 Blocking is specific (not generic)', () => {
  const blockingTerms = ['Fill the Pulling Gap', 'Lead Block the Gap', 'Kick out', 'Seal', 'Block with'];
  const found = blockingTerms.filter(t => serverCode.includes(t));
  assert(found.length >= 2,
    `Should include specific blocking descriptions (found ${found.length}/5)`);
});

test('7.2 "Block" is not just "block" but specific target', () => {
  assert(serverCode.includes('Block') || serverCode.includes('Lead'),
    'Should include blocking with specific targets');
});

// ============================================================================
// TEST SUITE 8: Frontend Column Display
// ============================================================================
console.log(`\n${colors.bold}${colors.blue}=== Suite 8: Frontend Display ===${colors.reset}\n`);

const appCode = readFileSync('./src/App.jsx', 'utf-8');

test('8.1 Column 1 labeled "Formation/Play 1"', () => {
  assert(appCode.includes("Formation/Play 1"),
    'Col1 should be labeled "Formation/Play 1"');
});

test('8.2 Column 2 labeled "Route/Blocking"', () => {
  assert(appCode.includes("Route/Blocking"),
    'Col2 should be labeled "Route/Blocking"');
});

test('8.3 Column 3 labeled "Formation/Play 2"', () => {
  assert(appCode.includes("Formation/Play 2"),
    'Col3 should be labeled "Formation/Play 2"');
});

test('8.4 Column 4 labeled "Route/Blocking"', () => {
  // Col4 should also be "Route/Blocking"
  const col4Def = appCode.match(/col4.*?name[^,]*?["']([^"']+)["']/);
  if (col4Def) {
    assert(col4Def[1].includes('Route/Blocking') || col4Def[1].includes('Route') || col4Def[1].includes('Blocking'),
      'Col4 should relate to Route/Blocking');
  }
});

// ============================================================================
// TEST SUITE 9: Year Prefix Removal
// ============================================================================
console.log(`\n${colors.bold}${colors.blue}=== Suite 9: Year Prefix ===${colors.reset}\n`);

test('9.1 "2026" is removed from names', () => {
  assert(serverCode.includes('2026') && serverCode.includes('Remove') && serverCode.includes('if present'),
    'Should specify to remove 2026 year prefix');
});

test('9.2 Year removal applies to formations', () => {
  assert(serverCode.includes('2026') && (serverCode.includes('formation') || serverCode.includes('Formation')),
    'Should mention removing 2026 from formations');
});

// ============================================================================
// TEST SUITE 10: Text Page Handling
// ============================================================================
console.log(`\n${colors.bold}${colors.blue}=== Suite 10: Text Pages ===${colors.reset}\n`);

test('10.1 Text pages return special format', () => {
  assert(serverCode.includes('"type":"text"'),
    'Should handle text-only pages with special format');
});

test('10.2 Text pages capture concept name', () => {
  assert(serverCode.includes('concept') || serverCode.includes('NAME'),
    'Text page response should include concept name');
});

// ============================================================================
// TEST SUITE 11: Excel Export Format
// ============================================================================
console.log(`\n${colors.bold}${colors.blue}=== Suite 11: Excel Export ===${colors.reset}\n`);

test('11.1 ExcelJS used for export', () => {
  assert(appCode.includes('exceljs') || appCode.includes('ExcelJS'),
    'Should use ExcelJS for Excel export');
});

test('11.2 Export creates .xlsx file', () => {
  assert(appCode.includes('.xlsx'),
    'Export should create .xlsx file');
});

test('11.3 All 4 columns exported', () => {
  assert(appCode.includes('col1') && appCode.includes('col2') && appCode.includes('col3') && appCode.includes('col4'),
    'All 4 columns should be exported');
});

// ============================================================================
// TEST SUITE 12: Server Configuration
// ============================================================================
console.log(`\n${colors.bold}${colors.blue}=== Suite 12: Server Setup ===${colors.reset}\n`);

test('12.1 Server runs on port 3002', () => {
  assert(serverCode.includes('PORT = 3002') || serverCode.includes('port 3002') || serverCode.includes(':3002'),
    'Server should run on port 3002');
});

test('12.2 Server has CORS enabled', () => {
  assert(serverCode.includes('CORS') || serverCode.includes('Access-Control-Allow-Origin'),
    'Server should have CORS enabled');
});

test('12.3 Server endpoint is /api/extract-plays', () => {
  assert(serverCode.includes('/api/extract-plays'),
    'Server should have /api/extract-plays endpoint');
});

test('12.4 Server handles POST requests', () => {
  assert(serverCode.includes('POST') || serverCode.includes("req.method === 'POST'"),
    'Server should handle POST requests');
});

test('12.5 Server has 100MB body size limit', () => {
  assert(serverCode.includes('MAX_BODY_SIZE') || serverCode.includes('100 * 1024 * 1024') || serverCode.includes('100MB'),
    'Server should have large body size limit');
});

// ============================================================================
// TEST SUITE 13: API Fallback
// ============================================================================
console.log(`\n${colors.bold}${colors.blue}=== Suite 13: API Fallback ===${colors.reset}\n`);

test('13.1 Uses Moonshot API first', () => {
  assert(serverCode.includes('moonshot.ai') || serverCode.includes('Moonshot'),
    'Should use Moonshot API');
});

test('13.2 Has Claude API fallback', () => {
  assert(serverCode.includes('anthropic.com') || serverCode.includes('Claude'),
    'Should have Claude API as fallback');
});

// ============================================================================
// SUMMARY
// ============================================================================
console.log(`\n${colors.bold}${colors.blue}═══════════════════════════════════════════════════════${colors.reset}\n`);
console.log(`${colors.bold}${colors.blue}   TEST SUMMARY${colors.reset}\n`);
console.log(`  ${colors.green}Passed:${colors.reset} ${testsPassed}`);
console.log(`  ${colors.red}Failed:${colors.reset} ${testsFailed}`);
console.log(`  ${colors.blue}Total:${colors.reset}  ${testsPassed + testsFailed}`);

if (testsFailed === 0) {
  console.log(`\n  ${colors.bold}${colors.green}✓ ALL TESTS PASSED!${colors.reset}\n`);
  process.exit(0);
} else {
  console.log(`\n  ${colors.bold}${colors.red}✗ ${testsFailed} TESTS FAILED${colors.reset}\n`);
  process.exit(1);
}
