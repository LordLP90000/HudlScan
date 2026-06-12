import { describe, expect, it } from 'vitest';
import { extractBalancedJsonArray, parsePlays, normalizePlays } from './parse.js';

describe('extractBalancedJsonArray', () => {
	it('extracts a balanced array from surrounding prose', () => {
		const text = 'Here are the plays: [{"col1": "ZUG"}] hope that helps!';
		expect(extractBalancedJsonArray(text)).toBe('[{"col1": "ZUG"}]');
	});

	it('handles nested arrays', () => {
		const text = 'result [[1, 2], [3]] trailing';
		expect(extractBalancedJsonArray(text)).toBe('[[1, 2], [3]]');
	});

	it('ignores brackets inside string values', () => {
		const text = '[{"col1": "Zug ] tricky [ value"}]';
		expect(extractBalancedJsonArray(text)).toBe('[{"col1": "Zug ] tricky [ value"}]');
	});

	it('ignores escaped quotes inside strings', () => {
		const text = '[{"col1": "say \\"hi\\" ]"}]';
		expect(extractBalancedJsonArray(text)).toBe('[{"col1": "say \\"hi\\" ]"}]');
	});

	it('returns null when there is no array', () => {
		expect(extractBalancedJsonArray('no json here')).toBeNull();
	});

	it('returns null for an unterminated array', () => {
		expect(extractBalancedJsonArray('[{"col1": "ZUG"}')).toBeNull();
	});
});

describe('parsePlays', () => {
	it('parses a plain JSON array', () => {
		const result = parsePlays('[{"col1": "ZUG", "col2": "Hitch"}]');
		expect(result.error).toBeUndefined();
		expect(result.plays).toEqual([{ col1: 'ZUG', col2: 'Hitch' }]);
	});

	it('strips markdown code fences', () => {
		const result = parsePlays('```json\n[{"col1": "LUZERN"}]\n```');
		expect(result.error).toBeUndefined();
		expect(result.plays).toEqual([{ col1: 'LUZERN' }]);
	});

	it('recovers an array embedded in prose', () => {
		const result = parsePlays('Sure! Here you go: [{"col1": "ZUG"}] Done.');
		expect(result.error).toBeUndefined();
		expect(result.plays).toEqual([{ col1: 'ZUG' }]);
	});

	it('reports an error when no array is present', () => {
		const result = parsePlays('I could not find any plays.');
		expect(result.plays).toEqual([]);
		expect(result.error).toBeTruthy();
	});

	it('reports an error for a JSON object instead of array', () => {
		const result = parsePlays('{"col1": "ZUG"}');
		expect(result.plays).toEqual([]);
		expect(result.error).toBeTruthy();
	});
});

describe('normalizePlays', () => {
	it('trims values and coerces to strings', () => {
		const result = normalizePlays([{ col1: '  ZUG  ', col2: 42, col3: null, col4: undefined }]);
		expect(result).toEqual([{ col1: 'ZUG', col2: '42', col3: '', col4: '' }]);
	});

	it('drops fully-empty rows', () => {
		const result = normalizePlays([
			{ col1: '', col2: ' ', col3: '', col4: '' },
			{ col1: 'ZUG SMASH' }
		]);
		expect(result).toHaveLength(1);
		expect(result[0].col1).toBe('ZUG SMASH');
	});

	it('drops non-object entries', () => {
		const result = normalizePlays([null, 'string', { col1: 'ZUG' }] as never[]);
		expect(result).toHaveLength(1);
	});
});
