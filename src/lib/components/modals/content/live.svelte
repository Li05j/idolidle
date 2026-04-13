<script lang="ts">
    import { LiveBattleM } from "$lib/runtime/live_battle_manager.svelte";
    import { parseText } from "$lib/utils/utils";
    import GenericButton from "$lib/components/shared/generic_button.svelte";
    import { LiveInfo } from "$lib/runtime/live_rival_info.svelte";
    import { DEV } from "$lib/config";
    import { LiveVM } from "./live.svelte.ts";
    import Equipment from "./equipment.svelte";
    import { ModalM } from "$lib/runtime/modal_manager.svelte";

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
</script>

{#if vm.effectivePhase === 'preview'}
    <div class="flex flex-col items-center justify-center h-full p-6 gap-6">
        <h2 class="text-2xl font-bold text-[var(--text-primary)]">LIVE Battle!</h2>

        <div class="rounded-xl bg-[var(--surface-inset)] p-5 w-full max-w-lg">
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

        <p class="text-lg font-bold text-[var(--text-primary)] text-center">{LiveInfo.condition_text}</p>

        <div class="flex gap-3">
            <GenericButton name={"Manage Equipment"} onclick={() => ModalM.open({ component: Equipment, size: 'lg', closeable: true })} variant='secondary' class={"px-6 py-3 text-lg"}/>
            <GenericButton name={"Start Battle!"} onclick={() => vm.startBattle()} variant='primary' class={"px-8 py-3 text-lg"}/>
        </div>
    </div>

{:else}
    <div class="w-full flex justify-center">
        <div class="relative w-2/3 h-6 bg-[var(--progress-bg)] rounded-full my-8 overflow-hidden">
            <div
                class="absolute top-0 left-0 h-full transition-all duration-300 rounded-full"
                style="width: {vm.leftPercent}%; background: var(--battle-player);"
            ></div>

            <div
                class="absolute top-0 right-0 h-full transition-all duration-300 rounded-full"
                style="width: {vm.rightPercent}%; background: var(--battle-rival);"
            ></div>

            <div
              class="absolute top-[-75%] h-[250%] w-0.5 bg-gradient-to-b from-transparent via-[var(--text-primary)] to-transparent transition-all duration-300"
              style="left: {vm.leftPercent-0.3}%"
            ></div>
        </div>
    </div>

    <div class="flex items-center">
        <div class="flex-1"></div>
        <div class="mt-2 mx-auto">
            <div
                bind:this={scrollContainer}
                class="p-4 text-center overflow-y-auto w-[75vh] h-[55vh] rounded-xl bg-[var(--surface-inset)]"
            >
                {#each LiveBattleM.turn_logs as log }
                    <div class="py-0.5">
                        {@html parseText(log.msg)}
                    </div>
                {/each}
            </div>
        </div>

        <div class="flex-1 justify-end">
            <div class="grid grid-cols-2 text-center gap-2 mx-auto">
                {#each sidebar_stats as comp}
                    <div class="text-sm text-[var(--text-primary)]">{comp.label}:</div>
                    <div class="w-8 h-6 rounded-md" style={comp.color}></div>
                {/each}
            </div>
        </div>
    </div>

    {#if vm.effectivePhase === 'done'}
        <div class="absolute bottom-4 left-4 right-4 flex justify-between gap-4">
            <GenericButton name={"It was all a Dream..."} onclick={() => vm.onRebirth()} variant='secondary' class={"px-4 py-2 w-full"}/>
            <GenericButton name={"Continue"} onclick={() => vm.onContinue()} variant='primary' class={"px-4 py-2 w-full"} disabled={!vm.is_won} tooltip='You have to win the LIVE to continue'/>
        </div>
    {/if}
{/if}
