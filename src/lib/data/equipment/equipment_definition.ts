import type { BasicStats, LiveBattleStats } from '$lib/types';

export type EquipSlot = 'hat' | 'top' | 'bottom' | 'shoes' | 'accessory';
export type Rarity = 'N' | 'R' | 'SR' | 'UR';
export type BattleTrigger = 'live_start' | 'turn_start' | 'before_taking_dmg';

export type EquipStatBonus = {
    stat: BasicStats;
    base_value: number;
    target: 'base' | 'multi';
};

export type SkillContext = {
    you: LiveBattleStats;
    rival: LiveBattleStats;
    /** Set to reduce incoming damage by this fraction (0-1). Only meaningful for before_taking_dmg. */
    set_dmg_reduction?: (amount: number) => void;
};

export type EquipSkillDef = {
    name: string;
    triggers: BattleTrigger[];
    chance: number;
    cond_string: string;
    eff_string: string;
    condition: (ctx: SkillContext) => boolean;
    effect: (ctx: SkillContext) => void;
};

export type EquipDef = {
    id: string;
    name: string;
    slot: EquipSlot;
    desc: string;
    stat_bonuses: EquipStatBonus[];
    skill?: EquipSkillDef;
    rarity_stat_mult_override?: Partial<Record<Rarity, number>>;
};

export type EquipDropEntry = {
    equip_id: string;
    weight: number;
};

export type EquipDropTable = {
    chance: number;
    table: EquipDropEntry[];
};

export const EQUIP_CONFIG = {
    rarity_stat_mult: { N: 1.0, R: 1.5, SR: 2.5, UR: 4.0 } as Record<Rarity, number>,
    rarity_color: { N: 'white', R: 'green', SR: 'yellow', UR: 'red' } as Record<Rarity, string>,
    dupe_exp: { N: 1, R: 5, SR: 10, UR: 20 } as Record<Rarity, number>,
    exp_per_level: 10,
    level_cap: 20,
    rarity_weights: { N: 0.88, R: 0.10, SR: 0.018, UR: 0.002 } as Record<Rarity, number>,
    level_bonus_per_level: 0.1,
};

export const RARITY_ORDER: Rarity[] = ['N', 'R', 'SR', 'UR'];

export function rarity_index(r: Rarity): number {
    return RARITY_ORDER.indexOf(r);
}

export function exp_to_next_level(level: number): number {
    return level * EQUIP_CONFIG.exp_per_level;
}

export function effective_bonus(bonus: EquipStatBonus, level: number, rarity: Rarity, def?: EquipDef): number {
    const mult = def?.rarity_stat_mult_override?.[rarity] ?? EQUIP_CONFIG.rarity_stat_mult[rarity];
    return bonus.base_value * mult * (1 + EQUIP_CONFIG.level_bonus_per_level * (level - 1));
}
