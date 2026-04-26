import type Lenis from 'lenis';

// we create an reactive svelte 5 object that is used as the store for the scroll state
// it starts as null but will hold our lenis instance  the scroll state is initialized
export const scrollState = $state<{ lenis: Lenis | null }>({
	lenis: null
});
