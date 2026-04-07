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
    import { onMount } from 'svelte';

    import MultiTabModal from '$lib/components/modals/content/stats_multi_tab_modal.svelte';
    import Live from '$lib/components/modals/content/live.svelte';

    function openSettings() {
        // Settings placeholder — opens as a simple lg modal
        ModalM.open({ component: MultiTabModal, size: 'lg', closeable: true });
    }

    function openStats() {
        ModalM.open({ component: MultiTabModal, size: 'lg', closeable: true });
    }

    function handle_live() {
        TodoCardM.deactivateCurrentActiveCard();
        ModalM.open({ component: Live, size: 'worker', closeable: false });
    }

    onMount(() => {
        document.addEventListener('keydown', ModalM.handleKeydown);
        return () => document.removeEventListener('keydown', ModalM.handleKeydown);
    });
</script>

<ModalShell />

<div class="h-screen flex flex-col">
    <div class="top-0 bg-white">
        <CheckpointTopBar {handle_live}/>
    </div>
    <div class="flex-auto p-2 bg-gray-50 overflow-hidden">
        <div class="grid grid-cols-[1fr_1fr_3fr] overflow-hidden h-full">

            <!-- Stats and History -->
            <div class="flex flex-col h-full overflow-hidden">
                <Stats />
                <div class="flex-1 overflow-y-auto">
                    <History />
                </div>
                <div class="grid grid-cols-2 justify-center p-4 gap-x-4">
                    <GenericButton name={"Settings"} onclick={openSettings} variant='secondary' class={"px-4 py-2 w-full"}/>
                    <GenericButton name={"Detailed Stats..."} onclick={openStats} class={"px-4 py-2 w-full"}/>
                </div>
            </div>

            <!-- Location -->
            <div class="flex-auto overflow-hidden h-full">
                <AvailableLocations />
            </div>

            <!-- Actions -->
            <div class="flex-auto overflow-hidden h-full">
                <AvailableActions />
            </div>
        </div>
    </div>
</div>
