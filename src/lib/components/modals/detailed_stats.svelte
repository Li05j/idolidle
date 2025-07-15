<script lang="ts">
    import { fans, moni, sta, charm, pres, eloq, poise } from "$lib/stores/stats.svelte";

    let stats = [fans, moni, sta, charm, pres, eloq, poise]
</script>

<div class="w-full p-4">
    <h3 class="text-xl font-bold mb-4 justify-center text-center">Your Detailed Stats</h3>
    <hr class="h-1 bg-black border-0 opacity-15 mb-4" />
    <div class="rounded shadow-[inset_0_0px_6px_rgba(0,0,0,0.1)]">
        <div class="grid grid-cols-4 px-4 py-4 text-center justify-center gap-y-2">
            <div class='font-semibold text-lg'>Name</div>
            <div class='font-semibold text-lg'>Base Stat</div> 
            <div class='font-semibold text-lg'>Multiplier</div> 
            <div class='font-semibold text-lg'>Final Stat</div>

            <div class='col-span-4 grid grid-cols-4 text-center justify-center'>
                {#each stats as stat}
                    <div class='text-sm'>{stat.name}</div>
                    <div class='text-sm'>{stat.base}</div> 
                    <div class='text-sm'>{stat.multi.toFixed(2)}</div> 
                    <div class='text-sm'>{stat.final_str}</div>
                {/each}
            </div>
        </div>
    </div>
</div>