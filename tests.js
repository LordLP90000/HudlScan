#!/usr/bin/env node
/**
 * Comprehensive Unit Tests for Hudl Playbook AI Converter
 *
 * Tests:
 * 1. Environment Configuration
 * 2. Server API Endpoint
 * 3. Client Components
 * 4. Data Flow Integration
 * 5. Excel Export
 * 6. PDF Handling
 * 7. Position Selection
 * 8. Error Handling
 */

import { readFileSync, existsSync } from 'fs';
import { createServer } from 'http';

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m'
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

// ============================================
// TEST SUITE 1: Environment Configuration
// ============================================
console.log(`\n${colors.bold}${colors.blue}=== SUITE 1: Environment Configuration ===${colors.reset}\n`);

// Load .env
const envContent = readFileSync('./.env', 'utf-8');
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && !key.startsWith('#') && valueParts.length > 0) {
    process.env[key.trim()] = valueParts.join('=').trim();
  }
});

test('1.1 .env file exists', () => {
  assert(existsSync('./.env'), '.env file must exist');
});

test('1.2 MOONSHOT_API_KEY is set', () => {
  assert(process.env.MOONSHOT_API_KEY, 'MOONSHOT_API_KEY must be set');
  assert(process.env.MOONSHOT_API_KEY.startsWith('sk-'), 'MOONSHOT_API_KEY must start with sk-');
});

test('1.3 CLAUDE_API_KEY is set', () => {
  assert(process.env.CLAUDE_API_KEY, 'CLAUDE_API_KEY must be set');
  assert(process.env.CLAUDE_API_KEY.startsWith('sk-'), 'CLAUDE_API_KEY must start with sk-');
});

test('1.4 .env is in .gitignore', () => {
  const gitignore = readFileSync('./.gitignore', 'utf-8');
  assert(gitignore.includes('.env'), '.env must be in .gitignore');
});

test('1.5 .env.example exists for reference', () => {
  assert(existsSync('./.env.example'), '.env.example must exist for documentation');
});

// ============================================
// TEST SUITE 2: Server Configuration
// ============================================
console.log(`\n${colors.bold}${colors.blue}=== SUITE 2: Server Configuration ===${colors.reset}\n`);

test('2.1 server.js exists', () => {
  assert(existsSync('./server.js'), 'server.js must exist');
});

test('2.2 server.js uses environment variables (not hardcoded keys)', () => {
  const serverCode = readFileSync('./server.js', 'utf-8');
  // Check that no full API keys are present (only partial/placeholder references allowed)
  const longKeyPattern = /sk-[a-zA-Z0-9]{40,}/;
  assert(!longKeyPattern.test(serverCode),
    'server.js must not contain hardcoded full API keys');
  assert(serverCode.includes('process.env.MOONSHOT_API_KEY'),
    'server.js must use process.env.MOONSHOT_API_KEY');
  assert(serverCode.includes('process.env.CLAUDE_API_KEY'),
    'server.js must use process.env.CLAUDE_API_KEY');
});

test('2.3 server.js has CORS enabled', () => {
  const serverCode = readFileSync('./server.js', 'utf-8');
  assert(serverCode.includes('Access-Control-Allow-Origin'),
    'server.js must have CORS enabled');
});

test('2.4 server.js has /api/extract-plays endpoint', () => {
  const serverCode = readFileSync('./server.js', 'utf-8');
  assert(serverCode.includes('/api/extract-plays'),
    'server.js must have /api/extract-plays endpoint');
});

test('2.5 server.js has Moonshot API fallback to Claude', () => {
  const serverCode = readFileSync('./server.js', 'utf-8');
  assert(serverCode.includes('api.moonshot.ai'),
    'server.js must call Moonshot API');
  assert(serverCode.includes('api.anthropic.com'),
    'server.js must fallback to Claude API');
});

// ============================================
// TEST SUITE 3: Client Configuration
// ============================================
console.log(`\n${colors.bold}${colors.blue}=== SUITE 3: Client Configuration ===${colors.reset}\n`);

test('3.1 src/App.jsx exists', () => {
  assert(existsSync('./src/App.jsx'), 'src/App.jsx must exist');
});

