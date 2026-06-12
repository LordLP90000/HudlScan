export interface RawPlay {
	col1?: unknown;
	col2?: unknown;
	col3?: unknown;
	col4?: unknown;
}

export interface NormalizedPlay {
	col1: string;
	col2: string;
	col3: string;
	col4: string;
}

export interface ParseResult {
	plays: RawPlay[];
	error?: string;
}

/**
 * Find the first complete, balanced JSON array in a blob of model output.
 * Handles strings/escapes so brackets inside values don't break matching.
 */
export function extractBalancedJsonArray(text: string): string | null {
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

/** Parse a model response into a list of raw plays, tolerating markdown fences. */
export function parsePlays(textContent: string): ParseResult {
	const cleaned = textContent
		.replace(/```json\n?/g, '')
		.replace(/```\n?/g, '')
		.trim();

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

/** Coerce raw plays to trimmed strings and drop fully-empty rows. */
export function normalizePlays(rawPlays: RawPlay[]): NormalizedPlay[] {
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
