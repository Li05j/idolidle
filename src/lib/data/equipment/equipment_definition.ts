import type { BasicStats } from '$lib/types';
import { SKILL_REGISTRY } from '$lib/data/skills/skill_table';
import type { SkillDef } from '$lib/data/skills/skill_definition';

export type {
    BattleTrigger,
    SkillOwner,
    SkillContext,
    SkillDef,
} from '$lib/data/skills/skill_definition';
export {
    render_skill_string,
    resolve_skill_string,
} from '$lib/data/skills/skill_definition';

export type EquipSlot = 'hat' | 'top' | 'bottom' | 'shoes' | 'accessory';
export type Rarity = 'N' | 'R' | 'SR' | 'UR';

export const EQUIP_CONFIG = {
    rarity_stat_mult: { N: 1.0, R: 2.0, SR: 3.0, UR: 4.5 } as Record<Rarity, number>,
    rarity_color: { N: '#8C7A7D', R: '#16a34a', SR: '#9333ea', UR: '#dc2626' } as Record<Rarity, string>,
    dupe_exp: { N: 1, R: 3, SR: 10, UR: 30 } as Record<Rarity, number>,
    exp_per_level: 5,
    level_cap: 5,
    rarity_weights: { N: 0.88, R: 0.10, SR: 0.018, UR: 0.002 } as Record<Rarity, number>,
    level_bonus_per_level: 1.0,
};

export type EquipStatBonus = {
    stat: BasicStats;
    base_value: number;
    target: 'base' | 'multi';
};

/**
 * The per-rarity body of an equipment. `N` is mandatory baseline; higher rarities
 * supply a partial body that REPLACES individual fields wholesale (no array merging).
 *
 * - Omit a field at R/SR/UR to inherit from N.
 * - Set `skill_id: null` to explicitly remove N's skill at that rarity.
 * - Omit `stat_mult` to fall back to `EQUIP_CONFIG.rarity_stat_mult[rarity]`.
 */
export type VariantBody = {
    stat_bonuses: EquipStatBonus[];
    skill_id?: string | null;
    stat_mult?: number;
};

export type EquipDef = {
    id: string;
    name: string;
    slot: EquipSlot;
    desc: string;
    variants: { N: VariantBody } & Partial<Record<Exclude<Rarity, 'N'>, Partial<VariantBody>>>;
};

export type RivalEquipEntry = {
    equip_id: string;
    rarity: Rarity;
    level: number;
};

export type EquipDropEntry = {
    equip_id: string;
    weight: number;
};

export type EquipDropTable = {
    chance: number;
    table: EquipDropEntry[];
};

export const RARITY_ORDER: Rarity[] = ['N', 'R', 'SR', 'UR'];

export function rarity_index(r: Rarity): number {
    return RARITY_ORDER.indexOf(r);
}

export function exp_to_next_level(level: number): number {
    return level * EQUIP_CONFIG.exp_per_level;
}

export function effective_bonus(bonus: EquipStatBonus, level: number, stat_mult: number): number {
    return bonus.base_value * stat_mult * (1 + EQUIP_CONFIG.level_bonus_per_level * (level - 1));
}

export type ResolvedEquip = {
    stat_bonuses: EquipStatBonus[];
    skill: SkillDef | null;
    stat_mult: number;
};

export function resolve_equip(def: EquipDef, rarity: Rarity): ResolvedEquip {
    const base = def.variants.N;
    const overlay = rarity === 'N' ? undefined : def.variants[rarity];
    const merged: VariantBody = overlay ? { ...base, ...overlay } : base;
    const skill_id = merged.skill_id ?? null;
    return {
        stat_bonuses: merged.stat_bonuses,
        skill: skill_id ? SKILL_REGISTRY.get(skill_id) ?? null : null,
        stat_mult: merged.stat_mult ?? EQUIP_CONFIG.rarity_stat_mult[rarity],
    };
}
