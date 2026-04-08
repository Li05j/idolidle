<script lang="ts">
    import { ModalM, type ModalConfig } from '$lib/runtime/modal_manager.svelte';
    import { svgCross } from '$lib/data/icons';
    import GenericButton from '$lib/components/shared/generic_button.svelte';

    const SIZE_CLASSES = {
        sm: 'relative min-w-1/4 min-h-1/4 bg-[var(--surface-card)] rounded-2xl shadow-xl',
        lg: 'relative w-3/4 h-3/4 bg-[var(--surface-card)] rounded-2xl shadow-xl overflow-hidden',
        worker: 'relative min-w-3/4 min-h-3/4 overflow-hidden bg-[var(--surface-card)] rounded-2xl shadow-xl',
    };

    let backdropEls: HTMLDivElement[] = $state([]);

    function handleBackdropClick(e: MouseEvent, index: number, config: ModalConfig) {
        if (config.closeable && e.target === backdropEls[index]) {
            ModalM.close();
        }
    }
</script>

{#each ModalM.stack as config, i}
    <div class="z-100">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div
            bind:this={backdropEls[i]}
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onclick={(e) => handleBackdropClick(e, i, config)}
            role="dialog"
            aria-modal="true"
        >
            <div class={SIZE_CLASSES[config.size]} onclick={(e) => e.stopPropagation()}>
                {#if config.closeable}
                    <div class="absolute top-4 right-4 z-10">
                        <GenericButton svg={svgCross} onclick={() => ModalM.close()} variant='secondary' class={'w-8 h-8 rounded-full flex items-center justify-center'}/>
                    </div>
                {/if}
                <config.component onClose={() => ModalM.close()} {...config.props ?? {}} />
            </div>
        </div>
    </div>
{/each}
