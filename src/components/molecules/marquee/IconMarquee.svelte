<script lang="ts">
	import Icon from '../../atoms/icons/icons.svelte';
	import { iconData } from '../../../lib/assets/icons';

	// 1. We need a reference to the DOM element running the animation
	let trackElement: HTMLElement;

	// 2. We store the frame ID so we can cancel it if the user quickly moves
	// their mouse in and out before the transition finishes.
	let animationFrameId: number;

	function animatePlaybackRate(targetRate: number) {
		if (!trackElement) return;

		// Grab the active CSS animations on this specific DOM node
		const animations = trackElement.getAnimations();
		if (animations.length === 0) return;

		const animation = animations[0];

		// Cancel any previous loop so they don't fight each other
		cancelAnimationFrame(animationFrameId);

		const step = () => {
			const currentRate = animation.playbackRate;
			const diff = targetRate - currentRate;
			// If we are within 1% of the target speed, snap to it and stop the loop
			if (Math.abs(diff) < 0.01) {
				animation.playbackRate = targetRate;
				return;
			}

			// Move 10% of the remaining distance toward the target
			animation.playbackRate += diff * 0.1;

			// Request the next frame
			animationFrameId = requestAnimationFrame(step);
		};
		animationFrameId = requestAnimationFrame(step);
	}

	// 3. The actual functions to trigger on hover events
	const slowDown = () => animatePlaybackRate(0.2); // Slow down to 20% speed
	const speedUp = () => animatePlaybackRate(1.0); // Return to 100% speed

	const techList = Object.entries(iconData).map(([name, data]) => ({
		name,
		...data
	}));

	const duplicatedTech = [...techList, ...techList];
</script>

<div
	class="marquee-container relative w-full overflow-hidden py-12 "
	onpointerenter={slowDown}
	onpointerleave={speedUp}
	role="marquee"
>
	<div bind:this={trackElement} class="marquee-track flex w-max mb-12  gap-16 will-change-transform">
		{#each duplicatedTech as tech, i (`${tech.name}-${i}`)}
			<div
				class="group relative flex flex-col items-center justify-center transition-all duration-300 hover:scale-125"
			>
				<!-- Default Colored Icon -->
				<Icon
					paths={tech.paths}
					viewBox={tech.viewBox}
					colored={true}
					class="h-12 w-12 transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(var(bg-black),0.5)]"
				/>

				<!-- Name Pop-up Highlight (Bottom) -->
				<span
					class="pointer-events-none absolute -bottom-8 z-20 rounded-md bg-accent-secondary/25 px-2.5 py-1.5 font-mono text-[11px] font-bold tracking-tight whitespace-nowrap text-content-main opacity-0 transition-all duration-300 group-hover:-bottom-10 group-hover:opacity-100"
				>
					{tech.name.toUpperCase()}
				</span>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	.marquee-container {
		/* Simple fade-in for the whole section on mount */
		animation: entrance 1s ease-out forwards;

		/* The Mask Magic */
		-webkit-mask-image: linear-gradient(to right, transparent, black 25%, black 75%, transparent);
		mask-image: linear-gradient(to right, transparent, black 25%, black 75%, transparent);
	}

	.marquee-track {
		animation: scroll 40s linear infinite;
	}

	@keyframes scroll {
		0% {
			transform: translate3d(0, 0, 0);
		}
		100% {
			transform: translate3d(-50%, 0, 0);
		}
	}

	@keyframes entrance {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
