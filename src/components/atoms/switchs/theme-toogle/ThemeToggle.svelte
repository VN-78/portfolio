<script lang="ts">
	import { Switch } from 'bits-ui';
	import { onMount } from 'svelte';

	// initiating state
	let isDark = $state(false);

	onMount(() => {
		const storedTheme = localStorage.getItem('theme');

		if (storedTheme) {
			isDark = storedTheme === 'dark';
		} else {
			// Fallback to system OS preference
			isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}
	});

	// 3. Sync side effects automatically whenever `isDark` changes
	$effect(() => {
		const root = document.documentElement; // targets the <html> tag

		if (isDark) {
			root.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			root.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	});
</script>

<Switch.Root
	bind:checked={isDark}
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
            data-[state=unchecked]:translate-x-0
    "
	></Switch.Thumb>
</Switch.Root>
