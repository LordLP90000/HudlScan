import { buildPrompt } from '../../../prompt.js';
import { routeTreeBase64 } from '../../../../route-tree-data.js';

interface RawPlay {
	col1?: unknown;
	col2?: unknown;
	col3?: unknown;
	col4?: unknown;
}

interface ParseResult {
	plays: RawPlay[];
	error?: string;
}

function extractBalancedJsonArray(text: string): string | null {
	const start = text.indexOf('[');
	if (start === -1) return null;

	let depth = 0;
	let inString = false;
	let escaped = false;

	for (let i = start; i < text.length; i++) {
		const char = text[i];

		if (escaped) {
			escaped = false;
			continue;
		}

		if (char === '\\') {
			escaped = true;
			continue;
		}

		if (char === '"') {
			inString = !inString;
			continue;
		}

		if (inString) continue;

		if (char === '[') depth++;
		if (char === ']') {
			depth--;
			if (depth === 0) {
				return text.slice(start, i + 1);
			}
		}
	}

	return null;
}

function parsePlays(textContent: string): ParseResult {
	const cleaned = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

	try {
		const direct = JSON.parse(cleaned);
		if (Array.isArray(direct)) {
			return { plays: direct };
		}
	} catch {
		// Fall back to balanced array extraction.
	}

	const extractedArray = extractBalancedJsonArray(cleaned);
	if (!extractedArray) {
		return { plays: [], error: 'No complete JSON array found in model response.' };
	}

	try {
		const parsed = JSON.parse(extractedArray);
		if (!Array.isArray(parsed)) {
			return { plays: [], error: 'Parsed JSON was not an array.' };
		}
		return { plays: parsed };
	} catch (error) {
		return {
			plays: [],
			error: error instanceof Error ? error.message : 'Unknown JSON parse error'
		};
	}
}

function normalizePlays(rawPlays: RawPlay[]): RawPlay[] {
	return rawPlays
		.filter((play) => play && typeof play === 'object')
		.map((play) => ({
			col1: String(play.col1 ?? '').trim(),
			col2: String(play.col2 ?? '').trim(),
			col3: String(play.col3 ?? '').trim(),
			col4: String(play.col4 ?? '').trim()
		}))
		.filter((play) => play.col1 || play.col2 || play.col3 || play.col4);
}

