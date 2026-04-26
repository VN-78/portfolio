<script lang="ts">
	import { scrollState } from '$lib/stores/scroll.svelte';
	import type Lenis from 'lenis';
	import Avatar from '../../atoms/icons/Avatar.svelte';

	let scrollY = $state(0);
	let innerHeight = $state(0);
	let aboutSection: HTMLElement | undefined = $state();

	const rawText =
		'I am Vishwanath, I bridge the gap between intelligent backend systems and seamless frontend interfaces. By merging robust architecture with AI-integrated workflows, I translate complex data into intuitive user experiences. Driven by deep technical curiosity, I build scalable, high-performance products from the ground up.';
	const wordsArray = rawText.split(' ');

	// 1. The Reactive Effect
	$effect(() => {
		// If Lenis hasn't been initialized by the layout yet, exit early.
		if (!scrollState.lenis) return;

		const lenis = scrollState.lenis;

		// The callback to update our local scrollY state
		const handleScroll = (e: Lenis) => {
			scrollY = e.scroll;
		};

		// Attach the listener
		lenis.on('scroll', handleScroll);

		// Get window height for our math
		innerHeight = window.innerHeight;
		const handleResize = () => {
			innerHeight = window.innerHeight;
		};
		window.addEventListener('resize', handleResize);

		// Cleanup function for when the user navigates away from this page
		return () => {
			lenis.off('scroll', handleScroll);
			window.removeEventListener('resize', handleResize);
		};
	});

	// 2. The Math (remains exactly the same)
	let highlightProgress = $derived.by(() => {
		if (!aboutSection || innerHeight === 0) return 0;

		void scrollY; // Trigger reactivity on scroll

		const rect = aboutSection.getBoundingClientRect();

		// =========================================================
		// 2. THE TUNING KNOBS (Adjust these decimals to tweak timing)
		// =========================================================
		// 0.85 means the animation starts when the top of the About
		// section is 85% of the way down the screen.
		const startTrigger = innerHeight * 0.45;

		// 0.40 means the animation finishes when the top of the About
		// section reaches 40% of the way down the screen.
		const endTrigger = innerHeight * 0.01;
		// =========================================================

		// 3. The Mapping Math
		const scrollDistance = startTrigger - endTrigger;
		let progress = (startTrigger - rect.top) / scrollDistance;

		return Math.max(0, Math.min(1, progress));
	});
</script>

<!-- lenis debug overlay -->
<!-- <div
	class="fixed top-0 left-0 z-50 rounded-br-lg bg-black/90 p-4 font-mono text-sm text-green-400 shadow-xl backdrop-blur-md"
>
	<p>Lenis Connected: {!!scrollState.lenis}</p>
	<p>ScrollY: {scrollY.toFixed(0)}px</p>
	<p>Progress: {highlightProgress.toFixed(3)}</p>
	<p>Window H: {innerHeight}px</p>
</div> -->
<section
	bind:this={aboutSection}
	id="about"
	class="grid min-h-[80vh] grid-cols-1 items-center gap-12 border-b border-border-subtle lg:grid-cols-12"
>
	<div
		class="bg-surface-alt relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full border border-border-subtle lg:col-span-4"
	>
		<div class="absolute inset-0 flex items-center justify-center text-content-sub">
			<Avatar />
		</div>
	</div>

	<div class="flex flex-col justify-center lg:col-span-8">
		<h2 class="mb-8 font-heading text-4xl font-bold text-content-main md:text-6xl">About Me</h2>

		<p class="font-sans text-xl leading-relaxed md:text-3xl">
			{#each wordsArray as word, index (`${index}-${word}`)}
				{@const isHighlighted = index / wordsArray.length <= highlightProgress}

				<span
					class="inline-block transition-colors duration-300 {isHighlighted
						? 'text-content-main'
						: 'text-content-sub opacity-40'}"
				>
					{word}&nbsp;
				</span>
			{/each}
		</p>
	</div>
</section>
