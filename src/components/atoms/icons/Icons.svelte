<script lang="ts">
    import type { IconPath } from '../../../lib/assets/icons';

    interface Props {
        paths: IconPath[];
        viewBox?: string;
        class?: string;
        colored?: boolean;
    }

    let {
        paths,
        viewBox = '0 0 128 128',
        class: className = '',
        colored = false
    }: Props = $props();
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    {viewBox}
    class={className}
    aria-hidden="true"
>
    {#each paths as part (part.d)}
        <path 
            d={part.d} 
            fill={colored || part.forceColor ? part.color : 'currentColor'}
            fill-rule={part.fillRule ?? undefined} 
            class="transition-colors duration-500"
        />
    {/each}
</svg>