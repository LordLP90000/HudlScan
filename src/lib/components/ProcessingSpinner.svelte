<script lang="ts">
	interface Props {
		message?: string;
		details?: string;
		progress?: number; // 0-100
		estimatedTime?: string; // e.g. "~30 seconds remaining"
	}

	let { message = 'Processing on server...', details, progress = 0, estimatedTime }: Props = $props();
</script>

<div class="text-center py-4">
	<div
		class="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full mx-auto mb-2.5 animate-spin"
		role="status"
		aria-label="Loading"
		aria-live="polite"
	></div>
	<h4 class="font-bold">{message}</h4>
	{#if details}
		<p class="text-zinc-400 text-xs mt-1">{details}</p>
	{/if}

	<!-- Progress Bar -->
	{#if progress > 0}
		<div class="mt-4 max-w-xs mx-auto">
			<div class="flex items-center justify-between text-xs text-zinc-400 mb-1">
				<span>Progress</span>
				<span class="font-mono">{progress}%</span>
			</div>
			<div class="h-2 bg-zinc-800 rounded-full overflow-hidden">
				<div
					class="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-300"
					style="width: {progress}%"
				></div>
			</div>
			{#if estimatedTime}
				<p class="text-xs text-zinc-500 mt-2">{estimatedTime}</p>
			{/if}
		</div>
	{/if}

	<p class="text-zinc-600 text-xs mt-3">You can switch tabs - processing continues on our servers</p>
</div>
