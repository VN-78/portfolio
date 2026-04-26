<script lang="ts">
	// Dynamically grab the year so you never have to update this manually
	const currentYear = new Date().getFullYear();

	// A simple function to smoothly scroll back to the top of the page.
	// If your Lenis instance is active, it will naturally hijack this and make it smooth.
	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};
</script>

<footer class=" bg-surface-main py-4">
	<div
		class="mx-auto flex w-full max-w-8xl flex-col items-center justify-between gap-6 px-6 md:flex-row md:px-8"
	>
		<div class="flex flex-col items-center gap-1 md:items-start">
			<span class="text-lg font-bold text-content-main">Vishwa</span>
			<span class="text-sm text-content-sub">
				&copy; {currentYear}. Built with SvelteKit & Tailwind.
			</span>
		</div>

		<div class="flex items-center gap-6">
			<a
				href="https://github.com/VN-78"
				target="_blank"
				rel="noopener noreferrer"
				class="text-content-sub transition-colors hover:text-content-main"
				aria-label="GitHub"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="size-6"
				>
					<path
						d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.5-1.4 6.5-7.18A5.3 5.3 0 0 0 19 5.2a5.5 5.5 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a11.1 11.1 0 0 0-6.2 0C6.6 1.7 5.5 1.7 5.5 1.7a5.5 5.5 0 0 0-.1 3.2A5.3 5.3 0 0 0 4 7.8c0 5.8 3.35 6.83 6.5 7.18A4.8 4.8 0 0 0 9 18v4"
					></path>
					<polyline points="9 22 9 18 6 15.5 3 16"></polyline>
				</svg>
			</a>

			<a
				href="https://linkedin.com/in/your-profile"
				target="_blank"
				rel="noopener noreferrer"
				class="text-content-sub transition-colors hover:text-content-main"
				aria-label="LinkedIn"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="size-6"
				>
					<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
					></path>
					<rect x="2" y="9" width="4" height="12"></rect>
					<circle cx="4" cy="4" r="2"></circle>
				</svg>
			</a>
		</div>

		<button
			onclick={scrollToTop}
			class="group flex cursor-pointer items-center gap-2 text-sm font-medium text-content-sub transition-colors hover:text-content-main"
			aria-label="Scroll to top"
		>
			<span>Back to top</span>
			<div
				class="flex size-8 items-center justify-center rounded-full bg-surface-highlight transition-transform group-hover:-translate-y-1"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="size-4"
				>
					<line x1="12" y1="19" x2="12" y2="5"></line>
					<polyline points="5 12 12 5 19 12"></polyline>
				</svg>
			</div>
		</button>
	</div>
</footer>
