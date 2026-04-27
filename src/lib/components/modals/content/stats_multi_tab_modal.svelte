<script lang="ts">
    import DetailedStats from "./detailed_stats.svelte";
    import Equipment from "./equipment.svelte";
    import DreamUpgrades from "./dream_upgrades.svelte";
    import { StatsMultiTabModalVM } from "./stats_multi_tab_modal.svelte.ts";

    const vm = new StatsMultiTabModalVM();
</script>

<div class="grid grid-cols-[1fr_9fr] h-full">
    <div class="flex flex-col gap-2 pt-4 pl-2 pr-2 h-full">
        {#each vm.tabs as t}
            <button
                class="px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 origin-right
                    {vm.active === t.id 
                    ? 'text-white shadow-md' 
                    : 'bg-[var(--surface-inset)] text-[var(--text-muted)] hover:bg-[var(--progress-bg)] translate-x-0.5'}"
                style={vm.active === t.id ? 'background: var(--btn-primary);' : ''}
                onclick={() => vm.select_tab(t)}
            >
                {t.label}
            </button>
        {/each}
    </div>

    <div class="flex flex-col p-4 relative">
        <div 
            class="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-[var(--progress-from)] to-transparent opacity-40"
        ></div>
        <div class="ml-6">
            {#if vm.active === 'equipment'}
                <Equipment />
            {:else if vm.active === 'dreams'}
                <DreamUpgrades />
            {:else if vm.active === 'stats'}
                <DetailedStats />
            {/if}
        </div>
    </div>
</div>