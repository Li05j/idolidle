<script lang="ts">
    import { TD_List_Tracker } from "$lib/state/todos_list_tracker.svelte";
    import TodoCard from '$lib/components/todo_cards/todo_card.svelte';
</script>

<h1 class="text-base font-bold mb-2 text-center text-[var(--text-primary)]">Locations</h1>
<div class="h-px bg-gradient-to-r from-transparent via-[var(--progress-from)] to-transparent mb-3"></div>

<div class="overflow-y-auto p-3 h-full">
    {#each TD_List_Tracker.locations as locName (locName)}
        <TodoCard locationName={locName} />
    {/each}
</div>