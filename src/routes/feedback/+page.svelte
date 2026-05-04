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

<div class="min-h-screen bg-zinc-950 text-white pb-20 md:pb-0">
	<Nav />

	<main class="max-w-2xl mx-auto px-6 py-12">
		<!-- Demo Notice -->
		<div class="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-8">
			<p class="text-sm text-orange-300">
				<span class="font-semibold">Demo Mode:</span>
				Forms are for UI demonstration only. For actual feedback, email us directly.
			</p>
		</div>

		<h1 class="text-3xl md:text-4xl font-bold mb-3">Share Your Feedback</h1>
		<p class="text-zinc-400 text-lg mb-10">Help us improve Hudl Playbook AI with your input.</p>

		{#if submitted}
			<div
				class="border border-emerald-500/45 bg-emerald-500/15 text-emerald-500 rounded-xl px-5 py-4 mb-8"
			>
				Thanks for your feedback! We appreciate your input.
			</div>
		{/if}

		<form onsubmit={handleSubmit} class="space-y-6">
			<!-- Rating -->
			<div>
				<label class="block text-sm font-semibold mb-3 text-zinc-300"
					>How would you rate your experience?</label
				>
				<div class="flex gap-2">
					{#each [1, 2, 3, 4, 5] as star}
						<button
							type="button"
							onclick={() => setRating(star as Rating)}
							class="text-3xl transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
							aria-label="Rate {star} stars"
						>
							{rating && rating >= star ? '⭐' : '☆'}
						</button>
					{/each}
				</div>
			</div>

			<!-- Category -->
			<div>
				<label for="category" class="block text-sm font-semibold mb-2 text-zinc-300"
					>Feedback Category</label
				>
				<select
					id="category"
					bind:value={category}
					required
					class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
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
				<label for="feedback" class="block text-sm font-semibold mb-2 text-zinc-300"
					>Your Feedback</label
				>
				<textarea
					id="feedback"
					bind:value={feedback}
					required
					rows="5"
					placeholder="Tell us what you think..."
					class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none transition-colors"
				></textarea>
			</div>

			<!-- Email (optional) -->
			<div>
				<label for="email" class="block text-sm font-semibold mb-2 text-zinc-300"
					>Email (optional)</label
				>
				<input
					id="email"
					type="email"
					bind:value={email}
					placeholder="your@email.com"
					class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
				/>
				<p class="text-xs text-zinc-500 mt-1.5">Only if you'd like us to follow up with you</p>
			</div>

			<Button type="submit" size="lg">Submit Feedback</Button>
		</form>

		<!-- Quick Feedback Options -->
		<div class="mt-16 pt-8 border-t border-zinc-800">
			<h2 class="text-xl font-bold mb-6">Quick Feedback</h2>
			<div class="grid md:grid-cols-2 gap-4">
				<a
					href="mailto:support@hudlplaybookai.com?subject=Bug%20Report"
					class="border border-zinc-800 rounded-xl p-5 hover:border-orange-500/50 transition-colors group"
				>
					<div class="font-bold mb-1 text-zinc-300 group-hover:text-white">🐛 Report a Bug</div>
					<div class="text-sm text-zinc-400">Found an issue? Email us directly.</div>
				</a>
				<a
					href="mailto:support@hudlplaybookai.com?subject=Feature%20Request"
					class="border border-zinc-800 rounded-xl p-5 hover:border-orange-500/50 transition-colors group"
				>
					<div class="font-bold mb-1 text-zinc-300 group-hover:text-white">💡 Request a Feature</div>
					<div class="text-sm text-zinc-400">Have an idea? We'd love to hear it.</div>
				</a>
			</div>
		</div>
	</main>
</div>
