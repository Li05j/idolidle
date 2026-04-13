import type { BasicStats } from '$lib/types';

export type DreamUpgradeCategory = 'time_reduction' | 'stat_base' | 'stat_multi' | 'equip_drop';

export type DreamUpgradeDef = {
    id: string;
    name: string;
    desc: string;
    max_level: number;
    effect_per_level: number;
    base_cost: number;
    cost_scaling?: number; // default 1.25
    category: DreamUpgradeCategory;
    stat?: BasicStats;
};

const DEFAULT_COST_SCALING = 1.25;

export function upgrade_cost(def: DreamUpgradeDef, current_level: number): number {
    const scaling = def.cost_scaling ?? DEFAULT_COST_SCALING;
    return Math.floor(def.base_cost * scaling ** current_level);
}
