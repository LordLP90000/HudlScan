<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<svelte:head>
	<title>Features - Hudl Playbook AI</title>
	<meta name="description" content="Features that save hours of manual playbook conversion work." />
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-white">
	<Nav />

	<main class="max-w-6xl mx-auto px-5 py-5">
		<!-- Hero Section -->
		<section class="text-center mb-10">
			<h2 class="text-3xl font-bold mb-2">Features That Save Hours of Manual Work</h2>
			<p class="text-zinc-400">Everything you need to convert playbooks into playcalling sheets.</p>
		</section>

		<!-- Feature Cards -->
		<section class="grid grid-cols-3 gap-5 mb-10">
			<Card title="Server-Side Processing" description="Processing continues in background. Upload large PDFs and let our servers handle the heavy lifting." />
			<Card title="Position-Specific" description="Extract routes for selected role. QB, RB, FB, X, Y, Z, TE — each position gets its dedicated routes." />
			<Card title="Excel Export" description="Download formatted sheet. Ready to use for playcalling with all formations and routes organized." />
		</section>

		<!-- Additional Features -->
		<section class="grid grid-cols-2 gap-5 mb-10">
			<div class="border border-zinc-800 rounded-xl bg-zinc-900 p-5">
				<h3 class="font-bold text-lg mb-2">AI-Powered Extraction</h3>
				<p class="text-zinc-400 text-sm">Advanced vision models read play diagrams accurately, understanding route trees and formations like a coach would.</p>
			</div>
			<div class="border border-zinc-800 rounded-xl bg-zinc-900 p-5">
				<h3 class="font-bold text-lg mb-2">Batch Processing</h3>
				<p class="text-zinc-400 text-sm">Upload multiple pages at once. Process entire playbook PDFs in one session — no need to upload page by page.</p>
			</div>
			<div class="border border-zinc-800 rounded-xl bg-zinc-900 p-5">
				<h3 class="font-bold text-lg mb-2">Formation Recognition</h3>
				<p class="text-zinc-400 text-sm">Automatically identifies formations like ZUG, LUZERN with all modifiers — A-BUMP, T-WING, I-OFF, and more.</p>
			</div>
			<div class="border border-zinc-800 rounded-xl bg-zinc-900 p-5">
				<h3 class="font-bold text-lg mb-2">Review & Edit</h3>
				<p class="text-zinc-400 text-sm">Before exporting, review all extracted plays in a clean editor. Make quick corrections before downloading.</p>
			</div>
		</section>

		<!-- CTA -->
		<section class="border border-zinc-800 rounded-2xl bg-zinc-900 p-8 text-center">
			<h3 class="text-2xl font-bold mb-2">Ready to Try It Out?</h3>
			<p class="text-zinc-400 mb-4">Start converting your playbooks for free.</p>
			<Button href="/upload">Start Converting Free</Button>
		</section>
	</main>
</div>
