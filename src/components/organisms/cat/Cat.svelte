<script lang="ts">
	import { onMount } from 'svelte';
	import { Chat } from '@ai-sdk/svelte';
	import { slide, fade } from 'svelte/transition';

	import cat from '../../../lib/assets/images/cat-transparent-eyes.png';
	import catClosed from '../../../lib/assets/images/cat-eyes-closed.png';
	import pupil from '../../../lib/assets/images/cat-eye.png';
	import catTalking from '../../../lib/assets/images/cat-talking-final.png';

	let isBlinking = $state(false);
	let isMounted = $state(false);
	let isTalking = $state(false);

	let isChatOpen = $state(false);

	// for tracking mouse position
	let mouseX = $state(0);
	let mouseY = $state(0);

	let input = $state(''); // We now manually track the input
	// --- AI SDK Hook ---
	// This automatically connects to your /api/chat/+server.ts route
	const chat = new Chat({});

	function handleChatSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!input.trim()) return;

		// Use the new class method to send the message
		chat.sendMessage({ text: input });
		input = ''; // Clear input manually
	}
	// --- Synchronization Engine (The Senior Trick) ---
	// This $effect passively watches the Vercel $isLoading store.
	// When true, it rapidly toggles the mouth opacity. When false, it stops.
	$effect(() => {
		let interval: ReturnType<typeof setInterval>;

		// isLoading is gone. We use the new chat.status property!
		if (chat.status === 'streaming' || chat.status === 'submitted') {
			interval = setInterval(() => {
				isTalking = !isTalking;
			}, 150);
		} else {
			isTalking = false;
		}

		// Cleanup prevents memory leaks if the component destroys mid-stream
		return () => {
			if (interval) clearInterval(interval);
		};
	});

	const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	const toggleBlinking = async () => {
		isBlinking = !isBlinking; //eyes shut
		await sleep(150); // blink duration
		isBlinking = !isBlinking; // eyes open
	};

	const blink = async () => {
		while (isMounted) {
			// Generate a random delay between 2000ms (2s) and 6000ms (6s)
			const delay = Math.floor(Math.random() * (6000 - 2000 + 1) + 2000);
			await sleep(delay);
			// fire the blink after the delay
			await toggleBlinking();
		}
	};

	onMount(() => {
		isMounted = true;
		blink();
		// CLEANUP FUNCTION: This fires when the component unmounts, killing the loop.
		return () => {
			isMounted = false;
		};
	});

	// A max radius of 6 pixels prevents the pupil from leaving the white area
	const maxRadius = 8;

	let pupilOffset = $derived(() => {
		// 1. We assume the agent is looking from the bottom right or center.
		// To make it simple, we use the browser's innerWidth/innerHeight.
		// If window is undefined (SSR), return 0.
		if (typeof window === 'undefined') return { x: 0, y: 0 };

		const centerX = window.innerWidth / 1.5;
		const centerY = window.innerHeight / 2;

		// 2. Calculate the distance between the mouse and the center
		const deltaX = mouseX - centerX;
		const deltaY = mouseY - centerY;

		// 3. Find the angle using Arc Tangent
		const angle = Math.atan2(deltaY, deltaX);

		// 4. Calculate actual distance, but scale it down so it feels subtle
		// Divide by a large number (like 100) to dampen the movement
		const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 50;

		// 5. Clamp the distance so it never exceeds our maxRadius
		const clampedDistance = Math.min(distance, maxRadius);

		// 6. Convert the clamped vector back into X and Y pixel offsets
		return {
			x: Math.cos(angle) * clampedDistance,
			y: Math.sin(angle) * clampedDistance
		};
	});
</script>

<svelte:window
	onmousemove={(e) => {
		mouseX = e.clientX;
		mouseY = e.clientY;
	}}
/>

