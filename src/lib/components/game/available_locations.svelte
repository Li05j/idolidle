<script lang="ts">
    import { available_locations_vm } from "./available_locations.svelte.ts";
    import TodoCard from '$lib/components/todo_cards/todo_card.svelte';
</script>

<h1 class="text-base font-bold mb-2 text-center text-[var(--text-primary)]">Locations</h1>
<div class="h-px bg-gradient-to-r from-transparent via-[var(--progress-from)] to-transparent mb-3"></div>

<div class="overflow-y-auto p-3 h-full">
    {#each available_locations_vm.entries as entry (entry.name)}
        <TodoCard locationName={entry.name} />
    {/each}
</div>