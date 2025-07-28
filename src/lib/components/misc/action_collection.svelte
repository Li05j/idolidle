<script lang="ts">
    import ActionTodoCard from '$lib/components/todo_cards/action_todo_card.svelte';
    import { TodoCardM } from "$lib/managers/todo_card_manager.svelte";

    let { title, todos } = $props()
    let repeat_val = $state('x1');
    let is_collapse = $state(false);

    function toggle_collapse() {
        is_collapse = !is_collapse;
    }
</script>

<fieldset class="border border-gray-300 rounded-lg p-4">
    <legend class="px-2 text-lg font-semibold">
        <button onclick={toggle_collapse} class="appearance-none bg-transparent border-none p-0 m-0 text-inherit font-inherit cursor-pointer">
            {title}
        </button>
        <select 
            bind:value={repeat_val} 
            disabled={TodoCardM.is_active}
            class:cursor-not-allowed={TodoCardM.is_active}
            class:bg-gray-300={TodoCardM.is_active}
            class="border border-gray-300 rounded-lg text-center text-sm text-gray-600 w-32 mx-2"
        >
            <option value="x1">Repeat x1</option>
            <option value="x5">Repeat x5</option>
            <option value="x20">Repeat x20</option>
            <option value="x100">Repeat x100</option>
        </select>
    </legend>
    <div class="grid grid-cols-3">
        {#each todos as todo (todo.id)}
            <div class="col-span-1 px-2">
                <ActionTodoCard {todo} {repeat_val} {is_collapse} />
            </div>
        {/each}
    </div>
</fieldset>