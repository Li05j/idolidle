<script lang="ts">
    import { TD_List_Tracker } from "$lib/stores/todos_list_tracker.svelte";
    import ActionCollection from '$lib/components/misc/action_collection.svelte';
</script>

<h1 class="text-lg font-bold mb-4 justify-center text-center">Actions</h1>
<hr class="h-1 bg-black border-0 opacity-15 mb-4" />

<div class="overflow-y-auto p-4 h-full">
    {#each [...TD_List_Tracker.actions] as action}
        <div class="pb-4">
            <ActionCollection title={action[0]} todos={action[1]} />
        </div>
    {/each}
</div>