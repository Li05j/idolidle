<script lang="ts">
    import { stat_list } from "$lib/stores/stats.svelte";
</script>

<h3 class="text-lg font-bold mb-4 justify-center text-center">Your Stats</h3>
<hr class="h-1 bg-black border-0 opacity-15 mb-4" />

<div class="p-4">
    <div class="grid grid-cols-2 gap-x-4 pt-6 px-4 py-4 text-center justify-center rounded shadow-[inset_0_0px_6px_rgba(0,0,0,0.1)]">
        {#each Object.entries(stat_list) as [name, stat]}
            <div>{name}:</div>    <div>{stat.final_str}</div>
        {/each}
    </div>
</div>