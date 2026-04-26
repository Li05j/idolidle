import type { LiveBattleStats } from '$lib/types';
import type { Persona, StatWeights } from './rivals/personas';

type StatRange = [number, number];

type BaseRanges = {
    fans: StatRange;
    stamina: StatRange;
    haste: StatRange;
    sing: StatRange;
    dance: StatRange;
    charm: StatRange;
    presence: StatRange;
};

export type RivalScale = {
    stat_multi: number;
    /** Defaults to stat_multi if omitted. */
    fan_multi?: number;
    equip_budget: number;
};

export type CheckpointDef = {
    time: number;
    multi: number;
    /** Omit for terminal checkpoints (no LIVE battle). */
    rival?: RivalScale;
};

const BASE: BaseRanges = {
    fans:     [20, 40],
    stamina:  [30, 50],
    haste:    [10, 16],
    sing:     [10, 16],
    dance:    [10, 16],
    charm:    [10, 16],
    presence: [10, 16],
};

export const CHECKPOINTS: CheckpointDef[] = [
    { time: 1000, multi: 1.0, rival: { stat_multi: 1,  fan_multi: 1,  equip_budget: 3  } },
    { time: 2500, multi: 1.0, rival: { stat_multi: 5,  fan_multi: 6,  equip_budget: 9  } },
    { time: 4000, multi: 1.0, rival: { stat_multi: 13, fan_multi: 15, equip_budget: 27 } },
    { time: 6500, multi: 1.0, rival: { stat_multi: 25, fan_multi: 29, equip_budget: 81 } },
    { time: Infinity, multi: 1.0 },
];

function rollRange([min, max]: StatRange, scale: number): number {
    return (Math.random() * (max - min) + min) * scale;
}

export function generateRivalStats(persona: Persona, scale: RivalScale): LiveBattleStats {
    const w: StatWeights = persona.weights;
    const sm = scale.stat_multi;
    const fm = scale.fan_multi ?? scale.stat_multi;

    const stamina = rollRange(BASE.stamina, w.stamina * sm);

    return {
        Fans:         rollRange(BASE.fans,     w.fans     * fm),
        Max_Stamina:  stamina,
        Curr_Stamina: stamina,
        Haste:        rollRange(BASE.haste,    w.haste    * sm),
        Sing:         rollRange(BASE.sing,     w.sing     * sm),
        Dance:        rollRange(BASE.dance,    w.dance    * sm),
        Charm:        rollRange(BASE.charm,    w.charm    * sm),
        Presence:     rollRange(BASE.presence, w.presence * sm),
        Style:        0,
    };
}
