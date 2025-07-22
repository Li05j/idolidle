<script lang="ts">
	import { ModalM } from "$lib/managers/modal_manager.svelte";
    import { CPs } from "$lib/stores/checkpoints.svelte";
    import { msToSecF, DECIMAL_PLACES } from "$lib/utils/utils"
	import GenericButton from "../misc/generic_button.svelte";

    let { handle_live } = $props()

    let progress_percent = $derived(Math.min((CPs.current_time_spent / CPs.current_total_time) * 100, 100));
    // let progress_text = $derived(`${progress_percent.toFixed(DECIMAL_PLACES)}% complete`);

    $effect(() => {
        if (CPs.last_live_checkpoint_triggered != CPs.current_completed_checkpoint && CPs.current_time_spent >= CPs.current_total_time) {
            CPs.last_live_checkpoint_triggered = CPs.current_completed_checkpoint
            handle_live();
        }
    })

    function open_rival_info() {
        ModalM.set_modal_open('rival_info')
    }
</script>

<div class="bg-white p-4 rounded-lg shadow-md mb-4 top-0 left-0 w-full h-32">
    <div class="flex justify-between items-center mb-3">
        <div class="pl-2 text-lg font-bold">Time till next LIVE!</div>
        <GenericButton name={"⭐ LIVE info..."} onclick={open_rival_info} variant='cute' class={"px-6 py-2"}/>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-4 mb-3">
        <div class="h-4 bg-green-500 rounded transition-all duration-100" style="width: {progress_percent}%"></div>
    </div>
    <div class="text-center text-sm text-gray-600">{msToSecF(CPs.current_time_spent)}/{msToSecF(CPs.current_total_time)}s</div>
</div>