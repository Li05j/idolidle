<script lang="ts">
    import { LiveBattleM } from "$lib/managers/live_battle_manager.svelte"
	import { onMount } from "svelte";

    import { parseText } from "$lib/utils/utils";
	import GenericButton from "$lib/components/misc/generic_button.svelte";
	import { CPs } from "$lib/stores/checkpoints.svelte";
	import { ModalM } from "$lib/managers/modal_manager.svelte";
	import { logs } from "$lib/stores/history.svelte";
	import { Rebirth } from "$lib/stores/rebirth.svelte";
	import { fans } from "$lib/stores/stats.svelte";
	import { LiveInfo } from "$lib/stores/live_rival_info.svelte";
    
    let { onClose } = $props()
    const type = 'live'

    let scrollContainer: HTMLElement

    let total = $derived(LiveBattleM.display_your_fans + LiveBattleM.display_enemy_fans);
    let leftPercent = $derived(LiveBattleM.display_your_fans / total * 100);
    let rightPercent = $derived(LiveBattleM.display_enemy_fans / total * 100);

    let fan_change = 0;
    let is_won = $derived(LiveBattleM.did_player_win)

    onMount(() => {
        fan_change = LiveBattleM.start_live();
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

    function on_continue_clicked() {
        LiveBattleM.reset()
        // Update only after continue clicked, all transactions will be invalid if game stopped prematurely.
        CPs.advanceToNextCheckpoint()
        Rebirth.update_max_completed_checkpoints(CPs.current_completed_checkpoint)

        if (fan_change >= 0) {
            logs.addHintLogs(`LIVE has successfully concluded. You gained ${fan_change} fans!`, true)
        } else {
            logs.addHintLogs(`LIVE has concluded. You lost ${-fan_change} fans!`, true)
        }
        onClose(type)
    }

    function on_rebirth_clicked() {
        ModalM.set_modal_open('rebirth_alert')
    }
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
            class="absolute top-0 right-0 h-full bg-orange-500 transition-all duration-300 rounded"
            style="width: {rightPercent}%"
        ></div>
        
        <!-- Divider line -->
        <div 
          class="absolute top-[-75%] h-[250%] w-1 bg-gradient-to-b from-transparent via-gray-800 to-transparent shadow-[0_0_6px_rgba(0,0,0,0.3)] transition-all duration-300"
          style="left: {leftPercent-0.3}%"
        ></div>
    </div>
</div>

<div class="flex items-center">
    <div class="flex-1"></div>
    <div class="mt-2 mx-auto">
        <div 
            bind:this={scrollContainer} 
            class="p-4 text-center overflow-y-auto w-[75vh] h-[55vh] rounded shadow-[inset_0_0px_6px_rgba(0,0,0,0.2)]"
        >
            {#each LiveBattleM.turn_logs as log }
                <div>
                    {@html parseText(log.msg)}
                </div>
            {/each}
        </div>
    </div>

    <div class="flex-1 flex justify-end">
        <div class="grid grid-cols-2 text-center gap-2 mx-auto">
            <div class='text'>Stamina:</div> 
            <div class="w-8 h-6 rounded" style={LiveInfo.sta_color}></div>
            <div class=''>Sing:</div> 
            <div class="w-8 h-6 rounded" style={LiveInfo.sing_color}></div>
            <div class=''>Dance:</div> 
            <div class="w-8 h-6 rounded" style={LiveInfo.dance_color}></div>
            <div class='text'>Charm:</div> 
            <div class="w-8 h-6 rounded" style={LiveInfo.charm_color}></div>
            <div class='text'>Presence:</div> 
            <div class="w-8 h-6 rounded" style={LiveInfo.pres_color}></div>
        </div>
    </div>
</div>

{#if LiveBattleM.live_sim_complete}
    <div class="absolute bottom-4 left-4 right-4 flex justify-between gap-4">
        <GenericButton name={"It was all a Dream..."} onclick={on_rebirth_clicked} variant='secondary' class={"px-4 py-2 w-full"}/>
        <GenericButton name={"Continue"} onclick={on_continue_clicked} variant='primary' class={"px-4 py-2 w-full"} disabled={!is_won} tooltip='You have to win the LIVE to continue'/>
    </div>
{/if}