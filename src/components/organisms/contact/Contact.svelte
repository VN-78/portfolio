<script lang="ts">
	import { enhance } from '$app/forms';
	import { Dialog } from 'bits-ui';
	// let { form } = $props();

	let isSubmitting = $state(false);

	// Programmatic Dialog State
	let isDialogOpen = $state(false);
	let dialogTitle = $state('');
	let dialogMessage = $state('');
	let dialogIsSuccess = $state(true);

	// Isolate the regex string so the Svelte HTML parser doesn't choke on it
	const emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
</script>

<section id="contact" class="mx-auto w-full max-w-3xl py-24">
	<h2 class="md:text-6x mb-12 font-heading text-4xl font-bold text-content-main">Get in Touch</h2>

	<form
		method="POST"
		action="?/sendEmail"
		use:enhance={() => {
			isSubmitting = true;

			return async ({ result, update }) => {
				if (result.type === 'success') {
					dialogTitle = 'Message Sent!';
					dialogMessage = "Thank you for reaching out. I'll get back to you as soon as possible.";
					dialogIsSuccess = true;
					await update({ reset: true });
				} else if (result.type === 'failure') {
					dialogTitle = 'Something went wrong';
					dialogMessage =
						(result.data?.error as string) || 'Failed to send message. Please try again.';
					dialogIsSuccess = false;
					await update({ reset: false });
				}

				isSubmitting = false;
				isDialogOpen = true; // Trigger the Dialog
			};
		}}
		class="flex flex-col gap-6"
	>
		<div class="flex flex-col gap-2">
			<label for="name" class="text-sm font-medium text-content-sub">Name</label>
			<input
				type="text"
				id="name"
				name="name"
				required
				class="rounded-lg border border-border-subtle bg-surface-highlight p-3 text-content-main focus:ring-2 focus:ring-accent-primary focus:outline-hidden"
			/>
		</div>

		<div class="flex flex-col gap-2">
			<label for="email" class="text-sm font-medium text-content-sub">Email</label>
			<input
				type="email"
				id="email"
				name="email"
				required
				pattern={emailPattern}
				title="Please enter a valid email address (e.g., user@example.com)"
				class="rounded-lg border border-border-subtle bg-surface-highlight p-3 text-content-main focus:ring-2 focus:ring-accent-primary focus:outline-hidden"
			/>
		</div>

		<div class="flex flex-col gap-2">
			<label for="message" class="text-sm font-medium text-content-sub">Message</label>
			<textarea
				id="message"
				name="message"
				rows="4"
				required
				class="rounded-lg border border-border-subtle bg-surface-highlight p-3 text-content-main focus:ring-2 focus:ring-accent-primary focus:outline-hidden"
			></textarea>
		</div>

		<button
			type="submit"
			disabled={isSubmitting}
			class="mt-4 cursor-pointer rounded-lg bg-accent-primary px-6 py-3 font-medium text-surface-main transition-opacity hover:opacity-90 disabled:opacity-50"
		>
			{isSubmitting ? 'Sending...' : 'Send Message'}
		</button>
	</form>
</section>

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Portal>
		<Dialog.Overlay
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
		/>
		<Dialog.Content
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-xl border border-border-subtle bg-surface-main p-6 shadow-2xl outline-hidden sm:max-w-md md:w-full"
		>
			<div class="flex flex-col items-center gap-4 pt-4 pb-6 text-center">
				<div
					class="flex size-12 items-center justify-center rounded-full {dialogIsSuccess
						? 'bg-emerald-500/10 text-emerald-500'
						: 'bg-red-500/10 text-red-500'}"
				>
					{#if dialogIsSuccess}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="size-6"
						>
							<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
							<polyline points="22 4 12 14.01 9 11.01"></polyline>
						</svg>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="size-6"
						>
							<circle cx="12" cy="12" r="10"></circle>
							<line x1="12" y1="8" x2="12" y2="12"></line>
							<line x1="12" y1="16" x2="12.01" y2="16"></line>
						</svg>
					{/if}
				</div>

				<Dialog.Title class="text-xl font-semibold tracking-tight text-content-main">
					{dialogTitle}
				</Dialog.Title>

				<Dialog.Description class="text-base leading-relaxed text-content-sub">
					{dialogMessage}
				</Dialog.Description>
			</div>

			<div class="flex w-full justify-center">
				<Dialog.Close
					class="inline-flex w-full cursor-pointer items-center justify-center rounded-lg bg-accent-primary px-6 py-3 text-[15px] font-semibold text-surface-main transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:outline-hidden active:scale-[0.98]"
				>
					Close
				</Dialog.Close>
			</div>

			<Dialog.Close
				class="absolute top-5 right-5 cursor-pointer rounded-md transition-colors hover:bg-surface-highlight focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:outline-hidden active:scale-[0.98]"
			>
				<div class="p-1">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="size-5 text-content-main"
					>
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
					<span class="sr-only">Close</span>
				</div>
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