export async function POST({ request }: { request: Request }) {
	try {
		const { imageBase64, fileName, position, imageIndex, imageTotal, isSegmented, segmentIndex, segmentTotal } = await request.json();

		if (!imageBase64 || !fileName || !position) {
			return new Response(
				JSON.stringify({ error: 'Missing required fields: imageBase64, fileName, position' }),
				{ status: 400, headers: { 'Content-Type': 'application/json' } }
			);
		}

		console.log(`Processing ${fileName} for ${position}...`);

		// DIAGNOSTIC: Toggle this to false to use page mode for all requests
		const useSegmentMode = false; // Set to false to test if segment mode prompt is the issue
		const prompt = buildPrompt(position, { singleDiagramMode: useSegmentMode && Boolean(isSegmented) });
		const imageLabel = `image ${imageIndex ?? '?'} of ${imageTotal ?? '?'} for ${fileName}`;
		const scopedInstructions = [
			`REQUEST SCOPE: You are processing ${imageLabel}.`,
			Boolean(isSegmented)
				? `Segment mode: this is segment ${segmentIndex ?? '?'} of ${segmentTotal ?? '?'} from one source image.`
				: 'Page mode: this may contain multiple diagrams.',
			'Do not infer from any previous image. Ignore visual similarity to other pages.',
			'Complete the full extraction for this image before returning.',
			'Return only a valid JSON array.'
		].join('\n');

		let plays: RawPlay[] = [];
		let lastError = '';

		// ============================================================================
		// LOCAL MOCR API (Self-hosted dots.mocr via Docker)
		// ============================================================================
		const localMocrUrl = process.env.LOCAL_MOCR_URL || 'http://127.0.0.1:8000';
		const useLocalMocr = process.env.USE_LOCAL_MOCR === 'true';

		for (let attempt = 1; attempt <= 3; attempt++) {
			let textContent = '[]';
			let success = false;

			// Try local dots.mocr server first (if enabled)
			if (useLocalMocr && !success) {
				console.log(`Attempting local dots.mocr, attempt ${attempt}...`);
				try {
					const response = await fetch(`${localMocrUrl}/v1/chat/completions`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							model: process.env.LOCAL_MOCR_MODEL || 'rednote-hilab/dots.mocr-svg',
							messages: [{
								role: 'user',
								content: [
									{
										type: 'text',
										text: `${prompt}\n\n${scopedInstructions}\n\nREFERENCE: First image is a route tree legend for understanding only. Do NOT extract it.`
									},
									{
										type: 'image_url',
										image_url: { url: `data:image/png;base64,${routeTreeBase64}` }
									},
									{
										type: 'text',
										text: `PLAYBOOK: Extract plays from this image. Attempt ${attempt}.`
									},
									{
										type: 'image_url',
										image_url: { url: `data:image/png;base64,${imageBase64}` }
									}
								]
							}],
							max_tokens: 4000,
							temperature: 0
						})
					});

					if (response.ok) {
						const data = await response.json();
						textContent = data.choices?.[0]?.message?.content || '[]';
						success = true;
						console.log(`Local dots.mocr success for ${fileName} on attempt ${attempt}`);
					} else {
						console.error(`Local dots.mocr error ${response.status}:`, await response.text());
					}
				} catch (e) {
					console.error('Local dots.mocr failed:', e);
				}
			}

			// Try Claude API next (Sonnet 4.6 for vision)
			const anthropicKey = process.env.ANTHROPIC_API_KEY;
			if (anthropicKey) {
				console.log(`Attempting Claude API (claude-sonnet-4-20250514), attempt ${attempt}...`);
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
							max_tokens: 8000,
							system: `You are analyzing football playbook diagrams.

${prompt}

${scopedInstructions}

REFERENCE: First image is a route tree legend for understanding only. Do NOT extract it.`,
							cache_control: { type: 'ephemeral' },
							messages: [{
								role: 'user',
								content: [
									{
										type: 'image',
										source: { type: 'base64', media_type: 'image/png', data: routeTreeBase64 },
										cache_control: { type: 'ephemeral' }
									},
									{
										type: 'text',
										text: `PLAYBOOK: Extract plays from this image. Attempt ${attempt}.`
									},
									{
										type: 'image',
										source: { type: 'base64', media_type: 'image/png', data: imageBase64 }
									}
								]
							}]
						})
					});

					if (response.ok) {
						const data = await response.json();
						textContent = data.content?.[0]?.text || '[]';
						success = true;
						console.log(`Claude success for ${fileName} on attempt ${attempt} - cache usage:`, data.usage);
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
					console.log(`Falling back to Moonshot API (kimi-k2.5), attempt ${attempt}...`);
					const response = await fetch('https://api.moonshot.ai/v1/chat/completions', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${moonshotKey}`
						},
						body: JSON.stringify({
							model: 'kimi-k2.5',
							max_tokens: 8000,
							temperature: 1,
							messages: [{
								role: 'user',
								content: [
									{ type: 'text', text: 'REFERENCE IMAGE: First image is a route tree legend for understanding only. Do NOT extract it as a play.' },
									{ type: 'image_url', image_url: { url: `data:image/png;base64,${routeTreeBase64}` } },
									{ type: 'text', text: `PLAYBOOK IMAGE: Extract plays from this image only. Attempt ${attempt}.` },
									{ type: 'image_url', image_url: { url: `data:image/png;base64,${imageBase64}` } },
									{ type: 'text', text: `${prompt}\n\n${scopedInstructions}` }
								]
							}]
						})
					});

					if (response.ok) {
						const data = await response.json();
						textContent = data.choices?.[0]?.message?.content || '[]';
						success = true;
						console.log(`Moonshot success for ${fileName} on attempt ${attempt}`);
					} else {
						console.error(`Moonshot error ${response.status}:`, await response.text());
					}
				} else {
					console.warn('MOONSHOT_API_KEY not found in environment');
				}
			}

			// Fallback to DeepSeek API if Moonshot also failed or not configured
			if (!success) {
				const deepseekKey = process.env.DEEPSEEK_API_KEY;
				if (deepseekKey) {
					console.log(`Falling back to DeepSeek API (deepseek-chat), attempt ${attempt}...`);
					const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${deepseekKey}`
						},
						body: JSON.stringify({
							model: 'deepseek-chat',
							max_tokens: 8000,
							temperature: 1,
							messages: [{
								role: 'user',
								content: [
									{ type: 'text', text: 'REFERENCE IMAGE: First image is a route tree legend for understanding only. Do NOT extract it as a play.' },
									{ type: 'image_url', image_url: { url: `data:image/png;base64,${routeTreeBase64}` } },
									{ type: 'text', text: `PLAYBOOK IMAGE: Extract plays from this image only. Attempt ${attempt}.` },
									{ type: 'image_url', image_url: { url: `data:image/png;base64,${imageBase64}` } },
									{ type: 'text', text: `${prompt}\n\n${scopedInstructions}` }
								]
							}]
						})
					});

					if (response.ok) {
						const data = await response.json();
						textContent = data.choices?.[0]?.message?.content || '[]';
						success = true;
						console.log(`DeepSeek success for ${fileName} on attempt ${attempt}`);
					} else {
						console.error(`DeepSeek error ${response.status}:`, await response.text());
					}
				} else {
					console.warn('DEEPSEEK_API_KEY not found in environment');
				}
			}

			if (!success) {
				lastError = 'All APIs failed. Configure USE_LOCAL_MOCR=true with local server, or ANTHROPIC_API_KEY, MOONSHOT_API_KEY, or DEEPSEEK_API_KEY for cloud APIs.';
				continue;
			}

			const parsed = parsePlays(textContent);
			if (parsed.error) {
				lastError = parsed.error;
				console.warn(`Parse failure on attempt ${attempt} for ${imageLabel}: ${parsed.error}`);
				console.warn(`Raw model output (${textContent.length} chars):`, textContent.slice(0, 500));
				continue;
			}

			console.log(`Parsed ${parsed.plays.length} plays from attempt ${attempt} for ${imageLabel}:`, JSON.stringify(parsed.plays, null, 2));

			const normalized = normalizePlays(parsed.plays);
			if (normalized.length === 0) {
				lastError = 'Model returned empty extraction.';
				console.warn(`Empty extraction on attempt ${attempt} for ${imageLabel}. After normalization, 0 plays remained from ${parsed.plays.length} parsed.`);
				continue;
			}

			plays = normalized;
			lastError = '';
			break;
		}

		if (plays.length === 0) {
			return new Response(
				JSON.stringify({
					success: true,
					plays: [],
					skipped: true,
					warning: `No plays extracted for ${imageLabel}. ${lastError}`
				}),
				{ status: 200, headers: { 'Content-Type': 'application/json' } }
			);
		}

		return new Response(
			JSON.stringify({ success: true, plays }),
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
