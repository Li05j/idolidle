<script lang="ts">
	import { CPs } from "$lib/stores/checkpoints.svelte";
	import { RivalStatsM } from "$lib/stores/live_enemy_stats.svelte";
    import type { LiveBattleStats } from "$lib/types";

</script>

<div class="w-full p-4">
    <div class="rounded shadow-[inset_0_0px_6px_rgba(0,0,0,0.1)]">
        <h3 class="text-xl font-bold mb-4 justify-center text-center">Your Rival</h3>
        <div class="grid grid-cols-2 justify-center text-center">
            <div class='font-semibold text-lg'>Fans:</div> 
            <div class='font-semibold text-lg'>{RivalStatsM.get_stats[CPs.current_completed_checkpoint].Fans}</div>
            <div class='font-semibold text-lg'>Stamina:</div> 
            <div class='font-semibold text-lg'>{RivalStatsM.get_stats[CPs.current_completed_checkpoint].Max_Stamina}</div>
            <div class='font-semibold text-lg'>Sing:</div> 
            <div class='font-semibold text-lg'>{RivalStatsM.get_stats[CPs.current_completed_checkpoint].Sing}</div>
            <div class='font-semibold text-lg'>Dance:</div> 
            <div class='font-semibold text-lg'>{RivalStatsM.get_stats[CPs.current_completed_checkpoint].Dance}</div>
            <div class='font-semibold text-lg'>Charm:</div> 
            <div class='font-semibold text-lg'>{RivalStatsM.get_stats[CPs.current_completed_checkpoint].Charm}</div>
            <div class='font-semibold text-lg'>Presence:</div> 
            <div class='font-semibold text-lg'>{RivalStatsM.get_stats[CPs.current_completed_checkpoint].Presence}</div>
        </div>
    </div>
    <hr class="h-1 bg-black border-0 opacity-15 mb-4" />
</div>