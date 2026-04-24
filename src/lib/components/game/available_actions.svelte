<script lang="ts">
    import { available_actions_vm } from "./available_actions.svelte.ts";
    import ActionCollection from '$lib/components/shared/action_collection.svelte';
</script>

<h1 class="text-base font-bold mb-2 text-center text-[var(--text-primary)]">Actions</h1>
<div class="h-px bg-gradient-to-r from-transparent via-[var(--progress-to)] to-transparent mb-3"></div>

<div class="overflow-y-auto h-full pb-16">
    {#each available_actions_vm.entries as [locName, entries] (locName)}
        <div class="pb-3">
            <ActionCollection title={locName} actionNames={entries.map(e => e.name)} />
        </div>
    {/each}
</div>