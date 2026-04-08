<script lang="ts">
    import { history } from '$lib/state/history.svelte'
    
    let scrollContainer: HTMLElement

    $effect(() => {
        history.logs.length
        if (scrollContainer) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainer
            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 150

            if (isNearBottom) {
                scrollContainer.scrollTop = scrollHeight
            }
        }
    })
</script>

<div class="bg-[var(--surface-card)] rounded-xl p-3 shadow-sm h-full flex flex-col">
    <h3 class="text-sm font-bold text-center text-[var(--text-muted)] mb-2">Log</h3>
    <div 
        bind:this={scrollContainer}
        class="overflow-y-auto flex-1 px-3 py-2 rounded-lg bg-[var(--surface-inset)]"
    >
        {#each history.logs as log, i}
        <div class="grid grid-cols-9 gap-x-3 py-0.5 {i % 2 === 0 ? '' : 'bg-[var(--surface-base)]/50'} rounded">
            <div class='col-span-2'>
                <p class='text-xs text-[var(--text-muted)]'> {@html log.time} </p>
            </div>
            <div class='col-span-7'>
                <p class='text-xs text-[var(--text-primary)]'> {@html log.message} </p>
            </div>
        </div>
        {/each}
    </div>
</div>