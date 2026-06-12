<script lang="ts">
	import './layout.css';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

	injectSpeedInsights();

	const { children } = $props();
</script>

<svelte:head>
	<style>
		:global(body) {
			color: #ffffff;
			background-color: #09090b;
		}
	</style>
</svelte:head>

{@render children()}