<!-- We center everything and make it relative so the chat bubble can anchor to it -->
<div class="relative mt-24 flex flex-col items-center p-4">
	<!-- THE EXPANDABLE CHAT BUBBLE -->
	{#if isChatOpen}
		<!-- slide transition makes it smoothly grow upwards from the bottom -->
		<div
			transition:slide={{ axis: 'y', duration: 300 }}
			class="absolute bottom-full z-50 mb-4 flex h-80 w-[90vw] max-w-md origin-bottom flex-col rounded-2xl border border-zinc-700 bg-zinc-900/95 p-4 font-mono text-sm shadow-2xl backdrop-blur-md"
		>
			<!-- Header/Close button -->
			<div class="mb-2 flex items-center justify-between border-b border-zinc-800 pb-2">
				<span class="font-bold text-zinc-300">Terminal Chat</span>
				<button
					onclick={() => (isChatOpen = false)}
					class="cursor-pointer font-bold text-zinc-500 transition-colors hover:text-red-400"
				>
					[X]
				</button>
			</div>

			<!-- Messages Area -->
			<div class="scrollbar-thin mb-4 flex-1 space-y-3 overflow-y-auto pr-2">
				{#if chat.messages.length === 0}
					<div class="mt-8 text-center text-zinc-500">System online. Ask me about Vishwa...</div>
				{/if}

				{#each chat.messages as message, messageIndex (messageIndex)}
					<div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
						<div
							class="max-w-[85%] rounded-lg p-2.5 {message.role === 'user'
								? 'bg-blue-600 text-white'
								: 'border border-zinc-700 bg-zinc-800 text-zinc-300 shadow-md'}"
						>
							{#each message.parts as part, partIndex (partIndex)}
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
			</div>

			<!-- Input Form -->
			<form onsubmit={handleChatSubmit} class="flex gap-2">
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
	{/if}

	<!-- THE AI AGENT -->
	<!-- Added cursor-pointer and an onclick handler to toggle the chat -->
	<!-- Added a slight hover scale to make it feel interactive -->
	<button
		class="relative h-48 w-48 cursor-pointer rounded-full select-none focus:ring focus:ring-blue-500/30 focus:outline-none sm:h-64 sm:w-64"
		onclick={() => (isChatOpen = !isChatOpen)}
		aria-label="Toggle AI Chat"
	>
		<!-- "Click Me" Indicator (Only shows when chat is closed) -->
		{#if !isChatOpen}
			<div
				transition:fade
				class="absolute -top-4 left-1/2 z-50 -translate-x-1/2 animate-bounce rounded-full bg-blue-600 px-3 py-1 text-xs font-bold whitespace-nowrap text-white shadow-lg"
			>
				Chat with me!
			</div>
		{/if}

		<div
			class="absolute inset-0 z-10 transition-opacity duration-75 {isBlinking
				? 'opacity-0'
				: 'opacity-100'}"
		>
			<!-- Left Eye -->
			<div
				class="absolute top-[21%] left-[18%] flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#f5d693]"
			>
				<img
					src={pupil}
					alt=""
					class="h-6 w-6"
					style="transform: translate({pupilOffset().x}px, {pupilOffset().y}px);"
				/>
			</div>
			<!-- Right Eye -->
			<div
				class="absolute top-[21%] right-[41%] flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#f5d693]"
			>
				<img
					src={pupil}
					alt=""
					class="h-6 w-6"
					style="transform: translate({pupilOffset().x}px, {pupilOffset().y}px);"
				/>
			</div>
		</div>

		<img
			src={cat}
			alt="Cat Open"
			class="pointer-events-none absolute inset-0 z-20 h-full w-full object-contain"
		/>
		<img
			src={catClosed}
			alt="Cat Closed"
			class="pointer-events-none absolute inset-0 z-30 h-full w-full object-contain transition-opacity duration-75 {isBlinking
				? 'opacity-100'
				: 'opacity-0'}"
		/>
		<img
			src={catTalking}
			alt="Cat Talking"
			class="pointer-events-none absolute inset-0 z-40 h-full w-full object-contain transition-opacity duration-75 {isTalking
				? 'opacity-100'
				: 'opacity-0'}"
		/>
	</button>
</div>
