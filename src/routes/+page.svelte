<script lang="ts">
	import Header from '../components/molecules/header/Header.svelte';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { quartOut } from 'svelte/easing';
	import IconMarquee from '../components/molecules/marquee/IconMarquee.svelte';
	import Home from '../components/organisms/home/Home.svelte';
	import About from '../components/organisms/about/About.svelte';
	import Projects from '../components/organisms/projects/Projects.svelte';
	import Contact from '../components/organisms/contact/Contact.svelte';
	import Footer from '../components/organisms/footer/Footer.svelte';
	import Cat from '../components/organisms/cat/Cat.svelte';

	let isMounted = $state(false);

	onMount(() => {
		isMounted = true;
	});
</script>

<svelte:head>
	<title>Vishwanath | Portfolio</title>

	<meta
		name="description"
		content="Portfolio of Vishwanath, a Software Engineer specializing in React, TypeScript, Svelte, and Data Visualization."
	/>

	<meta property="og:title" content="Vishwanath | Software Engineer" />
	<meta
		property="og:description"
		content="View my latest projects, frontend UI components, and Python data pipelines."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

{#if isMounted}
	<div in:fly={{ y: -40, duration: 600, easing: quartOut }}>
		<Header />
	</div>

	<main
		class="min-h-screen bg-surface-main px-4 pt-14 pb-2 text-content-main md:px-8 md:pt-24 md:pb-6"
	>
		<div
			in:fade={{ delay: 600, duration: 800, easing: quartOut }}
			class="max-w-8xl mx-auto w-full md:px-24 lg:px-32"
		>
			<Home />
			<div
				class="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 border-y border-border-subtle"
			>
				<IconMarquee />
			</div>

			<div class="border-b border-border-subtle pt-20 pb-24">
				<About />
			</div>

			<div class="border-b border-border-subtle py-20">
				<Projects />
			</div>

			<div class="border-b border-border-subtle py-20">
				<Contact />
			</div>

			<div>
				<Footer />
			</div>
		</div>
	</main>
	<div class="pointer-events-none" >
		<div in:fly={{ y: 40, duration: 1500, delay: 1000 }} class=" pointer-events-auto  fixed md:right-1 right-0  bottom-16  md:bottom-0 z-100">
			<Cat />
		</div>
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss";
</style>
