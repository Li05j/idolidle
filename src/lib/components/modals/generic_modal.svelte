<script lang="ts">
    import { onMount } from 'svelte';

    interface Props {
        show: boolean;
        onClose?: () => void;
        closeOnBackdrop?: boolean;
        closeOnEscape?: boolean;
        children?: import('svelte').Snippet;
    }

    let {
        show = $bindable(),
        onClose,
        closeOnBackdrop = true,
        closeOnEscape = true,
        children
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
        <div class="relative max-h-[90vh] max-w-[90vw] overflow-auto bg-white rounded-lg shadow-xl" onclick={(e) => e.stopPropagation()}>
            {#if children}
                {@render children()}
            {/if}
        </div>
    </div>
{/if}