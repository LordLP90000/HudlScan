<script lang="ts">
	interface FileItem {
		name: string;
		size: string;
		type: 'pdf' | 'image' | 'svg';
	}

	interface Props {
		files: FileItem[];
		onRemove: (index: number) => void;
	}

	let { files, onRemove }: Props = $props();

	function formatSize(bytes: number): string {
		if (bytes < 1024 * 1024) {
			return (bytes / 1024).toFixed(1) + ' KB';
		}
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
	}

	function getFileIcon(type: string): string {
		if (type === 'pdf') return '📄';
		if (type === 'svg') return '🎨';
		return '🖼️';
	}
</script>

<div class="grid gap-2 mt-3">
	{#each files as file, index (index)}
		<div class="grid grid-cols-[20px_1fr_80px_24px] items-center gap-2 rounded-lg bg-zinc-900 p-2 text-xs">
			<span>{getFileIcon(file.type)}</span>
			<span class="truncate">{file.name}</span>
			<span class="text-zinc-500">{file.size}</span>
			<button
				class="text-zinc-500 hover:text-red-500 transition-colors flex items-center justify-center"
				onclick={() => onRemove(index)}
				aria-label="Remove {file.name}"
				title="Remove file"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>
	{/each}
</div>
