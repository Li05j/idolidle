<script lang="ts">
    import { onMount } from 'svelte';
    import type { ModalType } from '$lib/stores/modal_manager.svelte'
	import DetailedStats from './detailed_stats.svelte';
	import GenericButton from "$lib/components/misc/generic_button.svelte";
    import { svgCross } from '$lib/data/icons.svelte';

    interface Props {
        show: boolean;
        type: ModalType;
        onClose?: () => void;
        closeOnBackdrop?: boolean;
        closeOnEscape?: boolean;
        // children?: import('svelte').Snippet;
    }

    let {
        show = $bindable(),
        type = 'default',
        onClose,
        closeOnBackdrop = true,
        closeOnEscape = true,
        // children
    }: Props = $props();

    // svelte-ignore non_reactive_update
    let modalElement: HTMLDivElement;

    function handleBackdropClick(e: MouseEvent) {
        if (closeOnBackdrop && e.target === modalElement) {
            onClose?.();
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (closeOnEscape && e.key === 'Escape') {
            onClose?.();
        }
    }

    onMount(() => {
        if (closeOnEscape) {
            document.addEventListener('keydown', handleKeydown);
            return () => document.removeEventListener('keydown', handleKeydown);
        }
    });
</script>

{#if show}
    <div
        bind:this={modalElement}
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onclick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
    >
        <div class="relative min-w-3/4 min-h-3/4 overflow-auto bg-white rounded-lg shadow-xl" onclick={(e) => e.stopPropagation()}>
            <div class='absolute top-4 right-4'>
                <GenericButton svg={svgCross} onclick={onClose} variant='secondary' class={'w-8 h-8 rounded-full flex items-center justify-center'}/>
            </div>
            {#if type === 'default'}
                <div class="p-6 font-bold text-red-500">Modal not found? This should not happen.</div>
            {:else if type === 'settings'}
                <div class="p-6 font-bold">Settings under construction.</div>
            {:else if type === 'stats'}
                <DetailedStats />
            {/if}
        </div>
    </div>
{/if}