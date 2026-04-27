<script lang="ts">
    import { onMount } from 'svelte';
    import AvailableLocations from '$lib/components/game/available_locations.svelte';
    import AvailableActions from '$lib/components/game/available_actions.svelte';
    import CheckpointTopBar from '$lib/components/game/checkpoint_top_bar.svelte';
    import Stats from '$lib/components/game/stats.svelte';
    import History from '$lib/components/game/history.svelte';
    import GenericButton from '$lib/components/shared/generic_button.svelte';
    import ModalShell from '$lib/components/modals/modal_shell.svelte';

    import { ModalM } from '$lib/runtime/modal_manager.svelte';
    import { TodoCardM } from '$lib/runtime/todo_card_manager.svelte';
    import { Progression } from '$lib/runtime/progression_engine.svelte';
    import { Save } from '$lib/state/save.svelte';
    import { EquipM } from '$lib/state/equipment.svelte';
    import { CPs } from '$lib/state/checkpoints.svelte';

    import MultiTabModal from '$lib/components/modals/content/stats_multi_tab_modal.svelte';
    import SettingsMultiTab from '$lib/components/modals/content/settings_multi_tab_modal.svelte';
    import Live from '$lib/components/modals/content/live.svelte';

    const had_save = Save.load();
    if (!had_save) Progression.init();
    EquipM.recalculate_equip_stats();

    let handshake_done = $state(false);

    Save.acquire_tab_lock().then((got) => {
        if (got) {
            Save.mark_loaded();
            Save.start_autosave();
        }
        handshake_done = true;
    });

    let lock_state = $derived<'pending' | 'active' | 'locked'>(
        !handshake_done ? 'pending' : (Save.is_locked ? 'locked' : 'active')
    );

    function openSettings() {
        ModalM.open({ component: SettingsMultiTab, size: 'lg', closeable: true });
    }

    function openHub() {
        ModalM.open({ component: MultiTabModal, size: 'lg', closeable: true });
    }

    function handle_live() {
        TodoCardM.deactivateCurrentActiveCard();
        ModalM.open({ component: Live, size: 'worker', closeable: true });
    }

    let frozen_class = $derived(CPs.is_live_pending ? 'pointer-events-none opacity-50' : '');

    onMount(() => {
        document.addEventListener('keydown', ModalM.handleKeydown);
        return () => document.removeEventListener('keydown', ModalM.handleKeydown);
    });
</script>

{#if lock_state === 'pending'}
    <div class="h-screen flex items-center justify-center text-sm opacity-60">Loading…</div>
{:else if lock_state === 'locked'}
    <div class="h-screen flex flex-col items-center justify-center gap-3 p-6 text-center">
        <div class="text-xl font-semibold">Game is open in another tab</div>
        <div class="text-sm opacity-70 max-w-md">
            To prevent your progress from being overwritten, only one tab can run the game at a time.
            Close other tabs and refresh this page to play here.
        </div>
    </div>
{:else}
    <ModalShell />

    <div class="h-screen flex flex-col">
        <div class="top-0">
            <CheckpointTopBar {handle_live}/>
        </div>
        <div class="flex-auto p-3 overflow-hidden">
            <div class="grid grid-cols-[1fr_1fr_3fr] gap-3 overflow-hidden h-full">

                <div class="flex flex-col h-full overflow-hidden gap-3">
                    <div class={`transition-opacity duration-300 ${frozen_class}`}>
                        <Stats />
                    </div>
                    <div class={`flex-1 overflow-y-auto transition-opacity duration-300 ${frozen_class}`}>
                        <History />
                    </div>
                    <div class="grid grid-cols-2 justify-center px-2 gap-2">
                        <GenericButton name={"Settings"} onclick={openSettings} variant='secondary' class={"px-3 py-2 text-xs w-full"}/>
                        <GenericButton name={"Idol Hub"} onclick={openHub} class={"px-3 py-2 text-xs w-full"}/>
                    </div>
                </div>

                <div class={`flex-auto overflow-hidden h-full transition-opacity duration-300 ${frozen_class}`}>
                    <AvailableLocations />
                </div>

                <div class={`flex-auto overflow-hidden h-full transition-opacity duration-300 ${frozen_class}`}>
                    <AvailableActions />
                </div>
            </div>
        </div>
    </div>
{/if}
