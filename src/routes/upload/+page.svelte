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

	interface ExtractionResult {
		plays: Play[];
		skipped?: boolean;
		warning?: string;
	}

	interface ImageUnit {
		dataUrl: string;
		isSegmented: boolean;
		segmentIndex?: number;
		segmentTotal?: number;
	}

	type DebugLevel = 'info' | 'success' | 'error';

	interface DebugEntry {
		time: string;
		level: DebugLevel;
		message: string;
	}

	type UploadState = 'empty' | 'ready' | 'processing' | 'error' | 'complete';

	let selectedPosition = $state('FB');
	let uploadState = $state<UploadState>('empty');
	let selectedFiles = $state<FileItem[]>([]);
	let errorMessage = $state('');
	let processingDetails = $state('');
	let extractedPlays = $state<Play[]>([]);
	let isProcessing = $state(false);
	let debugEntries = $state<DebugEntry[]>([]);
	let showDebugPanel = $state(false);

	// Use relative path - works on both localhost and Vercel
	const API_BASE = '';

	function addDebug(level: DebugLevel, message: string) {
		const entry: DebugEntry = {
			time: new Date().toLocaleTimeString(),
			level,
			message
		};
		debugEntries = [...debugEntries, entry].slice(-150);
	}

	function resetDebug() {
		debugEntries = [];
	}

	function findWhitespaceGaps(
		densities: number[],
		length: number,
		isHorizontal: boolean
	): Array<[number, number]> {
		const gapThreshold = isHorizontal ? 0.01 : 0.006;
		const minGapSize = Math.max(8, Math.floor(length * 0.015));
		const minBandSize = Math.max(60, Math.floor(length * 0.08));

		const boundaries = [0];
		let gapStart = -1;

		for (let i = 0; i < densities.length; i++) {
			if (densities[i] <= gapThreshold) {
				if (gapStart === -1) gapStart = i;
			} else if (gapStart !== -1) {
				if (i - gapStart >= minGapSize) boundaries.push(Math.floor((gapStart + i) / 2));
				gapStart = -1;
			}
		}

		if (gapStart !== -1 && densities.length - gapStart >= minGapSize) {
			boundaries.push(Math.floor((gapStart + densities.length) / 2));
		}

		boundaries.push(length);
		boundaries.sort((a, b) => a - b);

		const bands: Array<[number, number]> = [];
		for (let i = 0; i < boundaries.length - 1; i++) {
			const start = boundaries[i];
			const end = boundaries[i + 1];
			if (end - start >= minBandSize) {
				bands.push([start, end]);
			}
		}

		if (bands.length === 0) return [[0, length]];
		return bands;
	}

	async function splitImageIntoPanels(dataUrl: string): Promise<ImageUnit[]> {
		const image = new Image();
		image.src = dataUrl;

		await new Promise<void>((resolve, reject) => {
			image.onload = () => resolve();
			image.onerror = () => reject(new Error('Failed to load image for panel splitting'));
		});

		const width = image.naturalWidth;
		const height = image.naturalHeight;

		if (width < 300 || height < 300) {
			return [{ dataUrl, isSegmented: false }];
		}

		const sourceCanvas = document.createElement('canvas');
		sourceCanvas.width = width;
		sourceCanvas.height = height;
		const ctx = sourceCanvas.getContext('2d', { willReadFrequently: true });
		if (!ctx) return [{ dataUrl, isSegmented: false }];

		ctx.drawImage(image, 0, 0, width, height);
		const imageData = ctx.getImageData(0, 0, width, height);
		const { data } = imageData;

		const rowDensity = new Array(height).fill(0);
		const colDensity = new Array(width).fill(0);

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const idx = (y * width + x) * 4;
				const r = data[idx];
				const g = data[idx + 1];
				const b = data[idx + 2];
				const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
				if (luminance < 0.95) {
					rowDensity[y]++;
					colDensity[x]++;
				}
			}
		}

		const normalizedRowDensity = rowDensity.map((v) => v / width);
		const normalizedColDensity = colDensity.map((v) => v / height);

		const rowBands = findWhitespaceGaps(normalizedRowDensity, height, true);
		const colBands = findWhitespaceGaps(normalizedColDensity, width, false);

		const panelCanvas = document.createElement('canvas');
		const panels: string[] = [];

		for (const [y1, y2] of rowBands) {
			for (const [x1, x2] of colBands) {
				const w = x2 - x1;
				const h = y2 - y1;
				if (w < 100 || h < 100) continue;

				let darkPixels = 0;
				for (let y = y1; y < y2; y++) {
					for (let x = x1; x < x2; x++) {
						const idx = (y * width + x) * 4;
						const r = data[idx];
						const g = data[idx + 1];
						const b = data[idx + 2];
						const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
						if (luminance < 0.95) darkPixels++;
					}
				}

				const density = darkPixels / (w * h);
				if (density < 0.02 || darkPixels < 2200) continue;

				const padX = Math.floor(w * 0.08);
				const padTop = Math.floor(h * 0.1);
				const padBottom = Math.floor(h * 0.2);
				const sx = Math.max(0, x1 - padX);
				const sy = Math.max(0, y1 - padTop);
				const ex = Math.min(width, x2 + padX);
				const ey = Math.min(height, y2 + padBottom);
				const paddedW = ex - sx;
				const paddedH = ey - sy;

				panelCanvas.width = paddedW;
				panelCanvas.height = paddedH;
				const panelCtx = panelCanvas.getContext('2d');
				if (!panelCtx) continue;

				panelCtx.clearRect(0, 0, paddedW, paddedH);
				panelCtx.drawImage(sourceCanvas, sx, sy, paddedW, paddedH, 0, 0, paddedW, paddedH);
				panels.push(panelCanvas.toDataURL('image/png'));
			}
		}

		if (panels.length <= 1 || panels.length > 24) {
			return [{ dataUrl, isSegmented: false }];
		}

		return panels.map((panel, idx) => ({
			dataUrl: panel,
			isSegmented: true,
			segmentIndex: idx + 1,
			segmentTotal: panels.length
		}));
	}

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

	async function extractPlaysFromImage(
		imageBase64: string,
		fileName: string,
		imageIndex: number,
		imageTotal: number,
		unit?: ImageUnit
	): Promise<ExtractionResult> {
		const response = await fetch(`${API_BASE}/api/extract-plays`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				imageBase64: imageBase64.split(',')[1],
				fileName,
				position: selectedPosition,
				imageIndex,
				imageTotal,
				isSegmented: unit?.isSegmented || false,
				segmentIndex: unit?.segmentIndex,
				segmentTotal: unit?.segmentTotal
			})
		});

		if (!response.ok) {
			throw new Error(`API error: ${response.statusText}`);
		}

		const data = await response.json();
		return {
			plays: data.plays || [],
			skipped: data.skipped,
			warning: data.warning
		};
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
		resetDebug();
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
		addDebug('info', `Selected ${fileItems.length} file${fileItems.length === 1 ? '' : 's'} for processing.`);
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
		resetDebug();

		uploadState = 'processing';
		extractedPlays = [];
		addDebug('info', `Starting extraction for ${selectedFiles.length} file${selectedFiles.length === 1 ? '' : 's'}.`);

		let totalImages = 0;
		let processedImages = 0;

		// First, count total images for progress tracking
		for (const fileItem of selectedFiles) {
			if (fileItem.type === 'pdf') {
				// We'll count pages as we go
				addDebug('info', `${fileItem.name}: queued as PDF.`);
			} else {
				totalImages++;
				addDebug('info', `${fileItem.name}: queued as image.`);
			}
		}

		for (let i = 0; i < selectedFiles.length; i++) {
			const fileItem = selectedFiles[i];

			try {
				let units: ImageUnit[] = [];

				if (fileItem.type === 'pdf') {
					processingDetails = `Converting ${fileItem.name} to images...`;
					addDebug('info', `${fileItem.name}: converting PDF pages to images.`);
					const images = await convertPdfToImages(fileItem.file);
					units = images.map((img) => ({ dataUrl: img, isSegmented: false }));
					totalImages += units.length;
					addDebug('info', `${fileItem.name}: detected ${units.length} page image${units.length === 1 ? '' : 's'}.`);
				} else {
					// PNG/JPG can contain multiple drawings. Split into visual panels and process each panel independently.
					processingDetails = `Preparing ${fileItem.name} panels...`;
					addDebug('info', `${fileItem.name}: detecting drawing panels.`);
					const base64Image = await fileToBase64(fileItem.file);
					units = await splitImageIntoPanels(base64Image);
					totalImages += Math.max(units.length - 1, 0);
					addDebug('info', `${fileItem.name}: detected ${units.length} panel${units.length === 1 ? '' : 's'}.`);
				}

				// Process each image
				for (let j = 0; j < units.length; j++) {
					const unit = units[j];
					processedImages++;
					const pageNum = fileItem.type === 'pdf' ? ` (page ${j + 1}/${units.length})` : '';
					processingDetails = `Processing ${fileItem.name}${pageNum} (${processedImages}/${totalImages})...`;
					const imageName =
						fileItem.type === 'pdf'
							? `${fileItem.name}#page-${j + 1}`
							: `${fileItem.name}#segment-${unit.segmentIndex || j + 1}`;
					addDebug('info', `Scanning ${imageName} (${processedImages}/${totalImages}).`);

					const result = await extractPlaysFromImage(
						unit.dataUrl,
						imageName,
						processedImages,
						totalImages,
						unit
					);
					if (result.skipped) {
						addDebug('info', `${imageName}: skipped (${result.warning || 'no rows detected'}).`);
						continue;
					}

					extractedPlays = [...extractedPlays, ...result.plays];
					addDebug('success', `${imageName}: extracted ${result.plays.length} row${result.plays.length === 1 ? '' : 's'}.`);
				}
			} catch (e) {
				isProcessing = false;
				const error = e instanceof Error ? e : new Error(String(e));
				errorMessage = `Failed to process ${fileItem.name}: ${error.message}`;
				addDebug('error', `${fileItem.name}: ${error.message}`);
				uploadState = 'error';
				return;
			}
		}

		// Store plays in sessionStorage for the editor page
		sessionStorage.setItem('extractedPlays', JSON.stringify(extractedPlays));
		sessionStorage.setItem('position', selectedPosition);

		isProcessing = false;
		addDebug('success', `Extraction complete. Total rows extracted: ${extractedPlays.length}.`);

		// Navigate to editor
		goto('/editor?position=' + selectedPosition);
	}

	function handleChooseDifferent() {
		selectedFiles = [];
		uploadState = 'empty';
		extractedPlays = [];
		resetDebug();
	}

	function handleDismissError() {
		errorMessage = '';
		uploadState = 'empty';
	}
