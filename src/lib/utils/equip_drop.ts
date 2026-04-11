import type { Rarity, EquipDropTable } from '$lib/data/equipment/equipment_definition';
import { EQUIP_CONFIG, RARITY_ORDER } from '$lib/data/equipment/equipment_definition';
import { EquipM } from '$lib/state/equipment.svelte';
import { CFG } from '$lib/config';

function roll_rarity(): Rarity {
    const r = Math.random();
    let cumulative = 0;
    for (const rarity of RARITY_ORDER) {
        cumulative += EQUIP_CONFIG.rarity_weights[rarity];
        if (r < cumulative) return rarity;
    }
    return 'N';
}

function weighted_pick(table: EquipDropTable['table']): string {
    const total = table.reduce((sum, e) => sum + e.weight, 0);
    let r = Math.random() * total;
    for (const entry of table) {
        r -= entry.weight;
        if (r <= 0) return entry.equip_id;
    }
    return table[table.length - 1].equip_id;
}

export function roll_equip_drop(drops?: EquipDropTable): void {
    if (!drops) return;
    if (Math.random() >= drops.chance * CFG.equip_drop_mult) return;

    const equip_id = weighted_pick(drops.table);
    const rarity = roll_rarity();
    EquipM.receive_equipment(equip_id, rarity);
}
