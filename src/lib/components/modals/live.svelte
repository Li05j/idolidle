<script lang="ts">
    import { LiveBattleM } from "$lib/managers/live_battle_manager.svelte"
	import { onMount } from "svelte";
    
    let scrollContainer: HTMLElement

    let total = $derived(LiveBattleM.display_your_fans + LiveBattleM.display_enemy_fans);
    let leftPercent = $derived(LiveBattleM.display_your_fans / total * 100);
    let rightPercent = $derived(LiveBattleM.display_enemy_fans / total * 100);

    onMount(() => {
        LiveBattleM.start_live();
        LiveBattleM.turn_logs.forEach((l) => {
            console.log(l.msg)
        })
    })

    $effect(() => {
        LiveBattleM.turn_logs.length // Force reactivity
        if (scrollContainer) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainer
            // Only force auto scroll when scroll is already near the bottom
            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 150

            if (isNearBottom) {
                scrollContainer.scrollTop = scrollHeight
            }
        }
    })
</script>

<div class="w-full flex justify-center">
    <div class="relative w-2/3 h-6 bg-gray-200 rounded my-8">
        <!-- Left -->
        <div 
            class="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300 rounded"
            style="width: {leftPercent}%"
        ></div>
        
        <!-- Right part -->
        <div 
            class="absolute top-0 right-0 h-full bg-red-500 transition-all duration-300 rounded"
            style="width: {rightPercent}%"
        ></div>
        
        <!-- Divider line -->
        <div 
          class="absolute top-[-75%] h-[250%] w-1 bg-gradient-to-b from-transparent via-gray-800 to-transparent shadow-[0_0_6px_rgba(0,0,0,0.3)] transition-all duration-300"
          style="left: {leftPercent-0.3}%"
        ></div>
    </div>
</div>

<div class="mt-2 flex justify-center">
    <div 
        bind:this={scrollContainer} 
        class="mt-2 text-center overflow-y-auto w-[80vh] h-[50vh] rounded shadow-[inset_0_0px_6px_rgba(0,0,0,0.1)]"
    >
        {#each LiveBattleM.turn_logs as log }
            <div>
                {log.msg}
            </div>
        {/each}
    </div>
</div>