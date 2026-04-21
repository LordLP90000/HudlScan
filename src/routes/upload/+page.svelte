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
	}

	type UploadState = 'empty' | 'ready' | 'processing' | 'error';

	let selectedPosition = $state('FB');
	let uploadState = $state<UploadState>('empty');
	let selectedFiles = $state<FileItem[]>([]);
	let errorMessage = $state('');
	let processingDetails = $state('');

	function handleFilesSelected(files: globalThis.FileList) {
		const fileItems: FileItem[] = [];

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const extension = file.name.split('.').pop()?.toLowerCase();
			fileItems.push({
				name: file.name,
				size: formatFileSize(file.size),
				type: extension === 'pdf' ? 'pdf' : 'image'
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

	function handleExtract() {
		uploadState = 'processing';
		processingDetails = 'Processing playbook_week8-page-3 (3/8) - 52s elapsed, ~88s remaining...';

		// Simulate processing - in real app, this would call an API
		setTimeout(() => {
			// Navigate to editor after "processing"
			goto('/editor?position=' + selectedPosition);
		}, 3000);
	}

	function handleChooseDifferent() {
		selectedFiles = [];
		uploadState = 'empty';
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
			<p class="text-zinc-400 text-sm mt-1.5">Server-side AI processing - works even when you switch tabs</p>
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
				<!-- Empty State - Dropzone -->
				<FileDropzone onFilesSelected={handleFilesSelected} />

			{:else if uploadState === 'ready'}
				<!-- Files Selected State -->
				<div class="text-sm font-bold mb-3">Ready to process ({selectedFiles.length} file{selectedFiles.length === 1 ? '' : 's'})</div>

				<FileList files={selectedFiles} onRemove={removeFile} />

				<div class="mt-2.5">
					<Button onclick={handleExtract} fullWidth>Extract Plays with AI</Button>
				</div>
				<div class="mt-2">
					<Button variant="secondary" onclick={handleChooseDifferent} fullWidth>Choose different files</Button>
				</div>

			{:else if uploadState === 'processing'}
				<!-- Processing State -->
				<ProcessingSpinner message="Processing on server..." details={processingDetails} />
			{/if}
		</div>

		<!-- Hint Text -->
		{#if uploadState === 'processing'}
			<p class="text-zinc-600 text-xs text-center mt-3">
				You can switch tabs - processing continues on our servers
			</p>
		{/if}
	</main>
</div>
