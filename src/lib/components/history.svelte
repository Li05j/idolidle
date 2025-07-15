<script lang="ts">
    import { logs } from '$lib/stores/history.svelte'
    
    let scrollContainer: HTMLElement

    $effect(() => {
        logs.logs.length // Force reactivity
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight
        }
    })
</script>

<div class="p-4 h-full">
    <div 
        bind:this={scrollContainer}
        class="overflow-y-auto overflow-hidden h-full pt-6 px-4 py-4 text-left rounded shadow-[inset_0_0px_6px_rgba(0,0,0,0.1)]"
    >
        {#each logs.logs as log}
        <div class="grid grid-cols-9 gap-x-4">
            <div class='col-span-2'>
                <p class='text-xs'> {@html log[1]} </p>
            </div>
            <div class='col-span-7'>
                <p class='text-xs'> {@html log[2]} </p>
            </div>
        </div>
        {/each}
    </div>
</div>