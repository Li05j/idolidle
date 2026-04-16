import { DREAM_REGISTRY, ALL_DREAM_UPGRADES, upgrade_cost } from '$lib/data/dreams';
import type { DreamUpgradeDef, DreamUpgradeCategory } from '$lib/data/dreams';
import { Rebirth } from '$lib/state/rebirth.svelte';
import type { BasicStats } from '$lib/types';

const MATH: Record<DreamUpgradeCategory, (per_level: number, lvl: number) => number> = {
    time_reduction: (p, l) => (1 - p) ** l,
    stat_base:      (p, l) => p * l,
    stat_multi:     (p, l) => p * l,
    equip_drop:     (p, l) => (1 + p) ** l,
};

const FORMAT: Record<DreamUpgradeCategory, (value: number) => string> = {
    time_reduction: v => `-${((1 - v) * 100).toFixed(1)}%`,
    stat_base:      v => `+${v.toFixed(1)}`,
    stat_multi:     v => `+${v.toFixed(2)}`,
    equip_drop:     v => `x${v.toFixed(2)}`,
};

class DreamUpgradeState {
    private _levels: Record<string, number> = $state(
        Object.fromEntries(ALL_DREAM_UPGRADES.map(u => [u.id, 0]))
    );

    level(id: string): number {
        return this._levels[id] ?? 0;
    }

    maxed(id: string): boolean {
        const def = DREAM_REGISTRY.get(id)!;
        return this.level(id) >= def.max_level;
    }

    cost(id: string): number {
        return upgrade_cost(DREAM_REGISTRY.get(id)!, this.level(id));
    }

    can_purchase(id: string): boolean {
        return !this.maxed(id) && Rebirth.rebirth_points >= this.cost(id);
    }

    purchase(id: string): boolean {
        if (!this.can_purchase(id)) return false;
        Rebirth.deduct_points(this.cost(id));
        this._levels[id]++;
        return true;
    }

    /** Compute the current effective value for an upgrade from its category + level. */
    value(id: string): number {
        const def = DREAM_REGISTRY.get(id)!;
        return MATH[def.category](def.effect_per_level, this.level(id));
    }

    // --- Named getters ---

    get location_time_mult(): number { return this.value('time_location'); }
    get training_time_mult(): number { return this.value('time_training'); }
    get earning_time_mult(): number  { return this.value('time_earning'); }
    get equip_drop_mult(): number    { return this.value('equip_drop_rate'); }

    stat_base_bonus(stat: BasicStats): number {
        return this.value(`base_${stat.toLowerCase()}`);
    }

    stat_multi_bonus(stat: BasicStats): number {
        return this.value(`multi_${stat.toLowerCase()}`);
    }

    /** Format current effect for display */
    effect_text(def: DreamUpgradeDef): string {
        if (this.level(def.id) === 0) return 'None';
        return FORMAT[def.category](this.value(def.id));
    }
}

export const Dreams = new DreamUpgradeState();
