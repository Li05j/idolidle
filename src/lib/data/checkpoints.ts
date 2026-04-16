import type { LiveBattleStats } from '$lib/types';

type StatRange = [number, number];

export type RivalTemplate = {
    fans: StatRange;
    stamina: StatRange;
    haste: StatRange;
    sing: StatRange;
    dance: StatRange;
    charm: StatRange;
    presence: StatRange;
};

export type CheckpointDef = {
    time: number;
    multi: number;
    /** Omit for terminal checkpoints (no LIVE battle). */
    rival?: RivalTemplate;
};

const BASE: RivalTemplate = {
    fans:     [20, 32],
    stamina:  [30, 48],
    haste:    [5, 20],
    sing:     [10, 16],
    dance:    [10, 16],
    charm:    [8, 15],
    presence: [8, 15],
};

function scaleTemplate(base: RivalTemplate, multi: number, fanMulti: number = multi): RivalTemplate {
    return {
        fans:     [base.fans[0] * fanMulti, base.fans[1] * fanMulti],
        stamina:  [base.stamina[0] * multi, base.stamina[1] * multi],
        haste:    [base.haste[0] * multi, base.haste[1] * multi],
        sing:     [base.sing[0] * multi, base.sing[1] * multi],
        dance:    [base.dance[0] * multi, base.dance[1] * multi],
        charm:    [base.charm[0] * multi, base.charm[1] * multi],
        presence: [base.presence[0] * multi, base.presence[1] * multi],
    };
}

export const CHECKPOINTS: CheckpointDef[] = [
    { time: 1000,     multi: 1.0, rival: BASE },
    { time: 2500,     multi: 1.0, rival: scaleTemplate(BASE, 5, 6) },
    { time: 4000,     multi: 1.0, rival: scaleTemplate(BASE, 12, 14) },
    { time: Infinity, multi: 1.0 },
];

const MIN_STAT_PERCENT = 0.5;

export function generateRivalStats(template: RivalTemplate): LiveBattleStats {
    const ranges = [
        template.fans, template.stamina, template.haste,
        template.sing, template.dance, template.charm, template.presence,
    ];

    const minPossible = ranges.reduce((sum, [min]) => sum + min, 0);
    const maxPossible = ranges.reduce((sum, [, max]) => sum + max, 0);
    const threshold = MIN_STAT_PERCENT * (minPossible + maxPossible);

    const roll = ranges.map(([min, max]) => Math.random() * (max - min) + min);
    const rollSum = roll.reduce((sum, v) => sum + v, 0);
    const deficit = threshold - rollSum;

    if (deficit > 0) {
        let budget = deficit;
        for (let i = 0; i < roll.length && budget > 0; i++) {
            const gap = ranges[i][1] - roll[i];
            const add = Math.min(budget, gap);
            roll[i] += add;
            budget -= add;
        }
    }

    return {
        Fans:         roll[0],
        Max_Stamina:  roll[1],
        Curr_Stamina: roll[1],
        Haste:        roll[2],
        Sing:         roll[3],
        Dance:        roll[4],
        Charm:        roll[5],
        Presence:     roll[6],
    };
}
