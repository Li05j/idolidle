<script lang="ts">
    import { LiveInfo } from "$lib/runtime/live_rival_info.svelte";
    import { DEV } from "$lib/config";
</script>

<div class="w-full p-6">
    <div class="rounded-xl bg-[var(--surface-inset)] p-5">
        <h3 class="text-xl font-bold mb-4 text-center text-[var(--text-primary)]">Your Rival</h3>
        <div class="grid items-center justify-center gap-x-3 gap-y-2 max-w-[28rem] mx-auto" style="grid-template-columns: {DEV ? '1fr auto auto auto 1fr' : 'auto auto auto'}">
            <div class="text-sm font-semibold text-[var(--text-muted)] text-right">You</div>
            <div></div>
            <div></div>
            {#if DEV}
                <div></div>
                <div class="text-sm font-semibold text-[var(--text-muted)] text-left">Rival</div>
            {/if}
            {#each LiveInfo.comparisons as comp}
                <div class="text-base text-[var(--text-primary)] text-right tabular-nums">{comp.playerValue}</div>
                <div class="text-sm text-[var(--text-muted)] text-center">{comp.label}</div>
                <div class="flex justify-center"><div class="w-8 h-6 rounded-md" style={comp.color}></div></div>
                {#if DEV}
                    <div class="text-sm text-[var(--text-muted)] text-center">{comp.rivalLabel}</div>
                    <div class="text-base text-[var(--text-primary)] text-left tabular-nums">{comp.rivalValue}</div>
                {/if}
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