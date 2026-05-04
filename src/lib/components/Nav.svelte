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

<nav
	class="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm h-16 flex items-center justify-between px-4 md:px-6 text-white sticky top-0 z-50"
>
	<div class="flex items-center gap-2.5">
		{#if backButton}
			<button
				onclick={goBack}
				class="text-zinc-400 hover:text-white mr-1 transition-colors p-1 rounded-lg hover:bg-zinc-800"
				aria-label="Go back"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		{/if}
		<a href="/" class="flex items-center gap-2.5 font-bold text-base hover:text-orange-500 transition-colors">
			<div class="w-8 h-8 rounded-lg bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center">
				<span class="text-white text-sm font-bold">H</span>
			</div>
			<span class="hidden sm:inline">Hudl Playbook AI</span>
		</a>
	</div>

	{#if links}
		<div class="hidden md:flex gap-6 text-sm">
			<a
				href="/how-it-works"
				class="text-zinc-400 hover:text-white transition-colors relative group"
			>
				How It Works
				<span
					class="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all"
				></span>
			</a>
			<a href="/pricing" class="text-zinc-400 hover:text-white transition-colors relative group">
				Pricing
				<span
					class="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all"
				></span>
			</a>
		</div>
	{/if}

	<div class="flex items-center gap-3">
		{#if backButton}
			<div></div>
		{/if}

		{#if cta}
			<a
				href="/upload"
				class="bg-orange-500 text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-orange-600 transition-all hover:shadow-lg hover:shadow-orange-500/20"
			>
				Upload Playbook
			</a>
		{/if}
	</div>
</nav>

<!-- Mobile Nav (shown when links=true) -->
{#if links}
	<div class="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-4 py-2 flex justify-around z-50 safe-area-inset-bottom">
		<a
			href="/"
			class="flex flex-col items-center gap-1 text-zinc-400 hover:text-white transition-colors"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
				<path
					d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
				/>
			</svg>
			<span class="text-[10px]">Home</span>
		</a>
		<a
			href="/how-it-works"
			class="flex flex-col items-center gap-1 text-zinc-400 hover:text-white transition-colors"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
				<path
					fill-rule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
					clip-rule="evenodd"
				/>
			</svg>
			<span class="text-[10px]">How It Works</span>
		</a>
		<a
			href="/pricing"
			class="flex flex-col items-center gap-1 text-zinc-400 hover:text-white transition-colors"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
				<path
					d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"
				/>
				<path
					fill-rule="evenodd"
					d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.312-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.312.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
					clip-rule="evenodd"
				/>
			</svg>
			<span class="text-[10px]">Pricing</span>
		</a>
		<a
			href="/upload"
			class="flex flex-col items-center gap-1 text-orange-500 hover:text-orange-400 transition-colors"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
				<path
					fill-rule="evenodd"
					d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
					clip-rule="evenodd"
				/>
			</svg>
			<span class="text-[10px] font-bold">Upload</span>
		</a>
	</div>
{/if}
<style>
	:global(.safe-area-inset-bottom) {
		padding-bottom: env(safe-area-inset-bottom, 0px);
	}
</style>
