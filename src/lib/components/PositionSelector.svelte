<script lang="ts">
	interface Props {
		selectedPosition: string;
		onSelect: (position: string) => void;
	}

	let { selectedPosition, onSelect }: Props = $props();

	const positions = ['QB', 'RB', 'FB', 'X', 'Y', 'Z', 'H', 'TE'];
</script>

<div class="mb-3">
	<div class="mb-2 text-sm font-bold">Select Your Position</div>
	<div class="grid grid-cols-8 gap-1.5">
		{#each positions as position (position)}
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
