<script lang="ts">
	import ThemeToggle from '../../atoms/switchs/theme-toogle/ThemeToggle.svelte';

	let scrollY = $state(0);

	// 1. Calculate a dynamic multiplier between 0 and 1.
	// At 0px scrolled, progress is 0.
	// At 150px scrolled, progress is 1.
	let scrollProgress = $derived(Math.min(scrollY / 150, 1));

	// 2. Map the progress to our specific layout values
	// Width: 100% down to 90%
	let navWidth = $derived(100 - 10 * scrollProgress);
	// Top Margin: 0px down to 16px
	let navTop = $derived(16 * scrollProgress);
	// Border Radius: 0px up to 9999px (pill shape)
	let navRadius = $derived(9999 * scrollProgress);

	// We keep a boolean for things that SHOULD snap, like the green dot
	// let isScrolled = $derived(scrollY > 50);

	let activeSection = $state('home'); // NEW: Track the active section

	// NEW: Intersection Observer setup
	$effect(() => {
		// 1. Grab all sections with an ID on the page
		const sections = document.querySelectorAll('section[id]');

		// 2. Configure the observer
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					// If the section crosses our visibility threshold, set it as active
					if (entry.isIntersecting) {
						activeSection = entry.target.id;
					}
				});
			},
			{
				// Trigger when exactly 50% of the section is visible in the viewport
				threshold: 0.5,
				// Offset the top by 100px so the fixed header doesn't mess up the math
				rootMargin: '-100px 0px 0px 0px'
			}
		);

		// 3. Start observing each section
		sections.forEach((section) => observer.observe(section));

		// 4. Cleanup function to prevent memory leaks when navigating away
		return () => {
			sections.forEach((section) => observer.unobserve(section));
			observer.disconnect();
		};
	});
</script>

<svelte:window bind:scrollY />

<header
	class="
        pointer-events-none fixed top-0 left-0 z-50 w-full
        max-md:hidden
    "
>
	<nav
		class="
            pointer-events-auto mx-auto flex h-14 items-center
            overflow-hidden border-border-subtle px-8
            shadow-lg backdrop-blur-md
        "
		style="
            width: {navWidth}%; 
            margin-top: {navTop}px; 
            border-radius: {navRadius}px;
            background-color: color-mix(in srgb, var(--bg-component) {50 +
			30 * scrollProgress}%, transparent);
            border-width: {scrollProgress}px;
            border-bottom-width: {1 - scrollProgress}px;
        "
	>
		<div class="flex flex-1 items-center justify-start">
			<span class="text-xl font-bold text-content-main">VN</span>
		</div>

		<div class="flex shrink-0 items-center justify-center gap-6">
			<a
				href="#home"
				class="group flex items-center gap-2 transition-colors hover:text-accent-primary
                {activeSection === 'home' ? 'text-content-main' : 'text-content-sub'}"
			>
				<span
					class="h-2 w-2 rounded-full bg-accent-primary transition-transform duration-300
                    {activeSection === 'home' ? 'w-2 scale-100' : 'w-0 scale-0'}"
				>
				</span>
				Home
			</a>

			<a
				href="#about"
				class="flex items-center gap-2 transition-colors hover:text-accent-primary
                {activeSection === 'about' ? 'text-content-main' : 'text-content-sub'}"
			>
				<span
					class="h-2 w-2 rounded-full bg-accent-primary transition-transform duration-300
                    {activeSection === 'about' ? 'w-2 scale-100' : 'w-0 scale-0'}"
				>
				</span>
				About
			</a>    

			<a
				href="#projects"
				class="flex items-center gap-2 transition-colors hover:text-accent-primary
                {activeSection === 'projects' ? 'text-content-main' : 'text-content-sub'}"
			>
				<span
					class="h-2 w-2 rounded-full bg-accent-primary transition-transform duration-300
                    {activeSection === 'projects' ? 'w-2 scale-100' : 'w-0 scale-0'}"
				>
				</span>
				Projects
			</a>
		</div>

		<div class="flex flex-1 items-center justify-end">
			<ThemeToggle />
		</div>
	</nav>
</header>

<header
	class="
        pointer-events-none fixed top-0 left-0 z-50 w-full md:hidden"
>
	<nav
		class="
            pointer-events-auto mx-auto flex h-12 items-center
            overflow-hidden border-border-subtle px-8
            shadow-lg backdrop-blur-md"
	>
		<div class="flex flex-1 items-center justify-start">
			<span class="text-xl font-bold text-content-main">VN</span>
		</div>

		<div class="flex flex-1 items-center justify-end">
			<ThemeToggle />
		</div>
	</nav>
</header>

<nav
	class="
        fixed right-0 bottom-0 left-0 z-50 flex h-14 items-center justify-around
        border-t border-border-subtle bg-surface-component
        md:hidden
    "
>
	<a
		href="#home"
		class="flex h-full w-full flex-col items-center justify-center text-content-main transition-colors hover:text-accent-secondary"
	>
		Home
	</a>
	<a
		href="#about"
		class="flex h-full w-full flex-col items-center justify-center text-content-sub transition-colors hover:text-content-main"
	>
		About
	</a>
</nav>
