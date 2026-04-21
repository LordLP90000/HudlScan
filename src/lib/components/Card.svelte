<script lang="ts">
	interface Props {
		title: string;
		description: string;
	}

	let { title, description }: Props = $props();
</script>

<div class="border border-zinc-800 rounded-xl bg-zinc-900 p-3 min-h-[88px]">
	<h4 class="font-bold text-sm mb-1.5">{title}</h4>
	<p class="text-zinc-400 text-xs">{description}</p>
</div>
