<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<svelte:head>
	<title>How It Works - Hudl Playbook AI</title>
	<meta name="description" content="Three simple steps to convert your playbooks into Excel playcalling sheets." />
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-white">
	<Nav />

	<main class="max-w-6xl mx-auto px-5 py-5">
		<!-- Hero Section -->
		<section class="text-center mb-10">
			<h2 class="text-3xl font-bold mb-2">How It Works</h2>
			<p class="text-zinc-400">Three simple steps to convert your playbooks.</p>
		</section>

		<!-- Steps -->
		<section class="mb-10">
			<div class="grid grid-cols-3 gap-5">
				<div class="border border-zinc-800 rounded-xl bg-zinc-900 p-5">
					<div class="text-orange-500 font-bold text-2xl mb-2">1</div>
					<h4 class="font-bold text-lg mb-2">Upload Playbook</h4>
					<p class="text-zinc-400 text-sm mb-4">Select your position and upload PDF or image files containing your playbook diagrams.</p>
					<ul class="text-sm text-zinc-500 space-y-1">
						<li>• Supports PDF and PNG/JPG</li>
						<li>• Upload multiple files</li>
						<li>• Choose your position</li>
					</ul>
				</div>

				<div class="border border-zinc-800 rounded-xl bg-zinc-900 p-5">
					<div class="text-orange-500 font-bold text-2xl mb-2">2</div>
					<h4 class="font-bold text-lg mb-2">AI Extraction</h4>
					<p class="text-zinc-400 text-sm mb-4">Our server analyzes each diagram and extracts formations, routes, and play concepts automatically.</p>
					<ul class="text-sm text-zinc-500 space-y-1">
						<li>• Vision AI reads diagrams</li>
						<li>• Identifies formations</li>
						<li>• Extracts position routes</li>
					</ul>
				</div>

				<div class="border border-zinc-800 rounded-xl bg-zinc-900 p-5">
					<div class="text-orange-500 font-bold text-2xl mb-2">3</div>
					<h4 class="font-bold text-lg mb-2">Export Excel</h4>
					<p class="text-zinc-400 text-sm mb-4">Review extracted plays in the editor and export your formatted playcalling sheet.</p>
					<ul class="text-sm text-zinc-500 space-y-1">
						<li>• Review before export</li>
						<li>• Make quick edits</li>
						<li>• Download as Excel</li>
					</ul>
				</div>
			</div>
		</section>

		<!-- Detailed Steps -->
		<section class="mb-10">
			<h3 class="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-4">In Detail</h3>
			<div class="border border-zinc-800 rounded-xl bg-zinc-900 p-6 space-y-6">
				<div>
					<h4 class="font-bold mb-2">Step 1: Upload</h4>
					<p class="text-zinc-400 text-sm">Navigate to the upload page, select your position (QB, RB, FB, X, Y, Z, or TE), and drag & drop your playbook files. We support multi-page PDFs and common image formats.</p>
				</div>
				<div>
					<h4 class="font-bold mb-2">Step 2: Processing</h4>
					<p class="text-zinc-400 text-sm">Our AI converts each page into high-resolution images and analyzes every play diagram. It identifies formations like ZUG or LUZERN, extracts the specific route for your position, and captures the play concept.</p>
				</div>
				<div>
					<h4 class="font-bold mb-2">Step 3: Review & Export</h4>
					<p class="text-zinc-400 text-sm">In the editor, you'll see all extracted plays in a clean table. Make any corrections needed, then click export to download your Excel file ready for playcalling.</p>
				</div>
			</div>
		</section>

		<!-- CTA -->
		<section class="border border-zinc-800 rounded-2xl bg-zinc-900 p-8 text-center">
			<h3 class="text-2xl font-bold mb-2">Ready to Get Started?</h3>
			<p class="text-zinc-400 mb-4">Upload your first playbook for free.</p>
			<Button href="/upload">Start Converting</Button>
		</section>
	</main>
</div>
