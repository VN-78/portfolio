<script lang="ts">
	import { slide } from 'svelte/transition';
	import { tick } from 'svelte';
	import type { Chat } from '@ai-sdk/svelte';
	import Lenis from 'lenis';

	let { chat, onClose }: { chat: Chat; onClose: () => void } = $props();

	let input = $state('');
	let messagesEndRef = $state<HTMLElement | null>(null);

	// We need to track the viewport to check scroll position
	let viewportRef = $state<HTMLElement | null>(null);
	let isUserScrolling = $state(false);

	// We store the local Lenis instance here so our auto-scroll effect can use it
	let chatLenis = $state<Lenis | null>(null);

	let scrollTimeout: ReturnType<typeof setTimeout>;

	// --- 1. THE LENIS ACTION ---
	function applyLocalLenis(node: HTMLElement) {
		// Stop the wheel event from bubbling up to the main page's global Lenis instance!
		function killBubble(e: WheelEvent) {
			e.stopPropagation();
		}
		node.addEventListener('wheel', killBubble, { passive: false });

		// Initialize a Lenis instance strictly isolated to this specific div
		const lenis = new Lenis({
			wrapper: node,
			content: node.firstElementChild as HTMLElement,
			gestureOrientation: 'vertical',
			smoothWheel: true
		});

		chatLenis = lenis;

		// Hook Lenis into our UX scroll flag!
		lenis.on('scroll', () => {
			isUserScrolling = true;
			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(() => {
				isUserScrolling = false;
			}, 1500);
		});

		// The isolated RequestAnimationFrame loop
		let rafId: number;
		function raf(time: number) {
			lenis.raf(time);
			rafId = requestAnimationFrame(raf);
		}
		requestAnimationFrame(raf);

		return {
			destroy() {
				node.removeEventListener('wheel', killBubble);
				cancelAnimationFrame(rafId);
				lenis.destroy();
				chatLenis = null;
			}
		};
	}

	// --- 2. THE UPGRADED AUTO-SCROLL ---
	$effect(() => {
		const length = chat.messages.length;
		const lastMessage = length > 0 ? chat.messages[length - 1] : null;

		if (length > 0 && lastMessage && messagesEndRef && chatLenis) {
			const limit = chatLenis.limit ?? 0;
			const scroll = chatLenis.scroll ?? 0;

			// We widened the threshold slightly to 100px to account for larger text chunks
			const isAtBottom = limit - scroll < 100;

			if (isAtBottom && !isUserScrolling) {
				// Wait for Svelte to physically render the new text into the HTML
				tick().then(() => {
					// CRITICAL: Tell Lenis that the DOM height has changed so it
					// updates its internal 'limit' variable before scrolling.
					chatLenis?.resize();

					// Now command the scroll to the newly calculated bottom
					chatLenis?.scrollTo(messagesEndRef!, {
						immediate: false,
						duration: 0.5
					});
				});
			}
		}
	});

	function handleChatSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!input.trim()) return;

		chat.sendMessage({ text: input });
		input = '';
	}
</script>

<div
	role="dialog"
	aria-label="Interactive Chat Terminal"
	transition:slide={{ axis: 'y', duration: 300 }}
	class="absolute bottom-full z-50 mb-4 flex h-80 w-[90vw] max-w-md origin-bottom flex-col rounded-2xl border border-zinc-700 bg-zinc-900/95 p-4 font-mono text-sm shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-zinc-500 hover:shadow-[0_0_15px_rgba(82,82,91,0.2)]"
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

	<!-- Native Scroll Area -->
	<!-- hover:focus focus:outline-none just ensures clicking it doesn't draw an ugly ring -->
	<!-- Native Scroll Area with our Hijacker Attached -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		use:applyLocalLenis
		bind:this={viewportRef}
		role="region"
		aria-label="Chat message history"
		tabindex="0"
		class="custom-scrollbar mb-4 min-h-0 flex-1 overflow-y-auto pr-2 focus:outline-none"
	>
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
	</div>

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

<style>
	/* Native CSS scrollbar to replace the headless JS scrollbar */
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background-color: #52525b; /* Tailwind zinc-600 */
		border-radius: 9999px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background-color: #71717a; /* Tailwind zinc-500 */
	}
</style>
