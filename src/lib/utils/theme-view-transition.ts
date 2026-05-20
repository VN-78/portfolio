/**
 * Handles the View Transition API for theme switching.
 * @param targetTheme - Optional target theme to when the tools is called by agent.
 * @param event - The mouse event to extract coordinates from (null if keyboard).
 * the isDark is Handled by the mode-watcher library.
 */
import { setMode, toggleMode } from 'mode-watcher';
import { tick } from 'svelte';

export function toggleThemeWithTransition(
	event: MouseEvent | null,
	targetTheme?: 'light' | 'dark'
) {
	const root = document.documentElement;

	const applyTheme = () => {
		if (targetTheme) {
			setMode(targetTheme); // Explicit set (Great for AI tools or explicit switches)
		} else {
			toggleMode(); // simple toggle
		}
	};

	// Fallback: If View Transitions aren't supported, OR if the user triggered
	// the switch via keyboard (no X/Y coordinates), just switch instantly.
	if (!document.startViewTransition || !event) {
		applyTheme();
		return;
	}

	const x = event?.clientX;
	const y = event?.clientY;

	// 1. Pass coordinates to CSS BEFORE the transition starts
	root.style.setProperty('--click-x', `${x}px`);
	root.style.setProperty('--click-y', `${y}px`);

	// 1. Start transition and update DOM inside the callback
	const transition = document.startViewTransition(async () => {
		applyTheme();
		// Wait for Svelte to flush any reactive DOM updates
		// before the browser takes the "after" snapshot
		await tick(); 
	});

	// // 2. Animate the new pseudo-element
	transition.ready.then(() => {
		const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

		// 2. Animate from the pre-clamped 0px state to the full radius
		root.animate(
			{
				clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`]
			},
			{
				duration: 500,
				easing: 'ease-in-out',
				pseudoElement: '::view-transition-new(root)',
				fill: 'forwards'
			}
		);
	});

	transition.finished.finally(() => {
		root.style.removeProperty('color-scheme');
		root.style.removeProperty('--click-x');
		root.style.removeProperty('--click-y');
	});
}
