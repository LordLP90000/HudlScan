<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import { MAX_FILE_SIZE_MB } from '$lib/config';

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
	<title>Hudl Playbook AI - Extract Football Plays to Excel</title>
	<meta
		name="description"
		content="Transform American football playbooks into Excel spreadsheets with AI-powered OCR. Extract formations, concepts, routes, and tags in seconds."
	/>
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-white">
	<Nav />
	<main class="mx-auto max-w-7xl px-6 py-16">
		<div class="grid min-h-[80vh] items-center gap-12 lg:grid-cols-2">
			<div class="space-y-8">
				<div
					class="inline-flex items-center gap-3 rounded-full border border-zinc-800 bg-zinc-900 px-5 py-2"
				>
					<div class="h-2 w-2 animate-pulse rounded-full bg-orange-500"></div>
					<span class="text-sm font-medium tracking-wide">PLAY 1 • FORMATION • ZUG • TRIPS</span>
				</div>

				<div>
					<h1
						class="mb-6 text-5xl leading-[0.95] font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
					>
						<span class="block">Turn</span>
						<span class="block text-orange-400">Playbooks</span>
						<span class="block">Into</span>
						<span class="block">Excel</span>
					</h1>
					<p class="max-w-xl text-xl leading-relaxed text-zinc-400 md:text-2xl">
						Upload American football playbook pages. Get every formation, concept, route, and tag
						extracted to a spreadsheet in seconds.
					</p>
				</div>

				<div class="flex flex-col gap-4 sm:flex-row">
					<a
						href="/upload"
						class="group inline-flex items-center justify-center gap-3 rounded-xl bg-orange-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-orange-400"
					>
						<span>Upload Playbook</span>
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 7l5 5m0 0l-5 5m5-5H6"
							/>
						</svg>
					</a>
					<a
						href="/how-it-works"
						class="inline-flex items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-8 py-4 text-lg font-medium text-white transition-all hover:bg-zinc-800"
					>
						<span>See How It Works</span>
					</a>
				</div>
			</div>

			<div class="relative rounded-3xl border-2 border-zinc-800 bg-zinc-900 p-8">
				<div
					class="relative mb-6 aspect-video overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950"
				>
					<div class="absolute inset-0 grid grid-rows-4">
						<div class="border-b border-zinc-800"></div>
						<div class="border-b border-zinc-800"></div>
						<div class="border-b border-zinc-800"></div>
						<div></div>
					</div>
					<svg
						class="absolute inset-0 h-full w-full"
						viewBox="0 0 100 100"
						preserveAspectRatio="none"
					>
						<path
							d="M 15 70 L 15 30"
							stroke="#f97316"
							stroke-width="3"
							fill="none"
							class="route-draw"
						/>
						<circle cx="15" cy="70" r="3" fill="#f97316" class="route-fade" />
						<path
							d="M 35 70 Q 35 50 50 35 L 50 20"
							stroke="#f97316"
							stroke-width="3"
							fill="none"
							class="route-draw-delay"
						/>
						<circle cx="35" cy="70" r="3" fill="#f97316" class="route-fade" />
						<path
							d="M 55 70 L 75 50"
							stroke="#f97316"
							stroke-width="3"
							fill="none"
							class="route-draw-delay-2"
						/>
						<circle cx="55" cy="70" r="3" fill="#f97316" class="route-fade" />
						<path
							d="M 75 70 Q 85 65 95 65"
							stroke="#f97316"
							stroke-width="3"
							fill="none"
							class="route-draw-delay-3"
						/>
						<circle cx="75" cy="70" r="3" fill="#f97316" class="route-fade" />
						<circle cx="45" cy="60" r="4" fill="white" class="route-fade" />
					</svg>
					<div class="absolute bottom-2 left-3 font-mono text-xs text-zinc-600">
						ZUG • TRIPS • RIGHT
					</div>
				</div>

				<div class="space-y-3">
					<div class="flex items-center gap-3 text-sm">
						<div class="w-16 font-mono text-xs text-zinc-500">FORMATION</div>
						<div class="flex-1 font-medium">Zug Trips Right</div>
					</div>
					<div class="flex items-center gap-3 text-sm">
						<div class="w-16 font-mono text-xs text-zinc-500">CONCEPT</div>
						<div class="flex-1 font-medium">Smash</div>
					</div>
					<div class="flex items-center gap-3 text-sm">
						<div class="w-16 font-mono text-xs text-zinc-500">TAGS</div>
						<div class="flex flex-1 gap-2">
							<span class="rounded bg-orange-500/20 px-2 py-0.5 text-xs font-medium text-orange-400"
								>PASS</span
							>
							<span class="rounded bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-400"
								>2x2</span
							>
						</div>
					</div>
				</div>
			</div>
		</div>

		<section class="border-y border-zinc-800 py-20">
			<div class="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
				<div>
					<div class="mb-2 text-5xl font-bold text-orange-400 tabular-nums md:text-6xl">
						<span>{uploadsCount}</span>K+
					</div>
					<div class="text-zinc-400">Plays Extracted</div>
				</div>
				<div>
					<div class="mb-2 text-5xl font-bold text-orange-400 tabular-nums md:text-6xl">
						<span>{accuracyValue}</span>%
					</div>
					<div class="text-zinc-400">Accuracy Rate</div>
				</div>
				<div>
					<div class="mb-2 text-5xl font-bold text-orange-400 md:text-6xl">0</div>
					<div class="text-zinc-400">Manual Entry</div>
				</div>
			</div>
		</section>

		<section class="py-24">
			<div class="mb-12">
				<h2 class="mb-6 text-4xl font-bold md:text-5xl">What You Get in Your Spreadsheet</h2>
				<p class="max-w-2xl text-xl text-zinc-400">
					Every play, fully documented. Ready to filter, sort, and share with your coaching staff.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div
					class="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-all hover:border-orange-500/50"
				>
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/20 font-mono text-2xl text-orange-400"
					>
						#
					</div>
					<h3 class="mb-2 text-xl font-bold">Every Play Name</h3>
					<p class="text-zinc-400">
						Power, ISO, Zone, Sweep, Counter, Trey, Fold, and more—all identified with formation
						context.
					</p>
				</div>

				<div
					class="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-all hover:border-orange-500/50"
				>
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/20 text-2xl text-orange-400"
					>
						📐
					</div>
					<h3 class="mb-2 text-xl font-bold">Formation & Strength</h3>
					<p class="text-zinc-400">
						Luzern, Zug, Trips, Plus, Ace, Gun—exactly as drawn. Weak/strong side tags included.
					</p>
				</div>

				<div
					class="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-all hover:border-orange-500/50"
				>
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/20 text-2xl text-orange-400"
					>
						🏃
					</div>
					<h3 class="mb-2 text-xl font-bold">Position Assignments</h3>
					<p class="text-zinc-400">
						Routes, blocks, and actions for QB, RB, WR, TE, OL. Know who's doing what on every play.
					</p>
				</div>

				<div
					class="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-all hover:border-orange-500/50"
				>
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/20 text-2xl text-orange-400"
					>
						🏷️
					</div>
					<h3 class="mb-2 text-xl font-bold">Smart Tags</h3>
					<p class="text-zinc-400">
						Play type tags (run, pass, RPO, screen) for instant filtering. Sort your sheet by
						situation.
					</p>
				</div>
			</div>
		</section>

		<section class="bg-zinc-900/50 py-24">
			<div class="mb-12 text-center">
				<h2 class="mb-6 text-4xl font-bold md:text-5xl">Three Steps to Game Ready</h2>
			</div>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				<div class="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
					<div class="mb-4 text-6xl font-bold text-zinc-800">1</div>
					<div
						class="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-orange-500/20 text-2xl text-orange-400"
					>
						📄
					</div>
					<h3 class="mb-2 text-xl font-bold">Upload Playbook</h3>
					<p class="text-zinc-400">
						Drag & drop playbook pages as PDF or images. Up to {MAX_FILE_SIZE_MB}MB per file, bulk
						upload supported.
					</p>
				</div>

				<div class="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
					<div class="mb-4 text-6xl font-bold text-zinc-800">2</div>
					<div
						class="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-orange-500/20 text-2xl text-orange-400"
					>
						⚡
					</div>
					<h3 class="mb-2 text-xl font-bold">AI Extraction</h3>
					<p class="text-zinc-400">
						Our vision model analyzes each page, identifying formations, routes, and concepts in
						seconds.
					</p>
				</div>

				<div class="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
					<div class="mb-4 text-6xl font-bold text-zinc-800">3</div>
					<div
						class="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-orange-500/20 text-2xl text-orange-400"
					>
						📊
					</div>
					<h3 class="mb-2 text-xl font-bold">Download Excel</h3>
					<p class="text-zinc-400">
						Get a clean spreadsheet with all plays. Sort, filter, and share with your staff
						instantly.
					</p>
				</div>
			</div>
		</section>

		<section class="py-24 text-center">
			<div
				class="mx-auto max-w-4xl rounded-3xl border-2 border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-orange-500/5 p-12 md:p-16"
			>
				<h2 class="mb-6 text-4xl font-bold md:text-5xl">Ready to Save Hours of Data Entry?</h2>
				<p class="mx-auto mb-10 max-w-2xl text-xl text-zinc-400">
					Upload your first playbook free. See the extraction quality before you commit.
				</p>
				<a
					href="/upload"
					class="inline-flex items-center justify-center gap-3 rounded-xl bg-orange-500 px-10 py-5 text-lg font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-orange-400"
				>
					<span>Upload Playbook Free</span>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 7l5 5m0 0l-5 5m5-5H6"
						/>
					</svg>
				</a>
			</div>
		</section>
	</main>

	<footer class="border-t border-zinc-800 py-16">
		<div class="mx-auto max-w-7xl px-6">
			<div class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
				<div>
					<div class="mb-6 flex items-center gap-3 text-xl font-bold">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600"
						>
							<span class="font-bold text-white">H</span>
						</div>
					<span>Hudl Playbook AI</span>
					</div>
					<p class="text-zinc-500">
						Extract football plays to Excel automatically. Save hours of manual data entry.
					</p>
				</div>

				<div>
					<h4 class="mb-4 font-bold">Product</h4>
					<ul class="space-y-3 text-zinc-400">
						<li>
							<a href="/how-it-works" class="transition-colors hover:text-white">How It Works</a>
						</li>
						<li><a href="/pricing" class="transition-colors hover:text-white">Pricing</a></li>
						<li><a href="/features" class="transition-colors hover:text-white">Features</a></li>
					</ul>
				</div>

				<div>
					<h4 class="mb-4 font-bold">Company</h4>
					<ul class="space-y-3 text-zinc-400">
						<li><a href="/contact" class="transition-colors hover:text-white">Contact</a></li>
						<li><a href="/feedback" class="transition-colors hover:text-white">Feedback</a></li>
					</ul>
				</div>

				<div>
					<h4 class="mb-4 font-bold">Legal</h4>
					<ul class="space-y-3 text-zinc-400">
						<li class="text-zinc-600">Privacy Policy (coming soon)</li>
						<li class="text-zinc-600">Terms of Service (coming soon)</li>
					</ul>
				</div>
			</div>

			<div class="mt-12 border-t border-zinc-900 pt-8 text-sm text-zinc-600">
				© {new Date().getFullYear()} Hudl Playbook AI. All rights reserved.
			</div>
		</div>
	</footer>
</div>

<style>
	@keyframes routeDraw {
		from {
			stroke-dashoffset: 100;
			opacity: 0;
		}
		to {
			stroke-dashoffset: 0;
			opacity: 1;
		}
	}

	@keyframes routeFade {
		from {
			opacity: 0;
			transform: scale(0.5);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
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
