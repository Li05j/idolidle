<script lang="ts">
    import TodoCard from '$lib/components/todo_cards/todo_card.svelte';
    import { Progression } from '$lib/runtime/progression_engine.svelte';

    let { title, actionNames }: { title: string, actionNames: string[] } = $props();
    let repeat_val = $state('x1');
    let is_collapse = $state(false);

    let visibleNames = $derived(
        actionNames.filter(n => {
            const def = Progression.resolveAction(title, n);
            return !def?.hidden?.();
        })
    );

    function toggle_collapse() {
        is_collapse = !is_collapse;
    }
</script>

<fieldset class="border border-[var(--card-border-inactive)] rounded-xl p-4 bg-[var(--surface-card)]/50">
    <legend class="text-sm font-bold text-[var(--text-primary)] bg-[var(--surface-base)] rounded-full border border-[var(--card-border-inactive)]">
        <button onclick={toggle_collapse} class="appearance-none bg-transparent border-none m-0 px-3 py-1 inline-flex items-center text-inherit font-inherit cursor-pointer">
            <span>{title}</span>
            <select
                bind:value={repeat_val}
                onclick={(e) => e.stopPropagation()}
                class="border border-[var(--card-border-inactive)] rounded-full text-center text-xs text-[var(--text-muted)] w-28 mx-2 py-0.5 bg-[var(--surface-base)] cursor-pointer"
            >
                <option value="x1">Repeat x1</option>
                <option value="x5">Repeat x5</option>
                <option value="x20">Repeat x20</option>
                <option value="x100">Repeat x100</option>
            </select>
        </button>
    </legend>
    <div class="grid grid-cols-3">
        {#each visibleNames as actName (actName)}
            <div class="col-span-1 px-2">
                <TodoCard locationName={title} actionName={actName} {repeat_val} {is_collapse} />
            </div>
        {/each}
    </div>
</fieldset>