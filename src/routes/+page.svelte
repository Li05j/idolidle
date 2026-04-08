<script lang="ts">
    import AvailableLocations from '$lib/components/game/available_locations.svelte';
    import AvailableActions from '$lib/components/game/available_actions.svelte';
    import CheckpointTopBar from '$lib/components/game/checkpoint_top_bar.svelte';
    import Stats from '$lib/components/game/stats.svelte';
    import History from '$lib/components/game/history.svelte';
    import GenericButton from '$lib/components/shared/generic_button.svelte';
    import ModalShell from '$lib/components/modals/modal_shell.svelte';

    import { ModalM } from '$lib/runtime/modal_manager.svelte';
    import { TodoCardM } from '$lib/runtime/todo_card_manager.svelte';
    import '$lib/runtime/progression_engine.svelte';

    import MultiTabModal from '$lib/components/modals/content/stats_multi_tab_modal.svelte';
    import Live from '$lib/components/modals/content/live.svelte';

    function openSettings() {
        ModalM.open({ component: MultiTabModal, size: 'lg', closeable: true });
    }

    function openStats() {
        ModalM.open({ component: MultiTabModal, size: 'lg', closeable: true });
    }

    function handle_live() {
        TodoCardM.deactivateCurrentActiveCard();
        ModalM.open({ component: Live, size: 'worker', closeable: false });
    }

    $effect(() => {
        document.addEventListener('keydown', ModalM.handleKeydown);
        return () => document.removeEventListener('keydown', ModalM.handleKeydown);
    });
</script>

<ModalShell />

<div class="h-screen flex flex-col">
    <div class="top-0">
        <CheckpointTopBar {handle_live}/>
    </div>
    <div class="flex-auto p-3 overflow-hidden">
        <div class="grid grid-cols-[1fr_1fr_3fr] gap-3 overflow-hidden h-full">

            <div class="flex flex-col h-full overflow-hidden gap-3">
                <Stats />
                <div class="flex-1 overflow-y-auto">
                    <History />
                </div>
                <div class="grid grid-cols-2 justify-center px-2 gap-2">
                    <GenericButton name={"Settings"} onclick={openSettings} variant='secondary' class={"px-3 py-1.5 text-xs w-full"}/>
                    <GenericButton name={"Detailed Stats..."} onclick={openStats} class={"px-3 py-1.5 text-xs w-full"}/>
                </div>
            </div>

            <div class="flex-auto overflow-hidden h-full">
                <AvailableLocations />
            </div>

            <div class="flex-auto overflow-hidden h-full">
                <AvailableActions />
            </div>
        </div>
    </div>
</div>
