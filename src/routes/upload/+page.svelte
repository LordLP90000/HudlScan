<script lang="ts">
	import { goto } from '$app/navigation';
	import Nav from '$lib/components/Nav.svelte';
	import PositionSelector from '$lib/components/PositionSelector.svelte';
	import FileDropzone from '$lib/components/FileDropzone.svelte';
	import FileList from '$lib/components/FileList.svelte';
	import Button from '$lib/components/Button.svelte';
	import ProcessingSpinner from '$lib/components/ProcessingSpinner.svelte';
	import Banner from '$lib/components/Banner.svelte';
	import * as pdfjsLib from 'pdfjs-dist';
	import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

	// Set up PDF.js worker with local import
	pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

	interface FileItem {
		name: string;
		size: string;
		type: 'pdf' | 'image';
		file: File;
		pageCount?: number;
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
	let isProcessing = $state(false);

	// Use relative path - works on both localhost and Vercel
	const API_BASE = '';

	async function convertPdfToImages(file: File): Promise<string[]> {
		const arrayBuffer = await file.arrayBuffer();
		const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
		const images: string[] = [];

		for (let i = 1; i <= pdf.numPages; i++) {
			const page = await pdf.getPage(i);
			const scale = 4.0; // Higher scale for better quality (detailed playbook diagrams)
			const viewport = page.getViewport({ scale });

			const canvas = document.createElement('canvas');
			const context = canvas.getContext('2d');
			canvas.height = viewport.height;
			canvas.width = viewport.width;

			if (context) {
				await page.render({ canvasContext: context, viewport, canvas }).promise;
				images.push(canvas.toDataURL('image/png'));
			}
		}

		return images;
	}

	async function extractPlaysFromImage(imageBase64: string, fileName: string): Promise<Play[]> {
		const response = await fetch(`${API_BASE}/api/extract-plays`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				imageBase64: imageBase64.split(',')[1],
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
			let fileType: 'pdf' | 'image' = 'image';
			if (extension === 'pdf') fileType = 'pdf';

			fileItems.push({
				name: file.name,
				size: formatFileSize(file.size),
				type: fileType,
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
		// Prevent concurrent uploads
		if (isProcessing) {
			return;
		}
		isProcessing = true;

		uploadState = 'processing';
		extractedPlays = [];

		let totalImages = 0;
		let processedImages = 0;

		// First, count total images for progress tracking
		for (const fileItem of selectedFiles) {
			if (fileItem.type === 'pdf') {
				// We'll count pages as we go
			} else {
				totalImages++;
			}
		}

		for (let i = 0; i < selectedFiles.length; i++) {
			const fileItem = selectedFiles[i];

			try {
				let images: string[] = [];

				if (fileItem.type === 'pdf') {
					processingDetails = `Converting ${fileItem.name} to images...`;
					images = await convertPdfToImages(fileItem.file);
					totalImages += images.length;
				} else {
					// PNG, JPG - send directly as base64
					images = [await fileToBase64(fileItem.file)];
				}

				// Process each image
				for (let j = 0; j < images.length; j++) {
					processedImages++;
					const pageNum = fileItem.type === 'pdf' ? ` (page ${j + 1}/${images.length})` : '';
					processingDetails = `Processing ${fileItem.name}${pageNum} (${processedImages}/${totalImages})...`;

					const plays = await extractPlaysFromImage(images[j], fileItem.name);
					extractedPlays = [...extractedPlays, ...plays];
				}
			} catch (e) {
				isProcessing = false;
				const error = e instanceof Error ? e : new Error(String(e));
				errorMessage = `Failed to process ${fileItem.name}: ${error.message}`;
				uploadState = 'error';
				return;
			}
		}

		// Store plays in sessionStorage for the editor page
		sessionStorage.setItem('extractedPlays', JSON.stringify(extractedPlays));
		sessionStorage.setItem('position', selectedPosition);

		isProcessing = false;

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
			<p class="text-zinc-400 text-sm mt-1.5">AI extracts plays from playbook PDFs or images</p>
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
				Analyzing play diagrams with vision AI... This may take a few minutes for PDFs.
			</p>
		{/if}
	</main>
</div>
