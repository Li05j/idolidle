<script lang="ts">
    import { TD_List_Tracker } from "$lib/stores/todos_list_tracker.svelte";
    import TodoCard from '$lib/components/generic_todo_card.svelte';
</script>

<h1 class="text-lg font-bold mb-4 justify-center text-center">Locations</h1>
<hr class="h-1 bg-black border-0 opacity-15 mb-4" />

<div class="overflow-y-auto p-4 h-full">
    {#each TD_List_Tracker.locations as todo}
        <TodoCard {todo} />
    {/each}
</div>