<script lang="ts">
	export interface Play {
		id: number;
		formation: string;
		route: string;
	}

	interface Props {
		plays: Play[];
		onDuplicate?: (index: number) => void;
		onDelete?: (index: number) => void;
	}

	let { plays, onDuplicate, onDelete }: Props = $props();
</script>

{#if plays.length === 0}
	<div class="border border-zinc-800 rounded-xl bg-zinc-900 p-4 text-center text-zinc-500 text-sm">
		No plays yet. Add rows manually or upload a new playbook.
	</div>
{:else}
	<div class="overflow-x-auto">
		<table class="w-full border-collapse border border-zinc-800 rounded-xl overflow-hidden text-xs">
			<thead>
				<tr class="bg-zinc-900">
					<th class="border border-zinc-800 px-2.5 py-2 text-left">#</th>
					<th class="border border-zinc-800 px-2.5 py-2 text-left">Formation/Play</th>
					<th class="border border-zinc-800 px-2.5 py-2 text-left">Route/Blocking</th>
					<th class="border border-zinc-800 px-2.5 py-2 text-left">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each plays as play, index}
					<tr class="hover:bg-zinc-900/50 transition-colors">
						<td class="border border-zinc-800 px-2.5 py-2">{index + 1}</td>
						<td class="border border-zinc-800 px-2.5 py-2">{play.formation}</td>
						<td class="border border-zinc-800 px-2.5 py-2">{play.route}</td>
						<td class="border border-zinc-800 px-2.5 py-2">
							<div class="flex gap-2">
								{#if onDuplicate}
									<button
										onclick={() => onDuplicate(index)}
										class="text-zinc-400 hover:text-white transition-colors"
										title="Duplicate"
									>
										+
									</button>
								{/if}
								{#if onDelete}
									<button
										onclick={() => onDelete(index)}
										class="text-zinc-400 hover:text-red-500 transition-colors"
										title="Delete"
									>
										Del
									</button>
								{/if}
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
