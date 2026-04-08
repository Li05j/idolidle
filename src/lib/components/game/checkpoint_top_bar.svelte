<script lang="ts">
    import { ModalM } from "$lib/runtime/modal_manager.svelte";
    import { CPs } from "$lib/state/checkpoints.svelte";
    import { msToSecF } from "$lib/utils/utils"
    import GenericButton from "../shared/generic_button.svelte";
    import RivalInfo from "$lib/components/modals/content/rival_info.svelte";

    let { handle_live } = $props()

    let progress_percent = $derived(Math.min((CPs.current_time_spent / CPs.current_total_time) * 100, 100));

    $effect(() => {
        if (CPs.shouldTriggerLive()) {
            handle_live();
        }
    })

    function open_rival_info() {
        ModalM.open({ component: RivalInfo, size: 'lg', closeable: true });
    }
</script>

<div class="bg-[var(--surface-card)] p-4 rounded-b-2xl shadow-md mb-1 w-full h-32">
    <div class="flex justify-between items-center mb-3">
        <div class="pl-2 text-lg font-bold text-[var(--text-primary)]">Time till next LIVE!</div>
        <GenericButton name={"LIVE info..."} onclick={open_rival_info} variant='cute' class={"px-6 py-2"}/>
    </div>
    <div class="w-full bg-[var(--progress-bg)] rounded-full h-4 mb-3 overflow-hidden">
        <div
            class="h-4 rounded-full transition-all duration-100"
            style="width: {progress_percent}%; background: linear-gradient(90deg, var(--progress-from), var(--progress-to));"
        ></div>
    </div>
    <div class="text-center text-sm text-[var(--text-muted)]">{msToSecF(CPs.current_time_spent)}/{msToSecF(CPs.current_total_time)}s</div>
</div>