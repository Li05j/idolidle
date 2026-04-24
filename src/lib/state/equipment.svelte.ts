import { EQUIP_REGISTRY } from '$lib/data/equipment';
import {
    type Rarity,
    type EquipSlot,
    EQUIP_CONFIG,
    RARITY_ORDER,
    rarity_index,
    exp_to_next_level,
    effective_bonus,
    resolve_equip,
} from '$lib/data/equipment/equipment_definition';
import { stat_list } from '$lib/state/stats.svelte';
import { history } from '$lib/state/history.svelte';
import { BASIC_STATS, type BasicStats } from '$lib/types';

export type OwnedEquip = {
    equip_id: string;
    rarity: Rarity;
    level: number;
    exp: number;
};

export type EquipSlotKey = 'hat' | 'top' | 'bottom' | 'shoes' | 'accessory_1' | 'accessory_2';

const SLOT_TO_EQUIP_SLOT: Record<EquipSlotKey, EquipSlot> = {
    hat: 'hat',
    top: 'top',
    bottom: 'bottom',
    shoes: 'shoes',
    accessory_1: 'accessory',
    accessory_2: 'accessory',
};

function empty_slots(): Record<EquipSlotKey, string | null> {
    return { hat: null, top: null, bottom: null, shoes: null, accessory_1: null, accessory_2: null };
}

class EquipmentManager {
    private _inventory: Map<string, OwnedEquip> = $state(new Map());
    private _equipped: Record<EquipSlotKey, string | null> = $state(empty_slots());
    private _ever_obtained: Set<string> = $state(new Set());
    private _pending_dp = $state(0);

    get inventory() { return this._inventory; }
    get equipped() { return this._equipped; }
    get ever_obtained(): ReadonlySet<string> { return this._ever_obtained; }
    get pending_dp() { return this._pending_dp; }

    flush_pending_dp(): number {
        const dp = this._pending_dp;
        this._pending_dp = 0;
        return dp;
    }

    get_owned(equip_id: string): OwnedEquip | undefined {
        return this._inventory.get(equip_id);
    }

    get_all_equipped(): OwnedEquip[] {
        return (Object.values(this._equipped) as (string | null)[])
            .filter((id): id is string => id !== null)
            .map(id => this._inventory.get(id)!)
            .filter(Boolean);
    }

    get_equipped_in_slot(slot: EquipSlotKey): OwnedEquip | null {
        const id = this._equipped[slot];
        return id ? this._inventory.get(id) ?? null : null;
    }

    receive_equipment(equip_id: string, rolled_rarity: Rarity): void {
        const def = EQUIP_REGISTRY.get(equip_id);
        if (!def) return;

        this._ever_obtained.add(equip_id);

        const dp = EQUIP_CONFIG.dupe_exp[rolled_rarity];
        this._pending_dp += dp;

        const existing = this._inventory.get(equip_id);
        if (!existing) {
            this._inventory.set(equip_id, {
                equip_id,
                rarity: rolled_rarity,
                level: 1,
                exp: 0,
            });
            history.addSystemLog(`New equipment obtained: ${def.name} (${rolled_rarity})!`);
            return;
        }

        const existing_idx = rarity_index(existing.rarity);
        const new_idx = rarity_index(rolled_rarity);

        if (new_idx > existing_idx) {
            existing.rarity = rolled_rarity;
            history.addSystemLog(`${def.name} rarity upgraded to ${rolled_rarity}!`);
            this.recalculate_equip_stats();
        } else {
            const exp_gain = EQUIP_CONFIG.dupe_exp[rolled_rarity];
            this._add_exp(existing, exp_gain);
            history.addSystemLog(`${def.name} (+${exp_gain} EXP)`);
        }
    }

    equip(equip_id: string, slot: EquipSlotKey): boolean {
        const item = this._inventory.get(equip_id);
        if (!item) return false;

        const def = EQUIP_REGISTRY.get(equip_id);
        if (!def) return false;

        if (SLOT_TO_EQUIP_SLOT[slot] !== def.slot) return false;

        // Unequip whatever is in that slot first
        this._equipped[slot] = equip_id;
        this.recalculate_equip_stats();
        return true;
    }

