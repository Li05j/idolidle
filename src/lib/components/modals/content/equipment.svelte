<script lang="ts">
    import { EQUIP_CONFIG } from '$lib/data/equipment/equipment_definition';
    import { EquipmentPanelVM, type CodexEntry } from './equipment_panel.svelte';
    import GenericButton from '$lib/components/shared/generic_button.svelte';

    const vm = new EquipmentPanelVM();
</script>

<div class="flex flex-col h-[70vh] gap-2">
    <!-- Top: Equipped Slots + Inventory -->
    <div class="flex gap-2 h-[58%] min-h-0">
        <!-- Equipped Slots -->
        <div class="w-1/3 rounded-xl bg-[var(--surface-inset)] p-3 overflow-y-auto">
            <div class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2">Equipped</div>
            <div class="flex flex-col gap-1.5">
                {#each vm.slot_display as { slot, label, item, def }}
                    {@const is_selected = vm.selected_source === 'equipped' && vm.selected_slot === slot}
                    <button
                        class="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--surface-base)] cursor-pointer transition-all text-left w-full
                            {is_selected ? 'ring-2 ring-[var(--progress-from)]' : 'hover:brightness-95'}"
                        onclick={() => vm.select_equipped(slot)}
                    >
                        <span class="text-xs text-[var(--text-muted)] w-10 shrink-0">{label}</span>
                        {#if item && def}
                            {@const color = EQUIP_CONFIG.rarity_color[item.rarity]}
                            <span class="text-xs font-semibold" style="color: {color};">[{item.rarity}]</span>
                            <span class="text-sm font-semibold text-[var(--text-primary)] truncate">{def.name}</span>
                            <span class="text-xs text-[var(--text-muted)] ml-auto shrink-0">Lv.{item.level}</span>
                        {:else}
                            <span class="text-xs text-[var(--text-muted)] italic">Empty</span>
                        {/if}
                    </button>
                {/each}
            </div>
        </div>

        <!-- Inventory / Codex -->
        <div class="w-2/3 rounded-xl bg-[var(--surface-inset)] p-3 flex flex-col min-h-0">
            <!-- Header toolbar -->
            <div class="flex items-center justify-between mb-2 shrink-0">
                <div class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide">
                    {vm.codex_open ? 'Codex' : 'Inventory'}
                </div>
                <div class="flex gap-1.5">
                    {#if vm.codex_open}
                        <GenericButton
                            name={vm.codex_hide_unlocked ? 'Show All' : 'Hide Unlocked'}
                            variant="secondary"
                            class="px-3 py-1 text-xs"
                            onclick={() => vm.toggle_codex_hide_unlocked()}
                        />
                    {:else}
                        <GenericButton
                            name="Filter"
                            variant="secondary"
                            class="px-3 py-1 text-xs"
                            disabled={true}
                            onclick={() => {}}
                        />
                    {/if}
                    <GenericButton
                        name="Codex"
                        variant={vm.codex_open ? 'primary' : 'secondary'}
                        class="px-3 py-1 text-xs"
                        onclick={() => vm.toggle_codex()}
                    />
                </div>
            </div>

            <!-- List content -->
            <div class="overflow-y-auto flex-1 min-h-0 p-0.5">
                {#if vm.codex_open}
                    <!-- Codex View -->
                    {#if vm.codex_list.length === 0}
                        <div class="text-sm text-[var(--text-muted)]">No items to show.</div>
                    {:else}
                        <div class="grid grid-cols-3 gap-1.5">
                            {#each vm.codex_list as entry}
                                {@const is_selected = vm.selected_item_id === entry.def.id && vm.selected_source === 'codex'}
                                <button
                                    class="flex flex-col items-center justify-center px-2 py-2 rounded-lg bg-[var(--surface-base)] transition-all text-center
                                        {is_selected ? 'ring-2 ring-[var(--progress-from)]' : 'hover:brightness-95'}
                                        {entry.status === 'previous' ? 'opacity-40 grayscale' : ''}
                                        {entry.status === 'unknown' ? 'cursor-default' : 'cursor-pointer'}"
                                    onclick={() => vm.select_codex(entry.def.id)}
                                    disabled={entry.status === 'unknown'}
                                >
                                    {#if entry.status === 'unknown'}
                                        <span class="text-sm text-[var(--text-muted)]">???</span>
                                    {:else}
                                        <span class="text-xs font-semibold text-[var(--text-primary)] truncate w-full">{entry.def.name}</span>
                                        <span class="text-[10px] text-[var(--text-muted)] opacity-60">{entry.def.slot}</span>
                                    {/if}
                                </button>
                            {/each}
                        </div>
                    {/if}
                {:else}
                    <!-- Inventory View -->
                    {#if vm.inventory_list.length === 0}
                        <div class="text-sm text-[var(--text-muted)]">
                            No equipment yet. Keep doing actions to find some!
                        </div>
                    {:else}
                        <div class="flex flex-col gap-1">
                            {#each vm.inventory_list as { id, item, def }}
                                {@const color = EQUIP_CONFIG.rarity_color[item.rarity]}
                                {@const is_selected = vm.selected_item_id === id && vm.selected_source === 'inventory'}
                                {@const equipped = vm.is_item_equipped(id)}
                                <button
                                    class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface-base)] cursor-pointer transition-all text-left w-full
                                        {is_selected ? 'ring-2 ring-[var(--progress-from)]' : 'hover:brightness-95'}"
                                    onclick={() => vm.select_inventory(id)}
                                >
                                    <span class="text-xs font-semibold shrink-0" style="color: {color};">[{item.rarity}]</span>
                                    <span class="text-sm font-semibold text-[var(--text-primary)] truncate">{def.name}</span>
                                    <span class="text-xs text-[var(--text-muted)]">Lv.{item.level}</span>
                                    <span class="text-xs text-[var(--text-muted)] opacity-60">{def.slot}</span>
                                    {#if def.skill}
                                        <span class="text-xs text-blue-400 truncate">{def.skill.name}</span>
                                    {/if}
                                    {#if equipped}
                                        <span class="text-xs text-[var(--progress-from)] font-bold ml-auto shrink-0">E</span>
                                    {/if}
                                </button>
                            {/each}
                        </div>
                    {/if}
                {/if}
            </div>
        </div>
    </div>

    <!-- Bottom: Detail Panel -->
    <div class="flex-1 min-h-0 rounded-xl bg-[var(--surface-inset)] p-4 overflow-y-auto">
        {#if vm.selected_source === 'codex' && vm.selected_codex_entry}
            <!-- Codex Detail View -->
            {@const entry = vm.selected_codex_entry}
            {@const def = entry.def}

            <div class="flex flex-col gap-3">
                <div class="flex items-center gap-3">
                    <span class="text-base font-bold text-[var(--text-primary)]">{def.name}</span>
                    <span class="text-xs text-[var(--text-muted)] px-1.5 py-0.5 rounded bg-[var(--surface-base)]">{def.slot}</span>
                    <span class="text-xs text-[var(--text-muted)]">Drops at: {entry.drop_location}</span>
                </div>

                {#if def.desc}
                    <div class="text-sm text-[var(--text-muted)] italic">{def.desc}</div>
                {/if}

                <div class="flex gap-4">
                    {#if def.stat_bonuses.length > 0}
                        <div class="flex-1">
                            <div class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-1">Base Stats</div>
                            <div class="grid grid-cols-[1fr_auto_auto] gap-x-3 gap-y-0.5 text-sm">
                                {#each def.stat_bonuses as b}
                                    <span class="text-[var(--text-primary)]">{b.stat}</span>
                                    <span class="text-[var(--text-primary)] font-semibold">+{b.base_value.toFixed(2)}</span>
                                    <span class="text-xs text-[var(--text-muted)]">({b.target})</span>
                                {/each}
                            </div>
                        </div>
                    {/if}

                    {#if def.skill && vm.selected_skill_strings}
                        <div class="flex-1">
                            <div class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-1">Battle Skill</div>
                            <div class="rounded-lg bg-[var(--surface-base)] p-2.5">
                                <div class="font-semibold text-sm text-blue-400">{def.skill.name}</div>
                                <div class="text-xs text-[var(--text-muted)] mt-1">
                                    Trigger: {def.skill.triggers.join(', ')} &middot; {def.skill.chance * 100}%
                                </div>
                                <div class="text-xs text-[var(--text-muted)]">If: {vm.selected_skill_strings.cond_string}</div>
                                <div class="text-xs text-[var(--text-primary)] mt-0.5">{vm.selected_skill_strings.eff_string}</div>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        {:else if vm.selected_item && vm.selected_def}
            <!-- Item Detail View -->
            {@const item = vm.selected_item}
            {@const def = vm.selected_def}
            {@const color = EQUIP_CONFIG.rarity_color[item.rarity]}
            {@const exp = vm.selected_exp_progress}

            <div class="flex flex-col gap-3">
                <!-- Header -->
                <div class="flex items-center gap-3">
                    <span class="text-base font-bold" style="color: {color};">{def.name}</span>
                    <span class="text-xs font-semibold px-1.5 py-0.5 rounded" style="color: {color}; border: 1px solid {color};">{item.rarity}</span>
                    <span class="text-xs text-[var(--text-muted)] px-1.5 py-0.5 rounded bg-[var(--surface-base)]">{def.slot}</span>
                    <span class="text-sm text-[var(--text-primary)] font-semibold">Lv.{item.level}</span>

                    <!-- Action Button -->
                    <div class="ml-auto">
                        {#if vm.selected_is_equipped}
                            <GenericButton name="Unequip" variant="secondary" class="px-4 py-1.5 text-xs" onclick={() => vm.do_unequip()} />
                        {:else}
                            <GenericButton name="Equip" variant="primary" class="px-4 py-1.5 text-xs" onclick={() => vm.do_equip()} />
                        {/if}
                    </div>
                </div>

                <!-- EXP Bar -->
                {#if exp}
                    <div class="h-2 rounded-full bg-[var(--surface-base)] overflow-hidden">
                        <div
                            class="h-full rounded-full transition-all"
                            style="width: {exp.percent}%; background: linear-gradient(to right, var(--progress-from), var(--progress-to));"
                        ></div>
                    </div>
                {/if}

                <!-- EXP / Max Level + Description inline -->
                {#if exp || item.level >= 20 || def.desc}
                    <div class="flex flex-wrap items-baseline gap-x-3 text-sm">
                        {#if exp}
                            <span class="text-xs text-[var(--text-muted)] shrink-0">{exp.current} / {exp.needed} EXP</span>
                        {:else if item.level >= 20}
                            <span class="text-xs font-bold text-[var(--progress-from)] shrink-0">MAX LEVEL</span>
                        {/if}
                        {#if def.desc}
                            <span class="text-[var(--text-muted)] italic">{def.desc}</span>
                        {/if}
                    </div>
                {/if}

                <!-- Stats + Skill side by side -->
                <div class="flex gap-4">
                    <!-- Stat Bonuses -->
                    {#if vm.selected_effective_bonuses.length > 0}
                        <div class="flex-1">
                            <div class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-1">Stat Bonuses</div>
                            <div class="grid grid-cols-[1fr_auto_auto] gap-x-3 gap-y-0.5 text-sm">
                                {#each vm.selected_effective_bonuses as b}
                                    <span class="text-[var(--text-primary)]">{b.stat}</span>
                                    <span class="text-[var(--text-primary)] font-semibold">+{b.value.toFixed(2)}</span>
                                    <span class="text-xs text-[var(--text-muted)]">({b.target})</span>
                                {/each}
                            </div>
                        </div>
                    {/if}

                    <!-- Skill -->
                    {#if def.skill && vm.selected_skill_strings}
                        <div class="flex-1">
                            <div class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-1">Battle Skill</div>
                            <div class="rounded-lg bg-[var(--surface-base)] p-2.5">
                                <div class="font-semibold text-sm text-blue-400">{def.skill.name}</div>
                                <div class="text-xs text-[var(--text-muted)] mt-1">
                                    Trigger: {def.skill.triggers.join(', ')} &middot; {def.skill.chance * 100}%
                                </div>
                                <div class="text-xs text-[var(--text-muted)]">If: {vm.selected_skill_strings.cond_string}</div>
                                <div class="text-xs text-[var(--text-primary)] mt-0.5">{vm.selected_skill_strings.eff_string}</div>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        {:else}
            <!-- Equipped Overview -->
            {@const summary = vm.equipped_summary_stats}
            {@const skills = vm.equipped_skills}

            {#if summary.size === 0 && skills.length === 0}
                <div class="text-sm text-[var(--text-muted)]">Equip items to see combined bonuses here.</div>
            {:else}
                <div class="flex gap-6">
                    <!-- Stat Totals -->
                    {#if summary.size > 0}
                        <div class="flex-1">
                            <div class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2">Total Equipment Bonuses</div>
                            <div class="grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-1 text-sm">
                                <span class="font-bold text-xs text-[var(--text-muted)]">Stat</span>
                                <span class="font-bold text-xs text-[var(--text-muted)]">Base+</span>
                                <span class="font-bold text-xs text-[var(--text-muted)]">Multi+</span>
                                {#each [...summary] as [stat, vals]}
                                    <span class="text-[var(--text-primary)]">{stat}</span>
                                    <span class="text-[var(--text-primary)]">{vals.base > 0 ? `+${vals.base.toFixed(2)}` : '-'}</span>
                                    <span class="text-[var(--text-primary)]">{vals.multi > 0 ? `+${vals.multi.toFixed(2)}` : '-'}</span>
                                {/each}
                            </div>
                        </div>
                    {/if}

                    <!-- Equipped Skills -->
                    {#if skills.length > 0}
                        <div class="flex-1">
                            <div class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2">Active Skills</div>
                            <div class="flex flex-col gap-2">
                                {#each skills as sk}
                                    <div class="rounded-lg bg-[var(--surface-base)] p-2.5">
                                        <div class="flex items-center gap-2">
                                            <span class="font-semibold text-sm text-blue-400">{sk.skill_name}</span>
                                            <span class="text-xs text-[var(--text-muted)]">({sk.item_name})</span>
                                        </div>
                                        <div class="text-xs text-[var(--text-muted)] mt-0.5">
                                            Trigger: {sk.triggers} &middot; {sk.chance * 100}%,
                                            If: {sk.cond_string}
                                        </div>
                                        <div class="text-xs text-[var(--text-primary)]">{sk.eff_string}</div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/if}
                </div>
            {/if}
        {/if}
    </div>
</div>
