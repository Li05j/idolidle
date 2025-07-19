<script lang="ts">
    import AvailableLocations from '$lib/components/main_game_page/available_locations.svelte';
    import AvailableActions from '$lib/components/main_game_page/available_actions.svelte';
    import CheckpointTopBar from '$lib/components/main_game_page/checkpoint_top_bar.svelte';
    import Stats from '$lib/components/main_game_page/stats.svelte';
	import History from '$lib/components/main_game_page/history.svelte';
	import GenericButton from '$lib/components/misc/generic_button.svelte';
	import GenericModal from '$lib/components/modals/generic_modal.svelte';

    import { fans, moni, sta, sing, dance, charm, pres } from "$lib/stores/stats.svelte";
	import { modal, type ModalType } from '$lib/managers/modal_manager.svelte';
    import { LiveBattleM } from "$lib/managers/live_battle_manager.svelte"
	import { TodoCardM } from '$lib/managers/todo_card_manager.svelte';
	import { onMount } from 'svelte';

    function openModal(t: ModalType) {
        modal.set_modal_open(t); 
    }
    // function closeModal(t: ModalType) { 
    //     modal.set_modal_close(t); 
    // }

    function cheat() {
        fans.base += 1000;
        sta.base += 1000;
        sing.base += 1000;
        dance.base += 1000;
        charm.base += 1000;
        pres.base += 1000;
        openModal('settings')
        return
    }

    function handle_live() {
        TodoCardM.deactivateCurrentActiveCard()
        openModal('live')
    }

    onMount(() => {
        document.addEventListener('keydown', modal.handleKeydown);
        return () => document.removeEventListener('keydown', modal.handleKeydown);
    });
</script>

{#each modal.modals as m}
    <GenericModal type={m} />
{/each}

<div class="h-screen flex flex-col">
    <div class="top-0 bg-white">
        <CheckpointTopBar {handle_live}/>
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