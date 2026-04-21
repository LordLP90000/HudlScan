<script lang="ts">
	interface Props {
		links?: boolean;
		cta?: boolean;
		backButton?: boolean;
	}

	let { links = true, cta = true, backButton = false }: Props = $props();

	function goBack() {
		window.history.back();
	}
</script>

<nav class="border-b border-zinc-800 bg-zinc-900/50 h-16 flex items-center justify-between px-5 text-white">
	<div class="flex items-center gap-2.5">
		{#if backButton}
			<button
				onclick={goBack}
				class="text-zinc-400 hover:text-white mr-2 transition-colors"
				aria-label="Go back"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		{/if}
		<a href="/" class="flex items-center gap-2.5 font-bold hover:text-orange-500 transition-colors">
			<div class="w-8 h-8 rounded-lg bg-orange-500"></div>
			<span>Hudl Playbook AI</span>
		</a>
	</div>

	{#if links}
		<div class="flex gap-4.5 text-sm">
			<a href="/#features" class="text-zinc-400 hover:text-white transition-colors">Features</a>
			<a href="/#how-it-works" class="text-zinc-400 hover:text-white transition-colors">How it works</a>
			<a href="/#pricing" class="text-zinc-400 hover:text-white transition-colors">Pricing</a>
			<a href="/contact" class="text-zinc-400 hover:text-white transition-colors">Contact</a>
			<a href="/feedback" class="text-zinc-400 hover:text-white transition-colors">Feedback</a>
		</div>
	{/if}

	{#if backButton}
		<div></div>
	{/if}

	{#if cta}
		<a href="/upload" class="bg-orange-500 text-white rounded-xl px-3 py-2 text-xs font-bold hover:bg-orange-600 transition-colors">
			Start Converting
		</a>
	{/if}
</nav>
