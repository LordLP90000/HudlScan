<script lang="ts">
	interface Props {
		selectedPosition: string;
		onSelect: (position: string) => void;
	}

	let { selectedPosition, onSelect }: Props = $props();

	const positions = ['QB', 'RB', 'FB', 'X', 'Y', 'Z', 'H', 'TE'];
</script>

<div class="mb-3">
	<div class="text-sm font-bold mb-2">Select Your Position</div>
	<div class="grid grid-cols-8 gap-1.5">
		{#each positions as position}
			<button
				class="text-center rounded-lg border py-2 text-xs transition-all {selectedPosition === position
					? 'bg-orange-500 border-orange-500 text-white font-bold'
					: 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}"
				onclick={() => onSelect(position)}
			>
				{position}
			</button>
		{/each}
	</div>
</div>
