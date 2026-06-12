import { routeTreeBase64 } from '../route-tree-data.js';

export interface ProviderContext {
	prompt: string;
	scopedInstructions: string;
	imageBase64: string;
	attempt: number;
}

export interface ProviderResult {
	text: string;
	provider: string;
}

const ROUTE_TREE_NOTE =
	'REFERENCE: First image is a route tree legend for understanding only. Do NOT extract it.';

interface OpenAICompatibleTarget {
	name: string;
	url: string;
	model: string;
	apiKey?: string;
	maxTokens: number;
	temperature: number;
}

/** Call an OpenAI-compatible chat completions endpoint (local mocr, Moonshot, DeepSeek). */
async function callOpenAICompatible(
	target: OpenAICompatibleTarget,
	ctx: ProviderContext
): Promise<string | null> {
	const headers: Record<string, string> = { 'Content-Type': 'application/json' };
	if (target.apiKey) {
		headers.Authorization = `Bearer ${target.apiKey}`;
	}

	try {
		const response = await fetch(target.url, {
			method: 'POST',
			headers,
			body: JSON.stringify({
				model: target.model,
				max_tokens: target.maxTokens,
				temperature: target.temperature,
				messages: [
					{
						role: 'user',
						content: [
							{
								type: 'text',
								text: `${ctx.prompt}\n\n${ctx.scopedInstructions}\n\n${ROUTE_TREE_NOTE}`
							},
							{
								type: 'image_url',
								image_url: { url: `data:image/png;base64,${routeTreeBase64}` }
							},
							{
								type: 'text',
								text: `PLAYBOOK: Extract plays from this image. Attempt ${ctx.attempt}.`
							},
							{
								type: 'image_url',
								image_url: { url: `data:image/png;base64,${ctx.imageBase64}` }
							}
						]
					}
				]
			})
		});

		if (!response.ok) {
			console.error(`${target.name} error ${response.status}:`, await response.text());
			return null;
		}

		const data = await response.json();
		return data.choices?.[0]?.message?.content ?? null;
	} catch (error) {
		console.error(`${target.name} failed:`, error);
		return null;
	}
}

/** Self-hosted dots.mocr via Docker (OpenAI-compatible vLLM server). */
export async function callLocalMocr(ctx: ProviderContext): Promise<string | null> {
	const baseUrl = process.env.LOCAL_MOCR_URL || 'http://127.0.0.1:8000';
	return callOpenAICompatible(
		{
			name: 'Local dots.mocr',
			url: `${baseUrl}/v1/chat/completions`,
			model: process.env.LOCAL_MOCR_MODEL || 'rednote-hilab/dots.mocr-svg',
			maxTokens: 4000,
			temperature: 0
		},
		ctx
	);
}

/** Anthropic Claude with prompt caching on the stable prefix (system + route tree). */
export async function callClaude(ctx: ProviderContext): Promise<string | null> {
	const apiKey = process.env.ANTHROPIC_API_KEY;
	if (!apiKey) return null;

	try {
		const response = await fetch('https://api.anthropic.com/v1/messages', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': apiKey,
				'anthropic-version': '2023-06-01'
			},
			body: JSON.stringify({
				model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
				max_tokens: 8000,
				system: [
					{
						type: 'text',
						text: `You are analyzing football playbook diagrams.\n\n${ctx.prompt}\n\n${ctx.scopedInstructions}\n\n${ROUTE_TREE_NOTE}`,
						cache_control: { type: 'ephemeral' }
					}
				],
				messages: [
					{
						role: 'user',
						content: [
							{
								type: 'image',
								source: { type: 'base64', media_type: 'image/png', data: routeTreeBase64 },
								cache_control: { type: 'ephemeral' }
							},
							{
								type: 'text',
								text: `PLAYBOOK: Extract plays from this image. Attempt ${ctx.attempt}.`
							},
							{
								type: 'image',
								source: { type: 'base64', media_type: 'image/png', data: ctx.imageBase64 }
							}
						]
					}
				]
			})
		});

		if (!response.ok) {
			console.error(`Claude error ${response.status}:`, await response.text());
			return null;
		}

		const data = await response.json();
		console.log('Claude cache usage:', data.usage);
		return data.content?.[0]?.text ?? null;
	} catch (error) {
		console.error('Claude API failed:', error);
		return null;
	}
}

/** Moonshot Kimi vision API. */
export async function callMoonshot(ctx: ProviderContext): Promise<string | null> {
	const apiKey = process.env.MOONSHOT_API_KEY;
	if (!apiKey) return null;
	return callOpenAICompatible(
		{
			name: 'Moonshot',
			url: 'https://api.moonshot.ai/v1/chat/completions',
			model: 'kimi-k2.5',
			apiKey,
			maxTokens: 8000,
			temperature: 1
		},
		ctx
	);
}

/** DeepSeek chat API. */
export async function callDeepseek(ctx: ProviderContext): Promise<string | null> {
	const apiKey = process.env.DEEPSEEK_API_KEY;
	if (!apiKey) return null;
	return callOpenAICompatible(
		{
			name: 'DeepSeek',
			url: 'https://api.deepseek.com/v1/chat/completions',
			model: 'deepseek-chat',
			apiKey,
			maxTokens: 8000,
			temperature: 1
		},
		ctx
	);
}

/**
 * Try all configured providers in priority order, returning the first response.
 * Order: local dots.mocr (if enabled) -> Claude -> Moonshot -> DeepSeek.
 */
export async function runProviderChain(ctx: ProviderContext): Promise<ProviderResult | null> {
	if (process.env.USE_LOCAL_MOCR === 'true') {
		console.log(`Attempting local dots.mocr, attempt ${ctx.attempt}...`);
		const text = await callLocalMocr(ctx);
		if (text) return { text, provider: 'local-mocr' };
	}

	console.log(`Attempting Claude API, attempt ${ctx.attempt}...`);
	const claudeText = await callClaude(ctx);
	if (claudeText) return { text: claudeText, provider: 'claude' };

	console.log(`Falling back to Moonshot API, attempt ${ctx.attempt}...`);
	const moonshotText = await callMoonshot(ctx);
	if (moonshotText) return { text: moonshotText, provider: 'moonshot' };

	console.log(`Falling back to DeepSeek API, attempt ${ctx.attempt}...`);
	const deepseekText = await callDeepseek(ctx);
	if (deepseekText) return { text: deepseekText, provider: 'deepseek' };

	return null;
}
