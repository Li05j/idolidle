<script lang="ts">
    import { LiveInfo } from "$lib/runtime/live_rival_info.svelte";
    import { DEV } from "$lib/config";
    import { EQUIP_CONFIG } from "$lib/data/equipment/equipment_definition";
    import { CPs } from "$lib/state/checkpoints.svelte";
</script>

{#if CPs.is_terminal}
    <div class="w-full h-full p-6 flex items-center justify-center text-center text-[var(--text-muted)] italic">
        You're already the top idol — no more rivals to face.
    </div>
{:else}
<div class="w-full h-full p-6 flex flex-col gap-4 min-h-0">
    <!-- Header: persona name + condition pill -->
    <div class="flex items-center justify-between gap-4 shrink-0">
        <h3 class="text-xl font-bold text-[var(--text-primary)] truncate flex items-baseline gap-2 min-w-0">
            <span class="truncate">{LiveInfo.persona_name}</span>
            {#if LiveInfo.persona_desc}
                <span class="text-xs font-normal italic text-[var(--text-muted)] opacity-70 truncate">{LiveInfo.persona_desc}</span>
            {/if}
        </h3>
        <div
            class="px-3 py-1 rounded-full text-sm font-semibold text-[var(--text-primary)] shrink-0 bg-[var(--surface-inset)]"
            style="border: 1px solid hsl({LiveInfo.avg_clamped * 120}, 70%, 50%); box-shadow: inset 0 0 0 9999px hsla({LiveInfo.avg_clamped * 120}, 70%, 50%, 0.15);"
        >
            {LiveInfo.condition_text}
        </div>
    </div>

    <!-- Body: three panes -->
    <div class="flex-1 grid grid-cols-3 gap-3 min-h-0">
        <!-- Stats vs Rival -->
        <div class="rounded-xl bg-[var(--surface-inset)] p-4 flex flex-col gap-2 min-h-0">
            <div class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide">Stats vs Rival</div>
            <div class="grid items-center gap-x-3 gap-y-1.5" style="grid-template-columns: auto 1fr auto {DEV ? 'auto' : ''}">
                {#each LiveInfo.comparisons as comp}
                    <div class="text-sm text-[var(--text-muted)]">{comp.label}</div>
                    <div class="text-sm text-[var(--text-primary)] tabular-nums text-right">{comp.playerValue}</div>
                    <div class="w-12 h-4 rounded-md justify-self-end" style={comp.color}></div>
                    {#if DEV}
                        <div class="text-xs text-[var(--text-muted)] tabular-nums">rival: {comp.rivalValue} ({comp.rivalLabel})</div>
                    {/if}
                {/each}
            </div>
        </div>

        <!-- Rival Loadout: 6 slot cards -->
        <div class="rounded-xl bg-[var(--surface-inset)] p-4 flex flex-col gap-2 min-h-0">
            <div class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide">Rival Loadout</div>
            <div class="flex flex-col gap-1.5">
                {#each LiveInfo.rival_equipment as slot}
                    {#if slot.filled}
                        {@const color = EQUIP_CONFIG.rarity_color[slot.entry.rarity]}
                        {@const is_selected = LiveInfo.selected_equip_idx === slot.idx}
                        <button
                            class="flex flex-col gap-0.5 px-3 py-2 rounded-lg bg-[var(--surface-base)] cursor-pointer transition-all text-left w-full
                                {is_selected ? 'ring-2 ring-[var(--progress-from)]' : 'hover:brightness-110'}"
                            onclick={() => LiveInfo.select_equip(slot.idx)}
                        >
                            <div class="flex items-center gap-2 text-xs">
                                <span class="text-[var(--text-muted)] uppercase tracking-wide">{slot.slot_label}</span>
                                <span class="font-bold" style="color: {color};">{slot.entry.rarity}</span>
                                <span class="ml-auto text-[var(--text-muted)] tabular-nums">Lv.{slot.entry.level}</span>
                            </div>
                            <div class="flex items-baseline gap-2 min-w-0">
                                <span class="text-sm font-semibold text-[var(--text-primary)] truncate">{slot.def.name}</span>
                                {#if slot.skill_name}
                                    <span class="text-xs text-blue-400 truncate">{slot.skill_name}</span>
                                {/if}
                            </div>
                        </button>
                    {:else}
                        <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--surface-base)]/40 border border-dashed border-[var(--surface-base)] text-xs">
                            <span class="text-[var(--text-muted)] uppercase tracking-wide">{slot.slot_label}</span>
                            <span class="ml-auto text-[var(--text-muted)] opacity-50">—</span>
                        </div>
                    {/if}
                {/each}
            </div>
            {#if DEV}
                <div class="mt-auto pt-2 text-xs text-[var(--text-muted)] tabular-nums border-t border-[var(--surface-base)]">
                    Budget: {LiveInfo.budget_info.used.toFixed(2)} / {LiveInfo.budget_info.cap.toFixed(2)} (base {LiveInfo.budget_info.total.toFixed(2)})
                </div>
            {/if}
        </div>

        <!-- Equip Detail: always mounted -->
        <div class="rounded-xl bg-[var(--surface-inset)] p-4 flex flex-col gap-3 min-h-0">
            <div class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide">Equip Detail</div>
            {#if LiveInfo.selected_equip_detail}
                {@const detail = LiveInfo.selected_equip_detail}
                {@const color = EQUIP_CONFIG.rarity_color[detail.entry.rarity]}
                <div class="flex items-center gap-2 min-w-0">
                    <span class="text-base font-bold truncate" style="color: {color};">{detail.def.name}</span>
                    <span class="text-xs font-semibold px-1.5 py-0.5 rounded shrink-0" style="color: {color}; border: 1px solid {color};">{detail.entry.rarity}</span>
                    <span class="text-xs text-[var(--text-muted)] px-1.5 py-0.5 rounded bg-[var(--surface-base)] shrink-0">{detail.def.slot}</span>
                    <span class="text-sm text-[var(--text-primary)] font-semibold shrink-0">Lv.{detail.entry.level}</span>
                    {#if DEV}
                        <span class="text-xs text-[var(--text-muted)] tabular-nums shrink-0 ml-auto">cost: {detail.budget_cost.toFixed(2)}</span>
                    {/if}
                </div>

                {#if detail.def.desc}
                    <div class="text-sm text-[var(--text-muted)] italic">{detail.def.desc}</div>
                {/if}

                {#if detail.effective_bonuses.length > 0}
                    <div>
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
                    <div>
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
            {:else}
                <div class="flex-1 flex items-center justify-center rounded-lg border border-dashed border-[var(--surface-base)] text-sm text-[var(--text-muted)] italic text-center px-4">
                    Select an equipment to inspect.
                </div>
            {/if}
        </div>
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 px-2 shrink-0 text-xs text-[var(--text-muted)]">
        <div class="flex items-center gap-1.5">
            <div class="w-5 h-3 rounded-sm" style="background-color: hsl(120, 100%, 50%)"></div>
            <span>you have enough of this stat</span>
        </div>
        <div class="flex items-center gap-1.5">
            <div class="w-5 h-3 rounded-sm" style="background-color: hsl(0, 100%, 50%)"></div>
            <span>you need more training on this stat</span>
        </div>
    </div>
</div>
{/if}
