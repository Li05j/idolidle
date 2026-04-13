import { DREAM_REGISTRY, ALL_DREAM_UPGRADES, upgrade_cost } from '$lib/data/dreams';
import type { DreamUpgradeDef } from '$lib/data/dreams';
import { Rebirth } from '$lib/state/rebirth.svelte';
import type { BasicStats } from '$lib/types';

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

    // --- Computed bonuses ---

    get location_time_mult(): number {
        return (1 - 0.01) ** this.level('time_location');
    }

    get training_time_mult(): number {
        return (1 - 0.01) ** this.level('time_training');
    }

    get earning_time_mult(): number {
        return (1 - 0.01) ** this.level('time_earning');
    }

    stat_base_bonus(stat: BasicStats): number {
        return 2.0 * this.level(`base_${stat.toLowerCase()}`);
    }

    stat_multi_bonus(stat: BasicStats): number {
        return 0.01 * this.level(`multi_${stat.toLowerCase()}`);
    }

    get equip_drop_mult(): number {
        return 1.1 ** this.level('equip_drop_rate');
    }

    /** Format current effect for display */
    effect_text(def: DreamUpgradeDef): string {
        const lvl = this.level(def.id);
        if (lvl === 0) return 'None';
        switch (def.category) {
            case 'time_reduction': {
                const pct = (1 - (1 - def.effect_per_level) ** lvl) * 100;
                return `-${pct.toFixed(1)}%`;
            }
            case 'stat_base':
                return `+${(def.effect_per_level * lvl).toFixed(1)}`;
            case 'stat_multi':
                return `+${(def.effect_per_level * lvl).toFixed(2)}`;
            case 'equip_drop': {
                const mult = (1 + def.effect_per_level) ** lvl;
                return `x${mult.toFixed(2)}`;
            }
        }
    }
}

export const Dreams = new DreamUpgradeState();
