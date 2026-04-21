<script lang="ts">
	import { goto } from '$app/navigation';
	import Nav from '$lib/components/Nav.svelte';
	import PositionSelector from '$lib/components/PositionSelector.svelte';
	import FileDropzone from '$lib/components/FileDropzone.svelte';
	import FileList from '$lib/components/FileList.svelte';
	import Button from '$lib/components/Button.svelte';
	import ProcessingSpinner from '$lib/components/ProcessingSpinner.svelte';
	import Banner from '$lib/components/Banner.svelte';

	interface FileItem {
		name: string;
		size: string;
		type: 'pdf' | 'image';
		file: File;
	}

	interface Play {
		col1: string;
		col2: string;
		col3: string;
		col4: string;
	}

	type UploadState = 'empty' | 'ready' | 'processing' | 'error' | 'complete';

	let selectedPosition = $state('FB');
	let uploadState = $state<UploadState>('empty');
	let selectedFiles = $state<FileItem[]>([]);
	let errorMessage = $state('');
	let processingDetails = $state('');
	let extractedPlays = $state<Play[]>([]);

	const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3002';

	async function convertPdfToImages(file: File): Promise<string[]> {
		// For PDFs, we'd use pdf.js to convert each page to base64
		// For now, return empty - user should upload images directly
		throw new Error('PDF support coming soon. Please upload images directly.');
	}

	async function extractPlaysFromImage(imageBase64: string, fileName: string): Promise<Play[]> {
		const response = await fetch(`${API_BASE}/api/extract-plays`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				imageBase64: imageBase64.split(',')[1], // Remove data:image/...;base64, prefix
				fileName,
				position: selectedPosition
			})
		});

		if (!response.ok) {
			throw new Error(`API error: ${response.statusText}`);
		}

		const data = await response.json();
		return data.plays || [];
	}

	function fileToBase64(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	function handleFilesSelected(files: globalThis.FileList) {
		const fileItems: FileItem[] = [];

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const extension = file.name.split('.').pop()?.toLowerCase();
			fileItems.push({
				name: file.name,
				size: formatFileSize(file.size),
				type: extension === 'pdf' ? 'pdf' : 'image',
				file
			});
		}

		selectedFiles = fileItems;
		uploadState = 'ready';
	}

	function formatFileSize(bytes: number): string {
		if (bytes < 1024 * 1024) {
			return (bytes / 1024).toFixed(1) + ' MB';
		}
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
	}

	function removeFile(index: number) {
		selectedFiles = selectedFiles.filter((_, i) => i !== index);
		if (selectedFiles.length === 0) {
			uploadState = 'empty';
		}
	}

	async function handleExtract() {
		uploadState = 'processing';
		extractedPlays = [];

		for (let i = 0; i < selectedFiles.length; i++) {
			const fileItem = selectedFiles[i];
			processingDetails = `Processing ${fileItem.name} (${i + 1}/${selectedFiles.length})...`;

			try {
				if (fileItem.type === 'pdf') {
					errorMessage = 'PDF support coming soon. Please upload images directly.';
					uploadState = 'error';
					return;
				}

				const base64 = await fileToBase64(fileItem.file);
				const plays = await extractPlaysFromImage(base64, fileItem.name);
				extractedPlays = [...extractedPlays, ...plays];
			} catch (e) {
				errorMessage = `Failed to process ${fileItem.name}: ${e.message}`;
				uploadState = 'error';
				return;
			}
		}

		// Store plays in sessionStorage for the editor page
		sessionStorage.setItem('extractedPlays', JSON.stringify(extractedPlays));
		sessionStorage.setItem('position', selectedPosition);

		// Navigate to editor
		goto('/editor?position=' + selectedPosition);
	}

	function handleChooseDifferent() {
		selectedFiles = [];
		uploadState = 'empty';
		extractedPlays = [];
	}

	function handleDismissError() {
		errorMessage = '';
		uploadState = 'empty';
	}
</script>

<svelte:head>
	<title>Upload Your Playbook - Hudl Playbook AI</title>
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-white">
	<Nav links={false} cta={false} backButton />

	<main class="max-w-[900px] mx-auto px-5 py-5">
		<!-- Page Title -->
		<div class="text-center mb-3.5">
			<h2 class="text-3xl font-bold">
				Convert Your <span class="text-orange-500">Playbook</span>
			</h2>
			<p class="text-zinc-400 text-sm mt-1.5">AI extracts plays from playbook images</p>
		</div>

		<!-- Error Banner -->
		{#if uploadState === 'error' && errorMessage}
			<Banner variant="error" message={errorMessage} onDismiss={handleDismissError} />
		{/if}

		<!-- Main Panel -->
		<div class="border border-zinc-800 rounded-xl bg-zinc-900 p-4">
			<!-- Position Selector -->
			<PositionSelector selectedPosition={selectedPosition} onSelect={(pos: string) => (selectedPosition = pos)} />

			{#if uploadState === 'empty'}
				<FileDropzone onFilesSelected={handleFilesSelected} />

			{:else if uploadState === 'ready'}
				<div class="text-sm font-bold mb-3">Ready to process ({selectedFiles.length} file{selectedFiles.length === 1 ? '' : 's'})</div>

				<FileList files={selectedFiles} onRemove={removeFile} />

				<div class="mt-2.5">
					<Button onclick={handleExtract} fullWidth>Extract Plays with AI</Button>
				</div>
				<div class="mt-2">
					<Button variant="secondary" onclick={handleChooseDifferent} fullWidth>Choose different files</Button>
				</div>

			{:else if uploadState === 'processing'}
				<ProcessingSpinner message="Processing with AI..." details={processingDetails} />
			{/if}
		</div>

		<!-- Hint Text -->
		{#if uploadState === 'processing'}
			<p class="text-zinc-600 text-xs text-center mt-3">
				Analyzing play diagrams with vision AI...
			</p>
		{/if}
	</main>
</div>
