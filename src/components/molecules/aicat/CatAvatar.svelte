<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import cat from '../../../lib/assets/images/cat-transparent-eyes.png?enhanced';
	import catClosed from '../../../lib/assets/images/cat-eyes-closed.png?enhanced';
	import pupil from '../../../lib/assets/images/cat-eye.png?enhanced';
	import catTalking from '../../../lib/assets/images/cat-talking-final.png?enhanced';

	let { status, isChatOpen = $bindable() }: { status: string; isChatOpen: boolean } = $props();

	let isBlinking = $state(false);
	let isMounted = $state(false);
	let isTalking = $state(false);

	// for tracking mouse position
	let mouseX = $state(0);
	let mouseY = $state(0);

	// --- Synchronization Engine ---
	// This $effect passively watches the Vercel $isLoading store.
	// When true, it rapidly toggles the mouth opacity. When false, it stops.
	$effect(() => {
		let interval: ReturnType<typeof setInterval>;

		// isLoading is gone. We use the new chat.status property!
		if (status === 'streaming') {
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
<!-- THE AI AGENT -->
<!-- Added cursor-pointer and an onclick handler to toggle the chat -->
<!-- Added a slight hover scale to make it feel interactive -->
<button
    class="relative h-48 w-48 cursor-pointer select-none outline-none transition-transform sm:h-64 sm:w-64"
    onclick={() => (isChatOpen = !isChatOpen)}
    aria-label="Toggle AI Chat"
    aria-expanded={isChatOpen}
>
	<!-- "Click Me" Indicator (Only shows when chat is closed) -->
	{#if !isChatOpen}
		<div
			transition:fade={{ duration: 150 }}
			class="absolute -top-10 left-1/2 z-50 flex -translate-x-1/2 items-center justify-center rounded-full  px-2 py-0.5 text-5xl font-bold  "
			style="image-rendering: pixelated;"
		>
			💬
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
			<enhanced:img
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
			<enhanced:img
				src={pupil}
				alt=""
				class="h-6 w-6"
				style="transform: translate({pupilOffset().x}px, {pupilOffset().y}px);"
			/>
		</div>
	</div>

	<enhanced:img
		src={cat}
		alt="Cat Open"
		class="pointer-events-none absolute inset-0 z-20 h-full w-full object-contain"
	/>
	<enhanced:img
		src={catClosed}
		alt="Cat Closed"
		class="pointer-events-none absolute inset-0 z-30 h-full w-full object-contain transition-opacity duration-75 {isBlinking
			? 'opacity-100'
			: 'opacity-0'}"
	/>
	<enhanced:img
		src={catTalking}
		alt="Cat Talking"
		class="pointer-events-none absolute inset-0 z-40 h-full w-full object-contain transition-opacity duration-150 {isTalking
			? 'opacity-100'
			: 'opacity-0'}"
	/>
</button>
