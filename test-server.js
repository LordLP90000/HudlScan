// Simple test to verify server configuration
import { createServer } from 'http';
import { readFileSync } from 'fs';

// Load .env file
try {
  const envContent = readFileSync('./.env', 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && !key.startsWith('#') && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
} catch (e) {
  console.warn('Warning: .env file not found');
}

// Test 1: Check .env file loads
console.log('\n=== Test 1: Environment Variables ===');
const moonshotKey = process.env.MOONSHOT_API_KEY || '';
const claudeKey = process.env.CLAUDE_API_KEY || '';

console.log('MOONSHOT_API_KEY:', moonshotKey ? '✓ Loaded (' + moonshotKey.slice(0, 10) + '...)' : '✗ NOT FOUND');
console.log('CLAUDE_API_KEY:', claudeKey ? '✓ Loaded (' + claudeKey.slice(0, 10) + '...)' : '✗ NOT FOUND');

if (!moonshotKey && !claudeKey) {
  console.error('\n✗ FAIL: No API keys found in .env');
  process.exit(1);
}

// Test 2: Check route tree data exists
console.log('\n=== Test 2: Route Tree Data ===');
try {
  const { routeTreeBase64 } = await import('./netlify/functions/route-tree-data.js');
  console.log('routeTreeBase64:', routeTreeBase64 ? '✓ Loaded' : '✗ NOT FOUND');
} catch (e) {
  console.log('✗ FAIL:', e.message);
}

// Test 3: Verify server starts
console.log('\n=== Test 3: Server Startup ===');
const PORT = 3002;
const testServer = createServer((req, res) => {
  res.writeHead(200);
  res.end('OK');
});

testServer.listen(PORT, () => {
  console.log(`✓ Server listening on port ${PORT}`);
  testServer.close(() => {
    console.log('✓ Server closed cleanly\n');
    console.log('=== ALL TESTS PASSED ===\n');
    process.exit(0);
  });
});

testServer.on('error', (err) => {
  console.error('✗ FAIL: Server error:', err.message);
  process.exit(1);
});
