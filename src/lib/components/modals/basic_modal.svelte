<script lang="ts">
    import { type ModalType } from '$lib/managers/modal_manager.svelte'
    import { svgCross } from '$lib/data/icons';
    import GenericButton from "$lib/components/misc/generic_button.svelte";
	import RivalInfo from './specific_modals/rival_info.svelte';
	import MultiTabModal from './specific_modals/stats_multi_tab_modal.svelte';

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
    <div class="relative w-3/4 h-3/4 bg-white rounded-lg shadow-xl overflow-hidden" onclick={(e) => e.stopPropagation()}>
        <div class='absolute top-4 right-4'>
            <GenericButton svg={svgCross} onclick={onClose} variant='secondary' class={'w-8 h-8 rounded-full flex items-center justify-center'}/>
        </div>
        {#if type === 'default'}
            <div class="p-6 font-bold text-red-500">Modal not found? This should not happen.</div>
        {:else if type === 'settings'}
            <div class="p-6 font-bold">Settings under construction.</div>
        {:else if type === 'stats'}
            <MultiTabModal />
        {:else if type === 'rival_info'}
            <RivalInfo />
        {/if}
    </div>
</div>