<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Button from '$lib/components/Button.svelte';

	let name = $state('');
	let email = $state('');
	let subject = $state('');
	let message = $state('');
	let submitted = $state(false);

	function handleSubmit(e: Event) {
		e.preventDefault();
		// Demo mode - show success message
		submitted = true;
		setTimeout(() => {
			submitted = false;
			name = '';
			email = '';
			subject = '';
			message = '';
		}, 3000);
	}
</script>

<svelte:head>
	<title>Contact Us - Hudl Playbook AI</title>
	<meta name="description" content="Get in touch with the Hudl Playbook AI team." />
</svelte:head>

<div class="min-h-screen bg-zinc-950 pb-20 text-white md:pb-0">
	<Nav />

	<main class="mx-auto max-w-2xl px-6 py-12">
		<!-- Demo Notice -->
		<div class="mb-8 rounded-xl border border-orange-500/30 bg-orange-500/10 p-4">
			<p class="text-sm text-orange-300">
				<span class="font-semibold">Demo Mode:</span>
				Forms are for UI demonstration only. For actual inquiries, email us directly.
			</p>
		</div>

		<h1 class="mb-3 text-3xl font-bold md:text-4xl">Get in Touch</h1>
		<p class="mb-10 text-lg text-zinc-400">Have questions? We'd love to hear from you.</p>

		{#if submitted}
			<div
				class="mb-8 rounded-xl border border-emerald-500/45 bg-emerald-500/15 px-5 py-4 text-emerald-500"
			>
				Message sent successfully! We'll get back to you soon.
			</div>
		{/if}

		<form onsubmit={handleSubmit} class="space-y-6">
			<div>
				<label for="name" class="mb-2 block text-sm font-semibold text-zinc-300">Name</label>
				<input
					id="name"
					type="text"
					bind:value={name}
					required
					placeholder="Your name"
					class="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
				/>
			</div>

			<div>
				<label for="email" class="mb-2 block text-sm font-semibold text-zinc-300">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					placeholder="your@email.com"
					class="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
				/>
			</div>

			<div>
				<label for="subject" class="mb-2 block text-sm font-semibold text-zinc-300">Subject</label>
				<select
					id="subject"
					bind:value={subject}
					required
					class="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
				>
					<option value="">Select a subject</option>
					<option value="general">General Inquiry</option>
					<option value="support">Technical Support</option>
					<option value="billing">Billing Question</option>
					<option value="feature">Feature Request</option>
					<option value="other">Other</option>
				</select>
			</div>

			<div>
				<label for="message" class="mb-2 block text-sm font-semibold text-zinc-300">Message</label>
				<textarea
					id="message"
					bind:value={message}
					required
					rows="6"
					placeholder="How can we help you?"
					class="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
				></textarea>
			</div>

			<Button type="submit" size="lg">Send Message</Button>
		</form>

		<!-- Alternative Contact Methods -->
		<div class="mt-16 border-t border-zinc-800 pt-8">
			<h2 class="mb-6 text-xl font-bold">Other Ways to Reach Us</h2>
			<div class="grid gap-6 md:grid-cols-3">
				<div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
					<div class="mb-1 font-bold text-zinc-300">Email</div>
					<a
						href="mailto:support@hudlplaybookai.com"
						class="text-orange-400 transition-colors hover:text-orange-300"
					>
						support@hudlplaybookai.com
					</a>
				</div>
				<div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
					<div class="mb-1 font-bold text-zinc-300">Response Time</div>
					<div class="text-zinc-400">Usually within 24 hours</div>
				</div>
				<div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
					<div class="mb-1 font-bold text-zinc-300">Office Hours</div>
					<div class="text-zinc-400">Mon-Fri, 9am-6pm EST</div>
				</div>
			</div>
		</div>
	</main>
</div>
