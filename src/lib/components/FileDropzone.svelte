<script lang="ts">
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
	class="border-2 border-dashed rounded-xl text-center text-zinc-400 py-6 text-sm cursor-pointer transition-all {isDragging
		? 'border-orange-500 bg-orange-500/10'
		: 'border-zinc-800 hover:border-zinc-700'}"
	ondrop={handleDrop}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	role="button"
	tabindex="0"
>
	<input type="file" accept=".png,.jpg,.jpeg,.pdf,.webp,.svg" {multiple} onchange={handleFileInput} class="hidden" id="file-input" />
	<label for="file-input" class="cursor-pointer">
		Click to upload your playbook<br />
		<span class="text-xs text-zinc-600">Supports PNG, JPG, PDF, WEBP, SVG - Multiple files allowed</span>
	</label>
</div>
