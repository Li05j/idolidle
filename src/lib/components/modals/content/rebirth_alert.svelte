<script lang="ts">
    import GenericButton from "$lib/components/shared/generic_button.svelte";
    import { performRebirth } from "$lib/runtime/rebirth_orchestrator.svelte";

    let { onClose }: { onClose: () => void } = $props()

    function on_no() {
        onClose()
    }

    function on_yes() {
        performRebirth()
        onClose()
    }
</script>

<div class="flex flex-col justify-between min-h-[20vh] p-6 text-center">
    <div class="my-4">
        <p class="text-lg text-[var(--text-primary)]">Are you sure you want to treat all this as a Dream?</p>
        <p class="text-sm text-[var(--text-muted)] mt-1">(You will inherit some stats from before.)</p>
    </div>
    <div class="flex justify-between p-2 gap-4">
        <GenericButton name={"No"} onclick={on_no} variant="secondary" class="px-8 py-2 w-full" />
        <GenericButton name={"Yes"} onclick={on_yes} variant="primary" class="px-8 py-2 w-full" />
    </div>
</div>