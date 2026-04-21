import { buildPrompt } from '../../../prompt.js';
import { routeTreeBase64 } from '../../../../route-tree-data.js';

export async function POST({ request }: { request: Request }) {
	try {
		const { imageBase64, fileName, position } = await request.json();

		if (!imageBase64 || !fileName || !position) {
			return new Response(
				JSON.stringify({ error: 'Missing required fields: imageBase64, fileName, position' }),
				{ status: 400, headers: { 'Content-Type': 'application/json' } }
			);
		}

		console.log(`Processing ${fileName} for ${position}...`);

		const prompt = buildPrompt(position, true);

		let textContent = '[]';
		let success = false;

		// Use Moonshot Kimi API
		const moonshotKey = process.env.MOONSHOT_API_KEY;
		if (moonshotKey) {
			console.log('Attempting Moonshot API (kimi-k2.5)...');
			const response = await fetch('https://api.moonshot.ai/v1/chat/completions', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${moonshotKey}`
					},
					body: JSON.stringify({
						model: 'kimi-k2.5',
						max_tokens: 4000,
						temperature: 1,
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
			} else {
				console.error(`Moonshot error ${response.status}:`, await response.text());
			}
		} else {
			console.warn('MOONSHOT_API_KEY not found in environment');
		}

		if (!success) {
			return new Response(
				JSON.stringify({ error: 'Moonshot API failed. Check MOONSHOT_API_KEY environment variable.' }),
				{ status: 500, headers: { 'Content-Type': 'application/json' } }
			);
		}

		textContent = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

		const jsonMatch = textContent.match(/\[[\s\S]*\]/);
		let plays = [];

		if (jsonMatch) {
			try {
				plays = JSON.parse(jsonMatch[0]);
			} catch (e) {
				console.error('JSON parse error:', e);
			}
		}

		return new Response(
			JSON.stringify({ success, plays }),
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		);

	} catch (error) {
		console.error('Server error:', error);
		return new Response(
			JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
}

export async function OPTIONS() {
	return new Response(null, {
		status: 204,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type'
		}
	});
}
