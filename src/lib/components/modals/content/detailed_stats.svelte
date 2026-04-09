<script lang="ts">
    import { Rebirth } from "$lib/state/rebirth.svelte";
    import { stat_list } from "$lib/state/stats.svelte";

    let currency = [stat_list.Fans, stat_list.Moni]
    let other_stats = [stat_list.Stamina, stat_list.Haste, stat_list.Sing, stat_list.Dance, stat_list.Charm, stat_list.Presence]
</script>

<div class="w-full p-4">
    <div class="rounded-xl bg-[var(--surface-inset)]">
        <div class="grid grid-cols-4 px-4 py-4 text-center gap-y-2">
            <div class='font-bold text-sm text-[var(--text-primary)]'>Name</div>
            <div class='font-bold text-sm text-[var(--text-primary)]'>Base</div> 
            <div class='font-bold text-sm text-[var(--text-primary)]'>Multi</div> 
            <div class='font-bold text-sm text-[var(--text-primary)]'>Final</div>

            <div class='col-span-4 h-px bg-gradient-to-r from-transparent via-[var(--progress-from)] to-transparent'></div>

            <div class='col-span-4 grid grid-cols-4 text-center gap-y-1'>
                {#each currency as stat}
                    <div class='text-sm text-[var(--text-primary)]'>{stat.name}</div>
                    <div class='text-sm text-[var(--text-muted)]'>{Math.floor(stat.base)}</div> 
                    <div class='text-sm text-[var(--text-muted)]'>{stat.multi.toFixed(2)}</div> 
                    <div class='text-sm font-semibold text-[var(--text-primary)]'>{stat.final_str}</div>
                {/each}
                {#each other_stats as stat}
                    <div class='text-sm text-[var(--text-primary)]'>{stat.name}</div>
                    <div class='text-sm text-[var(--text-muted)]'>{stat.base.toFixed(2)}</div> 
                    <div class='text-sm text-[var(--text-muted)]'>{stat.multi.toFixed(2)}</div> 
                    <div class='text-sm font-semibold text-[var(--text-primary)]'>{stat.final_str}</div>
                {/each}
            </div>
        </div>
    </div>
    <div class="rounded-xl bg-[var(--surface-inset)] mt-3">
        <div class="grid grid-cols-4 px-4 py-4 text-center gap-y-2">
            <div class='font-bold text-sm text-[var(--text-primary)]'>Total Dreams:</div>
            <div class='text-sm text-[var(--text-muted)]'>{Rebirth.rebirth_count}</div>
            <div class='font-bold text-sm text-[var(--text-primary)]'>Max LIVE Wins:</div> 
            <div class='text-sm text-[var(--text-muted)]'>{Rebirth.max_completed_checkpoints}</div>
            <div class='font-bold text-sm text-[var(--text-primary)]'>Dream Points:</div>
            <div class='text-sm text-[var(--text-muted)]'>{Rebirth.rebirth_points}</div>
        </div>
    </div>
</div>