    unequip(slot: EquipSlotKey): void {
        this._equipped[slot] = null;
        this.recalculate_equip_stats();
    }

    recalculate_equip_stats(): void {
        for (const key of BASIC_STATS) {
            stat_list[key].equip_base = 0;
            stat_list[key].equip_multi = 0;
        }

        for (const item of this.get_all_equipped()) {
            const def = EQUIP_REGISTRY.get(item.equip_id);
            if (!def) continue;

            const resolved = resolve_equip(def, item.rarity);

            for (const bonus of resolved.stat_bonuses) {
                const value = effective_bonus(bonus, item.level, resolved.stat_mult);
                if (bonus.target === 'base') {
                    stat_list[bonus.stat].equip_base += value;
                } else {
                    stat_list[bonus.stat].equip_multi += value;
                }
            }
        }
    }

    private _add_exp(item: OwnedEquip, amount: number): void {
        if (item.level >= EQUIP_CONFIG.level_cap) return;

        const def = EQUIP_REGISTRY.get(item.equip_id);
        item.exp += amount;

        let leveled = false;
        while (item.level < EQUIP_CONFIG.level_cap) {
            const needed = exp_to_next_level(item.level);
            if (item.exp < needed) break;
            item.exp -= needed;
            item.level++;
            leveled = true;
        }

        if (item.level >= EQUIP_CONFIG.level_cap) {
            item.exp = 0;
        }

        if (leveled && def) {
            history.addSystemLog(`${def.name} leveled up to Lv.${item.level}!`);
            this.recalculate_equip_stats();
        }
    }

    has_in_current_run(equip_id: string): boolean {
        return this._inventory.has(equip_id);
    }

    reset_for_rebirth(): void {
        this._inventory.clear();
        this._pending_dp = 0;
        for (const slot of Object.keys(this._equipped) as EquipSlotKey[]) {
            this._equipped[slot] = null;
        }
        this.recalculate_equip_stats();
    }

    serialize() {
        return {
            inventory: Array.from(this._inventory.values()),
            equipped: { ...this._equipped },
            ever_obtained: Array.from(this._ever_obtained),
            pending_dp: this._pending_dp,
        };
    }

    deserialize(data: unknown): void {
        if (!data || typeof data !== 'object') return;
        const d = data as {
            inventory?: unknown;
            equipped?: unknown;
            ever_obtained?: unknown;
            pending_dp?: unknown;
        };

        this._inventory = new Map();
        this._equipped = empty_slots();
        this._ever_obtained = new Set();
        this._pending_dp = typeof d.pending_dp === 'number' ? d.pending_dp : 0;

        if (Array.isArray(d.inventory)) {
            for (const raw of d.inventory) {
                if (!raw || typeof raw !== 'object') continue;
                const item = raw as Partial<OwnedEquip>;
                if (typeof item.equip_id !== 'string') continue;
                if (!EQUIP_REGISTRY.has(item.equip_id)) continue;
                const rarity = item.rarity;
                if (rarity !== 'N' && rarity !== 'R' && rarity !== 'SR' && rarity !== 'UR') continue;
                this._inventory.set(item.equip_id, {
                    equip_id: item.equip_id,
                    rarity,
                    level: typeof item.level === 'number' ? item.level : 1,
                    exp: typeof item.exp === 'number' ? item.exp : 0,
                });
            }
        }

        if (Array.isArray(d.ever_obtained)) {
            for (const id of d.ever_obtained) {
                if (typeof id === 'string') this._ever_obtained.add(id);
            }
        }

        if (d.equipped && typeof d.equipped === 'object') {
            const eq = d.equipped as Record<string, unknown>;
            for (const slot of Object.keys(this._equipped) as EquipSlotKey[]) {
                const id = eq[slot];
                if (typeof id === 'string' && this._inventory.has(id)) {
                    this._equipped[slot] = id;
                }
            }
        }

        this.recalculate_equip_stats();
    }
}

export const EquipM = new EquipmentManager();
