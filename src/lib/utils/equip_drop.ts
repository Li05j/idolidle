import type { Rarity, EquipDropTable } from '$lib/data/equipment/equipment_definition';
import { EQUIP_CONFIG, RARITY_ORDER } from '$lib/data/equipment/equipment_definition';
import { EquipM } from '$lib/state/equipment.svelte';
import { CFG } from '$lib/config';
import { Dreams } from '$lib/state/dreams.svelte';

function roll_rarity(): Rarity {
    const r = Math.random();
    let cumulative = 0;
    for (const rarity of RARITY_ORDER) {
        cumulative += EQUIP_CONFIG.rarity_weights[rarity];
        if (r < cumulative) return rarity;
    }
    return 'N';
}

export function weighted_pick(table: EquipDropTable['table']): string {
    const total = table.reduce((sum, e) => sum + e.weight, 0);
    let r = Math.random() * total;
    for (const entry of table) {
        r -= entry.weight;
        if (r <= 0) return entry.equip_id;
    }
    return table[table.length - 1].equip_id;
}

export function roll_equip_drop(drops: EquipDropTable | undefined, duration_ms: number): void {
    if (!drops) return;

    const base = drops.chance * CFG.equip_drop_mult * Dreams.equip_drop_mult;
    let effective: number;
    if (drops.chance >= 1) {
        effective = base;
    } else {
        const d = duration_ms / 1000;
        const P = CFG.equip_drop_pivot_seconds;
        const K = CFG.equip_drop_above_exp;
        const ratio = d / P;
        const factor = ratio <= 1 ? ratio : ratio ** K;
        effective = base * factor;
    }

    if (Math.random() >= Math.min(effective, 1)) return;

    const equip_id = weighted_pick(drops.table);
    const rarity = roll_rarity();
    EquipM.receive_equipment(equip_id, rarity);
}
