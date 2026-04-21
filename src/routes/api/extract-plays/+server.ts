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

		// Try Claude first (better quality), fallback to Moonshot
		const claudeKey = process.env.CLAUDE_API_KEY;
		if (claudeKey) {
			console.log('Attempting Claude API (Sonnet 4.6)...');
			try {
				const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'x-api-key': claudeKey,
						'anthropic-version': '2023-06-01'
					},
					body: JSON.stringify({
						model: 'claude-sonnet-4-6',
						max_tokens: 4000,
						temperature: 0,
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
				} else {
					console.error(`Claude error ${claudeResponse.status}:`, await claudeResponse.text());
				}
			} catch (e) {
				console.warn(`Claude exception:`, e);
			}
		} else {
			console.warn('CLAUDE_API_KEY not found in environment');
		}

		// Fallback to Moonshot if Claude fails
		if (!success) {
			const moonshotKey = process.env.MOONSHOT_API_KEY;
			if (moonshotKey) {
				console.log('Claude failed, attempting Moonshot API...');
				const response = await fetch('https://api.moonshot.ai/v1/chat/completions', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${moonshotKey}`
					},
					body: JSON.stringify({
						model: 'moonshot-v1-32k-vision-preview',
						max_tokens: 4000,
						temperature: 0,
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
					console.log(`Moonshot fallback success for ${fileName}`);
				} else {
					console.error(`Moonshot error ${response.status}:`, await response.text());
				}
			} else {
				console.warn('MOONSHOT_API_KEY not found in environment');
			}
		}

		if (!success) {
			return new Response(
				JSON.stringify({ error: 'AI APIs failed. Check environment variables.' }),
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
