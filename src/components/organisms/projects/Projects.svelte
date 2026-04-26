<script lang="ts">
	import { projects } from '$lib/data/projects';
</script>

<section id="projects" class="md:px-8">
	<h2 class="mb-12 font-heading text-4xl font-bold text-content-main md:text-6xl">
		Selected Works
	</h2>

	<div
		class="grid auto-rows-[320px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-flow-dense lg:grid-cols-3"
	>
		{#each projects as project, i (`${project.title}-${i}`)}
			<a
				href={project.link}
				target="_blank"
				rel="external"
				class="group bg-surface-alt relative block h-full w-full overflow-hidden rounded-2xl border border-border-subtle transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl {project.colSpan} {project.rowSpan}"
			>
				<enhanced:img
					src={project.image}
					alt={project.title}
					class="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
				/>

				<div
					class="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				></div>

				<div class="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
					<div
						class="translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
					>
						<div class="mb-3 flex flex-wrap gap-2">
							{#each project.tags as tag, i (`${tag}-${i}`)}
								<span
									class="rounded-full border border-white/10 bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-md"
								>
									{tag}
								</span>
							{/each}
						</div>

						<h3 class="text-2xl font-bold text-white">{project.title}</h3>
					</div>
				</div>
			</a>
		{/each}
	</div>
</section>
