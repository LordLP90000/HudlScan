<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<svelte:head>
	<title>Features - Hudl Playbook AI</title>
	<meta
		name="description"
		content="Extract every play, formation, and route from your playbooks automatically. No more manual data entry."
	/>
</svelte:head>

<div class="min-h-screen bg-zinc-950 pb-20 text-white md:pb-0">
	<Nav />

	<main class="mx-auto max-w-7xl px-6 py-12">
		<!-- Hero Section - Benefit-focused -->
		<section class="mb-16 text-center">
			<h1 class="mb-4 text-3xl font-bold md:text-5xl">
				Everything You Need to Automate Playbook Entry
			</h1>
			<p class="mx-auto max-w-2xl text-lg text-zinc-400">
				Stop typing plays by hand. Upload once, get your entire playbook in Excel—ready to use.
			</p>
		</section>

		<!-- Core Features - What matters most -->
		<section class="mb-16">
			<h2 class="mb-6 text-xl font-bold text-zinc-300">Core Features</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div
					class="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:border-orange-500/50"
				>
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20 text-2xl text-orange-400"
					>
						📄
					</div>
					<h3 class="mb-2 text-xl font-bold">PDF & Image Support</h3>
					<p class="text-zinc-400">
						Upload entire playbook PDFs or individual screenshots. We handle multi-page PDFs
						automatically—no need to split files.
					</p>
				</div>

				<div
					class="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:border-orange-500/50"
				>
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20 text-2xl text-orange-400"
					>
						🎯
					</div>
					<h3 class="mb-2 text-xl font-bold">Position-Specific Extraction</h3>
					<p class="text-zinc-400">
						Extract routes for your exact position—QB, RB, FB, X, Y, Z, or TE. Each gets dedicated
						route recognition.
					</p>
				</div>

				<div
					class="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:border-orange-500/50"
				>
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20 text-2xl text-orange-400"
					>
						🏈
					</div>
					<h3 class="mb-2 text-xl font-bold">Formation Recognition</h3>
					<p class="text-zinc-400">
						Identifies formations like ZUG, LUZERN with all modifiers—A-BUMP, T-WING, I-OFF, T-FLIP,
						and more.
					</p>
				</div>

				<div
					class="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:border-orange-500/50"
				>
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20 text-2xl text-orange-400"
					>
						✓
					</div>
					<h3 class="mb-2 text-xl font-bold">Excel Export</h3>
					<p class="text-zinc-400">
						Download a formatted spreadsheet ready for playcalling. Formation, concept, routes, and
						tags—all organized.
					</p>
				</div>
			</div>
		</section>

		<!-- What Gets Extracted - Concrete output -->
		<section class="mb-16">
			<h2 class="mb-6 text-xl font-bold text-zinc-300">What Gets Extracted</h2>
			<div class="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30">
				<div
					class="grid grid-cols-4 border-b border-zinc-800 bg-zinc-900/50 px-6 py-3 text-sm font-semibold text-zinc-300"
				>
					<div>Formation</div>
					<div>Concept</div>
					<div>Strength</div>
					<div>Route/Action</div>
				</div>
				<div class="grid grid-cols-4 border-b border-zinc-800/50 px-6 py-3 text-sm">
					<div class="text-zinc-300">Luzern A-Near</div>
					<div class="text-zinc-400">Power</div>
					<div class="text-zinc-400">Right</div>
					<div class="text-orange-400">Lead Block RB</div>
				</div>
				<div class="grid grid-cols-4 border-b border-zinc-800/50 px-6 py-3 text-sm">
					<div class="text-zinc-300">Zug A-Bump</div>
					<div class="text-zinc-400">Stick</div>
					<div class="text-zinc-400">Left</div>
					<div class="text-orange-400">5 Out</div>
				</div>
				<div class="grid grid-cols-4 border-b border-zinc-800/50 px-6 py-3 text-sm">
					<div class="text-zinc-300">Trips Right</div>
					<div class="text-zinc-400">Smash</div>
					<div class="text-zinc-400">Right</div>
					<div class="text-orange-400">Corner Route</div>
				</div>
				<div class="grid grid-cols-4 px-6 py-3 text-sm">
					<div class="text-zinc-300">Luzern I-Off</div>
					<div class="text-zinc-400">ISO</div>
					<div class="text-zinc-400">Right</div>
					<div class="text-orange-400">Hits A-Gap</div>
				</div>
			</div>
			<p class="mt-3 text-xs text-zinc-500">
				Example output. Actual results vary by playbook content.
			</p>
		</section>

		<!-- Additional Features -->
		<section class="mb-16">
			<h2 class="mb-6 text-xl font-bold text-zinc-300">More Features</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div class="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
					<h3 class="mb-2 font-bold">Review Before Export</h3>
					<p class="text-sm text-zinc-400">
						See all extracted plays in a clean editor. Make quick corrections before downloading.
					</p>
				</div>
				<div class="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
					<h3 class="mb-2 font-bold">Batch Processing</h3>
					<p class="text-sm text-zinc-400">
						Upload multiple files at once. Process entire playbooks in a single session.
					</p>
				</div>
				<div class="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
					<h3 class="mb-2 font-bold">Play Type Tags</h3>
					<p class="text-sm text-zinc-400">
						Automatic tagging for run, pass, RPO, and screen concepts for easy filtering.
					</p>
				</div>
			</div>
		</section>

		<!-- CTA -->
		<section class="rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center md:p-16">
			<h2 class="mb-4 text-2xl font-bold md:text-4xl">Ready to Stop Typing Plays?</h2>
			<p class="mx-auto mb-8 max-w-xl text-lg text-zinc-400">
				Upload your first playbook and get the full Excel output—free. No credit card required.
			</p>
			<Button href="/upload" size="lg">Upload Your First Playbook</Button>
		</section>
	</main>
</div>