test('3.2 App.jsx does NOT have hardcoded API keys', () => {
  const appCode = readFileSync('./src/App.jsx', 'utf-8');
  const longKeyPattern = /sk-[a-zA-Z0-9]{40,}/;
  assert(!longKeyPattern.test(appCode),
    'App.jsx must not contain hardcoded full API keys');
});

test('3.3 App.jsx calls local server (not direct API)', () => {
  const appCode = readFileSync('./src/App.jsx', 'utf-8');
  assert(appCode.includes('http://localhost:3002/api/extract-plays'),
    'App.jsx must call local server at localhost:3002');
});

// ============================================
// TEST SUITE 4: Position Selection
// ============================================
console.log(`\n${colors.bold}${colors.blue}=== SUITE 4: Position Selection ===${colors.reset}\n`);

test('4.1 All required positions are available', () => {
  const appCode = readFileSync('./src/App.jsx', 'utf-8');
  const positions = ['QB', 'RB', 'FB', 'X', 'Y', 'Z', 'H', 'TE'];
  for (const pos of positions) {
    assert(appCode.includes(`'${pos}'`) || appCode.includes(`"${pos}"`),
      `Position ${pos} must be available`);
  }
});

test('4.2 Position labels are user-friendly', () => {
  const appCode = readFileSync('./src/App.jsx', 'utf-8');
  assert(appCode.includes('Quarterback'), 'Must have Quarterback label');
  assert(appCode.includes('Running Back'), 'Must have Running Back label');
  assert(appCode.includes('Fullback'), 'Must have Fullback label');
  assert(appCode.includes('Receiver'), 'Must have Receiver label');
  assert(appCode.includes('Tight End'), 'Must have Tight End label');
});

// ============================================
// TEST SUITE 5: Data Structure
// ============================================
console.log(`\n${colors.bold}${colors.blue}=== SUITE 5: Data Structure ===${colors.reset}\n`);

test('5.1 Plays have 4 columns (col1-col4)', () => {
  const appCode = readFileSync('./src/App.jsx', 'utf-8');
  assert(appCode.includes('col1'), 'Must have col1 (Formation)');
  assert(appCode.includes('col2'), 'Must have col2 (Route)');
  assert(appCode.includes('col3'), 'Must have col3 (Concept)');
  assert(appCode.includes('col4'), 'Must have col4 (Blocking)');
});

test('5.2 Column names are correct', () => {
  const appCode = readFileSync('./src/App.jsx', 'utf-8');
  assert(appCode.includes('Formation') || appCode.includes('formation'), 'Formation column');
  assert(appCode.includes('Route') || appCode.includes('route'), 'Route column');
  assert(appCode.includes('Concept') || appCode.includes('concept'), 'Concept column');
  assert(appCode.includes('Blocking') || appCode.includes('blocking'), 'Blocking column');
});

// ============================================
// TEST SUITE 6: Excel Export
// ============================================
console.log(`\n${colors.bold}${colors.blue}=== SUITE 6: Excel Export ===${colors.reset}\n`);

test('6.1 exportToExcel function exists', () => {
  const appCode = readFileSync('./src/App.jsx', 'utf-8');
  assert(appCode.includes('exportToExcel'), 'Must have exportToExcel function');
});

test('6.2 Uses ExcelJS library', () => {
  const appCode = readFileSync('./src/App.jsx', 'utf-8');
  assert(appCode.includes('exceljs'), 'Must use ExcelJS for export');
});

test('6.3 Creates .xlsx file download', () => {
  const appCode = readFileSync('./src/App.jsx', 'utf-8');
  assert(appCode.includes('.xlsx'), 'Must create .xlsx file');
  assert(appCode.includes('download'), 'Must trigger download');
});

// ============================================
// TEST SUITE 7: PDF Support
// ============================================
console.log(`\n${colors.bold}${colors.blue}=== SUITE 7: PDF Support ===${colors.reset}\n`);

test('7.1 PDF to image conversion exists', () => {
  const appCode = readFileSync('./src/App.jsx', 'utf-8');
  assert(appCode.includes('convertPdfToImages'), 'Must have convertPdfToImages function');
});

