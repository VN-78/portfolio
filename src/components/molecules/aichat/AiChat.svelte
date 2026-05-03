<script lang="ts">
	// import { tick } from 'svelte';
	import type { Chat } from '@ai-sdk/svelte';
	import Lenis from 'lenis';
	import { scale } from 'svelte/transition';
	import { sineInOut } from 'svelte/easing';

	let { chat, onClose }: { chat: Chat; onClose: () => void } = $props();

	let input = $state('');
	// let messagesEndRef = $state<HTMLElement | null>(null);

	// We need to track the viewport to check scroll position
	let viewportRef = $state<HTMLElement | null>(null);
	// let isUserScrolling = $state(false);

	// We store the local Lenis instance here so our auto-scroll effect can use it
	// let chatLenis = $state<Lenis | null>(null);

	// let scrollTimeout: ReturnType<typeof setTimeout>;

	// --- 1. THE LENIS ACTION ---
	// Handles isolation, auto-scrolling, and mobile interaction automatically.
	function applyLocalLenis(node: HTMLElement) {
		// 1. Desktop wheel isolation (prevents scrolling the background page)
		function killBubble(e: WheelEvent) {
			e.stopPropagation();
		}
		node.addEventListener('wheel', killBubble, { passive: false });

		const lenis = new Lenis({
			wrapper: node,
			content: node.firstElementChild as HTMLElement,
			gestureOrientation: 'vertical',
			smoothWheel: true
		});

		let isUserScrolledUp = false;
		const threshold = 150; // pixels from the bottom

		// 2. Track intent accurately.
		// We let Lenis tell us exactly how far we are from the bottom.
		lenis.on('scroll', (e: Lenis) => {
			// e.limit is the max scrollable height, e.scroll is current position
			isUserScrolledUp = e.limit - e.scroll > threshold;
		});

		// 3. The MutationObserver (The Bulletproof Streaming Lock)
		const contentDiv = node.firstElementChild as HTMLElement;
		const observer = new MutationObserver(() => {
			// Instantly recalculate limits when the DOM mutates
			lenis.resize();

			// If the user was hugged to the bottom before this chunk arrived, keep them there!
			if (!isUserScrolledUp) {
				const anchor = contentDiv.querySelector('.scroll-anchor') as HTMLElement;
				if (anchor) {
					// duration: 0.1 creates a micro-smooth glide as text chunks drop in.
					// If you prefer a hard native lock, change to { immediate: true }
					lenis.scrollTo(anchor, { immediate: false, duration: 0.1 });
				}
			}
		});

		// Watch everything: new nodes and text character changes
		observer.observe(contentDiv, { childList: true, subtree: true, characterData: true });

		// Initial snap to bottom when opening the chat
		setTimeout(() => {
			lenis.resize();
			const anchor = contentDiv.querySelector('.scroll-anchor') as HTMLElement;
			if (anchor) lenis.scrollTo(anchor, { immediate: true });
		}, 100);

		// Standard requestAnimationFrame loop
		let rafId: number;
		function raf(time: number) {
			lenis.raf(time);
			rafId = requestAnimationFrame(raf);
		}
		requestAnimationFrame(raf);

		return {
			destroy() {
				node.removeEventListener('wheel', killBubble);
				observer.disconnect();
				cancelAnimationFrame(rafId);
				lenis.destroy();
			}
		};
	}

	function handleChatSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!input.trim()) return;

		chat.sendMessage({ text: input });
		input = '';
	}

	// --- Slash Commands ---
	const commands = [{ cmd: '/theme', desc: 'Change the visual theme (dark or light)' }];

	let inputRef = $state<HTMLInputElement | null>(null);

	let filteredCommands = $derived(
		input.startsWith('/') && !input.includes(' ')
			? commands.filter((c) => c.cmd.toLowerCase().startsWith(input.toLowerCase()))
			: []
	);

	function selectCommand(cmd: string) {
		input = cmd + ' ';
		inputRef?.focus();
	}
</script>

<div
	role="dialog"
	aria-label="Interactive Chat Terminal"
	transition:scale={{ duration: 400, start: 0.1, easing: sineInOut }}
	class="
        /* Desktop: Vertical Box */ fixed inset-0 z-50 flex
        h-dvh w-full origin-bottom flex-col rounded-none border-none bg-surface-component/70 p-4 font-sans

        text-sm shadow-none backdrop-blur-xl transition-all duration-300
        sm:absolute sm:inset-auto sm:right-0 sm:bottom-full sm:mb-4
        sm:h-125 sm:w-85 sm:max-w-85
        sm:rounded-2xl sm:border sm:border-border-subtle sm:bg-surface-component
        sm:shadow-2xl sm:backdrop-blur-md
        sm:hover:border-accent-primary/50
    "
