<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Button from '$lib/components/Button.svelte';

	type Rating = 1 | 2 | 3 | 4 | 5;

	let rating = $state<Rating | null>(null);
	let category = $state('');
	let feedback = $state('');
	let email = $state('');
	let submitted = $state(false);

	function handleSubmit(e: Event) {
		e.preventDefault();
		// Demo mode - show success message
		submitted = true;
		setTimeout(() => {
			submitted = false;
			rating = null;
			category = '';
			feedback = '';
			email = '';
		}, 3000);
	}

	function setRating(value: Rating) {
		rating = value;
	}
</script>

<svelte:head>
	<title>Feedback - Hudl Playbook AI</title>
	<meta name="description" content="Share your feedback and help us improve Hudl Playbook AI." />
</svelte:head>

<div class="min-h-screen bg-zinc-950 pb-20 text-white md:pb-0">
	<Nav />

	<main class="mx-auto max-w-2xl px-6 py-12">
		<!-- Demo Notice -->
		<div class="mb-8 rounded-xl border border-orange-500/30 bg-orange-500/10 p-4">
			<p class="text-sm text-orange-300">
				<span class="font-semibold">Demo Mode:</span>
				Forms are for UI demonstration only. For actual feedback, email us directly.
			</p>
		</div>

		<h1 class="mb-3 text-3xl font-bold md:text-4xl">Share Your Feedback</h1>
		<p class="mb-10 text-lg text-zinc-400">Help us improve Hudl Playbook AI with your input.</p>

		{#if submitted}
			<div
				class="mb-8 rounded-xl border border-emerald-500/45 bg-emerald-500/15 px-5 py-4 text-emerald-500"
			>
				Thanks for your feedback! We appreciate your input.
			</div>
		{/if}

		<form onsubmit={handleSubmit} class="space-y-6">
			<!-- Rating -->
			<div>
				<span class="mb-3 block text-sm font-semibold text-zinc-300"
					>How would you rate your experience?</span
				>
				<div class="flex gap-2">
					{#each [1, 2, 3, 4, 5] as star (star)}
						<button
							type="button"
							onclick={() => setRating(star as Rating)}
							class="rounded text-3xl transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
							aria-label="Rate {star} stars"
						>
							{rating && rating >= star ? '⭐' : '☆'}
						</button>
					{/each}
				</div>
			</div>

			<!-- Category -->
			<div>
				<label for="category" class="mb-2 block text-sm font-semibold text-zinc-300"
					>Feedback Category</label
				>
				<select
					id="category"
					bind:value={category}
					required
					class="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
				>
					<option value="">Select a category</option>
					<option value="bug">Bug Report</option>
					<option value="feature">Feature Request</option>
					<option value="ux">User Experience</option>
					<option value="performance">Performance</option>
					<option value="accuracy">Extraction Accuracy</option>
					<option value="other">Other</option>
				</select>
			</div>

			<!-- Feedback Text -->
			<div>
				<label for="feedback" class="mb-2 block text-sm font-semibold text-zinc-300"
					>Your Feedback</label
				>
				<textarea
					id="feedback"
					bind:value={feedback}
					required
					rows="5"
					placeholder="Tell us what you think..."
					class="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
				></textarea>
			</div>

			<!-- Email (optional) -->
			<div>
				<label for="email" class="mb-2 block text-sm font-semibold text-zinc-300"
					>Email (optional)</label
				>
				<input
					id="email"
					type="email"
					bind:value={email}
					placeholder="your@email.com"
					class="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
				/>
				<p class="mt-1.5 text-xs text-zinc-500">Only if you'd like us to follow up with you</p>
			</div>

			<Button type="submit" size="lg">Submit Feedback</Button>
		</form>

		<!-- Quick Feedback Options -->
		<div class="mt-16 border-t border-zinc-800 pt-8">
			<h2 class="mb-6 text-xl font-bold">Quick Feedback</h2>
			<div class="grid gap-4 md:grid-cols-2">
				<a
					href="mailto:support@hudlplaybookai.com?subject=Bug%20Report"
					class="group rounded-xl border border-zinc-800 p-5 transition-colors hover:border-orange-500/50"
				>
					<div class="mb-1 font-bold text-zinc-300 group-hover:text-white">🐛 Report a Bug</div>
					<div class="text-sm text-zinc-400">Found an issue? Email us directly.</div>
				</a>
				<a
					href="mailto:support@hudlplaybookai.com?subject=Feature%20Request"
					class="group rounded-xl border border-zinc-800 p-5 transition-colors hover:border-orange-500/50"
				>
					<div class="mb-1 font-bold text-zinc-300 group-hover:text-white">
						💡 Request a Feature
					</div>
					<div class="text-sm text-zinc-400">Have an idea? We'd love to hear it.</div>
				</a>
			</div>
		</div>
	</main>
</div>
