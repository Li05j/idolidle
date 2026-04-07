<script lang="ts">
    import { LiveBattleM } from "$lib/state/live_battle_manager.svelte";
    import { onMount } from "svelte";
    import { parseText } from "$lib/utils/utils";
    import GenericButton from "$lib/components/shared/generic_button.svelte";
    import { LiveInfo } from "$lib/state/live_rival_info.svelte";
    import { LiveVM } from "./live.svelte.ts";

    let { onClose } = $props();

    const vm = new LiveVM(onClose);
    let scrollContainer: HTMLElement;
    const sidebar_stats = $derived(LiveInfo.comparisons.filter(c => c.label !== "Fans"));

    $effect(() => {
        LiveBattleM.turn_logs.length;
        if (scrollContainer) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 150;
            if (isNearBottom) {
                scrollContainer.scrollTop = scrollHeight;
            }
        }
    });

    onMount(() => vm.startBattle());
</script>

<div class="w-full flex justify-center">
    <div class="relative w-2/3 h-6 bg-[var(--progress-bg)] rounded my-8">
        <!-- Left -->
        <div
            class="absolute top-0 left-0 h-full bg-[var(--battle-player)] transition-all duration-300 rounded"
            style="width: {vm.leftPercent}%"
        ></div>

        <!-- Right part -->
        <div
            class="absolute top-0 right-0 h-full bg-[var(--battle-rival)] transition-all duration-300 rounded"
            style="width: {vm.rightPercent}%"
        ></div>

        <!-- Divider line -->
        <div
          class="absolute top-[-75%] h-[250%] w-1 bg-gradient-to-b from-transparent via-gray-800 to-transparent shadow-[0_0_6px_rgba(0,0,0,0.3)] transition-all duration-300"
          style="left: {vm.leftPercent-0.3}%"
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

    <div class="flex-1 justify-end">
        <div class="grid grid-cols-2 text-center gap-2 mx-auto">
            {#each sidebar_stats as comp}
                <div>{comp.label}:</div>
                <div class="w-8 h-6 rounded" style={comp.color}></div>
            {/each}
        </div>
    </div>
</div>

{#if LiveBattleM.live_sim_complete}
    <div class="absolute bottom-4 left-4 right-4 flex justify-between gap-4">
        <GenericButton name={"It was all a Dream..."} onclick={() => vm.onRebirth()} variant='secondary' class={"px-4 py-2 w-full"}/>
        <GenericButton name={"Continue"} onclick={() => vm.onContinue()} variant='primary' class={"px-4 py-2 w-full"} disabled={!vm.is_won} tooltip='You have to win the LIVE to continue'/>
    </div>
{/if}
