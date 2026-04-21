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

		// Use the centralized prompt from prompt.js
		const prompt = buildPrompt(position, true);

		let textContent = '[]';
		let success = false;

		// Try Moonshot first
		const moonshotKey = process.env.MOONSHOT_API_KEY;
		if (moonshotKey) {
			try {
				const response = await fetch('https://api.moonshot.ai/v1/chat/completions', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${moonshotKey}`
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
				console.warn(`Moonshot failed for ${fileName}:`, e);
			}
		}

		// Fallback to Claude
		if (!success) {
			const claudeKey = process.env.CLAUDE_API_KEY;
			if (claudeKey) {
				try {
					const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'x-api-key': claudeKey,
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
					console.warn(`Claude failed for ${fileName}:`, e);
				}
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

		return new Response(
			JSON.stringify({ success, plays }),
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		);

	} catch (error) {
		console.error('API error:', error);
		return new Response(
			JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
}

// Handle OPTIONS for CORS
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
