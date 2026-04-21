<script lang="ts">
	import './layout.css';

	const { children } = $props();
</script>

<svelte:head>
	<style>
		:global(body) {
			color: #FFFFFF;
			background-color: #09090B;
		}
	</style>
</svelte:head>

{@render children()}
