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

		const prompt = buildPrompt(position);

		let textContent = '[]';
		let success = false;

		// Try Claude API first (Sonnet 4.6 for vision)
		const anthropicKey = process.env.ANTHROPIC_API_KEY;
		if (anthropicKey) {
			console.log('Attempting Claude API (claude-sonnet-4-20250514)...');
			try {
				const response = await fetch('https://api.anthropic.com/v1/messages', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'x-api-key': anthropicKey,
						'anthropic-version': '2023-06-01'
					},
					body: JSON.stringify({
						model: 'claude-sonnet-4-20250514',
						max_tokens: 4000,
						messages: [{
							role: 'user',
							content: [
								{
									type: 'text',
									text: 'REFERENCE IMAGE: First image is a route tree legend for your understanding only. Do NOT extract it as a play.',
									cache_control: { type: 'ephemeral' }
								},
								{
									type: 'image',
									source: { type: 'base64', media_type: 'image/png', data: routeTreeBase64 },
									cache_control: { type: 'ephemeral' }
								},
								{ type: 'text', text: 'PLAYBOOK IMAGE: Extract plays from this image only:' },
								{ type: 'image', source: { type: 'base64', media_type: 'image/png', data: imageBase64 } },
								{ type: 'text', text: prompt, cache_control: { type: 'ephemeral' } }
							]
						}]
					})
				});

				if (response.ok) {
					const data = await response.json();
					textContent = data.content?.[0]?.text || '[]';
					success = true;
					console.log(`Claude success for ${fileName}`);
				} else {
					console.error(`Claude error ${response.status}:`, await response.text());
				}
			} catch (e) {
				console.error('Claude API failed:', e);
			}
		} else {
			console.warn('ANTHROPIC_API_KEY not found in environment');
		}

		// Fallback to Moonshot Kimi API if Claude failed or not configured
		if (!success) {
			const moonshotKey = process.env.MOONSHOT_API_KEY;
			if (moonshotKey) {
				console.log('Falling back to Moonshot API (kimi-k2.5)...');
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
								{ type: 'text', text: 'REFERENCE IMAGE: First image is a route tree legend for understanding only. Do NOT extract it as a play.' },
								{ type: 'image_url', image_url: { url: `data:image/png;base64,${routeTreeBase64}` } },
								{ type: 'text', text: 'PLAYBOOK IMAGE: Extract plays from this image only:' },
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
		}

		if (!success) {
			return new Response(
				JSON.stringify({ error: 'Both APIs failed. Configure ANTHROPIC_API_KEY or MOONSHOT_API_KEY environment variable.' }),
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
