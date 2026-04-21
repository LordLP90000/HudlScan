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
		// In a real app, this would send the feedback to a server
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
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-white">
	<Nav />

	<main class="max-w-2xl mx-auto px-5 py-10">
		<h1 class="text-3xl font-bold mb-2">Share Your Feedback</h1>
		<p class="text-zinc-400 mb-8">Help us improve Hudl Playbook AI with your suggestions.</p>

		{#if submitted}
			<div class="border border-emerald-500/45 bg-emerald-500/15 text-emerald-500 rounded-lg px-4 py-3 mb-8">
				Thanks for your feedback! We appreciate your input.
			</div>
		{/if}

		<form onsubmit={handleSubmit} class="space-y-6">
			<!-- Rating -->
			<div>
				<label class="block text-sm font-medium mb-3">How would you rate your experience?</label>
				<div class="flex gap-2">
					{#each [1, 2, 3, 4, 5] as star}
						<button
							type="button"
							onclick={() => setRating(star as Rating)}
							class="text-3xl transition-transform hover:scale-110 focus:outline-none"
							aria-label="Rate {star} stars"
						>
							{rating && rating >= star ? '⭐' : '☆'}
						</button>
					{/each}
				</div>
			</div>

			<!-- Category -->
			<div>
				<label for="category" class="block text-sm font-medium mb-2">Feedback Category</label>
				<select
					id="category"
					bind:value={category}
					required
					class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
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
				<label for="feedback" class="block text-sm font-medium mb-2">Your Feedback</label>
				<textarea
					id="feedback"
					bind:value={feedback}
					required
					rows="5"
					placeholder="Tell us what you think..."
					class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 resize-none"
				></textarea>
			</div>

			<!-- Email (optional) -->
			<div>
				<label for="email" class="block text-sm font-medium mb-2">Email (optional)</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					placeholder="your@email.com"
					class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
				/>
				<p class="text-xs text-zinc-500 mt-1">Only if you'd like us to follow up with you</p>
			</div>

			<Button type="submit">Submit Feedback</Button>
		</form>

	<!-- Quick Feedback Options -->
		<div class="mt-12 pt-8 border-t border-zinc-800">
			<h2 class="text-xl font-bold mb-4">Quick Feedback</h2>
			<div class="grid md:grid-cols-2 gap-4">
				<a
					href="/contact?subject=bug"
					class="border border-zinc-800 rounded-lg p-4 hover:border-orange-500 transition-colors"
				>
					<div class="font-bold mb-1">🐛 Report a Bug</div>
					<div class="text-sm text-zinc-400">Found an issue? Let us know.</div>
				</a>
				<a
					href="/contact?subject=feature"
					class="border border-zinc-800 rounded-lg p-4 hover:border-orange-500 transition-colors"
				>
					<div class="font-bold mb-1">💡 Request a Feature</div>
					<div class="text-sm text-zinc-400">Have an idea? We'd love to hear it.</div>
				</a>
			</div>
		</div>
	</main>
</div>
