<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'default' | 'primary' | 'success';
		onclick?: () => void;
		children: Snippet;
	}

	let { variant = 'default', onclick, children }: Props = $props();

	const variantClasses = {
		default: 'bg-zinc-900 border-zinc-800 text-zinc-400',
		primary: 'bg-orange-500 border-orange-500 text-white',
		success: 'bg-emerald-500 border-emerald-500 text-white'
	};
</script>

{#if onclick}
	<button
		type="button"
		class="inline-block px-2.5 py-2 rounded-xl border text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity {variantClasses[variant]}"
		onclick={onclick}
	>
		{@render children()}
	</button>
{:else}
	<span
		class="inline-block px-2.5 py-2 rounded-xl border text-xs font-bold {variantClasses[variant]}"
	>
		{@render children()}
	</span>
{/if}
