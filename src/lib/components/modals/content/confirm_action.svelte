<script lang="ts">
    import GenericButton from "$lib/components/shared/generic_button.svelte";

    let { onClose, title, body, on_yes }:
        { onClose: () => void, title: string, body: string, on_yes: () => void } = $props();

    function handle_no() {
        onClose();
    }

    function handle_yes() {
        on_yes();
        onClose();
    }
</script>

<div class="flex flex-col justify-between min-h-[20vh] p-6 text-center">
    <div class="my-4">
        <p class="text-lg font-semibold text-[var(--text-primary)]">{title}</p>
        <p class="text-sm text-[var(--text-muted)] mt-2">{body}</p>
    </div>
    <div class="flex justify-between p-2 gap-4">
        <GenericButton name={"No"} onclick={handle_no} variant="secondary" class="px-8 py-2 w-full" />
        <GenericButton name={"Yes"} onclick={handle_yes} variant="primary" class="px-8 py-2 w-full" />
    </div>
</div>
