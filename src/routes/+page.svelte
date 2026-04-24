<script lang="ts">
	import Header from '../components/molecules/header/Header.svelte';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { quartOut } from 'svelte/easing';

	let isMounted = $state(false);

	onMount(() => {
		isMounted = true;
	});
</script>

{#if isMounted}
	<div in:fly={{ y: -40, duration: 600, easing: quartOut }}>
		<Header />
	</div>

	<main
		class="min-h-screen bg-surface-main px-4 pt-14 pb-14 text-content-main md:px-8 md:pt-24 md:pb-24"
	>
		<div
			in:fade={{ delay: 600, duration: 800, easing: quartOut }}
			class="mx-auto w-full max-w-7xl md:px-6 lg:px-8"
		>
			<section
				id="home"
				class="flex min-h-auto flex-col justify-center border-b border-border-subtle py-12 md:px-8 md:py-24"
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
				class="flex min-h-screen flex-col justify-center border-b border-border-subtle py-20 md:px-8"
			>
				<h2 class="mb-4 text-4xl font-bold text-content-main">About Me</h2>
				<p class="text-content-sub">This is the second section.</p>
			</section>

			<section id="projects" class="flex min-h-screen flex-col justify-center py-20 md:px-8">
				<h2 class="mb-4 text-4xl font-bold text-content-main">Selected Projects</h2>
				<p class="text-content-sub">You have reached the bottom.</p>
			</section>
		</div>
	</main>
{/if}

<style lang="postcss">
	@reference "tailwindcss";
</style>
