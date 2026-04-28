<script lang="ts">
	import { onMount } from 'svelte';
	import cat from '../../../lib/assets/images/cat-transparent-eyes.png';
	import catClosed from '../../../lib/assets/images/cat-eyes-closed.png';
	import pupil from '../../../lib/assets/images/cat-eye.png';

	let isBlinking = $state(false);
	let isMounted = $state(false);

	// for tracking mouse position
	let mouseX = $state(0);
	let mouseY = $state(0);

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
	const maxRadius = 6;

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

<div class="relative h-48 w-48 select-none sm:h-64 sm:w-64">
	<div
		class="absolute inset-0 z-10 transition-opacity duration-75 {isBlinking
			? 'opacity-0'
			: 'opacity-100'}"
	>
		<div
			class="absolute top-[21%] left-[18%] flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#f5d693]"
		>
			<img
				src={pupil}
				alt="left pupil"
				class="h-6 w-6"
				style="transform: translate({pupilOffset().x}px, {pupilOffset().y}px);"
			/>
		</div>

		<div
			class="absolute top-[21%] right-[41%] flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#f5d693]"
		>
			<img
				src={pupil}
				alt="right pupil"
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
</div>
