<script lang="ts">
    import ActionTodoCard from '$lib/components/action_todo_card.svelte';
    import { TodoCardM } from "$lib/stores/todo_card_manager.svelte";

    let { title, todos } = $props()
    let repeat_val = $state('x1');
</script>

<fieldset class="border border-gray-300 rounded-lg p-4">
    <legend class="px-2 text-lg font-semibold">
        {title}
        <select 
            bind:value={repeat_val} 
            disabled={TodoCardM.active}
            class:cursor-not-allowed={TodoCardM.active}
            class:bg-gray-300={TodoCardM.active}
            class="border border-gray-300 rounded-lg text-center text-sm text-gray-600 w-32 mx-2"
        >
            <option value="x1">Repeat x1</option>
            <option value="x10">Repeat x10</option>
            <option value="x100">Repeat x100</option>
        </select>
    </legend>
    <div class="grid grid-cols-3">
        {#each todos as todo}
            <div class="col-span-1 px-2">
                <ActionTodoCard {todo} {repeat_val} />
            </div>
        {/each}
    </div>
</fieldset>