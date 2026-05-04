<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<svelte:head>
	<title>Pricing - Hudl Playbook AI</title>
	<meta
		name="description"
		content="Simple pricing for coaches and programs. Start free, upgrade when you need more playbooks."
	/>
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-white pb-20 md:pb-0">
	<Nav />

	<main class="max-w-7xl mx-auto px-6 py-12">
		<!-- Hero Section -->
		<section class="text-center mb-12">
			<h1 class="text-3xl md:text-5xl font-bold mb-4">Simple, Coach-Friendly Pricing</h1>
			<p class="text-zinc-400 text-lg max-w-xl mx-auto">
				Start free with 5 playbooks. Upgrade when you're ready to convert more.
			</p>
		</section>

		<!-- Pricing Cards - Emphasize Free and Pro -->
		<section class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
			<!-- Free - Highlighted for new users -->
			<div class="border border-zinc-700 rounded-3xl bg-zinc-900 p-8 flex flex-col">
				<div class="mb-6">
					<h3 class="font-bold text-2xl mb-2">Free</h3>
					<p class="text-zinc-400 text-sm">Try everything risk-free</p>
				</div>
				<div class="mb-6">
					<span class="text-5xl font-bold">$0</span>
					<span class="text-zinc-500">/month</span>
				</div>
				<ul class="space-y-3 mb-8 flex-1">
					<li class="flex items-start gap-3">
						<span class="text-emerald-400 mt-0.5">✓</span>
						<span class="text-zinc-300"><strong class="text-white">5 playbooks</strong> per month</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="text-emerald-400 mt-0.5">✓</span>
						<span class="text-zinc-300">All positions supported</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="text-emerald-400 mt-0.5">✓</span>
						<span class="text-zinc-300">Excel export included</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="text-emerald-400 mt-0.5">✓</span>
						<span class="text-zinc-300">Full editor access</span>
					</li>
				</ul>
				<Button variant="secondary" fullWidth href="/upload" size="lg">Start Free</Button>
				<p class="text-xs text-zinc-500 text-center mt-3">No credit card required</p>
			</div>

			<!-- Pro - Recommended, most prominent -->
			<div
				class="border-2 border-orange-500 rounded-3xl bg-linear-to-br from-orange-500/10 to-transparent p-8 flex flex-col relative"
			>
				<div
					class="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full"
				>
					Most Popular
				</div>
				<div class="mb-6">
					<h3 class="font-bold text-2xl mb-2">Pro</h3>
					<p class="text-zinc-400 text-sm">For serious coaches</p>
				</div>
				<div class="mb-6">
					<span class="text-5xl font-bold">$19</span>
					<span class="text-zinc-500">/month</span>
				</div>
				<ul class="space-y-3 mb-8 flex-1">
					<li class="flex items-start gap-3">
						<span class="text-orange-400 mt-0.5">✓</span>
						<span class="text-zinc-300"><strong class="text-white">50 playbooks</strong> per month</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="text-orange-400 mt-0.5">✓</span>
						<span class="text-zinc-300">Everything in Free</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="text-orange-400 mt-0.5">✓</span>
						<span class="text-zinc-300">Priority processing</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="text-orange-400 mt-0.5">✓</span>
						<span class="text-zinc-300">Email support</span>
					</li>
				</ul>
				<Button fullWidth href="/upload" size="lg">Get Started</Button>
				<p class="text-xs text-zinc-500 text-center mt-3">Cancel anytime</p>
			</div>
		</section>

		<!-- Team Plan - Simplified -->
		<section class="mb-16">
			<div class="border border-zinc-800 rounded-2xl bg-zinc-900/50 p-8 text-center max-w-2xl mx-auto">
				<h3 class="font-bold text-xl mb-2">Need More?</h3>
				<p class="text-zinc-400 mb-4">
					Unlimited playbooks, dedicated support, and custom exports for your program.
				</p>
				<Button variant="secondary" href="/contact">Contact for Team Pricing</Button>
			</div>
		</section>

		<!-- FAQ - Common questions -->
		<section class="mb-12">
			<h2 class="text-2xl font-bold mb-8 text-center">Common Questions</h2>
			<div class="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
				<div class="border border-zinc-800 rounded-xl bg-zinc-900/50 p-6">
					<h4 class="font-bold mb-2">What counts as a playbook?</h4>
					<p class="text-zinc-400 text-sm">
						One playbook = one PDF file or one image file. Multi-page PDFs count as a single
						playbook.
					</p>
				</div>
				<div class="border border-zinc-800 rounded-xl bg-zinc-900/50 p-6">
					<h4 class="font-bold mb-2">Can I try before paying?</h4>
					<p class="text-zinc-400 text-sm">
						Absolutely. The free tier lets you convert 5 playbooks—no credit card required.
					</p>
				</div>
				<div class="border border-zinc-800 rounded-xl bg-zinc-900/50 p-6">
					<h4 class="font-bold mb-2">What happens if I exceed my limit?</h4>
					<p class="text-zinc-400 text-sm">
						We'll notify you when you're close. You can upgrade anytime or wait for your
						monthly reset.
					</p>
				</div>
				<div class="border border-zinc-800 rounded-xl bg-zinc-900/50 p-6">
					<h4 class="font-bold mb-2">Can I cancel anytime?</h4>
					<p class="text-zinc-400 text-sm">
						Yes. Cancel anytime and you'll keep access until the end of your billing period.
					</p>
				</div>
			</div>
		</section>

		<!-- Bottom CTA -->
		<section class="text-center">
			<p class="text-zinc-400 mb-4">Still have questions?</p>
			<Button variant="secondary" href="/contact">Contact Us</Button>
		</section>
	</main>
</div>
