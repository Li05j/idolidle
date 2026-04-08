<script lang="ts">
    import { stat_list } from "$lib/state/stats.svelte";
</script>

<div class="bg-[var(--surface-card)] rounded-xl p-4 shadow-sm">
    <h3 class="text-base font-bold mb-2 text-center text-[var(--text-primary)]">Your Stats</h3>
    <div class="h-px bg-gradient-to-r from-transparent via-[var(--progress-from)] to-transparent mb-3"></div>

    <div class="grid grid-cols-2 gap-x-4 gap-y-1 px-3 py-3 text-center rounded-xl bg-[var(--surface-inset)]">
        {#each Object.entries(stat_list) as [name, stat]}
            <div class="text-sm font-semibold text-[var(--text-primary)]">{name}</div>
            <div class="text-sm text-[var(--text-muted)]">{stat.final_str}</div>
        {/each}
    </div>
</div>