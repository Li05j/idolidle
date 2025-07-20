<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { ModalM, type ModalType } from '$lib/managers/modal_manager.svelte'
	import Live from '$lib/components/modals/specific_modals/live.svelte';

    let closeOnBackdrop: boolean = true

    interface Props {
        type: ModalType;
        onClose: (t: ModalType) => void;
    }

    let {
        type = 'default',
        onClose,
    }: Props = $props();

    // svelte-ignore non_reactive_update
    let modalElement: HTMLDivElement;

    function handleBackdropClick(e: MouseEvent) {
        if (closeOnBackdrop && e.target === modalElement) {
            onClose(type);
        }
    }

    // $effect(() => {
    //     if (LiveBattleM.live_sim_complete) {
    //         closeOnBackdrop = true
    //         ModalM.close_on_esc = true
    //     }
    // })

    onMount(() => {
        closeOnBackdrop = false
        ModalM.close_on_esc = false
    })

    onDestroy(() => {
        closeOnBackdrop = true
        ModalM.close_on_esc = true
    })
</script>

<div
    bind:this={modalElement}
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    onclick={handleBackdropClick}
    role="dialog"
    aria-modal="true"
>
    <div class="relative min-w-3/4 min-h-3/4 overflow-hidden bg-white rounded-lg shadow-xl" onclick={(e) => e.stopPropagation()}>
        {#if type === 'live'}
            <Live onClose={onClose}/>
        {/if}
    </div>
</div>