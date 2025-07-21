<script lang="ts">
    import { ModalM, type ModalType } from '$lib/managers/modal_manager.svelte'
	import BasicModal from '$lib/components/modals/basic_modal.svelte';
	import WorkerModal from './worker_modal.svelte';
	import SmallBasicModal from './small_basic_modal.svelte';

    interface Props {
        type?: ModalType;
        onClose?: (t: ModalType) => void;
        // children?: import('svelte').Snippet;
    }

    let {
        type = 'default',
        onClose = ModalM.set_modal_close,
        // children
    }: Props = $props();
</script>

<div class="z-100">
    {#if ModalM.is_modal_open(type)}
        {#if type === 'default'}
            <div class="p-6 font-bold text-red-500">Modal not found? This should not happen.</div>
        {:else if type === 'settings'}
            <BasicModal type={type} onClose={onClose} />
        {:else if type === 'stats'}
            <BasicModal type={type} onClose={onClose} />
        {:else if type === 'live'}
            <WorkerModal type={type} onClose={onClose} />
        {:else if type === 'rebirth_alert'}
            <SmallBasicModal type={type} onClose={onClose} />
        {/if}
    {/if}
</div>