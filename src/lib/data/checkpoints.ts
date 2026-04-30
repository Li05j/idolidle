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

export type RivalDef = {
    name: string;
    /** Short identity tag, e.g. "Your childhood friend". */
    title: string;
    /** Narrative body. Persona-agnostic — persona may reroll between dreams. */
    bio: string;
    /** Optional in-character line. */
    quote?: string;
    scale: RivalScale;
};

export type CheckpointDef = {
    time: number;
    multi: number;
    /** Omit for terminal checkpoints (no LIVE battle). */
    rival?: RivalDef;
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
    {
        time: 1000, multi: 1.0,
        rival: {
            name: 'Bubbles',
            title: 'Your childhood friend',
            bio: 'You two used to eat from the same plate, wear the same dresses, walk to school side by side. Now she stands across the stage, facing you, questioning your determination.',
            quote: 'Please, give up and stay. The Idol industry is harsh, you can never make it. Just... stay with me at home.',
            scale: { stat_multi: 1, fan_multi: 1, equip_budget: 3 },
        },
    },
    {
        time: 2500, multi: 1.0,
        rival: {
            name: 'Buttercup',
            title: 'President of the school Idol Club',
            bio: 'She runs the school Idol Club like a fiefdom. Every performance, every spotlight, every freshman with stars in their eyes pays tribute. Then you opened your own club across the hall. Word travels fast. And now, she came to collect.',
            quote: 'A second Idol Club? In MY school? I own every stage you are standing on. Walk off it now, or I drag you off in front of everyone.',
            scale: { stat_multi: 5, fan_multi: 6, equip_budget: 9 },
        },
    },
    {
        time: 4000, multi: 1.0,
        rival: {
            name: 'Blossom',
            title: 'The reigning idol of this town',
            bio: 'The undisputed star of the town. She headlines the summer festivals, the shopping arcades, the local radio. Every flyer on every telephone pole has her face on it, twice. Nothing rises here without her permission, but you.',
            quote: 'Everyone claps for you here. They clapped for me too, loud enough that I believed it. So I went outside, out of this town. It was... freezing. So I came back. You will too. They always come back.',
            scale: { stat_multi: 13, fan_multi: 15, equip_budget: 27 },
        },
    },
    {
        time: 4000, multi: 1.0,
        rival: {
            name: 'Mystery',
            title: 'A rival who came out of nowhere',
            bio: 'Nobody knows where she trained or who she is. She just showed up, and now she is in your way.',
            scale: { stat_multi: 25, fan_multi: 29, equip_budget: 81 },
        },
    },
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
