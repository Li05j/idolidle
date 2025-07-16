<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { modal, type ModalType } from '$lib/managers/modal_manager.svelte'
    import { svgCross } from '$lib/data/icons.svelte';
    import GenericButton from "$lib/components/misc/generic_button.svelte";

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
        modal.close_on_esc = false
    })

    onDestroy(() => {
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
    <div class="relative min-w-3/4 min-h-3/4 overflow-auto bg-white rounded-lg shadow-xl" onclick={(e) => e.stopPropagation()}>
        <div class='absolute top-4 right-4'>
            <GenericButton svg={svgCross} onclick={onClose} variant='secondary' class={'w-8 h-8 rounded-full flex items-center justify-center'}/>
        </div>
        {#if type === 'live'}
            <div class="p-6 font-bold text-red-500">LIVE OWO</div>
        {/if}
    </div>
</div>