<script lang="ts">
    import ActionCard from '$lib/components/generic_action_card.svelte';

    let stuff = ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'];
    let { title, actions } = $props()
</script>

<fieldset class="border border-gray-300 rounded-lg p-4">
    <legend class="px-2 text-lg font-medium">{title}</legend>
    <div class="grid grid-cols-3">
        {#each actions as action}
            <div class="col-span-1">
                <ActionCard {action} />
            </div>
        {/each}
    </div>
</fieldset>