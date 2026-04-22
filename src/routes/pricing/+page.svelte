<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<svelte:head>
	<title>Pricing - Hudl Playbook AI</title>
	<meta name="description" content="Simple pricing for coaches and programs. Free tier available." />
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-white">
	<Nav />

	<main class="max-w-6xl mx-auto px-5 py-5">
		<!-- Hero Section -->
		<section class="text-center mb-10">
			<h2 class="text-3xl font-bold mb-2">Simple, Transparent Pricing</h2>
			<p class="text-zinc-400">Start free, upgrade when you need more.</p>
		</section>

		<!-- Pricing Cards -->
		<section class="grid grid-cols-3 gap-5 mb-10">
			<!-- Free -->
			<div class="border border-zinc-800 rounded-xl bg-zinc-900 p-5">
				<h4 class="font-bold text-lg mb-1">Free</h4>
				<p class="text-zinc-400 text-sm mb-4">For trying out</p>
				<div class="text-2xl font-bold mb-4">$0<span class="text-sm font-normal text-zinc-500">/month</span></div>
				<ul class="text-sm text-zinc-400 space-y-2 mb-4">
					<li>• 5 playbooks/month</li>
					<li>• All positions included</li>
					<li>• Standard processing</li>
					<li>• Excel export</li>
				</ul>
				<Button variant="secondary" fullWidth href="/upload">Get Started</Button>
			</div>

			<!-- Pro -->
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
					<li>• Excel export</li>
					<li>• Email support</li>
				</ul>
				<Button fullWidth href="/upload">Start Free Trial</Button>
			</div>

			<!-- Team -->
			<div class="border border-zinc-800 rounded-xl bg-zinc-900 p-5">
				<h4 class="font-bold text-lg mb-1">Team</h4>
				<p class="text-zinc-400 text-sm mb-4">For programs</p>
				<div class="text-2xl font-bold mb-4">$49<span class="text-sm font-normal text-zinc-500">/month</span></div>
				<ul class="text-sm text-zinc-400 space-y-2 mb-4">
					<li>• Unlimited playbooks</li>
					<li>• Dedicated support</li>
					<li>• Custom exports</li>
					<li>• Priority processing</li>
					<li>• Team accounts</li>
				</ul>
				<Button variant="secondary" fullWidth href="/contact">Contact Sales</Button>
			</div>
		</section>

		<!-- FAQ -->
		<section class="mb-10">
			<h3 class="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-4">Frequently Asked Questions</h3>
			<div class="space-y-4">
				<div class="border border-zinc-800 rounded-xl bg-zinc-900 p-4">
					<h4 class="font-bold mb-1">What counts as a playbook?</h4>
					<p class="text-zinc-400 text-sm">One playbook = one PDF or image file upload. Multi-page PDFs count as one playbook.</p>
				</div>
				<div class="border border-zinc-800 rounded-xl bg-zinc-900 p-4">
					<h4 class="font-bold mb-1">Can I switch plans?</h4>
					<p class="text-zinc-400 text-sm">Yes, upgrade or downgrade anytime. Changes take effect at the start of your next billing cycle.</p>
				</div>
				<div class="border border-zinc-800 rounded-xl bg-zinc-900 p-4">
					<h4 class="font-bold mb-1">Do plays expire?</h4>
					<p class="text-zinc-400 text-sm">No, your extracted plays are stored permanently. Access them anytime from your account.</p>
				</div>
			</div>
		</section>

		<!-- CTA -->
		<section class="border border-zinc-800 rounded-2xl bg-zinc-900 p-8 text-center">
			<h3 class="text-2xl font-bold mb-2">Questions?</h3>
			<p class="text-zinc-400 mb-4">We're here to help.</p>
			<Button variant="secondary" href="/contact">Contact Us</Button>
		</section>
	</main>
</div>
