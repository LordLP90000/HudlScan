import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ProcessingSpinner from './ProcessingSpinner.svelte';

describe('ProcessingSpinner.svelte', () => {
	it('renders the default message with a loading indicator', async () => {
		render(ProcessingSpinner, {});

		await expect.element(page.getByRole('status')).toBeInTheDocument();
		await expect.element(page.getByText('Processing on server...')).toBeInTheDocument();
	});

	it('renders custom message, details and progress', async () => {
		render(ProcessingSpinner, {
			message: 'Extracting plays...',
			details: 'Image 2 of 5',
			progress: 40
		});

		await expect.element(page.getByText('Extracting plays...')).toBeInTheDocument();
		await expect.element(page.getByText('Image 2 of 5')).toBeInTheDocument();
		await expect.element(page.getByText('40%')).toBeInTheDocument();
	});
});
