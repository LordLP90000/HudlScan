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

<div class="min-h-screen bg-zinc-950 pb-20 text-white md:pb-0">
	<Nav />

	<main class="mx-auto max-w-7xl px-6 py-12">
		<!-- Hero Section -->
		<section class="mb-12 text-center">
			<h1 class="mb-4 text-3xl font-bold md:text-5xl">Simple, Coach-Friendly Pricing</h1>
			<p class="mx-auto max-w-xl text-lg text-zinc-400">
				Start free with 5 playbooks. Upgrade when you're ready to convert more.
			</p>
		</section>

		<!-- Pricing Cards - Emphasize Free and Pro -->
		<section class="mx-auto mb-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
			<!-- Free - Highlighted for new users -->
			<div class="flex flex-col rounded-3xl border border-zinc-700 bg-zinc-900 p-8">
				<div class="mb-6">
					<h3 class="mb-2 text-2xl font-bold">Free</h3>
					<p class="text-sm text-zinc-400">Try everything risk-free</p>
				</div>
				<div class="mb-6">
					<span class="text-5xl font-bold">$0</span>
					<span class="text-zinc-500">/month</span>
				</div>
				<ul class="mb-8 flex-1 space-y-3">
					<li class="flex items-start gap-3">
						<span class="mt-0.5 text-emerald-400">✓</span>
						<span class="text-zinc-300"
							><strong class="text-white">5 playbooks</strong> per month</span
						>
					</li>
					<li class="flex items-start gap-3">
						<span class="mt-0.5 text-emerald-400">✓</span>
						<span class="text-zinc-300">All positions supported</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="mt-0.5 text-emerald-400">✓</span>
						<span class="text-zinc-300">Excel export included</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="mt-0.5 text-emerald-400">✓</span>
						<span class="text-zinc-300">Full editor access</span>
					</li>
				</ul>
				<Button variant="secondary" fullWidth href="/upload" size="lg">Start Free</Button>
				<p class="mt-3 text-center text-xs text-zinc-500">No credit card required</p>
			</div>

			<!-- Pro - Recommended, most prominent -->
			<div
				class="relative flex flex-col rounded-3xl border-2 border-orange-500 bg-linear-to-br from-orange-500/10 to-transparent p-8"
			>
				<div
					class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-4 py-1.5 text-xs font-bold text-white"
				>
					Most Popular
				</div>
				<div class="mb-6">
					<h3 class="mb-2 text-2xl font-bold">Pro</h3>
					<p class="text-sm text-zinc-400">For serious coaches</p>
				</div>
				<div class="mb-6">
					<span class="text-5xl font-bold">$19</span>
					<span class="text-zinc-500">/month</span>
				</div>
				<ul class="mb-8 flex-1 space-y-3">
					<li class="flex items-start gap-3">
						<span class="mt-0.5 text-orange-400">✓</span>
						<span class="text-zinc-300"
							><strong class="text-white">50 playbooks</strong> per month</span
						>
					</li>
					<li class="flex items-start gap-3">
						<span class="mt-0.5 text-orange-400">✓</span>
						<span class="text-zinc-300">Everything in Free</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="mt-0.5 text-orange-400">✓</span>
						<span class="text-zinc-300">Priority processing</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="mt-0.5 text-orange-400">✓</span>
						<span class="text-zinc-300">Email support</span>
					</li>
				</ul>
				<Button fullWidth href="/upload" size="lg">Get Started</Button>
				<p class="mt-3 text-center text-xs text-zinc-500">Cancel anytime</p>
			</div>
		</section>

		<!-- Team Plan - Simplified -->
		<section class="mb-16">
			<div
				class="mx-auto max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center"
			>
				<h3 class="mb-2 text-xl font-bold">Need More?</h3>
				<p class="mb-4 text-zinc-400">
					Unlimited playbooks, dedicated support, and custom exports for your program.
				</p>
				<Button variant="secondary" href="/contact">Contact for Team Pricing</Button>
			</div>
		</section>

		<!-- FAQ - Common questions -->
		<section class="mb-12">
			<h2 class="mb-8 text-center text-2xl font-bold">Common Questions</h2>
			<div class="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
				<div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
					<h4 class="mb-2 font-bold">What counts as a playbook?</h4>
					<p class="text-sm text-zinc-400">
						One playbook = one PDF file or one image file. Multi-page PDFs count as a single
						playbook.
					</p>
				</div>
				<div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
					<h4 class="mb-2 font-bold">Can I try before paying?</h4>
					<p class="text-sm text-zinc-400">
						Absolutely. The free tier lets you convert 5 playbooks—no credit card required.
					</p>
				</div>
				<div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
					<h4 class="mb-2 font-bold">What happens if I exceed my limit?</h4>
					<p class="text-sm text-zinc-400">
						We'll notify you when you're close. You can upgrade anytime or wait for your monthly
						reset.
					</p>
				</div>
				<div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
					<h4 class="mb-2 font-bold">Can I cancel anytime?</h4>
					<p class="text-sm text-zinc-400">
						Yes. Cancel anytime and you'll keep access until the end of your billing period.
					</p>
				</div>
			</div>
		</section>

		<!-- Bottom CTA -->
		<section class="text-center">
			<p class="mb-4 text-zinc-400">Still have questions?</p>
			<Button variant="secondary" href="/contact">Contact Us</Button>
		</section>
	</main>
</div>
