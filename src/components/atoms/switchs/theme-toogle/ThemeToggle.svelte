<script lang="ts">
	import { Switch } from 'bits-ui';
	import { onMount } from 'svelte';
	import { MoonIcon, SunIcon } from '@lucide/svelte';
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

		// Sync isDark state if the theme is changed externally (e.g. by AI)
		const observer = new MutationObserver(() => {
			isDark = root.classList.contains('dark');
		});

		observer.observe(root, {
			attributes: true,
			attributeFilter: ['class']
		});

		return () => observer.disconnect();
	});

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
		name="theme-toggle"
		value="theme-toggle"
		aria-label="Toggle theme"
		checked={isDark}
		onCheckedChange={handleCheckedChange}
		class="
        peer inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full
        border-2 border-transparent transition-colors duration-200 ease-in-out
        focus-visible:ring-2 focus-visible:ring-border-subtle focus-visible:ring-offset-2 focus-visible:outline-none

        data-[state=checked]:bg-accent-primary
        data-[state=unchecked]:bg-surface-highlight"
	>
		<Switch.Thumb
			class="
            group pointer-events-none relative flex h-7 w-7
            items-center justify-center rounded-full bg-surface-main shadow-lg
			ring-0 transition-transform duration-200 ease-in-out

            data-[state=checked]:translate-x-8
            data-[state=unchecked]:translate-x-px"
		>
			<SunIcon
				class="
				absolute flex scale-100 rotate-0 items-center
				justify-center text-content-main opacity-100 transition-all duration-300

				group-data-[state=checked]:scale-50
				group-data-[state=checked]:-rotate-90
				group-data-[state=checked]:opacity-0
				"
			/>

			<MoonIcon
				class="
				absolute flex scale-50 rotate-90 items-center
				justify-center text-content-main opacity-0 transition-all duration-300

				group-data-[state=checked]:scale-100
				group-data-[state=checked]:rotate-0
				group-data-[state=checked]:opacity-100
				"
			/>
		</Switch.Thumb>
	</Switch.Root>
</div>
