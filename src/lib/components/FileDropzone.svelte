<script lang="ts">
	import { ALLOWED_EXTENSIONS, ALLOWED_FORMATS_LABEL, MAX_FILE_SIZE_MB } from '$lib/config';

	interface Props {
		onFilesSelected: (files: FileList) => void;
		multiple?: boolean;
	}

	let { onFilesSelected, multiple = true }: Props = $props();

	let isDragging = $state(false);

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;

		const files = e.dataTransfer?.files;
		if (files && files.length > 0) {
			onFilesSelected(files);
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	function handleFileInput(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			onFilesSelected(input.files);
		}
	}
</script>

<div
	class="cursor-pointer rounded-xl border-2 border-dashed py-6 text-center text-sm text-zinc-400 transition-all {isDragging
		? 'border-orange-500 bg-orange-500/10'
		: 'border-zinc-800 hover:border-zinc-700'}"
	ondrop={handleDrop}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	role="button"
	tabindex="0"
>
	<input
		type="file"
		accept={ALLOWED_EXTENSIONS}
		{multiple}
		onchange={handleFileInput}
		class="hidden"
		id="file-input"
	/>
	<label for="file-input" class="cursor-pointer">
		Click to upload your playbook<br />
		<span class="text-xs text-zinc-600"
			>Supports {ALLOWED_FORMATS_LABEL} up to {MAX_FILE_SIZE_MB}MB · Multiple files allowed</span
		>
	</label>
</div>
