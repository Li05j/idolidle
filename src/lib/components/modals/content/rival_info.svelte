<script lang="ts">
    import { LiveInfo } from "$lib/runtime/live_rival_info.svelte";
</script>

<div class="w-full p-6">
    <div class="rounded-xl bg-[var(--surface-inset)] p-5">
        <h3 class="text-xl font-bold mb-4 text-center text-[var(--text-primary)]">Your Rival</h3>
        <div class="grid grid-cols-2 text-center max-w-[24rem] mx-auto gap-y-2">
            {#each LiveInfo.comparisons as comp}
                <div class='text-base text-[var(--text-primary)]'>{comp.label}:</div>
                <div class="flex justify-center items-center h-full">
                    <div class="w-8 h-6 rounded-md" style={comp.color}></div>
                </div>
            {/each}
        </div>
    </div>
    <div class="flex items-center p-2 mt-2">
        <div class="mx-1 w-6 h-4 rounded-md" style="background-color: hsl(120, 100%, 50%)"></div>
        <p class='text-sm text-[var(--text-muted)]'>- you have enough of this stat.</p>
    </div>
    <div class="flex items-center p-2">
        <div class="mx-1 w-6 h-4 rounded-md" style="background-color: hsl(0, 100%, 50%)"></div>
        <p class='text-sm text-[var(--text-muted)]'>- you need more training on this stat.</p>
    </div>
    <div class="flex p-8 justify-center items-center">
        <h1 class="text-xl font-bold text-[var(--text-primary)]">{LiveInfo.condition_text}</h1>
    </div>
</div>