<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';
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
			class="border border-zinc-800 rounded-2xl bg-gradient-to-b from-orange-500/15 to-orange-500/2 p-6 mb-3.5"
		>
			<h2 class="text-3xl font-bold mb-2">Turn Hudl Playbooks into Excel Sheets</h2>
			<p class="text-zinc-400 mb-3.5">Upload your playbook screenshots or PDFs and let AI extract every play.</p>
			<div class="flex gap-2">
				<Button href="/upload">Start Converting Free</Button>
				<Button variant="secondary">Watch Demo</Button>
			</div>
		</section>

		<!-- Feature Cards -->
		<section class="grid grid-cols-3 gap-2.5 mb-10">
			<Card title="Server-Side Processing" description="Processing continues in background." />
			<Card title="Position-Specific" description="Extract routes for selected role." />
			<Card title="Excel Export" description="Download formatted sheet." />
		</section>

		<!-- How It Works -->
		<section class="mb-10">
			<h3 class="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-4">How It Works</h3>
			<div class="grid grid-cols-3 gap-5">
				<div class="border border-zinc-800 rounded-xl bg-zinc-900 p-4">
					<div class="text-orange-500 font-bold text-2xl mb-2">1</div>
					<h4 class="font-bold mb-1">Upload Playbook</h4>
					<p class="text-zinc-400 text-sm">Select your position and upload PDF or image files</p>
				</div>
				<div class="border border-zinc-800 rounded-xl bg-zinc-900 p-4">
					<div class="text-orange-500 font-bold text-2xl mb-2">2</div>
					<h4 class="font-bold mb-1">AI Extraction</h4>
					<p class="text-zinc-400 text-sm">Our server analyzes and extracts all plays automatically</p>
				</div>
				<div class="border border-zinc-800 rounded-xl bg-zinc-900 p-4">
					<div class="text-orange-500 font-bold text-2xl mb-2">3</div>
					<h4 class="font-bold mb-1">Export Excel</h4>
					<p class="text-zinc-400 text-sm">Review and export your playcalling sheet</p>
				</div>
			</div>
		</section>

		<!-- Pricing Section -->
		<section class="mb-10">
			<h3 class="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-4">Pricing</h3>
			<div class="grid grid-cols-3 gap-5">
				<div class="border border-zinc-800 rounded-xl bg-zinc-900 p-5">
					<h4 class="font-bold text-lg mb-1">Free</h4>
					<p class="text-zinc-400 text-sm mb-4">For trying out</p>
					<div class="text-2xl font-bold mb-4">$0<span class="text-sm font-normal text-zinc-500">/month</span></div>
					<ul class="text-sm text-zinc-400 space-y-2 mb-4">
						<li>• 5 playbooks/month</li>
						<li>• All positions included</li>
						<li>• Standard processing</li>
					</ul>
					<Button variant="secondary" fullWidth>Get Started</Button>
				</div>
				<div class="border border-orange-500 rounded-xl bg-zinc-900 p-5 relative">
					<div class="absolute -top-2 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded">
						Popular
					</div>
					<h4 class="font-bold text-lg mb-1">Pro</h4>
					<p class="text-zinc-400 text-sm mb-4">For coaches</p>
					<div class="text-2xl font-bold mb-4">$19<span class="text-sm font-normal text-zinc-500">/month</span></div>
					<ul class="text-sm text-zinc-400 space-y-2 mb-4">
						<li>• 50 playbooks/month</li>
						<li>• Priority processing</li>
						<li>• All positions</li>
					</ul>
					<Button fullWidth>Start Free Trial</Button>
				</div>
				<div class="border border-zinc-800 rounded-xl bg-zinc-900 p-5">
					<h4 class="font-bold text-lg mb-1">Team</h4>
					<p class="text-zinc-400 text-sm mb-4">For programs</p>
					<div class="text-2xl font-bold mb-4">$49<span class="text-sm font-normal text-zinc-500">/month</span></div>
					<ul class="text-sm text-zinc-400 space-y-2 mb-4">
						<li>• Unlimited playbooks</li>
						<li>• Dedicated support</li>
						<li>• Custom exports</li>
					</ul>
					<Button variant="secondary" fullWidth>Contact Sales</Button>
				</div>
			</div>
		</section>

		<!-- Bottom CTA -->
		<section class="border border-zinc-800 rounded-2xl bg-zinc-900 p-8 text-center">
			<h3 class="text-2xl font-bold mb-2">Ready to Save Hours of Manual Work?</h3>
			<p class="text-zinc-400 mb-4">Join hundreds of coaches already using Hudl Playbook AI</p>
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
					<p class="text-zinc-500">Convert playbooks to Excel in seconds, not hours.</p>
				</div>
				<div>
					<h4 class="font-bold mb-3">Product</h4>
					<ul class="space-y-2 text-zinc-400">
						<li><button class="hover:text-white cursor-pointer">Features</button></li>
						<li><button class="hover:text-white cursor-pointer">Pricing</button></li>
						<li><button class="hover:text-white cursor-pointer">FAQ</button></li>
					</ul>
				</div>
				<div>
					<h4 class="font-bold mb-3">Company</h4>
					<ul class="space-y-2 text-zinc-400">
						<li><button class="hover:text-white cursor-pointer">About</button></li>
						<li><button class="hover:text-white cursor-pointer">Blog</button></li>
						<li><button class="hover:text-white cursor-pointer">Contact</button></li>
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
