<script lang="ts">
	interface Props {
		message?: string;
		details?: string;
		progress?: number; // 0-100
		estimatedTime?: string; // e.g. "~30 seconds remaining"
	}

	let {
		message = 'Processing on server...',
		details,
		progress = 0,
		estimatedTime
	}: Props = $props();
</script>

<div class="py-4 text-center">
	<div
		class="mx-auto mb-2.5 h-12 w-12 animate-spin rounded-full border-4 border-orange-500/20 border-t-orange-500"
		role="status"
		aria-label="Loading"
		aria-live="polite"
	></div>
	<h4 class="font-bold">{message}</h4>
	{#if details}
		<p class="mt-1 text-xs text-zinc-400">{details}</p>
	{/if}

	<!-- Progress Bar -->
	{#if progress > 0}
		<div class="mx-auto mt-4 max-w-xs">
			<div class="mb-1 flex items-center justify-between text-xs text-zinc-400">
				<span>Progress</span>
				<span class="font-mono">{progress}%</span>
			</div>
			<div class="h-2 overflow-hidden rounded-full bg-zinc-800">
				<div
					class="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-300"
					style="width: {progress}%"
				></div>
			</div>
			{#if estimatedTime}
				<p class="mt-2 text-xs text-zinc-500">{estimatedTime}</p>
			{/if}
		</div>
	{/if}

	<p class="mt-3 text-xs text-zinc-600">
		You can switch tabs - processing continues on our servers
	</p>
</div>
