<script lang="ts">
    import { Rebirth } from "$lib/state/rebirth.svelte";
    import { Dreams } from "$lib/state/dreams.svelte";
    import { ALL_DREAM_UPGRADES } from "$lib/data/dreams";
    import type { DreamUpgradeDef, DreamUpgradeCategory } from "$lib/data/dreams";

    const sections: { category: DreamUpgradeCategory; label: string }[] = [
        { category: 'time_reduction', label: 'Time Reduction' },
        { category: 'stat_base', label: 'Initial Base Stats' },
        { category: 'stat_multi', label: 'Initial Stat Multipliers' },
        { category: 'equip_drop', label: 'Equipment' },
    ];

    function upgrades_for(category: DreamUpgradeCategory): DreamUpgradeDef[] {
        return ALL_DREAM_UPGRADES.filter(u => u.category === category);
    }
</script>

<div class="w-full p-4 overflow-y-auto max-h-[70vh]">
    <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-[var(--text-primary)]">Dream Upgrades</h2>
        <div class="px-3 py-1 rounded-full bg-[var(--surface-inset)] text-sm font-semibold text-[var(--text-primary)]">
            Dream Points (DP): {Rebirth.rebirth_points}
        </div>
    </div>

    {#each sections as section}
        {@const upgrades = upgrades_for(section.category)}
        <div class="mb-4">
            <div class="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">{section.label}</div>
            <div class="rounded-xl bg-[var(--surface-inset)] divide-y divide-[var(--progress-bg)]">
                {#each upgrades as def}
                    {@const lvl = Dreams.level(def.id)}
                    {@const is_maxed = Dreams.maxed(def.id)}
                    {@const cost = Dreams.cost(def.id)}
                    {@const can_buy = Dreams.can_purchase(def.id)}
                    <div class="flex items-center gap-3 px-4 py-2.5">
                        <div class="flex-1 min-w-0">
                            <div class="text-sm font-semibold text-[var(--text-primary)]">{def.name}</div>
                            <div class="text-xs text-[var(--text-muted)] truncate">{def.desc}</div>
                        </div>
                        <div class="text-xs text-[var(--text-muted)] text-right whitespace-nowrap w-14">
                            {Dreams.effect_text(def)}
                        </div>
                        <div class="text-xs font-mono text-[var(--text-muted)] text-right w-12">
                            {lvl}/{def.max_level}
                        </div>
                        <button
                            class="px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 whitespace-nowrap min-w-[4.5rem]
                                {is_maxed
                                    ? 'bg-[var(--btn-disabled)] text-[var(--text-muted)] cursor-default'
                                    : can_buy
                                        ? 'text-white cursor-pointer hover:brightness-110'
                                        : 'bg-[var(--btn-disabled)] text-[var(--text-muted)] cursor-not-allowed'
                                }"
                            style={!is_maxed && can_buy ? 'background: var(--btn-primary);' : ''}
                            disabled={!can_buy}
                            onclick={() => Dreams.purchase(def.id)}
                        >
                            {is_maxed ? 'MAX' : `${cost} DP`}
                        </button>
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</div>
