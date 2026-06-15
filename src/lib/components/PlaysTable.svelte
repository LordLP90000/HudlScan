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
	<div class="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center text-sm text-zinc-500">
		No plays yet. Add rows manually or upload a new playbook.
	</div>
{:else}
	<div class="overflow-x-auto">
		<table class="w-full border-collapse overflow-hidden rounded-xl border border-zinc-800 text-xs">
			<thead>
				<tr class="bg-zinc-900">
					<th class="border border-zinc-800 px-2.5 py-2 text-left">#</th>
					<th
						class="border border-zinc-800 px-2.5 py-2 text-left"
						title="The formation and/or play name as drawn in the playbook (e.g. 'Luzern A-Near Power')."
					>
						Formation/Play
					</th>
					<th
						class="border border-zinc-800 px-2.5 py-2 text-left"
						title="What the selected position does on this play — a pass route or a blocking assignment (e.g. '5 Out' or 'Lead Block RB')."
					>
						Route/Blocking
					</th>
					<th class="border border-zinc-800 px-2.5 py-2 text-left">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each plays as play, index (index)}
					<tr class="transition-colors hover:bg-zinc-900/50">
						<td class="border border-zinc-800 px-2.5 py-2">{index + 1}</td>
						<td class="border border-zinc-800 px-2.5 py-2">{play.formation}</td>
						<td class="border border-zinc-800 px-2.5 py-2">{play.route}</td>
						<td class="border border-zinc-800 px-2.5 py-2">
							<div class="flex gap-2">
								{#if onDuplicate}
									<button
										onclick={() => onDuplicate(index)}
										class="text-zinc-400 transition-colors hover:text-white"
										title="Duplicate"
									>
										+
									</button>
								{/if}
								{#if onDelete}
									<button
										onclick={() => onDelete(index)}
										class="text-zinc-400 transition-colors hover:text-red-500"
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
