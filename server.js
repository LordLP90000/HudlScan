import { createServer } from 'http';
import { readFileSync } from 'fs';
import { routeTreeBase64 } from './route-tree-data.js';

// Load environment variables from .env file (no dotenv dependency needed)
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
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Increase timeout for large PDF processing
  req.setTimeout(300000); // 5 minutes per request

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/api/extract-plays' && req.method === 'POST') {
    let body = '';
    let bodySize = 0;
    const MAX_BODY_SIZE = 100 * 1024 * 1024; // 100MB limit per request

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

        const positionMap = {
          'QB': 'QB, 1', 'RB': 'RB, 2', 'FB': 'FB, A',
          'X': 'X', 'Y': 'Y', 'Z': 'Z', 'H': 'H', 'TE': 'TE'
        };

        const prompt = `Extract plays for ${position} (POSITION: ${positionMap[position] || position}) from this football playbook page.

CRITICAL: col1 = Formation/Play name, col2 = Route/Blocking. DO NOT mix them up!

OUTPUT FORMAT (one play per row, 2 columns):
- col1: Formation or Play name ONLY. Examples: "Cross", "Power / Trey", "A-Near", "Zug A-Bump", "Lu I Off A Cross", "Spacing", "ISO"
- col2: Route OR Blocking assignment for ${position} ONLY. Examples: "Flat", "Delayed Out", "Go", "Wheel", "Seal inside", "Lead block the Gap"

WRONG (DO NOT DO THIS):
- ❌ col1: "Flat", "Wheel", "Go" (these are ROUTES, they go in col2!)
- ❌ col2: "2x2 Formation", "3x1 Formation" (these are NOT formations, IGNORE them!)

RIGHT (this is what we want):
- ✓ col1: "Cross", col2: "Flat"
- ✓ col1: "A-Near", col2: "Wheel"
- ✓ col1: "Zug A-Bump", col2: "Go"

ABBREVIATIONS (use these exact forms):
- Lu = Luzern
- Zug = Zug
- PS = Play Side
- Div = Divide
- Off = Offset
- A = A-back/Fullback
- B = B-back
- RPO = Run Pass Option

CONCEPTS (complete names only):
- Stick, Cross, Glance, Spacing, Smash, Shallow Cross, Moses, Power, ISO, Trey
- Always use full name "Moses" not any shortened version

ROUTES (common names):
- Flat, Wheel, Slant, Out, In, Go, Post, Corner, Hitch, Dig, Curl, Shoot, 5 Out, Tab, Delayed Out, Comeback, Seam, Quick Out

EXAMPLE OUTPUT:
[
  {"col1":"Cross","col2":"Delayed Out"},
  {"col1":"Power / Trey","col2":"Fill the Pulling Gap"},
  {"col1":"A-Near","col2":"Flat"},
  {"col1":"Zug A-Bump","col2":"Go"}
]

CRITICAL RULES:
- Read formation name from diagram label - NOT from receiver distribution
- "2x2", "3x1" are receiver counts, NOT formation names - IGNORE these
- Actual formations: "A-Near", "Zug A-Bump", "Lu I Off", "Boot L Flood", "Spacing", "ISO", "RPO"

NEVER EXTRACT (these are NOT plays, IGNORE completely):
- Protection schemes: "Cup", "Ray", "LOU", "FULL RAY", "FULL LOU", "Boot Right", "Boot Left", "Big-On-Big"
- Page headers: "PASS PROTECTION", "QUICK GAME", "DROPBACK GAME"
- Formation descriptions: "2x2 Formation", "3x1 Formation", "Formation Setup"
- Any row that does NOT show a specific route for ${position}

ONLY extract pages with actual PLAY DIAGRAMS showing:
- Receiver routes (Flat, Wheel, Slant, Go, etc.)
- Blocking assignments (Seal, Kick out, Lead block, etc.)

TEXT PAGE: If no play diagrams (only text explanations), return: {"type":"text","concept":"NAME"}

Remove "2026" if present. Use title case for names.

QB PROGRESSION NUMBERS:
- #1, #2, #3, #4 are QB read order, NOT route names
- "#1 Go" → extract as "Go"
- "#2 Stick" → extract as "Stick"

TEXT PAGE: If no diagrams (explanation only), return: {"type":"text","concept":"NAME"}

Return JSON only (2 columns: col1, col2).`;

        let textContent = '[]';
        let success = false;

        // Try Moonshot
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

        // Fallback to Claude
        if (!success) {
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

        textContent = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // Check if this is a text page response
        if (textContent.includes('"type":"text"')) {
          const textPageMatch = textContent.match(/\{[^}]+\}/);
          if (textPageMatch) {
            try {
              const textPageData = JSON.parse(textPageMatch[0]);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, textPage: textPageData, plays: [] }));
              return;
            } catch (e) {}
          }
        }

        const jsonMatch = textContent.match(/\[[\s\S]*\]/);
        let plays = [];

        if (jsonMatch) {
          try {
            plays = JSON.parse(jsonMatch[0]);
          } catch (e) {}
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
