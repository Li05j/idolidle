<script lang="ts">
    import TodoCard from '$lib/components/todo_cards/todo_card.svelte';
    import { TodoCardM } from "$lib/runtime/todo_card_manager.svelte";

    let { title, actionNames }: { title: string, actionNames: string[] } = $props();
    let repeat_val = $state('x1');
    let is_collapse = $state(false);

    function toggle_collapse() {
        is_collapse = !is_collapse;
    }
</script>

<fieldset class="border border-[var(--card-border-inactive)] rounded-xl p-4 bg-[var(--surface-card)]/50">
    <legend class="px-3 py-1 text-sm font-bold text-[var(--text-primary)] bg-[var(--surface-base)] rounded-full border border-[var(--card-border-inactive)]">
        <button onclick={toggle_collapse} class="appearance-none bg-transparent border-none p-0 m-0 text-inherit font-inherit cursor-pointer">
            {title}
        </button>
        <select 
            bind:value={repeat_val} 
            disabled={TodoCardM.is_active}
            class="border border-[var(--card-border-inactive)] rounded-full text-center text-xs text-[var(--text-muted)] w-28 mx-2 py-0.5 bg-[var(--surface-base)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
            <option value="x1">Repeat x1</option>
            <option value="x5">Repeat x5</option>
            <option value="x20">Repeat x20</option>
            <option value="x100">Repeat x100</option>
        </select>
    </legend>
    <div class="grid grid-cols-3">
        {#each actionNames as actName (actName)}
            <div class="col-span-1 px-2">
                <TodoCard locationName={title} actionName={actName} {repeat_val} {is_collapse} />
            </div>
        {/each}
    </div>
</fieldset>