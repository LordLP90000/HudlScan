<script lang="ts">
	interface Props {
		title: string;
		description: string;
	}

	let { title, description }: Props = $props();
</script>

<div class="min-h-[88px] rounded-xl border border-zinc-800 bg-zinc-900 p-3">
	<h4 class="mb-1.5 text-sm font-bold">{title}</h4>
	<p class="text-xs text-zinc-400">{description}</p>
</div>