test('7.2 Uses PDF.js library', () => {
  const appCode = readFileSync('./src/App.jsx', 'utf-8');
  assert(appCode.includes('pdfjs-dist'), 'Must use pdfjs-dist for PDF handling');
});

test('7.3 Accepts .pdf files', () => {
  const appCode = readFileSync('./src/App.jsx', 'utf-8');
  assert(appCode.includes('.pdf'), 'Must accept .pdf files');
});

// ============================================
// TEST SUITE 8: UI Components
// ============================================
console.log(`\n${colors.bold}${colors.blue}=== SUITE 8: UI Components ===${colors.reset}\n`);

test('8.1 Has landing page', () => {
  const appCode = readFileSync('./src/App.jsx', 'utf-8');
  assert(appCode.includes('LandingPage'), 'Must have LandingPage component');
});

test('8.2 Has file upload interface', () => {
  const appCode = readFileSync('./src/App.jsx', 'utf-8');
  assert(appCode.includes('Upload'), 'Must have Upload icon/component');
  assert(appCode.includes('handleFileUpload'), 'Must have handleFileUpload function');
});

test('8.3 Has playsheet editor', () => {
  const appCode = readFileSync('./src/App.jsx', 'utf-8');
  assert(appCode.includes('CellEditor'), 'Must have CellEditor component');
  assert(appCode.includes('showEditor'), 'Must have showEditor state');
});

test('8.4 Has dark theme (Hudl style)', () => {
  const appCode = readFileSync('./src/App.jsx', 'utf-8');
  assert(appCode.includes('#1A1A1A'), 'Must have dark background');
  assert(appCode.includes('#FF6600'), 'Must have Hudl orange accent');
});

// ============================================
// TEST SUITE 9: Server API Response Format
// ============================================
console.log(`\n${colors.bold}${colors.blue}=== SUITE 9: Server API Response Format ===${colors.reset}\n`);

test('9.1 Server returns success flag', () => {
  const serverCode = readFileSync('./server.js', 'utf-8');
  assert(serverCode.includes('{ success'), 'Server response must include success flag');
});

test('9.2 Server returns plays array', () => {
  const serverCode = readFileSync('./server.js', 'utf-8');
  assert(serverCode.includes('plays:'), 'Server response must include plays array');
});

test('9.3 Server handles text pages', () => {
  const serverCode = readFileSync('./server.js', 'utf-8');
  assert(serverCode.includes('"type":"text"'), 'Server must handle text-only pages');
});

// ============================================
// TEST SUITE 10: Security
// ============================================
console.log(`\n${colors.bold}${colors.blue}=== SUITE 10: Security ===${colors.reset}\n`);

test('10.1 No secrets in server.js', () => {
  const serverCode = readFileSync('./server.js', 'utf-8');
  const skPattern = /sk-[a-zA-Z0-9]{20,}/;
  assert(!skPattern.test(serverCode), 'server.js must not contain API keys');
});

test('10.2 No secrets in App.jsx', () => {
  const appCode = readFileSync('./src/App.jsx', 'utf-8');
  const skPattern = /sk-[a-zA-Z0-9]{20,}/;
  assert(!skPattern.test(appCode), 'App.jsx must not contain API keys');
});

test('10.3 .env not tracked by git', () => {
  const gitignore = readFileSync('./.gitignore', 'utf-8');
  assert(gitignore.includes('.env'), '.env must be ignored by git');
});

// ============================================
// SUMMARY
// ============================================
console.log(`\n${colors.bold}${colors.blue}=== TEST SUMMARY ===${colors.reset}\n`);
console.log(`${colors.green}Tests Passed: ${testsPassed}${colors.reset}`);
console.log(`${colors.red}Tests Failed: ${testsFailed}${colors.reset}`);
console.log(`Total Tests: ${testsPassed + testsFailed}\n`);

if (testsFailed === 0) {
  console.log(`${colors.bold}${colors.green}✓ ALL TESTS PASSED!${colors.reset}\n`);
  process.exit(0);
} else {
  console.log(`${colors.bold}${colors.red}✗ SOME TESTS FAILED${colors.reset}\n`);
  process.exit(1);
}
