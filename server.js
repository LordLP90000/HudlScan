import { createServer } from 'http';
import { readFileSync } from 'fs';
import { routeTreeBase64 } from './route-tree-data.js';
import { buildPrompt } from './src/prompt.js';

// Load environment variables from .env file
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

const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || '';
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || '';

const PORT = 3002;

const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  req.setTimeout(300000);

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/api/extract-plays' && req.method === 'POST') {
    let body = '';
    let bodySize = 0;
    const MAX_BODY_SIZE = 100 * 1024 * 1024;

    req.on('data', chunk => {
      bodySize += chunk.length;
      if (bodySize > MAX_BODY_SIZE) {
        console.error(`Request body too large: ${bodySize} bytes`);
        req.destroy();
      } else {
        body += chunk;
      }
    });

    req.on('end', async () => {
      try {
        const { imageBase64, fileName, position } = JSON.parse(body);
        console.log(`Processing ${fileName} for ${position}...`);

        // Use the centralized prompt from prompt.js
        const prompt = buildPrompt(position, true);

        let textContent = '[]';
        let success = false;

        // Try Moonshot first
        if (MOONSHOT_API_KEY) {
          try {
            const response = await fetch('https://api.moonshot.ai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MOONSHOT_API_KEY}`
              },
              body: JSON.stringify({
                model: 'moonshot-v1-32k-vision-preview',
                max_tokens: 4000,
                messages: [{
                  role: 'user',
                  content: [
                    { type: 'image_url', image_url: { url: `data:image/png;base64,${routeTreeBase64}` } },
                    { type: 'text', text: 'Route tree reference.' },
                    { type: 'image_url', image_url: { url: `data:image/png;base64,${imageBase64}` } },
                    { type: 'text', text: prompt }
                  ]
                }]
              })
            });

            if (response.ok) {
              const data = await response.json();
              textContent = data.choices?.[0]?.message?.content || '[]';
              success = true;
              console.log(`Moonshot success for ${fileName}`);
            }
          } catch (e) {
            console.warn(`Moonshot failed for ${fileName}:`, e.message);
          }
        }

        // Fallback to Claude
        if (!success && CLAUDE_API_KEY) {
          try {
            const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
              },
              body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 4000,
                messages: [{
                  role: 'user',
                  content: [
                    { type: 'image', source: { type: 'base64', media_type: 'image/png', data: routeTreeBase64 } },
                    { type: 'text', text: 'Route tree reference.' },
                    { type: 'image', source: { type: 'base64', media_type: 'image/png', data: imageBase64 } },
                    { type: 'text', text: prompt }
                  ]
                }]
              })
            });

            if (claudeResponse.ok) {
              const claudeData = await claudeResponse.json();
              textContent = claudeData.content?.[0]?.text || '[]';
              success = true;
              console.log(`Claude success for ${fileName}`);
            }
          } catch (e) {
            console.warn(`Claude failed for ${fileName}:`, e.message);
          }
        }

        // Clean up response
        textContent = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // Parse JSON array
        const jsonMatch = textContent.match(/\[[\s\S]*\]/);
        let plays = [];

        if (jsonMatch) {
          try {
            plays = JSON.parse(jsonMatch[0]);
          } catch (e) {
            console.error('Failed to parse AI response as JSON');
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success, plays }));

      } catch (error) {
        console.error('Server error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`\nServer running on http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/extract-plays\n`);
});
