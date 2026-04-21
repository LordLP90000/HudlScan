<script lang="ts">
	interface Props {
		message?: string;
		details?: string;
	}

	let { message = 'Processing on server...', details }: Props = $props();
</script>

<div class="text-center py-4">
	<div
		class="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full mx-auto mb-2.5 animate-spin"
		role="status"
		aria-label="Loading"
	></div>
	<h4 class="font-bold">{message}</h4>
	{#if details}
		<p class="text-zinc-400 text-xs">{details}</p>
	{/if}
	<p class="text-zinc-600 text-xs mt-2">You can switch tabs - processing continues on our servers</p>
</div>
