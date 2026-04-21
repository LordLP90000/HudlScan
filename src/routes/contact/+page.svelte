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
		// In a real app, this would send the form data to a server
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
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-white">
	<Nav />

	<main class="max-w-2xl mx-auto px-5 py-10">
		<h1 class="text-3xl font-bold mb-2">Contact Us</h1>
		<p class="text-zinc-400 mb-8">Have questions? We'd love to hear from you.</p>

		{#if submitted}
			<div class="border border-emerald-500/45 bg-emerald-500/15 text-emerald-500 rounded-lg px-4 py-3 mb-8">
				Message sent successfully! We'll get back to you soon.
			</div>
		{/if}

		<form onsubmit={handleSubmit} class="space-y-6">
			<div>
				<label for="name" class="block text-sm font-medium mb-2">Name</label>
				<input
					id="name"
					type="text"
					bind:value={name}
					required
					placeholder="Your name"
					class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
				/>
			</div>

			<div>
				<label for="email" class="block text-sm font-medium mb-2">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					placeholder="your@email.com"
					class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
				/>
			</div>

			<div>
				<label for="subject" class="block text-sm font-medium mb-2">Subject</label>
				<select
					id="subject"
					bind:value={subject}
					required
					class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
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
				<label for="message" class="block text-sm font-medium mb-2">Message</label>
				<textarea
					id="message"
					bind:value={message}
					required
					rows="6"
					placeholder="How can we help you?"
					class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 resize-none"
				></textarea>
			</div>

			<Button type="submit">Send Message</Button>
		</form>

		<!-- Alternative Contact Methods -->
		<div class="mt-12 pt-8 border-t border-zinc-800">
			<h2 class="text-xl font-bold mb-4">Other ways to reach us</h2>
			<div class="grid md:grid-cols-3 gap-6 text-sm">
				<div>
					<div class="font-bold mb-1">Email</div>
					<div class="text-zinc-400">support@hudlplaybookai.com</div>
				</div>
				<div>
					<div class="font-bold mb-1">Response Time</div>
					<div class="text-zinc-400">Usually within 24 hours</div>
				</div>
				<div>
					<div class="font-bold mb-1">Office Hours</div>
					<div class="text-zinc-400">Mon-Fri, 9am-6pm EST</div>
				</div>
			</div>
		</div>
	</main>
</div>
