<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Button from '$lib/components/Button.svelte';

	// Ignored linter warnings: href paths are absolute and work correctly
</script>

<svelte:head>
	<title>Hudl Playbook AI - Extract Football Plays in Seconds</title>
	<meta name="description" content="Upload playbook screenshots and get every play, formation, and concept extracted to Excel instantly. No manual data entry required." />
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-white">
	<Nav />

	<main class="max-w-7xl mx-auto px-6 py-12">
		<!-- Hero Section - Single clear CTA, specific benefit -->
		<section
			class="border border-zinc-800 rounded-3xl bg-gradient-to-b from-orange-500/15 to-orange-500/2 p-10 md:p-16 mb-20"
		>
			<div class="max-w-3xl">
				<h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
					Extract Football Plays to Excel in Seconds
				</h1>
				<p class="text-zinc-300 text-xl md:text-2xl mb-8 leading-relaxed">
					Upload your Hudl playbook screenshots. Get every play, formation, and concept in a
					spreadsheet—without typing a single thing.
				</p>
				<div class="flex flex-col sm:flex-row gap-4 items-start">
					<Button href="/upload" size="lg" fullWidth
						>Upload Your First Playbook</Button
					>
					<a
						href="/how-it-works"
						class="text-zinc-400 hover:text-white text-sm inline-flex items-center gap-1 mt-2 sm:mt-4 transition-colors"
					>
						<span>See how it works</span>
						<span class="text-lg">→</span>
					</a>
				</div>
			</div>
		</section>

		<!-- Social Proof - Trust indicators -->
		<section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 text-center">
			<div class="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
				<div class="text-3xl md:text-4xl font-bold text-orange-400 mb-2">2 min</div>
				<div class="text-zinc-400">Average upload to results</div>
			</div>
			<div class="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
				<div class="text-3xl md:text-4xl font-bold text-orange-400 mb-2">99%</div>
				<div class="text-zinc-400">Play extraction accuracy</div>
			</div>
			<div class="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
				<div class="text-3xl md:text-4xl font-bold text-orange-400 mb-2">0</div>
				<div class="text-zinc-400">Manual typing required</div>
			</div>
		</section>

		<!-- What You Get - Concrete outcomes -->
		<section class="mb-20">
			<h2 class="text-2xl md:text-3xl font-bold mb-8">What you get in your spreadsheet</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="flex items-start gap-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6">
					<div
						class="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-xl shrink-0"
					>
						✓
					</div>
					<div>
						<h3 class="font-bold text-lg mb-1">Every play name</h3>
						<p class="text-zinc-400 text-sm">Power, ISO, Zone, Sweep, Counter, and more—all identified</p>
					</div>
				</div>
				<div class="flex items-start gap-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6">
					<div
						class="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-xl shrink-0"
					>
						✓
					</div>
					<div>
						<h3 class="font-bold text-lg mb-1">Formation & strength</h3>
						<p class="text-zinc-400 text-sm">Luzern, Zug, Trips, Plus—exactly as drawn</p>
					</div>
				</div>
				<div class="flex items-start gap-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6">
					<div
						class="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-xl shrink-0"
					>
						✓
					</div>
					<div>
						<h3 class="font-bold text-lg mb-1">Position assignments</h3>
						<p class="text-zinc-400 text-sm">Routes and blocks for QB, RB, WR, TE, OL</p>
					</div>
				</div>
				<div class="flex items-start gap-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6">
					<div
						class="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-xl shrink-0"
					>
						✓
					</div>
					<div>
						<h3 class="font-bold text-lg mb-1">Tag & concept</h3>
						<p class="text-zinc-400 text-sm">Play type tags (run, pass, RPO) for easy filtering</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Problem/Solution - Relatable pain point -->
		<section
			class="border border-zinc-800 rounded-3xl bg-linear-to-br from-zinc-900 to-zinc-900/50 p-10 md:p-16 mb-20"
		>
			<div class="max-w-3xl mx-auto text-center">
				<h2 class="text-2xl md:text-4xl font-bold mb-6">
					Stop spending hours manually typing plays
				</h2>
				<p class="text-zinc-400 text-lg mb-8 leading-relaxed">
					Coaches waste 2-3 hours per playbook screenshot—taking photos, zooming in, typing
					into Excel, and double-checking for errors. HudlScanner does it in seconds.
				</p>
				<Button href="/upload" size="lg">Try It Free - No Card Required</Button>
			</div>
		</section>

		<!-- Secondary CTA - After understanding value -->
		<section class="border border-zinc-800 rounded-3xl bg-zinc-900 p-10 md:p-16 text-center">
			<h2 class="text-2xl md:text-4xl font-bold mb-4">
				Ready to save 3+ hours per playbook?
			</h2>
			<p class="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto">
				Upload your first playbook and get the full Excel output—free. No credit card, no
				commitment.
			</p>
			<Button href="/upload" size="lg">Upload Now</Button>
		</section>
	</main>

	<!-- Footer - Fixed non-functional links -->
	<footer class="border-t border-zinc-800 mt-20 py-12">
		<div class="max-w-7xl mx-auto px-6">
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
				<div>
					<div class="flex items-center gap-2 font-bold mb-4">
						<div class="w-6 h-6 rounded bg-orange-500"></div>
						<span>Hudl Playbook AI</span>
					</div>
					<p class="text-zinc-500">Extract football plays to Excel automatically.</p>
				</div>
				<div>
					<h4 class="font-bold mb-4">Product</h4>
					<ul class="space-y-3 text-zinc-400">
						<li><a href="/how-it-works" class="hover:text-white transition-colors">How It Works</a></li>
						<li><a href="/pricing" class="hover:text-white transition-colors">Pricing</a></li>
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
						<!-- Links commented out until pages exist -->
						<li class="text-zinc-600">Privacy Policy (coming soon)</li>
						<li class="text-zinc-600">Terms of Service (coming soon)</li>
					</ul>
				</div>
			</div>
			<div class="text-zinc-600 text-sm mt-12 pt-8 border-t border-zinc-900">
				© 2024 Hudl Playbook AI. All rights reserved.
			</div>
		</div>
	</footer>
</div>
