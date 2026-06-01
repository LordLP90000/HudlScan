<script lang="ts">
	let uploadsCount = $state(0);
	let accuracyValue = $state(0);

	$effect(() => {
		const animate = (target: number, setter: (v: number) => void) => {
			let current = 0;
			const step = target / 40;
			const timer = setInterval(() => {
				current += step;
				if (current >= target) {
					setter(target);
					clearInterval(timer);
				} else {
					setter(Math.floor(current));
				}
			}, 30);
		};

		animate(1247, (v) => (uploadsCount = v));
		animate(99, (v) => (accuracyValue = v));
	});
</script>

<svelte:head>
	<title>HudlScanner - Extract Football Plays to Excel</title>
	<meta name="description" content="Transform American football playbooks into Excel spreadsheets with AI-powered OCR. Extract formations, concepts, routes, and tags in seconds." />
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-white">
	<main class="max-w-7xl mx-auto px-6 py-16">
		<div class="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
			<div class="space-y-8">
				<div class="inline-flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-full px-5 py-2">
					<div class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
					<span class="text-sm font-medium tracking-wide">PLAY 1 • FORMATION • ZUG • TRIPS</span>
				</div>

				<div>
					<h1 class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-6">
						<span class="block">Turn</span>
						<span class="block text-orange-400">Playbooks</span>
						<span class="block">Into</span>
						<span class="block">Excel</span>
					</h1>
					<p class="text-xl md:text-2xl text-zinc-400 max-w-xl leading-relaxed">
						Upload American football playbook pages. Get every formation, concept, route, and tag extracted to a spreadsheet in seconds.
					</p>
				</div>

				<div class="flex flex-col sm:flex-row gap-4">
					<a
						href="/upload"
						class="group inline-flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-400 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg"
					>
						<span>Upload Playbook</span>
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
						</svg>
					</a>
					<a
						href="/how-it-works"
						class="inline-flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-lg px-8 py-4 rounded-xl border border-zinc-800 transition-all"
					>
						<span>See How It Works</span>
					</a>
				</div>
			</div>

			<div class="relative bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-8">
				<div class="aspect-video bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 mb-6 relative">
					<div class="absolute inset-0 grid grid-rows-4">
						<div class="border-b border-zinc-800"></div>
						<div class="border-b border-zinc-800"></div>
						<div class="border-b border-zinc-800"></div>
						<div></div>
					</div>
					<svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
						<path d="M 15 70 L 15 30" stroke="#f97316" stroke-width="3" fill="none" class="route-draw"/>
						<circle cx="15" cy="70" r="3" fill="#f97316" class="route-fade"/>
						<path d="M 35 70 Q 35 50 50 35 L 50 20" stroke="#f97316" stroke-width="3" fill="none" class="route-draw-delay"/>
						<circle cx="35" cy="70" r="3" fill="#f97316" class="route-fade"/>
						<path d="M 55 70 L 75 50" stroke="#f97316" stroke-width="3" fill="none" class="route-draw-delay-2"/>
						<circle cx="55" cy="70" r="3" fill="#f97316" class="route-fade"/>
						<path d="M 75 70 Q 85 65 95 65" stroke="#f97316" stroke-width="3" fill="none" class="route-draw-delay-3"/>
						<circle cx="75" cy="70" r="3" fill="#f97316" class="route-fade"/>
						<circle cx="45" cy="60" r="4" fill="white" class="route-fade"/>
					</svg>
					<div class="absolute bottom-2 left-3 text-xs font-mono text-zinc-600">
						ZUG • TRIPS • RIGHT
					</div>
				</div>

				<div class="space-y-3">
					<div class="flex items-center gap-3 text-sm">
						<div class="w-16 text-zinc-500 font-mono text-xs">FORMATION</div>
						<div class="flex-1 font-medium">Zug Trips Right</div>
					</div>
					<div class="flex items-center gap-3 text-sm">
						<div class="w-16 text-zinc-500 font-mono text-xs">CONCEPT</div>
						<div class="flex-1 font-medium">Smash</div>
					</div>
					<div class="flex items-center gap-3 text-sm">
						<div class="w-16 text-zinc-500 font-mono text-xs">TAGS</div>
						<div class="flex-1 flex gap-2">
							<span class="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded text-xs font-medium">PASS</span>
							<span class="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-xs font-medium">2x2</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<section class="py-20 border-y border-zinc-800">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
				<div>
					<div class="text-5xl md:text-6xl font-bold text-orange-400 mb-2 tabular-nums">
						<span>{uploadsCount}</span>K+
					</div>
					<div class="text-zinc-400">Plays Extracted</div>
				</div>
				<div>
					<div class="text-5xl md:text-6xl font-bold text-orange-400 mb-2 tabular-nums">
						<span>{accuracyValue}</span>%
					</div>
					<div class="text-zinc-400">Accuracy Rate</div>
				</div>
				<div>
					<div class="text-5xl md:text-6xl font-bold text-orange-400 mb-2">0</div>
					<div class="text-zinc-400">Manual Entry</div>
				</div>
			</div>
		</section>

		<section class="py-24">
			<div class="mb-12">
				<h2 class="text-4xl md:text-5xl font-bold mb-6">What You Get in Your Spreadsheet</h2>
				<p class="text-xl text-zinc-400 max-w-2xl">Every play, fully documented. Ready to filter, sort, and share with your coaching staff.</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-orange-500/50 transition-all">
					<div class="w-12 h-12 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-2xl mb-4 font-mono">#</div>
					<h3 class="font-bold text-xl mb-2">Every Play Name</h3>
					<p class="text-zinc-400">Power, ISO, Zone, Sweep, Counter, Trey, Fold, and more—all identified with formation context.</p>
				</div>

				<div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-orange-500/50 transition-all">
					<div class="w-12 h-12 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-2xl mb-4">📐</div>
					<h3 class="font-bold text-xl mb-2">Formation & Strength</h3>
					<p class="text-zinc-400">Luzern, Zug, Trips, Plus, Ace, Gun—exactly as drawn. Weak/strong side tags included.</p>
				</div>

				<div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-orange-500/50 transition-all">
					<div class="w-12 h-12 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-2xl mb-4">🏃</div>
					<h3 class="font-bold text-xl mb-2">Position Assignments</h3>
					<p class="text-zinc-400">Routes, blocks, and actions for QB, RB, WR, TE, OL. Know who's doing what on every play.</p>
				</div>

				<div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-orange-500/50 transition-all">
					<div class="w-12 h-12 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-2xl mb-4">🏷️</div>
					<h3 class="font-bold text-xl mb-2">Smart Tags</h3>
					<p class="text-zinc-400">Play type tags (run, pass, RPO, screen) for instant filtering. Sort your sheet by situation.</p>
				</div>
			</div>
		</section>

		<section class="py-24 bg-zinc-900/50">
			<div class="text-center mb-12">
				<h2 class="text-4xl md:text-5xl font-bold mb-6">Three Steps to Game Ready</h2>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div class="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
					<div class="text-6xl font-bold text-zinc-800 mb-4">1</div>
					<div class="w-16 h-16 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-2xl mb-4">📄</div>
					<h3 class="font-bold text-xl mb-2">Upload Playbook</h3>
					<p class="text-zinc-400">Drag & drop playbook pages as PDF or images. Up to 10MB per file, bulk upload supported.</p>
				</div>

				<div class="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
					<div class="text-6xl font-bold text-zinc-800 mb-4">2</div>
					<div class="w-16 h-16 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-2xl mb-4">⚡</div>
					<h3 class="font-bold text-xl mb-2">AI Extraction</h3>
					<p class="text-zinc-400">Our vision model analyzes each page, identifying formations, routes, and concepts in seconds.</p>
				</div>

				<div class="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
					<div class="text-6xl font-bold text-zinc-800 mb-4">3</div>
					<div class="w-16 h-16 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-2xl mb-4">📊</div>
					<h3 class="font-bold text-xl mb-2">Download Excel</h3>
					<p class="text-zinc-400">Get a clean spreadsheet with all plays. Sort, filter, and share with your staff instantly.</p>
				</div>
			</div>
		</section>

		<section class="py-24 text-center">
			<div class="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-2 border-orange-500/30 rounded-3xl p-12 md:p-16 max-w-4xl mx-auto">
				<h2 class="text-4xl md:text-5xl font-bold mb-6">Ready to Save Hours of Data Entry?</h2>
				<p class="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">Upload your first playbook free. See the extraction quality before you commit.</p>
				<a
					href="/upload"
					class="inline-flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-400 text-white font-bold text-lg px-10 py-5 rounded-xl transition-all hover:scale-105 shadow-xl"
				>
					<span>Upload Playbook Free</span>
					<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
					</svg>
				</a>
			</div>
		</section>
	</main>

	<footer class="border-t border-zinc-800 py-16">
		<div class="max-w-7xl mx-auto px-6">
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
				<div>
					<div class="flex items-center gap-3 font-bold text-xl mb-6">
						<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
							<span class="text-white font-bold">H</span>
						</div>
						<span>HudlScanner</span>
					</div>
					<p class="text-zinc-500">Extract football plays to Excel automatically. Save hours of manual data entry.</p>
				</div>

				<div>
					<h4 class="font-bold mb-4">Product</h4>
					<ul class="space-y-3 text-zinc-400">
						<li><a href="/how-it-works" class="hover:text-white transition-colors">How It Works</a></li>
						<li><a href="/pricing" class="hover:text-white transition-colors">Pricing</a></li>
						<li><a href="/features" class="hover:text-white transition-colors">Features</a></li>
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
						<li class="text-zinc-600">Privacy Policy (coming soon)</li>
						<li class="text-zinc-600">Terms of Service (coming soon)</li>
					</ul>
				</div>
			</div>

			<div class="text-zinc-600 text-sm mt-12 pt-8 border-t border-zinc-900">
				© {new Date().getFullYear()} HudlScanner. All rights reserved.
			</div>
		</div>
	</footer>
</div>

<style>
	@keyframes routeDraw {
		from { stroke-dashoffset: 100; opacity: 0; }
		to { stroke-dashoffset: 0; opacity: 1; }
	}

	@keyframes routeFade {
		from { opacity: 0; transform: scale(0.5); }
		to { opacity: 1; transform: scale(1); }
	}

	.route-draw {
		stroke-dasharray: 100;
		stroke-dashoffset: 100;
		animation: routeDraw 1.5s ease-out forwards;
	}

	.route-draw-delay {
		stroke-dasharray: 100;
		stroke-dashoffset: 100;
		animation: routeDraw 1.5s ease-out 0.2s forwards;
	}

	.route-draw-delay-2 {
		stroke-dasharray: 100;
		stroke-dashoffset: 100;
		animation: routeDraw 1.5s ease-out 0.4s forwards;
	}

	.route-draw-delay-3 {
		stroke-dasharray: 100;
		stroke-dashoffset: 100;
		animation: routeDraw 1.5s ease-out 0.6s forwards;
	}

	.route-fade {
		animation: routeFade 0.8s ease-out forwards;
	}
</style>
