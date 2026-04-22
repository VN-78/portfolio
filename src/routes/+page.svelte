<script lang="ts">
	import Header from '../components/molecules/header/Header.svelte';
</script>

<Header />

<main class="min-h-screen bg-surface-main pt-32 pb-24 text-content-main">
	<section
		id="home"
		class="flex min-h-[120vh] flex-col items-center justify-center border-b border-border-subtle p-4"
	>
		<h1 class="mb-8 text-5xl font-bold text-accent-primary">Welcome to my Portfolio</h1>
		<p class="mb-12 max-w-2xl text-center text-content-sub">
			Scroll down to see the floating header transition from full-width to a centered pill.
		</p>
	</section>

	<section
		id="about"
		class="flex min-h-screen flex-col items-center justify-center border-b border-border-subtle bg-surface-highlight p-4"
	>
		<h2 class="mb-4 text-4xl font-bold text-content-main">About Me</h2>
		<p class="text-content-sub">This is the second section. Notice the header state.</p>
	</section>

	<section id="projects" class="flex min-h-screen flex-col items-center justify-center p-4">
		<h2 class="mb-4 text-4xl font-bold text-content-main">Selected Projects</h2>
		<p class="text-content-sub">
			You have reached the bottom. The mobile nav shouldn't cover this text.
		</p>
	</section>
</main>

<style lang="postcss">
	@reference "tailwindcss";
</style>
