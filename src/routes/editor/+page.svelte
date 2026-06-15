<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Nav from '$lib/components/Nav.svelte';
	import Chip from '$lib/components/Chip.svelte';
	import Banner from '$lib/components/Banner.svelte';
	import PlaysTable from '$lib/components/PlaysTable.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { Play } from '$lib/components/PlaysTable.svelte';
	import * as XLSX from 'xlsx';

	// Get position from URL query param
	const positionParam = $page.url.searchParams.get('position') || 'FB';

	interface AIPlay {
		col1: string; // formation/play name
		col2: string; // route
		col3: string; // concept
		col4: string; // blocking description
	}

	let plays = $state<Play[]>([]);
	let showSuccessBanner = $state(true);
	let showAddRow = $state(false);
	let showLegend = $state(false);
	let newFormation = $state('');
	let newRoute = $state('');

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

	onMount(() => {
		// Try to load extracted plays from sessionStorage
		const stored = sessionStorage.getItem('extractedPlays');
		if (stored) {
			try {
				const aiPlays: AIPlay[] = JSON.parse(stored);
				// Convert AI format to Play format
				plays = aiPlays.map((p, i) => ({
					id: i + 1,
					formation: p.col1,
					route: p.col2 || p.col4 // prefer route, fallback to blocking
				}));
			} catch (e) {
				console.error('Failed to parse stored plays:', e);
				loadExamplePlays();
			}
		} else {
			loadExamplePlays();
		}
	});

	function loadExamplePlays() {
		plays = [
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
		];
	}

	function handleAddRow() {
		newFormation = '';
		newRoute = '';
		showAddRow = true;
	}

	function handleAddRowSubmit() {
		if (newFormation.trim() || newRoute.trim()) {
			const newPlay: Play = {
				id: plays.length + 1,
				formation: newFormation,
				route: newRoute
			};
			plays = [...plays, newPlay];
		}
		showAddRow = false;
		newFormation = '';
		newRoute = '';
	}

	function handleNew() {
		plays = [];
		showSuccessBanner = false;
	}

	function handleUploadAnother() {
		goto('/upload');
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
		if (plays.length === 0) {
			alert('No plays to export!');
			return;
		}

		// Create worksheet data with headers
		const worksheetData = [
			['Formation/Play', 'Route/Blocking'],
			...plays.map((play) => [play.formation, play.route])
		];

		// Create worksheet and workbook
		const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Plays');

		// Set column widths
		worksheet['!cols'] = [
			{ wch: 30 }, // Formation/Play column width
			{ wch: 25 } // Route/Blocking column width
		];

		// Generate filename with position and date
		const date = new Date().toISOString().split('T')[0];
		const filename = `${positionName.replace(/\s+/g, '_')}_Plays_${date}.xlsx`;

		// Download the file
		XLSX.writeFile(workbook, filename);
	}
</script>

<svelte:head>
	<title>Editor - Hudl Playbook AI</title>
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-white">
	<Nav links={false} cta={false} backButton />

	<!-- Sticky Header -->
	<div
		class="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 bg-zinc-900/95 px-4 py-3 backdrop-blur"
	>
		<div class="flex items-center gap-4">
			<a href="/" class="text-sm text-zinc-400 transition-colors hover:text-white">← Home</a>
			<div>
				<div class="text-sm font-bold">Playcalling Sheet Editor</div>
				<div class="text-xs text-zinc-500">{plays.length} plays extracted - {positionName}</div>
			</div>
		</div>
		<div class="flex gap-1.5">
			<Chip variant="success" onclick={handleAddRow}>Add Row</Chip>
			<Chip onclick={handleUploadAnother}>Upload another</Chip>
			<Chip onclick={handleNew}>Clear</Chip>
			<Chip variant="primary" onclick={handleExportExcel}>Export Excel</Chip>
		</div>
	</div>

	<!-- Success Banner -->
	{#if showSuccessBanner}
		<Banner
			variant="success"
			message="Plays extracted! Review and edit before exporting."
			onDismiss={() => (showSuccessBanner = false)}
		/>
	{/if}

	<!-- Column & abbreviation legend (collapsible) -->
	<div class="px-4 pt-4">
		<div class="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
			<button
				type="button"
				onclick={() => (showLegend = !showLegend)}
				class="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-semibold text-zinc-300 transition-colors hover:text-white"
				aria-expanded={showLegend}
			>
				<span>What do these columns and codes mean?</span>
				<span class="text-xs text-zinc-500">{showLegend ? 'Hide' : 'Show'}</span>
			</button>
			{#if showLegend}
				<div class="space-y-4 border-t border-zinc-800 px-4 py-4 text-sm">
					<div>
						<div class="mb-1.5 text-xs font-semibold tracking-wide text-orange-400 uppercase">
							Columns
						</div>
						<ul class="space-y-1.5 text-zinc-400">
							<li>
								<span class="font-medium text-zinc-200">Formation/Play</span> — the formation
								and play name as drawn in the playbook (e.g. “Luzern A-Near Power”).
							</li>
							<li>
								<span class="font-medium text-zinc-200">Route/Blocking</span> — what the
								selected position does on the play: a pass route or a blocking assignment
								(e.g. “5 Out” or “Lead Block RB”).
							</li>
						</ul>
					</div>
					<div>
						<div class="mb-1.5 text-xs font-semibold tracking-wide text-orange-400 uppercase">
							Position codes
						</div>
						<div class="grid grid-cols-2 gap-x-6 gap-y-1.5 text-zinc-400 sm:grid-cols-3">
							<div><span class="font-medium text-zinc-200">QB</span> — Quarterback</div>
							<div><span class="font-medium text-zinc-200">RB</span> — Running Back</div>
							<div><span class="font-medium text-zinc-200">FB / A-Back</span> — Fullback</div>
							<div><span class="font-medium text-zinc-200">TE</span> — Tight End</div>
							<div><span class="font-medium text-zinc-200">H</span> — H-Back / Slot</div>
							<div><span class="font-medium text-zinc-200">X / Y / Z</span> — Receivers</div>
						</div>
						<p class="mt-2 text-xs text-zinc-500">
							“A-Back” is the fullback-type back lined up next to the tackle; its exact spot
							changes with the formation tag (e.g. A-Near, A-Bump).
						</p>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Plays Table -->
	<div class="px-4 pb-4">
		<PlaysTable {plays} onDuplicate={handleDuplicate} onDelete={handleDelete} />
	</div>

	<!-- Add Row Form (when Add Row is clicked) -->
	{#if showAddRow}
		<div class="mx-4 mb-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
			<h4 class="mb-3 text-sm font-bold">Add New Play</h4>
			<div class="grid gap-3">
				<div>
					<label for="formation" class="mb-1 block text-xs text-zinc-400">Formation/Play</label>
					<input
						id="formation"
						type="text"
						bind:value={newFormation}
						placeholder="e.g., 2x2 Twin"
						class="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
					/>
				</div>
				<div>
					<label for="route" class="mb-1 block text-xs text-zinc-400">Route/Blocking</label>
					<input
						id="route"
						type="text"
						bind:value={newRoute}
						placeholder="e.g., Flat"
						class="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
					/>
				</div>
				<div class="flex gap-2">
					<Button onclick={() => (showAddRow = false)} variant="secondary" fullWidth>Cancel</Button>
					<Button onclick={handleAddRowSubmit} fullWidth>Add Play</Button>
				</div>
			</div>
		</div>
	{/if}
</div>
