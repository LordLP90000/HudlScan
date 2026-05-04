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

<div class="min-h-screen bg-zinc-950 text-white pb-20 md:pb-0">
	<Nav />

	<main class="max-w-2xl mx-auto px-6 py-12">
		<!-- Demo Notice -->
		<div class="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-8">
			<p class="text-sm text-orange-300">
				<span class="font-semibold">Demo Mode:</span>
				Forms are for UI demonstration only. For actual inquiries, email us directly.
			</p>
		</div>

		<h1 class="text-3xl md:text-4xl font-bold mb-3">Get in Touch</h1>
		<p class="text-zinc-400 text-lg mb-10">Have questions? We'd love to hear from you.</p>

		{#if submitted}
			<div
				class="border border-emerald-500/45 bg-emerald-500/15 text-emerald-500 rounded-xl px-5 py-4 mb-8"
			>
				Message sent successfully! We'll get back to you soon.
			</div>
		{/if}

		<form onsubmit={handleSubmit} class="space-y-6">
			<div>
				<label for="name" class="block text-sm font-semibold mb-2 text-zinc-300">Name</label>
				<input
					id="name"
					type="text"
					bind:value={name}
					required
					placeholder="Your name"
					class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
				/>
			</div>

			<div>
				<label for="email" class="block text-sm font-semibold mb-2 text-zinc-300">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					placeholder="your@email.com"
					class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
				/>
			</div>

			<div>
				<label for="subject" class="block text-sm font-semibold mb-2 text-zinc-300">Subject</label>
				<select
					id="subject"
					bind:value={subject}
					required
					class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
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
				<label for="message" class="block text-sm font-semibold mb-2 text-zinc-300">Message</label>
				<textarea
					id="message"
					bind:value={message}
					required
					rows="6"
					placeholder="How can we help you?"
					class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none transition-colors"
				></textarea>
			</div>

			<Button type="submit" size="lg">Send Message</Button>
		</form>

		<!-- Alternative Contact Methods -->
		<div class="mt-16 pt-8 border-t border-zinc-800">
			<h2 class="text-xl font-bold mb-6">Other Ways to Reach Us</h2>
			<div class="grid md:grid-cols-3 gap-6">
				<div class="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
					<div class="font-bold mb-1 text-zinc-300">Email</div>
					<a
						href="mailto:support@hudlplaybookai.com"
						class="text-orange-400 hover:text-orange-300 transition-colors"
					>
						support@hudlplaybookai.com
					</a>
				</div>
				<div class="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
					<div class="font-bold mb-1 text-zinc-300">Response Time</div>
					<div class="text-zinc-400">Usually within 24 hours</div>
				</div>
				<div class="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
					<div class="font-bold mb-1 text-zinc-300">Office Hours</div>
					<div class="text-zinc-400">Mon-Fri, 9am-6pm EST</div>
				</div>
			</div>
		</div>
	</main>
</div>
