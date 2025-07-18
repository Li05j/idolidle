<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { modal, type ModalType } from '$lib/managers/modal_manager.svelte'
    import { svgCross } from '$lib/data/icons.svelte';
    import GenericButton from "$lib/components/misc/generic_button.svelte";
	import Live from '$lib/components/modals/live.svelte';

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

    onMount(() => {
        // closeOnBackdrop = false
        // modal.close_on_esc = false
    })

    onDestroy(() => {
        closeOnBackdrop = true
        modal.close_on_esc = true
    })
</script>

<div
    bind:this={modalElement}
    class="fixed inset-0 z-100 flex items-center justify-center bg-black/50"
    onclick={handleBackdropClick}
    role="dialog"
    aria-modal="true"
>
    <div class="relative min-w-3/4 min-h-3/4 overflow-hidden bg-white rounded-lg shadow-xl" onclick={(e) => e.stopPropagation()}>
        {#if type === 'live'}
            <Live />
        {/if}
    </div>
</div>