import { buildPrompt } from '$lib/prompt.js';
import { extractRequestSchema } from '$lib/server/extraction/schema.js';
import { parsePlays, normalizePlays, type NormalizedPlay } from '$lib/server/extraction/parse.js';
import { runProviderChain } from '$lib/server/extraction/providers.js';

// SECURITY: Validate request size to prevent DoS attacks (max 50MB)
const MAX_REQUEST_SIZE = 50 * 1024 * 1024;
const MAX_ATTEMPTS = 3;

function jsonResponse(body: unknown, status: number): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' }
	});
}

export async function POST({ request }: { request: Request }): Promise<Response> {
	const contentLength = request.headers.get('content-length');
	if (contentLength && parseInt(contentLength, 10) > MAX_REQUEST_SIZE) {
		return jsonResponse({ error: 'Request too large. Maximum size is 50MB.' }, 413);
	}

	try {
		const body = await request.json();

		// SECURITY: Validate request payload with runtime schema
		const validationResult = extractRequestSchema.safeParse(body);
		if (!validationResult.success) {
			return jsonResponse(
				{ error: 'Invalid request', details: validationResult.error.flatten() },
				400
			);
		}

		const {
			imageBase64,
			fileName,
			position,
			imageIndex,
			imageTotal,
			isSegmented,
			segmentIndex,
			segmentTotal
		} = validationResult.data;

		console.log(`Processing ${fileName} for ${position}...`);

		const prompt = buildPrompt(position, { singleDiagramMode: Boolean(isSegmented) });
		const imageLabel = `image ${imageIndex ?? '?'} of ${imageTotal ?? '?'} for ${fileName}`;
		const scopedInstructions = [
			`REQUEST SCOPE: You are processing ${imageLabel}.`,
			isSegmented
				? `Segment mode: this is segment ${segmentIndex ?? '?'} of ${segmentTotal ?? '?'} from one source image.`
				: 'Page mode: this may contain multiple diagrams.',
			'Do not infer from any previous image. Ignore visual similarity to other pages.',
			'Complete the full extraction for this image before returning.',
			'Return only a valid JSON array.'
		].join('\n');

		let plays: NormalizedPlay[] = [];
		let lastError = '';

		for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
			const result = await runProviderChain({ prompt, scopedInstructions, imageBase64, attempt });

			if (!result) {
				lastError =
					'All APIs failed. Configure USE_LOCAL_MOCR=true with local server, or ANTHROPIC_API_KEY, MOONSHOT_API_KEY, or DEEPSEEK_API_KEY for cloud APIs.';
				continue;
			}

			const parsed = parsePlays(result.text);
			if (parsed.error) {
				lastError = parsed.error;
				console.warn(`Parse failure on attempt ${attempt} for ${imageLabel}: ${parsed.error}`);
				console.warn(`Raw model output (${result.text.length} chars):`, result.text.slice(0, 500));
				continue;
			}

			const normalized = normalizePlays(parsed.plays);
			if (normalized.length === 0) {
				lastError = 'Model returned empty extraction.';
				console.warn(
					`Empty extraction on attempt ${attempt} for ${imageLabel}. After normalization, 0 plays remained from ${parsed.plays.length} parsed.`
				);
				continue;
			}

			console.log(
				`Extracted ${normalized.length} plays via ${result.provider} on attempt ${attempt} for ${imageLabel}`
			);
			plays = normalized;
			lastError = '';
			break;
		}

		if (plays.length === 0) {
			return jsonResponse(
				{
					success: true,
					plays: [],
					skipped: true,
					warning: `No plays extracted for ${imageLabel}. ${lastError}`
				},
				200
			);
		}

		return jsonResponse({ success: true, plays }, 200);
	} catch (error) {
		console.error('Server error:', error);
		return jsonResponse({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
	}
}

export async function OPTIONS({ request }: { request: Request }): Promise<Response> {
	// SECURITY: Restrict CORS to allowed origins only, not wildcard
	const allowedOrigins = process.env.ALLOWED_ORIGINS
		? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
		: ['http://localhost:5174', 'http://localhost:5173'];

	const requestOrigin = request.headers.get('origin');
	const origin =
		requestOrigin && allowedOrigins.includes(requestOrigin) ? requestOrigin : allowedOrigins[0];

	return new Response(null, {
		status: 204,
		headers: {
			'Access-Control-Allow-Origin': origin,
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			'Access-Control-Max-Age': '86400'
		}
	});
}
