<script lang="ts">
	import { POSITIONS } from '$lib/config.js';

	interface Props {
		selectedPosition: string;
		onSelect: (position: string) => void;
	}

	let { selectedPosition, onSelect }: Props = $props();
</script>

<div class="mb-3">
	<div class="grid grid-cols-6 gap-1.5">
		{#each POSITIONS as position (position)}
			<button
				class="rounded-lg border py-2 text-center text-xs transition-all {selectedPosition ===
				position
					? 'border-orange-500 bg-orange-500 font-bold text-white'
					: 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'}"
				onclick={() => onSelect(position)}
			>
				{position}
			</button>
		{/each}
	</div>
</div>
