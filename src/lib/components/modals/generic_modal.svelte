<script lang="ts">
    import { modal, type ModalType } from '$lib/managers/modal_manager.svelte'
    import { svgCross } from '$lib/data/icons.svelte';
    import GenericButton from "$lib/components/misc/generic_button.svelte";
	import BasicModal from '$lib/components/modals/basic_modal.svelte';
	import WorkerModal from './worker_modal.svelte';

    interface Props {
        type?: ModalType;
        onClose?: (t: ModalType) => void;
        // children?: import('svelte').Snippet;
    }

    let {
        type = 'default',
        onClose = modal.set_modal_close,
        // children
    }: Props = $props();
</script>

{#if modal.is_modal_open(type)}
    {#if type === 'default'}
        <div class="p-6 font-bold text-red-500">Modal not found? This should not happen.</div>
    {:else if type === 'settings'}
        <BasicModal type={type} onClose={onClose} />
    {:else if type === 'stats'}
        <BasicModal type={type} onClose={onClose} />
    {:else if type === 'live'}
        <WorkerModal type={type} onClose={onClose} />
    {/if}
{/if}