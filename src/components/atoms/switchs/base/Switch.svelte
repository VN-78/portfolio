<script lang="ts">
	import { Switch } from 'bits-ui';
</script>

<Switch.Root
        class="
            peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full 
            border-2 border-transparent transition-colors duration-200 ease-in-out
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2
            data-[state=checked]:bg-slate-800 
            data-[state=unchecked]:bg-slate-200 
            dark:focus-visible:ring-slate-300 dark:focus-visible:ring-offset-slate-900 
            dark:data-[state=checked]:bg-slate-100 
            dark:data-[state=unchecked]:bg-slate-700
        "
    >
        <Switch.Thumb
            class="
                pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 
                transition-transform duration-200 ease-in-out
                bg-white
                data-[state=checked]:translate-x-5 
                data-[state=unchecked]:translate-x-0 
                dark:bg-slate-900
            "
        />
    </Switch.Root>