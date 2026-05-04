<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<svelte:head>
	<title>How It Works - Hudl Playbook AI</title>
	<meta
		name="description"
		content="Three simple steps to convert your football playbook into Excel: upload, let AI extract, download your spreadsheet."
	/>
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-white pb-20 md:pb-0">
	<Nav />

	<main class="max-w-7xl mx-auto px-6 py-12">
		<!-- Hero Section -->
		<section class="text-center mb-16">
			<h1 class="text-3xl md:text-5xl font-bold mb-4">Three Steps to Your Playbook in Excel</h1>
			<p class="text-zinc-400 text-lg max-w-xl mx-auto">
				No manual typing. No formatting headaches. Just upload and get your plays.
			</p>
		</section>

		<!-- Steps - Clear visual flow -->
		<section class="mb-20">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				<!-- Step 1 -->
				<div class="relative">
					<div
						class="absolute -top-4 -left-2 w-12 h-12 rounded-full bg-orange-500 text-white text-2xl font-bold flex items-center justify-center"
					>
						1
					</div>
					<div class="border border-zinc-800 rounded-2xl bg-zinc-900/50 p-8 pt-12">
						<h3 class="font-bold text-2xl mb-3">Upload Your Playbook</h3>
						<p class="text-zinc-400 mb-6">
							Drag and drop your playbook PDF or screenshots. Select the position you want
							extracted.
						</p>
						<div class="bg-zinc-900 rounded-xl p-4">
							<div class="text-xs font-semibold text-zinc-500 mb-2">SUPPORTED FILES</div>
							<div class="flex flex-wrap gap-2">
								<span class="bg-zinc-800 px-2 py-1 rounded text-sm text-zinc-300">PDF</span>
								<span class="bg-zinc-800 px-2 py-1 rounded text-sm text-zinc-300">PNG</span>
								<span class="bg-zinc-800 px-2 py-1 rounded text-sm text-zinc-300">JPG</span>
							</div>
						</div>
					</div>
					<!-- Arrow -->
					<div class="hidden md:block absolute top-1/2 -right-4 text-zinc-700 text-2xl">→</div>
				</div>

				<!-- Step 2 -->
				<div class="relative">
					<div
						class="absolute -top-4 -left-2 w-12 h-12 rounded-full bg-orange-500 text-white text-2xl font-bold flex items-center justify-center"
					>
						2
					</div>
					<div class="border border-zinc-800 rounded-2xl bg-zinc-900/50 p-8 pt-12">
						<h3 class="font-bold text-2xl mb-3">AI Does The Work</h3>
						<p class="text-zinc-400 mb-6">
							Our vision AI reads each play diagram and extracts formations, concepts, and
							routes automatically.
						</p>
						<div class="bg-zinc-900 rounded-xl p-4">
							<div class="text-xs font-semibold text-zinc-500 mb-2">WHAT WE EXTRACT</div>
							<ul class="space-y-1 text-sm text-zinc-300">
								<li>• Formation (Luzern, Zug, etc.)</li>
								<li>• Concept (Power, ISO, etc.)</li>
								<li>• Position routes</li>
							</ul>
						</div>
					</div>
					<!-- Arrow -->
					<div class="hidden md:block absolute top-1/2 -right-4 text-zinc-700 text-2xl">→</div>
				</div>

				<!-- Step 3 -->
				<div class="relative">
					<div
						class="absolute -top-4 -left-2 w-12 h-12 rounded-full bg-orange-500 text-white text-2xl font-bold flex items-center justify-center"
					>
						3
					</div>
					<div class="border border-zinc-800 rounded-2xl bg-zinc-900/50 p-8 pt-12">
						<h3 class="font-bold text-2xl mb-3">Download Your Excel</h3>
						<p class="text-zinc-400 mb-6">
							Review the extracted plays, make any quick edits, and download your formatted
							spreadsheet.
						</p>
						<div class="bg-zinc-900 rounded-xl p-4">
							<div class="text-xs font-semibold text-zinc-500 mb-2">YOUR OUTPUT</div>
							<ul class="space-y-1 text-sm text-zinc-300">
								<li>• Excel (.xlsx) format</li>
								<li>• Ready for playcalling</li>
								<li>• Edit before exporting</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- What Makes It Different -->
		<section class="mb-16">
			<h2 class="text-2xl font-bold mb-8 text-center">Why Coaches Switch From Manual Entry</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
				<div class="text-center">
					<div class="text-4xl md:text-5xl font-bold text-orange-400 mb-2">2 min</div>
					<p class="text-zinc-400">vs 2-3 hours typing manually</p>
				</div>
				<div class="text-center">
					<div class="text-4xl md:text-5xl font-bold text-orange-400 mb-2">99%</div>
					<p class="text-zinc-400">extraction accuracy rate</p>
				</div>
				<div class="text-center">
					<div class="text-4xl md:text-5xl font-bold text-orange-400 mb-2">0</div>
					<p class="text-zinc-400">typos or copy-paste errors</p>
				</div>
			</div>
		</section>

		<!-- Preview -->
		<section class="mb-16">
			<h2 class="text-2xl font-bold mb-6 text-center">See What You'll Get</h2>
			<div class="border border-zinc-800 rounded-2xl bg-zinc-900/30 overflow-hidden max-w-3xl mx-auto">
				<div class="bg-emerald-500/10 border-b border-zinc-800 px-6 py-3 text-sm">
					<span class="text-emerald-400">✓</span>
					<span class="text-zinc-300 ml-2">Your Excel output will look like this:</span>
				</div>
				<div class="grid grid-cols-4 bg-zinc-900/50 px-6 py-3 text-sm font-semibold text-zinc-300 border-b border-zinc-800">
					<div>Formation</div>
					<div>Concept</div>
					<div>Strength</div>
					<div>Route</div>
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
				<div class="grid grid-cols-4 px-6 py-3 text-sm">
					<div class="text-zinc-300">Luzern I-Off</div>
					<div class="text-zinc-400">ISO</div>
					<div class="text-zinc-400">Right</div>
					<div class="text-orange-400">Hits A-Gap</div>
				</div>
			</div>
		</section>

		<!-- CTA -->
		<section class="border border-zinc-800 rounded-3xl bg-zinc-900 p-10 md:p-16 text-center">
			<h2 class="text-2xl md:text-4xl font-bold mb-4">Ready to Convert Your First Playbook?</h2>
			<p class="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
				Try it free. Upload your playbook and see the AI extract every play.
			</p>
			<Button href="/upload" size="lg">Upload Your Playbook</Button>
		</section>
	</main>
</div>
