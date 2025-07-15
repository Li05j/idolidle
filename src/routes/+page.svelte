<script lang="ts">
    import AvailableLocations from '$lib/components/main_game_page/available_locations.svelte';
    import AvailableActions from '$lib/components/main_game_page/available_actions.svelte';
    import CheckpointTopBar from '$lib/components/main_game_page/checkpoint_top_bar.svelte';
    import Stats from '$lib/components/main_game_page/stats.svelte';
	import History from '$lib/components/main_game_page/history.svelte';
	import GenericButton from '$lib/components/misc/generic_button.svelte';
	import GenericModal from '$lib/components/modals/generic_modal.svelte';

    import { fans, moni, sta, charm, pres, eloq, poise } from "$lib/stores/stats.svelte";
	import { modal, type ModalType } from '$lib/stores/modal_manager.svelte';

    let isModalOpen = $state(false)

    function openModal(t: ModalType) {
        modal.type = t
        isModalOpen = true; 
    }
    function closeModal() { isModalOpen = false; }

    function cheat() {
        fans.base += 1000;
        sta.base += 1000;
        charm.base += 1000;
        pres.base += 1000;
        eloq.base += 1000;
        poise.base += 1000;
        openModal('settings')
        return
    }
</script>

<GenericModal bind:show={isModalOpen} type={modal.type} onClose={closeModal} />

<div class="h-screen flex flex-col">
    <div class="top-0 bg-white">
        <CheckpointTopBar />
    </div>
    <div class="flex-auto p-6 bg-gray-50 overflow-hidden">
        <div class="grid grid-cols-5 overflow-hidden h-full">

            <!-- Stats and Logs -->
            <div class="flex flex-col col-span-1 h-full overflow-hidden">
                <Stats />
                <div class="flex-1 overflow-y-auto">
                    <History />
                </div>
                <div class="grid grid-cols-2 justify-center p-4 gap-x-4">
                    <GenericButton name={"Settings"} onclick={cheat} variant='secondary' class={"px-4 py-2 w-full"}/>
                    <GenericButton name={"Detailed Stats..."} onclick={() => openModal('stats')} class={"px-4 py-2 w-full"}/> 
                </div>
            </div>

            <!-- Location -->
            <div class="flex-auto col-span-1 overflow-hidden h-full">
                <AvailableLocations />
            </div>

            <!-- Actions -->
            <div class="flex-auto col-span-3 overflow-hidden h-full">
                <AvailableActions />
            </div>
        </div>
    </div>
</div>