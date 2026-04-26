<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	// Configure lenis
	import { onMount, type Snippet } from 'svelte';
	import Lenis from 'lenis';

	onMount(() => {
		// Initialize Lenis
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard smooth ease
			orientation: 'vertical',
			gestureOrientation: 'vertical',
			smoothWheel: true,
			wheelMultiplier: 1,
			touchMultiplier: 2,
			// IMPORTANT: Let the OS handle mobile touch.
			// This brings back the native Android/iOS edge stretch.
			syncTouch: false,

			// IMPORTANT: Allows Mac trackpads to trigger the native rubber-band
			overscroll: true
		});

		// Set up the Animation Frame Loop to keep Lenis ticking
		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		// Crucial: Clean up the instance when the component is destroyed
		// to prevent memory leaks if navigating between SPA routes.
		return () => {
			lenis.destroy();
		};
	});

	let { children }: { children: Snippet } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
