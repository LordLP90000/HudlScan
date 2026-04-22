<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Button from '$lib/components/Button.svelte';

	// Ignored linter warnings: href paths are absolute and work correctly
</script>

<svelte:head>
	<title>Hudl Playbook AI - Convert Playbooks to Excel</title>
	<meta name="description" content="Upload your playbook screenshots or PDFs and let AI extract every play." />
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-white">
	<Nav />

	<main class="max-w-6xl mx-auto px-5 py-5">
		<!-- Hero Section -->
		<section
			class="border border-zinc-800 rounded-2xl bg-gradient-to-b from-orange-500/15 to-orange-500/2 p-6 mb-10"
		>
			<h2 class="text-3xl font-bold mb-2">Turn Hudl Playbooks into Excel Sheets</h2>
			<p class="text-zinc-400 mb-3.5">Upload your playbook screenshots or PDFs and let AI extract every play.</p>
			<div class="flex gap-2">
				<Button href="/upload">Start Converting Free</Button>
				<Button variant="secondary">Watch Demo</Button>
			</div>
		</section>

		<!-- Quick Links -->
		<section class="grid grid-cols-3 gap-5 mb-10">
			<a href="/features" class="border border-zinc-800 rounded-xl bg-zinc-900 p-5 hover:border-orange-500 transition-colors">
				<h3 class="font-bold text-lg mb-1">Features</h3>
				<p class="text-zinc-400 text-sm">See what's included</p>
			</a>
			<a href="/pricing" class="border border-zinc-800 rounded-xl bg-zinc-900 p-5 hover:border-orange-500 transition-colors">
				<h3 class="font-bold text-lg mb-1">Pricing</h3>
				<p class="text-zinc-400 text-sm">Simple plans</p>
			</a>
			<a href="/how-it-works" class="border border-zinc-800 rounded-xl bg-zinc-900 p-5 hover:border-orange-500 transition-colors">
				<h3 class="font-bold text-lg mb-1">How It Works</h3>
				<p class="text-zinc-400 text-sm">3 simple steps</p>
			</a>
		</section>

		<!-- Bottom CTA -->
		<section class="border border-zinc-800 rounded-2xl bg-zinc-900 p-8 text-center">
			<h3 class="text-2xl font-bold mb-2">Ready to Save Hours of Manual Work?</h3>
			<p class="text-zinc-400 mb-4">Join Hudl Playbook AI</p>
			<Button>Start Converting Free</Button>
		</section>
	</main>

	<!-- Footer -->
	<footer class="border-t border-zinc-800 mt-10 py-8">
		<div class="max-w-6xl mx-auto px-5">
			<div class="grid grid-cols-4 gap-8 text-sm">
				<div>
					<div class="flex items-center gap-2 font-bold mb-3">
						<div class="w-6 h-6 rounded bg-orange-500"></div>
						<span>Hudl Playbook AI</span>
					</div>
					<p class="text-zinc-500">Convert playbooks to Excel Automatically.</p>
				</div>
				<div>
					<h4 class="font-bold mb-3">Product</h4>
					<ul class="space-y-2 text-zinc-400">
						<li><a href="/features" class="hover:text-white">Features</a></li>
						<li><a href="/pricing" class="hover:text-white">Pricing</a></li>
						<li><button class="hover:text-white cursor-pointer">FAQ</button></li>
					</ul>
				</div>
				<div>
					<h4 class="font-bold mb-3">Company</h4>
					<ul class="space-y-2 text-zinc-400">
						<li><a href="/contact" class="hover:text-white">Contact</a></li>
						<li><a href="/feedback" class="hover:text-white">Feedback</a></li>
					</ul>
				</div>
				<div>
					<h4 class="font-bold mb-3">Legal</h4>
					<ul class="space-y-2 text-zinc-400">
						<li><button class="hover:text-white cursor-pointer">Privacy</button></li>
						<li><button class="hover:text-white cursor-pointer">Terms</button></li>
					</ul>
				</div>
			</div>
			<div class="text-zinc-600 text-xs mt-8 pt-8 border-t border-zinc-900">
				© 2024 Hudl Playbook AI. All rights reserved.
			</div>
		</div>
	</footer>
</div>
