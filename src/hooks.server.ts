import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';

// Load environment variables from .env.local for server-side
// This ensures process.env is populated for API routes
let dotenv;
try {
	dotenv = (await import('dotenv')).default;
} catch {
	// dotenv not installed, skip
}

if (dotenv) {
	const result = dotenv.config({ path: '.env.local' });
	if (result.error) {
		console.warn('Failed to load .env.local:', result.error.message);
	}
}

// SECURITY: Only log API key presence in development to avoid information disclosure
if (process.env.NODE_ENV === 'development') {
	if (process.env.DEEPSEEK_API_KEY) {
		console.log('✓ DEEPSEEK_API_KEY loaded');
	} else {
		console.warn('✗ DEEPSEEK_API_KEY not found');
	}
	if (process.env.ANTHROPIC_API_KEY) {
		console.log('✓ ANTHROPIC_API_KEY loaded');
	}
	if (process.env.MOONSHOT_API_KEY) {
		console.log('✓ MOONSHOT_API_KEY loaded');
	}
}

const handle: Handle = async ({ event, resolve }) => {
	return resolve(event);
};

export const ssr = false; // No SSR needed for this app
export const handleSeq = sequence(handle);
