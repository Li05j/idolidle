<script lang="ts">
    import { LiveBattleM } from "$lib/runtime/live_battle_manager.svelte";
    import { parseText } from "$lib/utils/utils";
    import GenericButton from "$lib/components/shared/generic_button.svelte";
    import { LiveInfo } from "$lib/runtime/live_rival_info.svelte";
    import { LiveVM } from "./live.svelte.ts";
    import Equipment from "./equipment.svelte";
    import RivalInfo from "./rival_info.svelte";
    import { ModalM } from "$lib/runtime/modal_manager.svelte";

    let { onClose } = $props();

    const vm = new LiveVM(onClose);
    let scrollContainer: HTMLElement;

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
    <div class="flex flex-col h-full p-6 gap-6">
        <h2 class="text-2xl font-bold text-[var(--text-primary)] text-center shrink-0">LIVE Battle!</h2>

        <div class="flex-1 flex flex-col items-center justify-center gap-4 max-w-2xl mx-auto text-center min-h-0">
            <div class="text-3xl font-bold text-[var(--text-primary)]">{LiveInfo.rival_name}</div>
            {#if LiveInfo.persona_label}
                <div class="text-sm italic text-[var(--text-muted)] opacity-80">{LiveInfo.persona_label}</div>
            {/if}
            {#if LiveInfo.rival_bio}
                <p class="text-base text-[var(--text-muted)] leading-relaxed">{LiveInfo.rival_bio}</p>
            {/if}
        </div>

        <div class="flex gap-3 justify-center shrink-0">
            <GenericButton name={"Manage Equipment"} onclick={() => ModalM.open({ component: Equipment, size: 'lg', closeable: true })} variant='secondary' class={"px-6 py-3 text-lg"}/>
            <GenericButton name={"Rival Details"} onclick={() => ModalM.open({ component: RivalInfo, size: 'lg', closeable: true })} variant='secondary' class={"px-6 py-3 text-lg"}/>
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
        <div class="flex-1 flex justify-start">
            <div class="flex flex-col gap-3 w-40 mx-auto">
                <div>
                    <div class="text-xs text-[var(--text-muted)] mb-1">Your Style</div>
                    <div class="text-2xl font-bold tabular-nums" style="color: var(--battle-player);">
                        {LiveBattleM.display_your_style}
                    </div>
                </div>
                <div>
                    <div class="text-xs text-[var(--text-muted)] mb-1">Your Stamina</div>
                    <div class="relative h-3 bg-[var(--progress-bg)] rounded-full overflow-hidden">
                        <div
                            class="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                            style="width: {LiveBattleM.display_your_stamina_pct * 100}%; background: var(--battle-player);"
                        ></div>
                    </div>
                </div>
            </div>
        </div>

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

        <div class="flex-1 flex justify-end">
            <div class="flex flex-col gap-3 w-40 mx-auto">
                <div>
                    <div class="text-xs text-[var(--text-muted)] mb-1">Rival Style</div>
                    <div class="text-2xl font-bold tabular-nums" style="color: var(--battle-rival);">
                        {LiveBattleM.display_enemy_style}
                    </div>
                </div>
                <div>
                    <div class="text-xs text-[var(--text-muted)] mb-1">Rival Stamina</div>
                    <div class="relative h-3 bg-[var(--progress-bg)] rounded-full overflow-hidden">
                        <div
                            class="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                            style="width: {LiveBattleM.display_enemy_stamina_pct * 100}%; background: var(--battle-rival);"
                        ></div>
                    </div>
                </div>
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
