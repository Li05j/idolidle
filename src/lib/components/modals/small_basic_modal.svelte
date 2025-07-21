<script lang="ts">
    import { onMount } from 'svelte';
    import { ModalM, type ModalType } from '$lib/managers/modal_manager.svelte'
    import { svgCross } from '$lib/data/icons.svelte';
    import GenericButton from "$lib/components/misc/generic_button.svelte";
	import RebirthAlert from './specific_modals/rebirth_alert.svelte';

    interface Props {
        type: ModalType;
        onClose: (t: ModalType) => void;
        closeOnBackdrop?: boolean;
        // children?: import('svelte').Snippet;
    }

    let {
        type = 'default',
        onClose,
        closeOnBackdrop = true,
        // children
    }: Props = $props();

    // svelte-ignore non_reactive_update
    let modalElement: HTMLDivElement;

    function handleBackdropClick(e: MouseEvent) {
        if (closeOnBackdrop && e.target === modalElement) {
            onClose(type);
        }
    }
</script>

<div
    bind:this={modalElement}
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    onclick={handleBackdropClick}
    role="dialog"
    aria-modal="true"
>
    <div class="relative min-w-1/4 min-h-1/4 bg-white rounded-lg shadow-xl" onclick={(e) => e.stopPropagation()}>
        <div class='absolute top-2 right-2'>
            <GenericButton svg={svgCross} onclick={onClose} variant='secondary' class={'w-8 h-8 rounded-full flex items-center justify-center'}/>
        </div>
        {#if type === 'default'}
            <div class="p-6 font-bold text-red-500">Modal not found? This should not happen.</div>
        {:else if type === 'rebirth_alert'}
            <div class="p-6 font-bold"><RebirthAlert {onClose}/> </div>
        {/if}
    </div>
</div>