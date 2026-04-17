import type { BasicStats, LiveBattleStats } from '$lib/types';

export type EquipSlot = 'hat' | 'top' | 'bottom' | 'shoes' | 'accessory';
export type Rarity = 'N' | 'R' | 'SR' | 'UR';
export type BattleTrigger = 'live_start' | 'turn_start' | 'before_taking_dmg';

export const EQUIP_CONFIG = {
    rarity_stat_mult: { N: 1.0, R: 1.5, SR: 2.5, UR: 4.0 } as Record<Rarity, number>,
    rarity_color: { N: '#8C7A7D', R: '#16a34a', SR: '#9333ea', UR: '#dc2626' } as Record<Rarity, string>,
    dupe_exp: { N: 1, R: 5, SR: 10, UR: 20 } as Record<Rarity, number>,
    exp_per_level: 10,
    level_cap: 5,
    rarity_weights: { N: 0.88, R: 0.10, SR: 0.018, UR: 0.002 } as Record<Rarity, number>,
    level_bonus_per_level: 0.2,
};

export type EquipStatBonus = {
    stat: BasicStats;
    base_value: number;
    target: 'base' | 'multi';
};

export type SkillContext = {
    you: LiveBattleStats;
    rival: LiveBattleStats;
    /** Resolved skill values (taken from the rarity-merged skill). */
    values: Record<string, number>;
    /** Set to reduce incoming damage by this fraction (0-1). Only meaningful for before_taking_dmg. */
    set_dmg_reduction?: (amount: number) => void;
    /** Apply a temporary stat buff that reverts after the current attack resolves. */
    apply_temp_buff?: (who: 'you' | 'rival', stat: keyof LiveBattleStats, new_value: number) => void;
    /** The attack type being performed. Only available during before_taking_dmg. */
    atk_type?: 'Sing' | 'Dance';
    /** Register a callback that runs after the current attack resolves. Receives fans_stolen (0 = blocked). */
    on_after_attack?: (callback: (fans_stolen: number) => void) => void;
};

/**
 * Equipment active skill. Each skill fires at most once per battle.
 *
 * Execution order in fire_skills():
 *   1. trigger match → 2. condition(ctx) → 3. chance roll → 4. effect(ctx)
 *
 * - condition: gate that decides whether the skill activates (checked BEFORE chance roll).
 */
export type EquipSkillDef = {
    name: string;
    /** Battle events that can trigger this skill. */
    triggers: BattleTrigger[];
    /** Activation probability (0-1). Rolled after condition check. */
    chance: number;
    /** Skill parameters consumed by cond_string / eff_string / condition / effect. */
    values?: Record<string, number>;
    /** Human-readable condition. String or function of resolved values. */
    cond_string: string | ((v: Record<string, number>) => string);
    /** Human-readable effect. String or function of resolved values. */
    eff_string: string | ((v: Record<string, number>) => string);
    /** Gate function — return true to activate. Don't mutate stats here. */
    condition: (ctx: SkillContext) => boolean;
    /** Gameplay mutation. Use ctx helpers or mutate ctx.you / ctx.rival directly. */
    effect: (ctx: SkillContext) => void;
};

/**
 * The per-rarity body of an equipment. `N` is mandatory baseline; higher rarities
 * supply a partial body that REPLACES individual fields wholesale (no array merging).
 *
 * - Omit a field at R/SR/UR to inherit from N.
 * - Set `skill: null` to explicitly remove N's skill at that rarity.
 * - Omit `stat_mult` to fall back to `EQUIP_CONFIG.rarity_stat_mult[rarity]`.
 */
export type VariantBody = {
    stat_bonuses: EquipStatBonus[];
    skill?: EquipSkillDef | null;
    stat_mult?: number;
};

export type EquipDef = {
    id: string;
    name: string;
    slot: EquipSlot;
    desc: string;
    variants: { N: VariantBody } & Partial<Record<Exclude<Rarity, 'N'>, Partial<VariantBody>>>;
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
    skill: EquipSkillDef | null;
    stat_mult: number;
};

export function resolve_equip(def: EquipDef, rarity: Rarity): ResolvedEquip {
    const base = def.variants.N;
    const overlay = rarity === 'N' ? undefined : def.variants[rarity];
    const merged: VariantBody = overlay ? { ...base, ...overlay } : base;
    return {
        stat_bonuses: merged.stat_bonuses,
        skill: merged.skill ?? null,
        stat_mult: merged.stat_mult ?? EQUIP_CONFIG.rarity_stat_mult[rarity],
    };
}

export function resolve_skill_string(
    str: string | ((v: Record<string, number>) => string),
    values: Record<string, number>,
): string {
    return typeof str === 'function' ? str(values) : str;
}
