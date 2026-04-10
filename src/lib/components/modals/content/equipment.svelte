<script lang="ts">
    import { EquipM } from "$lib/state/equipment.svelte";
    import { EQUIP_REGISTRY } from "$lib/data/equipment";
    import { EQUIP_CONFIG } from "$lib/data/equipment/equipment_definition";
</script>

<div class="h-[70vh] rounded-xl bg-[var(--surface-inset)] overflow-auto p-4">
    {#if EquipM.inventory.size === 0}
        <div class="font-semibold text-base text-[var(--text-muted)]">
            No equipment yet. Keep doing actions to find some!
        </div>
    {:else}
        <div class="grid grid-cols-1 gap-2">
            {#each EquipM.inventory as [id, item]}
                {@const def = EQUIP_REGISTRY.get(id)}
                {#if def}
                    {@const color = EQUIP_CONFIG.rarity_color[item.rarity]}
                    <div class="flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--surface-base)]">
                        <span class="font-semibold text-sm" style="color: {color};">[{item.rarity}]</span>
                        <span class="font-semibold text-sm text-[var(--text-primary)]">{def.name}</span>
                        <span class="text-xs text-[var(--text-muted)]">Lv.{item.level}</span>
                        <span class="text-xs text-[var(--text-muted)]">{def.slot}</span>
                        {#if def.skill}
                            <span class="text-xs text-blue-400">{def.skill.name}</span>
                        {/if}
                    </div>
                {/if}
            {/each}
        </div>
    {/if}
</div>
