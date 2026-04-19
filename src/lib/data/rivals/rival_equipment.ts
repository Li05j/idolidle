import type { LiveBattleStats } from '$lib/types';
import {
    EQUIP_CONFIG,
    RARITY_ORDER,
    effective_bonus,
    resolve_equip,
    type EquipSlot,
    type Rarity,
    type RivalEquipEntry,
} from '$lib/data/equipment/equipment_definition';
import { ALL_EQUIPMENT } from '$lib/data/equipment/equipment_table';

export const RIVAL_EQUIP_BUDGET = [3, 9, 27];

const SLOT_CAPS: Record<EquipSlot, number> = {
    hat: 1, top: 1, bottom: 1, shoes: 1, accessory: 2,
};

const COST_LEVEL_STEP = 0.25;

function equip_cost(rarity: Rarity, level: number): number {
    return EQUIP_CONFIG.dupe_exp[rarity] * (1 + COST_LEVEL_STEP * (level - 1));
}

type Candidate = {
    equip_id: string;
    slot: EquipSlot;
    rarity: Rarity;
    level: number;
    cost: number;
    value: number;
};

function build_candidates(budget: number): Candidate[] {
    const candidates: Candidate[] = [];

    for (const def of ALL_EQUIPMENT) {
        for (const rarity of RARITY_ORDER) {
            for (let level = 1; level <= EQUIP_CONFIG.level_cap; level++) {
                const cost = equip_cost(rarity, level);
                if (cost > budget) continue;

                const resolved = resolve_equip(def, rarity);
                let value = 0;
                for (const bonus of resolved.stat_bonuses) {
                    if (bonus.stat === 'Moni') continue;
                    value += Math.abs(effective_bonus(bonus, level, resolved.stat_mult));
                }
                if (resolved.skill) value += 5;

                candidates.push({ equip_id: def.id, slot: def.slot, rarity, level, cost, value });
            }
        }
    }

    // Sort by value/cost ratio descending
    candidates.sort((a, b) => (b.value / b.cost) - (a.value / a.cost));
    return candidates;
}

export function generate_rival_loadout(budget: number): RivalEquipEntry[] {
    if (budget <= 0) return [];

    // Apply ±15% jitter
    const jittered = budget * (0.85 + Math.random() * 0.3);
    let remaining = jittered;

    const candidates = build_candidates(budget);
    const loadout: RivalEquipEntry[] = [];
    const used_ids = new Set<string>();
    const slot_usage: Record<EquipSlot, number> = { hat: 0, top: 0, bottom: 0, shoes: 0, accessory: 0 };

    for (const c of candidates) {
        if (c.cost > remaining) continue;
        if (used_ids.has(c.equip_id)) continue;
        if (slot_usage[c.slot] >= SLOT_CAPS[c.slot]) continue;

        loadout.push({ equip_id: c.equip_id, rarity: c.rarity, level: c.level });
        used_ids.add(c.equip_id);
        slot_usage[c.slot]++;
        remaining -= c.cost;
    }

    return loadout;
}

const LIVE_STAT_MAP: Record<string, (keyof LiveBattleStats)[]> = {
    Fans: ['Fans'],
    Stamina: ['Max_Stamina', 'Curr_Stamina'],
    Haste: ['Haste'],
    Sing: ['Sing'],
    Dance: ['Dance'],
    Charm: ['Charm'],
    Presence: ['Presence'],
};

export function apply_rival_equipment(stats: LiveBattleStats, loadout: RivalEquipEntry[]): void {
    // Accumulate base and multi contributions
    const base_adds: Partial<Record<keyof LiveBattleStats, number>> = {};
    const multi_adds: Partial<Record<keyof LiveBattleStats, number>> = {};

    for (const entry of loadout) {
        const def = ALL_EQUIPMENT.find(e => e.id === entry.equip_id);
        if (!def) continue;

        const resolved = resolve_equip(def, entry.rarity);

        for (const bonus of resolved.stat_bonuses) {
            const keys = LIVE_STAT_MAP[bonus.stat];
            if (!keys) continue;

            const val = effective_bonus(bonus, entry.level, resolved.stat_mult);

            for (const key of keys) {
                if (bonus.target === 'base') {
                    base_adds[key] = (base_adds[key] ?? 0) + val;
                } else {
                    multi_adds[key] = (multi_adds[key] ?? 0) + val;
                }
            }
        }
    }

    // Apply base additions
    for (const [key, val] of Object.entries(base_adds)) {
        (stats as Record<string, number>)[key] += val;
    }

    // Apply multi bonuses
    for (const [key, val] of Object.entries(multi_adds)) {
        (stats as Record<string, number>)[key] *= (1 + val);
    }
}
