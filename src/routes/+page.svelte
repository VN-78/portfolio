<script lang="ts">
	import Header from '../components/molecules/header/Header.svelte';
</script>

<Header />

<main class="min-h-screen bg-surface-main px-4 md:px-8 pt-14 md:pt-24 pb-14 md:pb-24 text-content-main">
	<div class="mx-auto w-full max-w-7xl md:px-6 lg:px-8">
		<section
			id="home"
			class="flex min-h-auto flex-col justify-center border-b border-border-subtle md:px-8 py-12 md:py-24"
		>
			<span class="mb-6 text-content-main">👋 Hey! It's me Vishwa,</span>

			<h1 class="mb-16 text-2xl leading-tight font-bold md:text-4xl lg:text-6xl">
				Crafting <span class="text-accent-primary">purpose driven</span> <br />
				<span class="text-accent-primary">experiences</span> that inspire & <br />
				engage.
			</h1>

			<div
				class="flex flex-col gap-8 border-t border-border-subtle pt-8 md:flex-row md:items-center md:justify-between"
			>
				<div class="flex gap-6 text-sm text-content-sub">
					<a href="#link" class="hover:text-content-main">LINKEDIN ↗</a>
					<a href="#link" class="hover:text-content-main">GITHUB ↗</a>
				</div>
				<p class="max-w-md text-sm text-content-sub md:text-right">
					I work with brands globally to build pixel-perfect, engaging, and accessible digital
					experiences.
				</p>
			</div>
		</section>

		<section
			id="about"
			class="flex min-h-screen flex-col justify-center border-b border-border-subtle md:px-8  py-20"
		>
			<h2 class="mb-4 text-4xl font-bold text-content-main">About Me</h2>
			<p class="text-content-sub">This is the second section.</p>
		</section>

		<section id="projects" class="flex min-h-screen flex-col justify-center md:px-8  py-20">
			<h2 class="mb-4 text-4xl font-bold text-content-main">Selected Projects</h2>
			<p class="text-content-sub">You have reached the bottom.</p>
		</section>
	</div>
</main>

<style lang="postcss">
	@reference "tailwindcss";
</style>
