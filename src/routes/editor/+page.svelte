<script lang="ts">
	import { page } from '$app/stores';
	import Chip from '$lib/components/Chip.svelte';
	import Banner from '$lib/components/Banner.svelte';
	import PlaysTable from '$lib/components/PlaysTable.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { Play } from '$lib/components/PlaysTable.svelte';

	// Get position from URL query param
	const positionParam = $page.url.searchParams.get('position') || 'FB';

	let plays = $state<Play[]>([
		{ id: 1, formation: '2x2 Twin', route: 'Flat' },
		{ id: 2, formation: 'Zug A-Bump', route: 'Go' },
		{ id: 3, formation: 'Power / Trey', route: 'Fill the Pulling Gap' },
		{ id: 4, formation: 'Duo Spread', route: 'Kickout' },
		{ id: 5, formation: 'Counter Trey', route: 'Lead' },
		{ id: 6, formation: 'Zone Read', route: 'Track' },
		{ id: 7, formation: 'Inside Zone', route: 'Vertical' },
		{ id: 8, formation: 'Outside Zone', route: 'Reach' },
		{ id: 9, formation: 'Gap', route: 'Down block' },
		{ id: 10, formation: 'Power Read', route: 'Pull' },
		{ id: 11, formation: 'Draw', route: 'Replace' },
		{ id: 12, formation: 'Play Action', route: 'Sell fake' },
		{ id: 13, formation: 'RPO', route: 'Give/Keep' },
		{ id: 14, formation: 'Sprint Out', route: 'Roll' }
	]);

	let showSuccessBanner = $state(true);
	let showAddRow = $state(false);

	const positionNames: Record<string, string> = {
		QB: 'Quarterback',
		RB: 'Running Back',
		FB: 'Fullback / A-Back',
		X: 'X Receiver',
		Y: 'Y Receiver',
		Z: 'Z Receiver',
		H: 'H-Back / Slot',
		TE: 'Tight End'
	};

	const positionName = positionNames[positionParam] || positionParam;

	function handleAddRow() {
		const newPlay: Play = {
			id: plays.length + 1,
			formation: '',
			route: ''
		};
		plays = [...plays, newPlay];
	}

	function handleNew() {
		plays = [];
		showSuccessBanner = false;
	}

	function handleDuplicate(index: number) {
		const original = plays[index];
		const duplicate: Play = {
			id: plays.length + 1,
			formation: original.formation,
			route: original.route
		};
		plays = [...plays.slice(0, index + 1), duplicate, ...plays.slice(index + 1)];
	}

	function handleDelete(index: number) {
		plays = plays.filter((_, i) => i !== index);
	}

	function handleExportExcel() {
		// In a real app, this would generate and download an Excel file
		alert('Exporting Excel file with ' + plays.length + ' plays...');
	}
</script>

<svelte:head>
	<title>Editor - Hudl Playbook AI</title>
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-white">
	<!-- Sticky Header -->
	<div class="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur px-4 py-3 flex justify-between items-center gap-2 flex-wrap">
		<div>
			<div class="font-bold text-sm">Playcalling Sheet Editor</div>
			<div class="text-xs text-zinc-500">{plays.length} plays extracted - {positionName}</div>
		</div>
		<div class="flex gap-1.5">
			<Chip variant="success" onclick={handleAddRow}>Add Row</Chip>
			<Chip onclick={handleNew}>New</Chip>
			<Chip variant="primary" onclick={handleExportExcel}>Export Excel</Chip>
		</div>
	</div>

	<!-- Success Banner -->
	{#if showSuccessBanner}
		<Banner variant="success" message="Plays extracted! Review and edit before exporting." onDismiss={() => (showSuccessBanner = false)} />
	{/if}

	<!-- Plays Table -->
	<div class="px-4 pb-4">
		<PlaysTable {plays} onDuplicate={handleDuplicate} onDelete={handleDelete} />
	</div>

	<!-- Add Row Form (when Add Row is clicked) -->
	{#if showAddRow}
		<div class="mx-4 mb-4 border border-zinc-800 rounded-xl bg-zinc-900 p-4">
			<h4 class="font-bold text-sm mb-3">Add New Play</h4>
			<div class="grid gap-3">
				<div>
					<label for="formation" class="text-xs text-zinc-400 mb-1 block">Formation/Play</label>
					<input
						id="formation"
						type="text"
						placeholder="e.g., 2x2 Twin"
						class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
					/>
				</div>
				<div>
					<label for="route" class="text-xs text-zinc-400 mb-1 block">Route/Blocking</label>
					<input
						id="route"
						type="text"
						placeholder="e.g., Flat"
						class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
					/>
				</div>
				<div class="flex gap-2">
					<Button onclick={() => (showAddRow = false)} variant="secondary" fullWidth>Cancel</Button>
					<Button onclick={() => (showAddRow = false)} fullWidth>Add Play</Button>
				</div>
			</div>
		</div>
	{/if}
</div>
