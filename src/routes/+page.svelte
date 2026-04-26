<script lang="ts">
	import Header from '../components/molecules/header/Header.svelte';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { quartOut } from 'svelte/easing';
	import IconMarquee from '../components/molecules/marquee/IconMarquee.svelte';

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
			class="max-w-8xl mx-auto w-full md:px-24 lg:px-32"
		>
			<section
				id="home"
				class="grid min-h-[80vh] grid-cols-1 items-center gap-12 py-12 md:px-8 md:py-24 lg:grid-cols-12">
				<div class="flex flex-col justify-center lg:col-span-7">
					<span class="mb-4 text-content-main">👋 Hey! It's me Vishwa,</span>

					<h1
						class="mb-6 max-w-6xl font-heading text-3xl leading-tight font-bold tracking-tight text-content-main md:text-4xl lg:text-6xl"
					>
						Crafting intelligent web ecosystems and
						<span class="text-accent-primary"> data-driven experiences.</span>
					</h1>

					<p class="mb-10 max-w-lg text-base leading-relaxed text-content-sub md:text-lg">
						Pragmatic developer focused on

						<strong
							class="rounded-md border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5
                   font-mono font-medium text-blue-600
                   dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-400"
						>
							TypeScript
						</strong>
						and
						<strong
							class="rounded-md border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5
                   font-mono font-medium text-amber-600
                   dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-400"
						>
							Python
						</strong>. I specialize in turning complex data into unified, accessible UI, constantly
						exploring the intersection of modern frontend and

						<strong
							class="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5
                   font-mono font-medium text-emerald-600
                   dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400"
						>
							AI systems
						</strong>.
					</p>
					<!-- TODO: add all the required links and an contact me button -->
					<div class="flex flex-col gap-6 md:flex-row md:items-center">
						<div class="flex gap-6 text-sm font-medium text-content-sub">
							<a href="#link" class="transition-colors hover:text-content-main">LINKEDIN ↗</a>
							<a href="#link" class="transition-colors hover:text-content-main">GITHUB ↗</a>
						</div>
					</div>
				</div>

				<div class="flex items-center justify-center lg:col-span-5 lg:justify-end">
					<div
						class="bg-surface-alt flex aspect-square w-64 items-center justify-center rounded-2xl border border-border-subtle text-content-sub shadow-sm md:w-80 lg:w-96"
					>
						Avatar Space
					</div>
				</div>
			</section>

			<div class="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 pb-12 border-t border-border-subtle ">
				<IconMarquee />
			</div>

			<section
				id="about"
				class="flex min-h-screen flex-col justify-center border-b border-border-subtle py-20 md:px-8"
			>
				<h2 class="mb-4 font-heading text-4xl font-bold text-content-main">About Me</h2>
				<p class="text-content-sub">This is the second section.</p>
			</section>

			<section id="projects" class="flex min-h-screen flex-col justify-center py-20 md:px-8">
				<h2 class="mb-4 font-heading text-4xl font-bold text-content-main">Selected Projects</h2>
				<p class="text-content-sub">this is the third section.</p>
			</section>

			<section id="contact" class="flex min-h-screen flex-col justify-center py-20 md:px-8">
				<h2 class="mb-4 font-heading text-4xl font-bold text-content-main">Contact Me</h2>
				<p class="text-content-sub">You have reached the bottom.</p>
			</section>
		</div>
	</main>
{/if}

<style lang="postcss">
	@reference "tailwindcss";
</style>
