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

	<main class="max-w-7xl mx-auto px-6 py-12">
		<!-- Hero Section -->
		<section
			class="border border-zinc-800 rounded-3xl bg-gradient-to-b from-orange-500/15 to-orange-500/2 p-10 md:p-16 mb-16"
		>
			<h1 class="text-4xl md:text-5xl font-bold mb-4">Turn Hudl Playbooks into Excel Sheets</h1>
			<p class="text-zinc-400 text-lg md:text-xl mb-8 max-w-2xl">
				Upload your playbook screenshots or PDFs and let AI extract every play.
			</p>
			<div class="flex flex-wrap gap-4">
				<Button href="/upload" size="lg">Start Converting Free</Button>
				<Button variant="secondary" size="lg">Watch Demo</Button>
			</div>
		</section>

		<!-- Quick Links -->
		<section class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
			<a href="/features" class="border border-zinc-800 rounded-2xl bg-zinc-900 p-8 hover:border-orange-500 transition-colors group">
				<h3 class="font-bold text-xl mb-2 group-hover:text-orange-400 transition-colors">Features</h3>
				<p class="text-zinc-400">See what's included</p>
			</a>
			<a href="/pricing" class="border border-zinc-800 rounded-2xl bg-zinc-900 p-8 hover:border-orange-500 transition-colors group">
				<h3 class="font-bold text-xl mb-2 group-hover:text-orange-400 transition-colors">Pricing</h3>
				<p class="text-zinc-400">Simple plans</p>
			</a>
			<a href="/how-it-works" class="border border-zinc-800 rounded-2xl bg-zinc-900 p-8 hover:border-orange-500 transition-colors group">
				<h3 class="font-bold text-xl mb-2 group-hover:text-orange-400 transition-colors">How It Works</h3>
				<p class="text-zinc-400">3 simple steps</p>
			</a>
		</section>

		<!-- Bottom CTA -->
		<section class="border border-zinc-800 rounded-3xl bg-zinc-900 p-12 md:p-16 text-center">
			<h2 class="text-3xl md:text-4xl font-bold mb-3">Ready to Save Hours of Manual Work?</h2>
			<p class="text-zinc-400 text-lg mb-8">Join Hudl Playbook AI</p>
			<Button size="lg">Start Converting Free</Button>
		</section>
	</main>

	<!-- Footer -->
	<footer class="border-t border-zinc-800 mt-20 py-12">
		<div class="max-w-7xl mx-auto px-6">
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
				<div>
					<div class="flex items-center gap-2 font-bold mb-4">
						<div class="w-6 h-6 rounded bg-orange-500"></div>
						<span>Hudl Playbook AI</span>
					</div>
					<p class="text-zinc-500">Convert playbooks to Excel Automatically.</p>
				</div>
				<div>
					<h4 class="font-bold mb-4">Product</h4>
					<ul class="space-y-3 text-zinc-400">
						<li><a href="/features" class="hover:text-white transition-colors">Features</a></li>
						<li><a href="/pricing" class="hover:text-white transition-colors">Pricing</a></li>
						<li><button class="hover:text-white cursor-pointer transition-colors">FAQ</button></li>
					</ul>
				</div>
				<div>
					<h4 class="font-bold mb-4">Company</h4>
					<ul class="space-y-3 text-zinc-400">
						<li><a href="/contact" class="hover:text-white transition-colors">Contact</a></li>
						<li><a href="/feedback" class="hover:text-white transition-colors">Feedback</a></li>
					</ul>
				</div>
				<div>
					<h4 class="font-bold mb-4">Legal</h4>
					<ul class="space-y-3 text-zinc-400">
						<li><button class="hover:text-white cursor-pointer transition-colors">Privacy</button></li>
						<li><button class="hover:text-white cursor-pointer transition-colors">Terms</button></li>
					</ul>
				</div>
			</div>
			<div class="text-zinc-600 text-sm mt-12 pt-8 border-t border-zinc-900">
				© 2024 Hudl Playbook AI. All rights reserved.
			</div>
		</div>
	</footer>
</div>
