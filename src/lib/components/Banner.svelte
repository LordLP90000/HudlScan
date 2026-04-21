<script lang="ts">
	interface Props {
		variant: 'success' | 'error';
		message: string;
		onDismiss?: () => void;
	}

	let { variant, message, onDismiss }: Props = $props();

	const variantClasses = {
		success: 'border-emerald-500/45 bg-emerald-500/15 text-emerald-500',
		error: 'border-red-500/45 bg-red-500/15 text-red-500'
	};
</script>

<div class="mx-3 mt-3 border rounded-lg px-2.5 py-2 text-xs flex items-center justify-between {variantClasses[variant]}">
	<span>{message}</span>
	{#if onDismiss}
		<button
			onclick={onDismiss}
			class="ml-2 hover:opacity-70"
			aria-label="Dismiss"
			title="Dismiss"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
				<path
					fill-rule="evenodd"
					d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
	{/if}
</div>
