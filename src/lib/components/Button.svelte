<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'success';
		type?: 'button' | 'submit';
		onclick?: () => void;
		href?: string;
		children: Snippet;
		class?: string;
		fullWidth?: boolean;
	}

	let { variant = 'primary', type = 'button', onclick, href, children, class: className = '', fullWidth = false }: Props = $props();

	const baseClasses = 'inline-block rounded-xl px-3.5 py-2.5 text-sm font-bold transition-all';

	const variantClasses = {
		primary: 'bg-orange-500 text-white hover:bg-orange-600',
		secondary: 'border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700',
		success: 'bg-emerald-500 text-white hover:bg-emerald-600'
	};

	const handleClick = (e: MouseEvent) => {
		if (onclick) {
			onclick();
		}
		if (href) {
			e.preventDefault();
			window.location.href = href;
		}
	};
</script>

{#if href}
	<a
		{href}
		class="{baseClasses} {variantClasses[variant]} {fullWidth ? 'w-full text-center' : ''} {className}"
	>
		{@render children()}
	</a>
{:else}
	<button
		{type}
		class="{baseClasses} {variantClasses[variant]} {fullWidth ? 'w-full text-center' : ''} {className}"
		onclick={handleClick}
	>
		{@render children()}
	</button>
{/if}
