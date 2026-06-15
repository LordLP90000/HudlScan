<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import { ALLOWED_FORMATS_LABEL, MAX_FILE_SIZE_MB } from '$lib/config';

	const lastUpdated = 'June 2026';
</script>

<svelte:head>
	<title>Privacy & Data Handling - Hudl Playbook AI</title>
	<meta
		name="description"
		content="How Hudl Playbook AI handles the playbook files you upload: what is processed, what is stored, and what is shared with third-party AI services."
	/>
</svelte:head>

<div class="min-h-screen bg-zinc-950 pb-20 text-white md:pb-0">
	<Nav />

	<main class="mx-auto max-w-2xl px-6 py-12">
		<h1 class="mb-2 text-3xl font-bold md:text-4xl">Privacy &amp; Data Handling</h1>
		<p class="mb-10 text-sm text-zinc-500">Last updated: {lastUpdated}</p>

		<!-- Prototype notice -->
		<div class="mb-8 rounded-xl border border-orange-500/30 bg-orange-500/10 p-4">
			<p class="text-sm text-orange-300">
				<span class="font-semibold">Student prototype:</span>
				Hudl Playbook AI is a study project (Module 322). Please do not upload sensitive or personal
				information. This page explains, in plain language, what happens to the files you upload.
			</p>
		</div>

		<div class="space-y-8 text-zinc-300">
			<section>
				<h2 class="mb-2 text-xl font-bold text-white">What you upload</h2>
				<p class="leading-relaxed text-zinc-400">
					You can upload playbook pages as {ALLOWED_FORMATS_LABEL} files (up to {MAX_FILE_SIZE_MB}MB per
					file). PDFs and images are first prepared directly in your browser before any play
					extraction begins.
				</p>
			</section>

			<section>
				<h2 class="mb-2 text-xl font-bold text-white">How your files are processed</h2>
				<p class="leading-relaxed text-zinc-400">
					To recognise formations, concepts and routes, each prepared image is sent to our extraction
					endpoint and forwarded to a third-party AI vision service for analysis. The image is
					processed only to return the extracted plays for that page — it is not used to build a
					public profile of you.
				</p>
			</section>

			<section>
				<h2 class="mb-2 text-xl font-bold text-white">What we store</h2>
				<ul class="list-disc space-y-2 pl-5 leading-relaxed text-zinc-400">
					<li>
						Extracted plays are kept only in your browser's session storage so the editor can display
						them. They are removed when you close the tab.
					</li>
					<li>The app does not create an account for you and does not store your uploads in a database.</li>
					<li>The Excel file you export is generated in your browser and downloaded directly to your device.</li>
				</ul>
			</section>

			<section>
				<h2 class="mb-2 text-xl font-bold text-white">Third-party processing</h2>
				<p class="leading-relaxed text-zinc-400">
					Image analysis is performed by external AI providers. Their handling of the data you send is
					governed by their own terms and privacy policies. Because of this, you should avoid
					uploading confidential material.
				</p>
			</section>

			<section>
				<h2 class="mb-2 text-xl font-bold text-white">Your choices</h2>
				<p class="leading-relaxed text-zinc-400">
					Don't upload anything you are not comfortable sending for processing. You can clear extracted
					data at any time by closing the browser tab or starting a new upload.
				</p>
			</section>

			<section>
				<h2 class="mb-2 text-xl font-bold text-white">Questions</h2>
				<p class="leading-relaxed text-zinc-400">
					If you have any questions about how data is handled, please reach out via the
					<a href="/contact" class="text-orange-400 underline-offset-2 hover:underline">contact page</a>.
				</p>
			</section>
		</div>
	</main>
</div>