</script>

<svelte:head>
	<title>Upload Your Playbook - Hudl Playbook AI</title>
	<meta
		name="description"
		content="Upload your football playbook screenshots or PDFs and let AI extract every play into a formatted Excel spreadsheet."
	/>
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-white pb-20 md:pb-0">
	<Nav links={false} cta={false} backButton />

	<main class="max-w-150 mx-auto px-5 py-8">
		<!-- Page Title -->
		<div class="text-center mb-8">
			<h1 class="text-3xl md:text-4xl font-bold mb-3">
				Upload Your <span class="text-orange-500">Playbook</span>
			</h1>
			<p class="text-zinc-400 text-base max-w-md mx-auto leading-relaxed">
				Select your position, upload playbook images or PDFs, and get every play extracted to
				Excel in seconds.
			</p>
		</div>

		<!-- What You Get -->
		<div class="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mb-6">
			<p class="text-sm text-zinc-300 text-center">
				<span class="text-orange-400 font-semibold">You'll get:</span>
				Formation, Concept, Position Routes, and Tags in a formatted Excel sheet
			</p>
		</div>

		<!-- Error Banner -->
		{#if uploadState === 'error' && errorMessage}
			<Banner variant="error" message={errorMessage} onDismiss={handleDismissError} />
		{/if}

		<!-- Main Panel -->
		<div class="border border-zinc-800 rounded-2xl bg-zinc-900 p-6">
			<!-- Position Selector with clearer label -->
			<div class="mb-6">
				<label class="block text-sm font-semibold mb-3 text-zinc-300">
					Which position are you extracting for?
				</label>
				<PositionSelector
					selectedPosition={selectedPosition}
					onSelect={(pos: string) => (selectedPosition = pos)}
				/>
			</div>

			{#if uploadState === 'empty'}
				<div>
					<FileDropzone onFilesSelected={handleFilesSelected} />
					<p class="text-xs text-zinc-500 mt-3 text-center">
						Supports PDF, PNG, and JPG files up to 50MB
					</p>
				</div>

			{:else if uploadState === 'ready'}
				<div class="text-sm font-semibold mb-3 text-zinc-300">
					Ready to process ({selectedFiles.length} file{selectedFiles.length === 1 ? '' : 's'})
				</div>

				<FileList files={selectedFiles} onRemove={removeFile} />

				<div class="mt-4">
					<Button onclick={handleExtract} fullWidth size="lg">Extract Plays to Excel</Button>
				</div>
				<div class="mt-2">
					<Button variant="secondary" onclick={handleChooseDifferent} fullWidth
						>Choose different files</Button
					>
				</div>

			{:else if uploadState === 'processing'}
				<ProcessingSpinner message="Extracting plays with AI..." details={processingDetails} />
			{/if}
		</div>

		<!-- Debug Panel - Hidden by default for better UX -->
		{#if uploadState !== 'empty' && uploadState !== 'processing'}
			<button
				type="button"
				onclick={() => (showDebugPanel = !showDebugPanel)}
				class="w-full mt-4 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
			>
				{showDebugPanel ? 'Hide' : 'Show'} debug panel
			</button>
		{/if}

		{#if showDebugPanel && uploadState !== 'processing'}
			<div class="mt-3 border border-zinc-800 rounded-xl bg-zinc-900/80 overflow-hidden">
				<div class="px-4 py-2 border-b border-zinc-800">
					<h3 class="text-xs font-semibold tracking-wide text-zinc-300">Debug panel</h3>
				</div>
				<div class="max-h-48 overflow-y-auto px-4 py-3 space-y-1.5 text-[11px] font-mono">
					{#if debugEntries.length === 0}
						<p class="text-zinc-500">No debug events yet.</p>
					{:else}
						{#each debugEntries as entry}
							<p
								class={entry.level === 'error'
									? 'text-red-400'
									: entry.level === 'success'
										? 'text-emerald-400'
										: 'text-zinc-300'}
							>
								[{entry.time}] {entry.message}
							</p>
						{/each}
					{/if}
				</div>
			</div>
		{/if}

		<!-- Processing Hint -->
		{#if uploadState === 'processing'}
			<p class="text-zinc-500 text-sm text-center mt-4">
				Analyzing play diagrams with vision AI... This typically takes 30-60 seconds per page.
			</p>
		{/if}

		<!-- Trust Indicators -->
		{#if uploadState === 'empty'}
			<div class="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
				<div class="bg-zinc-900/50 rounded-lg p-3">
					<div class="text-orange-400 font-bold text-lg">PDF</div>
					<div class="text-zinc-500">Multi-page</div>
				</div>
				<div class="bg-zinc-900/50 rounded-lg p-3">
					<div class="text-orange-400 font-bold text-lg">All</div>
					<div class="text-zinc-500">Positions</div>
				</div>
				<div class="bg-zinc-900/50 rounded-lg p-3">
					<div class="text-orange-400 font-bold text-lg">99%</div>
					<div class="text-zinc-500">Accuracy</div>
				</div>
			</div>
		{/if}
	</main>
</div>
