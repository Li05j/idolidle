<script lang="ts">
    import { LiveInfo } from "$lib/runtime/live_rival_info.svelte";
    import { DEV } from "$lib/config";
    import { EQUIP_CONFIG } from "$lib/data/equipment/equipment_definition";
</script>

<div class="w-full p-6 flex flex-col gap-3">
    <h3 class="text-xl font-bold text-center text-[var(--text-primary)]">{LiveInfo.persona_name}</h3>

    <div class="flex gap-3 items-start">
        <!-- Stats Comparison -->
        <div class="flex-1 rounded-xl bg-[var(--surface-inset)] p-5">
            <div class="grid items-center justify-center gap-x-3 gap-y-2 max-w-[28rem] mx-auto" style="grid-template-columns: {DEV ? '1fr auto auto auto 1fr' : 'auto auto auto'}">
                <div class="text-sm font-semibold text-[var(--text-muted)] text-right">You</div>
                <div></div>
                <div></div>
                {#if DEV}
                    <div></div>
                    <div class="text-sm font-semibold text-[var(--text-muted)] text-left">Rival</div>
                {/if}
                {#each LiveInfo.comparisons as comp}
                    <div class="text-base text-[var(--text-primary)] text-right tabular-nums">{comp.playerValue}</div>
                    <div class="text-sm text-[var(--text-muted)] text-center">{comp.label}</div>
                    <div class="flex justify-center"><div class="w-8 h-6 rounded-md" style={comp.color}></div></div>
                    {#if DEV}
                        <div class="text-sm text-[var(--text-muted)] text-center">{comp.rivalLabel}</div>
                        <div class="text-base text-[var(--text-primary)] text-left tabular-nums">{comp.rivalValue}</div>
                    {/if}
                {/each}
            </div>
        </div>

        <!-- Rival Equipment -->
        <div class="flex-1 rounded-xl bg-[var(--surface-inset)] p-5">
            <div class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2">Rival Equipment</div>
            {#if LiveInfo.rival_equipment.length === 0}
                <div class="text-sm text-[var(--text-muted)] italic">No equipment.</div>
            {:else}
                <div class="flex flex-col gap-1.5">
                    {#each LiveInfo.rival_equipment as { idx, entry, def, skill_name }}
                        {@const color = EQUIP_CONFIG.rarity_color[entry.rarity]}
                        {@const is_selected = LiveInfo.selected_equip_idx === idx}
                        <button
                            class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface-base)] cursor-pointer transition-all text-left w-full
                                {is_selected ? 'ring-2 ring-[var(--progress-from)]' : 'hover:brightness-95'}"
                            onclick={() => LiveInfo.select_equip(idx)}
                        >
                            <span class="text-xs font-semibold shrink-0" style="color: {color};">[{entry.rarity}]</span>
                            <span class="text-sm font-semibold text-[var(--text-primary)] truncate">{def.name}</span>
                            <span class="text-xs text-[var(--text-muted)]">Lv.{entry.level}</span>
                            <span class="text-xs text-[var(--text-muted)] opacity-60">{def.slot}</span>
                            {#if skill_name}
                                <span class="text-xs text-blue-400 truncate">{skill_name}</span>
                            {/if}
                        </button>
                    {/each}
                </div>
            {/if}
        </div>
    </div>

    <!-- Legend + Condition -->
    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 px-2">
        <div class="flex items-center gap-1.5">
            <div class="w-6 h-4 rounded-md" style="background-color: hsl(120, 100%, 50%)"></div>
            <span class="text-sm text-[var(--text-muted)]">- you have enough of this stat.</span>
        </div>
        <div class="flex items-center gap-1.5">
            <div class="w-6 h-4 rounded-md" style="background-color: hsl(0, 100%, 50%)"></div>
            <span class="text-sm text-[var(--text-muted)]">- you need more training on this stat.</span>
        </div>
    </div>
    <div class="flex py-4 justify-center items-center">
        <h1 class="text-xl font-bold text-[var(--text-primary)]">{LiveInfo.condition_text}</h1>
    </div>

    <!-- Equip Detail Panel -->
    {#if LiveInfo.selected_equip_detail}
        {@const detail = LiveInfo.selected_equip_detail}
        {@const color = EQUIP_CONFIG.rarity_color[detail.entry.rarity]}
        <div class="rounded-xl bg-[var(--surface-inset)] p-4 flex flex-col gap-3">
            <div class="flex items-center gap-3 flex-wrap">
                <span class="text-base font-bold" style="color: {color};">{detail.def.name}</span>
                <span class="text-xs font-semibold px-1.5 py-0.5 rounded" style="color: {color}; border: 1px solid {color};">{detail.entry.rarity}</span>
                <span class="text-xs text-[var(--text-muted)] px-1.5 py-0.5 rounded bg-[var(--surface-base)]">{detail.def.slot}</span>
                <span class="text-sm text-[var(--text-primary)] font-semibold">Lv.{detail.entry.level}</span>
            </div>

            {#if detail.def.desc}
                <div class="text-sm text-[var(--text-muted)] italic">{detail.def.desc}</div>
            {/if}

            <div class="flex gap-4 flex-wrap">
                {#if detail.effective_bonuses.length > 0}
                    <div class="flex-1 min-w-[180px]">
                        <div class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-1">Stat Bonuses</div>
                        <div class="grid grid-cols-[1fr_auto_auto] gap-x-3 gap-y-0.5 text-sm">
                            {#each detail.effective_bonuses as b}
                                <span class="text-[var(--text-primary)]">{b.stat}</span>
                                <span class="text-[var(--text-primary)] font-semibold">+{b.value.toFixed(2)}</span>
                                <span class="text-xs text-[var(--text-muted)]">({b.target})</span>
                            {/each}
                        </div>
                    </div>
                {/if}

                {#if detail.skill_view}
                    <div class="flex-1 min-w-[220px]">
                        <div class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-1">Battle Skill</div>
                        <div class="rounded-lg bg-[var(--surface-base)] p-2.5">
                            <div class="font-semibold text-sm text-blue-400">{detail.skill_view.skill.name}</div>
                            <div class="text-xs text-[var(--text-muted)] mt-1">
                                Trigger: {detail.skill_view.triggers} &middot; {detail.skill_view.chance * 100}%
                            </div>
                            <div class="text-xs text-[var(--text-muted)]">If: {detail.skill_view.cond_string}</div>
                            <div class="text-xs text-[var(--text-primary)] mt-0.5">{detail.skill_view.eff_string}</div>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>
