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

<div class="min-h-screen bg-zinc-950 text-white pb-20 md:pb-0">
	<Nav />

	<main class="max-w-7xl mx-auto px-6 py-12">
		<!-- Hero Section - Benefit-focused -->
		<section class="text-center mb-16">
			<h1 class="text-3xl md:text-5xl font-bold mb-4">Everything You Need to Automate Playbook Entry</h1>
			<p class="text-zinc-400 text-lg max-w-2xl mx-auto">
				Stop typing plays by hand. Upload once, get your entire playbook in Excel—ready to
				use.
			</p>
		</section>

		<!-- Core Features - What matters most -->
		<section class="mb-16">
			<h2 class="text-xl font-bold mb-6 text-zinc-300">Core Features</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div
					class="border border-zinc-800 rounded-2xl bg-zinc-900/50 p-6 hover:border-orange-500/50 transition-colors"
				>
					<div class="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-2xl mb-4">
						📄
					</div>
					<h3 class="font-bold text-xl mb-2">PDF & Image Support</h3>
					<p class="text-zinc-400">
						Upload entire playbook PDFs or individual screenshots. We handle multi-page PDFs
						automatically—no need to split files.
					</p>
				</div>

				<div
					class="border border-zinc-800 rounded-2xl bg-zinc-900/50 p-6 hover:border-orange-500/50 transition-colors"
				>
					<div class="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-2xl mb-4">
						🎯
					</div>
					<h3 class="font-bold text-xl mb-2">Position-Specific Extraction</h3>
					<p class="text-zinc-400">
						Extract routes for your exact position—QB, RB, FB, X, Y, Z, or TE. Each gets
						dedicated route recognition.
					</p>
				</div>

				<div
					class="border border-zinc-800 rounded-2xl bg-zinc-900/50 p-6 hover:border-orange-500/50 transition-colors"
				>
					<div class="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-2xl mb-4">
						🏈
					</div>
					<h3 class="font-bold text-xl mb-2">Formation Recognition</h3>
					<p class="text-zinc-400">
						Identifies formations like ZUG, LUZERN with all modifiers—A-BUMP, T-WING,
						I-OFF, T-FLIP, and more.
					</p>
				</div>

				<div
					class="border border-zinc-800 rounded-2xl bg-zinc-900/50 p-6 hover:border-orange-500/50 transition-colors"
				>
					<div class="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-2xl mb-4">
						✓
					</div>
					<h3 class="font-bold text-xl mb-2">Excel Export</h3>
					<p class="text-zinc-400">
						Download a formatted spreadsheet ready for playcalling. Formation, concept,
						routes, and tags—all organized.
					</p>
				</div>
			</div>
		</section>

		<!-- What Gets Extracted - Concrete output -->
		<section class="mb-16">
			<h2 class="text-xl font-bold mb-6 text-zinc-300">What Gets Extracted</h2>
			<div class="border border-zinc-800 rounded-2xl bg-zinc-900/30 overflow-hidden">
				<div class="grid grid-cols-4 bg-zinc-900/50 px-6 py-3 text-sm font-semibold text-zinc-300 border-b border-zinc-800">
					<div>Formation</div>
					<div>Concept</div>
					<div>Strength</div>
					<div>Route/Action</div>
				</div>
				<div class="grid grid-cols-4 px-6 py-3 text-sm border-b border-zinc-800/50">
					<div class="text-zinc-300">Luzern A-Near</div>
					<div class="text-zinc-400">Power</div>
					<div class="text-zinc-400">Right</div>
					<div class="text-orange-400">Lead Block RB</div>
				</div>
				<div class="grid grid-cols-4 px-6 py-3 text-sm border-b border-zinc-800/50">
					<div class="text-zinc-300">Zug A-Bump</div>
					<div class="text-zinc-400">Stick</div>
					<div class="text-zinc-400">Left</div>
					<div class="text-orange-400">5 Out</div>
				</div>
				<div class="grid grid-cols-4 px-6 py-3 text-sm border-b border-zinc-800/50">
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
			<p class="text-xs text-zinc-500 mt-3">Example output. Actual results vary by playbook content.</p>
		</section>

		<!-- Additional Features -->
		<section class="mb-16">
			<h2 class="text-xl font-bold mb-6 text-zinc-300">More Features</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div class="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5">
					<h3 class="font-bold mb-2">Review Before Export</h3>
					<p class="text-zinc-400 text-sm">
						See all extracted plays in a clean editor. Make quick corrections before
						downloading.
					</p>
				</div>
				<div class="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5">
					<h3 class="font-bold mb-2">Batch Processing</h3>
					<p class="text-zinc-400 text-sm">
						Upload multiple files at once. Process entire playbooks in a single session.
					</p>
				</div>
				<div class="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5">
					<h3 class="font-bold mb-2">Play Type Tags</h3>
					<p class="text-zinc-400 text-sm">
						Automatic tagging for run, pass, RPO, and screen concepts for easy filtering.
					</p>
				</div>
			</div>
		</section>

		<!-- CTA -->
		<section class="border border-zinc-800 rounded-3xl bg-zinc-900 p-10 md:p-16 text-center">
			<h2 class="text-2xl md:text-4xl font-bold mb-4">Ready to Stop Typing Plays?</h2>
			<p class="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
				Upload your first playbook and get the full Excel output—free. No credit card
				required.
			</p>
			<Button href="/upload" size="lg">Upload Your First Playbook</Button>
		</section>
	</main>
</div>
