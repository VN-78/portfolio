<script lang="ts">
	import { Switch } from 'bits-ui';
	import { onMount } from 'svelte';
	import { toggleThemeWithTransition } from '$lib/utils/theme-view-transition';

	// initiating state
	let isDark = $state(false);

	// we need to capture the click event to know where the ripple starts
	let lastClickEvent: MouseEvent | null = null;

	onMount(() => {
		const storedTheme = localStorage.getItem('theme');
		const root = document.documentElement;

		if (storedTheme) {
			isDark = storedTheme === 'dark';
		} else {
			// Fallback to system OS preference
			isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}

		// Apply initial theme without transition
		if (isDark) {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}
	});

	//  3. Sync side effects automatically whenever `isDark` changes
	// (** no need since we are using the view transiton api to create the transition the initial load should be controled by the function **)
	// $effect(() => {
	// 	const root = document.documentElement; // targets the <html> tag

	// 	if (isDark) {
	// 		root.classList.add('dark');
	// 		localStorage.setItem('theme', 'dark');
	// 	} else {
	// 		root.classList.remove('dark');
	// 		localStorage.setItem('theme', 'light');
	// 	}
	// });

	function handleCheckedChange(checked: boolean) {
		isDark = checked;
		// Trigger our external transition function
		toggleThemeWithTransition(checked, lastClickEvent);

		// Reset the event so keyboard toggles don't use old coordinates
		lastClickEvent = null;
	}
</script>

<div
	onpointerdown={(e) => (lastClickEvent = e)}
	onkeydown={() => (lastClickEvent = null)}
	role="presentation"
	style="display: contents;"
>
	<Switch.Root
		checked={isDark}
		onCheckedChange={handleCheckedChange}
		class="
        peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full 
        border-2 border-transparent transition-colors duration-200 ease-in-out
        focus-visible:ring-2 focus-visible:ring-border-subtle focus-visible:ring-offset-2 focus-visible:outline-none
        
        data-[state=checked]:bg-accent-primary
        data-[state=unchecked]:bg-surface-highlight"
	>
		<Switch.Thumb
			class="
            pointer-events-none block h-5 w-5 rounded-full bg-surface-main 
            shadow-lg ring-0 transition-transform duration-200 ease-in-out
            
            data-[state=checked]:translate-x-5 
            data-[state=unchecked]:translate-x-0"
		></Switch.Thumb>
	</Switch.Root>
</div>
