<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { Chat } from '@ai-sdk/svelte';
	import { ScrollArea } from 'bits-ui';

	let { chat, onClose }: { chat: Chat; onClose: () => void } = $props();

	let input = $state(''); // We now manually track the input

	// 1. We track the dummy div at the bottom, not the Viewport itself
	let messagesEndRef = $state<HTMLElement | null>(null);

	// Auto-scrolling to the bottom.
	// 2. The Auto-scroll Effect
	$effect(() => {
		// We track chat.messages.length to trigger the effect
		if (chat.messages.length && messagesEndRef) {
			queueMicrotask(() => {
				// Smoothly scroll the anchor into view safely
				messagesEndRef?.scrollIntoView({ behavior: 'smooth', block: 'end' });
			});
		}
	});

	function handleChatSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!input.trim()) return;

		// Use the new class method to send the message
		chat.sendMessage({ text: input });
		input = ''; // Clear input manually
	}
</script>

<div
	transition:slide={{ axis: 'y', duration: 300 }}
	class="absolute bottom-full z-50 mb-4 flex h-80 w-[90vw] max-w-md origin-bottom flex-col rounded-2xl border border-zinc-700 bg-zinc-900/95 p-4 font-mono text-sm shadow-2xl backdrop-blur-md"
>
	<!-- Header -->
	<div class="mb-2 flex items-center justify-between border-b border-zinc-800 pb-2">
		<span class="font-bold text-zinc-300">Terminal Chat</span>
		<button
			onclick={onClose}
			class="cursor-pointer font-bold text-zinc-500 transition-colors hover:text-red-400 focus:ring focus:ring-red-400/50 focus:outline-none"
			aria-label="Close Chat"
		>
			[X]
		</button>
	</div>

	<!-- The ScrollArea -->
	<ScrollArea.Root class="mb-4 flex-1 overflow-hidden">
		<!-- Removed bind:el and bind:this from the Viewport completely -->
		<ScrollArea.Viewport class="h-full w-full pr-4">
			<!-- Replaced Content with a standard div wrapper -->
			<div class="space-y-3">
				{#if chat.messages.length === 0}
					<div class="mt-8 text-center text-zinc-500">System online. Ask me about Vishwa...</div>
				{/if}

				{#each chat.messages as message, i (i)}
					<div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
						<div
							class="max-w-[85%] rounded-lg p-2.5 {message.role === 'user'
								? 'bg-blue-600 text-white'
								: 'border border-zinc-700 bg-zinc-800 text-zinc-300 shadow-md'}"
						>
							{#each message.parts as part, j (j)}
								{#if part.type === 'text'}
									{part.text}
								{/if}
							{/each}
						</div>
					</div>
				{/each}

				{#if (chat.status === 'streaming' || chat.status === 'submitted') && chat.messages[chat.messages.length - 1]?.role === 'user'}
					<div class="flex justify-start">
						<div
							class="max-w-[80%] animate-pulse rounded border border-zinc-700 bg-zinc-800 p-2 text-zinc-500"
						>
							Thinking...
						</div>
					</div>
				{/if}

				<!-- THE ANCHOR: This invisible div always stays at the bottom -->
				<div bind:this={messagesEndRef} class="h-1 w-full"></div>
			</div>
		</ScrollArea.Viewport>

		<!-- Custom Headless Scrollbar -->
		<ScrollArea.Scrollbar
			orientation="vertical"
			class="flex w-2.5 touch-none border-l border-l-transparent bg-zinc-800/30 p-px transition-colors select-none hover:bg-zinc-800/50"
		>
			<ScrollArea.Thumb class="relative flex-1 rounded-full bg-zinc-600 hover:bg-zinc-500" />
		</ScrollArea.Scrollbar>
		<ScrollArea.Corner />
	</ScrollArea.Root>

	<!-- Input Form -->
	<form onsubmit={handleChatSubmit} class="mt-auto flex gap-2">
		<input
			class="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white transition-colors outline-none focus:border-blue-500 focus:bg-zinc-700"
			bind:value={input}
			placeholder="Message..."
			disabled={chat.status === 'streaming' || chat.status === 'submitted'}
		/>
		<button
			type="submit"
			disabled={chat.status === 'streaming' || chat.status === 'submitted' || !input.trim()}
			class="rounded-lg bg-blue-600 px-4 py-2 text-white transition-transform hover:bg-blue-500 active:scale-95 disabled:opacity-50"
		>
			Send
		</button>
	</form>
</div>
