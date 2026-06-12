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
	class="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-4 text-white backdrop-blur-sm md:px-6"
>
	<div class="flex items-center gap-2.5">
		{#if backButton}
			<button
				onclick={goBack}
				class="mr-1 rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
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
		<a
			href="/"
			class="flex items-center gap-2.5 text-base font-bold transition-colors hover:text-orange-500"
		>
			<div
				class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600"
			>
				<span class="text-sm font-bold text-white">H</span>
			</div>
			<span class="hidden sm:inline">Hudl Playbook AI</span>
		</a>
	</div>

	{#if links}
		<!-- Desktop Nav -->
		<div class="hidden gap-6 text-sm md:flex">
			<a
				href="/how-it-works"
				class="group relative text-zinc-400 transition-colors hover:text-white"
			>
				How It Works
				<span
					class="absolute -bottom-1 left-0 h-0.5 w-0 bg-orange-500 transition-all group-hover:w-full"
				></span>
			</a>
			<a href="/pricing" class="group relative text-zinc-400 transition-colors hover:text-white">
				Pricing
				<span
					class="absolute -bottom-1 left-0 h-0.5 w-0 bg-orange-500 transition-all group-hover:w-full"
				></span>
			</a>
		</div>
	{/if}

	<div class="flex items-center gap-3">
		{#if backButton}
			<div class="w-10 md:hidden"></div>
		{/if}

		{#if cta}
			<a
				href="/upload"
				class="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20"
			>
				<span class="hidden sm:inline">Upload Playbook</span>
				<span class="sm:hidden">Upload</span>
			</a>
		{/if}
	</div>
</nav>

<!-- Mobile Bottom Navigation - thumb-friendly, always visible on mobile -->
{#if links}
	<div
		class="safe-area-inset-bottom fixed right-0 bottom-0 left-0 z-50 flex justify-around border-t border-zinc-800 bg-zinc-900 px-4 py-2 transition-transform md:hidden"
	>
		<a
			href="/"
			class="flex flex-col items-center gap-1 text-zinc-400 transition-colors hover:text-white"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
				/>
			</svg>
			<span class="text-[10px]">Home</span>
		</a>
		<a
			href="/how-it-works"
			class="flex flex-col items-center gap-1 text-zinc-400 transition-colors hover:text-white"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
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
			class="flex flex-col items-center gap-1 text-zinc-400 transition-colors hover:text-white"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
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
			class="flex flex-col items-center gap-1 text-orange-500 transition-colors hover:text-orange-400"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
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