>
	<!-- Header -->
	<div
		class="mb-4 flex items-center justify-between border-b border-border-subtle pb-3 sm:mb-2 sm:pb-2"
	>
		<span class="font-heading text-lg font-bold text-content-main sm:text-base">Terminal Chat</span>
		<button
			onclick={onClose}
			class="cursor-pointer p-2 text-lg font-bold text-content-sub transition-colors hover:text-accent-primary focus:ring focus:ring-accent-primary/50 focus:outline-none sm:p-0 sm:text-sm"
			aria-label="Close Chat"
		>
			[X]
		</button>
	</div>

	<!-- Native Scroll Area -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		use:applyLocalLenis
		bind:this={viewportRef}
		role="region"
		aria-label="Chat message history"
		tabindex="0"
		class="custom-scrollbar mb-4 min-h-0 flex-1 overflow-y-auto pr-2 focus:outline-none"
	>
		<div class="space-y-4 sm:space-y-3">
			<!-- Empty State -->
			{#if chat.messages.length === 0}
				<div class="mt-12 text-center text-content-sub sm:mt-8">
					System online. Ask me about Vishwa...
				</div>
			{/if}

			<!-- Messages Loop -->
			{#each chat.messages as message, i (i)}
				<div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
					<div
						class="max-w-[90%] rounded-2xl p-3 sm:max-w-[85%] sm:rounded-lg sm:p-2.5 {message.role ===
						'user'
							? 'bg-accent-secondary text-content-main'
							: 'border border-border-subtle bg-surface-highlight text-content-main shadow-md'}"
					>
						{#each message.parts as part, j (j)}
							{#if part.type === 'text'}
								{part.text}
							{/if}
						{/each}
					</div>
				</div>
			{/each}

			<!-- Loading/Streaming State -->
			{#if (chat.status === 'streaming' || chat.status === 'submitted') && chat.messages[chat.messages.length - 1]?.role === 'user'}
				<div class="flex justify-start">
					<div
						class="max-w-[80%] animate-pulse rounded-2xl border border-border-subtle bg-surface-highlight p-3 text-content-sub sm:rounded-lg sm:p-2"
					>
						Thinking...
					</div>
				</div>
			{/if}

			<!-- THE ANCHOR: This invisible div always stays at the bottom -->
			<div class="scroll-anchor h-1 w-full"></div>
		</div>
	</div>

	<!-- Input Form -->
	<!-- Added padding bottom to prevent iOS home bar from overlapping the input -->
	<form onsubmit={handleChatSubmit} class="relative mt-auto flex gap-2 pb-2 sm:pb-0">
		<!-- Slash Commands Menu -->
		{#if filteredCommands.length > 0}
			<div
				class="absolute bottom-full mb-2 w-full rounded-xl border border-border-subtle bg-surface-component p-1 shadow-2xl backdrop-blur-md"
				transition:scale={{ duration: 200, start: 0.95, easing: sineInOut }}
			>
				<div class="px-2 py-1.5 text-[10px] font-bold tracking-wider text-content-sub uppercase">
					Commands
				</div>
				<div class="space-y-0.5">
					{#each filteredCommands as command (command.cmd)}
						<button
							type="button"
							onclick={() => selectCommand(command.cmd)}
							class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all hover:bg-accent-primary/10 hover:text-accent-primary group"
						>
							<span class="font-mono font-bold text-accent-primary">{command.cmd}</span>
							<span class="text-xs text-content-sub group-hover:text-accent-primary/70"
								>{command.desc}</span
							>
						</button>
					{/each}
				</div>
			</div>
		{/if}

		<input
			bind:this={inputRef}
			class="flex-1 rounded-xl border border-border-subtle bg-surface-highlight px-4 py-3 text-base text-content-main transition-colors outline-none placeholder:text-content-sub focus:border-accent-primary focus:bg-surface-component sm:rounded-lg sm:px-3 sm:py-2 sm:text-sm"
			bind:value={input}
			placeholder="Message..."
			disabled={chat.status === 'streaming' || chat.status === 'submitted'}
		/>
		<button
			type="submit"
			disabled={chat.status === 'streaming' || chat.status === 'submitted' || !input.trim()}
			class="rounded-xl bg-accent-secondary px-5 py-3 font-medium text-white transition-transform hover:bg-accent-secondary active:scale-95 disabled:opacity-50 sm:rounded-lg sm:px-4 sm:py-2"
		>
			Send
		</button>
	</form>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background-color: #52525b;
		border-radius: 9999px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background-color: #71717a;
	}
</style>
