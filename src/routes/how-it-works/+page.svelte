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

<div class="min-h-screen bg-zinc-950 pb-20 text-white md:pb-0">
	<Nav />

	<main class="mx-auto max-w-7xl px-6 py-12">
		<!-- Hero Section -->
		<section class="mb-16 text-center">
			<h1 class="mb-4 text-3xl font-bold md:text-5xl">Three Steps to Your Playbook in Excel</h1>
			<p class="mx-auto max-w-xl text-lg text-zinc-400">
				No manual typing. No formatting headaches. Just upload and get your plays.
			</p>
		</section>

		<!-- Steps - Clear visual flow -->
		<section class="mb-20">
			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				<!-- Step 1 -->
				<div class="relative">
					<div
						class="absolute -top-4 -left-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-2xl font-bold text-white"
					>
						1
					</div>
					<div class="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 pt-12">
						<h3 class="mb-3 text-2xl font-bold">Upload Your Playbook</h3>
						<p class="mb-6 text-zinc-400">
							Drag and drop your playbook PDF or screenshots. Select the position you want
							extracted.
						</p>
						<div class="rounded-xl bg-zinc-900 p-4">
							<div class="mb-2 text-xs font-semibold text-zinc-500">SUPPORTED FILES</div>
							<div class="flex flex-wrap gap-2">
								<span class="rounded bg-zinc-800 px-2 py-1 text-sm text-zinc-300">PDF</span>
								<span class="rounded bg-zinc-800 px-2 py-1 text-sm text-zinc-300">PNG</span>
								<span class="rounded bg-zinc-800 px-2 py-1 text-sm text-zinc-300">JPG</span>
							</div>
						</div>
					</div>
					<!-- Arrow -->
					<div class="absolute top-1/2 -right-4 hidden text-2xl text-zinc-700 md:block">→</div>
				</div>

				<!-- Step 2 -->
				<div class="relative">
					<div
						class="absolute -top-4 -left-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-2xl font-bold text-white"
					>
						2
					</div>
					<div class="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 pt-12">
						<h3 class="mb-3 text-2xl font-bold">AI Does The Work</h3>
						<p class="mb-6 text-zinc-400">
							Our vision AI reads each play diagram and extracts formations, concepts, and routes
							automatically.
						</p>
						<div class="rounded-xl bg-zinc-900 p-4">
							<div class="mb-2 text-xs font-semibold text-zinc-500">WHAT WE EXTRACT</div>
							<ul class="space-y-1 text-sm text-zinc-300">
								<li>• Formation (Luzern, Zug, etc.)</li>
								<li>• Concept (Power, ISO, etc.)</li>
								<li>• Position routes</li>
							</ul>
						</div>
					</div>
					<!-- Arrow -->
					<div class="absolute top-1/2 -right-4 hidden text-2xl text-zinc-700 md:block">→</div>
				</div>

				<!-- Step 3 -->
				<div class="relative">
					<div
						class="absolute -top-4 -left-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-2xl font-bold text-white"
					>
						3
					</div>
					<div class="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 pt-12">
						<h3 class="mb-3 text-2xl font-bold">Download Your Excel</h3>
						<p class="mb-6 text-zinc-400">
							Review the extracted plays, make any quick edits, and download your formatted
							spreadsheet.
						</p>
						<div class="rounded-xl bg-zinc-900 p-4">
							<div class="mb-2 text-xs font-semibold text-zinc-500">YOUR OUTPUT</div>
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
			<h2 class="mb-8 text-center text-2xl font-bold">Why Coaches Switch From Manual Entry</h2>
			<div class="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
				<div class="text-center">
					<div class="mb-2 text-4xl font-bold text-orange-400 md:text-5xl">2 min</div>
					<p class="text-zinc-400">vs 2-3 hours typing manually</p>
				</div>
				<div class="text-center">
					<div class="mb-2 text-4xl font-bold text-orange-400 md:text-5xl">99%</div>
					<p class="text-zinc-400">extraction accuracy rate</p>
				</div>
				<div class="text-center">
					<div class="mb-2 text-4xl font-bold text-orange-400 md:text-5xl">0</div>
					<p class="text-zinc-400">typos or copy-paste errors</p>
				</div>
			</div>
		</section>

		<!-- Preview -->
		<section class="mb-16">
			<h2 class="mb-6 text-center text-2xl font-bold">See What You'll Get</h2>
			<div
				class="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30"
			>
				<div class="border-b border-zinc-800 bg-emerald-500/10 px-6 py-3 text-sm">
					<span class="text-emerald-400">✓</span>
					<span class="ml-2 text-zinc-300">Your Excel output will look like this:</span>
				</div>
				<div
					class="grid grid-cols-4 border-b border-zinc-800 bg-zinc-900/50 px-6 py-3 text-sm font-semibold text-zinc-300"
				>
					<div>Formation</div>
					<div>Concept</div>
					<div>Strength</div>
					<div>Route</div>
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
				<div class="grid grid-cols-4 px-6 py-3 text-sm">
					<div class="text-zinc-300">Luzern I-Off</div>
					<div class="text-zinc-400">ISO</div>
					<div class="text-zinc-400">Right</div>
					<div class="text-orange-400">Hits A-Gap</div>
				</div>
			</div>
		</section>

		<!-- CTA -->
		<section class="rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center md:p-16">
			<h2 class="mb-4 text-2xl font-bold md:text-4xl">Ready to Convert Your First Playbook?</h2>
			<p class="mx-auto mb-8 max-w-xl text-lg text-zinc-400">
				Try it free. Upload your playbook and see the AI extract every play.
			</p>
			<Button href="/upload" size="lg">Upload Your Playbook</Button>
		</section>
	</main>
</div>
