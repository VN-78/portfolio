<script lang="ts">
	import {
		HouseIcon,
		PanelsTopLeftIcon,
		SendIcon,
		UserRoundPenIcon
	} from '@lucide/svelte';
	import ThemeToggle from '../../atoms/switchs/theme-toogle/ThemeToggle.svelte';

	let scrollY = $state(0);

	// 1. Calculate a dynamic multiplier between 0 and 1.
	// At 0px scrolled, progress is 0.
	// At 150px scrolled, progress is 1.
	let scrollProgress = $derived(Math.min(scrollY / 150, 1));

	// 2. Map the progress to our specific layout values
	// Width: 100% down to 60%
	let navWidth = $derived(100 - 45 * scrollProgress);
	// Top Margin: 0px down to 16px
	let navTop = $derived(16 * scrollProgress);
	// Border Radius: 0px up to 9999px (pill shape)
	let navRadius = $derived(9999 * scrollProgress);

	// We keep a boolean for things that SHOULD snap, like the green dot
	let isScrolled = $derived(scrollY > 50);

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

<!-- TODO: convert these dots to underline with animations -->

<!-- TODO: add hover popup animation on the selection links -->

<header
	class="
        pointer-events-none fixed top-0 left-0 z-50 w-full max-md:hidden
        md:px-8
    "
>
	<div class="max-w-8xl mx-auto flex w-full items-center justify-between px-4 md:px-24 lg:px-32">
		<nav
			class="
            pointer-events-auto mx-auto flex h-14 items-center
            overflow-hidden px-8
            transition-all duration-75 ease-linear
            {isScrolled
				? 'border-border-subtle bg-surface-component/80 shadow-lg backdrop-blur-md'
				: 'border-transparent bg-surface-main shadow-none'}
        "
			style="
            width: {navWidth}%;
            margin-top: {navTop}px;
            border-radius: {navRadius}px;
        "
		>
			<div class="flex flex-1 items-center justify-start">
				<span class="font-heading text-xl font-bold tracking-tight text-content-main">VN</span>
			</div>

			<div class="flex shrink-0 items-center justify-center gap-6">
				<a
					href="#home"
					class="group flex items-center gap-2 font-mono text-sm transition-colors hover:text-accent-primary
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
					class="flex items-center gap-2 font-mono text-sm transition-colors hover:text-accent-primary
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
					class="flex items-center gap-2 font-mono text-sm transition-colors hover:text-accent-primary
                {activeSection === 'projects' ? 'text-content-main' : 'text-content-sub'}"
				>
					<span
						class="h-2 w-2 rounded-full bg-accent-primary transition-transform duration-300
                    {activeSection === 'projects' ? 'w-2 scale-100' : 'w-0 scale-0'}"
					>
					</span>
					Projects
				</a>

				<a
					href="#contact"
					class="flex items-center gap-2 font-mono text-sm transition-colors hover:text-accent-primary
                {activeSection === 'contact' ? 'text-content-main' : 'text-content-sub'}"
				>
					<span
						class="h-2 w-2 rounded-full bg-accent-primary transition-transform duration-300
                    {activeSection === 'contact' ? 'w-2 scale-100' : 'w-0 scale-0'}"
					>
					</span>
					Contact
				</a>
			</div>

			<div class="flex flex-1 items-center justify-end">
				<ThemeToggle />
			</div>
		</nav>
	</div>
</header>

<header
	class="
        pointer-events-none fixed top-0 left-0 z-50 w-full md:hidden"
>
	<nav
		class="
            pointer-events-auto mx-auto flex h-12 items-center
            overflow-hidden border-border-subtle px-4
            shadow-lg backdrop-blur-md"
	>
		<div class="flex flex-1 items-center justify-start">
			<span class="font-heading text-xl font-bold tracking-tight text-content-main">VN</span>
		</div>

		<div class="flex flex-1 items-center justify-end">
			<ThemeToggle />
		</div>
	</nav>
</header>

<nav
	class="
        fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-around border-t
        border-border-subtle bg-surface-component text-center
        md:hidden
    "
>
	<a
		href="#home"
		class="flex h-full w-full flex-col items-center justify-center gap-1 font-mono text-xs transition-colors hover:text-accent-secondary
        {activeSection === 'home' ? 'text-content-main' : 'text-content-sub'}"
	>
		<HouseIcon />
		Home
	</a>

	<a
		href="#about"
		class="flex h-full w-full flex-col items-center justify-center gap-1 font-mono text-xs transition-colors hover:text-accent-secondary
        {activeSection === 'about' ? 'text-content-main' : 'text-content-sub'}"
	>
		<UserRoundPenIcon />
		About
	</a>

	<a
		href="#projects"
		class="flex h-full w-full flex-col items-center justify-center gap-1 font-mono text-xs transition-colors hover:text-accent-secondary
        {activeSection === 'projects' ? 'text-content-main' : 'text-content-sub'}"
	>
		<PanelsTopLeftIcon />
		Projects
	</a>

	<a
		href="#contact"
		class="flex h-full w-full flex-col items-center justify-center gap-1 font-mono text-xs transition-colors hover:text-accent-secondary
        {activeSection === 'projects' ? 'text-content-main' : 'text-content-sub'}"
	>
		<SendIcon />
		Contact
	</a>
</nav>
