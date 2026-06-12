import { describe, expect, it } from 'vitest';
import { buildPrompt } from './prompt.js';

describe('buildPrompt', () => {
	it('includes the position labels for FB', () => {
		const prompt = buildPrompt('FB');
		expect(prompt).toContain('A or FB or Fullback or A-back');
	});

	it('falls back to the raw position when unknown', () => {
		const prompt = buildPrompt('OL');
		expect(prompt).toContain('position labeled: OL');
	});

	it('defaults to QB when position is empty', () => {
		const prompt = buildPrompt('');
		expect(prompt).toContain('QB or 1');
	});

	it('builds the full-page prompt by default', () => {
		const prompt = buildPrompt('QB');
		expect(prompt).toContain('COUNT ALL DIAGRAMS FIRST');
		expect(prompt).not.toContain('single cropped diagram segment');
	});

	it('builds the segment prompt in singleDiagramMode', () => {
		const prompt = buildPrompt('QB', { singleDiagramMode: true });
		expect(prompt).toContain('single cropped diagram segment');
		expect(prompt).not.toContain('COUNT ALL DIAGRAMS FIRST');
	});
});
