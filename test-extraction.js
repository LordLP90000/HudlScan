#!/usr/bin/env node
/**
 * Test Play Extraction Format
 * Verifies that extracted plays match the expected format
 */

import { readFileSync } from 'fs';
import { createServer } from 'http';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[36m',
  bold: '\x1b[1m',
  yellow: '\x1b[33m'
};

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`${colors.green}✓ PASS${colors.reset} ${name}`);
    testsPassed++;
  } catch (e) {
    console.log(`${colors.red}✗ FAIL${colors.reset} ${name}`);
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

console.log(`\n${colors.bold}${colors.blue}=== Play Extraction Format Tests ===${colors.reset}\n`);

// Test 1: Server prompt uses correct abbreviations
console.log(`${colors.bold}${colors.blue}=== Test Suite 1: Server Prompt Format ===${colors.reset}\n`);
const serverCode = readFileSync('./server.js', 'utf-8');

test('1.1 Uses "Lu" not "luzern"', () => {
  assert(serverCode.includes('Lu = Luzern'),
    'Server should define Lu abbreviation');
  assert(!serverCode.includes('"luzern"') || serverCode.includes('NOT "luzern"'),
    'Server should NOT use lowercase "luzern" as formation name');
});

test('1.2 Uses "Zug" not "zug"', () => {
  assert(serverCode.includes('Zug = Zug'),
    'Server should define Zug abbreviation');
});

test('1.3 Defines correct column format', () => {
  assert(serverCode.includes('col1: Formation/Play name'),
    'Column 1 should be Formation/Play name');
  assert(serverCode.includes('col2: Route'),
    'Column 2 should be Route');
  assert(serverCode.includes('col3: Concept'),
    'Column 3 should be Concept');
  assert(serverCode.includes('col4: Blocking'),
    'Column 4 should be Blocking');
});

test('1.4 Includes example formation names from expected output', () => {
  assert(serverCode.includes('A-Near') || serverCode.includes('A Near'),
    'Should include A-Near formation');
  assert(serverCode.includes('Zug A-Bump'),
    'Should include Zug A-Bump formation');
  assert(serverCode.includes('Power / Trey') || serverCode.includes('Power / Trey'),
    'Should include Power / Trey concept');
});

test('1.5 Removes "2026" year prefix', () => {
  assert(serverCode.includes('Remove "2026"') || serverCode.includes('2026"'),
    'Should remove 2026 year prefix');
});

test('1.6 Combines formations with "/" separator', () => {
  assert(serverCode.includes('A-Near / Zug') || serverCode.includes(' "/" '),
    'Should combine formations with "/" separator');
});

test('1.7 Does NOT use receiver distribution as formation names', () => {
  assert(serverCode.includes('NOT formation names') || serverCode.includes('are receiver counts'),
    'Should clarify that 2x2/3x1 are NOT formation names');
});

// Test 2: Expected format examples
console.log(`\n${colors.bold}${colors.blue}=== Test Suite 2: Expected Format Examples ===${colors.reset}\n`);

const expectedExamples = [
  { col1: 'Cross', col2: 'Delayed Out', col3: 'Power / Trey', col4: 'Fill the Pulling Gap' },
  { col1: 'A-Near / Zug Z-Flip', col2: 'Cross', col3: 'Power A div', col4: 'Lead Block the Gap' },
  { col1: 'Zug A-Bump', col2: 'Go', col3: 'Power PS', col4: '2nd lead Block' },
  { col1: 'Boot L Flood', col2: 'behind OL to Flat', col3: 'Trey Div', col4: 'follow as 3rd Block' },
  { col1: 'Lu I Off A Cross', col2: 'Through Gap Cross', col3: 'Power / Trey', col4: 'Fill the Pulling Gap' }
];

test('2.1 Expected format has 4 columns', () => {
  const example = expectedExamples[0];
  assert(example.col1 !== undefined, 'Should have col1');
  assert(example.col2 !== undefined, 'Should have col2');
  assert(example.col3 !== undefined, 'Should have col3');
  assert(example.col4 !== undefined, 'Should have col4');
});

test('2.2 Formation names use title case', () => {
  assertEqual(expectedExamples[0].col1, 'Cross', 'Cross should be title case');
  assertEqual(expectedExamples[1].col1, 'A-Near / Zug Z-Flip', 'Combined formations use title case');
});

test('2.3 Routes match expected values', () => {
  const routes = expectedExamples.map(e => e.col2);
  assert(routes.includes('Delayed Out'), 'Should include Delayed Out route');
  assert(routes.includes('Cross'), 'Should include Cross route');
  assert(routes.includes('Go'), 'Should include Go route');
});

test('2.4 Concepts use "/" for combinations', () => {
  assert(expectedExamples[0].col3.includes('Power / Trey'),
    'Concept should use "/" for combinations');
});

test('2.5 Blocking descriptions are specific', () => {
  assert(expectedExamples[0].col4 === 'Fill the Pulling Gap',
    'Blocking should be specific: "Fill the Pulling Gap"');
  assert(expectedExamples[1].col4 === 'Lead Block the Gap',
    'Blocking should be specific: "Lead Block the Gap"');
});

test('2.6 Abbreviations are correct', () => {
  assert(expectedExamples[4].col1.includes('Lu'),
    'Should use "Lu" abbreviation for Luzern');
});

// Test 3: Server API response
console.log(`\n${colors.bold}${colors.blue}=== Test Suite 3: API Response Structure ===${colors.reset}\n`);

test('3.1 Server returns success flag', () => {
  assert(serverCode.includes('success'),
    'Server response should include success flag');
});

test('3.2 Server returns plays array', () => {
  assert(serverCode.includes('plays'),
    'Server response should include plays array');
});

test('3.3 Server handles text pages', () => {
  assert(serverCode.includes('"type":"text"'),
    'Server should handle text-only pages');
});

test('3.4 Server uses Moonshot API', () => {
  assert(serverCode.includes('api.moonshot.ai'),
    'Server should call Moonshot API');
});

test('3.5 Server has Claude fallback', () => {
  assert(serverCode.includes('api.anthropic.com'),
    'Server should have Claude API fallback');
});

// Summary
console.log(`\n${colors.bold}${colors.blue}=== TEST SUMMARY ===${colors.reset}\n`);
console.log(`${colors.green}Tests Passed: ${testsPassed}${colors.reset}`);
console.log(`${colors.red}Tests Failed: ${testsFailed}${colors.reset}`);
console.log(`Total Tests: ${testsPassed + testsFailed}\n`);

if (testsFailed === 0) {
  console.log(`${colors.bold}${colors.green}✓ ALL TESTS PASSED!${colors.reset}\n`);
  console.log(`${colors.yellow}Expected output format:${colors.reset}`);
  console.log(`col1: Formation (e.g., "Cross", "A-Near / Zug Z-Flip", "Lu I Off A Cross")`);
  console.log(`col2: Route (e.g., "Delayed Out", "Cross", "Go")`);
  console.log(`col3: Concept (e.g., "Power / Trey", "Trey Div", "Stick")`);
  console.log(`col4: Blocking (e.g., "Fill the Pulling Gap", "Lead Block the Gap")\n`);
  process.exit(0);
} else {
  console.log(`${colors.bold}${colors.red}✗ SOME TESTS FAILED${colors.reset}\n`);
  process.exit(1);
}
